---
sidebar_position: 2
description: "Fundamentos conceptuales de WebSockets frente a APIs REST: handshake, tópicos (rooms), configuración de un Gateway en NestJS emitiendo una serie temporal desde CSV cada 3 segundos y consumo en Next.js con Apache ECharts."
---

# WebSockets y Datos en Tiempo Real (NestJS + Apache ECharts)

Tanto **REST** como **GraphQL** comparten una regla fundamental: **siempre es el cliente quien inicia la conversación**. El navegador pregunta y el servidor responde. Pero ¿qué ocurre cuando necesitas mostrar sensores que cambian cada 3 segundos, un tablero financiero en vivo o una sala de chat donde los datos nacen en el servidor sin que nadie haya hecho clic? Ahí entran los **WebSockets**.

En este documento entenderemos qué son los WebSockets, en qué se diferencian de una API tradicional, qué es un **tópico** (*topic*) y qué piezas conceptuales se configuran tanto en **NestJS** como en **Next.js** con **Apache ECharts** para graficar series temporales en vivo.

---

## 1. Qué es un WebSocket y en qué se diferencia de REST

Un **WebSocket** (`ws://` o `wss://` sobre TLS) es un protocolo de comunicación que abre un **canal TCP persistente y bidireccional (*full-duplex*)** entre el cliente y el servidor.

1. **Handshake inicial:** el cliente envía una petición HTTP normal con la cabecera `Upgrade: websocket`.
2. **Cambio de protocolo:** el servidor responde `101 Switching Protocols`. A partir de ese instante, la conexión **no se cierra** ni vuelve a usar cabeceras HTTP en cada mensaje.
3. **Flujo libre en ambas direcciones:** tanto el servidor como el cliente pueden enviar mensajes (*frames* ligeros) en cualquier momento.

Observa la diferencia cuando el servidor tiene datos nuevos cada **3 segundos**:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/rest-vs-websockets/index.html"
  title="Comparación entre HTTP Polling cada 3 segundos y WebSockets con suscripción a tópicos"
  height={620}
/>

### Comparativa entre enfoques de comunicación

| Enfoque | Quién inicia el envío | Sobrecarga de red | Cuándo encaja |
| :--- | :--- | :--- | :--- |
| **REST / GraphQL tradicional** | Siempre el cliente (petición-respuesta). | Cabeceras HTTP en cada consulta. | Consultas bajo demanda, formularios y CRUD. |
| **HTTP Polling (cada N segundos)** | El cliente pregunta en bucle (`setInterval`). | Muy alta: abre peticiones incluso si no hay cambios. | Sistemas simples donde la latencia no importa y no hay soporte WS. |
| **Server-Sent Events (SSE)** | El servidor empuja en una vía (solo servidor → cliente). | Baja, usa HTTP estándar. | Feeds de noticias, logs o progreso de tareas unidireccionales. |
| **WebSockets** | Bidireccional (*full-duplex*): ambos pueden emitir en vivo. | Mínima tras el handshake inicial. | Telemetría en tiempo real, chats, gráficas vivas, juegos y colaboración. |

---

## 2. Casos de uso: cuándo usar WebSockets (y cuándo no)

Conviene adoptar WebSockets cuando la **frescura del dato** o la **interacción simultánea** son parte central del producto:

- **Monitoreo y telemetría (IoT):** estaciones meteorológicas, sensores industriales o métricas de servidores que publican lecturas cada pocos segundos.
- **Tableros en tiempo real:** precios de acciones, estado de pedidos o KPIs operativos que se actualizan solos en pantalla.
- **Colaboración y mensajería:** chats, notificaciones instantáneas, cursores compartidos o edición simultánea de documentos.

:::note[Cuándo NO complicarse con WebSockets]
Si una pantalla solo necesita traer una lista de rutinas al abrirse o guardar un formulario ocasional, **REST o GraphQL siguen siendo mejores opciones**: aprovechan caché, son *stateless* y escalan de forma más simple sin mantener miles de sockets abiertos en memoria.
:::

---

## 3. Escenario de ejemplo: serie temporal desde un CSV cada 3 segundos

Imagina que en el backend tenemos un archivo **`telemetria.csv`** con mediciones ambientales tomadas por día. Cada fila representa un instante con varias variables (parámetros) registradas al mismo tiempo:

```csv title="data/telemetria.csv" showLineNumbers
day,time,temperature,humidity,power_kw
day-1,08:00,19.2,74,1.4
day-1,09:00,21.0,68,1.8
day-1,10:00,23.5,61,2.3
day-2,08:00,17.5,82,1.6
day-2,09:00,18.1,85,1.9
```

