---
sidebar_position: 1
description: "Edge Functions de Supabase con Flutter: qué es una función en la nube y en qué se parece (y se diferencia) de AWS Lambda, cuándo usarla frente a RLS o a la app, cómo crear y desplegar una función desde el panel (resumen-contactos), cómo se protege, qué revisar al configurarla y cómo llamarla con functions.invoke."
---

# Edge Functions: código en la nube con Supabase

La agenda ya tiene datos (**Database**), usuarios (**Auth**) y fotos (**Storage**). En los tres casos la app habla **directo** con Supabase y las reglas las ponen las políticas RLS. Pero hay cosas que **no conviene hacer en la app**: un cálculo que obliga a descargar todos los datos, una regla que el usuario no debe poder saltarse, una llave privada de otro servicio. Para eso existen las **Edge Functions**: pequeños programas que viven en la nube y que tu app llama cuando los necesita.

En esta sesión cubriremos:
* Qué es una **Edge Function**, en qué se parece a **AWS Lambda** y en qué no.
* Cuándo usarla en vez de **RLS** o de la app.
* **Crear y desplegar** una función desde el panel, sin instalar nada: `resumen-contactos`.
* Quién puede llamarla: los **modos de autenticación** y por qué una llamada sin sesión recibe un 401.
* Qué **revisar al configurarla** dentro de Supabase.
* **Llamarla desde Flutter** con `functions.invoke` y capturar sus errores.
* Las **ventajas y los costos** de mover lógica a una función.

---

## 1. ¿Qué es una Edge Function?

Una **Edge Function** es un programa pequeño, escrito en **TypeScript** y ejecutado por **Deno**, que Supabase despliega en servidores repartidos por el mundo («el borde», *edge*). No hay servidor que administrar: la función **no está corriendo todo el tiempo**; se ejecuta cuando alguien hace una petición HTTPS a su URL:

```text
https://<tu-proyecto>.supabase.co/functions/v1/<nombre-de-la-función>
```

| Módulo | Qué hace | Cómo lo usa la app |
|---|---|---|
| **Database** | Guarda los datos | `from('contactos').select()` |
| **Auth** | Identifica al usuario | `auth.signInWithPassword()` |
| **Storage** | Guarda archivos | `storage.from('fotos').uploadBinary()` |
| **Edge Functions** | **Ejecuta tu código** en la nube | `functions.invoke('resumen-contactos')` |

:::info[Arranque en frío]
Como la función no está encendida permanentemente, la **primera llamada** después de un rato sin uso puede tardar un poco más que las siguientes. En una agenda de clase casi no se nota; en un sistema con mucho tráfico, sí se mide.
:::

### 1.1. ¿Es lo mismo que AWS Lambda?

**La idea es la misma, el producto no.** Tanto una Edge Function como una **función de AWS Lambda** son «funciones como servicio» (*serverless*): tú escribes el código, el proveedor lo ejecuta bajo demanda y cobra (o descuenta de tu cuota) por ejecución. Lo que cambia es **cuánto controlas y cuánto te dan hecho**:

| | **AWS Lambda** | **Edge Function de Supabase** |
|---|---|---|
| Lenguajes | Muchos (Node.js, Python, Java, Go, .NET…) | **TypeScript / JavaScript** sobre Deno |
| Dónde corre | En la **región** de AWS que elijas | **Repartida por el mundo**, cerca de quien llama |
| Cómo se llama | Necesitas exponerla (API Gateway o una URL de función) | **Ya tiene URL**: `/functions/v1/<nombre>` |
| Quién puede llamarla | Lo configuras con **IAM** y políticas | Se declara en el código: **JWT de usuario**, llave, o nadie (sección 5) |
| Acceso a tus datos | Tú conectas con la base de datos | Trae un **cliente de Supabase ya configurado** (`ctx`) |
| Configuración | Mucha: memoria, tiempos, red, permisos | **Poca**: nombre, secretos y un par de interruptores |
| Para qué sirve más | Cualquier cosa dentro del ecosistema de AWS | Lógica **pegada a tu proyecto Supabase** |

En corto: Lambda te da **más control y más piezas que armar**; una Edge Function te da **menos control y mucho hecho**, porque ya conoce tu base de datos y tus usuarios.

---

## 2. ¿Cuándo usar una función?

No toda lógica necesita una función: cada una es **código que mantener, desplegar y vigilar**. Antes de crear una, hazle tres preguntas a tu requerimiento. Cada pestaña de la figura es un caso de la agenda:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-16/donde-va-la-logica/index.html"
  title="Árbol de decisión para ubicar una regla de la agenda: en la app, en una política RLS, en una Edge Function o con una consulta directa, aplicado a cinco requerimientos"
  height={600}
