import UI from "lib/ui";
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

    const selectedAgent = registeredAgents.get(selectedAgentName);

    if (!selectedAgent) {
      UI.red(`Invalid selection: ${selectedAgentName}.`);
      return this.fromCLI(registeredAgents);
    }

    UI.green(`Selected agent: ${selectedAgent.name}`);
    UI.green(
      `Available tools: ${selectedAgent.config.tools
        .map((tool) => tool.definition.name)
        .join(", ")}`
    );

    return selectedAgent;
  }

  static async fromAgentName(
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
