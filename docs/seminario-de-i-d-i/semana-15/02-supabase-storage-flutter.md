---
sidebar_position: 2
description: "Supabase Storage en Flutter con un bucket público: qué es un bucket y qué archivos acepta, cómo crearlo y configurarlo, subir una foto con uploadBinary, guardar su ruta y mostrarla con getPublicUrl e Image.network."
---

# Archivos con Supabase Storage

Los contactos de la agenda ya tienen datos y, desde la sesión anterior, **dueños**. Falta algo que cualquier agenda real tiene: **la foto**. Una imagen no cabe bien en una columna de texto; los archivos (fotos, PDF, video) se guardan aparte, en un servicio pensado para eso: **Supabase Storage**.

En esta sesión cubriremos:
* Qué es **Storage**, qué es un **bucket** y qué tipos de archivo acepta.
* Crear y configurar un **bucket público** en el panel.
* La **política de subida**: público no significa que cualquiera pueda subir.
* **Subir** una foto desde la app con `uploadBinary` y guardar su **ruta** en la tabla.
* **Obtener** la URL y **mostrar** la imagen con `Image.network`.

---

## 1. ¿Qué es Storage?

**Supabase Storage** es el módulo de almacenamiento de archivos. Piensa en un disco en la nube que tu app puede usar y que se comporta como el resto de Supabase (mismo cliente, mismas políticas RLS).

* Se organiza en **buckets**: carpetas de primer nivel que tú creas y nombras («fotos», «documentos»). Cada bucket tiene **sus propias reglas**.
* Dentro de un bucket están los **objetos**: los archivos. Su nombre puede incluir «carpetas» (`contactos/ana.png`).
* Acepta **cualquier tipo de archivo**: imágenes, video, audio, PDF, hojas de cálculo… Cada archivo se describe con su **tipo MIME** (`image/png`, `application/pdf`, `video/mp4`) y su tamaño.

Un bucket decide tres cosas:

| Regla | Qué controla | En nuestro bucket |
|---|---|---|
| **Público o privado** | Si cualquiera puede **leer** los archivos con su URL | Público |
| **Tamaño máximo** | Cuánto puede pesar un archivo | 2 MB |
| **Tipos permitidos** | Qué tipos MIME se aceptan | `image/*` (solo imágenes) |

Elige un archivo y mira qué reglas del bucket lo aceptan o lo rechazan:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/bucket-reglas/index.html"
  title="Un archivo se compara con las reglas de un bucket público: tipo permitido image/* y tamaño máximo de 2 MB"
  height={560}
/>

:::info[Por qué no guardar la imagen en la tabla]
Postgres puede guardar bytes (`bytea`), pero las imágenes pesan, llenan la base de datos y se sirven peor. El patrón correcto es: **el archivo va a Storage y la tabla guarda solo su ruta** (un texto corto). Así la tabla sigue siendo ligera y Storage se encarga de servir la imagen.
:::

---

## 2. Crear el bucket en el panel

Abre **Storage** en el menú lateral. Un proyecto nuevo no tiene buckets:

![Panel de Supabase en Storage, Files, sin ningún bucket y con el botón New bucket](/img/seminario-de-i-d-i/semana-15/storage-sin-buckets.png)

Pulsa **New bucket** y configúralo así:

