import fs from "fs";
import path from "path";

import Tool from "src/lib/tool";

export default Tool.create({
  name: "create_tool",
  description: "Create a new tool implementation and write it to a file.",
  inputs: [
    {
      name: "name",
      type: "string",
      description: "The name of the new tool",
      required: true,
    },
    {
      name: "description",
      type: "string",
      description: "A description of the new tool",
      required: true,
    },
    {
      name: "inputs",
      type: "array",
      description: "An array of input objects for the new tool",
      required: true,
    },
    {
      name: "implementation",
      type: "string",
      description: "The implementation code for the new tool",
      required: true,
    },
  ],
  fn: async ({
    name,
    description,
    inputs,
    implementation,
  }: {
    name: string;
    description: string;
    inputs: Array<{
      name: string;
      type: string;
      description: string;
      required: boolean;
    }>;
    implementation: string;
  }) => {
    const fileName = `${name}.ts`;
    const filePath = path.join("src", "tools", "sample", fileName);

    const inputsString = JSON.stringify(inputs, null, 2);

    const toolContent = `
import Tool from 'src/lib/tool';

export default Tool.create({
  name: '${name}',
  description: '${description}',
  inputs: ${inputsString},
  fn: async ({ ${inputs.map((input) => input.name).join(", ")} }) => {
    ${implementation}
  }
});
`;

    fs.writeFileSync(filePath, toolContent);

    return `Created new tool "${name}" at ${filePath}`;
  },
});
