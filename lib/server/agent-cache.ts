import type Agent from "lib/agent";

export default class AgentCache {
  private cache: Map<string, Agent> = new Map();

  public set(key: string, value: Agent) {
    this.cache.set(key, value);
  }

  public get(key: string): Agent | null {
    return this.cache.get(key) ?? null;
  }

  static create() {
    return new AgentCache();
  }
}
