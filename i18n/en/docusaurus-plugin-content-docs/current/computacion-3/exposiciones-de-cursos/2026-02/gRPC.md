---
sidebar_position: 4
---

# gRPC: High-Performance Microservices with Protocol Buffers

Presentation guide on **gRPC**, Protocol Buffers, HTTP/2 multiplexing, and the Backend for Frontend (BFF) architectural pattern using Node.js and Python.

### Team Members
- Fiber Piedrahita
- Daniel Fajardo
- Paula Ferreira

---

## Slides and Resources

<PdfViewer src="/files/computacion-3/exposiciones-de-cursos/2026-02/gRPC-Pokedex.pdf" />

:::info[Project Links and Presentation]
- **Presentation (PDF):** [Download gRPC-Pokedex.pdf](/files/computacion-3/exposiciones-de-cursos/2026-02/gRPC-Pokedex.pdf)
- **Official Protocol Buffers Documentation:** [Protobuf Dev](https://protobuf.dev/)
:::

---

## 1. gRPC and Protocol Buffers Foundations

**gRPC** (gRPC Remote Procedure Calls) is an open-source, high-performance RPC framework initially designed by Google. Unlike conventional REST architectures passing textual JSON payloads over HTTP/1.1, gRPC is anchored on two core technical pillars:

1. **Protocol Buffers (Protobuf):** A language-neutral, platform-neutral, extensible mechanism for serializing structured binary data.
2. **HTTP/2 Transport:** Supports full request multiplexing over a single persistent TCP connection, header compression (HPACK), and bi-directional streaming.

<ZoomableMermaid value={`flowchart LR
    A["Web Client"] -->|HTTP / JSON| B["Python BFF - Flask"]
    B -->|gRPC / Protobuf / HTTP2| C["Node.js Microservice"]
    C -->|REST| D[("External PokeAPI")]

    style A fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style B fill:#fef3c7,stroke:#d97706,stroke-width:2px
    style C fill:#dcfce7,stroke:#16a34a,stroke-width:2px
    style D fill:#f3e8ff,stroke:#9333ea,stroke-width:2px`} />

---

## 2. Comparison: gRPC vs. REST

| Criteria | gRPC | Traditional REST |
| :--- | :--- | :--- |
| **Transport Protocol** | HTTP/2 (Multiplexed) | Typically HTTP/1.1 or HTTP/2 |
| **Payload Format** | Binary (Protocol Buffers) | Textual (JSON or XML) |
| **Contract Definition** | Mandatory and strict (`.proto`) | Optional (OpenAPI / Swagger) |
| **Performance** | High throughput, minimal network serialization overhead | Moderate overhead from JSON text serialization |
| **Streaming Modes** | Unary, Server Streaming, Client Streaming, Bidirectional | Predominantly unary request/response |
| **Primary Use Case** | Inter-service microservice backplanes | Public-facing web APIs consumed by browsers |

---

## 3. Practical Demo: Pokédex with BFF Architecture

<StepByStep>
  <Step number="1" title="Define Contract in Protocol Buffers">
    ```protobuf title="proto/pokemon.proto"
    syntax = "proto3";

    package pokemon;

    service PokemonService {
      rpc GetPokemon (PokemonRequest) returns (PokemonResponse);
    }

    message PokemonRequest {
      string name_or_id = 1;
    }

    message PokemonResponse {
      int32 id = 1;
      string name = 2;
      int32 height = 3;
      int32 weight = 4;
      repeated string types = 5;
      string sprite_url = 6;
      string description = 7;
    }
    ```
  </Step>

  <Step number="2" title="Implement gRPC Server in Node.js">
    The Node.js server compiles the `.proto` schema, queries the upstream PokeAPI, and responds to gRPC clients via structured binary streams:

    ```bash
    cd backend_node
    npm install
    node server.js
    ```
  </Step>

  <Step number="3" title="Implement Python gRPC Client (Flask BFF)">
    The Python Backend for Frontend (BFF) consumes the gRPC service and serves HTML/JSON to the client browser:

    ```bash
    cd frontend_python
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    python app.py
    ```
  </Step>
</StepByStep>
