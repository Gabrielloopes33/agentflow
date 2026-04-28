---
name: mcp-builder
description: Build Model Context Protocol (MCP) servers to expose tools and resources to LLMs. Use when creating integrations between agentflow and external systems, building tool APIs, or designing agent-accessible services. Trigger on MCP, tool server, or API integration tasks.
---

# MCP Builder

Build Model Context Protocol servers for agent-tool integration.

## When to Use

- Creating tool servers for agentflow agents
- Building integrations with external APIs
- Exposing project-specific functionality as LLM tools
- Designing agent-accessible services

## What is MCP

Model Context Protocol is a standard for exposing tools, resources, and prompts to LLMs. It enables:
- **Tools** — Functions agents can call
- **Resources** — Data sources agents can read
- **Prompts** — Reusable prompt templates

## Building an MCP Server

### 1. Define Tools

Each tool needs:
- **Name** — Clear, descriptive
- **Description** — What it does, when to use it
- **Input schema** — JSON Schema for parameters
- **Handler** — Implementation function

### 2. Implement Server

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "my-tool-server",
  version: "1.0.0",
}, {
  capabilities: { tools: {} }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "read_module",
      description: "Read and analyze a code module",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "Module path" }
        },
        required: ["path"]
      }
    }
  ]
}));
```

### 3. Register with Agentflow

Add to `agentflow.config.js`:

```javascript
mcp: {
  servers: [
    { name: "my-server", command: "node ./mcp-server.js" }
  ]
}
```

## Best Practices

- Design tools to be composable
- Include clear descriptions (agents use these to decide when to call)
- Validate inputs strictly
- Return structured, parseable outputs
- Handle errors gracefully with informative messages
- Keep tool handlers stateless when possible

## Integration with Agentflow

Agentflow agents can discover and use MCP tools automatically:
- `analyze` agent — uses tools to explore codebase
- `plan` agent — uses tools to gather context
- `execute` agent — uses tools to implement features
- `review` agent — uses tools to validate changes
