import Tool from "src/lib/tool";

import fs from "fs";

async function listDirectoryFiles(directory: string) {
  try {
    const files = await fs.promises.readdir(directory);
    return files;
  } catch (error) {
    console.error(`Error listing files in directory ${directory}: `, error);
    return [];
  }
}

export default Tool.create({
  name: "list_directory_files",
  description: "Lists all the files in a given directory.",
  inputs: [
    {
      name: "directory",
      type: "string",
      description: "The directory path to list files from.",
    },
  ],
  fn: async ({ directory }) => {
    let dl = await listDirectoryFiles(directory);
    return dl.join("\n");
  },
});
