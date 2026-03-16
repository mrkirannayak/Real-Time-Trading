'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto flex max-w-7xl items-center justify-center px-6 py-32">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">Portfolio</h1>
          <p className="text-lg text-zinc-500">Coming Soon</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}