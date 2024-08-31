import Agent from "src/lib/agent";
import FetchHTML from "src/tools/sample/FetchHTML";

const PROMPT_URL_EXTRACTOR = `
You find and extract urls from HTML. You then provide the urls you find as a CSV.

If I ask you to find only particular urls, only return those. Do not say anything other than the URLs.

You have a tool 'fetch_html' available which let's you fetch a website's url to start your search.
`;

const URLExtractor = () =>
  Agent.create({
    name: "URL Extractor",
    prompt: PROMPT_URL_EXTRACTOR,
    tools: [FetchHTML],
  });

export default URLExtractor;
