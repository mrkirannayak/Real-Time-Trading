'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Ticker } from '@/lib/types';

interface TickerCardProps {
  ticker: Ticker;
}

export function TickerCard({ ticker }: TickerCardProps) {
  const router = useRouter();
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const [prevPrice, setPrevPrice] = useState(ticker.price);

  useEffect(() => {
    if (ticker.price > prevPrice) {
      setFlash('up');
    } else if (ticker.price < prevPrice) {
      setFlash('down');
    }
    setPrevPrice(ticker.price);
    
    const timer = setTimeout(() => setFlash(null), 500);
    return () => clearTimeout(timer);
  }, [ticker.price, prevPrice]);

  const isPositive = ticker.change >= 0;

  return (
    <div
      onClick={() => router.push(`/stock/${ticker.symbol}`)}
      className={`
        cursor-pointer rounded-xl border border-zinc-200 bg-white p-5 
        transition-all duration-200 hover:scale-[1.02] hover:border-zinc-300 hover:bg-zinc-50
        dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/50
        ${flash === 'up' ? 'animate-flash-up' : ''}
        ${flash === 'down' ? 'animate-flash-down' : ''}
      `}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {ticker.logo && (
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image 
                src={ticker.logo} 
                alt={ticker.name}
                fill
                className="rounded-full object-contain bg-white"
                unoptimized
              />
            </div>
          )}
          <div>
            <h3 className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-100">{ticker.symbol}</h3>
            <p className="text-xs text-zinc-500">{ticker.name}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            ${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`font-mono text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{ticker.changePercent.toFixed(2)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">
            {isPositive ? '+' : ''}${ticker.change.toFixed(2)}
          </span>
          <span className="text-zinc-500">
            Vol: {(ticker.volume / 1000).toFixed(1)}K
          </span>
        </div>
      </div>
    </div>
  );
}