Nuestra suposición de arquitectura funciona así:
- El backend lee el archivo CSV y, **cada 3 segundos**, toma la siguiente fila correspondiente a cada día y la publica a los clientes interesados.
- En el frontend (una página independiente en Next.js, **sin necesidad de envolverlo en Clean Architecture**), el estudiante ve la página vacía, pulsa **Ejecutar**, escoge si quiere escuchar las lecturas del **Día 1** o del **Día 2**, y observa cómo **Apache ECharts** dibuja la línea en vivo conforme llegan los datos.

---

## 4. Qué es un Tópico (Topic), cómo se escribe y cómo viajan los datos

Si 50 usuarios están conectados al mismo servidor WebSocket pero unos quieren ver los datos del **Día 1** y otros los del **Día 2**, no tendría sentido enviarle todas las filas a todo el mundo. Para segmentar esa información usamos **tópicos** (en Socket.IO también llamados *rooms* o canales).

- **Qué es un tópico:** es un **nombre de canal lógico** al que un cliente se suscribe para recibir únicamente los mensajes publicados en esa categoría.
- **Cómo se escribe / nombra:** por convención se usan nombres jerárquicos en minúsculas separados por `:` o `/`, por ejemplo:
  - `telemetry:day-1` (flujo de sensores del Día 1)
  - `telemetry:day-2` (flujo de sensores del Día 2)
- **Cómo se diferencia del nombre del evento:**
  - El **tópico** (`telemetry:day-1`) define **a qué grupo de clientes** le llega el mensaje (`client.join(topic)`).
  - El **evento** (`telemetry:tick`) define **qué tipo de mensaje** se está escuchando (`socket.on('telemetry:tick', callback)`).

| Mecanismo en Socket.IO | Alcance | Ejemplo |
| :--- | :--- | :--- |
| `this.server.emit(...)` | **Broadcast global:** llega a absolutamente todos los clientes conectados. | Anuncio general del sistema. |
| `client.emit(...)` | **Unicast:** responde únicamente al cliente que envió el mensaje. | Confirmación de suscripción. |
| `this.server.to(topic).emit(...)` | **Multicast por tópico:** llega solo a quienes hicieron `client.join(topic)`. | Datos de `telemetry:day-1` vs `telemetry:day-2`. |

---

## 5. Qué se configura en NestJS (el Gateway)

En NestJS ya conoces el `@Controller()` (para REST) y el `@Resolver()` (para GraphQL). Para WebSockets aparece una nueva puerta de entrada: el **Gateway** (`@WebSocketGateway()`).

Los paquetes habituales en NestJS con Socket.IO son:

```bash title="Dependencias en NestJS" showLineNumbers
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

Conceptualmente, un Gateway en NestJS tiene **cuatro piezas clave**:

1. **`@WebSocketGateway({ cors: { origin: '*' } })`**: marca la clase como servidor WebSocket y habilita CORS para que el navegador (Next.js) pueda conectarse.
2. **`@WebSocketServer() server: Server`**: inyecta la instancia del servidor Socket.IO para poder emitir mensajes proactivamente (por ejemplo desde un temporizador cada 3 segundos).
3. **`@SubscribeMessage('join-topic')`**: escucha un evento enviado por el cliente para unirlo a una sala (`client.join(topic)`) o sacarlo de la anterior (`client.leave(prevTopic)`).
4. **Emisor periódico cada 3 segundos**: un intervalo (o `@Interval(3000)` de `@nestjs/schedule`) que lee la siguiente fila del CSV y hace `this.server.to(topic).emit('telemetry:tick', reading)`.

```ts title="src/telemetry/telemetry.gateway.ts (estructura conceptual)" showLineNumbers
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    // Se ejecuta cuando un navegador completa el handshake WebSocket
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Se ejecuta al cerrar la pestaña o llamar socket.disconnect()
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('join-topic')
  handleJoinTopic(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { topic: string; previousTopic?: string },
  ) {
    // Si el cliente escuchaba otro día, sale del tópico anterior antes de entrar al nuevo
    if (payload.previousTopic) {
      client.leave(payload.previousTopic);
    }
    client.join(payload.topic);
    return { joined: payload.topic };
  }

  // Invocado cada 3 segundos por un intervalo que lee la siguiente fila del CSV
  publishReading(topic: string, reading: { time: string; temp: number; hum: number }) {
    this.server.to(topic).emit('telemetry:tick', reading);
  }
}
```

:::tip[Responsabilidad del Gateway]
Al igual que un Controller o un Resolver, el **Gateway** no debería parsear archivos CSV ni contener lógica de negocio: delega la lectura de filas a un `TelemetryService` y se limita a gestionar salas y emitir eventos.
:::

---

## 6. Qué se configura en Next.js con Apache ECharts

Para consumir WebSockets desde Next.js hay dos reglas prácticas fundamentales:

1. **Debe ser un Client Component (`'use client'`):** una conexión WebSocket vive abierta en el navegador del usuario, nunca dentro de un Server Component ni de una Server Action efímera.
2. **No necesitas Clean Architecture para un visor experimental:** cuando construyes una vista de telemetría directa con gráfica viva, puedes conectar `socket.io-client` y **Apache ECharts** (`echarts`) directamente en un componente cliente limpio con `useEffect` y `useRef`.

```bash title="Dependencias en Next.js" showLineNumbers
npm install socket.io-client echarts
```

Las responsabilidades dentro del componente de Next.js son tres:

- **Mantener la instancia del gráfico (`echarts.init`):** se crea una sola vez al montar el componente sobre un `<div ref={chartRef} />` y se destruye en el cleanup (`chart.dispose()`).
- **Conectar el WebSocket y escuchar el tópico:** `io('http://localhost:4000')` abre la conexión cuando el usuario pulsa **Ejecutar**, emite `join-topic` con el tópico elegido (`telemetry:day-1` o `telemetry:day-2`), y escucha `telemetry:tick` para agregar el punto al arreglo de datos.
- **Actualizar el gráfico en caliente (`chart.setOption`):** cada vez que llega un punto nuevo, actualizamos `xAxis.data` y `series[i].data` sin recrear el canvas.

```tsx title="app/telemetry/page.tsx (estructura conceptual)" showLineNumbers
'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { io, Socket } from 'socket.io-client';

