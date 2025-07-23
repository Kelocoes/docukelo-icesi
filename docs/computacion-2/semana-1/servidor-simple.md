---
sidebar_position: 2
---

# Construcción de un servidor simple

## Guía paso a paso para construir un servidor web simple en Java   

### 1. Crear el archivo Java

Primero, crea un archivo llamado `ServidorWebSimple.java`.

### 2. Importar los paquetes necesarios

Agrega las siguientes líneas al inicio del archivo para importar las clases requeridas.  
A continuación se explica brevemente para qué se usan estas librerías:

- `java.io`: Proporciona clases para manejar entrada y salida, como leer archivos y flujos de datos.
- `java.net`: Permite trabajar con redes, sockets y conexiones TCP/IP.
- `java.util`: Incluye utilidades como colecciones y clases para manipular cadenas, por ejemplo, `StringTokenizer`.

```java
import java.io.*;
import java.net.*;
import java.util.*;
```

### 3. Definir la clase principal

Declare la clase principal y el método `main`:

```java
public class ServidorWebSimple {
    public static void main(String argv[]) throws Exception {
        // El código irá acá
    }
}
```

### 4. Crear el socket del servidor

Dentro del método `main`, agregue el código para crear el socket que escuchará en el puerto 6789:

```java
ServerSocket socketdeEscucha = new ServerSocket(6789);
Socket socketdeConexion = socketdeEscucha.accept();
```

### 5. Leer la solicitud del cliente

Agregue el siguiente código para leer la solicitud HTTP enviada por el navegador:

```java
BufferedReader mensajeDesdeCliente =
    new BufferedReader(new InputStreamReader(socketdeConexion.getInputStream()));
String lineaDeLaSolicitudHttp = mensajeDesdeCliente.readLine();
```

Nota: `BufferedReader` utiliza un buffer interno para leer datos de manera eficiente desde el flujo de entrada, permitiendo procesar texto línea por línea.

### 6. Procesar la solicitud y obtener el nombre del archivo

Utilice `StringTokenizer` para extraer el nombre del archivo solicitado:

```java
StringTokenizer lineaSeparada = new StringTokenizer(lineaDeLaSolicitudHttp);
if (lineaSeparada.nextToken().equals("GET")) {
    String nombreArchivo = lineaSeparada.nextToken();
    if (nombreArchivo.startsWith("/"))
        nombreArchivo = nombreArchivo.substring(1);
    // El código para enviar el archivo irá acá
} else {
    System.out.println("Bad Request Message");
}
```

### 7. Leer el archivo solicitado y preparar la respuesta

El siguiente código implementa el algoritmo que permite al servidor leer el archivo solicitado por el cliente y enviar una respuesta HTTP adecuada. Es importante entender cómo funciona este proceso:

1. **Lectura del archivo**: Se utiliza `FileInputStream` para leer el archivo solicitado y cargarlo en un arreglo de bytes.
2. **Preparación de la respuesta HTTP**: Se construye la respuesta HTTP, incluyendo los encabezados necesarios como el tipo de contenido (`Content-Type`) y la longitud del archivo (`Content-Length`).
3. **Envío de la respuesta**: Se envían los encabezados y el contenido del archivo al cliente usando `DataOutputStream`.

El uso de `writeBytes` para los encabezados y el salto de línea final `\r\n` es relevante porque la especificación HTTP requiere que los encabezados terminen con una línea vacía antes de enviar el cuerpo del mensaje. Esto indica al navegador que los encabezados han terminado y que a continuación viene el contenido solicitado.

```java
File archivo = new File(nombreArchivo);
FileInputStream archivoDeEntrada = new FileInputStream(nombreArchivo);
int cantidadDeBytes = (int) archivo.length();
byte[] archivoEnBytes = new byte[cantidadDeBytes];
archivoDeEntrada.read(archivoEnBytes);

DataOutputStream mensajeParaCliente =
    new DataOutputStream(socketdeConexion.getOutputStream());

// Encabezado de respuesta HTTP
mensajeParaCliente.writeBytes("HTTP/1.0 200 Document Follows\r\n");
if (nombreArchivo.endsWith(".jpg"))
    mensajeParaCliente.writeBytes("Content-Type: image/jpeg\r\n");
if (nombreArchivo.endsWith(".gif"))
    mensajeParaCliente.writeBytes("Content-Type: image/gif\r\n");
mensajeParaCliente.writeBytes("Content-Length: " + cantidadDeBytes + "\r\n");

// Línea vacía para indicar el fin de los encabezados
mensajeParaCliente.writeBytes("\r\n");

// Envío del contenido del archivo
mensajeParaCliente.write(archivoEnBytes, 0, cantidadDeBytes);

socketdeConexion.close();
```

**¿Por qué es necesario el `writeBytes` final y el `\r\n`?**  
El método `writeBytes` se utiliza para enviar los encabezados HTTP como texto. El salto de línea `\r\n` al final de los encabezados es obligatorio según el protocolo HTTP, ya que separa los encabezados del cuerpo del mensaje. Sin esta línea vacía, el navegador no podrá interpretar correctamente la respuesta y no mostrará el contenido.


### 8. Compilar el servidor

Abra una terminal y compile el archivo:

```bash
javac ServidorWebSimple.java
```

### 9. Ejecutar el servidor

Ejecute el servidor con:

```bash
java ServidorWebSimple
```

### 10. Probar el servidor desde el navegador

Coloque el archivo que desea servir (por ejemplo, `miarchivo.html`) en el mismo directorio que el servidor. Abra su navegador y acceda a:

```
http://127.0.0.1:6789/miarchivo.html
```

### 11. Notas importantes

- El servidor solo atiende una solicitud por ejecución.
- Asegúrese de que el archivo solicitado exista en el mismo directorio que el servidor.
- Para servir imágenes, el servidor añade el encabezado `Content-Type` adecuado.

