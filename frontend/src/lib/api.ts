import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_BASE,
});

export const fetchTickers = async () => {
  const response = await api.get('/api/tickers');
  return response.data;
};

export const fetchTicker = async (symbol: string) => {
  const response = await api.get(`/api/tickers/${symbol}`);
  return response.data;
};

export const fetchPriceHistory = async (symbol: string, range: string = '1D') => {
  const response = await api.get(`/api/tickers/${symbol}/history?range=${range}`);
  return response.data;
};

export const createAlert = async (symbol: string, type: 'above' | 'below', targetPrice: number) => {
  const response = await api.post('/api/alerts', { symbol, type, targetPrice });
  return response.data;
};

export const fetchAlerts = async () => {
  const response = await api.get('/api/alerts');
  return response.data;
};

export const deleteAlert = async (id: string) => {
  const response = await api.delete(`/api/alerts/${id}`);
  return response.data;
};
