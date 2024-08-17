import UI from "lib/ui";
import type Agent from "lib/agent";

export default class AgentSelector {
  static async fromCLI(registeredAgents: Agent[]): Promise<Agent> {
    const agentNames = registeredAgents.map((agent) => agent.name);
    const selectedAgentName = await UI.promptForUserInput(
      `Select an Agent:\n${agentNames
        .map((name) => `- ${name}`)
        .join("\n")}\n\n`
    );

    let normalizedName = selectedAgentName.trim().toLowerCase();
    const selectedAgent = registeredAgents.find(
      (agent) => agent.name.toLowerCase() === normalizedName
    );
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
    registeredAgents: Agent[]
  ) {
    let normalizedName = selectedAgentName.trim().toLowerCase();
    const selectedAgent = registeredAgents.find(
      (agent) => agent.name.toLowerCase() === normalizedName
    );
    if (!selectedAgent) {
      throw new Error(`Invalid selection: ${selectedAgentName}.`);
    }

    return selectedAgent;
  }
}