![Diálogo Create file bucket con el nombre fotos, el bucket público, límite de 2 MB y tipos permitidos image/*](/img/seminario-de-i-d-i/semana-15/storage-crear-bucket.png)

| Campo | Valor | Por qué |
|---|---|---|
| **Bucket name** | `fotos` | Es el nombre que usará el código. **No se puede cambiar** después |
| **Public bucket** | Activado | Cualquiera puede **leer** los archivos con su URL, sin sesión |
| **Restrict file size** | `2` MB | Evita subir fotos enormes que llenen el plan gratuito |
| **Restrict MIME types** | `image/*` | Solo imágenes: rechaza PDF, video, etc. |

Pulsa **Create**. Fíjate en el aviso naranja que aparece al activar *Public bucket*:

> **Public buckets are not protected.** Users can read objects in public buckets without any authorization. Row level security (RLS) policies are still required for other operations such as object uploads and deletes.

Esa frase resume la sección siguiente: **público abre solo la lectura**.

---

## 3. La política de subida

Con el bucket público, cualquiera puede **ver** una imagen si conoce su URL. Pero **subir**, **reemplazar** o **borrar** archivos sigue protegido por RLS, igual que las tablas, y se rige por políticas sobre la tabla interna `storage.objects`.

Sin una política de `insert`, intentar subir una foto falla con *«new row violates row-level security policy»*. Créala en el **SQL Editor**:

```sql title="SQL Editor"
create policy "fotos: subir autenticados"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos');
```

* `on storage.objects` es la tabla donde Storage registra cada archivo.
* `to authenticated`: solo quien **inició sesión** (sesión anterior) puede subir.
* `with check (bucket_id = 'fotos')`: la regla vale **solo para este bucket**, no para otros que crees después.

Qué queda **abierto** y qué **protegido**:

| Operación | ¿Quién puede? | Por qué |
|---|---|---|
| **Ver** una foto con su URL | Cualquiera | El bucket es público |
| **Subir** una foto | Usuarios con sesión | Política de `insert` |
| **Reemplazar** o **borrar** | Nadie, todavía | No hay políticas de `update` ni `delete` |

:::warning[Público significa que la URL la ve cualquiera]
Quien tenga la URL de una foto (aunque no tenga cuenta) puede verla, y la URL es predecible si el nombre lo es. Usa buckets públicos para contenido **no sensible** (avatares, logos). Para documentos privados se usa un bucket privado con URLs firmadas temporales, que queda fuera de este curso.
:::

---

## 4. Subir archivos desde Flutter

### 4.1. Guardar la ruta en la tabla

Primero la tabla necesita un lugar para la ruta de la foto. En el **SQL Editor**:

```sql title="SQL Editor"
alter table public.contactos add column foto_path text;
```

Es una columna de texto que puede estar vacía (un contacto puede no tener foto). Si quieres que se pueda **editar** la ruta desde la app, recuerda que las políticas de `update` de la tabla ya lo permiten a los usuarios autenticados.

Añádela también al modelo de la semana 14:

```dart title="lib/models/contacto.dart"
class Contacto {
  final int? id;
  final String nombre;
  final String email;
  final String? fotoPath; // ruta dentro del bucket, o null

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

### 4.2. Elegir una imagen

Para tomar una foto de la galería se usa el paquete [`image_picker`](https://pub.dev/packages/image_picker):

```bash
flutter pub add image_picker
```

Devuelve un `XFile` (o `null` si el usuario cancela):

```dart title="lib/pages/contacto_form.dart"
final picker = ImagePicker();
final XFile? foto = await picker.pickImage(
  source: ImageSource.gallery,
  maxWidth: 800, // reduce el tamaño antes de subir
);
if (foto == null) return; // canceló
```

:::note[Permisos]
En **Android** la galería no requiere permisos con el selector del sistema. En **iOS** hay que agregar `NSPhotoLibraryUsageDescription` al `Info.plist` con el motivo. En **web** funciona sin configuración.
:::

### 4.3. La capa de servicio de archivos

Siguiendo la arquitectura de la semana 14, el código de Storage va en un servicio, no en los widgets:

```dart title="lib/services/foto_service.dart"
import 'package:image_picker/image_picker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class FotoService {
  final _bucket = Supabase.instance.client.storage.from('fotos');

  /// Sube la foto y devuelve su ruta dentro del bucket.
  Future<String> subir(XFile foto) async {
    final bytes = await foto.readAsBytes();
    // Nombre único: evita pisar fotos con el mismo nombre
    final ruta = 'contactos/${DateTime.now().millisecondsSinceEpoch}_${foto.name}';
    await _bucket.uploadBinary(ruta, bytes);
    return ruta;
  }

  /// Arma la URL pública. No usa la red.
  String urlPublica(String ruta) => _bucket.getPublicUrl(ruta);
}
```

* `storage.from('fotos')` selecciona el bucket, igual que `from('contactos')` selecciona la tabla.
* **`uploadBinary(ruta, bytes)`** sube los bytes. Se prefiere a `upload(ruta, File)` porque funciona también en **web**, donde no existe `dart:io`.
* Storage deduce el tipo MIME de la **extensión** del nombre. Si hiciera falta forzarlo: `fileOptions: const FileOptions(contentType: 'image/png')`.
* El nombre lleva la hora (`millisecondsSinceEpoch`) para que sea único. Si subes dos veces la misma ruta, la segunda falla con *«The resource already exists»* (salvo que uses `upsert: true`, que además exige políticas de `update`).
* Las «carpetas» (`contactos/`) no hay que crearlas: son solo parte del nombre.

### 4.4. Subir y guardar la ruta

Al crear o editar un contacto, primero se sube la foto y después se guarda su ruta junto con los demás datos:

```dart title="lib/pages/contacto_form.dart"
Future<void> _guardar() async {
  final fotoService = FotoService();
  String? ruta = _contacto?.fotoPath; // la foto que ya tenía
  if (_fotoElegida != null) {
    ruta = await fotoService.subir(_fotoElegida!);
  }
  await ContactoService().crear(
    Contacto(nombre: _nombre.text, email: _email.text, fotoPath: ruta),
  );
}
```

Un fallo en la subida lanza **`StorageException`** (con `message` y `statusCode`: 413 si es muy pesada, 415 si no es una imagen, 403 si falta la política). Se atrapa con un `on StorageException catch (e)`, igual que `AuthException` y `PostgrestException` en las sesiones anteriores.

---

## 5. Obtener y mostrar la imagen

### 5.1. La URL pública

Cada archivo de un bucket público tiene una URL con una forma fija. Enfoca cada parte, y compárala con la de un bucket privado:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/anatomia-url-publica/index.html"
  title="Las partes de la URL de un archivo de Supabase Storage: proyecto, servicio, pública o firmada, bucket y ruta"
  height={700}
/>

Por eso `getPublicUrl(ruta)` **no necesita red**: solo concatena texto. La URL completa de nuestra foto es:

```text
https://tu-proyecto.supabase.co/storage/v1/object/public/fotos/contactos/ana.png
```

Pégala en el navegador: la imagen se ve **sin llave ni sesión**. Esa es la diferencia con la base de datos, donde toda petición necesita la llave.

### 5.2. Dibujarla con `Image.network`

`Image.network` descarga la imagen de una URL y la dibuja. Conviene manejar los **tres estados** que ya conoces: cargando, error y listo:

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

* Sin ruta (`null`) se dibuja un avatar genérico: un contacto puede no tener foto.
* `loadingBuilder` muestra el indicador mientras llegan los bytes; cuando `progreso` es `null`, la imagen ya está.
* `errorBuilder` cubre una URL mala, una imagen borrada o la falta de red.
* `fit: BoxFit.cover` recorta la imagen para llenar el círculo sin deformarla.

Úsalo en la lista de la agenda:

```dart title="lib/pages/contactos_page.dart"
ListTile(
  leading: FotoContacto(ruta: c.fotoPath),
  title: Text(c.nombre),
  subtitle: Text(c.email),
)
```

### 5.3. El ciclo completo

Sigue una foto desde que se sube hasta que aparece en pantalla. El interruptor quita la política de subida para ver el error más común:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-15/subir-y-mostrar/index.html"
  title="Ciclo de una foto de contacto con Supabase Storage entre la app Flutter, Storage y Postgres: subir con uploadBinary, guardar la ruta, construir la URL pública y mostrar la imagen"
  height={700}
/>

Y en el panel, la subida se ve así dentro del bucket (marcado **PUBLIC**):

![Panel de Supabase en Storage, bucket fotos marcado como público, con un archivo subido](/img/seminario-de-i-d-i/semana-15/storage-bucket-archivo.png)

Desde esa vista del panel también puedes **subir archivos a mano** (*Upload files*), crear carpetas y copiar la URL de cada archivo: es la mejor manera de comprobar que el bucket funciona antes de escribir una línea de Dart.

---

## 6. Borrar una foto (opcional)

Para quitar un archivo se usa `remove`, que recibe una **lista** de rutas:

```dart title="lib/services/foto_service.dart"
Future<void> borrar(String ruta) => _bucket.remove([ruta]);
```

Requiere una política de `delete` sobre `storage.objects`. Sin ella, la llamada **no lanza error** pero tampoco borra nada (igual que un `delete()` de tabla sin política):

```sql title="SQL Editor"
create policy "fotos: borrar autenticados"
  on storage.objects for delete to authenticated
  using (bucket_id = 'fotos');
```

:::tip[Borra primero la fila o primero el archivo]
Si borras el contacto y se te olvida el archivo, queda una imagen huérfana ocupando espacio. Una buena rutina es borrar el **archivo** y después la **fila**; si el archivo ya no existe, la fila sigue pudiéndose borrar.
:::

---

## 7. Errores frecuentes

| Síntoma | Causa probable | Qué revisar |
|---|---|---|
| `new row violates row-level security policy` al subir | Falta la política de `insert` sobre `storage.objects`, o el usuario no tiene sesión | Sección 3; que `AuthGate` entregue sesión |
| `Bucket not found` (404) | Nombre de bucket mal escrito en `from('fotos')` | Ortografía y mayúsculas |
| `The resource already exists` (409) | Se subió dos veces la misma ruta | Nombre único con `DateTime.now()` |
| `mime type … is not supported` (415) | El bucket solo permite `image/*` y se subió otra cosa | Tipos permitidos del bucket |
| `The object exceeded the maximum allowed size` (413) | La foto pesa más del límite del bucket | `maxWidth` en `pickImage`; límite del bucket |
| La URL responde **400** o «Bucket not found» en el navegador | El bucket **no es público** | Interruptor *Public bucket* |
| Se ve el ícono de imagen rota | Ruta mal guardada en `foto_path` o archivo borrado | Comparar la ruta de la tabla con la del panel |
| La imagen no cambia tras reemplazarla | El navegador o `Image.network` guardan la copia en caché | Usar un nombre nuevo en cada subida |
| La subida falla en **web** con `dart:io` | Se usó `upload(ruta, File)` | Cambiar a `uploadBinary(ruta, bytes)` |

---

## Cuestionario de Autoevaluación

<Quiz id="seminario-s15-storage-quiz">
  <Question title="¿Qué es un bucket en Supabase Storage?">
    <Option>Una tabla de Postgres especial para guardar bytes.</Option>
    <Option>Una llave que da acceso a los archivos.</Option>
    <Option correct>Una carpeta de primer nivel con nombre propio y reglas propias (público o privado, tamaño máximo, tipos permitidos).</Option>
    <Option>Un tipo de archivo comprimido.</Option>
  </Question>
  <Question title="¿Qué tipos de archivo puede guardar Storage?">
    <Option>Solo imágenes.</Option>
    <Option>Solo imágenes y PDF.</Option>
    <Option correct>Cualquier tipo (imágenes, video, audio, PDF…); cada bucket puede restringir los que acepta con tipos MIME.</Option>
    <Option>Solo archivos de texto.</Option>
  </Question>
  <Question title="¿Por qué se guarda en la tabla solo la ruta de la foto y no la imagen?">
    <Option>Porque Postgres no puede guardar imágenes de ninguna forma.</Option>
    <Option>Porque Flutter no permite leer imágenes de una tabla.</Option>
    <Option correct>Porque las imágenes pesan: el archivo va a Storage y la tabla guarda un texto corto que lo localiza.</Option>
    <Option>Porque así la imagen queda privada automáticamente.</Option>
  </Question>
  <Question title="Con un bucket público, ¿qué operación sigue necesitando una política RLS?">
    <Option>Ver la imagen con su URL.</Option>
    <Option>Obtener la URL con getPublicUrl.</Option>
    <Option correct>Subir, reemplazar o borrar archivos.</Option>
    <Option>Ninguna: público significa acceso total.</Option>
  </Question>
  <Question title="¿Sobre qué tabla se escriben las políticas de Storage?">
    <Option>public.contactos</Option>
    <Option>auth.users</Option>
    <Option correct>storage.objects</Option>
    <Option>storage.fotos</Option>
  </Question>
  <Question title="En la política de subida, ¿para qué sirve with check (bucket_id = 'fotos')?">
    <Option>Para que la política se aplique a todos los buckets.</Option>
    <Option>Para validar que el archivo sea una imagen.</Option>
    <Option correct>Para que la regla valga solo para el bucket «fotos» y no para otros.</Option>
    <Option>Para cambiar el nombre del archivo al subirlo.</Option>
  </Question>
  <Question title="¿Por qué se prefiere uploadBinary(ruta, bytes) a upload(ruta, File)?">
    <Option>Porque es más rápido en Android.</Option>
    <Option correct>Porque funciona también en Flutter Web, donde no existe dart:io.</Option>
    <Option>Porque no necesita sesión.</Option>
    <Option>Porque comprime la imagen automáticamente.</Option>
  </Question>
  <Question title="¿Qué hace getPublicUrl(ruta)?">
    <Option>Descarga la imagen y devuelve sus bytes.</Option>
    <Option>Hace una petición a Storage para comprobar que el archivo existe.</Option>
    <Option correct>Arma el texto de la URL (proyecto, servicio, bucket y ruta) sin usar la red.</Option>
    <Option>Crea una URL temporal que caduca en una hora.</Option>
  </Question>
  <Question title="Un usuario sube un PDF a un bucket que solo permite image/*. ¿Qué ocurre?">
    <Option>Se sube igual, pero no se puede ver.</Option>
    <Option>Se convierte automáticamente en una imagen.</Option>
    <Option correct>Storage rechaza la subida (error 415, tipo no permitido) y la app recibe una StorageException.</Option>
    <Option>Se guarda en un bucket distinto.</Option>
  </Question>
  <Question title="Se sube dos veces un archivo con la misma ruta, sin upsert. ¿Qué pasa con la segunda subida?">
    <Option>Reemplaza el archivo anterior sin avisar.</Option>
    <Option>Se guarda con un número al final del nombre.</Option>
    <Option correct>Falla porque el recurso ya existe; por eso se usan nombres únicos, por ejemplo con la hora.</Option>
    <Option>Se bloquea la cuenta del usuario.</Option>
  </Question>
</Quiz>
