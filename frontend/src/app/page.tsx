"use client";

import { useEffect, useState } from "react";
import { goals, tasks, type Goal, type Task } from "@/lib/api";
import { useAuth } from "@/lib/auth";

function SectionSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 animate-pulse">
      <div className="h-4 w-32 rounded bg-zinc-700 mb-3" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-zinc-800" />
        <div className="h-3 w-4/5 rounded bg-zinc-800" />
      </div>
    </div>
  );
}

function EmptyStateCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
      <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [goalsList, setGoalsList] = useState<Goal[]>([]);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    async function fetchDashboardData() {
      setIsDataLoading(true);
      setError(null);
      try {
        const [goalsData, tasksData] = await Promise.all([goals.list(), tasks.list()]);
        if (!isMounted) return;
        setGoalsList(goalsData);
        setTasksList(tasksData);
      } catch {
        if (!isMounted) return;
        setError("Unable to load your goals and tasks right now.");
      } finally {
        if (isMounted) {
          setIsDataLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
        <p className="text-sm text-zinc-400">Loading your account...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
          <h1 className="text-base font-semibold">Welcome to LifeOS AI</h1>
          <p className="mt-1 text-sm text-zinc-400">Please sign in to load your dashboard.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 space-y-4">
      <header>
        <h1 className="text-xl font-semibold">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
        <p className="mt-1 text-sm text-zinc-400">Here&apos;s what&apos;s in your workspace.</p>
      </header>

      {isDataLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goalsList.length === 0 ? (
            <EmptyStateCard title="No goals yet" description="Create your first goal to start tracking progress." />
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
              <h2 className="text-sm font-semibold text-zinc-200">Goals</h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                {goalsList.slice(0, 3).map((goal) => (
                  <li key={goal.id}>{goal.title}</li>
                ))}
              </ul>
            </div>
          )}

          {tasksList.length === 0 ? (
            <EmptyStateCard title="No tasks yet" description="Add a task to break your goals into action steps." />
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
              <h2 className="text-sm font-semibold text-zinc-200">Tasks</h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                {tasksList.slice(0, 3).map((task) => (
                  <li key={task.id}>{task.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}
    </main>
  );
}
