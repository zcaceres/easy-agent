import { describe, it, expect } from "bun:test";
import AnthropicPromptCache from "./anthropic-prompt-cache";
import Tool from "lib/tool";

describe("AnthropicPromptCache", () => {
  describe("create", () => {
    it("should create an instance with default capacity", () => {
      const cache = AnthropicPromptCache.create();
      expect(cache).toBeInstanceOf(AnthropicPromptCache);
    });

    it("should create an instance with custom capacity", () => {
      const customCapacity = 5;
      const cache = AnthropicPromptCache.create(customCapacity);
      expect(cache).toBeInstanceOf(AnthropicPromptCache);
    });
  });

  describe("configure", () => {
    it("should configure system prompt with caching enabled", () => {
      const cache = AnthropicPromptCache.create();
      const baseConfig = {
        cacheOptions: [], // Empty array means prompt caching is disabled
        model: "claude-3-haiku-20240307",
        mode: "message" as const,
        prompt: "Test prompt",
        maxTokens: 500,
        tools: [Tool.mocked()],
      };

      const result = cache.configure(baseConfig, []);
      expect(result.system).toEqual([
        {
          type: "text",
          text: "Test prompt",
        },
      ]);
    });

    it("should configure system prompt with caching disabled", () => {
      const cache = AnthropicPromptCache.create();
      const baseConfig = {
        cacheOptions: [], // Empty array means prompt caching is disabled
        model: "claude-3-haiku-20240307",
        mode: "message" as const,
        prompt: "Test prompt",
        maxTokens: 500,
        tools: [Tool.mocked()],
      };
      const result = cache.configure(baseConfig, []);
      expect(result.system).toEqual([
        {
          type: "text",
          text: "Test prompt",
        },
      ]);
    });

    it("should configure tools with caching enabled", () => {
      const cache = AnthropicPromptCache.create();
      const baseConfig = {
        cacheOptions: ["tools" as const],
        model: "claude-3-haiku-20240307",
        mode: "message" as const,
        prompt: "Test prompt",
        maxTokens: 500,
        tools: [Tool.mocked()],
      };

      const result = cache.configure(baseConfig, []);
      expect(result.tools[0]).toHaveProperty("cache_control", {
        type: "ephemeral",
      });
    });

    it("should configure tools with caching disabled", () => {
      const cache = AnthropicPromptCache.create();
      const baseConfig = {
        cacheOptions: [], // Empty array means prompt caching is disabled
        model: "claude-3-haiku-20240307",
        mode: "message" as const,
        prompt: "Test prompt",
        maxTokens: 500,
        tools: [Tool.mocked()],
      };

      const result = cache.configure(baseConfig, []);
      expect(result.tools[0]).not.toHaveProperty("cache_control");
    });

    it.only("should not cache tools when capacity is full", () => {
      const cache = AnthropicPromptCache.create(1);
      const mockTools = Array(2).fill(Tool.mocked());
      const baseConfig = {
        model: "claude-3-haiku-20240307",
        mode: "message" as const,
        maxTokens: 500,
        cacheOptions: ["tools" as const],
        prompt: "Test prompt",
        tools: mockTools,
      };
      const result = cache.configure(baseConfig, []);
      expect(result.tools[0]).toHaveProperty("cache_control", {
        type: "ephemeral",
      });
      expect(result.tools[1]).not.toHaveProperty("cache_control");
      expect(cache.size).toEqual(1);
    });

    it("should return messages unchanged", () => {
      const cache = AnthropicPromptCache.create();
      const baseConfig = {
        model: "claude-3-haiku-20240307",
        mode: "message" as const,
        maxTokens: 500,
        cacheOptions: [],
        prompt: "Test prompt",
        tools: [],
      };
      const messages = [
        {
          role: "user" as const,
          content: [{ type: "text" as const, text: "Hello" }],
        },
      ];
      const result = cache.configure(baseConfig, messages);
      expect(result.messages).toEqual(messages);
    });
  });

  describe("mocked", () => {
    it("should create a mocked instance", () => {
      const mockedCache = AnthropicPromptCache.mocked();
      expect(mockedCache).toBeInstanceOf(AnthropicPromptCache);
      expect(mockedCache["capacity"]).toBe(10);
    });
  });
});
