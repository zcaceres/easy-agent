import type Anthropic from "@anthropic-ai/sdk";

import { describe, it, expect } from "bun:test";
import AnthropicMsgClientConfigurator from "./anthropic-msg-client-configurator";
import Tool from "../../lib/tool";

describe("AnthropicMsgClientConfigurator", () => {
  it("should configure the client with prompt caching disabled", () => {
    const baseClient = {
      messages: {
        create: () => {},
        stream: () => {},
      },
      beta: {
        promptCaching: {
          messages: {
            create: () => {},
            stream: () => {},
          },
        },
      },
    } as unknown as Anthropic;

    const baseConfig = {
      cacheOptions: [], // Empty array means prompt caching is disabled
      model: "claude-3-haiku-20240307",
      mode: "message" as const,
      prompt: "Test prompt",
      maxTokens: 500,
      tools: [Tool.mocked()],
    };

    const baseMessages = [
      {
        role: "user" as const,
        content: [
          {
            type: "text" as const,
            text: "Hello, Claude!",
          },
        ],
      },
    ];

    const result = AnthropicMsgClientConfigurator.create(
      baseClient,
      baseConfig,
      baseMessages
    );

    expect(result).toEqual({
      client: baseClient.messages,
      config: {
        messages: baseMessages,
        model: baseConfig.model,
        system: baseConfig.prompt,
        max_tokens: baseConfig.maxTokens,
        tools: [
          {
            name: "mockedTool",
            description: "A mocked tool",
            input_schema: {
              properties: {
                mockedInput: {
                  description: "A mocked input",
                  type: "string",
                },
              },
              type: "object",
              required: ["mockedInput"],
            },
          },
        ],
      },
    });
  });

  it("should configure the client with prompt caching enabled", () => {
    const baseClient = {
      messages: {
        create: () => {},
        stream: () => {},
      },
      beta: {
        promptCaching: {
          messages: {
            create: () => {},
            stream: () => {},
          },
        },
      },
    } as unknown as Anthropic;
    const baseConfig = {
      cacheOptions: ["system" as const, "tools" as const],
      model: "claude-3-haiku-20240307",
      mode: "message" as const,
      prompt: "prompt",
      maxTokens: 1000,
      tools: [Tool.mocked()],
    };
    const baseMessages = [
      {
        role: "user" as const,
        content: [
          {
            type: "text" as const,
            text: "text",
            cache_control: {
              type: "ephemeral" as const,
            },
          },
        ],
      },
    ];

    const result = AnthropicMsgClientConfigurator.create(
      baseClient,
      baseConfig,
      baseMessages
    );

    expect(result).toEqual({
      client: baseClient.beta.promptCaching.messages,
      config: {
        max_tokens: 1000,
        model: baseConfig.model,
        system: [
          {
            type: "text",
            text: baseConfig.prompt,
            cache_control: { type: "ephemeral" },
          },
        ],
        tools: [
          {
            name: "mockedTool",
            description: "A mocked tool",
            input_schema: {
              properties: {
                mockedInput: {
                  description: "A mocked input",
                  type: "string",
                },
              },
              type: "object",
              required: ["mockedInput"],
            },
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "text",
                cache_control: { type: "ephemeral" },
              },
            ],
          },
        ],
      },
    });
  });
});
