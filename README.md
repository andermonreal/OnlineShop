# OnlineShop

A full-stack e-commerce web application built with a Java EE backend (JAX-RS + JPA on Payara Server) and a React frontend. Users can browse and purchase products, manage a shopping cart, and administrators can manage users and the product catalog through a dedicated admin panel.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Configuration (.env)](#configuration-env)
- [Getting Started](#getting-started)
- [Daily Development Workflow](#daily-development-workflow)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## Architecture

The project follows a **hexagonal architecture** (ports and adapters) on the frontend and a classic layered architecture on the backend.

```
┌─────────────────────────────────────────────────────────────┐
│  Browser  →  React Frontend (Vite)  :80                     │
│               │                                             │
│               │ HTTP / REST JSON                            │
│               ▼                                             │
│  Payara 6  →  JAX-RS REST API  :8080/onlineShop/api         │
│               │                                             │
│               │ JPA / EclipseLink                           │
│               ▼                                             │
│  Docker  →  PostgreSQL  :5432                               │
└─────────────────────────────────────────────────────────────┘
```

### Frontend layers
| Layer | Location | Responsibility |
|-------|----------|---------------|
| Domain entities | `src/domain/entities/` | Pure business objects (User, Product, Order) |
| Use cases | `src/application/usecases/` | Orchestrate domain logic |
| API adapters | `src/infrastructure/api/` | HTTP calls to the backend |
| Presentation | `src/presentation/` | React components, pages, context |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Bootstrap 5, Bootstrap Icons |
| Backend | Java EE / Jakarta EE 10, JAX-RS (Jersey), JPA (EclipseLink) |
| Application server | Payara 6.2025.3 |
| Database | PostgreSQL 15 (Docker) |
| Authentication | JWT (SHA-256) |
| Build | Maven (backend), npm (frontend) |

---

## Prerequisites

Install the following before running the project:

| Tool | Version | Download |
|------|---------|----------|
| **Java JDK** | 17 or 21 | https://adoptium.net |
| **Maven** | 3.8+ | https://maven.apache.org/download.cgi |
| **Node.js** | 18+ | https://nodejs.org/en/download |
| **Docker** | Any recent | https://docs.docker.com/engine/install |
| **Payara Server** | **6.2025.3** | https://nexus.payara.fish/repository/payara-community/fish/payara/distributions/payara/6.2025.3/payara-6.2025.3.zip |

> ⚠️ **Important:** The project requires **Payara 6** specifically. Other versions may work but are untested. Download the Community edition from the link above and unzip it somewhere permanent (e.g. `~/Payara6`).

---

## Project Structure

```
onlineshop/                  ← project root (run ./server from here)
├── server                   ← service manager script
├── .env                     ← your local configuration (not committed)
├── .env.example             ← template — copy this to .env
│
├── backend/                 ← Java EE application
│   ├── pom.xml
│   └── src/main/java/psc/pscShop/
│       ├── config/          ← JWT, REST configuration
│       ├── dao/             ← Generic DAO + entity-specific DAOs
│       ├── dto/             ← Request/response data transfer objects
│       ├── entity/          ← JPA entities (User, Product, Order, OrderItem)
│       ├── resource/        ← JAX-RS endpoints (REST controllers)
│       └── service/         ← Business logic layer
│
├── frontend/                ← React application
│   ├── package.json
│   └── src/
│       ├── domain/entities/ ← User, Product, Order domain classes
│       ├── application/usecases/
│       ├── infrastructure/api/
│       └── presentation/    ← pages, components, contexts
│
└── database/
    └── docker-compose.yaml  ← PostgreSQL container
```

---

## Configuration (.env)

Copy the template and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env`:

```dotenv
# ── Payara ────────────────────────────────────────────────────────────────────
# Full path to the directory where you unzipped Payara (must contain bin/asadmin)
PAYARA_HOME=/home/youruser/Payara6

# Admin console port — leave as 4848 unless you changed it in Payara
PAYARA_ADMIN_PORT=4848

# ── Database ──────────────────────────────────────────────────────────────────
# These must match the values in database/docker-compose.yaml
POSTGRES_DB=pscShop
POSTGRES_USER=ander
POSTGRES_PASSWORD=ander123
POSTGRES_PORT=5432
POSTGRES_HOST=localhost

# ── Backend ───────────────────────────────────────────────────────────────────
BACKEND_HOST=localhost
BACKEND_PORT=8080
BACKEND_URL=http://localhost:8080

# ── Frontend ──────────────────────────────────────────────────────────────────
# Port 80 requires sudo on Linux (the server script handles this automatically)
FRONTEND_PORT=80
VITE_API_URL=http://localhost:8080

# ── JWT ───────────────────────────────────────────────────────────────────────
# Change this to a long random string in any non-development environment
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=86400

# ── Environment ───────────────────────────────────────────────────────────────
NODE_ENV=development
```

### Variable reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYARA_HOME` | ✅ | Absolute path to your Payara 6 installation |
| `PAYARA_ADMIN_PORT` | ✅ | Payara admin port (default `4848`) |
| `POSTGRES_DB` | ✅ | PostgreSQL database name |
| `POSTGRES_USER` | ✅ | PostgreSQL username |
| `POSTGRES_PASSWORD` | ✅ | PostgreSQL password |
| `POSTGRES_PORT` | ✅ | PostgreSQL port (default `5432`) |
| `POSTGRES_HOST` | ✅ | PostgreSQL host (use `localhost` for Docker) |
| `BACKEND_PORT` | ✅ | Payara HTTP port (default `8080`) |
| `FRONTEND_PORT` | ✅ | Port to serve the React app (default `80`) |
| `VITE_API_URL` | ✅ | Backend URL seen by the browser |
| `JWT_SECRET` | ✅ | Secret key used to sign JWT tokens |
| `JWT_EXPIRATION` | ✅ | Token lifetime in seconds (86400 = 24h) |

---

## Getting Started

### 1. Clone and configure

```bash
git clone <repository-url>
cd onlineshop
cp .env.example .env
# Edit .env — set PAYARA_HOME to your Payara installation path
```

### 2. Make the server script executable

```bash
chmod +x server
```

### 3. Start everything

```bash
./server start
```

The script will automatically:
1. Start PostgreSQL in Docker
2. Start Payara Server
3. Create the JDBC connection pool and resource (first run only)
4. Build the backend WAR with Maven
5. Deploy the WAR to Payara
6. Start the React frontend

When done you will see:

```
✔  All services running!

  Frontend        http://localhost:80
  Backend API     http://localhost:8080/onlineShop/api
  Payara console  http://localhost:4848
  Database        localhost:5432/pscShop
```

### 4. Open the app

Navigate to **http://localhost** in your browser. You will be redirected to the login page. Register an account to get started.

---

## Daily Development Workflow

```bash
# Start all services
./server start

# Check what is running
./server status

# After changing backend Java code — rebuild and redeploy without restarting Payara
./server redeploy

# Restart everything (e.g. after changing .env)
./server restart

# Stop all services when done
./server stop
```

### Frontend hot-reload

The frontend (Vite) supports hot module replacement — changes to `.jsx` and `.css` files are reflected in the browser instantly without any restart.

### Backend changes

Any change to Java files requires a redeploy:

```bash
./server redeploy
```

This runs `mvn clean package` and redeploys the new `.war` to the running Payara instance. It is faster than a full restart because Payara stays up.

---

## API Reference

All endpoints are prefixed with `/onlineShop/api`.  
Protected endpoints require the header: `Authorization: Bearer <token>`

### Authentication (`/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/users/login` | — | Sign in, returns JWT token |
| `POST` | `/users/register` | — | Create new account |
| `POST` | `/users/logout` | ✅ | Invalidate token |
| `GET` | `/users/role` | ✅ | Get current user role |
| `POST` | `/users/{id}/change-password` | ✅ | Change own password |

### Products (`/products`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/products/` | ✅ | List all products |
| `GET` | `/products/{id}` | ✅ | Get product by ID |

### Cart / Order (`/order`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/order/{userId}` | ✅ | Get user's active cart |
| `POST` | `/order/{userId}/add` | ✅ | Add product (`{ productId, quantity }`) |
| `DELETE` | `/order/{userId}/remove/{productId}` | ✅ | Remove all units of a product |
| `DELETE` | `/order/{userId}/remove/{productId}?quantity=N` | ✅ | Reduce quantity by N |
| `DELETE` | `/order/{userId}/clear` | ✅ | Empty the cart |

### Admin (`/admin`) — requires `admin` role

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/users` | List all users |
| `DELETE` | `/admin/{userId}/delUser` | Delete a user |
| `GET` | `/admin/{userId}/changeRol` | Toggle user role (admin ↔ customer) |
| `POST` | `/admin/{userId}/changePassword` | Change a user's password |
| `POST` | `/admin/addProduct` | Create a new product |
| `PUT` | `/admin/{productId}/updateProduct` | Update price / stock / description |
| `DELETE` | `/admin/{productId}/delProduct` | Delete a product |

---

## Troubleshooting

### `PAYARA_HOME` not found
```
✖  Payara directory not found: /home/you/Payara6
```
The path in `.env` does not exist. Download Payara 6.2025.3 from:  
https://nexus.payara.fish/repository/payara-community/fish/payara/distributions/payara/6.2025.3/payara-6.2025.3.zip  
Unzip it and set `PAYARA_HOME` to the extracted folder.

### Admin port not responding after start
```
✖  Payara admin port 4848 did not open after 60s
```
Payara failed to start. Check the server log:
```bash
cat $PAYARA_HOME/glassfish/domains/domain1/logs/server.log | tail -50
```

### Maven build fails
```
✖  Maven build failed
```
Run the build manually to see the full output:
```bash
cd backend
mvn clean package
```

### Port 80 permission denied (Linux)
Port 80 requires root on Linux. The `./server start` script automatically uses `sudo` for ports below 1024. You will be prompted for your password. Alternatively, set `FRONTEND_PORT=5173` in `.env` to use an unprivileged port during development.

### PostgreSQL won't start
Make sure Docker is running:
```bash
docker info
```
Then check the container logs:
```bash
docker-compose -f database/docker-compose.yaml logs
```

### Cart add/remove not working
This is caused by sending `Content-Type: application/json` on bodyless `DELETE` requests, which confuses JAX-RS endpoint routing. The frontend `ApiClient.js` already handles this correctly — only set `Content-Type` when there is a body.
