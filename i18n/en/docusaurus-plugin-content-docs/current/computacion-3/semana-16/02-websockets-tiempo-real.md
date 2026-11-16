---
sidebar_position: 2
description: "Conceptual foundations of WebSockets vs. REST APIs: handshake, topics (rooms), configuring a NestJS Gateway emitting a CSV time series every 3 seconds, and consuming it in Next.js with Apache ECharts."
---

# WebSockets and Real-Time Data (NestJS + Apache ECharts)

Both **REST** and **GraphQL** share a fundamental rule: **the client always initiates the conversation**. The browser asks and the server answers. But what happens when you need to display sensors changing every 3 seconds, a live financial dashboard, or a chat room where data originates on the server without anyone clicking a button? That is where **WebSockets** come in.

In this document we will understand what WebSockets are, how they differ from a traditional API, what a **topic** is, and which conceptual pieces are configured in both **NestJS** and **Next.js** with **Apache ECharts** to plot live time series.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

---

## 1. What a WebSocket is and how it differs from REST

A **WebSocket** (`ws://` or `wss://` over TLS) is a communication protocol that opens a **persistent, bidirectional (full-duplex) TCP channel** between the client and the server.

1. **Initial handshake:** the client sends a regular HTTP request with the `Upgrade: websocket` header.
2. **Protocol switch:** the server replies `101 Switching Protocols`. From that moment on, the connection **does not close** and no longer sends HTTP headers on every message.
3. **Free flow in both directions:** both the server and the client can send lightweight frames at any time.

See the difference when the server has new data every **3 seconds**:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/rest-vs-websockets/index.html"
  title="Comparison between HTTP Polling every 3 seconds and WebSockets with topic subscription"
  height={620}
/>

### Comparison across communication approaches

| Approach | Who initiates sending | Network overhead | When it fits |
| :--- | :--- | :--- | :--- |
| **Traditional REST / GraphQL** | Always the client (request-response). | HTTP headers on every request. | On-demand queries, forms, and CRUD. |
| **HTTP Polling (every N seconds)** | Client asks in a loop (`setInterval`). | Very high: opens requests even when nothing changed. | Simple systems where latency is non-critical and WS is unavailable. |
| **Server-Sent Events (SSE)** | Server pushes one-way (server → client only). | Low, uses standard HTTP. | News feeds, logs, or one-way job progress updates. |
| **WebSockets** | Bidirectional (full-duplex): both sides can emit live. | Minimal after the initial handshake. | Real-time telemetry, chats, live charts, games, and collaboration. |

---

## 2. Use Cases: when to use WebSockets (and when not to)

WebSockets are a great fit when **data freshness** or **simultaneous interaction** is core to the product:

- **Monitoring and telemetry (IoT):** weather stations, industrial sensors, or server metrics publishing readings every few seconds.
- **Live dashboards:** stock tickers, order status trackers, or operational KPIs updating automatically on screen.
- **Collaboration and messaging:** chats, instant notifications, shared cursors, or simultaneous document editing.

:::note[When NOT to overcomplicate with WebSockets]
If a screen only needs to fetch a list of routines on load or submit an occasional form, **REST or GraphQL remain better choices**: they leverage caching, stay stateless, and scale more simply without holding thousands of open sockets in memory.
:::

---

## 3. Example Scenario: a CSV time series emitted every 3 seconds

Imagine our backend has a **`telemetria.csv`** file with environmental readings recorded per day. Each row represents a timestamp with multiple variables (parameters) captured together:

```csv title="data/telemetria.csv" showLineNumbers
day,time,temperature,humidity,power_kw
day-1,08:00,19.2,74,1.4
day-1,09:00,21.0,68,1.8
day-1,10:00,23.5,61,2.3
day-2,08:00,17.5,82,1.6
day-2,09:00,18.1,85,1.9
```

Our architectural assumption works as follows:
- The backend reads the CSV file and, **every 3 seconds**, picks the next row for each day and pushes it to interested clients.
- On the frontend (a standalone page in Next.js, **without needing Clean Architecture**), the student starts with an empty chart, clicks **Execute**, chooses whether to listen to **Day 1** or **Day 2**, and watches **Apache ECharts** draw the line live as readings arrive.

---

## 4. What a Topic is, how it is named, and how data travels

If 50 users are connected to the same WebSocket server, but some want **Day 1** data while others want **Day 2**, broadcasting every row to everyone makes no sense. To segment data streams we use **topics** (also called *rooms* or channels in Socket.IO).

- **What a topic is:** a **logical channel name** that a client subscribes to so it only receives messages published under that category.
- **How it is named:** by convention, lowercase hierarchical names separated by `:` or `/` are used, such as:
  - `telemetry:day-1` (sensor stream for Day 1)
  - `telemetry:day-2` (sensor stream for Day 2)
