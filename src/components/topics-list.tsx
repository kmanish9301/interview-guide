"use client";

import { useState } from "react";
import { TopicCard } from "@/components/topic-card";
import { Button } from "@/components/ui/button";

export type LightweightTopic = {
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  interviewFrequency: string;
  experienceLevel: string;
  estimatedReadTime: number;
  permalink: string;
};

interface TopicsListProps {
  initialTopics: LightweightTopic[];
}

export function TopicsList({ initialTopics }: TopicsListProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(initialTopics.map((t) => t.category)))
  ];

  const filteredTopics = initialTopics.filter((topic) => {
    if (activeCategory === "All") return true;
    return topic.category === activeCategory;
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <>
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          All Topics
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mb-8">
          Browse the complete list of interview topics across JavaScript, React,
          TypeScript, and more.
        </p>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTopics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic as any} />
        ))}
      </div>
    </>
  );
}