/>

Las ideas que deben quedar:

* Lo que **solo cambia lo que se ve** (deshabilitar un botón) va en la **app**.
* Lo que decide **quién ve o escribe qué fila** va en una **política RLS**: la base de datos la aplica sola.
* Lo que necesita **un secreto** (la llave de otro servicio) o **un cálculo sobre muchos datos** va en una **Edge Function**.
* Si nada de lo anterior aplica, basta la **consulta directa** con el SDK.

:::danger[Una validación solo en la app no protege nada]
Quien tenga tu URL y tu llave publishable puede llamar a la API **sin pasar por tu app**. Toda regla de negocio que deba cumplirse de verdad tiene que ejecutarse en un lugar que el cliente no controle.
:::

---

## 3. El ejemplo de hoy

Construiremos una función sobre la tabla `contactos` de la semana 14.

| Función | Qué hace | Para qué sirve el ejemplo |
|---|---|---|
| `resumen-contactos` | Cuenta los contactos **por dominio de correo** y responde un JSON pequeño. | El trabajo se hace en la nube y el teléfono solo recibe el resultado. |

Exige un **usuario con sesión**: la misma sesión que ya tiene la app desde la semana 15.

---

## 4. Crear la función: `resumen-contactos`

Todo se hace desde el panel, sin instalar la CLI.

1. Abre tu proyecto y ve a **Edge Functions**.
2. En **Via Editor** pulsa **Open Editor**.
3. Borra el código de la plantilla y pega el siguiente.
4. Cambia el nombre de la función a `resumen-contactos` (en la parte de abajo).
5. Pulsa **Deploy function**.

```ts title="resumen-contactos / index.ts"
import { withSupabase } from "npm:@supabase/server@1";

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    // ctx.supabase aplica las políticas RLS del usuario
    const { data, error } = await ctx.supabase
      .from("contactos").select("email");
    if (error) {
      return Response.json(
        { error: error.message }, { status: 400 });
    }

    // Agrupar por dominio: la cuenta se hace aquí
    const porDominio: Record<string, number> = {};
    for (const { email } of data) {
      const dominio =
        email.split("@")[1]?.toLowerCase() ?? "sin dominio";
      porDominio[dominio] = (porDominio[dominio] ?? 0) + 1;
    }

    return Response.json({ total: data.length, porDominio });
  }),
};
```

![Editor de Edge Functions de Supabase con el código de resumen-contactos](/img/seminario-de-i-d-i/semana-16/01-editor-resumen-contactos.png)

Lo que hace cada parte:

* `withSupabase({ auth: "user" }, …)` es un **envoltorio** que revisa **quién llama** antes de ejecutar tu código y te entrega un objeto `ctx` ya configurado.
* `ctx.supabase` es un cliente que actúa **como el usuario** que llamó: las políticas RLS de la semana 15 siguen aplicando. Si el usuario no puede ver una fila, la función tampoco.
* `Response.json(...)` arma la respuesta HTTP. Lo que devuelves es lo que recibe la app.

En unos segundos la función aparece en la lista, con su URL:

![Lista de Edge Functions del proyecto con resumen-contactos desplegada y su URL](/img/seminario-de-i-d-i/semana-16/03-lista-funciones.png)

:::warning[El editor del panel no guarda versiones]
Si cambias el código, pulsa **Deploy updates** y confirma: reemplaza la función publicada **y no hay vuelta atrás automática**. Para algo más serio que un ejercicio de clase, guarda el código en un repositorio y despliega con la CLI de Supabase.
:::

---

## 5. Quién puede llamarla

Una función tiene una URL pública, así que **tiene que decidir a quién atiende**. Eso lo declara `withSupabase` con la opción `auth`:

| Modo | Acepta | Cuándo |
|---|---|---|
| `"user"` | Un **JWT de usuario** (el de `signInWithPassword`) | Funciones que usa la app con sesión. **Es el de hoy.** |
| `"secret"` | La llave **secret** del proyecto | Otro servicio, un cron o un worker llamando a tu función. |
| `"publishable"` | La llave **publishable** | Funciones públicas que solo identifican al proyecto. |
| `"none"` | Cualquiera, sin revisar | Webhooks firmados por un tercero (la función verifica la firma). |

