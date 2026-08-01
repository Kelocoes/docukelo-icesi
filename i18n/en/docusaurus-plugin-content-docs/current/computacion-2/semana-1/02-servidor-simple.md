---
sidebar_position: 2
---

# Building a Simple Server

## Step-by-Step Guide to Building a Simple Web Server in Java

### 1. Create the Java File

First, create a file named `ServidorWebSimple.java`.

### 2. Import Required Packages

Add the following lines at the top of the file to import the required classes:

- `java.io`: Provides classes for input and output operations, such as reading files and data streams.
- `java.net`: Allows working with networking, sockets, and TCP/IP connections.
- `java.util`: Includes utilities such as collections and string manipulation classes like `StringTokenizer`.

```java
import java.io.*;
import java.net.*;
import java.util.*;
```

### 3. Define the Main Class

Declare the main class and the `main` method:

```java
public class ServidorWebSimple {
    public static void main(String argv[]) throws Exception {
        // Code goes here
    }
}
```

### 4. Create the Server Socket

Inside the `main` method, add the code to create the socket listening on port 6789:

```java
ServerSocket socketdeEscucha = new ServerSocket(6789);
Socket socketdeConexion = socketdeEscucha.accept();
```

### 5. Read the Client Request

Add the following code to read the HTTP request sent by the browser:

```java
BufferedReader mensajeDesdeCliente =
    new BufferedReader(new InputStreamReader(socketdeConexion.getInputStream()));
String lineaDeLaSolicitudHttp = mensajeDesdeCliente.readLine();
```

Note: `BufferedReader` uses an internal buffer to efficiently read data from the input stream, allowing line-by-line text processing.

### 6. Process Request and Extract File Name

Use `StringTokenizer` to extract the requested file name:

```java
StringTokenizer lineaSeparada = new StringTokenizer(lineaDeLaSolicitudHttp);
if (lineaSeparada.nextToken().equals("GET")) {
    String nombreArchivo = lineaSeparada.nextToken();
    if (nombreArchivo.startsWith("/"))
        nombreArchivo = nombreArchivo.substring(1);
    // Code to send file goes here
} else {
    System.out.println("Bad Request Message");
}
```

### 7. Read Requested File and Prepare Response

The following code implements the algorithm allowing the server to read the requested file and send an appropriate HTTP response:

```java
File archivo = new File(nombreArchivo);
FileInputStream archivoDeEntrada = new FileInputStream(nombreArchivo);
int cantidadDeBytes = (int) archivo.length();
byte[] archivoEnBytes = new byte[cantidadDeBytes];
archivoDeEntrada.read(archivoEnBytes);

DataOutputStream mensajeParaCliente =
    new DataOutputStream(socketdeConexion.getOutputStream());

// HTTP response header
mensajeParaCliente.writeBytes("HTTP/1.0 200 Document Follows\r\n");
if (nombreArchivo.endsWith(".jpg"))
    mensajeParaCliente.writeBytes("Content-Type: image/jpeg\r\n");
if (nombreArchivo.endsWith(".gif"))
    mensajeParaCliente.writeBytes("Content-Type: image/gif\r\n");
mensajeParaCliente.writeBytes("Content-Length: " + cantidadDeBytes + "\r\n");

// Empty line indicating end of headers
mensajeParaCliente.writeBytes("\r\n");

// Send file content
mensajeParaCliente.write(archivoEnBytes, 0, cantidadDeBytes);

socketdeConexion.close();
```

### 8. Compile the Server

Open a terminal and compile the file:

```bash
javac ServidorWebSimple.java
```

### 9. Run the Server

Execute the server with:

```bash
java ServidorWebSimple
```

### 10. Test Server from Browser

Place the file you want to serve (for example, `myfile.html`) in the same directory as the server. Open your browser and navigate to:

```
http://127.0.0.1:6789/myfile.html
```
