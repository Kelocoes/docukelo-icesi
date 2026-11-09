---
sidebar_position: 1
description: "Autenticación con Supabase Auth en Flutter: autenticación frente a autorización, los módulos de Supabase, registro e inicio de sesión, guarda de pantallas y el paso de las políticas RLS de anon a authenticated."
---

# Autenticación con Supabase Auth

En la semana 14 la agenda quedó conectada a Supabase, pero con una puerta abierta: las políticas de la tabla `contactos` eran **«to anon»**, es decir, cualquiera con la llave publishable (que va dentro de la app) podía leer y modificar todo. Hoy cerramos esa puerta: la app va a pedir **usuario y contraseña**, y solo quien haya iniciado sesión podrá usar la agenda.

En esta sesión cubriremos:
* La diferencia entre **autenticación** y **autorización**.
* Los **módulos** que ofrece Supabase y qué hay que configurar en la app y en el panel.
* Cómo viaja una petición de **registro** y de **inicio de sesión**.
* Los métodos del SDK: `signUp`, `signInWithPassword`, `signOut` y el estado de la sesión.
* Una pantalla de ingreso y una **guarda** que decide qué pantalla mostrar.
* Cambiar las políticas **RLS** de `anon` a `authenticated`.

---

## 1. Autenticación y autorización

Son dos palabras parecidas que responden a **dos preguntas distintas**:

| | Pregunta | En Supabase | Ejemplo |
|---|---|---|---|
| **Autenticación** | ¿Quién eres? | **Supabase Auth**: registro, inicio de sesión, sesión | Ana demuestra con su correo y contraseña que es Ana |
| **Autorización** | ¿Qué puedes hacer? | **RLS** (políticas de la base de datos) | Ana puede leer sus contactos, pero no los de Luis |

Elige quién llega y mira qué ocurre en cada puerta:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/autenticacion-vs-autorizacion/index.html"
  title="Autenticación frente a autorización: la primera confirma la identidad y entrega una sesión, la segunda decide qué filas puede ver cada usuario"
  height={560}
/>

:::note[Tener sesión no es tener permiso]
Estar autenticado solo significa que el sistema sabe quién eres. Lo que puedes ver o modificar sigue dependiendo de las políticas. Por eso esta sesión tiene dos partes: **iniciar sesión** (Auth) y **cambiar las políticas** (RLS).
:::

---

## 2. Los módulos de Supabase y qué configurar

Un proyecto de Supabase es una familia de módulos detrás de **un mismo cliente**. Desde la app, cada módulo es una propiedad de `Supabase.instance.client`:

| Módulo | Desde Flutter | Para qué |
|---|---|---|
| **Database** | `client.from('contactos')` | Tablas y su API REST (semana 14) |
| **Auth** | `client.auth` | Usuarios, inicio de sesión, sesión (**hoy**) |
| **Storage** | `client.storage` | Archivos e imágenes (**la próxima sesión**) |
| **Realtime** | `client.channel('sala')` | Avisos en vivo cuando cambian los datos |
| **Edge Functions** | `client.functions` | Código de servidor |

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/modulos-supabase/index.html"
  title="Los módulos de Supabase detrás de un solo cliente y los dos datos que la app configura: la URL y la llave publishable"
  height={560}
/>

La buena noticia: **en la app no hay nada nuevo que configurar**. La URL y la llave publishable de la semana 14 sirven para todos los módulos, y `Supabase.initialize` ya está en `main()`. Lo que cambia hoy está en el **panel de Supabase** y en el **código** que usa `client.auth`.

---

## 3. Configurar Auth en el panel

Abre tu proyecto y ve a **Authentication → Sign In / Providers**. El proveedor **Email** ya viene activado, y en **User Signups** hay cuatro interruptores:

![Panel de Supabase en Authentication, Sign In / Providers, con los interruptores de registro y Confirm email activado](/img/seminario-de-i-d-i/semana-15/auth-providers-signups.png)

El que más importa hoy es **Confirm email**:

* **Activado** (por defecto): al registrarse, Supabase envía un correo con un enlace y el usuario **no puede iniciar sesión hasta confirmarlo**. Es lo correcto en una app real.
* **Desactivado**: el registro devuelve la sesión de una vez. Es lo cómodo para practicar en clase, porque no dependes de abrir correos.

