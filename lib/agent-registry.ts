import type { AgentMap, NormalizedName, Registry } from "definitions";
import type Agent from "lib/agent";
import NormalizeName from "lib/name-normalizer";

export default class AgentRegistry implements Registry {
  private registry: AgentMap = new Map();
  private nameCache: NormalizedName[] = [];

  private constructor(agents: Agent[]) {
    agents.forEach((agent) =>
      this.registry.set(NormalizeName(agent.name), agent)
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
}
