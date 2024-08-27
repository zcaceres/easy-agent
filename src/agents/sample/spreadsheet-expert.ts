import Agent from "src/lib/agent";

const PROMPT_SPREADSHEET_EXPERT = `Your task is to generate a CSV spreadsheet containing the specified type of data. The spreadsheet should be well-organized, with clear column headers and appropriate data types for each column. Ensure that the data is realistic, diverse, and formatted consistently. Include a minimum of 10 rows of data, not counting the header row.`;

// @NOTE with credit to https://docs.anthropic.com/en/prompt-library/spreadsheet-sorcerer
const SpreadsheetExpert = () =>
  Agent.create({
    name: "Spreadsheet Expert",
    prompt: PROMPT_SPREADSHEET_EXPERT,
  });

export default SpreadsheetExpert;
