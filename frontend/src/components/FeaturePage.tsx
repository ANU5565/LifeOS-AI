import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

interface FeaturePageProps {
  title: string;
  description: string;
}

export function FeaturePage({ title, description }: FeaturePageProps) {
  return (
    <AppShell>
      <main className="page-frame">
        <Link href="/dashboard" className="text-sm text-violet-300 hover:text-violet-200">Back to dashboard</Link>
        <section className="ui-card mt-5 max-w-2xl border-dashed py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-xl text-violet-300">✦</div>
          <p className="eyebrow mt-5">{title}</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">A calmer way to plan what matters.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">{description}</p>
          <p className="mt-6 text-xs text-zinc-600">This workspace is ready for the next product slice.</p>
        </section>
      </main>
    </AppShell>
  );
}
