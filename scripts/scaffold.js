/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const structure = {
  JavaScript: [
    "Closures",
    "Event Loop",
    "Promises",
    "Async Await",
    "this",
    "Prototype",
    "Hoisting",
    "TDZ",
    "Scope",
    "Currying",
    "Debounce",
    "Throttle"
  ],
  React: [
    "useState",
    "useEffect",
    "useMemo",
    "useCallback",
    "useRef",
    "useReducer",
    "Context API",
    "Redux",
    "Suspense",
    "Lazy Loading",
    "Error Boundary"
  ],
  TypeScript: [
    "Interfaces",
    "Type Alias",
    "Generics",
    "Utility Types",
    "keyof",
    "infer"
  ],
  "System Design": [
    "Rendering Patterns",
    "Web Performance",
    "Core Web Vitals",
    "Architecture"
  ],
  CSS: ["Flexbox vs Grid", "Box Model", "Stacking Context", "Specificity"]
};

const template = (title, category) => `---
title: ${title}
category: ${category}
difficulty: Intermediate
interviewFrequency: Very High
experienceLevel: Mid-Level
estimatedReadTime: 10
tags: [${category.toLowerCase()}, ${title.toLowerCase().replace(/\s+/g, "-")}]
companies:
  - Amazon
  - Adobe
  - Microsoft
---

# ${title}

## 📖 What is ${title}?

...

## 🤔 Why do we need ${title}?

...

## ⚙️ Internal Working

...

## 🧠 How ${category} Engine Handles It

...

## 📝 Syntax

...

## 💡 Beginner Example

...

## 🚀 Advanced Example

...

## 🏢 Production Example

...

## ⚛️ React Example

...

## ⚡ Performance

...

## 🧠 Memory

...

## ❌ Common Mistakes

...

## ✅ Best Practices

...

## 🆚 Comparison

...

## ❓ Interview Questions

...

## 🔄 Follow-up Questions

...

## 💻 Coding Questions

...

## 🧩 Output-Based Questions

...

## 🐞 Debugging Questions

...

## 📄 Cheat Sheet

...

## ⚡ 2-Minute Revision

...

## 🔗 Related Topics

...
`;

const contentDir = path.join(__dirname, "../content");

Object.entries(structure).forEach(([category, topics]) => {
  const categoryDir = path.join(contentDir, category.toLowerCase().replace(/\s+/g, "-"));
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  topics.forEach((topic) => {
    const slug = topic.toLowerCase().replace(/\s+/g, "-");
    const filePath = path.join(categoryDir, `${slug}.mdx`);

    // Always overwrite to apply the new uniform template to everything
    fs.writeFileSync(filePath, template(topic, category));
    console.log(`Created: ${filePath}`);
  });
});

console.log("Scaffolding complete!");
