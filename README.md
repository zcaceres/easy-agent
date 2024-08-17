# easy-agent

## What?

A very simple Typescript framework to build tool-wielding AI Agents Anthropic's Claude model.

## Why?

- There's a LOT of plumbing in AI SDKs. You spend more time parsing JSON than iterating on your agent.
- You only need two concepts to make an awesome AI Agent: Agents and Tools. That's what this package focuses on.
- TS > Python if you're already working in web apps.

## Features

- Hides as much configuration and parsing as possible behind simple classes with one and only one type-safe way to create them.
- Sensible defaults (which you can easily override).
- Automatic handling of tool request/response cycle
- Simple framework to define and generate type-safe tools (including async tools)
- Switch from message to stream mode with one line of code
- A few fun pre-baked Agents
- Vigorous type-safety

--

## How to Use

You can start using an agent with a few lines

The simplest possible use:

```ts
const agent = Agent.create({
  name: "Agent 007",
});
```

All you need to make more sophisticated AI Agents are the `Agent` and `Tool` constructs.

Here's how:

1. Define your Agent

```ts

```

1. Define a Tool

```ts

```

3. Register the Agent

```ts

```

4. You're done!

## Examples

An Agent with a custom prompt:

```ts

```

An Agent with tools:

```ts

```

## Setup

Install:

```bash
bun install
```

Run:

```bash
bun start
```

To do this I:

- Optionally construct the TOOL()s I want for an AGENT()
  - description
  - function
- Construct an AGENT() using a nice constructor
  - mode (message or stream)
  - prompt
  - tools
  - optional max tokens override
