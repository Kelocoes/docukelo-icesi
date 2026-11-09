---
sidebar_position: 2
description: "Supabase Storage in Flutter with a public bucket: what a bucket is and which files it accepts, how to create and configure it, uploading a photo with uploadBinary, saving its path, and showing it with getPublicUrl and Image.network."
---

# Files with Supabase Storage

The agenda's contacts already have data and, since the last session, **owners**. Something every real agenda has is still missing: **the photo**. An image does not fit well in a text column; files (photos, PDFs, video) are stored separately, in a service built for that: **Supabase Storage**.

In this session we will cover:
* What **Storage** is, what a **bucket** is, and which file types it accepts.
* Creating and configuring a **public bucket** in the dashboard.
* The **upload policy**: public does not mean anyone can upload.
* **Uploading** a photo from the app with `uploadBinary` and saving its **path** in the table.
* **Getting** the URL and **showing** the image with `Image.network`.

---

## 1. What is Storage?

**Supabase Storage** is the file storage module. Think of it as a disk in the cloud that your app can use and that behaves like the rest of Supabase (same client, same RLS policies).

* It is organized into **buckets**: top-level folders that you create and name ("fotos", "documentos"). Each bucket has **its own rules**.
* Inside a bucket are the **objects**: the files. Their name can include "folders" (`contactos/ana.png`).
* It accepts **any file type**: images, video, audio, PDF, spreadsheets… Each file is described by its **MIME type** (`image/png`, `application/pdf`, `video/mp4`) and its size.

A bucket decides three things:

| Rule | What it controls | In our bucket |
|---|---|---|
| **Public or private** | Whether anyone can **read** the files through their URL | Public |
| **Maximum size** | How much a file may weigh | 2 MB |
| **Allowed types** | Which MIME types are accepted | `image/*` (images only) |

Choose a file and see which bucket rules accept or reject it:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/bucket-reglas/index.html"
  title="A file is compared with the rules of a public bucket: allowed type image/* and a 2 MB maximum size"
  height={560}
/>

:::info[Why not store the image in the table]
Postgres can store bytes (`bytea`), but images are heavy, fill up the database, and are served poorly. The right pattern is: **the file goes to Storage and the table keeps only its path** (a short text). That way the table stays light and Storage takes care of serving the image.
:::

---

## 2. Creating the bucket in the dashboard

Open **Storage** in the side menu. A new project has no buckets:

![Supabase dashboard at Storage, Files, with no buckets and the New bucket button](/img/seminario-de-i-d-i/semana-15/storage-sin-buckets.png)

Press **New bucket** and configure it like this:

