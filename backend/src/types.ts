export interface Ticker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
  high24h: number;
  low24h: number;
  volatility: number;
  logo?: string;
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'above' | 'below';
  targetPrice: number;
  triggered: boolean;
  createdAt: number;
}

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export interface WsMessage {
  type: 'subscribe' | 'unsubscribe' | 'price' | 'batch' | 'alert';
  symbols?: string[];
  data?: Ticker | Ticker[];
}

export interface HistoryParams {
  symbol: string;
  range: '1D' | '1W' | '1M';
}
