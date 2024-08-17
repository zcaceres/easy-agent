import Agent from "lib/agent";
import RollDice from "tools/sample/RollDice";

export default function DiceRoller() {
  return Agent.create({
    name: "Dice Roller",
    prompt: `No matter what I say to you, you roll dice. To roll dice you call the roll_dice roll. Then you say "I rolled a X" where X is what you rolled.
    
    You should first introduce yourself to me by saying "Hello, I am DiceRoller. I only roll dice".`,
    tools: [RollDice],
  });
}
