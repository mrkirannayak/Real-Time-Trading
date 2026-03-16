"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-blue-600">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />

      <div className="relative mx-auto max-w-7xl px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-indigo-100 font-bold">
                Now LIVE: CEX & DEX Trading Activity Report 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <Link
              href="/"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-50 hover:shadow-lg"
            >
              Get Started
            </Link> */}
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
