---
sidebar_position: 1
---

# Protocolos y servidores web

### Protocolo TCP

Como se ha mencionado en cursos anteriores, **los protocolos son conjuntos de reglas que permiten la comunicación entre dispositivos en una red**. Cada protocolo tiene características específicas y se utiliza según las necesidades de la aplicación.

En particular, el **protocolo TCP** es conocido como el *mensajero confiable de Internet*. Cuando se envían datos mediante TCP, este protocolo garantiza que **toda la información llegue completa, sin errores y en el orden correcto**.  
Podrías imaginarlo como un servicio de mensajería que requiere confirmación de entrega: si algún paquete se pierde o llega dañado, **TCP lo solicita nuevamente hasta que todo esté correcto**.

Por esta razón, TCP es fundamental en aplicaciones donde **la integridad de los datos es esencial**, como *páginas web*, *correos electrónicos* y *transferencias de archivos*.

<img src="/img/computacion-2/TCP.webp" alt="Protocolo TCP" width="800" />

#### Three-Way Handshake

Antes de enviar datos, TCP utiliza un proceso llamado **Three-Way Handshake** para establecer una conexión confiable entre dos dispositivos. Este proceso consta de tres pasos:

1. **SYN:** El cliente envía un mensaje SYN al servidor para solicitar la conexión.
2. **SYN-ACK:** El servidor responde con un mensaje SYN-ACK, confirmando la recepción y aceptando la conexión.
3. **ACK:** El cliente envía un mensaje ACK para confirmar la respuesta del servidor.

Una vez completados estos pasos, la conexión está lista y ambos dispositivos pueden intercambiar datos de forma segura y ordenada.

### Protocolo UDP

Por otro lado, tenemos a **UDP**, que es mucho más relajado en el aseguramiento de datos. En este protocolo **no hay verificación de entrega**: se envían los datos sin preocuparse si llegaron o no. 

UDP es **más rápido** que TCP porque no tiene que verificar cada paquete, pero esto significa que **pueden perderse datos en el camino**. 

Este protocolo se utiliza principalmente en aplicaciones donde **la velocidad es más importante que la precisión**, como:
- *Videollamadas*
- *Juegos en línea* 
- *Streaming de contenido*

Si se pierde un paquete durante la transmisión, la comunicación continúa sin interrupciones.

<img src="/img/computacion-2/TCP_UDP.jpg" alt="Protocolo UDP" width="800" />

## Servidores web

### Protocolo HTTP

Ahora, ya teniendo en cuenta el protocolo TCP, podemos hablar de los servidores HTTP. Y es que basándose en el protocolo TCP, se creó el protocolo HTTP (Hypertext Transfer Protocol), que es el que usan los navegadores para comunicarse con los servidores web. Cuando escribes una dirección en tu navegador, este le manda una solicitud al servidor HTTP, que responde enviando los archivos necesarios para que veas la página.

Los protocolos HTTP se componen de diferentes partes, las cuales se presentan a continuación:
- **Método HTTP**: Indica la acción que se desea realizar, como `GET` (para obtener datos) o `POST` (para enviar datos al servidor).
- **URL**: La dirección del recurso solicitado.
- **Versión del protocolo**: Indica la versión de HTTP que se está utilizando, como `HTTP/1.1`.
- **Encabezados**: Información adicional sobre la solicitud, como el tipo de contenido aceptado o las cookies.
- **Cuerpo de la solicitud**: Contiene los datos que se envían al servidor, si es necesario (por ejemplo, en una solicitud `POST`).

<img src="/img/computacion-2/HTTP_protocol.png" alt="Protocolo HTTP" width="500" />

---

## Cuestionario de Autoevaluación

