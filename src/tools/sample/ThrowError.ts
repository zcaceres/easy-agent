import Tool from "src/lib/tool";

export default Tool.create({
  name: "throw_error",
  description: "Throw an error to test error handling with a message.",
  inputs: [
    {
      name: "message",
      type: "string",
      description: "Message to include in error",
      required: true,
    },
  ],
  fn: ({ message }: { message: string }) => {
    throw new Error(message);
  },
});
