"use client";

import { useState } from "react";
import { topics } from "#velite";
import { TopicCard } from "@/components/topic-card";
import { Button } from "@/components/ui/button";

export default function TopicsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Extract unique categories from topics
  const categories = [
    "All",
    ...Array.from(new Set(topics.map((t) => t.category)))
  ];

  // Filter topics based on active category
  const filteredTopics = topics.filter((topic) => {
    if (activeCategory === "All") return true;
    return topic.category === activeCategory;
  });

  // Sort filtered topics by category first, then by title
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-6xl">
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
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </div>
  );
}
