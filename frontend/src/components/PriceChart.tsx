'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setPriceHistory, setTimeRange } from '@/lib/redux/marketSlice';
import { fetchPriceHistory } from '@/lib/api';
import { TimeRange } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';

interface PriceChartProps {
  symbol: string;
}

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
];

export function PriceChart({ symbol }: PriceChartProps) {
  const dispatch = useAppDispatch();
  const { priceHistory, timeRange } = useAppSelector(state => state.market);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const history = priceHistory[symbol] || [];

  useEffect(() => {
    loadHistory();
  }, [symbol, timeRange]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchPriceHistory(symbol, timeRange);
      dispatch(setPriceHistory({ symbol, data }));
    } catch (error) {
      console.error('Failed to load price history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeRange === '1D') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '1W') {
      return date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatPrice = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const chartData = history.map(point => ({
    time: point.timestamp,
    price: point.price,
    formattedTime: formatTime(point.timestamp),
  }));

  const isPositive = history.length > 1 && history[history.length - 1].price >= history[0].price;
  const gradientColor = isPositive ? '#22c55e' : '#ef4444';

  const isDark = theme === 'dark';
  const chartColors = {
    background: isDark ? '#09090b' : '#ffffff',
    border: isDark ? '#27272a' : '#e4e4e7',
    text: isDark ? '#71717a' : '#71717a',
    textSecondary: isDark ? '#a1a1aa' : '#71717a',
    grid: isDark ? '#27272a' : '#e4e4e7',
    tooltipBg: isDark ? '#18181b' : '#ffffff',
    tooltipBorder: isDark ? '#27272a' : '#e4e4e7',
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/50">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Price History</h3>
        <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-950">
          {TIME_RANGES.map(range => (
            <button
              key={range.value}
              onClick={() => dispatch(setTimeRange(range.value))}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis
                dataKey="formattedTime"
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartColors.text, fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartColors.text, fontSize: 11 }}
                tickFormatter={formatPrice}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartColors.tooltipBg,
                  border: `1px solid ${chartColors.tooltipBorder}`,
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: chartColors.textSecondary, fontSize: 12 }}
                itemStyle={{ color: isDark ? '#f4f4f5' : '#18181b', fontSize: 14 }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={gradientColor}
                strokeWidth={2}
                fill="url(#priceGradient)"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
