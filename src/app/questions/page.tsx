"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchIcon, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";

type Question = {
  q: string;
  a: string;
  category: string;
  topicTitle: string;
  permalink: string;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const filtered = questions.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.topicTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Top Interview Questions
        </h1>
        <p className="text-muted-foreground text-xl mb-8">
          A curated list of the most frequently asked frontend interview
          questions extracted directly from our topics.
        </p>

        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search questions by keyword or topic..."
            className="pl-10 h-12 text-lg rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((item, idx) => (
          <Card
            key={idx}
            className="overflow-hidden border-border/60 transition-all hover:border-primary/30"
          >
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg leading-relaxed font-bold">
                  {item.q}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="whitespace-nowrap shrink-0 border-primary/20 bg-primary/5 text-primary"
                >
                  {item.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-foreground/80 text-sm space-y-2 leading-relaxed">
                <div className="font-medium text-foreground mb-3">
                  <span className="font-bold text-primary mr-2">
                    Short Answer:
                  </span>
                  {item.a.replace(/^- /, "").replace(/^\* /, "")}
                </div>

                {item.deepDive && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/40 border border-border/50 text-muted-foreground text-sm space-y-3">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <SearchIcon className="w-4 h-4 mr-2 text-primary" />
                      Interviewer Deep Dive
                    </h4>
                    {item.deepDive.split("\n").map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      if (
                        trimmed.startsWith("- ") ||
                        trimmed.startsWith("* ")
                      ) {
                        return (
                          <li key={i} className="ml-5 list-disc">
                            {trimmed.substring(2).replace(/\*/g, "")}
                          </li>
                        );
                      }
                      if (trimmed.startsWith("**")) {
                        return (
                          <p
                            key={i}
                            className="font-semibold text-foreground/80 mt-3"
                          >
                            {trimmed.replace(/\*/g, "")}
                          </p>
                        );
                      }
                      return <p key={i}>{trimmed.replace(/\*/g, "")}</p>;
                    })}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 pt-4 border-t border-border/40 text-xs">
              <Link
                href={item.permalink}
                className="text-primary hover:underline inline-flex items-center font-medium"
              >
                Learn more in {item.topicTitle}{" "}
                <ExternalLink className="ml-1.5 w-3 h-3" />
              </Link>
            </CardFooter>
          </Card>
        ))}
        {filtered.length === 0 && questions.length > 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No questions found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