En la pestaña **Settings** de cada función hay además el interruptor **Verify JWT with legacy secret**: es una comprobación de la **plataforma**, antes de tu código. Con él activado, **la llave anónima también lo satisface**; por eso la función revisa por su cuenta con `auth: "user"` que quien llama sea una **persona** y no solo el proyecto.

Dentro de la función hay **dos clientes** de Supabase, y conviene no confundirlos:

| Cliente | Actúa como | ¿Respeta RLS? |
|---|---|---|
| `ctx.supabase` | El **usuario** que llamó | **Sí** |
| `ctx.supabaseAdmin` | El **proyecto** (llave secret) | **No**: se salta RLS |

:::danger[Con `supabaseAdmin`, filtra tú]
`ctx.supabaseAdmin` **no tiene red de seguridad**: una consulta sin filtro devuelve **las filas de todos los usuarios**. Úsalo solo cuando la regla lo necesite y prefiere `ctx.supabase` siempre que puedas. Por eso la función de hoy usa `ctx.supabase`.
:::

Puedes probar la función sin escribir la app. En la esquina superior derecha pulsa **Test** y envía la petición tal cual: el panel manda solo la llave, **sin sesión de usuario**.

![Panel Test de Supabase con la respuesta 401 de la función resumen-contactos: UNUSABLE_CREDENTIAL](/img/seminario-de-i-d-i/semana-16/02-prueba-sin-sesion-401.png)

La respuesta es un **401**, y el cuerpo lo explica:

```json title="Respuesta 401 de la función"
{
  "source": "@supabase/server",
  "code": "UNUSABLE_CREDENTIAL",
  "message": "[@supabase/server] The request carried a credential this endpoint cannot use: an apikey header, which no accepted auth mode reads. Accepted auth mode(s): \"user\".",
  "hint": "This endpoint authenticates a user, not a project — an API key can never satisfy it, whichever header it arrives in. Send: Authorization: Bearer <jwt> (for auth mode \"user\").",
  "details": {
    "acceptedAuthModes": ["user"],
    "received": { "authorization": "absent", "apikey": "publishable" }
  }
}
```

Fíjate en `received`: llegó una **apikey** (publishable) pero **ninguna `authorization`**, es decir, ningún usuario. Desde la app, esa misma petición funciona porque el SDK agrega el JWT de la sesión.

---

## 6. Qué revisar al configurarla

Antes de dar una función por terminada, recorre esta lista. Casi todos los problemas de una función desplegada salen de uno de estos puntos:

| Qué revisar | Dónde | Por qué importa |
|---|---|---|
| **El nombre** | Al crearla | Forma parte de la URL (`/functions/v1/<nombre>`) y es lo que escribe la app en `invoke('…')`. |
| **El modo de autenticación** | En el código (`auth: "user"`) | Decide **quién** puede llamarla. Sin él, cualquiera con la URL la ejecuta. |
| **Verify JWT** | **Settings** de la función | Es una comprobación de la plataforma; **no reemplaza** la tuya. |
| **Qué cliente usas** | `ctx.supabase` o `ctx.supabaseAdmin` | Uno respeta RLS y el otro no. |
| **Los secretos** | **Edge Functions → Secrets** | Las llaves de otros servicios **nunca** van en el código (sección 9). |
| **Cómo se despliega** | **Deploy function** / **Deploy updates** | El editor del panel no guarda versiones: un cambio reemplaza lo publicado. |
| **Los registros** | Pestaña **Logs** de la función | Es donde se ve por qué falló una llamada. |
| **Los límites de la API** | **Integrations → Data API → Settings** | **Max rows** (1000 por defecto) limita también lo que lee la función. |
| **El CORS** | Lo maneja `withSupabase` | Importa solo si la llamas desde un navegador (Flutter web). |

---

## 7. Llamarla desde Flutter

En la app no hay nada que configurar: la misma URL y llave publishable de la semana 14 sirven. Siguiendo la arquitectura de la semana 14, encapsulamos la llamada en el **servicio**, para que las pantallas no sepan que existe una función:

```dart title="lib/services/contacto_service.dart"
import 'package:supabase_flutter/supabase_flutter.dart';

class ContactoService {
  final _db = Supabase.instance.client;

  Future<Map<String, int>> resumenPorDominio() async {
    try {
      final res = await _db.functions
          .invoke('resumen-contactos');
      final datos = res.data as Map<String, dynamic>;
      return Map<String, int>.from(datos['porDominio']);
    } on FunctionException catch (e) {
      final d = e.details;
      throw Exception(d is Map
          ? (d['message'] ?? d['error'])
          : 'Sin conexión');
    }
  }
}
```