Para esta sesión **desactívalo** y pulsa **Save changes**. En el panel verás el aviso «Successfully updated settings»:

![Panel de Supabase con Confirm email desactivado y el aviso de configuración guardada](/img/seminario-de-i-d-i/semana-15/auth-confirm-email-off.png)

:::warning[Vuelve a activarlo en una app real]
Sin confirmación, cualquiera puede registrarse con un correo que no es suyo. Para el ejercicio de clase es aceptable; para una app publicada, no.
:::

---

## 4. Cómo viaja una petición de autenticación

Antes del código, conviene ver el recorrido completo. Hay **tres momentos**: registrarse (`signUp`), iniciar sesión (`signInWithPassword`) y pedir datos ya con sesión. Observa en el último qué cambia en la petición:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/peticion-auth/index.html"
  title="Recorrido de la autenticación: registro, inicio de sesión con JWT y petición de datos con el rol authenticated, con interruptores para Confirm email y para pedir datos sin sesión"
  height={640}
/>

Las ideas que deben quedar:

* La contraseña **nunca se guarda tal cual**: Supabase Auth guarda un *hash* y la compara al iniciar sesión.
* Iniciar sesión devuelve un **JWT** (`access_token`, dura ~1 hora) y un `refresh_token`. El SDK los guarda y renueva el JWT solo, por eso la sesión sobrevive aunque cierres la app.
* Desde ese momento, **cada petición** lleva el JWT en el encabezado `Authorization: Bearer …`. Es lo que permite que Postgres sepa **quién** pide los datos.
* Las dos tablas de Supabase involucradas: los usuarios viven en el esquema `auth` (que **no** se toca desde la app) y tus datos, en `public`.

---

## 5. Los métodos del SDK

Todo lo de autenticación está en `Supabase.instance.client.auth`. Siguiendo la arquitectura de la semana 14, lo encapsulamos en un **servicio** para que las pantallas no importen `supabase_flutter`:

```dart title="lib/services/auth_service.dart"
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  final _auth = Supabase.instance.client.auth;

  // ¿Hay alguien con sesión? null = nadie.
  Session? get sesion => _auth.currentSession;

  // Avisa cada vez que alguien inicia o cierra sesión.
  Stream<AuthState> get cambios => _auth.onAuthStateChange;

  Future<void> registrar(String email, String password) async {
    await _auth.signUp(email: email, password: password);
  }

  Future<void> iniciarSesion(String email, String password) async {
    await _auth.signInWithPassword(email: email, password: password);
  }

  Future<void> cerrarSesion() => _auth.signOut();
}
```

| Método | Qué hace | Qué devuelve |
|---|---|---|
| `signUp(email:, password:)` | Crea el usuario | `AuthResponse` con `user` y, si no se confirma el correo, `session` |
| `signInWithPassword(email:, password:)` | Comprueba la contraseña y abre la sesión | `AuthResponse` con `session` |
| `signOut()` | Cierra la sesión y borra el JWT guardado | `void` |
| `currentSession` / `currentUser` | La sesión o el usuario actual, sin ir a la red | `Session?` / `User?` |
| `onAuthStateChange` | Un `Stream` que emite cuando cambia la sesión | `AuthState` (`event` y `session`) |

* Los métodos fallan lanzando **`AuthException`**, con un `message` legible: «Invalid login credentials», «User already registered», «Password should be at least 6 characters».
* `signUp` con **Confirm email** activado **no** devuelve sesión (`session == null`): la app debe avisar «revisa tu correo».

---

## 6. La pantalla de ingreso

Una sola pantalla con dos campos y dos botones. Reutiliza lo ya visto: `TextEditingController`, `setState` y los estados **cargando** y **error** de la semana 14.

