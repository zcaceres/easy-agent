import express from "express";
import type { Request, Response } from "express";
import AgentSelector from "src/lib/agent-selector";
import type { ServerAgent } from "src/definitions";
import AgentCache from "src/lib/agent-cache";
import type Agent from "src/lib/agent";

import AgentRegistry from "src/lib/agent-registry";
import { EasyAgent } from "src/lib/easy-agent";

export default class EasyAgentServer implements EasyAgent {
  cachedAgentInstances: AgentCache;
  registeredAgents: AgentRegistry;

  private constructor(agents: Agent[]) {
    this.cachedAgentInstances = AgentCache.create();
    this.registeredAgents = AgentRegistry.create(agents);
  }

  private serve() {
    const app = express();
    const port = 3000;

    app.use(express.json());

    app.get("/", (_req, res) => {
      res.json({
        agents: this.registeredAgents.list(),
        message: "Here are available agents",
      });
    });

    app.post(
      "/",
      async (
        req: Request<{}, {}, ServerAgent.Request>,
        res: Response<ServerAgent.Response | ServerAgent.NotFoundError>,
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
          this.registeredAgents,
        );

        if (!selectedAgent) {
          return res
            .status(404)
            .json({ message: `Agent with name ${agentName} not found.` });
        }

        let cachedAgent = null;
        if (stateful) {
          cachedAgent = this.cachedAgentInstances.get(agentName);

          if (!cachedAgent) {
            this.cachedAgentInstances.set(agentName, selectedAgent);
          }

          selectedAgent = this.cachedAgentInstances.get(agentName) as Agent;
        }

        await selectedAgent.start(message);

        if (stateful) {
          // send back only the latest response, since the expectation is that the caller will continue to send messages to the same agent and is managing state on client-side
          res.json({ messages: [selectedAgent.getLatestMessage()] });
          return;
        }

        res.json({ messages: selectedAgent.getHistory() });
      },
    );

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  static start(agents: Agent[]) {
    return new EasyAgentServer(agents).serve();
  }
}
