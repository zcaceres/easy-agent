import type { NormalizedName, Registry, ToolMap } from "definitions";
import Tool from "lib/tool";
import NormalizeName from "lib/name-normalizer";

export default class ToolRegistry implements Registry {
  private registry: ToolMap = new Map();
  private nameCache: NormalizedName[] = [];

  private constructor(tools: Tool[]) {
    tools.forEach((tool) =>
      this.registry.set(NormalizeName(tool.definition.name), tool)
    );
    this.nameCache = Array.from(this.registry.keys());
  }

  list(): NormalizedName[] {
    return this.nameCache;
  }

  exists(toolName: string): boolean {
    return this.registry.has(NormalizeName(toolName));
  }

  get(toolName: string): Tool | null {
    return this.registry.get(NormalizeName(toolName)) ?? null;
  }

  static create(tools: Tool[]) {
    return new ToolRegistry(tools);
  }

  static mocked() {
    return new ToolRegistry([Tool.mocked()]);
  }
}
