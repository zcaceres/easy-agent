import DiceRoller from "agents/sample/dice-roller";
import Librarian from "agents/sample/librarian";
import Vanilla from "agents/sample/vanilla";
import Tutor from "agents/sample/tutor";
import Redactor from "agents/sample/redactor";
import Translator from "agents/sample/translator";
import Lawyer from "agents/sample/lawyer";
import ResearchAssistant from "agents/sample/research-assistant";
import Summarizer from "agents/sample/summarizer";
import AgentRegistry from "lib/agent-registry";

/**
 * WELCOME!
 *
 * All agents listed below will be available for selection from the CLI in CLI Mode and from the GET endpoint in `server.ts` in Server mode.
 *
 * To define a new agent, create a new file in the `agents` directory and export it here. (Example in your-agent-here.ts) You can also define them in-line below using Agent.create().
 *
 * To define new tools, create a new file in the `tools` directory and export it here. (Example in your-tool-here.ts). You can also define them in-line below in using Tool.create() and registering them in the Agents `tools` property.
 */

export default AgentRegistry.create([
  // Add your agent (see your-agent-here.ts)!
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
