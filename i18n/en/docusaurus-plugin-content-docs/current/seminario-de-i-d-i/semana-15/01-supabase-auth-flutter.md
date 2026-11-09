---
sidebar_position: 1
description: "Authentication with Supabase Auth in Flutter: authentication versus authorization, Supabase's modules, sign up and sign in, a screen guard, and moving RLS policies from anon to authenticated."
---

# Authentication with Supabase Auth

In week 14 the agenda got connected to Supabase, but with an open door: the policies on the `contactos` table were **"to anon"**, meaning anyone holding the publishable key (which ships inside the app) could read and modify everything. Today we close that door: the app will ask for a **username and password**, and only someone who has signed in will be able to use the agenda.

In this session we will cover:
* The difference between **authentication** and **authorization**.
* The **modules** Supabase offers and what you need to configure in the app and in the dashboard.
* How a **sign-up** and a **sign-in** request travels.
* The SDK methods: `signUp`, `signInWithPassword`, `signOut`, and the session state.
* A sign-in screen and a **guard** that decides which screen to show.
* Changing the **RLS** policies from `anon` to `authenticated`.

---

## 1. Authentication and authorization

They are two similar-sounding words that answer **two different questions**:

| | Question | In Supabase | Example |
|---|---|---|---|
| **Authentication** | Who are you? | **Supabase Auth**: sign-up, sign-in, session | Ana proves with her email and password that she is Ana |
| **Authorization** | What can you do? | **RLS** (database policies) | Ana can read her contacts, but not Luis's |

Choose who arrives and see what happens at each door:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/autenticacion-vs-autorizacion/index.html"
  title="Authentication versus authorization: the first confirms identity and hands out a session, the second decides which rows each user can see"
  height={560}
/>

:::note[Having a session is not having permission]
Being authenticated only means the system knows who you are. What you can see or change still depends on the policies. That is why this session has two parts: **signing in** (Auth) and **changing the policies** (RLS).
:::

---

## 2. Supabase's modules and what to configure

A Supabase project is a family of modules behind **a single client**. From the app, each module is a property of `Supabase.instance.client`:

| Module | From Flutter | What it is for |
|---|---|---|
| **Database** | `client.from('contactos')` | Tables and their REST API (week 14) |
| **Auth** | `client.auth` | Users, sign-in, session (**today**) |
| **Storage** | `client.storage` | Files and images (**next session**) |
| **Realtime** | `client.channel('sala')` | Live notifications when data changes |
| **Edge Functions** | `client.functions` | Server-side code |

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/modulos-supabase/index.html"
  title="Supabase's modules behind a single client and the two values the app configures: the URL and the publishable key"
  height={560}
/>

The good news: **there is nothing new to configure in the app**. The URL and publishable key from week 14 work for every module, and `Supabase.initialize` is already in `main()`. What changes today is in the **Supabase dashboard** and in the **code** that uses `client.auth`.

---

## 3. Configuring Auth in the dashboard

Open your project and go to **Authentication → Sign In / Providers**. The **Email** provider is already enabled, and under **User Signups** there are four switches:

![Supabase dashboard at Authentication, Sign In / Providers, with the sign-up switches and Confirm email turned on](/img/seminario-de-i-d-i/semana-15/auth-providers-signups.png)

The one that matters most today is **Confirm email**:

* **On** (the default): when someone signs up, Supabase sends an email with a link, and the user **cannot sign in until they confirm it**. This is the right setting for a real app.
* **Off**: sign-up returns the session right away. This is convenient for practice in class because you do not depend on opening emails.

For this session, **turn it off** and press **Save changes**. The dashboard will show the notice "Successfully updated settings":

![Supabase dashboard with Confirm email turned off and the settings-saved notice](/img/seminario-de-i-d-i/semana-15/auth-confirm-email-off.png)

:::warning[Turn it back on in a real app]
Without confirmation, anyone can sign up with an email address that is not theirs. For the class exercise it is acceptable; for a published app, it is not.
:::

---

## 4. How an authentication request travels

