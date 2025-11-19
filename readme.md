# ⚡ Real-Time Stock Exchange Engine

> **A high-performance, real-time stock trading simulator** built with a multithreaded C++ backend, Redis pub/sub relay, and a modern React + Next.js frontend.  
> Designed to emulate real-world stock exchange mechanics — order matching, trade execution, and live market updates.

---

## 🧩 Project Overview

### 🎯 Purpose
This project demonstrates how a real-time trading engine operates — from order matching to instant trade broadcasting.  
It’s designed for **educational**, **portfolio**, and **research** use in financial systems, concurrency, and distributed architecture.

### 🧠 Core Capabilities
- Place buy/sell orders via a web UI
- Automatic order matching using price–time priority
- Real-time trade updates through WebSocket
- PostgreSQL-backed persistent storage
- Redis pub/sub event system
- Multi-threaded backend written in C++
- Modern UI with live trade feed

```

## 🏗️ Architecture

┌──────────────┐      HTTP/REST      ┌──────────────┐
│   Frontend   │  ─────────────────> │   C++ API    │
│ (Next.js 16) │ <─────────────────  │   (Crow)     │
└──────────────┘      JSON API       └──────────────┘
        │                                   │
        │ WebSocket (Socket.IO)             │
        │                                   │
        ▼                                   ▼
   ┌────────────┐                    ┌─────────────┐
   │ Node Relay │ <──── Redis Pub ───│  C++ Engine │
   │ (Socket.IO)│      / Sub         │  (hiredis)  │
   └────────────┘                    └─────────────┘
        │                                   │
        ▼                                   ▼
   Clients receive live                Orders/Trades stored
   updates instantly                   in PostgreSQL DB
🧰 Technology Stack
🖥️ Backend (C++17)
Framework: Crow (header-only HTTP web framework)

Concurrency: std::atomic, Boost.Thread

Database: libpqxx (PostgreSQL client)

Pub/Sub: hiredis (Redis client)

Build: CMake 3.10+, GCC/Clang

🌐 Frontend (Next.js 16 + React 19)
Framework: Next.js (App Router + Turbopack)

Language: TypeScript

Styling: Tailwind CSS 4

HTTP: Axios (RESTful API)

WebSocket: Socket.IO Client 4.8

UI: Geist Sans & Geist Mono (fonts)

🔁 Relay Server (Node.js)
Runtime: Node.js 20.x

Framework: Express.js 5

WebSocket: Socket.IO 4.8.1

Redis Client: redis + ioredis

🗄️ Infrastructure
Database: PostgreSQL

Cache / Message Broker: Redis

Version Control: Git

Hosting: Replit (dev) / Docker (planned)

🗂️ Project Structure
php

.
├── backend/
│   ├── src/
│   │   ├── main.cpp              # Application entry point
│   │   ├── server.cpp            # REST API endpoints
│   │   ├── matching_engine.cpp   # Core order-matching logic
│   │   ├── orderbook.cpp         # Priority queue order book
│   │   ├── database.cpp          # PostgreSQL interactions
│   │   └── redis_client.cpp      # Redis publisher
│   ├── include/                  # Header files
│   ├── config/                   # Config files (DB, Redis)
│   ├── relay/                    # Node.js WebSocket relay
│   └── CMakeLists.txt
│
├── frontend/stock_engine/
│   ├── app/                      # Next.js App Router pages
│   ├── Components/               # React components (UI)
│   ├── API/                      # Axios HTTP client
│   ├── public/                   # Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── scripts/
│   └── seed_db.sql               # PostgreSQL schema
│
├── docs/                         # Documentation files
│   ├── architecture.md
│   ├── api_endpoint.md
│   └── roadmap.md
│
└── ROADMAP.md                    # Development roadmap
```
⚙️ Setup & Installation
🧾 Prerequisites
Ensure you have the following installed:

GCC/Clang (C++17+)

CMake 3.10+

PostgreSQL 12+

Redis 6+

Node.js 20+ and npm 9+

Git

🧩 Step 1: Database Setup
bash

# Create the database
createdb stock_exchange

# Initialize tables
psql -d stock_exchange -f scripts/seed_db.sql
⚙️ Step 2: Configure Environment
Create a .env file in both backend and frontend/stock_engine/ directories:

bash

# backend/.env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=stock_exchange
REDIS_HOST=localhost
REDIS_PORT=6379

# frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
🧱 Step 3: Build & Run Backend
bash
Copy code
cd backend
mkdir build && cd build
cmake ..
make -j$(nproc)
./stock_engine
🔁 Step 4: Start Relay Server
bash

cd backend/relay
npm install
node server.js
🌐 Step 5: Run Frontend
bash
Copy code
cd frontend/stock_engine
npm install
npm run dev
Access the app at http://localhost:5000

🔍 API Endpoints
Method	Endpoint	Description
POST	/order	Place a new buy/sell order
GET	/trades	Fetch latest executed trades
GET	/orderbook/:symbol	View order book for a stock symbol
DELETE	/order/:id (Planned)	Cancel an open order

💬 WebSocket Events
Event	Source	Description
NewTrade	Redis → Relay → Frontend	Broadcasts each executed trade in real-time
OrderBookUpdate	(Planned)	Sends live order book data
CancelOrder	(Planned)	Broadcasts order cancellation

📊 Database Schema
sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    balance DOUBLE PRECISION
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id VARCHAR(50),
    symbol VARCHAR(10),
    type VARCHAR(10),
    price DOUBLE PRECISION,
    qty INT
);

CREATE TABLE trades (
    trade_id INT PRIMARY KEY,
    buy_id INT,
    sell_id INT,
    price DOUBLE PRECISION,
    qty INT
);
🔒 Security Recommendations
The following improvements are high priority before deployment:

Move all secrets to environment variables.

Implement JWT authentication.

Add CORS restrictions for production.

Use HTTPS (wss://) for Socket.IO.

Add input validation and rate limiting.

Secure Redis with authentication.

🧭 Roadmap Summary
For a detailed future development plan, see ROADMAP.md

Next Milestones:
✅ Environment variable migration

🔒 JWT Authentication

📊 OrderBook UI

✂️ Partial Order Fills

👤 User Portfolio System

🐳 Dockerized Deployment

🧠 Key Learnings
High-performance multithreading in C++

Real-time data handling with Redis pub/sub

REST + WebSocket hybrid communication

Building modular, polyglot architectures

Frontend state management for live data

📈 Future Enhancements
Multi-symbol trading and parallel order books

Persistent order recovery on restart

Trade replay/backtesting system

Role-based access control (RBAC)

Cloud-native deployment (Docker + Kubernetes)

👨‍💻 Author
Akshat Prashar
B.E. Computer Science (CSE)
Chitkara University

📧 Email Me
💼 LinkedIn :  https://www.linkedin.com/in/akshat-prashar-30684b2ab/
🌐 GitHub :    https://github.com/akshat20000/my-stock-exchange-engine

🏁 License
This project is licensed under the MIT License — see the LICENSE file for details.

"Building the foundations of real-time finance with open-source precision." ⚡
