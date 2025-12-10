#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// Configure Axios
const API_URL = "http://localhost:3000";
const client = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// Helper Authentication
let authCookie: string | undefined;

async function loginAsAdmin() {
  if (authCookie) return;
  try {
    const res = await client.post("/users/sign_in", {
      user: {
        email: "admin@example.com",
        password: "password",
      },
    });
    // Extract cookie
    const cookies = res.headers["set-cookie"];
    if (cookies) {
      authCookie = cookies.find((c) => c.startsWith("_interslice_session"));
      // Set default header for future requests
      client.defaults.headers.common["Cookie"] = authCookie;
    }
  } catch (error) {
    console.error("Admin login failed:", error);
  }
}

// Create Server
const server = new Server(
  {
    name: "ecommerce-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_items",
        description: "Search for products in the store",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search term (e.g. 'Laptop')",
            },
          },
        },
      },
      {
        name: "list_users",
        description: "List all users (Admin only)",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle Tool Calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "search_items": {
      const query = String(request.params.arguments?.query || "");
      try {
        const response = await client.get(`/items?search=${query}`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }

    case "list_users": {
        await loginAsAdmin();
        try {
          const response = await client.get("/users");
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } catch (error: any) {
             return {
            content: [
              {
                type: "text",
                text: `Error: ${error.message}. Ensure backend is running.`,
              },
            ],
            isError: true,
          };
        }
    }

    default:
      throw new Error("Unknown tool");
  }
});

// Start Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ecommerce MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
