import fitz  # PyMuPDF
import re
import os

pdf_path = r"C:\Users\IIHT\.gemini\antigravity-ide\brain\260be989-484d-475e-b086-a34722369111\.user_uploaded\media_1787052682646.pdf"

doc = fitz.open(pdf_path)
text = ""
for page in doc:
    text += page.get_text()

# Clean up headers/footers
text = re.sub(r'232 Interview questions & Answers - Saikrishna Nangunuri\s+\d+', '', text)

# We want to format this into Markdown.
# The PDF has categories like:
# "5. Machine coding round interview questions"
# "1. Is javascript a dynamically typed language or a statically typed language ?"

# Let's save the raw text first to inspect it
with open('raw_pdf.txt', 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Extracted {len(text)} characters. Saved to raw_pdf.txt")
