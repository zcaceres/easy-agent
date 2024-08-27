import { describe, it, expect } from "bun:test";
import AnthropicParser from "../../lib/anthropic/anthropic-parser";
import {
  CLAUDE_TEXT_RESPONSE,
  CLAUDE_TOOL_USE_RESPONSE,
} from "./sample-data/claude-responses";

describe("AnthropicParser", () => {
  it("should parse text response correctly", () => {
    // Create a mock response object
    const response = CLAUDE_TEXT_RESPONSE;

    // Call the parse method of AnthropicParser
    const result = AnthropicParser.parse(response);

    // Check if the result is correct
    expect(result.text).toBe(
      "To have a back-and-forth conversation with me using the API and a TypeScript codebase, you'll need to follow these steps:\n\n1. Set up your project:\n   - Make sure you have Node.js installed\n   - Create a new directory for your project\n   - Initialize a new npm project: `npm init -y`\n   - Install TypeScript: `npm install typescript @types/node --save-dev`\n   - Install the OpenAI API client: `npm install openai`\n\n2. Configure TypeScript:\n   Create a `tsconfig.json` file in your project root with the following content:\n\n   ```json\n   {\n     \"compilerOptions\": {\n       \"target\": \"es2018\",\n       \"module\": \"commonjs\",\n       \"strict\": true,\n       \"esModuleInterop\": true,\n       \"outDir\": \"./dist\"\n     },\n     \"include\": [\"src/lib/**/*\"]\n   }\n   ```\n\n3. Create a TypeScript file (e.g., `src/lib/chat.ts`) with the following code:\n\n   ```typescript\n   import { Configuration, OpenAIApi } from 'openai';\n   import * as readline from 'readline';\n\n   const configuration = new Configuration({\n     apiKey: 'your-api-key-here',\n   });\n   const openai = new OpenAIApi(configuration);\n\n   const rl = readline.createInterface({\n     input: process.stdin,\n     output: process.stdout,\n   });\n\n   async function chat() {\n     const messages: { role: string; content: string }[] = [];\n\n     while (true) {\n       const userInput = await new Promise<string>((resolve) => {\n         rl.question('You: ', resolve);\n       });\n\n       if (userInput.toLowerCase() === 'exit') {\n         console.log('Goodbye!');\n         rl.close();\n         break;\n       }\n\n       messages.push({ role: 'user', content: userInput });\n\n       try {\n         const completion = await openai.createChatCompletion({\n           model: 'gpt-3.5-turbo',\n           messages: messages,\n         });\n\n         const assistantReply = completion.data.choices[0].message?.content;\n         console.log('Assistant:', assistantReply);\n\n         messages.push({ role: 'assistant', content: assistantReply || '' });\n       } catch (error) {\n         console.error('Error:', error);\n       }\n     }\n   }\n\n   chat();\n   ```\n\n4. Replace `'your-api-key-here'` with your actual OpenAI API key.\n\n5. Compile and run the TypeScript code:\n   - Compile: `npx tsc`\n   - Run: `node dist/chat.js`\n\nThis script creates a simple command-line interface for chatting with the AI. It maintains a conversation history in the `messages` array, which is sent with each API request to provide context for the conversation.\n\nTo use this:\n1. Start the script\n2. Type your message and press Enter\n3. The AI's response will be displayed\n4. Continue the conversation by typing more messages\n5. Type 'exit' to end the conversation\n\nRemember to handle your API key securely and not to expose it in your code repository.",
    );

    expect(result.toolUseRequests).toEqual([]);
  });

  it("should parse tool use response correctly", () => {
    // Create a mock response object
    const response = CLAUDE_TOOL_USE_RESPONSE;

    // Call the parse method of AnthropicParser
    const result = AnthropicParser.parse(response);

    // Check if the result is correct
    expect(result.text).toBe(
      "<thinking>I need to use the get_weather, and the user wants SF, which is likely San Francisco, CA.</thinking>",
    );

    expect(result.toolUseRequests).toEqual([
      {
        type: "tool_use",
        id: "toolu_01A09q90qw90lq917835lq9",
        name: "get_weather",
        input: { location: "San Francisco, CA", unit: "celsius" },
      },
    ]);
  });
});
