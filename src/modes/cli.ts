import { CLIOptions } from "src/definitions";
import Agent from "src/lib/agent";
import AgentCache from "src/lib/agent-cache";
import AgentRegistry from "src/lib/agent-registry";
import AgentSelector from "src/lib/agent-selector";
import { EasyAgent } from "src/lib/easy-agent";
import globals from "src/lib/global-config";
import UI from "src/lib/ui";
import VoiceInterface from "src/lib/voice";

export default class EasyAgentCLI implements EasyAgent {
  cachedAgentInstances: AgentCache;
  registeredAgents: AgentRegistry;
  voiceModeActivated: boolean;

  private constructor(agents: Agent[], options: CLIOptions = { voice: false }) {
    this.cachedAgentInstances = AgentCache.create();
    this.registeredAgents = AgentRegistry.create(agents);
    this.voiceModeActivated = options.voice;
  }

  static async start(
    agentsToRegister: Agent[],
    options: CLIOptions = { voice: false },
  ) {
    options.voice = options.voice || globals.VOICE_MODE;
    return new EasyAgentCLI(agentsToRegister, options).setup();
  }

  private async setup() {
    const agent = await AgentSelector.fromCLI(this.registeredAgents);
    let voiceInterface = this.voiceModeActivated
      ? await VoiceInterface.create()
      : null;

    if (!agent) {
      UI.red("No agent selected. Exiting.");
      process.exit(0);
    }

    while (true) {
      let userInput;
      if (this.voiceModeActivated) {
        userInput = await voiceInterface!.transcribeAudio();
      } else {
        userInput = await UI.promptForUserInput("");
      }
      // await agent.start(userInput);
    }
  }
}
