import DiceRoller from "agents/sample/dice-roller";
import Librarian from "agents/sample/librarian";
import Vanilla from "agents/sample/vanilla";
import Tutor from "agents/sample/tutor";
import Redactor from "agents/sample/redactor";
import Translator from "agents/sample/translator";
import Lawyer from "agents/sample/lawyer";
import ResearchAssistant from "agents/sample/research-assistant";
import Summarizer from "agents/sample/summarizer";

/**
 * WELCOME!
 *
 * All agents listed below will be available for selection in the CLI.
 *
 * To define a new agent, create a new file in the `agents` directory and export it here. (Example in your-agent-here.ts)
 *
 * To define new tools, create a new file in the `tools` directory and export it here. (Example in your-tool-here.ts)
 */

export default [
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
  // Remove sample agents you don't want to use.
];
