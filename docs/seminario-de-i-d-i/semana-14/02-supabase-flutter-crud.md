---
sidebar_position: 2
description: "Conecta una app Flutter con Supabase: qué es, arquitectura con capa de servicio, llaves y variables de entorno, CRUD con PostgREST y estados de carga y error."
---

# Persistencia con Supabase

Hasta ahora los contactos de la agenda viven en una lista en memoria: al cerrar la app, desaparecen. Para que sobrevivan hace falta una **base de datos**, y para que varios dispositivos vean lo mismo, esa base de datos tiene que estar en un **servidor**. Construir ese servidor (API, seguridad, despliegue) es mucho trabajo; **Supabase** nos lo entrega hecho.

En esta sesión conectaremos la agenda con Supabase, cubriendo:
* Qué es Supabase y qué ofrece.
* La arquitectura de una app Flutter con Supabase: la **capa de servicio** como frontera entre la interfaz y la base de datos.
* Instalar el SDK, obtener las **llaves** del proyecto y guardarlas en variables de entorno.
* El **CRUD** por **PostgREST**: listar, ver el detalle, crear, editar y borrar.
* Los **estados de la interfaz** frente a una operación asíncrona: cargando y error.

---

## 1. ¿Qué es Supabase?

**Supabase** es una plataforma de *backend como servicio* (BaaS) de código abierto, construida sobre **Postgres**. Con un solo proyecto obtienes una base de datos relacional real y, alrededor de ella, el resto de piezas que una app necesita. Se suele presentar como la alternativa abierta a Firebase, con una diferencia de fondo: aquí los datos viven en **tablas SQL** y no en documentos.

| Qué ofrece | Para qué sirve |
|---|---|
| **Base de datos Postgres** | Tablas, relaciones, SQL, índices: una base de datos completa, no un almacén simplificado. |
| **API REST automática** | Cada tabla se expone por HTTP sin escribir un servidor: la genera **PostgREST** a partir del esquema. |
| **Autenticación** | Registro, inicio de sesión (correo, Google, GitHub…) y sesiones, integrados con la base de datos. |
| **Row Level Security (RLS)** | Políticas en Postgres que deciden qué filas puede leer o modificar cada usuario. |
| **Storage** | Almacenamiento de archivos (imágenes, PDF) con las mismas reglas de acceso. |
| **Realtime** | Notificaciones en vivo cuando cambian los datos. |
| **Edge Functions** | Funciones de servidor para la lógica que no debe vivir en la app. |

Hoy usaremos solo las dos primeras: la base de datos y su API REST. Autenticación, Storage y Realtime se apoyan en el mismo SDK, así que lo que aprendas aquí sirve para todo lo demás.

