# 🧭 Project Roadmap: Real-Time Stock Exchange Engine

> **Project Overview:**  
> A high-performance, real-time stock trading simulator with a multi-threaded C++ backend, Redis pub/sub relay server, and a modern React + Next.js frontend.  
> The platform allows users to place buy/sell orders, execute trades automatically, and view live updates on a responsive trading dashboard.

---

## 🚀 Current System Snapshot

### ✅ Implemented Features
- Real-time trade matching engine (C++)
- Order placement via REST API (`/order`)
- Trade storage in PostgreSQL
- Redis-based real-time pub/sub broadcast
- Node.js relay server using Socket.IO
- Frontend built with Next.js 16 + React 19 + TailwindCSS 4
- Live trade feed on the UI
- Basic database schema for `users`, `orders`, and `trades`
- Multi-threaded server operation for concurrency

### ⚠️ Known Gaps
- Hardcoded database credentials
- No authentication or authorization
- No order cancellation or partial fills
- No portfolio or balance tracking
- Incomplete OrderBook display
- No deployment automation (manual setup)
- No logging, monitoring, or testing

---

## 🧩 Phase 1: Security & Stability (Critical)
> **Goal:** Build a secure foundation before scaling functionality.

### 🔒 Tasks
- [ ] Move all sensitive credentials (DB, Redis) to `.env` files
- [ ] Remove hardcoded passwords from `main.cpp` and `db_config.json`
- [ ] Implement JWT-based authentication (`/login` and `/register`)
- [ ] Validate order input (price > 0, qty > 0, valid symbol)
- [ ] Configure Redis authentication and secure connection
- [ ] Implement rate limiting in the Node relay (to prevent spam)
- [ ] Add HTTPS/WSS support via SSL certificate (Nginx or Replit proxy)
- [ ] Secure CORS rules for production domains only

---

## ⚙️ Phase 2: Core Trading Enhancements
> **Goal:** Make the trading engine realistic and feature-complete.

### 📊 Tasks
- [ ] Implement **partial order fills**
  - Add `filled_qty` and `remaining_qty` to the database schema
  - Update matching logic in `matching_engine.cpp`
- [ ] Implement **order cancellation**
  - Add DELETE `/order/:id` endpoint
  - Broadcast cancellation events through Redis pub/sub
- [ ] Track **order status**
  - Introduce `OPEN`, `PARTIAL`, `FILLED`, `CANCELED` states
  - Add `status` column to `orders` table
- [ ] Persist order and trade timestamps
- [ ] Add input validation and error handling in all routes
- [ ] Refactor matching engine into separate class for clarity

---

## 💰 Phase 3: User Accounts & Portfolio Management
> **Goal:** Allow each user to manage their balance, orders, and holdings.

### 👤 Tasks
- [ ] Activate and expand `users` table
  - Columns: `id`, `username`, `password_hash`, `balance`, `holdings (JSONB)`
- [ ] Implement **balance management**
  - Deduct funds on buy order placement
  - Credit/debit balances after trade execution
- [ ] Implement **portfolio tracking**
  - Store current holdings per user
  - Display in frontend dashboard
- [ ] Add **transaction history API**
  - `/user/:id/history` to view executed trades and balances
- [ ] Frontend UI for login/signup and personal dashboard

---

## 🖥️ Phase 4: Frontend & Visualization
> **Goal:** Improve UI/UX and provide real-time data insights.

### 💡 Tasks
- [ ] Complete `OrderBook.tsx` to display bid/ask spreads
- [ ] Subscribe to Redis order book updates via WebSocket
- [ ] Integrate **Lightweight Charts** for price visualization
  - Display real-time price updates (candlestick or line charts)
- [ ] Create **User Dashboard**
  - Portfolio summary, open orders, recent trades
- [ ] Implement **Dark Mode enhancements**
  - Tailwind CSS configuration for better theme contrast
- [ ] Add system metrics (latency, trades/sec) to UI

---

## ☁️ Phase 5: Infrastructure & Deployment
> **Goal:** Deploy the system in a scalable, reproducible environment.

### ⚙️ Tasks
- [ ] Create **Dockerfiles** for:
  - C++ backend
  - Node relay server
  - Next.js frontend
- [ ] Set up **Docker Compose** for full-stack orchestration
- [ ] Automate build & deploy via **GitHub Actions**
- [ ] Add environment-based configuration (`dev`, `prod`)
- [ ] Use **Render**, **Railway**, or **Fly.io** for public deployment
- [ ] Configure **Nginx reverse proxy** for unified access (HTTPS)
- [ ] Set up PostgreSQL & Redis as managed cloud services
- [ ] Monitor resource usage and logs

---

## 📈 Phase 6: Performance & Monitoring
> **Goal:** Ensure the exchange engine scales and runs reliably.

### ⚡ Tasks
- [ ] Introduce connection pooling for PostgreSQL (libpqxx pool)
- [ ] Cache recent trades in Redis sorted sets
- [ ] Add indexes on `symbol`, `trade_id`, `user_id`
- [ ] Set up **Prometheus** metrics collection
- [ ] Build **Grafana dashboards** (latency, trade volume, match rate)
- [ ] Implement load testing using `k6` or `locust`
- [ ] Add centralized logging (e.g., Sentry or ELK stack)

---

## 🧠 Phase 7: Advanced Features (Long-Term)
> **Goal:** Turn the simulator into a near-production fintech-grade system.

### 🌟 Tasks
- [ ] Support **multiple stock symbols** and concurrent order books
- [ ] Implement **market and stop-loss orders**
- [ ] Add **WebSocket authentication** (JWT-secured channels)
- [ ] Enable **persistent order snapshots** for restart recovery
- [ ] Replace Redis pub/sub with **Kafka or RabbitMQ**
- [ ] Add **replay/backtesting mode** for historical data
- [ ] Simulate **latency and market events** for stress testing
- [ ] Implement **role-based access control (RBAC)** for admins/users

---

## 🧭 Suggested Timeline

| Phase | Focus | Estimated Time |
|:------|:------|:----------------|
| 1 | Security & stability | 1–2 weeks |
| 2 | Core trading logic | 2–3 weeks |
| 3 | User management | 1–2 weeks |
| 4 | Frontend improvements | 2 weeks |
| 5 | Deployment & DevOps | 1 week |
| 6 | Monitoring & performance | 1 week |
| 7 | Advanced features | Ongoing |

---

## 🧾 Notes
- Start with **security fixes before adding any new features**.  
- Keep the **C++ backend modular** (e.g., split matching engine, database handler, and API).  
- Document every new feature in `docs/roadmap.md` updates.  
- Once authentication and order book display are done, the project will be ready for **portfolio or internship showcases**.

---

## ✅ Final Vision

A **secure, scalable, and interactive trading simulation platform** demonstrating:
- Real-time order execution
- Distributed communication with Redis
- Modern frontend architecture
- Multi-threaded, high-performance backend in C++
- Robust design ready for academic or professional presentation

---

> _Maintained by: **Akshat Prashar**_  
> _Version: 1.0.0 | Last Updated: November 2025_