- **Topic vs. event name:**
  - The **topic** (`telemetry:day-1`) defines **which group of clients** receives the message (`client.join(topic)`).
  - The **event** (`telemetry:tick`) defines **what type of message** the client listens for (`socket.on('telemetry:tick', callback)`).

| Socket.IO Mechanism | Scope | Example |
| :--- | :--- | :--- |
| `this.server.emit(...)` | **Global broadcast:** reaches every connected client. | System-wide announcement. |
| `client.emit(...)` | **Unicast:** replies only to the client that sent the message. | Subscription acknowledgment. |
| `this.server.to(topic).emit(...)` | **Topic multicast:** reaches only clients that called `client.join(topic)`. | `telemetry:day-1` vs `telemetry:day-2` data. |

---

## 5. What is configured in NestJS (the Gateway)

In NestJS you already know `@Controller()` (for REST) and `@Resolver()` (for GraphQL). For WebSockets we introduce a new entry point: the **Gateway** (`@WebSocketGateway()`).

The standard packages in NestJS with Socket.IO are:

```bash title="Dependencies in NestJS" showLineNumbers
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

Conceptually, a NestJS Gateway has **four key pieces**:

1. **`@WebSocketGateway({ cors: { origin: '*' } })`**: marks the class as a WebSocket server and enables CORS so the browser (Next.js) can connect.
2. **`@WebSocketServer() server: Server`**: injects the Socket.IO server instance so we can push messages proactively (for instance, from a 3-second interval).
3. **`@SubscribeMessage('join-topic')`**: listens for a client event to join a room (`client.join(topic)`) or leave the previous one (`client.leave(prevTopic)`).
4. **3-second periodic emitter**: an interval (or `@Interval(3000)` from `@nestjs/schedule`) that reads the next CSV row and calls `this.server.to(topic).emit('telemetry:tick', reading)`.

```ts title="src/telemetry/telemetry.gateway.ts (conceptual structure)" showLineNumbers
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
    // Runs when a browser completes the WebSocket handshake
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Runs when closing the tab or calling socket.disconnect()
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-topic')
  handleJoinTopic(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { topic: string; previousTopic?: string },
  ) {
    // If the client was listening to another day, leave the old topic first
    if (payload.previousTopic) {
      client.leave(payload.previousTopic);
    }
    client.join(payload.topic);
    return { joined: payload.topic };
  }

  // Invoked every 3 seconds by an interval reading the next CSV row
  publishReading(topic: string, reading: { time: string; temp: number; hum: number }) {
    this.server.to(topic).emit('telemetry:tick', reading);
  }
}
```

:::tip[Gateway responsibility]
Just like a Controller or a Resolver, the **Gateway** should not parse CSV files or hold business logic: it delegates row reading to a `TelemetryService` and focuses on managing rooms and emitting events.
:::

---

## 6. What is configured in Next.js with Apache ECharts

When consuming WebSockets from Next.js, keep two practical rules in mind:

1. **It must be a Client Component (`'use client'`):** a WebSocket connection stays open in the user's browser, never inside a Server Component or an ephemeral Server Action.
2. **You do not need Clean Architecture for an experimental viewer:** when building a direct live telemetry chart, you can wire `socket.io-client` and **Apache ECharts** (`echarts`) directly in a clean client component using `useEffect` and `useRef`.

```bash title="Dependencies in Next.js" showLineNumbers
npm install socket.io-client echarts
```

The responsibilities inside the Next.js component are three:

- **Hold the chart instance (`echarts.init`):** created once on mount over a `<div ref={chartRef} />` and destroyed on cleanup (`chart.dispose()`).
- **Connect the WebSocket and listen to the topic:** `io('http://localhost:4000')` opens the socket when the user clicks **Execute**, emits `join-topic` with the chosen topic (`telemetry:day-1` or `telemetry:day-2`), and listens to `telemetry:tick` to append points.
- **Update the chart live (`chart.setOption`):** whenever a new reading arrives, update `xAxis.data` and `series[i].data` without recreating the canvas.

```tsx title="app/telemetry/page.tsx (conceptual structure)" showLineNumbers
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

  // 1. Initialize Apache ECharts once
  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  // 2. Update the line chart whenever new WebSocket points arrive
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

  // 3. Connect or disconnect the WebSocket based on running state and selected topic
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

    // Mandatory cleanup to avoid duplicate subscriptions
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

:::warning[Never skip the useEffect cleanup]
If you do not call `socket.disconnect()` inside the `useEffect` return function, every topic switch or development re-render (*Strict Mode*) will leave stale sockets open and produce duplicate points on the chart.
:::