Before the code, it helps to see the whole journey. There are **three moments**: signing up (`signUp`), signing in (`signInWithPassword`), and requesting data once you have a session. Watch what changes in the request during the last one:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/peticion-auth/index.html"
  title="The authentication journey: sign-up, sign-in with a JWT, and a data request with the authenticated role, with switches for Confirm email and for requesting data without a session"
  height={640}
/>

The ideas to keep:

* The password is **never stored as-is**: Supabase Auth stores a *hash* and compares against it at sign-in.
* Signing in returns a **JWT** (`access_token`, valid for about 1 hour) and a `refresh_token`. The SDK stores them and renews the JWT on its own, which is why the session survives even if you close the app.
* From then on, **every request** carries the JWT in the `Authorization: Bearer …` header. That is what lets Postgres know **who** is asking for the data.
* The two places involved in Supabase: users live in the `auth` schema (which you **never** touch from the app) and your data lives in `public`.

---

## 5. The SDK methods

Everything about authentication lives in `Supabase.instance.client.auth`. Following the week 14 architecture, we wrap it in a **service** so the screens do not import `supabase_flutter`:

```dart title="lib/services/auth_service.dart"
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  final _auth = Supabase.instance.client.auth;

  // Is someone signed in? null = nobody.
  Session? get sesion => _auth.currentSession;

  // Notifies every time someone signs in or out.
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

| Method | What it does | What it returns |
|---|---|---|
| `signUp(email:, password:)` | Creates the user | `AuthResponse` with `user` and, if the email is not confirmed, `session` |
| `signInWithPassword(email:, password:)` | Checks the password and opens the session | `AuthResponse` with `session` |
| `signOut()` | Closes the session and deletes the stored JWT | `void` |
| `currentSession` / `currentUser` | The current session or user, without going over the network | `Session?` / `User?` |
| `onAuthStateChange` | A `Stream` that emits when the session changes | `AuthState` (`event` and `session`) |

* The methods fail by throwing **`AuthException`**, with a readable `message`: "Invalid login credentials", "User already registered", "Password should be at least 6 characters".
* With **Confirm email** on, `signUp` does **not** return a session (`session == null`): the app should say "check your email".

---

## 6. The sign-in screen

A single screen with two fields and two buttons. It reuses what you have already seen: `TextEditingController`, `setState`, and the **loading** and **error** states from week 14.

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
      // No Navigator: the guard (section 7) switches screens by itself.
    } on AuthException catch (e) {
      if (!mounted) return;
      setState(() => _error = e.message);
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'No connection');
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
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: _password,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
            ),
            const SizedBox(height: 16),
            if (_error != null)
              Text(_error!, style: const TextStyle(color: Colors.red)),
            if (_cargando)
              const CircularProgressIndicator()
            else ...[
              FilledButton(
                onPressed: () => _enviar(registro: false),
                child: const Text('Sign in'),
              ),
              TextButton(
                onPressed: () => _enviar(registro: true),
                child: const Text('Create account'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
```

* `obscureText: true` hides the password while it is typed.
* `.trim()` on the email avoids the classic error of a trailing space.
* The `AuthException` catch shows Supabase's message; the generic one covers a missing network.
* **There is no `Navigator.push`** after signing in. It looks odd, but it is the best practice: the **guard** decides which screen is correct.

---

## 7. The guard: which screen to show

The **guard** (*auth gate*) is a widget that listens to `onAuthStateChange` and shows either the sign-in screen or the agenda depending on whether there is a session:

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

And in `main.dart`, the guard replaces the initial page:

```dart title="lib/main.dart"
runApp(const MaterialApp(home: AuthGate()));
```

With that:
* When the app opens, `servicio.sesion` already carries the stored session: if the user had signed in before, they go **straight to the agenda**.
* When signing in, the `Stream` emits and the guard switches to `ContactosPage` without anyone calling `Navigator`.
* When signing out, the opposite happens. All that is missing is a button in the agenda:

```dart title="lib/pages/contactos_page.dart"
appBar: AppBar(
  title: const Text('Agenda'),
  actions: [
    IconButton(
      icon: const Icon(Icons.logout),
      tooltip: 'Sign out',
      onPressed: () => AuthService().cerrarSesion(),
    ),
  ],
),
```

