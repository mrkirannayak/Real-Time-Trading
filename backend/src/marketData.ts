import { Ticker, PricePoint } from "./types";

const TICKERS_CONFIG: Array<{
  symbol: string;
  name: string;
  price: number;
  volatility: number;
  logo: string;
}> = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 185.5,
    volatility: 0.005,
    logo: "http://localhost:4000/logos/aapl-logo.svg",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.75,
    volatility: 0.012,
    logo: "http://localhost:4000/logos/tsla-logo.svg",
  },
  {
    symbol: "GOOGL",
    name: "Google Inc.",
    price: 142.3,
    volatility: 0.008,
    logo: "http://localhost:4000/logos/googl-logo.svg",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.9,
    volatility: 0.009,
    logo: "http://localhost:4000/logos/amazon-logo.svg",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.25,
    volatility: 0.006,
    logo: "http://localhost:4000/logos/msft-logo.svg",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 495.8,
    volatility: 0.015,
    logo: "http://localhost:4000/logos/nvda-icon.svg",
  },
  {
    symbol: "BTC-USD",
    name: "Bitcoin",
    price: 43250.0,
    volatility: 0.02,
    logo: "http://localhost:4000/logos/btc-usd-logo.svg",
  },
  {
    symbol: "ETH-USD",
    name: "Ethereum",
    price: 2280.0,
    volatility: 0.018,
    logo: "http://localhost:4000/logos/eth-usd-logo.svg",
  },
];

const tickers = new Map<string, Ticker>();
const priceHistory = new Map<string, PricePoint[]>();
let updateInterval: NodeJS.Timeout | null = null;
let subscribers: ((data: Ticker[]) => void)[] = [];

function randomWalk(price: number, volatility: number): number {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return price * (1 + change);
}

function generateInitialPrices(): void {
  TICKERS_CONFIG.forEach((config) => {
    const now = Date.now();
    const ticker: Ticker = {
      ...config,
      price: config.price,
      change: 0,
      changePercent: 0,
      volume: Math.floor(Math.random() * 90000) + 10000,
      timestamp: now,
      high24h: config.price * 1.02,
      low24h: config.price * 0.98,
    };
    tickers.set(config.symbol, ticker);

    const history: PricePoint[] = [];
    for (let i = 390; i >= 0; i--) {
      const time = now - i * 60000;
      history.push({
        timestamp: time,
        price: config.price * (1 + (Math.random() - 0.5) * 0.02),
        volume: Math.floor(Math.random() * 90000) + 10000,
      });
    }
    priceHistory.set(config.symbol, history);
  });
}

function updatePrices(): void {
  const now = Date.now();
  const updatedTickers: Ticker[] = [];

  tickers.forEach((ticker, symbol) => {
    const oldPrice = ticker.price;
    const newPrice = randomWalk(oldPrice, ticker.volatility);
    const change = newPrice - oldPrice;
    const changePercent = (change / oldPrice) * 100;

    const updated: Ticker = {
      ...ticker,
      price: newPrice,
      change,
      changePercent,
      volume: ticker.volume + Math.floor(Math.random() * 1000),
      timestamp: now,
      high24h: Math.max(ticker.high24h, newPrice),
      low24h: Math.min(ticker.low24h, newPrice),
    };

    tickers.set(symbol, updated);
    updatedTickers.push(updated);

    const history = priceHistory.get(symbol) || [];
    history.push({
      timestamp: now,
      price: newPrice,
      volume: updated.volume,
    });

    if (history.length > 1000) {
      history.shift();
    }
    priceHistory.set(symbol, history);
  });

  subscribers.forEach((cb) => cb(updatedTickers));
}

export function startMarketData(): void {
  if (updateInterval) return;

  generateInitialPrices();

  updateInterval = setInterval(
    () => {
      updatePrices();
    },
    1000 + Math.random() * 2000,
  );

  console.log("Market data generator started");
}

export function stopMarketData(): void {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

export function getTicker(symbol: string): Ticker | undefined {
  return tickers.get(symbol);
}

export function getAllTickers(): Ticker[] {
  return Array.from(tickers.values());
}

export function getPriceHistory(
  symbol: string,
  range: "1D" | "1W" | "1M",
): PricePoint[] {
  const history = priceHistory.get(symbol) || [];
  const now = Date.now();
  let cutoff: number;

  switch (range) {
    case "1D":
      cutoff = now - 24 * 60 * 60 * 1000;
      break;
    case "1W":
      cutoff = now - 7 * 24 * 60 * 60 * 1000;
      break;
    case "1M":
      cutoff = now - 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      cutoff = now - 24 * 60 * 60 * 1000;
  }

  return history.filter((p) => p.timestamp >= cutoff);
}

export function subscribe(callback: (data: Ticker[]) => void): () => void {
  subscribers.push(callback);
  callback(getAllTickers());

  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
  };
}
