import UI from "src/lib/ui";
import type Agent from "src/lib/agent";
import type AgentRegistry from "src/lib/agent-registry";

export default class AgentSelector {
  static async fromCLI(registeredAgents: AgentRegistry): Promise<Agent> {
    const selectedAgentName = await UI.promptForUserInput(
      `Select an Agent:\n${registeredAgents
        .list()
        .map((name) => `- ${name}`)
        .join("\n")}\n\n`,
    );

    const selectedAgent = this.fromAgentName(
      selectedAgentName,
      registeredAgents,
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
    registeredAgents: AgentRegistry,
  ) {
    return registeredAgents.get(selectedAgentName);
  }
}
