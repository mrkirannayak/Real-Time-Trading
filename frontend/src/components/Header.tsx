"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Wifi,
  WifiOff,
  Bell,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/userSlice";
import { LoginModal } from "./LoginModal";
import { AlertModal } from "./AlertModal";
import { useTheme } from "@/lib/useTheme";

export function Header() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, username } = useAppSelector((state) => state.user);
  const { isConnected } = useAppSelector((state) => state.market);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Multi Trade
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              "Stocks",
              "Crypto",
              "Markets",
              "Research",
              "News",
              "Portfolio",
            ].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              ) : (
                <Moon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              )}
            </button>

            <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-emerald-500">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-500">Offline</span>
                </>
              )}
            </div>

            {isAuthenticated && (
              <button
                onClick={() => setShowAlertModal(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                <Bell className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <User className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showAlertModal && (
        <AlertModal onClose={() => setShowAlertModal(false)} />
      )}
    </>
  );
}
