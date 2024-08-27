import type { AgentMap, NormalizedName } from "src/definitions";
import type { Registry } from "src/lib/registry";
import Agent from "src/lib/agent";
import NormalizeName from "src/lib/name-normalizer";

export default class AgentRegistry implements Registry {
  private registry: AgentMap = new Map();
  private nameCache: NormalizedName[] = [];

  private constructor(agents: Agent[]) {
    agents.forEach((agent) =>
      this.registry.set(NormalizeName(agent.name), agent),
    );
    this.nameCache = Array.from(this.registry.keys());
  }

  list(): NormalizedName[] {
    return this.nameCache;
  }

  exists(agentName: string): boolean {
    return this.registry.has(NormalizeName(agentName));
  }

  get(agentName: string): Agent | null {
    return this.registry.get(NormalizeName(agentName)) ?? null;
  }

  static create(agents: Agent[]) {
    return new AgentRegistry(agents);
  }

  static mocked() {
    return new AgentRegistry([Agent.mocked()]);
  }
}
