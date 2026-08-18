import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import fs from "fs";

const topics = defineCollection({
  name: "Topic",
  pattern: "**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.path(), // Auto-generates from file path, e.g., "javascript/closures"
      category: s.string(),
      difficulty: s
        .enum(["Beginner", "Intermediate", "Advanced", "Expert"])
        .default("Intermediate"),
      interviewFrequency: s
        .enum(["Low", "Medium", "High", "Very High"])
        .default("Medium"),
      experienceLevel: s.string().default("Mid-Level"),
      estimatedReadTime: s.number().default(5),
      tags: s.array(s.string()).default([]),
      relatedTopics: s.array(s.string()).default([]),
      companies: s.array(s.string()).default([]),
      lastUpdated: s.isodate().optional(),
      body: s.mdx()
    })
    .transform((data, { meta }) => {
      const raw = fs.readFileSync(meta.path, "utf8");
      const lines = raw.split("\n");

      let inDeepDive = false;
      const deepDiveLines: string[] = [];
      let inQuestions = false;
      const questions: any[] = [];

      let currentQ: string | null = null;
      let currentA: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();

        if (
          trimmed.startsWith("## 📖 What is") ||
          trimmed.startsWith("## 🤔 Why do we need")
        ) {
          inDeepDive = true;
          inQuestions = false;
        } else if (trimmed.startsWith("## ❓ Interview Questions")) {
          inQuestions = true;
          inDeepDive = false;
          if (currentQ) {
            questions.push({ q: currentQ, a: currentA.join("\n").trim() });
            currentQ = null;
            currentA = [];
          }
        } else if (trimmed.startsWith("## ")) {
          inDeepDive = false;
          inQuestions = false;
        }

        if (inDeepDive && !trimmed.startsWith("## ")) {
          if (trimmed !== "") {
            deepDiveLines.push(trimmed);
          }
        }

        if (inQuestions && !trimmed.startsWith("## ")) {
          const qMatch = trimmed.match(/^\d+\.\s+\*\*(.+?)\*\*/);
          if (qMatch) {
            if (currentQ) {
              questions.push({ q: currentQ, a: currentA.join("\n").trim() });
            }
            currentQ = qMatch[1];
            currentA = [];
          } else if (currentQ) {
            if (trimmed !== "") {
              currentA.push(trimmed);
            }
          }
        }
      }

      if (currentQ) {
        questions.push({ q: currentQ, a: currentA.join("\n").trim() });
      }

      const deepDiveContent =
        deepDiveLines.length > 0
          ? "**Concept:**\n" + deepDiveLines.join("\n")
          : undefined;

      const formattedQuestions = questions.map((q) => ({
        ...q,
        deepDive: deepDiveContent,
        category: data.category,
        topicTitle: data.title,
        permalink: `/topic/${data.slug}`
      }));

      return {
        ...data,
        permalink: `/topic/${data.slug}`,
        questions: formattedQuestions
      };
    })
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true
  },
  collections: { topics },
  mdx: {
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-dark" }]]
  }
});
