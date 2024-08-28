# easy-agent

## What?

A very simple Typescript framework to build tool-wielding AI Agents.

`easy-agent` is a powerful, lightweight TypeScript framework designed for building AI agents with tool-use capabilities and prompt-caching. It supports Anthropic's Claude family of models.

## Why?

- **Simple**: There's too much plumbing and setup in vanilla AI SDKs. You spend more time parsing JSON than iterating on your agent.
- **Typescript First**: TS > Python if you're already working in web apps.
- **Minimal**: You only need two concepts to make an awesome AI Agent: Agents and Tools. This package hides everything else and focuses on a good experience with those two concepts.

## Features

- Hides configuration and plumbing behind two simple typesafe `Agent` and `Tool` classes.
- Start making a custom Agent with one function call in one file: `start-here.ts`.
- Sensible defaults which you can easily override
- Automatically handles the tool request/response cycle
- Supports message & stream modes
- Vigorous type-safety
- A few fun pre-baked Agents
- Use Agents in either CLI and Server Modes
- Prompt caching support

## Setup

> Make sure you have an ANTHROPIC_API_KEY key in your environment.

Install:

```bash
bun install
```

Run:

```bash
bun start
```

## Usage

You can use `easy-agent` as project boilerplate or as a library.


### Using As Project Boilerplate

#### Starting in CLI Mode

See `example.cli.ts` for a typical project setup in CLI Mode.

CLI Mode allows you to interact with your agents in a simple command-line interface.

Start it with `bun run start` or `bun run cli`.

#### Starting in Server Mode

Server Mode runs an Express server, allowing interaction with agents via HTTP requests.

See `example.server.ts` for a typical project setup in Server Mode.

1. Start the server:

   ```bash
   bun run server
   ```

2. The server will start on `http://localhost:3000`.

3. Interact with agents via HTTP:

List available agents:
```bash
curl http://localhost:3000
```

Send a message to an agent:
```bash
curl -X POST http://localhost:3000 -H "Content-Type: application/json" \
    -d '{"agentName": "summarizer", "message": "Summarize this: https://example.com"}'
```

Note: Server Mode currently supports stateless interactions only. You'll need to handle state on the client side.

### Using As a Library

You can use `easy-agent` as a library in your project.

First, import a `EasyAgentCLI` or `EasyAgentServer` mode from `easy-agent`. Then, create an instance of that mode and pass your agents to it.

```typescript
import { EasyAgentCLI, Agent } from "easy-agent";

EasyAgentCLI.start([
  Agent.create({
    name: "MyAgent",
    prompt: "I am a helpful assistant that...",
    tools: [MyCustomTool],
  }),
]);
```

This will start a CLI session with any agents you register in the array.

## How to Make an Agent

The simplest possible way to make an agent is to call `bun run add-agent` and follow the prompts.

You can also check out `example.cli.ts` and add code like the following:

```typescript
Agent.create({
  name: "Dad Joke Agent",
  prompt: "I tell Dad Jokes and only Dad Jokes"
})
```

Now type `bun start` and `dad-joke-agent` will be available to use.

For more advanced use cases, you can follow patterns in the `agents` and `tools` directories:

1. Create a new file in the `agents` directory, e.g., `agents/my-agent.ts`:

   ```typescript
   import Agent from "src/lib/agent";
   import MyCustomTool from "src/tools/my-custom-tool";

   const MY_PROMPT = `You are a helpful assistant that...`;

   export default Agent.create({
     name: "MyAgent",
     prompt: MY_PROMPT,
     tools: [MyCustomTool],
     // Optionally customize other settings...
     // mode: "stream",
     // model: "claude-3-opus-20240229",
     // maxTokens: 4000,
     // cacheOptions: ["system", "tools"],
   });
   ```

2. Register your agent wherever you've called an EasyAgent mode (see `example.cli.ts`):

   ```typescript
   import { EasyAgentCLI } from "easy-agent/modes";
   import MyAgent from "easy-agent/agents/my-agent";

   EasyAgentCLI.start([
     // ... other agents
     MyAgent,
   ]);
   ```

3. Your agent is now available in both CLI and Server modes!

To create more complex agents:
- Add custom tools in the `tools` directory
- Experiment with different prompts and configurations
- Use the `cacheOptions` to optimize performance for frequently used contexts

## How to Make a Tool

The simplest possible way to make an agent is to call `bun run add-tool` and follow the prompts.