* `functions.invoke(nombre)` hace un `POST` a `/functions/v1/<nombre>` y agrega solo la llave y el JWT de la sesión.
* Si la función responde **2xx**, `res.data` trae el JSON ya decodificado.
* Si responde **otro código** (400, 401…), el SDK **lanza** `FunctionException` con `status` y el cuerpo en `details`. No devuelve un «dato de error»: hay que capturarla con `try/catch`.
* Si **no hay red**, `details` no es un mapa: por eso el `catch` comprueba `d is Map` antes de leer el mensaje.

Sigue una llamada completa. Cambia **Qué pasa** para ver los tres desenlaces; el código de la app y el de la función se resaltan en cada paso:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-16/del-boton-a-la-funcion/index.html"
  title="Recorrido de una llamada a la Edge Function resumen-contactos entre la app Flutter, la función y Postgres, con tres desenlaces: respuesta 200, sin sesión (401) y sin conexión"
  height={680}
/>

| Qué pasa | Qué ve la app | Cómo reaccionar |
|---|---|---|
| La función responde `200` | `res.data` con `total` y `porDominio` | Mostrar el resumen |
| `401` (sin sesión o sesión vencida) | `FunctionException`, estado 401 | Volver a la pantalla de ingreso |
| Sin conexión | `FunctionException` cuyo `details` no es un mapa | Avisar «sin conexión» y permitir reintentar |

---

## 8. Ventajas y costos

¿Qué ganamos al mover el resumen a una función? Compara el **mismo resumen** hecho de las dos maneras y mueve el deslizador:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-16/con-y-sin-funcion/index.html"
  title="Comparación entre contar los contactos en la app, descargando todas las filas, y hacerlo en una Edge Function que responde un JSON pequeño; un deslizador cambia el número de contactos"
  height={620}
/>

**Ventajas**

* **Menos datos por la red móvil.** El teléfono recibe el resultado, no todas las filas (la figura usa cifras aproximadas: ~110 bytes por fila).
* **Reglas que nadie se salta.** Lo que se ejecuta en el servidor no se puede modificar desde un cliente.
* **Secretos a salvo.** Las llaves privadas se guardan del lado del servidor, no dentro del instalador de la app.
* **Un solo lugar.** La lógica se escribe una vez y la usan la app móvil, la web y cualquier otro cliente.

**Costos**

* **Más piezas.** Cada función es código que desplegar, vigilar y mantener.
* **Más latencia.** Hay un salto de red adicional y, tras un rato sin uso, el arranque en frío.
* **Otra superficie de seguridad.** La función tiene su propia URL pública: hay que decidir a quién atiende (sección 5).

:::note[El tope de 1000 filas]
En **Integrations → Data API → Settings**, **Max rows** está en **1000**: la API devuelve como **máximo 1000 filas por consulta**, tanto a la app como a la función. Para una tabla de clase no importa; con miles de contactos el resumen de hoy saldría incompleto sin ningún error, y habría que paginar o agrupar con SQL.
:::

---

## 9. Secretos propios

Cuando una función necesita una llave privada (la de un servicio de correo, por ejemplo), **no la escribas en el código**. Se guarda como **secreto** en **Edge Functions → Secrets** y la función la lee del entorno:

![Sección Secrets de Edge Functions en Supabase, con el formulario para agregar un secreto y la lista de secretos propios vacía](/img/seminario-de-i-d-i/semana-16/04-secrets.png)

```ts title="Leer un secreto en la función"
// Ejemplo: la llave de un servicio externo, nunca dentro del código
const llave = Deno.env.get("RESEND_API_KEY");
```

La app **nunca ve** el secreto: solo llama a la función. Las llaves del propio proyecto (`SUPABASE_URL` y las llaves publishable y secret) ya están disponibles para la función sin que las configures: son las que `withSupabase` usa por dentro.

---

## 10. Errores frecuentes

