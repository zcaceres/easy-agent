import express from "express";
import type { Request } from "express";
import registeredAgents from "start-here";
import AgentSelector from "../agent-selector";
import type { ServerAgentRequest } from "definitions";
import AgentCache from "./agent-cache";
import type Agent from "lib/agent";

const CachedAgentInstances = AgentCache.create();

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

  let selectedAgent = AgentSelector.fromAgentName(agentName, registeredAgents);

  if (!selectedAgent) {
    return res
      .status(404)
      .json({ message: `Agent with name ${agentName} not found.` });
  }

  let cachedAgent = null;
  if (stateful) {
    cachedAgent = CachedAgentInstances.get(agentName);

    if (!cachedAgent) {
      CachedAgentInstances.set(agentName, selectedAgent);
    }

    selectedAgent = CachedAgentInstances.get(agentName) as Agent;
  }

  await selectedAgent.start(message);

  // the goal here would be to send the message to the agent
  // wait for all tools to run
  // get the response

  if (stateful) {
    // send back only the response
    res.json({ message: "Hello, world!" });
    return;
  }

  // send back the entire history of the conversation
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