---

## 8. From "anon" to "authenticated": the policies

Run the app now and you will see something baffling: you sign up, you reach the agenda… and **the list is empty** even though the table has contacts. There is no error. Why?

The week 14 policies said **`to anon`**. But once you sign in, the request stops being anonymous and arrives with the **`authenticated`** role: as far as Postgres is concerned, those policies no longer apply to it. Try all four combinations:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/rls-anon-vs-authenticated/index.html"
  title="A request arrives with the anon or authenticated role depending on whether it has a session; the RLS policy applies only to the role it names and, if they do not match, the query returns an empty list"
  height={620}
/>

### 8.1. The starting point

In the dashboard, **Database → Policies**. These are the four week 14 policies, all applied to `anon`:

![Supabase dashboard at Database, Policies, with the four demo policies of the contactos table applied to the anon role](/img/seminario-de-i-d-i/semana-15/policies-antes-anon.png)

### 8.2. Replacing them with policies for `authenticated`

Open the **SQL Editor** and run this. The `anon` policies are dropped and new ones are created, identical except for the role:

```sql title="SQL Editor"
-- 1. Remove the policies open to anonymous users
drop policy "demo: leer"   on public.contactos;
drop policy "demo: crear"  on public.contactos;
drop policy "demo: editar" on public.contactos;
drop policy "demo: borrar" on public.contactos;

-- 2. Create the equivalent ones, only for signed-in users
create policy "autenticados: leer"   on public.contactos
  for select to authenticated using (true);
create policy "autenticados: crear"  on public.contactos
  for insert to authenticated with check (true);
create policy "autenticados: editar" on public.contactos
  for update to authenticated using (true) with check (true);
create policy "autenticados: borrar" on public.contactos
  for delete to authenticated using (true);
```

:::info[A normal warning]
The SQL Editor shows "Potential issue detected: this query includes destructive operations" because of the `drop policy` statements. That is exactly what you want here: you are deleting **policies**, not data. Confirm with **Run query**.
:::

When it finishes, the policies screen shows the same set, now for **`authenticated`**:

![Supabase dashboard at Database, Policies, with the four policies of the contactos table applied to the authenticated role](/img/seminario-de-i-d-i/semana-15/policies-despues-authenticated.png)

What changes in practice:
* A **visitor without a session** can no longer read or write anything.
* A **user with a session** does the CRUD as in week 14.
* The publishable key can stay in the app: by itself it no longer grants access to the data.

### 8.3. Next level: each user sees only their own data

With `using (true)`, **every** authenticated user sees **every** contact. For each user to see their own, the table has to know whose each row is. Supabase offers `auth.uid()`, which returns the id of the user in the JWT:

```sql title="SQL Editor (optional)"
alter table public.contactos
  add column user_id uuid default auth.uid() references auth.users (id);

drop policy "autenticados: leer" on public.contactos;
create policy "propios: leer" on public.contactos
  for select to authenticated using ((select auth.uid()) = user_id);
```

* `default auth.uid()` fills `user_id` only on insert: the app does not send it.
* Rows that already existed end up with an empty `user_id` and **nobody sees them**. For the exercise, delete them or assign them to a user.
* The same is repeated for `insert`, `update`, and `delete`.

---

## 9. Common errors

| Symptom | Likely cause | What to check |
|---|---|---|
| `Invalid login credentials` | Wrong email or password, or the email is **unconfirmed** | Dashboard: **Authentication → Users**; the **Confirm email** option |
| `User already registered` | The email already exists | Sign in instead of signing up |
| `Password should be at least 6 characters` | Password too short | Minimum length in **Sign In / Providers** |
| After signing up, it does not reach the agenda | **Confirm email** is on: no session until the email is opened | Turn it off or show "check your email" |
| The agenda opens but the **list is empty**, with no error | The policies are still `to anon` and the user is already `authenticated` | **Database → Policies** (section 8) |
| `new row violates row-level security policy` when creating | The `insert` policy for `authenticated` is missing | Create it |
| I signed out and the app still shows the agenda | The guard does not listen to `onAuthStateChange` | `AuthGate` with `StreamBuilder` |
| `email rate limit exceeded` | Too many sign-ups in a short time from a free project | Wait or try another user |

