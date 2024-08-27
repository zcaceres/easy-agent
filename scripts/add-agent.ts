#!/usr/bin/env bun

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("Let's add your agent...");

  const agentName = await askQuestion("Enter the name of your new agent: ");
  const sanitizedName = agentName.replace(/\s+/g, "-").toLowerCase();
  const fileName = `${sanitizedName}.ts`;
  const filePath = path.join(__dirname, "..", "src", "agents", fileName);

  const prompt = await askQuestion("Enter the prompt for your agent: ");

  const agentContent = `import Agent from "src/lib/agent";

const PROMPT_${sanitizedName.replace(/-/g, "_").toUpperCase()} = \`${prompt}\`;

const ${agentName.replace(/\s+/g, "")} = () =>
  Agent.create({
    name: "${agentName}",
    prompt: PROMPT_${sanitizedName.replace(/-/g, "_").toUpperCase()},
  });

export default ${agentName.replace(/\s+/g, "")};
`;

  fs.writeFileSync(filePath, agentContent);

  console.log(`Agent "${agentName}" has been created at ${filePath}`);

  rl.close();
}

main().catch(console.error);
