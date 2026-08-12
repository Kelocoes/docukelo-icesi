---
sidebar_position: 5
---

# FastAPI Guide

# Group Members

- Juan Camilo Molina Mussen - A00399775
- Sharik Camila Rueda Lucero - A00399189

# Wordle API — FastAPI | SQLAlchemy | PostgreSQL | Docker

---

## What is FastAPI?

**FastAPI** is a modern, high-performance web framework for building **APIs** with **Python**. It leverages **Python type hints** for automatic data validation (via Pydantic) and auto-generates interactive API documentation (OpenAPI / Swagger UI). It is natively built for asynchronous operations with `async`/`await`.

## Why use FastAPI here?
- Data validation powered by Pydantic
- Interactive OpenAPI / Swagger UI documentation ready out of the box
- Seamless integration with SQLAlchemy 2.0 and Alembic

## Why combine PostgreSQL with FastAPI and SQLAlchemy?
- **Stability & Performance**: PostgreSQL is a robust, production-grade relational database.
- **SQLAlchemy 2.0**: A mature, typed ORM layer with a powerful ecosystem.
- **Docker**: Ensures reproducible database and backend setups across all development environments.

## Development Environment Setup

## Prerequisites
- Python 3.11+
- Docker & Docker Compose
- pip / venv

## Tech Stack & Project Architecture
- **FastAPI**
- **SQLAlchemy 2.0** + **Alembic**
- **PostgreSQL**
- **Feature-based Architecture**: words, games, guesses

```bash
app/
├─ api/router.py
├─ core/{config, middleware, lifespan}.py
├─ db/{base.py, session.py}
├─ features/
│  ├─ words/
│  ├─ games/
│  └─ guesses/
└─ main.py
```

## Clone / Install Dependencies
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Database Setup with Docker
```yaml
services:
  db:
    image: postgres:17
    container_name: wordle-postgres
    environment:
      POSTGRES_USER: wordle
      POSTGRES_PASSWORD: wordle
      POSTGRES_DB: wordle
    ports:
      - "5431:5432"
    volumes:
      - wordle_pgdata:/var/lib/postgresql/data
volumes:
  wordle_pgdata:
```

Start the database:
```bash
docker compose up -d
```

## Environment Variables
```ini
DEBUG=true
DATABASE_URL=postgresql+psycopg://wordle:wordle@localhost:5431/wordle
ALLOWED_ORIGINS=["http://localhost:5173"]
```

## Database Migrations with Alembic
Apply migrations:
```bash
cd wordleAPI/
alembic upgrade head
```

## Run the API
```bash
cd wordleAPI/
fastapi dev app/main.py
```

## Core Endpoints
### Words
- GET `/api/v1/words`
- GET `/api/v1/words/random`
- GET `/api/v1/words/exists?text=PERRO`
- POST `/api/v1/words/bulk`

### Games
- POST `/api/v1/games`
- GET `/api/v1/games/{id}`

### Guesses
- POST `/api/v1/guesses/{game_id}`

## Quick Testing (cURL / Postman)

### Seed Words
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/words/bulk" -H "Content-Type: application/json" -d '{"words":["PERRO","SALSA","LIMON","NIEVE","PLAZA"]}'
```

### Create Game
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/games" -H "Content-Type: application/json" -d '{}'
```

### Make a Guess
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/guesses/1" -H "Content-Type: application/json" -d '{"text":"PERRO"}'
```

> **Tip**:
> When running the dev server with
> ```bash
> fastapi dev app/main.py
> ```
> open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).
> You can test endpoints directly in the browser or download the OpenAPI JSON schema (`/openapi.json`) to import directly into Postman.

---

## Frontend — React + Vite + Tailwind

### Prerequisites

* Node.js 18+ and npm
* FastAPI running on `http://127.0.0.1:8000`

### Directory Structure

```
wordle-frontend/
├─ src/
│  ├─ components/
│  │  ├─ Header.jsx
│  │  ├─ StatusBar.jsx
│  │  ├─ AttemptsCounter.jsx
│  │  ├─ Loading.jsx
│  │  ├─ GameBoard/
│  │  │  ├─ GameBoard.jsx
│  │  │  ├─ Row.jsx
│  │  │  └─ Cell.jsx
│  │  └─ Keyboard/
│  │     ├─ Keyboard.jsx
│  │     └─ Key.jsx
│  ├─ pages/
│  │  └─ GamePage.jsx
│  ├─ routes/
│  │  └─ routes.jsx
│  ├─ services/
│  │  ├─ axiosService.js
│  │  ├─ gameService.js
│  │  ├─ wordService.js
│  │  └─ guessService.js
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ tailwind.config.js
└─ vite.config.js
```

---

### Environment Variables (Frontend)

Create a `.env` file in the frontend root:

```ini
VITE_BASE_URL=http://127.0.0.1:8000
```

---

### Run the Frontend

```bash
cd wordle-frontend
npm install
npm run dev
# App will run at http://127.0.0.1:5173
```

> Ensure the FastAPI backend is running simultaneously.
