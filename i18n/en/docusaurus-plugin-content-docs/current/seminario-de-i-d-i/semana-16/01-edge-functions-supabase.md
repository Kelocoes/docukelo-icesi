---
sidebar_position: 1
description: "Supabase Edge Functions with Flutter: what a cloud function is and how it compares with AWS Lambda, when to use one instead of RLS or the app, how to create and deploy a function from the dashboard (resumen-contactos), how it is protected, what to check when configuring it, and how to call it with functions.invoke."
---

# Edge Functions: Code in the Cloud with Supabase

The agenda already has data (**Database**), users (**Auth**), and photos (**Storage**). In all three cases the app talks **directly** to Supabase and the rules come from RLS policies. But some things **should not be done in the app**: a calculation that forces you to download all the data, a rule the user must not be able to bypass, a private key for another service. That is what **Edge Functions** are for: small programs that live in the cloud and that your app calls when it needs them.

In this session we will cover:
* What an **Edge Function** is, how it resembles **AWS Lambda**, and how it differs.
* When to use one instead of **RLS** or the app.
* **Creating and deploying** a function from the dashboard, with nothing to install: `resumen-contactos`.
* Who can call it: the **authentication modes**, and why a call without a session gets a 401.
* What to **check when configuring it** inside Supabase.
* **Calling it from Flutter** with `functions.invoke` and catching its errors.
* The **advantages and costs** of moving logic into a function.

---

## 1. What is an Edge Function?

An **Edge Function** is a small program, written in **TypeScript** and run by **Deno**, that Supabase deploys on servers spread around the world ("the edge"). There is no server to manage: the function **is not running all the time**; it runs when someone makes an HTTPS request to its URL:

```text
https://<your-project>.supabase.co/functions/v1/<function-name>
```

| Module | What it does | How the app uses it |
|---|---|---|
| **Database** | Stores the data | `from('contactos').select()` |
| **Auth** | Identifies the user | `auth.signInWithPassword()` |
| **Storage** | Stores files | `storage.from('fotos').uploadBinary()` |
| **Edge Functions** | **Runs your code** in the cloud | `functions.invoke('resumen-contactos')` |

:::info[Cold start]
Because the function is not switched on permanently, the **first call** after a period of inactivity can take a little longer than the following ones. In a class agenda you will barely notice it; in a system with heavy traffic, you will measure it.
:::

### 1.1. Is it the same as AWS Lambda?

**The idea is the same; the product is not.** Both an Edge Function and an **AWS Lambda function** are "functions as a service" (*serverless*): you write the code, the provider runs it on demand and charges (or deducts from your quota) per execution. What changes is **how much you control and how much comes ready-made**:

| | **AWS Lambda** | **Supabase Edge Function** |
|---|---|---|
| Languages | Many (Node.js, Python, Java, Go, .NET…) | **TypeScript / JavaScript** on Deno |
| Where it runs | In the AWS **region** you choose | **Spread around the world**, close to the caller |
| How you call it | You must expose it (API Gateway or a function URL) | **It already has a URL**: `/functions/v1/<name>` |
| Who can call it | You configure it with **IAM** and policies | Declared in the code: **user JWT**, key, or nobody (section 5) |
| Access to your data | You connect to the database yourself | It comes with a **Supabase client already configured** (`ctx`) |
| Configuration | A lot: memory, timeouts, network, permissions | **Little**: name, secrets, and a couple of switches |
| Best for | Anything inside the AWS ecosystem | Logic **attached to your Supabase project** |

In short: Lambda gives you **more control and more pieces to assemble**; an Edge Function gives you **less control and a lot already done**, because it already knows your database and your users.

---

## 2. When should you use a function?

Not every piece of logic needs a function: each one is **code to maintain, deploy, and monitor**. Before creating one, ask your requirement three questions. Each tab in the figure is a case from the agenda:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-16/donde-va-la-logica/index.html"
  title="Decision tree to place a rule of the agenda: in the app, in an RLS policy, in an Edge Function, or with a direct query, applied to five requirements"
  height={600}
/>

The ideas to remember:

