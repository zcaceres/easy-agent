import express from "express";
import type { Request } from "express";
import registeredAgents from "start-here";
import AgentSelector from "../agent-selector";
import type { ServerAgentRequest } from "definitions";
import AgentCache from "./agent-cache";

const CACHE = AgentCache.create();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    agents: registeredAgents.list(),
    message: "Here are available agents",
  });
});

app.post("/", async (req: Request<{}, {}, ServerAgentRequest>, res) => {
  const { agentName, message, stateful } = req.body;
  if (!agentName) {
    return res.status(400).json({ message: "Agent name is required" });
  }
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  let agent = await AgentSelector.fromAgentName(agentName, registeredAgents);

  if (!agent) {
    return res
      .status(404)
      .json({ message: `Agent with name ${agentName} not found.` });
  }

  if (stateful) {
    let cachedAgent = CACHE.get(agentName);
    if (cachedAgent) {
      CACHE.set(agentName, freshAgent);
    }
  } else {
  }

  await agent.start(message);

  res.json({ message: "Hello, world!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
