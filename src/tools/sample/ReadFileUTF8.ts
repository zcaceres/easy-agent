import Tool from "src/lib/tool";
import { readFileSync } from "fs";

export default Tool.create({
  name: "ReadFileUTF8",
  description:
    "Reads the contents of a file and returns the UTF-8 encoded text",
  inputs: [
    {
      name: "filePath",
      description: "The path to the file to read",
      type: "string",
    },
  ],
  fn: async ({ filePath }) => {
      // Check file size to avoid reading enormous binary files
      const stats = readFileSync(filePath, { encoding: "utf8" });
      if (stats.length > 100 * 1024 * 1024) {
        // 100MB limit
        throw new Error("File is too large to read safely");
      }
      return readFileSync(filePath, { encoding: "utf8" });
    }
  },
});
