import Link from "next/link";

interface FeaturePageProps {
  title: string;
  description: string;
}

export function FeaturePage({ title, description }: FeaturePageProps) {
  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-2xl space-y-4">
        <Link href="/" className="text-sm text-violet-400 hover:text-violet-300">
          Back to home
        </Link>
        <section className="ui-card">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-zinc-400">{description}</p>
        </section>
      </div>
    </main>
  );
}
