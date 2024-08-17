import * as fs from "fs";

function checkForApiKey() {
  const files = fs.readdirSync(".", { withFileTypes: true });
  const gitignoreContent = fs.readFileSync(".gitignore", "utf8");
  const ignoredFiles = gitignoreContent.split("\n").filter(Boolean);

  for (const file of files) {
    if (
      file.isFile() &&
      !file.name.includes("node_modules") &&
      file.name !== "check-for-api-key.ts" &&
      file.name !== ".gitignore" &&
      !ignoredFiles.includes(file.name)
    ) {
      const content = fs.readFileSync(file.name, "utf8");
      if (content.includes("sk-")) {
        console.error(`Error: File '${file.name}' contains 'sk-' pattern.`);
        console.error(
          "!!!!!!!!!!!!!!!!YOU MIGHT BE COMMITTING YOUR API KEY!!!!!!!!!!!"
        );
        process.exit(1);
      }
    }
  }
}

checkForApiKey();
