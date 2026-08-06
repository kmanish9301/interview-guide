import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

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
    .transform((data) => ({ ...data, permalink: `/topic/${data.slug}` }))
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
