'use client';

import { useState, useEffect } from 'react';
import { X, Bell, Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setAlerts, removeAlert, addAlert } from '@/lib/redux/alertsSlice';
import { fetchAlerts, createAlert, deleteAlert } from '@/lib/api';

interface AlertModalProps {
  onClose: () => void;
}

export function AlertModal({ onClose }: AlertModalProps) {
  const dispatch = useAppDispatch();
  const { items: alerts } = useAppSelector(state => state.alerts);
  const { tickers } = useAppSelector(state => state.market);
  const [symbol, setSymbol] = useState('AAPL');
  const [type, setType] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts();
      dispatch(setAlerts(data));
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice) return;

    setLoading(true);
    try {
      const price = parseFloat(targetPrice);
      const newAlert = await createAlert(symbol, type, price);
      dispatch(addAlert(newAlert));
      setTargetPrice('');
    } catch (error) {
      console.error('Failed to create alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await deleteAlert(id);
      dispatch(removeAlert(id));
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  };

  const tickerOptions = Object.values(tickers);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Price Alerts</h2>
        </div>

        <form onSubmit={handleCreateAlert} className="mb-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="col-span-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            >
              {tickerOptions.map(t => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'above' | 'below')}
              className="col-span-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Price"
              className="col-span-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !targetPrice}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Create Alert
          </button>
        </form>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Alerts</h3>
          {alerts.length === 0 ? (
            <p className="py-4 text-center text-sm text-zinc-500">No alerts configured</p>
          ) : (
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 ${alert.triggered ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {alert.type === 'above' ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        {alert.symbol} {alert.type} ${alert.targetPrice.toFixed(2)}
                      </p>
                      {alert.triggered && (
                        <span className="text-xs text-emerald-500">Triggered</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