:::info[El plan gratuito basta para el curso]
Crear una cuenta y un proyecto en [supabase.com](https://supabase.com) no requiere tarjeta. Un proyecto del plan gratuito se **pausa tras una semana sin actividad**; se reactiva desde el panel y no pierde datos.
:::

---

## 2. Arquitectura de una app Flutter con Supabase

La pregunta de diseño es **dónde va el código que habla con Supabase**. La respuesta es la misma separación de capas de las semanas anteriores:

* La **interfaz** (la página, los widgets) dibuja y atiende al usuario. No sabe qué base de datos hay detrás.
* La **capa de servicio** (`ContactoService`) es una clase de Dart con un método por operación. Es la **frontera**: la única que importa `supabase_flutter`.
* El **SDK** (`supabase_flutter`) arma las peticiones HTTP, y la **API REST de Supabase** las ejecuta contra **Postgres**.

Recorre las cinco piezas y sigue una petición de ida y de vuelta: listar los contactos.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-14/arquitectura-flutter-supabase/index.html"
  title="Arquitectura de una app Flutter con Supabase: la página llama al servicio, el servicio usa el SDK y el SDK habla con la API REST y Postgres"
  height={640}
/>

:::tip[Por qué una capa de servicio]
Si la página llamara directamente a `Supabase.instance.client`, cambiar el nombre de una tabla o probar la pantalla con datos falsos obligaría a editar widgets. Con el servicio en medio, la interfaz depende de un contrato (`listar()`, `crear()`, `borrar()`) y no de una tecnología. Es el mismo principio por el que la lista de la semana 12 vivía en `AgendaPage` y no dentro de cada tarjeta.
:::

---

## 3. Instalar Supabase en la app y configurar las credenciales

### 3.1. Instalar el SDK

El paquete oficial es [`supabase_flutter`](https://pub.dev/packages/supabase_flutter). Desde la carpeta del proyecto:

```bash
flutter pub add supabase_flutter
```

Esto agrega la dependencia a `pubspec.yaml` y descarga los paquetes.

### 3.2. Obtener las credenciales del proyecto

El SDK necesita saber **a qué proyecto** conectarse y **con qué llave**. Son dos datos que están en el panel de Supabase.

**La llave (publishable key).** En el panel, abre tu proyecto y ve a **Project Settings → API Keys**. En la sección **Publishable key** está la llave `default`, que empieza por `sb_publishable_`. Cópiala con el botón de la derecha.

![Panel de Supabase en Project Settings, API Keys, con la llave publishable resaltada](/img/seminario-de-i-d-i/semana-14/supabase-api-keys.png)

**La URL del proyecto.** Está en **Integrations → Data API**, en el campo **API URL**. Tiene la forma `https://<id-del-proyecto>.supabase.co/rest/v1/`. Para el SDK usarás **solo la base**, sin `/rest/v1/` (el SDK agrega esa ruta por su cuenta).

![Panel de Supabase en Integrations, Data API, con la API URL resaltada](/img/seminario-de-i-d-i/semana-14/supabase-data-api.png)

:::note[Publishable y secret: cuál va en la app]
Los proyectos nuevos tienen dos tipos de llave:

* **Publishable** (`sb_publishable_…`): pública por diseño, va en la app. Por sí sola no da acceso a nada: lo que puede hacer lo deciden las políticas RLS de cada tabla.
* **Secret** (`sb_secret_…`): se **salta RLS** y tiene acceso total. Solo se usa en servidores. **Nunca** va en una app móvil ni en un repositorio.

En proyectos y tutoriales anteriores la llave pública se llamaba **anon key** (un texto largo que empieza por `eyJ…`). Es la misma idea con otro nombre; sigue funcionando mientras tu proyecto la tenga habilitada.
:::

### 3.3. Guardar las credenciales fuera del código

No escribas la URL y la llave directamente en `main.dart`: terminarían en el repositorio y cambiar de proyecto (desarrollo, pruebas) obligaría a editar código. Flutter permite pasarlas al compilar con **`--dart-define`**, sin paquetes extra.

Crea un archivo `env.json` en la raíz del proyecto:

```json title="env.json"
{
  "SUPABASE_URL": "https://tu-proyecto.supabase.co",
  "SUPABASE_PUBLISHABLE_KEY": "sb_publishable_xxxxxxxxxxxxxxxx"
}
```

Agrégalo a `.gitignore` para que no se suba al repositorio, y deja un `env.example.json` con valores de ejemplo para tus compañeros:

```gitignore title=".gitignore"
env.json
```

Ejecuta la app indicándole el archivo:

```bash
flutter run --dart-define-from-file=env.json
```

:::tip[En VS Code]
Para no escribir el parámetro cada vez, agrégalo a `.vscode/launch.json` en `"args": ["--dart-define-from-file=env.json"]`. En Android Studio, va en **Edit Configurations → Additional run args**.
:::

:::warning[Un archivo oculto no es una caja fuerte]
Los valores de `--dart-define` quedan **dentro de la app compilada**, y cualquiera con paciencia puede extraerlos. Eso es aceptable con la llave publishable porque está pensada para ser pública; por eso la seguridad real de los datos vive en **RLS** (sección 4), no en esconder la llave.
:::

### 3.4. Inicializar el SDK

En Dart, una constante con `String.fromEnvironment` lee el valor que se pasó con `--dart-define`. Se inicializa Supabase **una sola vez**, antes de `runApp`:

```dart title="lib/main.dart"
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'pages/contactos_page.dart';

const supabaseUrl = String.fromEnvironment('SUPABASE_URL');
const supabaseKey = String.fromEnvironment('SUPABASE_PUBLISHABLE_KEY');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(url: supabaseUrl, publishableKey: supabaseKey);
  runApp(const MaterialApp(home: ContactosPage()));
}
```

* `WidgetsFlutterBinding.ensureInitialized()` es necesario porque `main` es `async` y usa plugins antes de `runApp`.
* `Supabase.initialize` es asíncrono: abre el cliente y recupera la sesión guardada. Por eso se espera con `await`.
* Desde ese momento, `Supabase.instance.client` está disponible en toda la app.

:::note[Versiones anteriores del SDK]
En versiones de `supabase_flutter` anteriores a la 2.13 el parámetro se llamaba `anonKey`. Si el `pubspec.yaml` de un proyecto viejo lo usa, se escribe `anonKey: supabaseKey`.
:::

---

## 4. La tabla y sus políticas de seguridad

Antes del código, necesitamos la tabla. En el panel abre el **SQL Editor** y ejecuta:

```sql title="SQL Editor"
create table public.contactos (
  id         bigint generated always as identity primary key,
  nombre     text not null,
  email      text not null,
  created_at timestamptz not null default now()
);

-- RLS: sin políticas, la API no deja leer ni escribir nada
alter table public.contactos enable row level security;

-- Solo para el ejercicio de clase: acceso abierto con la llave publishable
create policy "demo: leer"    on public.contactos for select to anon using (true);
create policy "demo: crear"   on public.contactos for insert to anon with check (true);
create policy "demo: editar"  on public.contactos for update to anon using (true) with check (true);
create policy "demo: borrar"  on public.contactos for delete to anon using (true);
```

* `id` lo genera Postgres (`generated always as identity`): la app nunca lo envía al crear.
* **`enable row level security`** activa RLS. Con RLS activado y **sin políticas**, la API responde con listas vacías y rechaza las escrituras. Es la configuración segura por defecto.
* Las cuatro políticas `demo` abren la tabla a **cualquiera que tenga la llave**. Sirven para este ejercicio; en una app real se restringen a usuarios autenticados (`to authenticated using (auth.uid() = user_id)`), tema que se construye sobre la autenticación de Supabase.

---

## 5. La capa de servicio

Primero el **modelo**: una clase que representa una fila y sabe convertirse desde y hacia el `Map` que maneja el SDK.

```dart title="lib/models/contacto.dart"
class Contacto {
  final int? id;
  final String nombre;
  final String email;

  const Contacto({this.id, required this.nombre, required this.email});

  factory Contacto.fromMap(Map<String, dynamic> m) => Contacto(
        id: m['id'] as int,
        nombre: m['nombre'] as String,
        email: m['email'] as String,
      );

  // Sin id: lo genera Postgres al insertar.
  Map<String, dynamic> toMap() => {'nombre': nombre, 'email': email};
}
```

Luego el **servicio**: un método por operación, y la interfaz solo ve `Contacto`, nunca `Map` ni `Supabase`.

```dart title="lib/services/contacto_service.dart"
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/contacto.dart';

class ContactoService {
  final _db = Supabase.instance.client;
  static const _tabla = 'contactos';

  Future<List<Contacto>> listar() async {
    final filas = await _db.from(_tabla).select().order('nombre');
    return filas.map(Contacto.fromMap).toList();
  }

  Future<Contacto> obtener(int id) async {
    final fila = await _db.from(_tabla).select().eq('id', id).single();
    return Contacto.fromMap(fila);
  }

  Future<void> crear(Contacto c) => _db.from(_tabla).insert(c.toMap());

  Future<void> editar(Contacto c) =>
      _db.from(_tabla).update(c.toMap()).eq('id', c.id!);

  Future<void> borrar(int id) => _db.from(_tabla).delete().eq('id', id);
}
```

Todos los métodos devuelven un `Future`: hablar con Supabase es una operación de red, y eso tiene consecuencias para la interfaz (sección 7).

---

## 6. CRUD con PostgREST

Cada llamada del servicio se convierte en una **petición HTTP** a la API REST de Supabase, que **PostgREST** traduce a SQL. Entender esa traducción te permite depurar: cuando algo falla, el error habla de HTTP y de SQL, no de Dart.

Pasa el mouse por el código o por las peticiones para ver qué parte de la consulta produce qué parte de la petición.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-14/crud-postgrest/index.html"
  title="El CRUD de la agenda: cada consulta del servicio enlazada con la petición HTTP a PostgREST y el SQL equivalente"
  height={1120}
/>

| Operación | Método del SDK | Petición HTTP | SQL |
|---|---|---|---|
| **Listar** | `select().order(...)` | `GET /contactos?select=*&order=nombre.asc` | `SELECT … ORDER BY nombre` |
| **Detalle** | `select().eq(...).single()` | `GET /contactos?id=eq.7` (un objeto) | `SELECT … WHERE id = 7` |
| **Crear** | `insert(datos)` | `POST /contactos` + cuerpo JSON | `INSERT INTO …` |
| **Editar** | `update(datos).eq(...)` | `PATCH /contactos?id=eq.7` + cuerpo | `UPDATE … WHERE id = 7` |
| **Borrar** | `delete().eq(...)` | `DELETE /contactos?id=eq.7` | `DELETE … WHERE id = 7` |

:::danger[update() y delete() siempre con su filtro]
Sin `.eq(...)`, un `update()` o un `delete()` **no tienen filtro** y se aplican a todas las filas que la política de seguridad permita. Antes de ejecutar un borrado, comprueba que la línea tenga su `.eq('id', id)`.
:::

---

## 7. Estados de la interfaz: cargando y error

Una llamada al servicio **no responde al instante**: la petición viaja por Internet, Supabase consulta la base de datos y la respuesta vuelve. Mientras tanto, la app **no se bloquea**: el `await` suspende solo la función que espera, y la interfaz sigue viva. Pero, ¿qué debe dibujar `build()` mientras no hay datos? Tres cosas distintas según el momento:

| Estado | Cuándo | Qué se dibuja |
|---|---|---|
| **Cargando** | La petición salió y no ha vuelto | Un indicador de carga |
| **Error** | La petición falló | Un mensaje y un botón para reintentar |
| **Datos** | La petición volvió bien | La lista |

Esos tres estados se guardan en el `State` de la página con dos variables (`_cargando`, `_error`) y los datos. Elige qué responde Supabase (bien, lento, con error de la API o sin conexión) y sigue lo que ocurre, línea por línea:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-14/estados-asincronos/index.html"
  title="Estados de una petición asíncrona en Flutter: cargando, error y datos, según lo que responda Supabase"
  height={1040}
/>

El código completo de la página, con la salvaguarda `mounted` que se explica más abajo:

```dart title="lib/pages/contactos_page.dart"
class _ContactosPageState extends State<ContactosPage> {
  final _servicio = ContactoService();
  bool _cargando = true;
  String? _error;
  List<Contacto> _contactos = [];

  @override
  void initState() {
    super.initState();
    _cargar();
  }

  Future<void> _cargar() async {
    setState(() {
      _cargando = true;
      _error = null;
    });
    try {
      final filas = await _servicio.listar();
      if (!mounted) return;
      setState(() => _contactos = filas);
    } on PostgrestException catch (e) {
      if (!mounted) return;
      setState(() => _error = e.message);
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = 'Sin conexión');
    } finally {
      if (mounted) setState(() => _cargando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Agenda')),
      body: _cuerpo(),
    );
  }

  Widget _cuerpo() {
    if (_cargando) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!),
            const SizedBox(height: 12),
            FilledButton(onPressed: _cargar, child: const Text('Reintentar')),
          ],
        ),
      );
    }
    return ListView(
      children: [
        for (final c in _contactos)
          ListTile(title: Text(c.nombre), subtitle: Text(c.email)),
      ],
    );
  }
}
```

Puntos que conviene entender:

* **`_cargando` arranca en `true`.** Así el primer `build()` ya dibuja el indicador y no una lista vacía que parpadea.
* **`_cargar()` limpia el estado antes de pedir.** Por eso el botón *Reintentar* puede llamar a la misma función: no existe un segundo camino.
* **`finally` apaga el indicador siempre**, haya salido bien o mal. Sin él, un error dejaría la app cargando para siempre.
* **Dos `catch`, porque hay dos tipos de fallo.** `PostgrestException` es una respuesta de Supabase con error (una tabla que no existe, una política RLS que no deja leer, un dato inválido) y trae un `message`. Si **no hay red**, la petición ni sale y el SDK lanza otra excepción: la atrapa el `catch` genérico.
* **`if (!mounted) return;` después de cada `await`.** Si el usuario salió de la pantalla mientras esperaba, el `State` ya no existe, y llamar a `setState` lanzaría un error. Es la misma regla de oro de la navegación con `context.mounted`.

:::tip[FutureBuilder: la alternativa]
Flutter trae el widget `FutureBuilder`, que gestiona estos tres estados por ti a partir de un `Future` (`snapshot.connectionState`, `snapshot.hasError`, `snapshot.data`). Es cómodo para una consulta de solo lectura. Con `setState` y variables explícitas, como arriba, controlas mejor los reintentos y las operaciones que modifican datos (crear, editar, borrar), y es lo que usaremos en la agenda.
:::

---

## 8. Errores frecuentes

| Síntoma | Causa probable | Qué revisar |
|---|---|---|
| La lista llega **vacía** aunque hay filas | RLS activado y sin política de `select` | Panel: **Authentication → Policies** de la tabla |
| `new row violates row-level security policy` al crear | Falta la política de `insert` | Crear la política de `insert` |
| Editar o borrar «no hace nada» y no da error | Falta la política de `update`/`delete`, o el filtro no coincide | Políticas y `.eq(...)` |
| `Could not find the table 'public.contactos' in the schema cache` | Nombre de tabla mal escrito en `from()`, o la tabla no existe | Ortografía en `from('contactos')` |
| `Invalid API key` o `401` | URL o llave equivocadas, o `env.json` no se pasó | `--dart-define-from-file=env.json` |
| `SocketException` / `ClientException` | Sin conexión, o URL mal escrita | Internet y que la URL **no** lleve `/rest/v1/` |
| `PGRST116` al usar `single()` | La consulta devolvió 0 o más de 1 fila | El filtro por `id`; o usa `maybeSingle()` |
| La app se queda en el indicador de carga para siempre | Falta el `finally` que apaga `_cargando` | La estructura `try / catch / finally` |

---

## Cuestionario de Autoevaluación

<Quiz id="seminario-s14-supabase-flutter-quiz">
  <Question title="¿Cómo obtiene Supabase la API REST de cada tabla de tu base de datos?">
    <Option>Tienes que escribir y desplegar un servidor con un endpoint por tabla.</Option>
    <Option>La genera el SDK de Flutter al compilar la aplicación.</Option>
    <Option correct>La genera automáticamente PostgREST a partir del esquema de Postgres.</Option>
    <Option>La genera Firebase y Supabase solo la reenvía.</Option>
  </Question>
  <Question title="En la arquitectura de la agenda, ¿qué parte del código debe importar supabase_flutter?">
    <Option>Todos los widgets, para llamar a Supabase donde lo necesiten.</Option>
    <Option correct>Solo la capa de servicio (`ContactoService`); la interfaz depende de un contrato.</Option>
    <Option>Solo el modelo `Contacto`.</Option>
    <Option>Solo `main.dart`, y la interfaz usa variables globales.</Option>
  </Question>
  <Question title="¿Qué URL se le entrega a Supabase.initialize como url?">
    <Option>La API URL completa, terminada en /rest/v1/.</Option>
    <Option correct>Solo la base del proyecto (https://tu-proyecto.supabase.co), sin /rest/v1/, porque el SDK agrega esa ruta.</Option>
    <Option>La dirección del panel de Supabase en el navegador.</Option>
    <Option>La llave secret, porque identifica al proyecto.</Option>
  </Question>
  <Question title="¿Por qué la llave secret nunca debe ir en una app móvil ni en un repositorio?">
    <Option>Porque es más larga que la publishable y no cabe en el archivo de configuración.</Option>
    <Option>Porque solo funciona en Flutter Web.</Option>
    <Option correct>Porque se salta RLS y da acceso total a los datos.</Option>
    <Option>Porque caduca cada hora y la app dejaría de funcionar.</Option>
  </Question>
  <Question title="Los valores de --dart-define quedan dentro de la app compilada. ¿Qué protege entonces los datos de la tabla?">
    <Option>Que el archivo env.json esté en el .gitignore.</Option>
    <Option>Que la llave publishable sea difícil de adivinar.</Option>
    <Option>Que la app nunca se publique en una tienda.</Option>
    <Option correct>Las políticas de Row Level Security (RLS) de la tabla.</Option>
  </Question>
  <Question title="Un contacto se edita con update(datos).eq('id', 7). ¿Qué petición HTTP envía el SDK?">
    <Option>GET /contactos?id=eq.7</Option>
    <Option>POST /contactos con el id en el cuerpo</Option>
    <Option correct>PATCH /contactos?id=eq.7 con las columnas que cambian en el cuerpo JSON</Option>
    <Option>DELETE /contactos?id=eq.7 seguido de un POST</Option>
  </Question>
  <Question title="¿Qué pasa si ejecutas delete() sin encadenar .eq(...)?">
    <Option>El SDK lanza un error antes de enviar la petición.</Option>
    <Option>Se borra solo la primera fila de la tabla.</Option>
    <Option correct>La petición no tiene filtro y afecta a todas las filas que la política de seguridad permita borrar.</Option>
    <Option>No pasa nada: sin filtro, PostgREST ignora la petición.</Option>
  </Question>
  <Question title="Con RLS activado y sin ninguna política en la tabla, ¿qué devuelve un select() hecho con la llave publishable?">
    <Option>Todas las filas, porque la llave publishable da acceso de lectura.</Option>
    <Option correct>Una lista vacía, aunque la tabla tenga filas.</Option>
    <Option>Un error de compilación en Dart.</Option>
    <Option>Solo la primera fila.</Option>
  </Question>
  <Question title="¿Por qué en la página de contactos _cargando arranca en true?">
    <Option>Porque Dart no permite variables booleanas en false.</Option>
    <Option>Para que initState no tenga que llamar a _cargar().</Option>
    <Option correct>Para que el primer build() ya dibuje el indicador de carga y no una lista vacía que parpadea.</Option>
    <Option>Para bloquear la interfaz hasta que llegue la respuesta.</Option>
  </Question>
  <Question title="¿Qué papel cumple el bloque finally de _cargar()?">
    <Option>Captura las excepciones de red que el catch no atrapó.</Option>
    <Option>Reintenta la petición si falló.</Option>
    <Option correct>Apaga el indicador de carga siempre, haya salido bien o mal; sin él, un error dejaría la app cargando para siempre.</Option>
    <Option>Cancela la petición si el usuario sale de la pantalla.</Option>
  </Question>
  <Question title="Se pierde la conexión a Internet mientras se llama a listar(). ¿Qué bloque de _cargar() atrapa el fallo?">
    <Option>El catch de PostgrestException, porque toda falla de Supabase es de ese tipo.</Option>
    <Option>Ninguno: la app se cierra, porque sin red no hay excepción que atrapar.</Option>
    <Option>El bloque finally, que es el único que maneja errores.</Option>
    <Option correct>El catch genérico, porque sin red la petición ni sale y el SDK lanza otra clase de excepción.</Option>
  </Question>
</Quiz>