---

## 7. Interactive Simulator: CSV + WebSocket Topics + Live Chart

Test the entire behavior right here without running external servers. Click **Ejecutar (Conectar WS)** to start the simulated stream from `telemetria.csv`, watch `telemetry:tick` events arrive, and switch the topic selector between **`telemetry:day-1`** and **`telemetry:day-2`** to compare two different days in real time:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/simulador-ws-echarts/index.html"
  title="Live WebSocket simulator with per-day topics, CSV reading, and Apache ECharts-style line chart"
  height={720}
/>

---

## Self-Assessment Quiz

<Quiz id="compunet3-s16-websockets-quiz">
  <Question title="Which HTTP status code confirms that the initial connection has upgraded from standard HTTP to a persistent WebSocket channel?">
    <Option>200 OK</Option>
    <Option>201 Created</Option>
    <Option correct>101 Switching Protocols</Option>
    <Option>307 Temporary Redirect</Option>
  </Question>
  <Question title="What is the main difference between HTTP Polling and WebSockets when reading a CSV every 3 seconds?">
    <Option>HTTP Polling uses UDP and WebSockets uses FTP.</Option>
    <Option correct>With HTTP Polling the client must open a new request every 3 seconds even when nothing changed; with WebSockets the server pushes data over the open tunnel.</Option>
    <Option>WebSockets only allow sending data from client to server.</Option>
    <Option>HTTP Polling does not support JSON payloads.</Option>
  </Question>
  <Question title="In the context of Socket.IO and NestJS, what is a topic or room used for?">
    <Option>To encrypt the user's password in the database.</Option>
    <Option>To replace the GraphQL schema.gql file.</Option>
    <Option correct>To group clients subscribed to a specific channel (such as telemetry:day-1) and send messages only to them.</Option>
    <Option>To increase the browser request timeout.</Option>
  </Question>
  <Question title="Which method in a NestJS Gateway emits an event only to clients subscribed to a specific topic?">
    <Option>this.server.emit('telemetry:tick', reading)</Option>
    <Option correct>this.server.to(topic).emit('telemetry:tick', reading)</Option>
    <Option>client.broadcastGlobal('telemetry:tick', reading)</Option>
    <Option>this.httpService.post(topic, reading)</Option>
  </Question>
  <Question title="Why must the Next.js component that connects to a WebSocket and renders Apache ECharts include the 'use client' directive?">
    <Option>Because Next.js forbids importing JavaScript libraries on the server.</Option>
    <Option correct>Because the persistent WebSocket connection and the DOM container where ECharts draws live in the client's browser.</Option>
    <Option>Because 'use server' blocks JSON requests.</Option>
    <Option>So the CSV file is saved inside localStorage.</Option>
  </Question>
  <Question title="Which @nestjs/websockets decorator marks a class as an entry point for WebSocket connections?">
    <Option>@Controller()</Option>
    <Option>@Resolver()</Option>
    <Option correct>@WebSocketGateway()</Option>
    <Option>@Injectable()</Option>
  </Question>
  <Question title="What happens if a developer forgets to call socket.disconnect() inside the useEffect cleanup function?">
    <Option>Apache ECharts fails to compile in TypeScript.</Option>
    <Option>The NestJS server deletes the CSV file.</Option>
    <Option correct>Old connections can remain open when switching topics or remounting, causing duplicate readings on the chart.</Option>
    <Option>The browser automatically falls back to HTTP Polling.</Option>
  </Question>
  <Question title="Which Apache ECharts method updates the line series live when a new WebSocket reading arrives?">
    <Option>echarts.rebuild()</Option>
    <Option correct>chart.setOption(&#123; ... &#125;)</Option>
    <Option>chart.pushSocket()</Option>
    <Option>echarts.renderCsv()</Option>
  </Question>
  <Question title="In which of the following scenarios is it NOT necessary to introduce WebSockets?">
    <Option>A sensor dashboard publishing readings every 3 seconds.</Option>
    <Option>A group chat with instant message delivery.</Option>
    <Option correct>A screen that fetches a static list of routines on load and submits an occasional form.</Option>
    <Option>A real-time collaborative text editor.</Option>
  </Question>
  <Question title="When the user switches the selector from telemetry:day-1 to telemetry:day-2 in the NestJS Gateway, what prevents them from still receiving Day 1 data?">
    <Option>Restarting the entire NestJS server.</Option>
    <Option correct>Calling client.leave(previousTopic) before client.join(newTopic).</Option>
    <Option>Clearing the browser history.</Option>
    <Option>Switching the HTTP method from GET to POST.</Option>
  </Question>
</Quiz>
