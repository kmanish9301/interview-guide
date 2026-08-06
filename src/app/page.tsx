import Link from "next/link";
import { topics } from "#velite";
import { TopicCard } from "@/components/topic-card";

export default function Home() {
  // Get latest 6 topics based on lastUpdated or just the first 6 if not available
  const latestTopics = [...topics]
    .sort(
      (a, b) =>
        new Date(b.lastUpdated || 0).getTime() -
        new Date(a.lastUpdated || 0).getTime()
    )
    .slice(0, 6);

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-6xl">
      <section className="flex flex-col items-center justify-center space-y-6 text-center py-24">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Frontend Interview Engine
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          The ultimate static knowledge base for frontend engineers. Search
          across concepts, architecture, and coding patterns instantly.
        </p>
        <div className="flex gap-4 pt-4">
          <Link
            href="/topics"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-10 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:bg-primary/90"
          >
            Browse Topics
          </Link>
        </div>
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-bold tracking-tight mb-8 flex items-center">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mr-3">
            New
          </span>
          Recently Added
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestTopics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  );
}
