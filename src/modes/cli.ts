import type AgentRegistry from "src/lib/agent-registry";
import AgentSelector from "src/lib/agent-selector";
import UI from "src/lib/ui";

export default class CLI {
  static async start(agentRegistry: AgentRegistry) {
    const agent = await this.setup(agentRegistry);

    while (true) {
      const userInput = await UI.promptForUserInput("");
      await agent.start(userInput);
    }
  }

  private static async setup(agentRegistry: AgentRegistry) {
    const SelectedAgent = await AgentSelector.fromCLI(agentRegistry);

    if (!SelectedAgent) {
      UI.red("No agent selected. Exiting.");
      process.exit(0);
    }

    return SelectedAgent;
  }
}
