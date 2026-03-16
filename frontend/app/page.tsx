"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { updateTickers, setSelectedSymbol } from "@/lib/redux/marketSlice";
import { fetchTickers } from "@/lib/api";
import { useWebSocket } from "@/lib/websocket";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TickerCard } from "@/components/TickerCard";
import { Notifications } from "@/components/Notifications";
import { Banner } from "@/components/Banner";
import { Ticker } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { tickers } = useAppSelector((state) => state.market);
  const [loading, setLoading] = useState(true);

  const symbols = [
    "AAPL",
    "TSLA",
    "GOOGL",
    "AMZN",
    "MSFT",
    "NVDA",
    "BTC-USD",
    "ETH-USD",
  ];
  useWebSocket(symbols);

  useEffect(() => {
    loadTickers();
  }, []);

  const loadTickers = async () => {
    try {
      const data = await fetchTickers();
      dispatch(updateTickers(data));
    } catch (error) {
      console.error("Failed to load tickers:", error);
    } finally {
      setLoading(false);
    }
  };

  const tickerList = Object.values(tickers);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Banner />
      <Header />
      <HeroBanner />

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Market Overview
          </h1>
          <p className="text-zinc-500 dark:text-zinc-500">
            Real-time stock prices and market data
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-900/50"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tickerList.map((ticker) => (
              <TickerCard key={ticker.symbol} ticker={ticker} />
            ))}
          </div>
        )}

        {!loading && tickerList.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500">No market data available</p>
          </div>
        )}
      </main>

      <Footer />
      <Notifications />
    </div>
  );
}
