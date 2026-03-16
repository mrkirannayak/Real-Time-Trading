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

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

export type TimeRange = '1D' | '1W' | '1M';
