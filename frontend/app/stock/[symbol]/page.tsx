"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { updateTickers, setSelectedSymbol } from "@/lib/redux/marketSlice";
import { fetchTickers } from "@/lib/api";
import { useWebSocket } from "@/lib/websocket";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceChart } from "@/components/PriceChart";
import { Notifications } from "@/components/Notifications";
// import { Ticker } from "@/lib/types";
import Link from "next/link";

export default function StockDetailPage() {
  const params = useParams();
  // const router = useRouter();
  const dispatch = useAppDispatch();
  const { tickers } = useAppSelector((state) => state.market);
  const [loading, setLoading] = useState(true);

  const symbol = params.symbol as string;

  useWebSocket([symbol]);

  useEffect(() => {
    dispatch(setSelectedSymbol(symbol));
    loadData();

    return () => {
      dispatch(setSelectedSymbol(null));
    };
  }, [symbol, dispatch]);

  const loadData = async () => {
    try {
      const data = await fetchTickers();
      dispatch(updateTickers(data));
    } catch (error) {
      console.error("Failed to load tickers:", error);
    } finally {
      setLoading(false);
    }
  };

  const ticker = tickers[symbol];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Header />
        <main className="mx-auto max-w-5xl px-6 py-8">
          <div className="h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 mb-8" />
          <div className="h-16 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 mb-8" />
          <div className="h-72 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-900" />
        </main>
      </div>
    );
  }

  if (!ticker) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Header />
        <main className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-zinc-500">Ticker not found</p>
        </main>
      </div>
    );
  }

  const isPositive = ticker.change >= 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button> */}

        <Link
          href="/"
          className="mb-6 flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="flex items-start gap-4">
            {ticker.logo && (
              <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                  src={ticker.logo}
                  alt={ticker.name}
                  fill
                  className="rounded-full object-contain bg-white p-1"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {ticker.symbol}
                  </h1>
                  <p className="text-zinc-500">{ticker.name}</p>
                </div>
              </div>
              <div
                className={`flex items-center gap-2 rounded px-3 py-1.5 ${isPositive ? "bg-emerald-500/10" : "bg-red-500/10"}`}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-auto text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-auto text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}
                >
                  {isPositive ? "+" : ""}
                  {ticker.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-4">
            <span className="font-mono text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              $
              {ticker.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span
              className={`font-mono text-lg ${isPositive ? "text-emerald-500" : "text-red-500"}`}
            >
              {isPositive ? "+" : ""}${ticker.change.toFixed(2)}
            </span>
          </div>
        </div>

        <PriceChart symbol={symbol} />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <p className="mb-1 text-xs text-zinc-500">24h High</p>
            <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              ${ticker.high24h.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <p className="mb-1 text-xs text-zinc-500">24h Low</p>
            <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              ${ticker.low24h.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <p className="mb-1 text-xs text-zinc-500">Volume</p>
            <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {(ticker.volume / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <p className="mb-1 text-xs text-zinc-500">Volatility</p>
            <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {(ticker.volatility * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <Notifications />
    </div>
  );
}
