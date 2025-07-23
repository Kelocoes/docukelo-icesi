---
sidebar_position: 1
---

# Protocolos y servidores web

### Protocolo TCP

Como se ha mencionado en cursos anteriores, **los protocolos son conjuntos de reglas que permiten la comunicación entre dispositivos en una red**. Cada protocolo tiene características específicas y se utiliza según las necesidades de la aplicación.

En particular, el **protocolo TCP** es conocido como el *mensajero confiable de Internet*. Cuando se envían datos mediante TCP, este protocolo garantiza que **toda la información llegue completa, sin errores y en el orden correcto**.  
Puedes imaginarlo como un servicio de mensajería que requiere confirmación de entrega: si algún paquete se pierde o llega dañado, **TCP lo solicita nuevamente hasta que todo esté correcto**.

Por esta razón, TCP es fundamental en aplicaciones donde **la integridad de los datos es esencial**, como *páginas web*, *correos electrónicos* y *transferencias de archivos*.

<img src="/files/TCP.webp" alt="Protocolo TCP" width="800" />

#### Three-Way Handshake

Antes de enviar datos, TCP utiliza un proceso llamado **Three-Way Handshake** para establecer una conexión confiable entre dos dispositivos. Este proceso consta de tres pasos:

1. **SYN:** El cliente envía un mensaje SYN al servidor para solicitar la conexión.
2. **SYN-ACK:** El servidor responde con un mensaje SYN-ACK, confirmando la recepción y aceptando la conexión.
3. **ACK:** El cliente envía un mensaje ACK para confirmar la respuesta del servidor.

Una vez completados estos pasos, la conexión está lista y ambos dispositivos pueden intercambiar datos de forma segura y ordenada.

### Protocolo UDP

Por otro lado, tenemos a UDP, que es mucho más relajado. Acá no hay tanta formalidad: mandas los datos y listo, sin preocuparte si llegaron o no. UDP es más rápido porque no tiene que estar chequeando cada paquete, pero eso significa que a veces se pueden perder datos. Se usa en cosas como videollamadas, juegos en línea y streaming, donde lo importante es la velocidad y no tanto la precisión. Si se pierde un paquete, no pasa nada, seguimos adelante.

<img src="/files/TCP_UDP.jpg" alt="Protocolo UDP" width="800" />

## Servidores web

### Protocolo HTTP

Ahora, ya teniendo en cuenta sobre todo el protocolo TCP, podemos hablar de los servidores HTTP. Y es que basándose en el protocolo TCP, se creó el protocolo HTTP (Hypertext Transfer Protocol), que es el que usan los navegadores para comunicarse con los servidores web. Cuando escribes una dirección en tu navegador, este le manda una solicitud al servidor HTTP, que responde enviando los archivos necesarios para que veas la página.

Los protocolos HTTP se componen de diferentes partes, las cuales se presentan a continuación:
- **Método HTTP**: Indica la acción que se desea realizar, como `GET` (para obtener datos) o `POST` (para enviar datos al servidor).
- **URL**: La dirección del recurso solicitado.
- **Versión del protocolo**: Indica la versión de HTTP que se está utilizando, como `HTTP/1.1`.
- **Encabezados**: Información adicional sobre la solicitud, como el tipo de contenido aceptado o las cookies.
- **Cuerpo de la solicitud**: Contiene los datos que se envían al servidor, si es necesario (por ejemplo, en una solicitud `POST`).

<img src="/files/HTTP_protocol.png" alt="Protocolo HTTP" width="500" />