import Tool from "src/lib/tool";

export async function fetchHTML({ url }: { url: string }) {
  const res = await fetch(url);
  const html = await res.text();
  return html;
}

export default Tool.create({
  name: "fetch_url",
  description:
    "Fetch the HTML of a webpage. Provide a `url` and I will respond with the HTML.",
  inputs: [
    {
      name: "url",
      type: "string",
      description: "The URL of the webpage to fetch",
      required: true,
    },
  ],
  fn: fetchHTML,
});
