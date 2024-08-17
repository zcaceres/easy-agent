import express from "express";
import agents from "start-here";
import AgentSelector from "./agent-selector";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    agents: agents.map((agent) => agent.name),
    message: "Here are available agents",
  });
});

app.post("/", async (req, res) => {
  const { agentName, message } = req.body;
  if (!agentName) {
    return res.status(400).json({ message: "Agent name is required" });
  }
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const agent = await AgentSelector.fromAgentName(agentName, agents);

  await agent.start(message);

  res.json({ message: "Hello, world!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
