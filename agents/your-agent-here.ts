import Agent from "lib/agent";
import RollDice from "tools/sample/RollDice";

const YOUR_PROMPT_HERE = `Your Prompt Goes Here`;

export default Agent.create({
  name: "Your Agent Name Here",
  prompt: YOUR_PROMPT_HERE,
  tools: [RollDice], // Add your tools here
});
