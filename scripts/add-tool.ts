#!/usr/bin/env bun

import { ToolArg } from "../src/definitions";
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
  console.log("Let's add your tool...");

  const toolName = await askQuestion("Enter the name of your new tool: ");
  const sanitizedName = toolName.replace(/\s+/g, "");
  const fileName = `${sanitizedName}.ts`;
  const filePath = path.join(
    __dirname,
    "..",
    "src",
    "tools",
    "sample",
    fileName,
  );

  const description = await askQuestion("Enter a description for your tool: ");

  const inputs: ToolArg[] = [];
  let addMoreInputs = true;
  while (addMoreInputs) {
    const inputName = await askQuestion(
      "Enter an input name (or press enter to finish adding inputs): ",
    );
    if (!inputName) {
      addMoreInputs = false;
    } else {
      const inputType = await askQuestion(
        "Enter the input type (string, number, boolean, etc.): ",
      );
      const inputDescription = await askQuestion(
        "Enter a description for this input: ",
      );
      const inputRequired =
        (await askQuestion("Is this input required? (y/n): ")).toLowerCase() ===
        "y";
      inputs.push({
        name: inputName,
        type: inputType as any,
        description: inputDescription,
        required: inputRequired,
      });
    }
  }

  const toolContent = `import Tool from 'src/lib/tool';

export default Tool.create({
  name: '${toolName.toLowerCase().replace(/\s+/g, "_")}',
  description: '${description}',
  inputs: ${JSON.stringify(inputs, null, 2)},
  fn: async ({ ${inputs.map((input) => input.name).join(", ")} }) => {
    // your implementation here
  }
});
`;

  fs.writeFileSync(filePath, toolContent);

  console.log(`Tool "${toolName}" has been created at ${filePath}`);

  rl.close();
}

main().catch(console.error);
