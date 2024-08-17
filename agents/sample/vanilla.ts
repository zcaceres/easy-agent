import Agent from "lib/agent";

const PROMPT_NONE = `You should first introduce yourself to me by saying "Hello, I am Vanilla. I am a simple agent with no special abilities or tools."`;

const Vanilla = () =>
  Agent.create({
    name: "Vanilla",
    prompt: PROMPT_NONE,
  });

export default Vanilla;
