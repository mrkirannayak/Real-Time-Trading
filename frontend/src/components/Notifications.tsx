'use client';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { clearNotification } from '@/lib/redux/alertsSlice';
import { X, Bell } from 'lucide-react';
import { useEffect } from 'react';

export function Notifications() {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector(state => state.alerts);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch(clearNotification(notifications[0].id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  const latest = notifications[0];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-2xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
          <Bell className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="max-w-xs">
          <p className="text-sm font-medium text-zinc-100">{latest.message}</p>
        </div>
        <button
          onClick={() => dispatch(clearNotification(latest.id))}
          className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
