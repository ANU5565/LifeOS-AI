"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { goals, tasks, type Goal, type Task } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";

function StatCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: string }) {
  return (
    <div className="ui-card ui-card-hover">
      <div className={`mb-4 h-10 w-10 rounded-xl ${tone} flex items-center justify-center`}>
        <span className="text-lg font-semibold text-white">{value}</span>
      </div>
      <p className="text-sm font-medium text-zinc-300">{label}</p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

export function DashboardView() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [goalsList, setGoalsList] = useState<Goal[]>([]);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    Promise.all([goals.list(), tasks.list()])
      .then(([goalData, taskData]) => {
        if (!active) return;
        setGoalsList(goalData);
        setTasksList(taskData);
      })
      .catch(() => active && setError("We couldn’t refresh your workspace. Please try again."))
      .finally(() => active && setIsDataLoading(false));
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const completedTasks = tasksList.filter((task) => task.status.toLowerCase() === "completed").length;
  const activeGoals = goalsList.filter((goal) => goal.status.toLowerCase() !== "completed").length;
  const taskProgress = tasksList.length ? Math.round((completedTasks / tasksList.length) * 100) : 0;
  const upcomingTasks = useMemo(
    () => tasksList.filter((task) => task.status.toLowerCase() !== "completed").slice(0, 4),
    [tasksList],
  );

  if (isLoading) {
    return <AppShell><main className="page-frame"><div className="ui-card animate-pulse h-32" /></main></AppShell>;
  }

  if (!isAuthenticated) {
    return <AppShell><main className="page-frame"><div className="ui-card max-w-lg"><h1 className="text-xl font-semibold">Welcome to LifeOS AI</h1><p className="mt-2 text-sm text-zinc-400">Sign in to see your personal workspace.</p></div></main></AppShell>;
  }

  return (
    <AppShell>
      <main className="page-frame">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Your command center</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Good to see you{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              Keep your attention on the few things that move your life forward today.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/goals" className="ui-btn ui-btn-secondary">Review goals</Link>
            <Link href="/tasks" className="ui-btn ui-btn-primary">Add a task</Link>
          </div>
        </header>

        {error && <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Open goals" value={isDataLoading ? "—" : String(activeGoals)} detail="Keep the bigger picture visible" tone="bg-violet-500/80" />
          <StatCard label="Tasks completed" value={isDataLoading ? "—" : String(completedTasks)} detail={`${taskProgress}% of your task list`} tone="bg-emerald-500/80" />
          <StatCard label="Tasks in motion" value={isDataLoading ? "—" : String(upcomingTasks.length)} detail="Small steps create momentum" tone="bg-sky-500/80" />
          <StatCard label="Focus for today" value="1" detail="Choose one meaningful next step" tone="bg-fuchsia-500/80" />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="ui-card">
            <div className="flex items-start justify-between gap-4">
              <div><p className="eyebrow">Momentum</p><h2 className="mt-1 text-lg font-semibold text-white">Your task progress</h2></div>
              <span className="text-2xl font-semibold text-violet-300">{taskProgress}%</span>
            </div>
            <div className="mt-6"><ProgressBar value={taskProgress} /></div>
            <p className="mt-3 text-sm text-zinc-500">{tasksList.length ? `${completedTasks} of ${tasksList.length} tasks complete.` : "Add your first task to start building momentum."}</p>
          </div>

          <div className="ui-card">
            <div className="flex items-center justify-between"><div><p className="eyebrow">Next up</p><h2 className="mt-1 text-lg font-semibold text-white">Keep moving</h2></div><Link href="/tasks" className="text-xs font-medium text-violet-300 hover:text-violet-200">View all</Link></div>
            <div className="mt-5 space-y-3">
              {upcomingTasks.length ? upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-950/40 px-3 py-3">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">{task.title}</span>
                  <span className="text-[11px] capitalize text-zinc-500">{task.priority}</span>
                </div>
              )) : <p className="text-sm leading-6 text-zinc-500">You’re all caught up. Add a task when something new needs your attention.</p>}
            </div>
          </div>
        </section>

        <section className="mt-6 ui-card border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-zinc-900/60 to-fuchsia-500/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="eyebrow text-violet-300">Make space for what matters</p><h2 className="mt-1 text-lg font-semibold text-white">Turn an intention into a next action.</h2><p className="mt-1 text-sm text-zinc-400">Goals give direction. Tasks make progress visible.</p></div>
            <Link href="/goals" className="ui-btn ui-btn-secondary whitespace-nowrap">Explore goals</Link>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
