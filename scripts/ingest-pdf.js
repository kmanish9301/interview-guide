const fs = require('fs');
const pdf = require('pdf-parse');

async function extractQuestions() {
  const dataBuffer = fs.readFileSync('C:\\Users\\IIHT\\.gemini\\antigravity-ide\\brain\\260be989-484d-475e-b086-a34722369111\\.user_uploaded\\media_1787052682646.pdf');
  
  const data = await pdf(dataBuffer);
  const text = data.text;
  
  // Clean up the text by removing page headers/footers
  let cleanText = text.replace(/232 Interview questions & Answers - Saikrishna Nangunuri\s+\d+/g, '');
  
  console.log("Extracted characters:", cleanText.length);
  
  // Write the extracted text to a temporary file for debugging
  fs.writeFileSync('extracted-pdf.txt', cleanText, 'utf8');
  console.log("Saved raw text to extracted-pdf.txt");
  
  // Now we need to parse the questions
  // Questions typically start with "\d+. " or "## \d+."
  
  const jsTheoryMatch = cleanText.split(/66\. Plain javascript basic questions:/);
  
  // Let's just dump the text first so we can see how pdf-parse formatted it.
}

extractQuestions().catch(console.error);
