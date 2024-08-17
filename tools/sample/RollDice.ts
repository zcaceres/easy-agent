import Tool from "lib/tool";

export default Tool.create({
  name: "roll_dice",
  description:
    "Roll a dice with a number of sides between low and high. I will roll the dice and return the result.",
  inputs: [
    {
      name: "low",
      type: "number",
      description: "The lowest number on the dice",
      required: true,
    },
    {
      name: "high",
      type: "number",
      description: "The highest number on the dice",
      required: true,
    },
  ],
  fn: ({ low, high }: { low: number; high: number }) => {
    const randomInt = Math.floor(Math.random() * (high - low + 1) + low);
    return `Roll: ${randomInt}`;
  },
});