<Quiz id="comp2-protocolos-servidores-quiz">
  <Question title="¿Por qué se conoce al protocolo TCP como el 'mensajero confiable de Internet'?">
    <Option>Porque transmite datos a la máxima velocidad posible sin verificar errores.</Option>
    <Option correct>Porque garantiza que toda la información llegue completa, sin errores y en el orden correcto.</Option>
    <Option>Porque encripta todos los paquetes mediante certificados SSL obligatorios.</Option>
    <Option>Porque funciona de forma aislada sin requerir direcciones IP.</Option>
  </Question>
  <Question title="¿Qué sucede en el protocolo TCP si un paquete de datos se pierde o llega dañado?">
    <Option>La comunicación se interrumpe y se cierra la sesión permanentemente.</Option>
    <Option>El servidor ignora el paquete y continúa con el siguiente sin solicitarlo.</Option>
    <Option correct>TCP lo solicita nuevamente al emisor hasta que todo esté correcto.</Option>
    <Option>El navegador convierte automáticamente el paquete dañado al formato UDP.</Option>
  </Question>
  <Question title="¿Cuál es la secuencia correcta de mensajes en el proceso Three-Way Handshake de TCP?">
    <Option>ACK -&gt; SYN -&gt; SYN-ACK</Option>
    <Option correct>SYN -&gt; SYN-ACK -&gt; ACK</Option>
    <Option>CONNECT -&gt; ACCEPT -&gt; OK</Option>
    <Option>SYN -&gt; FIN -&gt; ACK</Option>
  </Question>
  <Question title="¿Qué mensaje envía el servidor en respuesta a la solicitud SYN inicial del cliente?">
    <Option>ACK</Option>
    <Option>FIN-ACK</Option>
    <Option correct>SYN-ACK</Option>
    <Option>RESET</Option>
  </Question>
  <Question title="¿Cuál es la característica principal del protocolo UDP frente a TCP?">
    <Option>Garantiza que no exista pérdida de paquetes durante el streaming.</Option>
    <Option correct>No realiza verificación de entrega ni confirmaciones, priorizando la velocidad.</Option>
    <Option>Es más lento pero ofrece mayor integridad en la transferencia de archivos.</Option>
    <Option>Requiere un establecimiento previo de conexión de tres vías.</Option>
  </Question>
  <Question title="¿En qué tipo de aplicaciones es ideal utilizar UDP según la lectura?">
    <Option>Transferencias de archivos bancarios y correos electrónicos.</Option>
    <Option>Bases de datos transaccionales y archivos HTML estáticos.</Option>
    <Option correct>Videollamadas, juegos en línea y streaming de contenido.</Option>
    <Option>Compilación de código fuente y parches del sistema operativo.</Option>
  </Question>
  <Question title="¿Qué protocolo de la capa de aplicación utilizan los navegadores para solicitar y recibir páginas web sobre TCP?">
    <Option>UDP</Option>
    <Option>FTP</Option>
    <Option correct>HTTP (Hypertext Transfer Protocol)</Option>
    <Option>DNS</Option>
  </Question>
  <Question title="¿Qué método HTTP se utiliza principalmente para solicitar u obtener un recurso desde un servidor web?">
    <Option>POST</Option>
    <Option correct>GET</Option>
    <Option>DELETE</Option>
    <Option>UPDATE</Option>
  </Question>
  <Question title="¿Qué sección de una solicitud HTTP contiene información adicional sobre el tipo de contenido aceptado o las cookies?">
    <Option>El método HTTP.</Option>
    <Option>El cuerpo de la solicitud (body).</Option>
    <Option correct>Los Encabezados (Headers).</Option>
    <Option>La versión del protocolo TCP.</Option>
  </Question>
  <Question title="¿Cuál de las siguientes afirmaciones es correcta sobre el protocolo HTTP?">
    <Option>No requiere de un protocolo de transporte subyacente para funcionar.</Option>
    <Option correct>Se basa en la infraestructura de transporte confiable del protocolo TCP.</Option>
    <Option>Solo se puede ejecutar si se utiliza un hipervisor de tipo 1 en el host.</Option>
    <Option>Envía todos los datos sin especificar la URL del recurso solicitado.</Option>
  </Question>
</Quiz>