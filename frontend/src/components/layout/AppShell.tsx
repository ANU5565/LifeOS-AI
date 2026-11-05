"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  return (
    <div className="lifeos-app-shell">
      {!isLoading && user && <Sidebar />}
      <div className={!isLoading && user ? "min-h-screen md:pl-[240px]" : "min-h-screen"}>
        {!isLoading && user && (
          <header className="flex items-center justify-between border-b border-zinc-800/70 px-5 py-4 md:hidden">
            <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs">L</span>
              LifeOS <span className="text-violet-400">AI</span>
            </Link>
            <nav className="flex gap-3 text-xs text-zinc-400">
              <Link href="/goals" className="hover:text-white">Goals</Link>
              <Link href="/tasks" className="hover:text-white">Tasks</Link>
              <Link href="/insights" className="hover:text-white">Insights</Link>
            </nav>
          </header>
        )}
        {children}
      </div>
    </div>
  );
}
