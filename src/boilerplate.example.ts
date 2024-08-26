import DiceRoller from "src/agents/sample/dice-roller";
import Librarian from "src/agents/sample/librarian";
import Vanilla from "src/agents/sample/vanilla";
import Tutor from "src/agents/sample/tutor";
import Redactor from "src/agents/sample/redactor";
import Translator from "src/agents/sample/translator";
import Lawyer from "src/agents/sample/lawyer";
import ResearchAssistant from "src/agents/sample/research-assistant";
import Summarizer from "src/agents/sample/summarizer";

import AgentRegistry from "src/lib/agent-registry";
import CLI from "src/lib/cli/cli";

/**
 * WELCOME!
 *
 * All agents listed below will be available for selection from the CLI in CLI Mode and from the GET endpoint in `server.ts` in Server mode.
 *
 * To define a new agent, create a new file in the `agents` directory and export it here. (Example in your-agent-here.example.ts) You can also define them in-line below using Agent.create().
 *
 * To define new tools, create a new file in the `tools` directory and export it here. (Example in your-tool-here.example.ts). You can also define them in-line below in using Tool.create() and registering them in the Agents `tools` property.
 */

const registeredAgents = AgentRegistry.create([
  // Add your agent (see your-agent-here.example.ts)!
  DiceRoller(),
  Librarian(),
  Vanilla(),
  Tutor(),
  Redactor(),
  Translator(),
  ResearchAssistant(),
  Lawyer(),
  Summarizer(),
  // Remove sample agents above that you don't want available.
]);

CLI.start(registeredAgents);
