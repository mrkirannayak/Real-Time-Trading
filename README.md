# 🚀 MultiTrade --- Real-Time Trading Platform

> **MultiTrade** is a production-ready real-time trading platform that
> streams live market prices, renders interactive charts, and supports
> price alerts using a modern full‑stack architecture.

---

## ✨ Features

### 📊 Real-Time Trading Dashboard

- Live ticker price updates
- WebSocket streaming
- Auto reconnect mechanism
- Smooth green/red price animations
- Dark theme UI

### 📈 Stock Detail Page

- Interactive area charts
- Multiple time ranges:
  - 1D
  - 1W
  - 1M
- Historical data caching

### 🔔 Price Alerts

- Above / Below threshold alerts
- Notification system
- Alert management API

### 🔐 Mock Authentication

- Username-based login
- LocalStorage persistence

---

## 🏗️ System Architecture

    MultiTrade
    │
    ├── backend/     → Express + WebSocket Server
    └── frontend/    → Next.js App Router Application

---

## 🧰 Tech Stack

### Frontend

- Next.js 16 (App Router)
- React
- Redux Toolkit
- TypeScript
- WebSockets

### Backend

- Node.js
- Express.js
- WebSocket Server
- Random Walk Market Simulator
- In-memory caching

---

## 📡 Supported Market Tickers

- AAPL
- TSLA
- GOOGL
- AMZN
- MSFT
- NVDA
- BTC-USD
- ETH-USD

---

## 🔌 Backend API

### Tickers

---

Method Endpoint Description

---

GET `/api/tickers` Fetch all tickers

GET `/api/tickers/:symbol/history?range=1D\|1W\|1M` Historical data

---

### Alerts

Method Endpoint Description

---

GET `/api/alerts` Get alerts
POST `/api/alerts` Create alert
DELETE `/api/alerts` Delete alert

---

## ⚡ Real-Time Communication

    ws://localhost:4000

- Live price streaming
- Instant UI updates
- Automatic reconnect

---

## 🖥️ Pages

Route Description

---

`/` Dashboard
`/stock/[symbol]` Stock detail chart

---

## ▶️ Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/multitrade.git
cd multitrade
```

### 2️⃣ Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend:

    http://localhost:4000

### 3️⃣ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

    http://localhost:3000

---

## 🌐 Local Development URLs

Service URL

---

Frontend http://localhost:3000
Backend API http://localhost:4000
WebSocket ws://localhost:4000

---

## 🧠 State Management

Redux Toolkit slices:

- `market` → live ticker data
- `user` → authentication state
- `alerts` → alert management

---

## 📂 Project Structure

    multitrade/
    │
    ├── backend/
    │   ├── server/
    │   ├── websocket/
    │   ├── routes/
    │   └── market-generator/
    │
    └── frontend/
        ├── app/
        ├── components/
        ├── store/
        └── features/

---

## ⭐ Portfolio Highlight

This project demonstrates:

- Real-time system design
- WebSocket architecture
- Production-ready frontend patterns
- Scalable state management
- Modern full-stack engineering
