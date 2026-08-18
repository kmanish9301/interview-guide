const fs = require('fs');

function parseAndGenerate() {
    const rawText = fs.readFileSync('raw_pdf.txt', 'utf8');
    const lines = rawText.split('\n');

    let currentCategory = 'JavaScript Theory';
    let currentQuestions = [];
    let currentQ = null;
    let currentA = [];

    const sections = {
        '36 Output based questions:': 'Output Based JS',
        '27 Problem solving questions:': 'JS Problem Solving',
        '52 Reactjs Interview questions &': 'React Theory',
        'Reactjs Scenario based Questions:': 'React Scenarios',
        '15 Angular Scenario based interview': 'Angular Scenarios'
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        for (const [key, val] of Object.entries(sections)) {
            if (line.includes(key)) {
                if (currentQ) {
                    currentQuestions.push({ q: currentQ, a: currentA.join('\n') });
                    currentQ = null;
                    currentA = [];
                }
                saveMdx(currentCategory, currentQuestions);
                currentCategory = val;
                currentQuestions = [];
                continue;
            }
        }

        const questionMatch = line.match(/^(\d+)\.\s+(.*)/);
        
        if (questionMatch && (line.includes('?') || line.toLowerCase().includes('what') || line.toLowerCase().includes('how'))) {
            if (currentQ) {
                currentQuestions.push({ q: currentQ, a: currentA.join('\n') });
            }
            currentQ = line;
            currentA = [];
        } else if (currentQ) {
            currentA.push(line);
        }
    }

    if (currentQ) {
        currentQuestions.push({ q: currentQ, a: currentA.join('\n') });
    }
    saveMdx(currentCategory, currentQuestions);
    
    console.log("Successfully generated and sanitized all MDX files!");
}

function saveMdx(category, questions) {
    if (questions.length === 0) return;
    
    const slug = category.toLowerCase().replace(/\s+/g, '-');
    let folder = 'javascript';
    if (slug.includes('react')) folder = 'react';
    if (slug.includes('angular')) folder = 'angular';
    
    if (!fs.existsSync(`content/${folder}`)) {
        fs.mkdirSync(`content/${folder}`, { recursive: true });
    }
    
    const filePath = `content/${folder}/${slug}.mdx`;
    
    let content = `---
title: "${category}"
category: "${folder === 'javascript' ? 'JavaScript' : folder === 'react' ? 'React' : 'Angular'}"
difficulty: "Advanced"
interviewFrequency: "High"
experienceLevel: "All Levels"
estimatedReadTime: ${Math.max(5, Math.floor(questions.length * 1.5))}
tags: ["interview", "questions", "${slug}"]
---

# ${category}

Here is the ultimate list of interview questions for ${category}.

## ❓ Interview Questions

`;

    questions.forEach((item, index) => {
        let cleanQ = item.q.replace(/^\d+\.\s*/, '');
        content += `### ${index + 1}. **${cleanQ}**\n\n`;
        
        // AGGRESSIVE SANITIZATION FOR MDX
        // Wrap the entire answer in a code block so MDX doesn't try to parse HTML/JSX or imports
        // But we want it to look readable. 
        let safeAnswer = item.a
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\{/g, '&#123;')
            .replace(/\}/g, '&#125;');
            
        // Prevent top-level imports from crashing MDX Acorn parser
        safeAnswer = safeAnswer.replace(/^import\s/gm, '&#105;mport ');
        safeAnswer = safeAnswer.replace(/^export\s/gm, '&#101;xport ');

        content += safeAnswer + "\n\n---\n\n";
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Generated ${filePath} with ${questions.length} questions.`);
}

parseAndGenerate();
