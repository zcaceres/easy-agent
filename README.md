# easy-agent

## What?

A very simple Typescript framework to build tool-wielding AI Agents.

Currently supports Anthropic's Claude family of models.

## Why?

- There's a LOT of plumbing in AI SDKs. You spend more time parsing JSON than iterating on your agent.
- You only need two concepts to make an awesome AI Agent: Agents and Tools. That's what this package focuses on.
- TS > Python if you're already working in web apps.

## Features

- Hides a ton of configuration and plumbing behind simple classes with one and only one type-safe way to create them.
- Sensible defaults (which you can easily override)
- Automatic handling of tool request/response cycle
- Message & Stream mode
- One simple way to define type-safe Agents
- One simple way to define type-safe Tools
- Vigorous type-safety
- A few fun pre-baked Agents
- CLI and Server mode (Server mode coming soon)

## Setup

Install:

```bash
bun install
```

Run:

```bash
bun start
```

Make sure to include an API key in your environment as `ANTHROPIC_API_KEY`.

## How to Make an Agent

1. Open `start-here.ts`

2. Add your agent to the array like so:

```ts
// start-here.ts

export default [
  // ...a bunch of sample agents
  Agent.create({
    name: "Agent 007",
    // more configuration if you want
  });
];
```

3. You're done! Now you can run `bun run cli` and interact with your agent.

You can also define Agents in separate modules (to keep things clean) and import them. Just add them to the array and you're good to go.

## How to Make a Tool

1. Open up `your-tool-here.ts`

2. Fill out the name, description, inputs, and the function you want the tool to call:

```ts
// SecretAgentPhone.ts
import Tool from "lib/tool";

export default Tool.create({
  name: "secret_agent_phone",
  description: "Use 007's Secret Agent phone to contact HQ",
  inputs: [
    {
      name: "message",
      type: "string",
      description: "A secret message for HQ",
      required: true,
    },
  ],
  fn: ({ message }: { message: string }) => {
    encryptedChannelToHQ(`007 Reporting: ${message}`);
  },
});
```

3. Now import your tool into your agent!

```ts
// start-here.ts

import SecretAgentPhone from "tools/SecretAgentPhone"

export default [
  // ...a bunch of sample agents
  Agent.create({
    name: "Agent 007",
    tools: [SecretAgentPhone]
  });
];
```

## Other Examples

```ts
// An Agent with a custom prompt and tool
export default Agent.create({
  name: "Summarizer",
  prompt: "You summarize text concisely and accurately.",
  tools: [FetchHTML],
});

// An Agent that uses streaming mode and model and token override
export default Agent.create({
  name: "Streaming",
  tools: [],
  mode: "stream",
  model: "claude-3-haiku-20240307"
  maxTokens: 3600
});

// You'd now register these agents in `start-here.ts`
```
