import { describe, it, expect } from "bun:test";

import ToolRegistry from "./tool-registry";
import Tool from "./tool";
import NormalizeName from "./name-normalizer";

describe("ToolRegistry", () => {
  it("should create a registry", () => {
    const registry = ToolRegistry.mocked();
    expect(registry).toBeDefined();
  });

  it("should list tools", () => {
    const registry = ToolRegistry.mocked();
    expect(registry.list()).toEqual([
      NormalizeName(Tool.mocked().definition.name),
    ]);
  });

  it("should check if a tool exists", () => {
    const registry = ToolRegistry.mocked();
    expect(registry.exists("my-tool")).toBe(false);
    expect(registry.exists("mockedTool")).toBe(true);
  });

  it("should get a tool", () => {
    const registry = ToolRegistry.mocked();
    expect(registry.get("mockedTool")!.definition).toEqual(
      Tool.mocked().definition
    );
  });
});
