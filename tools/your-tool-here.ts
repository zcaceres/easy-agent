import Tool from "lib/tool";

export default Tool.create({
  name: "your_tool_name_here",
  description: "Your tool description goes here",
  inputs: [
    {
      name: "your_input",
      type: "string",
      description: "Your input description goes here",
      required: true,
    },
    // More inputs as needed...
  ],
  fn: ({ your_input }: { your_input: string }) => {
    // Your tool logic goes here
    console.log(`Your input: ${your_input}`);
  },
});
