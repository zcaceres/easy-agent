import express from "express";
import type { Request, Response } from "express";
import registeredAgents from "start-here";
import AgentSelector from "../agent-selector";
import type { ServerAgent } from "definitions";
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

app.post(
  "/",
  async (
    req: Request<{}, {}, ServerAgent.Request>,
    res: Response<ServerAgent.Response | ServerAgent.NotFoundError>
  ) => {
    const { agentName, message, stateful } = req.body;
    if (!agentName) {
      return res.status(400).json({ message: "Agent name is required" });
    }
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let selectedAgent = AgentSelector.fromAgentName(
      agentName,
      registeredAgents
    );

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

    if (stateful) {
      // send back only the latest response, since the expectation is that the caller will continue to send messages to the same agent and is managing state on client-side
      res.json({ messages: [selectedAgent.getLatestMessage()] });
      return;
    }

    res.json({ messages: selectedAgent.getHistory() });
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