![Create file bucket dialog with the name fotos, a public bucket, a 2 MB limit, and allowed types image/*](/img/seminario-de-i-d-i/semana-15/storage-crear-bucket.png)

| Field | Value | Why |
|---|---|---|
| **Bucket name** | `fotos` | It is the name the code will use. It **cannot be changed** later |
| **Public bucket** | On | Anyone can **read** the files through their URL, without a session |
| **Restrict file size** | `2` MB | Avoids uploading huge photos that fill the free plan |
| **Restrict MIME types** | `image/*` | Images only: rejects PDF, video, etc. |

Press **Create**. Note the orange warning that appears when you turn on *Public bucket*:

> **Public buckets are not protected.** Users can read objects in public buckets without any authorization. Row level security (RLS) policies are still required for other operations such as object uploads and deletes.

That sentence sums up the next section: **public opens only reading**.

---

## 3. The upload policy

With the bucket public, anyone can **see** an image if they know its URL. But **uploading**, **replacing**, or **deleting** files is still protected by RLS, just like tables, and is governed by policies on the internal `storage.objects` table.

Without an `insert` policy, trying to upload a photo fails with *"new row violates row-level security policy"*. Create it in the **SQL Editor**:

```sql title="SQL Editor"
create policy "fotos: subir autenticados"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos');
```

* `on storage.objects` is the table where Storage records each file.
* `to authenticated`: only someone who **signed in** (previous session) can upload.
* `with check (bucket_id = 'fotos')`: the rule applies **only to this bucket**, not to others you create later.

What stays **open** and what is **protected**:

| Operation | Who can? | Why |
|---|---|---|
| **See** a photo with its URL | Anyone | The bucket is public |
| **Upload** a photo | Users with a session | `insert` policy |
| **Replace** or **delete** | Nobody, yet | There are no `update` or `delete` policies |

:::warning[Public means anyone can see the URL]
Whoever has a photo's URL (even without an account) can see it, and the URL is predictable if the name is. Use public buckets for **non-sensitive** content (avatars, logos). For private documents you use a private bucket with temporary signed URLs, which is outside the scope of this course.
:::

---

## 4. Uploading files from Flutter

### 4.1. Saving the path in the table

First the table needs a place for the photo's path. In the **SQL Editor**:

```sql title="SQL Editor"
alter table public.contactos add column foto_path text;
```

It is a text column that can be empty (a contact may have no photo). If you want the path to be **editable** from the app, remember that the table's `update` policies already allow it for authenticated users.

Add it to the week 14 model as well:

```dart title="lib/models/contacto.dart"
class Contacto {
  final int? id;
  final String nombre;
  final String email;
  final String? fotoPath; // path inside the bucket, or null

  const Contacto({this.id, required this.nombre, required this.email, this.fotoPath});

  factory Contacto.fromMap(Map<String, dynamic> m) => Contacto(
        id: m['id'] as int,
        nombre: m['nombre'] as String,
        email: m['email'] as String,
        fotoPath: m['foto_path'] as String?,
      );

  Map<String, dynamic> toMap() =>
      {'nombre': nombre, 'email': email, 'foto_path': fotoPath};
}
```

### 4.2. Picking an image

To take a photo from the gallery you use the [`image_picker`](https://pub.dev/packages/image_picker) package:

```bash
flutter pub add image_picker
```

It returns an `XFile` (or `null` if the user cancels):

```dart title="lib/pages/contacto_form.dart"
final picker = ImagePicker();
final XFile? foto = await picker.pickImage(
  source: ImageSource.gallery,
  maxWidth: 800, // reduces the size before uploading
);
if (foto == null) return; // cancelled
```

:::note[Permissions]
On **Android** the gallery needs no permissions when using the system picker. On **iOS** you must add `NSPhotoLibraryUsageDescription` to `Info.plist` with the reason. On **web** it works without any configuration.
:::

### 4.3. The file service layer

Following the week 14 architecture, the Storage code goes in a service, not in the widgets:

```dart title="lib/services/foto_service.dart"
import 'package:image_picker/image_picker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class FotoService {
  final _bucket = Supabase.instance.client.storage.from('fotos');

  /// Uploads the photo and returns its path inside the bucket.
  Future<String> subir(XFile foto) async {
    final bytes = await foto.readAsBytes();
    // Unique name: avoids overwriting photos that share a name
    final ruta = 'contactos/${DateTime.now().millisecondsSinceEpoch}_${foto.name}';
    await _bucket.uploadBinary(ruta, bytes);
    return ruta;
  }

  /// Builds the public URL. It does not use the network.
  String urlPublica(String ruta) => _bucket.getPublicUrl(ruta);
}
```

* `storage.from('fotos')` selects the bucket, just as `from('contactos')` selects the table.
* **`uploadBinary(ruta, bytes)`** uploads the bytes. It is preferred over `upload(ruta, File)` because it also works on **web**, where `dart:io` does not exist.
* Storage infers the MIME type from the name's **extension**. If you ever need to force it: `fileOptions: const FileOptions(contentType: 'image/png')`.
* The name includes the time (`millisecondsSinceEpoch`) so that it is unique. If you upload the same path twice, the second one fails with *"The resource already exists"* (unless you use `upsert: true`, which also requires `update` policies).
* You do not have to create the "folders" (`contactos/`): they are just part of the name.

### 4.4. Uploading and saving the path

When creating or editing a contact, the photo is uploaded first and then its path is saved together with the rest of the data:

```dart title="lib/pages/contacto_form.dart"
Future<void> _guardar() async {
  final fotoService = FotoService();
  String? ruta = _contacto?.fotoPath; // the photo it already had
  if (_fotoElegida != null) {
    ruta = await fotoService.subir(_fotoElegida!);
  }
  await ContactoService().crear(
    Contacto(nombre: _nombre.text, email: _email.text, fotoPath: ruta),
  );
}
```

A failed upload throws **`StorageException`** (with `message` and `statusCode`: 413 if it is too heavy, 415 if it is not an image, 403 if the policy is missing). You catch it with `on StorageException catch (e)`, just like `AuthException` and `PostgrestException` in the previous sessions.

---

## 5. Getting and showing the image

### 5.1. The public URL

Every file in a public bucket has a URL with a fixed shape. Focus on each part, and compare it with a private bucket's URL:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/anatomia-url-publica/index.html"
  title="The parts of a Supabase Storage file URL: project, service, public or signed, bucket, and file path"
  height={700}
/>

That is why `getPublicUrl(ruta)` **does not need the network**: it only concatenates text. The full URL of our photo is:

```text
https://tu-proyecto.supabase.co/storage/v1/object/public/fotos/contactos/ana.png
```

Paste it in the browser: the image shows **without a key or a session**. That is the difference from the database, where every request needs the key.

### 5.2. Drawing it with `Image.network`

`Image.network` downloads the image from a URL and draws it. It is worth handling the **three states** you already know: loading, error, and ready:

```dart title="lib/widgets/foto_contacto.dart"
class FotoContacto extends StatelessWidget {
  const FotoContacto({super.key, required this.ruta, this.radio = 28});

  final String? ruta;
  final double radio;

  @override
  Widget build(BuildContext context) {
    if (ruta == null) {
      return CircleAvatar(radius: radio, child: const Icon(Icons.person));
    }
    final url = FotoService().urlPublica(ruta!);
    return ClipOval(
      child: Image.network(
        url,
        width: radio * 2,
        height: radio * 2,
        fit: BoxFit.cover,
        loadingBuilder: (context, child, progreso) =>
            progreso == null ? child : const CircularProgressIndicator(),
        errorBuilder: (context, error, stack) => const Icon(Icons.broken_image),
      ),
    );
  }
}
```

* With no path (`null`) a generic avatar is drawn: a contact may have no photo.
* `loadingBuilder` shows the indicator while the bytes arrive; when `progreso` is `null`, the image is already there.
* `errorBuilder` covers a bad URL, a deleted image, or a missing network.
* `fit: BoxFit.cover` crops the image to fill the circle without distorting it.

Use it in the agenda list:

```dart title="lib/pages/contactos_page.dart"
ListTile(
  leading: FotoContacto(ruta: c.fotoPath),
  title: Text(c.nombre),
  subtitle: Text(c.email),
)
```

### 5.3. The full cycle

Follow a photo from the moment it is uploaded until it appears on screen. The switch removes the upload policy so you can see the most common error:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/subir-y-mostrar/index.html"
  title="The cycle of a contact photo with Supabase Storage between the Flutter app, Storage, and Postgres: upload with uploadBinary, save the path, build the public URL, and show the image"
  height={700}
/>

And in the dashboard, the upload looks like this inside the bucket (marked **PUBLIC**):

![Supabase dashboard at Storage, the fotos bucket marked as public, with an uploaded file](/img/seminario-de-i-d-i/semana-15/storage-bucket-archivo.png)

From that dashboard view you can also **upload files by hand** (*Upload files*), create folders, and copy each file's URL: it is the best way to check that the bucket works before writing a single line of Dart.

---

## 6. Deleting a photo (optional)

To remove a file you use `remove`, which takes a **list** of paths:

```dart title="lib/services/foto_service.dart"
Future<void> borrar(String ruta) => _bucket.remove([ruta]);
```

It requires a `delete` policy on `storage.objects`. Without it, the call **throws no error** but deletes nothing either (just like a table `delete()` with no policy):

```sql title="SQL Editor"
create policy "fotos: borrar autenticados"
  on storage.objects for delete to authenticated
  using (bucket_id = 'fotos');
```

:::tip[Delete the file first or the row first]
If you delete the contact and forget the file, an orphan image is left taking up space. A good routine is to delete the **file** and then the **row**; if the file no longer exists, the row can still be deleted.
:::

---

## 7. Common errors

| Symptom | Likely cause | What to check |
|---|---|---|
| `new row violates row-level security policy` when uploading | The `insert` policy on `storage.objects` is missing, or the user has no session | Section 3; that `AuthGate` provides a session |
| `Bucket not found` (404) | Bucket name misspelled in `from('fotos')` | Spelling and capitalization |
| `The resource already exists` (409) | The same path was uploaded twice | Unique name with `DateTime.now()` |
| `mime type … is not supported` (415) | The bucket only allows `image/*` and something else was uploaded | The bucket's allowed types |
| `The object exceeded the maximum allowed size` (413) | The photo weighs more than the bucket's limit | `maxWidth` in `pickImage`; the bucket's limit |
| The URL answers **400** or "Bucket not found" in the browser | The bucket is **not public** | The *Public bucket* switch |
| A broken-image icon shows | Path saved wrongly in `foto_path`, or the file was deleted | Compare the table's path with the dashboard's |
| The image does not change after replacing it | The browser or `Image.network` keep a cached copy | Use a new name on every upload |
| The upload fails on **web** with `dart:io` | `upload(ruta, File)` was used | Switch to `uploadBinary(ruta, bytes)` |

---

## Self-Assessment Quiz

<Quiz id="seminario-s15-storage-quiz">
  <Question title="What is a bucket in Supabase Storage?">
    <Option>A special Postgres table for storing bytes.</Option>
    <Option>A key that grants access to the files.</Option>
    <Option correct>A top-level folder with its own name and its own rules (public or private, maximum size, allowed types).</Option>
    <Option>A type of compressed file.</Option>
  </Question>
  <Question title="Which file types can Storage hold?">
    <Option>Images only.</Option>
    <Option>Images and PDFs only.</Option>
    <Option correct>Any type (images, video, audio, PDF…); each bucket can restrict the ones it accepts using MIME types.</Option>
    <Option>Text files only.</Option>
  </Question>
  <Question title="Why does the table store only the photo's path and not the image?">
    <Option>Because Postgres cannot store images in any way.</Option>
    <Option>Because Flutter does not allow reading images from a table.</Option>
    <Option correct>Because images are heavy: the file goes to Storage and the table keeps a short text that locates it.</Option>
    <Option>Because that way the image becomes private automatically.</Option>
  </Question>
  <Question title="With a public bucket, which operation still needs an RLS policy?">
    <Option>Seeing the image with its URL.</Option>
    <Option>Getting the URL with getPublicUrl.</Option>
    <Option correct>Uploading, replacing, or deleting files.</Option>
    <Option>None: public means full access.</Option>
  </Question>
  <Question title="On which table are Storage policies written?">
    <Option>public.contactos</Option>
    <Option>auth.users</Option>
    <Option correct>storage.objects</Option>
    <Option>storage.fotos</Option>
  </Question>
  <Question title="In the upload policy, what is with check (bucket_id = 'fotos') for?">
    <Option>For the policy to apply to every bucket.</Option>
    <Option>To validate that the file is an image.</Option>
    <Option correct>So that the rule applies only to the “fotos” bucket and not to others.</Option>
    <Option>To change the file's name when uploading it.</Option>
  </Question>
  <Question title="Why is uploadBinary(ruta, bytes) preferred over upload(ruta, File)?">
    <Option>Because it is faster on Android.</Option>
    <Option correct>Because it also works on Flutter Web, where dart:io does not exist.</Option>
    <Option>Because it does not need a session.</Option>
    <Option>Because it compresses the image automatically.</Option>
  </Question>
  <Question title="What does getPublicUrl(ruta) do?">
    <Option>It downloads the image and returns its bytes.</Option>
    <Option>It makes a request to Storage to check that the file exists.</Option>
    <Option correct>It builds the URL text (project, service, bucket, and path) without using the network.</Option>
    <Option>It creates a temporary URL that expires in an hour.</Option>
  </Question>
  <Question title="A user uploads a PDF to a bucket that only allows image/*. What happens?">
    <Option>It uploads anyway, but cannot be viewed.</Option>
    <Option>It is automatically converted into an image.</Option>
    <Option correct>Storage rejects the upload (error 415, type not allowed) and the app receives a StorageException.</Option>
    <Option>It is saved to a different bucket.</Option>
  </Question>
  <Question title="A file with the same path is uploaded twice, without upsert. What happens on the second upload?">
    <Option>It replaces the previous file without warning.</Option>
    <Option>It is saved with a number added to the end of the name.</Option>
    <Option correct>It fails because the resource already exists; that is why unique names are used, for example with the time.</Option>
    <Option>The user's account gets locked.</Option>
  </Question>
</Quiz>
