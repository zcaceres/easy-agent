import fs from "fs";
import path from "path";

import Tool from "src/lib/tool";

export default Tool.create({
  name: "write_text_to_file",
  description: "Writes the provided text to a file in the specified directory.",
  inputs: [
    {
      name: "text",
      description: "The text to write to the file",
      type: "string",
    },
    {
      name: "directory",
      description: "The directory where the file should be created",
      type: "string",
    },
    {
      name: "filename",
      description: "The name of the file to create",
      type: "string",
    },
  ],
  fn: async ({ text, directory, filename }) => {
    const filePath = path.join(directory, filename);
    await fs.promises.writeFile(filePath, text);
    console.log(`Wrote text to file: ${filePath}`);
  },
});
