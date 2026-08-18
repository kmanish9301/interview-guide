const fs = require('fs');
const readline = require('readline');

async function processTranscript() {
    const transcriptPath = 'C:\\Users\\IIHT\\.gemini\\antigravity-ide\\brain\\260be989-484d-475e-b086-a34722369111\\.system_generated\\logs\\transcript_full.jsonl';
    
    const fileStream = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let foundText = "";
    
    for await (const line of rl) {
        if (line.includes("==Start of PDF==")) {
            const data = JSON.parse(line);
            // The massive text might be in data.content
            if (data.content && data.content.includes("==Start of PDF==")) {
                foundText = data.content;
            }
        }
    }

    if (foundText) {
        console.log(`Found block of length: ${foundText.length}`);
        
        // Extract just the PDF content
        const startIndex = foundText.lastIndexOf("==Start of PDF==");
        const endIndex = foundText.lastIndexOf("==End of PDF==");
        
        if (startIndex !== -1 && endIndex !== -1) {
            const pdfText = foundText.substring(startIndex, endIndex + 14);
            fs.writeFileSync('raw-ocr.txt', pdfText, 'utf8');
            console.log('Saved raw-ocr.txt');
        } else {
            console.log('Could not find start/end bounds of PDF in the block');
        }
    } else {
        console.log("Could not find the text in the transcript");
    }
}

processTranscript().catch(console.error);