```dart title="lib/pages/login_page.dart"
class _LoginPageState extends State<LoginPage> {
  final _servicio = AuthService();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _cargando = false;
  String? _error;

  Future<void> _enviar({required bool registro}) async {
    setState(() {
      _cargando = true;
      _error = null;
    });
    try {
      if (registro) {
        await _servicio.registrar(_email.text.trim(), _password.text);
      } else {
        await _servicio.iniciarSesion(_email.text.trim(), _password.text);
      }
      // Sin Navigator: la guarda (sección 7) cambia sola de pantalla.
    } on AuthException catch (e) {
      if (!mounted) return;
      setState(() => _error = e.message);
    } catch (_) {
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
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(labelText: 'Correo'),
            ),
            TextField(
              controller: _password,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Contraseña'),
            ),
            const SizedBox(height: 16),
            if (_error != null)
              Text(_error!, style: const TextStyle(color: Colors.red)),
            if (_cargando)
              const CircularProgressIndicator()
            else ...[
              FilledButton(
                onPressed: () => _enviar(registro: false),
                child: const Text('Iniciar sesión'),
              ),
              TextButton(
                onPressed: () => _enviar(registro: true),
                child: const Text('Crear cuenta'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
```

* `obscureText: true` oculta la contraseña mientras se escribe.
* `.trim()` en el correo evita el error clásico de un espacio al final.
* El `catch` de `AuthException` muestra el mensaje de Supabase; el genérico cubre la falta de red.
* **No hay `Navigator.push`** tras iniciar sesión. Parece raro, pero es la mejor práctica: la pantalla correcta la decide la **guarda**.

---

## 7. La guarda: qué pantalla mostrar

La **guarda** (*auth gate*) es un widget que escucha `onAuthStateChange` y muestra la pantalla de ingreso o la agenda según haya sesión:

```dart title="lib/auth_gate.dart"
class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    final servicio = AuthService();
    return StreamBuilder<AuthState>(
      stream: servicio.cambios,
      builder: (context, snapshot) {
        final sesion = snapshot.data?.session ?? servicio.sesion;
        return sesion == null ? const LoginPage() : const ContactosPage();
      },
    );
  }
}
```

Y en `main.dart`, la guarda reemplaza a la página inicial:

```dart title="lib/main.dart"
runApp(const MaterialApp(home: AuthGate()));
```

Con eso:
* Al abrir la app, `servicio.sesion` ya trae la sesión guardada: si el usuario ya había iniciado sesión, entra **directo a la agenda**.
* Al iniciar sesión, el `Stream` emite y la guarda cambia a `ContactosPage` sin que nadie llame a `Navigator`.
* Al cerrar sesión, ocurre lo contrario. Solo falta un botón en la agenda:

```dart title="lib/pages/contactos_page.dart"
appBar: AppBar(
  title: const Text('Agenda'),
  actions: [
    IconButton(
      icon: const Icon(Icons.logout),
      tooltip: 'Cerrar sesión',
      onPressed: () => AuthService().cerrarSesion(),
    ),
  ],
),
```

---

## 8. De «anon» a «authenticated»: las políticas

Ejecuta la app ahora y verás algo desconcertante: te registras, entras a la agenda… y **la lista está vacía** aunque la tabla tenga contactos. No hay ningún error. ¿Por qué?

Las políticas de la semana 14 decían **`to anon`**. Pero al iniciar sesión, la petición deja de ser anónima y llega con el rol **`authenticated`**: para Postgres, esas políticas ya no aplican a ella. Prueba las cuatro combinaciones:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/rls-anon-vs-authenticated/index.html"
  title="Una petición llega con el rol anon o authenticated según tenga sesión; la política RLS aplica solo al rol que nombra y, si no coincide, la consulta devuelve una lista vacía"
  height={620}
/>

### 8.1. El estado de partida

En el panel, **Database → Policies**. Estas son las cuatro políticas de la semana 14, todas aplicadas a `anon`:

![Panel de Supabase en Database, Policies, con las cuatro políticas demo de la tabla contactos aplicadas al rol anon](/img/seminario-de-i-d-i/semana-15/policies-antes-anon.png)

### 8.2. Reemplazarlas por políticas para `authenticated`

Abre el **SQL Editor** y ejecuta. Se eliminan las de `anon` y se crean las nuevas, idénticas salvo el rol:

