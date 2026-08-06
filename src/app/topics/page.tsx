import { Suspense } from "react";
import { topics } from "#velite";
import { TopicsList, LightweightTopic } from "@/components/topics-list";
import { Skeleton } from "@/components/ui/skeleton";

function TopicsSkeleton() {
  return (
    <>
      <div className="mb-12">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-6 w-full max-w-2xl mb-8" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
        ))}
      </div>
    </>
  );
}

export default function TopicsPage() {
  // Strip heavy MDX content (body, raw) before passing to client component
  // This drastically reduces the initial JS bundle size.
  const lightweightTopics: LightweightTopic[] = topics.map((t) => ({
    slug: t.slug,
    title: t.title,
    category: t.category,
    difficulty: t.difficulty,
    interviewFrequency: t.interviewFrequency,
    experienceLevel: t.experienceLevel,
    estimatedReadTime: t.estimatedReadTime,
    permalink: t.permalink,
  }));

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-6xl">
      <Suspense fallback={<TopicsSkeleton />}>
        <TopicsList initialTopics={lightweightTopics} />
      </Suspense>
    </div>
  );
}
