---
sidebar_position: 5
---

# Offline-First Web Applications: Architecture with PWA and IndexedDB

Course presentation guide on **Offline-First Architecture**, Progressive Web Apps (PWA), Service Workers, local client persistence with IndexedDB, and synchronization conflict resolution.

### Team Members
- María Cristina Angulo - A00404027
- Juan Pablo Serrano - A00404067
- Felipe Calderón - A00404998
- Samuel Navia - A00405006

---

## Slides and Repository

<PdfViewer src="/files/computacion-3/exposiciones-de-cursos/2026-02/Offline-First.pdf" />

:::info[Project Links and Source Code]
- **GitHub Repository:** [Philipk84/expo-compunet-3](https://github.com/Philipk84/expo-compunet-3)
- **Presentation (PDF):** [Download Offline-First.pdf](/files/computacion-3/exposiciones-de-cursos/2026-02/Offline-First.pdf)
:::

---

## 1. The Offline-First Paradigm

Conventional web application development assumes that network connectivity is continuous and predictable (*Online-First*). Whenever network latency spikes or connections drop, user experiences degrade through unresponsive interfaces, frozen spinners, or broken requests.

The **Offline-First** design model reverses this dependency:
- Application state and core data reside **primarily on the client device** (IndexedDB).
- HTML, JavaScript, and static assets are served instantaneously from **cache managed by the Service Worker**.
- Network connectivity functions as an opportunistic background synchronization pipe rather than an operational prerequisite.

<ZoomableMermaid value={`flowchart TD
    U["User Interaction"] --> UI["React UI"]
    UI -->|1. Saves locally| IDB[("Local IndexedDB")]
    IDB -->|2. Queues in outbox| Q["Sync Queue"]
    
    subgraph NetworkReconnection [Upon Network Reconnection]
        Q -->|3. POST /api/reports/sync| API["Express Server"]
        API -->|4. Validates version / Conflict| SDB[("Server Database")]
    end

    style UI fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style IDB fill:#dcfce7,stroke:#16a34a,stroke-width:2px
    style API fill:#fef3c7,stroke:#d97706,stroke-width:2px`} />

---

## 2. Core Architectural Technologies

### Service Workers and Caching Strategies
A Service Worker is an event-driven script running in a background thread decoupled from the DOM. It acts as an in-browser programmable network proxy:
- **Cache First:** Checks local cache before falling back to network fetches. Ideal for immutable static assets (HTML, JS, CSS, fonts).
- **Network First:** Attempts to query the live network, falling back to cached responses when offline. Ideal for dynamic data requiring freshness.

### IndexedDB
A transactional, client-side NoSQL storage engine capable of persisting large volumes of structured data, binary blobs, and indexed records for fast client lookups.

### Conflict Resolution Strategy
When users mutate records offline across multiple devices simultaneously:
- **Optimistic Concurrency Control:** Every persisted record tracks an incremental `version` counter.
- If the server detects version divergence upon synchronization, it tags the record with a **Conflict** state and prompts the user or business rule engine to resolve conflicts.

---

## 3. Practical Demo: Zero-Signal Field Logger

<StepByStep>
  <Step number="1" title="Clone and Run Demo">
    Clone and start both backend server and React client:

    ```bash
    git clone https://github.com/Philipk84/expo-compunet-3
    cd expo-compunet-3
    npm install
    npm run dev
    ```
  </Step>

  <Step number="2" title="Test Offline Functionality">
    1. Open `http://localhost:5173`.
    2. Toggle **Simulate Outage** or enable Offline mode in browser DevTools.
    3. Submit a new log report: verify it is saved immediately in **IndexedDB** with status **Pending**.
  </Step>

  <Step number="3" title="Reconnection and Synchronization">
    1. Disable simulated outage mode.
    2. Click **Sync Now** or wait for automatic background sync.
    3. The outbox queue flushes pending items, updating record statuses to **Synchronized**.
  </Step>

  <Step number="4" title="Testing Conflict Resolution">
    Mutate the same record concurrently with conflicting versions to observe interactive visual conflict resolution dialogues.
  </Step>
</StepByStep>
