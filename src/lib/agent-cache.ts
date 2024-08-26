import type Agent from "src/lib/agent";

/**
 * Represents a cache for storing instances of agents.
 * The cache allows us to maintain state across a given session.
 *
 * @SEE `server.ts` for usage
 */
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
