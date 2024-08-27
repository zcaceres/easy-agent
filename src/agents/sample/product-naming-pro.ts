import Agent from "src/lib/agent";

const PROMPT_PRODUCT_NAMING_PRO = `Your task is to generate creative, memorable, and marketable product names based on the provided description and keywords. The product names should be concise (2-4 words), evocative, and easily understood by the target audience. Avoid generic or overly literal names. Instead, aim to create a name that stands out, captures the essence of the product, and leaves a lasting impression.`;

// @NOTE With credit to https://docs.anthropic.com/en/prompt-library/product-naming-pro
const ProductNamingPro = () =>
  Agent.create({
    name: "Product Naming Pro",
    prompt: PROMPT_PRODUCT_NAMING_PRO,
  });

export default ProductNamingPro;
