import Tool from "src/lib/tool";

export default Tool.create({
  name: "fetch_google_serp",
  description:
    "Fetch the JSON data for a Google search engine results page (SERP) using SerpAPI.",
  inputs: [
    {
      name: "query",
      type: "string",
      description: "The search query to fetch the SERP for",
      required: true,
    },
    {
      name: "apiKey",
      type: "string",
      description: "Your SerpAPI API key",
      required: true,
    },
  ],
  fn: async ({ query, apiKey }) => {
    const params = new URLSearchParams({
      q: query,
      api_key: apiKey,
      engine: "google",
      format: "json",
    });
    const response = await fetch(`https://serpapi.com/search?${params}`);
    const data = await response.json();
    return data;
  },
});