1. Create a new file in the `tools` directory, e.g., `tools/my-custom-tool.ts`:

   ```typescript
   import Tool from "src/lib/tool";

   async function fetchWeather(city: string): Promise<string> {
     // Implement weather fetching logic here
     return `The weather in ${city} is sunny.`;
   }

   export default Tool.create({
     name: "fetch_weather",
     description: "Fetch current weather for a given city",
     inputs: [
       {
         name: "city",
         type: "string",
         description: "The name of the city",
         required: true,
       },
     ],
     fn: async ({ city }: { city: string }) => {
       const weather = await fetchWeather(city);
       return { weather };
     },
   });
   ```

2. Import and use your tool in an agent:

   ```typescript
   // in agents/weather-agent.ts
   import Agent from "src/lib/agent";
   import FetchWeather from "src/tools/my-custom-tool";

   export default Agent.create({
     name: "WeatherAgent",
     prompt: "You are a helpful weather assistant. Use the fetch_weather tool to provide accurate weather information.",
     tools: [FetchWeather],
   });
   ```

3. Register your new agent in `start-here.ts` to make it available. Your agent will not intelligently use the tool.

Tips for creating effective tools:
- Provide clear, concise descriptions for your tool and its inputs.
- Handle errors gracefully and return informative error messages.
- Consider adding type definitions for complex input/output structures.

### Toolmaker Mode

easy-agent comes bundled with an agent named Toolmaker, which can make tools for your agents.

To use:

1. Start easy-agent in CLI mode: `bun run start`.
2. Select `toolmaker`
3. Tell it the kind of tool you want e.g. `Create a tool that fetches the current price of Bitcoin`
4. The tool will appear in the `tools` directory.
5. Fix up the tool as needed.
6. Import the tool into your agent.

Toolmaker writes all tools in Typescript. It can also fetch data from websites if needed, so feel free to send in a url for API docs or other data sources.

#### Important
> Toolmaker creates tools but does not use them immediately. You'll need to manually import and add new tools to your agents.
> Always review and test automatically generated tools before using them in production environments.

## Other Agent Examples

Here are some more advanced examples of agent configurations:

### Streaming Agent with Model Override

```typescript
export default Agent.create({
  name: "StreamingExpert",
  prompt: "You are an AI that provides real-time analysis of streaming data.",
  mode: "stream",
  model: "claude-3-opus-20240229",
  maxTokens: 4000,
  tools: [StreamDataAnalyzer, DataVisualizer],
});
```

### Multi-Tool Agent with Caching

```typescript
export default Agent.create({
  name: "ResearchAssistant",
  prompt: "You are a research assistant capable of gathering and analyzing information from multiple sources.",
  tools: [WebSearchTool, PDFExtractor, DataAnalyzer, CitationGenerator],
  cacheOptions: ["system", "tools"],
  maxTokens: 8000,
});
```

### Specialized Agent with Custom Configuration

```typescript
export default Agent.create({
  name: "CodeReviewer",
  prompt: "You are an expert code reviewer. Analyze code snippets for best practices, potential bugs, and suggest improvements.",
  tools: [CodeParser, StaticAnalyzer, BenchmarkTool],
  model: "claude-3-opus-20240229",
  maxTokens: 16000,
  cacheOptions: ["system"],
});
```

## Prompt Caching

Easy-agent supports Anthropic's prompt caching feature, which can significantly improve response times and reduce token usage for repeated interactions.

### How Caching Works

Prompt caching allows certain parts of the context to be stored on Anthropic's servers, reducing the need to resend this information with each request. In easy-agent, caching is implemented with a focus on efficiency and adherence to Anthropic's limits.

### Caching Order and Priority

1. **System Prompt**: The system prompt is cached first, as it's typically the most static and frequently used part of the context.

2. **Tools**: After the system prompt, tools are cached in the order they are configured in the agent. This ensures that the most important or frequently used tools are prioritized for caching.

### Caching Limits

Anthropic imposes a limit on the number of items that can be cached (currently set to `globals.ANTHROPIC_MAX_PROMPT_CACHE_SIZE`). Easy-agent respects this limit by:

- Caching the system prompt first (if enabled)
- Caching tools in order until the limit is reached
- Stopping cache attempts for additional tools once the limit is hit

### Enabling Caching

To enable caching for your agent, use the `cacheOptions` parameter in your agent configuration:

```typescript
Agent.create({
  name: "CachedAgent",
  prompt: "Your prompt here",
  tools: [Tool1, Tool2, Tool3],
  cacheOptions: ["system", "tools"],
  // ... other configurations
});
```

This setup will cache both the system prompt and tools, in that order, up to the Anthropic-imposed limit.
