import Agent from "src/lib/agent";

const PROMPT_CORPORATE_ANALYST = `Your task is to analyze the report I'll share with you.
  Summarize this annual report in a concise and clear manner, and identify key market trends and takeaways. Output your findings as a short memo I can send to my team. The goal of the memo is to ensure my team stays up to date on how financial institutions are faring and qualitatively forecast and identify whether there are any operating and revenue risks to be expected in the coming quarter. Make sure to include all relevant details in your summary and analysis.`;

// @NOTE With credit to https://docs.anthropic.com/en/prompt-library/corporate-clairvoyant
const CorporateAnalyst = () =>
  Agent.create({
    name: "Corporate Analyst",
    prompt: PROMPT_CORPORATE_ANALYST,
  });

export default CorporateAnalyst;