* What **only changes what is shown** (disabling a button) goes in the **app**.
* What decides **who sees or writes which row** goes in an **RLS policy**: the database applies it by itself.
* What needs **a secret** (another service's key) or **a calculation over lots of data** goes in an **Edge Function**.
* If none of the above applies, the **direct query** with the SDK is enough.

:::danger[A validation that lives only in the app protects nothing]
Anyone with your URL and your publishable key can call the API **without going through your app**. Any business rule that must really hold has to run somewhere the client does not control.
:::

---

## 3. Today's example

We will build one function on the `contactos` table from week 14.

| Function | What it does | What the example is for |
|---|---|---|
| `resumen-contactos` | Counts the contacts **by email domain** and returns a small JSON. | The work happens in the cloud and the phone only receives the result. |

It requires a **user with a session**: the same session the app has had since week 15.

---

## 4. Creating the function: `resumen-contactos`

Everything is done from the dashboard, without installing the CLI.

1. Open your project and go to **Edge Functions**.
2. Under **Via Editor**, click **Open Editor**.
3. Delete the template code and paste the following.
4. Change the function name to `resumen-contactos` (at the bottom).
5. Click **Deploy function**.

```ts title="resumen-contactos / index.ts"
import { withSupabase } from "npm:@supabase/server@1";

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    // ctx.supabase applies the RLS policies of the user
    const { data, error } = await ctx.supabase
      .from("contactos").select("email");
    if (error) {
      return Response.json(
        { error: error.message }, { status: 400 });
    }

    // Group by domain: the counting happens here
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

![Supabase Edge Functions editor with the code of resumen-contactos](/img/seminario-de-i-d-i/semana-16/01-editor-resumen-contactos.png)

What each part does:

* `withSupabase({ auth: "user" }, …)` is a **wrapper** that checks **who is calling** before running your code and hands you a `ctx` object that is already configured.
* `ctx.supabase` is a client that acts **as the user** who called: the week 15 RLS policies still apply. If the user cannot see a row, neither can the function.
* `Response.json(...)` builds the HTTP response. What you return is what the app receives.

A few seconds later the function shows up in the list, with its URL:

![List of the project's Edge Functions with resumen-contactos deployed and its URL](/img/seminario-de-i-d-i/semana-16/03-lista-funciones.png)

:::warning[The dashboard editor does not keep versions]
If you change the code, click **Deploy updates** and confirm: it replaces the published function **and there is no automatic way back**. For anything more serious than a class exercise, keep the code in a repository and deploy with the Supabase CLI.
:::

---

## 5. Who can call it

A function has a public URL, so **it has to decide whom it serves**. `withSupabase` declares that with the `auth` option:

| Mode | Accepts | When |
|---|---|---|
| `"user"` | A **user JWT** (the one from `signInWithPassword`) | Functions the app uses with a session. **Today's mode.** |
| `"secret"` | The project's **secret** key | Another service, a cron job, or a worker calling your function. |
| `"publishable"` | The **publishable** key | Public functions that only identify the project. |
| `"none"` | Anyone, with no check | Webhooks signed by a third party (the function verifies the signature). |

In each function's **Settings** tab there is also the **Verify JWT with legacy secret** switch: it is a check by the **platform**, before your code. With it on, **the anonymous key also satisfies it**; that is why the function checks for itself, with `auth: "user"`, that the caller is a **person** and not just the project.

Inside the function there are **two Supabase clients**, and it pays to keep them apart:

| Client | Acts as | Respects RLS? |
|---|---|---|
| `ctx.supabase` | The **user** who called | **Yes** |
| `ctx.supabaseAdmin` | The **project** (secret key) | **No**: it bypasses RLS |

:::danger[With `supabaseAdmin`, you do the filtering]
`ctx.supabaseAdmin` **has no safety net**: a query without a filter returns **every user's rows**. Use it only when the rule needs it, and prefer `ctx.supabase` whenever you can. That is why today's function uses `ctx.supabase`.
:::

You can try the function without writing the app. In the top-right corner click **Test** and send the request as is: the dashboard sends only the key, **with no user session**.

![Supabase Test panel with the 401 response from the resumen-contactos function: UNUSABLE_CREDENTIAL](/img/seminario-de-i-d-i/semana-16/02-prueba-sin-sesion-401.png)

The response is a **401**, and the body explains it:

```json title="401 response from the function"
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

Look at `received`: an **apikey** (publishable) arrived but **no `authorization`**, that is, no user. From the app, that same request works because the SDK adds the session's JWT.

---

## 6. What to check when configuring it

Before calling a function finished, go through this list. Almost every problem with a deployed function comes from one of these points:

| What to check | Where | Why it matters |
|---|---|---|
| **The name** | When creating it | It is part of the URL (`/functions/v1/<name>`) and it is what the app writes in `invoke('…')`. |
| **The authentication mode** | In the code (`auth: "user"`) | It decides **who** can call it. Without it, anyone with the URL runs it. |
| **Verify JWT** | The function's **Settings** | It is a platform check; it **does not replace** yours. |
| **Which client you use** | `ctx.supabase` or `ctx.supabaseAdmin` | One respects RLS and the other does not. |
| **The secrets** | **Edge Functions → Secrets** | Other services' keys **never** go in the code (section 9). |
| **How it is deployed** | **Deploy function** / **Deploy updates** | The dashboard editor keeps no versions: a change replaces what is published. |
| **The logs** | The function's **Logs** tab | It is where you see why a call failed. |
| **The API limits** | **Integrations → Data API → Settings** | **Max rows** (1000 by default) also limits what the function reads. |
| **CORS** | Handled by `withSupabase` | It only matters if you call it from a browser (Flutter web). |

---

## 7. Calling it from Flutter

There is nothing to configure in the app: the same URL and publishable key from week 14 work. Following the week 14 architecture, we wrap the call in the **service**, so the screens do not know a function exists:

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

* `functions.invoke(name)` makes a `POST` to `/functions/v1/<name>` and adds the key and the session's JWT by itself.
* If the function answers **2xx**, `res.data` holds the already-decoded JSON.
* If it answers **any other code** (400, 401…), the SDK **throws** a `FunctionException` with `status` and the body in `details`. It does not return an "error value": you have to catch it with `try/catch`.
* If there is **no network**, `details` is not a map: that is why the `catch` checks `d is Map` before reading the message.

Follow a full call. Change **What happens** to see the three outcomes; the app's code and the function's code are highlighted at each step:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-16/del-boton-a-la-funcion/index.html"
  title="Walkthrough of a call to the resumen-contactos Edge Function between the Flutter app, the function, and Postgres, with three outcomes: a 200 response, no session (401), and no connection"
  height={680}
/>

| What happens | What the app sees | How to react |
|---|---|---|
| The function answers `200` | `res.data` with `total` and `porDominio` | Show the summary |
| `401` (no session or expired session) | `FunctionException`, status 401 | Go back to the sign-in screen |
| No connection | `FunctionException` whose `details` is not a map | Show "no connection" and allow a retry |

---

## 8. Advantages and costs

What do we gain by moving the summary into a function? Compare the **same summary** done both ways and move the slider:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-16/con-y-sin-funcion/index.html"
  title="Comparison between counting the contacts in the app, downloading every row, and doing it in an Edge Function that returns a small JSON; a slider changes the number of contacts"
  height={620}
/>

**Advantages**

* **Less data over the mobile network.** The phone receives the result, not every row (the figure uses approximate numbers: ~110 bytes per row).
* **Rules nobody can bypass.** What runs on the server cannot be modified from a client.
* **Secrets stay safe.** Private keys are kept on the server side, not inside the app installer.
* **One place.** The logic is written once and used by the mobile app, the web app, and any other client.

**Costs**

* **More pieces.** Each function is code to deploy, monitor, and maintain.
* **More latency.** There is an extra network hop and, after a while idle, the cold start.
* **Another security surface.** The function has its own public URL: you must decide whom it serves (section 5).

:::note[The 1000-row cap]
In **Integrations → Data API → Settings**, **Max rows** is **1000**: the API returns **at most 1000 rows per query**, to the app and to the function alike. For a class table it does not matter; with thousands of contacts today's summary would come out incomplete with no error at all, and you would have to paginate or group with SQL.
:::

---

## 9. Your own secrets

When a function needs a private key (for an email service, for instance), **do not write it in the code**. It is stored as a **secret** in **Edge Functions → Secrets** and the function reads it from the environment:

![Edge Functions Secrets section in Supabase, with the form to add a secret and an empty list of custom secrets](/img/seminario-de-i-d-i/semana-16/04-secrets.png)

```ts title="Reading a secret in the function"
// Example: another service's key, never inside the code
const llave = Deno.env.get("RESEND_API_KEY");
```

The app **never sees** the secret: it only calls the function. The project's own keys (`SUPABASE_URL` and the publishable and secret keys) are already available to the function without you configuring them: they are the ones `withSupabase` uses internally.

---

## 10. Common errors

| Symptom | Likely cause | What to check |
|---|---|---|
| `401` with `UNUSABLE_CREDENTIAL` | You called **without a session** (or from the **Test** panel), with `auth: "user"` | Sign in on the app; the SDK adds the JWT by itself |
| `FunctionException` with status `404` | The name in `invoke('…')` does not match the function's, or it is not deployed | **Edge Functions**: exact name, and that it appears in the list |
| I changed the code and the app stays the same | The editor keeps drafts, but does not deploy | Click **Deploy updates** and confirm |
| `500` right on the call, with no message of yours | Syntax or import error on startup | The function's **Logs** tab |
| `type 'Null' is not a subtype…` when using `res.data` | The function answered something different from what the service expects | Check the JSON in **Test** and the field names |
| The error message comes out empty with no internet | Without a network, `details` is not a map | Check `d is Map`, as the service does |
| The summary comes out incomplete with many contacts | **Max rows** (1000 rows per query) | Section 8: paginate or group with SQL |

---

## Self-Assessment Quiz

<Quiz id="seminario-s16-edge-functions-quiz">
  <Question title="What is a Supabase Edge Function?">
    <Option>A special Postgres table that stores code.</Option>
    <Option>An RLS policy written in TypeScript.</Option>
    <Option correct>A small program (TypeScript on Deno) that Supabase runs in the cloud, on demand, when someone calls its URL.</Option>
    <Option>A server you have to keep switched on all the time.</Option>
  </Question>
  <Question title="How is an Edge Function similar to an AWS Lambda function?">
    <Option>Both use IAM to decide who calls them.</Option>
    <Option>Both always run in the same region you choose.</Option>
    <Option correct>Both are serverless functions: you write the code and the provider runs it on demand, with no server to manage.</Option>
    <Option>Both accept any programming language.</Option>
  </Question>
  <Question title="You want each user to see only the contacts they created. Where does that rule go?">
    <Option>In the Flutter app, filtering the list before showing it.</Option>
    <Option correct>In an RLS policy on the table: the database applies it on every query.</Option>
    <Option>In an Edge Function that downloads every contact and filters them.</Option>
    <Option>In the app's env.json file.</Option>
  </Question>
  <Question title="Why is a business rule that only exists in the app not enough?">
    <Option>Because Flutter cannot run conditions.</Option>
    <Option>Because the rule in the app is slower.</Option>
    <Option correct>Because anyone who knows the URL and the publishable key can call the API without going through the app, bypassing that rule.</Option>
    <Option>Because Supabase deletes data the client validates.</Option>
  </Question>
  <Question title="What does the auth option with the value user do in withSupabase?">
    <Option>It accepts any request that carries the publishable key.</Option>
    <Option correct>It requires a valid user JWT; if it is missing, it answers 401 without running your code.</Option>
    <Option>It requires the user to be a project administrator.</Option>
    <Option>It turns off RLS policies for that function.</Option>
  </Question>
  <Question title="Inside a function, what is the difference between ctx.supabase and ctx.supabaseAdmin?">
    <Option>There is no difference: they are two names for the same client.</Option>
    <Option>ctx.supabase only reads and ctx.supabaseAdmin only writes.</Option>
    <Option correct>ctx.supabase acts as the user and respects RLS; ctx.supabaseAdmin uses the secret key and bypasses RLS.</Option>
    <Option>ctx.supabaseAdmin travels in the app so the user can delete data.</Option>
  </Question>
  <Question title="The function answers 401 because the user has no session. What does the Flutter app receive?">
    <Option>A res.data with the error field and execution carries on normally.</Option>
    <Option>A null value in res.data.</Option>
    <Option correct>A FunctionException with status 401 and the body in details, which you must catch with try/catch.</Option>
    <Option>Nothing: the SDK retries until the function answers 200.</Option>
  </Question>
  <Question title="Where is the private key of an external service used by a function stored?">
    <Option>In a constant inside the Flutter app's code.</Option>
    <Option>In a column of the contactos table.</Option>
    <Option correct>As a secret in Edge Functions → Secrets, and the function reads it with Deno.env.get.</Option>
    <Option>In the project's publishable key.</Option>
  </Question>
</Quiz>
