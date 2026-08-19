import { notFound } from "next/navigation";
import { topics } from "#velite";
import { MDXContent } from "@/components/mdx-content";
import { Metadata } from "next";

interface TopicPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  return topics.map((topic) => ({
    slug: topic.slug.split("/")
  }));
}

export async function generateMetadata({
  params
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topicSlug = slug.join("/");
  const topic = topics.find((t) => t.slug === topicSlug);

  if (!topic) {
    return {};
  }

  return {
    title: `${topic.title} | Frontend Interview Engine`,
    description: `Learn about ${topic.title} in the ${topic.category} category.`
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topicSlug = slug.join("/");
  const topic = topics.find((t) => t.slug === topicSlug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 md:px-8 max-w-4xl">
      <div className="mb-8 md:mb-12 border-b border-border/40 pb-8 md:pb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {topic.category}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            {topic.difficulty}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            {topic.estimatedReadTime} min read
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 text-foreground">
          {topic.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
          <span className="text-sm text-muted-foreground font-medium mr-2">
            Companies:
          </span>
          {topic.companies?.map((company: string) => (
            <span
              key={company}
              className="inline-flex items-center rounded-md bg-muted/60 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-muted-foreground border border-border/50"
            >
              {company}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <article className="prose prose-zinc dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80 prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/50 max-w-none mt-6 md:mt-8 pb-20">
        <MDXContent code={topic.body} />
      </article>
    </div>
  );
}