```sql title="SQL Editor"
-- 1. Quitar las políticas abiertas a anónimos
drop policy "demo: leer"   on public.contactos;
drop policy "demo: crear"  on public.contactos;
drop policy "demo: editar" on public.contactos;
drop policy "demo: borrar" on public.contactos;

-- 2. Crear las equivalentes, solo para usuarios con sesión
create policy "autenticados: leer"   on public.contactos
  for select to authenticated using (true);
create policy "autenticados: crear"  on public.contactos
  for insert to authenticated with check (true);
create policy "autenticados: editar" on public.contactos
  for update to authenticated using (true) with check (true);
create policy "autenticados: borrar" on public.contactos
  for delete to authenticated using (true);
```

:::info[Una advertencia normal]
El SQL Editor muestra «Potential issue detected: this query includes destructive operations» por los `drop policy`. Aquí es justo lo que se quiere: se borran **políticas**, no datos. Confirma con **Run query**.
:::

Al terminar, la pantalla de políticas muestra el mismo conjunto, ahora para **`authenticated`**:

![Panel de Supabase en Database, Policies, con las cuatro políticas de la tabla contactos aplicadas al rol authenticated](/img/seminario-de-i-d-i/semana-15/policies-despues-authenticated.png)

Qué cambia en la práctica:
* Un **visitante sin sesión** ya no puede leer ni escribir nada.
* Un **usuario con sesión** hace el CRUD como en la semana 14.
* La llave publishable puede seguir en la app: por sí sola ya no da acceso a los datos.

### 8.3. Siguiente nivel: que cada usuario vea solo lo suyo

Con `using (true)` **todos** los usuarios autenticados ven **todos** los contactos. Para que cada uno vea los suyos, la tabla debe saber de quién es cada fila. Supabase ofrece `auth.uid()`, que devuelve el id del usuario del JWT:

```sql title="SQL Editor (opcional)"
alter table public.contactos
  add column user_id uuid default auth.uid() references auth.users (id);

drop policy "autenticados: leer" on public.contactos;
create policy "propios: leer" on public.contactos
  for select to authenticated using ((select auth.uid()) = user_id);
```

* `default auth.uid()` llena `user_id` solo al insertar: la app no lo envía.
* Las filas que ya existían quedan con `user_id` vacío y **nadie las ve**. Para el ejercicio, bórralas o asígnalas a un usuario.
* Lo mismo se repite para `insert`, `update` y `delete`.

---

## 9. Errores frecuentes

| Síntoma | Causa probable | Qué revisar |
|---|---|---|
| `Invalid login credentials` | Correo o contraseña equivocados, o el correo **sin confirmar** | Panel: **Authentication → Users**; la opción **Confirm email** |
| `User already registered` | El correo ya existe | Iniciar sesión en vez de registrarse |
| `Password should be at least 6 characters` | Contraseña demasiado corta | Longitud mínima en **Sign In / Providers** |
| Después de registrarse, no entra a la agenda | **Confirm email** activado: no hay sesión hasta abrir el correo | Desactivarlo o avisar «revisa tu correo» |
| La agenda entra pero la **lista está vacía**, sin error | Las políticas siguen en `to anon` y el usuario ya es `authenticated` | **Database → Policies** (sección 8) |
| `new row violates row-level security policy` al crear | Falta la política de `insert` para `authenticated` | Crearla |
| Cerré sesión y la app sigue mostrando la agenda | La guarda no escucha `onAuthStateChange` | `AuthGate` con `StreamBuilder` |
| `email rate limit exceeded` | Demasiados registros en poco tiempo desde un proyecto gratuito | Esperar o probar con otro usuario |

---

## Cuestionario de Autoevaluación