| Síntoma | Causa probable | Qué revisar |
|---|---|---|
| `401` con `UNUSABLE_CREDENTIAL` | Llamaste **sin sesión** (o desde el panel **Test**), con `auth: "user"` | Inicia sesión en la app; el SDK agrega el JWT solo |
| `FunctionException` con estado `404` | El nombre en `invoke('…')` no coincide con el de la función, o no está desplegada | **Edge Functions**: nombre exacto y que aparezca en la lista |
| Cambié el código y la app sigue igual | El editor guarda borradores, pero no despliega | Pulsa **Deploy updates** y confirma |
| `500` apenas se llama, sin mensaje tuyo | Error de sintaxis o de importación al arrancar | Pestaña **Logs** de la función |
| `type 'Null' is not a subtype…` al usar `res.data` | La función respondió algo distinto a lo que el servicio espera | Revisa el JSON en **Test** y los nombres de los campos |
| El mensaje de error sale vacío sin internet | Sin red, `details` no es un mapa | Comprueba `d is Map`, como en el servicio |
| El resumen sale incompleto con muchos contactos | **Max rows** (1000 filas por consulta) | Sección 8: paginar o agrupar con SQL |

---

## Cuestionario de Autoevaluación

<Quiz id="seminario-s16-edge-functions-quiz">
  <Question title="¿Qué es una Edge Function de Supabase?">
    <Option>Una tabla especial de Postgres que guarda código.</Option>
    <Option>Una política RLS escrita en TypeScript.</Option>
    <Option correct>Un programa pequeño (TypeScript sobre Deno) que Supabase ejecuta en la nube, bajo demanda, cuando alguien llama a su URL.</Option>
    <Option>Un servidor que debes mantener encendido todo el tiempo.</Option>
  </Question>
  <Question title="¿En qué se parece una Edge Function a una función de AWS Lambda?">
    <Option>En que las dos usan IAM para decidir quién las llama.</Option>
    <Option>En que las dos corren siempre en la misma región que elijas.</Option>
    <Option correct>En que las dos son funciones serverless: tú escribes el código y el proveedor lo ejecuta bajo demanda, sin servidor que administrar.</Option>
    <Option>En que las dos aceptan cualquier lenguaje de programación.</Option>
  </Question>
  <Question title="Quieres que cada usuario vea solo los contactos que creó él. ¿Dónde va esa regla?">
    <Option>En la app Flutter, filtrando la lista antes de mostrarla.</Option>
    <Option correct>En una política RLS de la tabla: la base de datos la aplica en cada consulta.</Option>
    <Option>En una Edge Function que descargue todos los contactos y los filtre.</Option>
    <Option>En el archivo env.json de la app.</Option>
  </Question>
  <Question title="¿Por qué una regla de negocio que solo existe en la app no es suficiente?">
    <Option>Porque Flutter no puede ejecutar condiciones.</Option>
    <Option>Porque la regla en la app es más lenta.</Option>
    <Option correct>Porque quien conozca la URL y la llave publishable puede llamar a la API sin pasar por la app, saltándose esa regla.</Option>
    <Option>Porque Supabase borra los datos que el cliente valida.</Option>
  </Question>
  <Question title="¿Qué hace la opción auth con el valor user en withSupabase?">
    <Option>Acepta cualquier petición que lleve la llave publishable.</Option>
    <Option correct>Exige un JWT de usuario válido; si falta, responde 401 sin ejecutar tu código.</Option>
    <Option>Obliga a que el usuario sea administrador del proyecto.</Option>
    <Option>Desactiva las políticas RLS para esa función.</Option>
  </Question>
  <Question title="Dentro de una función, ¿cuál es la diferencia entre ctx.supabase y ctx.supabaseAdmin?">
    <Option>No hay diferencia: son dos nombres del mismo cliente.</Option>
    <Option>ctx.supabase solo lee y ctx.supabaseAdmin solo escribe.</Option>
    <Option correct>ctx.supabase actúa como el usuario y respeta RLS; ctx.supabaseAdmin usa la llave secret y se salta RLS.</Option>
    <Option>ctx.supabaseAdmin viaja en la app para que el usuario pueda borrar datos.</Option>
  </Question>
  <Question title="La función responde 401 porque el usuario no tiene sesión. ¿Qué recibe la app Flutter?">
    <Option>Un res.data con el campo error y la ejecución sigue normal.</Option>
    <Option>Un valor null en res.data.</Option>
    <Option correct>Una FunctionException con status 401 y el cuerpo en details, que hay que capturar con try/catch.</Option>
    <Option>Nada: el SDK reintenta hasta que la función responda 200.</Option>
  </Question>
  <Question title="¿Dónde se guarda la llave privada de un servicio externo que usa una función?">
    <Option>En una constante dentro del código de la app Flutter.</Option>
    <Option>En una columna de la tabla contactos.</Option>
    <Option correct>Como secreto en Edge Functions → Secrets, y la función la lee con Deno.env.get.</Option>
    <Option>En la llave publishable del proyecto.</Option>
  </Question>
</Quiz>
