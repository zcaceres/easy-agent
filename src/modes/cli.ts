import Agent from "src/lib/agent";
import AgentCache from "src/lib/agent-cache";
import AgentRegistry from "src/lib/agent-registry";
import AgentSelector from "src/lib/agent-selector";
import { EasyAgent } from "src/lib/easy-agent";
import UI from "src/lib/ui";

export default class EasyAgentCLI implements EasyAgent {
  cachedAgentInstances: AgentCache;
  registeredAgents: AgentRegistry;

  private constructor(agents: Agent[]) {
    this.cachedAgentInstances = AgentCache.create();
    this.registeredAgents = AgentRegistry.create(agents);
  }

  static async start(agentsToRegister: Agent[]) {
    return new EasyAgentCLI(agentsToRegister).setup();
  }

  private async setup() {
    const agent = await AgentSelector.fromCLI(this.registeredAgents);

    if (!agent) {
      UI.red("No agent selected. Exiting.");
      process.exit(0);
    }

    while (true) {
      const userInput = await UI.promptForUserInput("");
      await agent.start(userInput);
    }
  }
}
