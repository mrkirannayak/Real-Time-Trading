import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticker, PricePoint, TimeRange } from '../types';

interface MarketState {
  tickers: Record<string, Ticker>;
  selectedSymbol: string | null;
  priceHistory: Record<string, PricePoint[]>;
  timeRange: TimeRange;
  isConnected: boolean;
}

const initialState: MarketState = {
  tickers: {},
  selectedSymbol: null,
  priceHistory: {},
  timeRange: '1D',
  isConnected: false,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    updateTickers: (state, action: PayloadAction<Ticker[]>) => {
      action.payload.forEach(ticker => {
        state.tickers[ticker.symbol] = ticker;
      });
    },
    updateTicker: (state, action: PayloadAction<Ticker>) => {
      state.tickers[action.payload.symbol] = action.payload;
    },
    setSelectedSymbol: (state, action: PayloadAction<string | null>) => {
      state.selectedSymbol = action.payload;
    },
    setPriceHistory: (state, action: PayloadAction<{ symbol: string; data: PricePoint[] }>) => {
      state.priceHistory[action.payload.symbol] = action.payload.data;
    },
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.timeRange = action.payload;
    },
  },
});

export const { setConnected, updateTickers, updateTicker, setSelectedSymbol, setPriceHistory, setTimeRange } = marketSlice.actions;
export default marketSlice.reducer;
