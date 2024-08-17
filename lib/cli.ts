import agentRegistry from "../start-here";
import AgentSelector from "lib/agent-selector";
import UI from "lib/ui";

async function main() {
  const agent = await setup();

  while (true) {
    const userInput = await UI.promptForUserInput("");
    await agent.start(userInput);
  }
}

async function setup() {
  const SelectedAgent = await AgentSelector.fromCLI(agentRegistry);

  if (!SelectedAgent) {
    UI.red("No agent selected. Exiting.");
    process.exit(0);
  }

  return SelectedAgent;
}

main();
