const fs = require("fs");
const readline = require("readline");

async function restoreFiles() {
  const logPath =
    "C:\\Users\\IIHT\\.gemini\\antigravity-ide\\brain\\df197a2f-ede7-4fe8-83a3-a8defccac6a7\\.system_generated\\logs\\transcript_full.jsonl";

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const fileMap = {};

  for await (const line of rl) {
    if (!line.trim()) continue;

    try {
      const step = JSON.parse(line);

      if (step.tool_calls && Array.isArray(step.tool_calls)) {
        for (const call of step.tool_calls) {
          let args = call.args;
          if (!args && call.function && call.function.arguments) {
            try {
              args = JSON.parse(call.function.arguments);
            } catch (e) {}
          }

          if (args && args.TargetFile && args.CodeContent) {
            const targetFile = args.TargetFile;
            const codeContent = args.CodeContent;

            if (targetFile.includes("content") && targetFile.endsWith(".mdx")) {
              // Normalize the path just in case
              const normalizedPath = targetFile.replace(/\\/g, "/");
              fileMap[normalizedPath] = codeContent;
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  let restoredCount = 0;
  for (const [filePath, content] of Object.entries(fileMap)) {
    try {
      // Map normalized path back to OS specific
      const osPath = require("path").resolve(filePath);
      fs.writeFileSync(osPath, content);
      console.log(`Restored: ${osPath}`);
      restoredCount++;
    } catch (err) {
      console.error(`Failed to write ${filePath}`, err);
    }
  }
  console.log(`Successfully restored ${restoredCount} files!`);
}

restoreFiles();
