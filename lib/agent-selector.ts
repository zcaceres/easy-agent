import UI from "lib/cli/ui";
import type Agent from "lib/agent";
import type AgentRegistry from "./agent-registry";

export default class AgentSelector {
  static async fromCLI(registeredAgents: AgentRegistry): Promise<Agent> {
    const selectedAgentName = await UI.promptForUserInput(
      `Select an Agent:\n${registeredAgents
        .list()
        .map((name) => `- ${name}`)
        .join("\n")}\n\n`
    );

    const selectedAgent = this.fromAgentName(
      selectedAgentName,
      registeredAgents
    );

    if (!selectedAgent) {
      UI.red(`Invalid selection: ${selectedAgentName}.`);
      return this.fromCLI(registeredAgents);
    }

    UI.green(`Selected agent: ${selectedAgent.name}`);
    UI.green(`Available tools: ${selectedAgent.tools.list().join(", ")}`);

    return selectedAgent;
  }

  static fromAgentName(
    selectedAgentName: string,
    registeredAgents: AgentRegistry
  ) {
    const selectedAgent = registeredAgents.get(selectedAgentName);

    if (!selectedAgent) {
      throw new Error(`Invalid selection: ${selectedAgentName}.`);
    }

    return registeredAgents.get(selectedAgentName);
  }
}
