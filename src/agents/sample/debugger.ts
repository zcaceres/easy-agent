import Agent from "src/lib/agent";
import ThrowError from "src/tools/sample/ThrowError";

const PROMPT_DEBUGGER = `Your job is to help me debug by calling the tool throw_error`;

const Debugger = () =>
  Agent.create({
    name: "Debugger",
    prompt: PROMPT_DEBUGGER,
    tools: [ThrowError],
  });

export default Debugger;
