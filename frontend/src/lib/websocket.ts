'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from './redux/hooks';
import { updateTickers, setConnected } from './redux/marketSlice';
import { addNotification } from './redux/alertsSlice';
import { Ticker } from './types';

const WS_URL = 'ws://localhost:4000';

export function useWebSocket(symbols: string[] = []) {
  const dispatch = useAppDispatch();
  const wsRef = useRef<WebSocket | null>(null);
  const subscribedRef = useRef<Set<string>>(new Set());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }
    
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        isConnectingRef.current = false;
        dispatch(setConnected(true));
        if (symbols.length > 0) {
          ws.send(JSON.stringify({ type: 'subscribe', symbols }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'batch' && Array.isArray(message.data)) {
            dispatch(updateTickers(message.data as Ticker[]));
          } else if (message.type === 'alert' && message.data) {
            dispatch(addNotification({
              id: message.data.id,
              message: message.data.message,
              type: 'info',
              timestamp: Date.now(),
            }));
            
            if (typeof window !== 'undefined' && 'Notification' in window) {
              if (Notification.permission === 'granted') {
                new Notification('Price Alert', { body: message.data.message });
              } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    new Notification('Price Alert', { body: message.data.message });
                  }
                });
              }
            }
          }
        } catch (e) {
          console.error('WebSocket message error:', e);
        }
      };

      ws.onclose = () => {
        isConnectingRef.current = false;
        dispatch(setConnected(false));
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        isConnectingRef.current = false;
        console.log('WebSocket connection issue, will retry...');
      };
    } catch (err) {
      isConnectingRef.current = false;
      console.log('WebSocket init failed, will retry...');
    }
  }, [dispatch, symbols]);

  const subscribe = useCallback((newSymbols: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const toSubscribe = newSymbols.filter(s => !subscribedRef.current.has(s));
      if (toSubscribe.length > 0) {
        wsRef.current.send(JSON.stringify({ type: 'subscribe', symbols: toSubscribe }));
        toSubscribe.forEach(s => subscribedRef.current.add(s));
      }
    }
  }, []);

  const unsubscribe = useCallback((symbolsToRemove: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'unsubscribe', symbols: symbolsToRemove }));
      symbolsToRemove.forEach(s => subscribedRef.current.delete(s));
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (symbols.length > 0) {
      subscribe(symbols);
    }
  }, [symbols, subscribe]);

  return { subscribe, unsubscribe };
}
