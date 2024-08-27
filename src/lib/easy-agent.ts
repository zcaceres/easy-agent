import type Agent from "src/lib/agent";
import AgentRegistry from "./agent-registry";

export abstract class EasyAgent {
  abstract registeredAgents: AgentRegistry;
  constructor(_agents: Agent[]) {}

  static start(_agents: Agent[]): EasyAgent {
    // Implementation of the static method
    // This method should return an instance of a concrete class that extends EasyAgent
    throw new Error("Method not implemented.");
  }
}
