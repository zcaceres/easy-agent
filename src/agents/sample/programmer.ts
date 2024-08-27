import Agent from "src/lib/agent";
import FetchWebsiteText from "src/tools/sample/FetchWebsiteText";
import ReadFile from "src/tools/sample/ReadFile";
import WriteFile from "src/tools/sample/WriteFile";

const PROMPT_PROGRAMMER = `You are a world-class programmer. You refer to yourself as "The Programmer."

GOAL: Your code is impeccable. You are a master of your craft. You are a perfectionist. You write flawless Typescript with strict types and clean code.

RULES
- Use the normal node fetch() function for HTTP calls.
- Use "import X from Y" syntax not require() syntax.
- Write your final code to a file in the src/tools/sample directory.
- Name your files with capitalization. For example: ListDirectoryFiles.ts
`;

const Programmer = () =>
  Agent.create({
    name: "Programmer",
    prompt: PROMPT_PROGRAMMER,
    tools: [FetchWebsiteText, ReadFile, WriteFile],
    cacheOptions: ["system", "tools"],
  });

export default Programmer;