<Quiz id="seminario-s15-auth-quiz">
  <Question title="¿Qué pregunta responde la autenticación?">
    <Option>¿Qué filas de la tabla puede leer este usuario?</Option>
    <Option correct>¿Quién eres?</Option>
    <Option>¿Cuánto pesa el archivo que se sube?</Option>
    <Option>¿A qué proyecto de Supabase se conecta la app?</Option>
  </Question>
  <Question title="En Supabase, ¿qué mecanismo se encarga de la autorización (qué puede hacer cada usuario)?">
    <Option>Supabase Auth, con el JWT que entrega al iniciar sesión.</Option>
    <Option>La llave publishable, que identifica a cada usuario.</Option>
    <Option correct>Las políticas RLS de cada tabla.</Option>
    <Option>El archivo env.json de la app.</Option>
  </Question>
  <Question title="¿Qué hay que configurar en la app Flutter para usar Auth, además de lo de la semana 14?">
    <Option>Una segunda llave exclusiva para Auth.</Option>
    <Option>Una URL distinta para el módulo de autenticación.</Option>
    <Option correct>Nada nuevo: la misma URL y llave publishable sirven para todos los módulos; el cambio está en el panel y en el código de client.auth.</Option>
    <Option>Reinstalar supabase_flutter desde cero.</Option>
  </Question>
  <Question title="¿Qué devuelve Supabase Auth al iniciar sesión correctamente?">
    <Option>La contraseña del usuario, para guardarla en la app.</Option>
    <Option>Una lista con todos los usuarios del proyecto.</Option>
    <Option correct>Una sesión con un access_token (JWT) y un refresh_token.</Option>
    <Option>Una nueva llave secret para el usuario.</Option>
  </Question>
  <Question title="¿Qué hace el SDK con el JWT en las peticiones siguientes?">
    <Option>Nada: las peticiones siguen llevando solo la llave publishable.</Option>
    <Option>Lo envía en el cuerpo de cada petición POST.</Option>
    <Option correct>Lo agrega en el encabezado Authorization: Bearer, para que Postgres sepa quién pide los datos.</Option>
    <Option>Lo guarda en la tabla contactos.</Option>
  </Question>
  <Question title="Con «Confirm email» activado, ¿qué trae la respuesta de signUp()?">
    <Option>Una sesión completa, listo para entrar.</Option>
    <Option correct>El usuario creado, pero session es null hasta que confirme su correo.</Option>
    <Option>Un error, porque no se puede registrar sin confirmar antes.</Option>
    <Option>La contraseña en texto claro.</Option>
  </Question>
  <Question title="¿Qué excepción lanzan los métodos de auth cuando algo falla, como una contraseña incorrecta?">
    <Option>PostgrestException</Option>
    <Option>StorageException</Option>
    <Option correct>AuthException, con un message legible.</Option>
    <Option>FormatException</Option>
  </Question>
  <Question title="Tras iniciar sesión, la app cambia sola a la agenda sin llamar a Navigator. ¿Por qué?">
    <Option>Porque signInWithPassword navega por sí mismo.</Option>
    <Option>Porque Flutter detecta el cambio de contraseña.</Option>
    <Option correct>Porque la guarda (AuthGate) escucha onAuthStateChange con un StreamBuilder y muestra la pantalla según haya sesión.</Option>
    <Option>Porque la pantalla de ingreso se elimina de la pila al desmontarse.</Option>
  </Question>
  <Question title="Las políticas siguen en «to anon» y el usuario inicia sesión. ¿Qué ve en la lista de contactos?">
    <Option>Todos los contactos, porque tener sesión da más permisos.</Option>
    <Option>Un error 401 de la API.</Option>
    <Option correct>Una lista vacía sin error: ahora su rol es authenticated y las políticas to anon no le aplican.</Option>
    <Option>Solo los contactos que él mismo creó.</Option>
  </Question>
  <Question title="¿Qué cambia respecto a la semana 14 al reemplazar las políticas por «to authenticated»?">
    <Option>Que la tabla deja de tener RLS activado.</Option>
    <Option>Que la llave publishable ya no funciona.</Option>
    <Option correct>Que un visitante sin sesión ya no puede leer ni escribir; solo los usuarios con sesión.</Option>
    <Option>Que cada usuario ve automáticamente solo sus propias filas.</Option>
  </Question>
  <Question title="Con las políticas «to authenticated» y «using (true)», ¿qué ve cada usuario autenticado?">
    <Option>Solo sus propios contactos.</Option>
    <Option correct>Todos los contactos de la tabla; para limitarlos hace falta una columna user_id y la condición auth.uid() = user_id.</Option>
    <Option>Ninguno, hasta que el administrador lo apruebe.</Option>
    <Option>Solo los creados en la última hora.</Option>
  </Question>
</Quiz>