interface Reading {
  time: string;
  temp: number;
  hum: number;
}

export default function TelemetryPage() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [topic, setTopic] = useState<'telemetry:day-1' | 'telemetry:day-2'>('telemetry:day-1');
  const [running, setRunning] = useState(false);
  const [points, setPoints] = useState<Reading[]>([]);

  // 1. Inicializar Apache ECharts una sola vez
  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  // 2. Actualizar la gráfica de línea cada vez que llegan puntos por WebSocket
  useEffect(() => {
    chartInstance.current?.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['Temperatura (°C)', 'Humedad (%)'] },
      xAxis: { type: 'category', data: points.map((p) => p.time) },
      yAxis: { type: 'value' },
      series: [
        { name: 'Temperatura (°C)', type: 'line', smooth: true, data: points.map((p) => p.temp) },
        { name: 'Humedad (%)', type: 'line', smooth: true, data: points.map((p) => p.hum) },
      ],
    });
  }, [points]);

  // 3. Conectar o desconectar el WebSocket según el estado y el tópico elegido
  useEffect(() => {
    if (!running) {
      socketRef.current?.disconnect();
      return;
    }

    const socket = io('http://localhost:4000');
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-topic', { topic });
    });

    socket.on('telemetry:tick', (reading: Reading) => {
      setPoints((prev) => [...prev, reading]);
    });

    // Limpieza obligatoria para evitar múltiples suscripciones duplicadas
    return () => {
      socket.disconnect();
    };
  }, [running, topic]);

  return (
    <main className="p-6 space-y-4">
      <div className="flex gap-3">
        <select
          value={topic}
          onChange={(e) => {
            setPoints([]);
            setTopic(e.target.value as 'telemetry:day-1' | 'telemetry:day-2');
          }}
        >
          <option value="telemetry:day-1">Día 1 (telemetry:day-1)</option>
          <option value="telemetry:day-2">Día 2 (telemetry:day-2)</option>
        </select>
        <button onClick={() => setRunning((prev) => !prev)}>
          {running ? 'Pausar' : 'Ejecutar'}
        </button>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: 380 }} />
    </main>
  );
}
```

:::warning[Nunca olvides el cleanup en useEffect]
Si no llamas a `socket.disconnect()` en la función de retorno de `useEffect`, cada cambio de tópico o re-renderizado en desarrollo (*Strict Mode*) dejaría sockets viejos abiertos y verías puntos duplicados en la gráfica.
:::

---

## 7. Simulador interactivo: CSV + Tópicos WebSocket + Gráfica en vivo

Prueba el comportamiento completo aquí mismo sin levantar servidores externos. Pulsa **Ejecutar (Conectar WS)** para iniciar la transmisión simulada desde `telemetria.csv`, observa cómo llegan los eventos `telemetry:tick` y cambia el selector de tópico entre **`telemetry:day-1`** y **`telemetry:day-2`** para contrastar dos tiras de días distintos en tiempo real:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/simulador-ws-echarts/index.html"
  title="Simulador en vivo de WebSockets con tópicos por día, lectura de CSV y gráfica de línea estilo Apache ECharts"
  height={720}
/>

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s16-websockets-quiz">
  <Question title="¿Qué código HTTP confirma que la conexión inicial ha pasado de HTTP estándar a un canal WebSocket persistente?">
    <Option>200 OK</Option>
    <Option>201 Created</Option>
    <Option correct>101 Switching Protocols</Option>
    <Option>307 Temporary Redirect</Option>
  </Question>
  <Question title="¿Cuál es la diferencia principal entre HTTP Polling y WebSockets al leer un CSV cada 3 segundos?">
    <Option>HTTP Polling usa UDP y WebSockets usa FTP.</Option>
    <Option correct>En HTTP Polling el cliente debe abrir una petición nueva cada 3 segundos incluso si no hay cambios; en WebSockets el servidor empuja el dato por el túnel abierto.</Option>
    <Option>WebSockets solo permite enviar datos del cliente hacia el servidor.</Option>
    <Option>HTTP Polling no soporta formato JSON.</Option>
  </Question>
  <Question title="En el contexto de Socket.IO y NestJS, ¿para qué sirve un tópico o sala (room)?">
    <Option>Para cifrar la contraseña del usuario en la base de datos.</Option>
    <Option>Para reemplazar el archivo schema.gql de GraphQL.</Option>
    <Option correct>Para agrupar clientes suscritos a un canal específico (como telemetry:day-1) y enviarles mensajes solo a ellos.</Option>
    <Option>Para aumentar el tiempo de espera del navegador.</Option>
  </Question>
  <Question title="¿Qué método permite en un Gateway de NestJS emitir un evento únicamente a los clientes suscritos a un tópico específico?">
    <Option>this.server.emit('telemetry:tick', reading)</Option>
    <Option correct>this.server.to(topic).emit('telemetry:tick', reading)</Option>
    <Option>client.broadcastGlobal('telemetry:tick', reading)</Option>
    <Option>this.httpService.post(topic, reading)</Option>
  </Question>
  <Question title="¿Por qué el componente de Next.js que se conecta a un WebSocket y renderiza Apache ECharts debe llevar la directiva 'use client'?">
    <Option>Porque Next.js no permite importar librerías de JavaScript en el servidor.</Option>
    <Option correct>Porque la conexión WebSocket persistente y el DOM donde se dibuja el canvas de ECharts viven en el navegador del cliente.</Option>
    <Option>Porque 'use server' bloquea las peticiones JSON.</Option>
    <Option>Para que el archivo CSV se guarde en localStorage.</Option>
  </Question>
  <Question title="¿Qué decorador de @nestjs/websockets marca una clase como puerta de entrada para conexiones WebSocket?">
    <Option>@Controller()</Option>
    <Option>@Resolver()</Option>
    <Option correct>@WebSocketGateway()</Option>
    <Option>@Injectable()</Option>
  </Question>
  <Question title="¿Qué sucede si un desarrollador olvida ejecutar socket.disconnect() en la función de limpieza (cleanup) de useEffect?">
    <Option>Apache ECharts deja de compilar en TypeScript.</Option>
    <Option>El servidor NestJS borra el archivo CSV.</Option>
    <Option correct>Pueden quedar conexiones viejas abiertas al cambiar de tópico o remontar el componente, provocando lecturas duplicadas.</Option>
    <Option>El navegador cambia automáticamente a HTTP Polling.</Option>
  </Question>
  <Question title="¿Qué método de Apache ECharts actualiza la serie de la gráfica en vivo cuando llega una nueva lectura por WebSocket?">
    <Option>echarts.rebuild()</Option>
    <Option correct>chart.setOption(&#123; ... &#125;)</Option>
    <Option>chart.pushSocket()</Option>
    <Option>echarts.renderCsv()</Option>
  </Question>
  <Question title="¿En cuál de los siguientes escenarios NO es necesario introducir WebSockets?">
    <Option>Un tablero de sensores que publica mediciones cada 3 segundos.</Option>
    <Option>Un chat grupal con entrega instantánea.</Option>
    <Option correct>Una pantalla que consulta una lista estática de rutinas al abrirse y guarda un formulario ocasional.</Option>
    <Option>Un editor de texto colaborativo en tiempo real.</Option>
  </Question>
  <Question title="Cuando el usuario cambia el selector del tópico telemetry:day-1 a telemetry:day-2 en el Gateway de NestJS, ¿qué acción evita que siga recibiendo datos del Día 1?">
    <Option>Reiniciar el servidor completo de NestJS.</Option>
    <Option correct>Ejecutar client.leave(previousTopic) antes de client.join(newTopic).</Option>
    <Option>Borrar el historial del navegador.</Option>
    <Option>Cambiar el método HTTP de GET a POST.</Option>
  </Question>
</Quiz>
