const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "../content");
const outputFile = path.join(__dirname, "../public/questions.json");

const questions = [];

function extractSection(lines, sectionName) {
  let inSection = false;
  let content = [];

  for (const line of lines) {
    if (
      line.startsWith(`## ${sectionName}`) ||
      line.startsWith(`## 📖 ${sectionName}`) ||
      line.startsWith(`## 🤔 ${sectionName}`) ||
      line.startsWith(`## ⚙️ ${sectionName}`)
    ) {
      inSection = true;
      continue;
    }

    if (inSection && line.startsWith("## ")) {
      break;
    }

    if (inSection) {
      content.push(line);
    }
  }

  return content.join("\n").trim();
}

function parseFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let inQuestionsSection = false;
  let currentQuestion = null;
  let currentAnswer = [];

  // Extract frontmatter info
  let category = "Unknown";
  let title = "Unknown";

  for (const line of lines) {
    if (line.startsWith("category:")) category = line.split(":")[1].trim();
    if (line.startsWith("title:")) title = line.split(":")[1].trim();
  }

  // Extract deep dive context from the topic's main sections
  let whatIs = extractSection(lines, `What is ${title}?`);
  if (!whatIs) whatIs = extractSection(lines, "What is");
  if (!whatIs) whatIs = extractSection(lines, "What are");

  let whyNeed = extractSection(lines, `Why do we need ${title}?`);
  if (!whyNeed) whyNeed = extractSection(lines, "Why do we need");

  let deepDive = "";
  if (whatIs) deepDive += `**Concept:**\n${whatIs}\n\n`;
  if (whyNeed) deepDive += `**Why it matters:**\n${whyNeed}\n\n`;

  const relativePath = path.relative(contentDir, filePath).replace(/\\/g, "/");
  const slug = relativePath.replace(".mdx", "");
  const permalink = `/topic/${slug}`;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ❓ Interview Questions")) {
      inQuestionsSection = true;
      continue;
    }

    if (inQuestionsSection && line.startsWith("## ")) {
      // Reached the next section
      if (currentQuestion) {
        questions.push({
          q: currentQuestion,
          a: currentAnswer.join("\n").trim(),
          deepDive: deepDive.trim(),
          category,
          topicTitle: title,
          permalink
        });
      }
      break;
    }

    if (inQuestionsSection) {
      // Look for a new question like "1. **What is...**"
      const questionMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*/);

      if (questionMatch) {
        if (currentQuestion) {
          questions.push({
            q: currentQuestion,
            a: currentAnswer.join("\n").trim(),
            deepDive: deepDive.trim(),
            category,
            topicTitle: title,
            permalink
          });
        }
        currentQuestion = questionMatch[1];
        currentAnswer = [];
      } else if (currentQuestion) {
        currentAnswer.push(line);
      }
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith(".mdx")) {
      parseFile(fullPath);
    }
  }
}

walkDir(contentDir);
fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2));
console.log(`Extracted ${questions.length} questions to public/questions.json`);
