import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { v4 as uuidv4 } from "uuid";
import {
  startMarketData,
  stopMarketData,
  getTicker,
  getAllTickers,
  getPriceHistory,
  subscribe,
} from "./marketData";
import { getCache, setCache } from "./cache";
import { Alert } from "./types";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

const PORT = 4000;

const alerts: Map<string, Alert> = new Map();
const wsClients = new Map<WebSocket, Set<string>>();

var publicDir = require("path").join(__dirname, "../logos");
app.use("/logos", express.static(publicDir));

app.get("/api/tickers", (_req, res) => {
  const tickers = getAllTickers();
  res.json(tickers);
});

app.get("/api/tickers/:symbol", (req, res) => {
  const { symbol } = req.params;
  const ticker = getTicker(symbol);

  if (!ticker) {
    return res.status(404).json({ error: "Ticker not found" });
  }

  res.json(ticker);
});

app.get("/api/tickers/:symbol/history", (req, res) => {
  const { symbol } = req.params;
  const range = (req.query.range as "1D" | "1W" | "1M") || "1D";

  const cacheKey = `history:${symbol}:${range}`;
  const cached = getCache<{
    symbol: string;
    range: string;
    data: ReturnType<typeof getPriceHistory>;
  }>(cacheKey);

  if (cached) {
    return res.json(cached.data);
  }

  const history = getPriceHistory(symbol, range);
  setCache(cacheKey, { symbol, range, data: history });

  res.json(history);
});

app.post("/api/alerts", (req, res) => {
  const { symbol, type, targetPrice } = req.body;

  if (!symbol || !type || !targetPrice) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const alert: Alert = {
    id: uuidv4(),
    symbol,
    type,
    targetPrice: parseFloat(targetPrice),
    triggered: false,
    createdAt: Date.now(),
  };

  alerts.set(alert.id, alert);
  res.json(alert);
});

app.get("/api/alerts", (_req, res) => {
  res.json(Array.from(alerts.values()));
});

app.delete("/api/alerts/:id", (req, res) => {
  const { id } = req.params;

  if (!alerts.has(id)) {
    return res.status(404).json({ error: "Alert not found" });
  }

  alerts.delete(id);
  res.json({ success: true });
});

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  wsClients.set(ws, new Set());

  let unsubscribe: (() => void) | null = null;

  const sendUpdate = (tickers: ReturnType<typeof getAllTickers>) => {
    if (ws.readyState === WebSocket.OPEN) {
      const subscribed = wsClients.get(ws);
      if (!subscribed) return;

      const filtered = tickers.filter((t) => subscribed.has(t.symbol));
      if (filtered.length > 0) {
        ws.send(JSON.stringify({ type: "batch", data: filtered }));
      }
    }
  };

  unsubscribe = subscribe(sendUpdate);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      const subscribed = wsClients.get(ws);
      if (!subscribed) return;

      if (data.type === "subscribe" && Array.isArray(data.symbols)) {
        data.symbols.forEach((s: string) => subscribed.add(s));
      } else if (data.type === "unsubscribe" && Array.isArray(data.symbols)) {
        data.symbols.forEach((s: string) => subscribed.delete(s));
      }
    } catch (e) {
      console.error("WebSocket message error:", e);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    wsClients.delete(ws);
    if (unsubscribe) unsubscribe();
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

function checkAlerts(): void {
  const tickers = getAllTickers();

  alerts.forEach((alert) => {
    if (alert.triggered) return;

    const ticker = tickers.find((t) => t.symbol === alert.symbol);
    if (!ticker) return;

    const triggered =
      (alert.type === "above" && ticker.price >= alert.targetPrice) ||
      (alert.type === "below" && ticker.price <= alert.targetPrice);

    if (triggered) {
      alert.triggered = true;

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "alert",
              data: {
                ...alert,
                currentPrice: ticker.price,
                message: `${alert.symbol} is now ${alert.type} $${alert.targetPrice} (Current: $${ticker.price.toFixed(2)})`,
              },
            }),
          );
        }
      });
    }
  });
}

setInterval(checkAlerts, 1000);

startMarketData();

server.listen(PORT, () => {
  console.log(`Market Data Service running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  stopMarketData();
  server.close(() => {
    process.exit(0);
  });
});