---

## Self-Assessment Quiz

<Quiz id="seminario-s15-auth-quiz">
  <Question title="What question does authentication answer?">
    <Option>Which rows of the table can this user read?</Option>
    <Option correct>Who are you?</Option>
    <Option>How big is the file being uploaded?</Option>
    <Option>Which Supabase project does the app connect to?</Option>
  </Question>
  <Question title="In Supabase, which mechanism handles authorization (what each user can do)?">
    <Option>Supabase Auth, with the JWT it hands out at sign-in.</Option>
    <Option>The publishable key, which identifies each user.</Option>
    <Option correct>The RLS policies of each table.</Option>
    <Option>The app's env.json file.</Option>
  </Question>
  <Question title="What do you need to configure in the Flutter app to use Auth, beyond what you did in week 14?">
    <Option>A second key exclusive to Auth.</Option>
    <Option>A different URL for the authentication module.</Option>
    <Option correct>Nothing new: the same URL and publishable key work for every module; the change is in the dashboard and in the client.auth code.</Option>
    <Option>Reinstalling supabase_flutter from scratch.</Option>
  </Question>
  <Question title="What does Supabase Auth return when signing in successfully?">
    <Option>The user's password, to store it in the app.</Option>
    <Option>A list of all the users in the project.</Option>
    <Option correct>A session with an access_token (JWT) and a refresh_token.</Option>
    <Option>A new secret key for the user.</Option>
  </Question>
  <Question title="What does the SDK do with the JWT on later requests?">
    <Option>Nothing: requests keep carrying only the publishable key.</Option>
    <Option>It sends it in the body of every POST request.</Option>
    <Option correct>It adds it to the Authorization: Bearer header, so Postgres knows who is asking for the data.</Option>
    <Option>It stores it in the contactos table.</Option>
  </Question>
  <Question title="With “Confirm email” on, what does the signUp() response carry?">
    <Option>A complete session, ready to go in.</Option>
    <Option correct>The created user, but session is null until they confirm their email.</Option>
    <Option>An error, because you cannot sign up without confirming first.</Option>
    <Option>The password in plain text.</Option>
  </Question>
  <Question title="Which exception do the auth methods throw when something fails, such as a wrong password?">
    <Option>PostgrestException</Option>
    <Option>StorageException</Option>
    <Option correct>AuthException, with a readable message.</Option>
    <Option>FormatException</Option>
  </Question>
  <Question title="After signing in, the app switches to the agenda on its own without calling Navigator. Why?">
    <Option>Because signInWithPassword navigates by itself.</Option>
    <Option>Because Flutter detects the password change.</Option>
    <Option correct>Because the guard (AuthGate) listens to onAuthStateChange with a StreamBuilder and shows the screen depending on whether there is a session.</Option>
    <Option>Because the sign-in screen is removed from the stack when it is disposed.</Option>
  </Question>
  <Question title="The policies are still “to anon” and the user signs in. What do they see in the contact list?">
    <Option>All the contacts, because having a session grants more permissions.</Option>
    <Option>A 401 error from the API.</Option>
    <Option correct>An empty list with no error: their role is now authenticated and the to anon policies do not apply to them.</Option>
    <Option>Only the contacts they created themselves.</Option>
  </Question>
  <Question title="What changes compared with week 14 when you replace the policies with “to authenticated”?">
    <Option>RLS is no longer enabled on the table.</Option>
    <Option>The publishable key stops working.</Option>
    <Option correct>A visitor without a session can no longer read or write; only users with a session can.</Option>
    <Option>Each user automatically sees only their own rows.</Option>
  </Question>
  <Question title="With “to authenticated” policies and “using (true)”, what does each authenticated user see?">
    <Option>Only their own contacts.</Option>
    <Option correct>All the contacts in the table; to limit them you need a user_id column and the auth.uid() = user_id condition.</Option>
    <Option>None, until the administrator approves them.</Option>
    <Option>Only the ones created in the last hour.</Option>
  </Question>
</Quiz>
