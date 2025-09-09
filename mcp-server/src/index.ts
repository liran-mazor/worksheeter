import dotenv from 'dotenv';
dotenv.config();

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// Configuration
const WORKSHEETER_API_URL = process.env.WORKSHEETER_BASE_URL;
const API_KEY = process.env.WORKSHEETER_API_KEY;

class WorksheeterMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'worksheeter-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_worksheet',
            description: 'Create a new worksheet about a specific topic',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'The title/topic for the worksheet (e.g., "JavaScript Arrays")',
                },
                content: {
                  type: 'string',
                  description: 'Optional content or description for the worksheet',
                },
              },
              required: ['title'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'create_worksheet':
          return await this.createWorksheet(args as { title: string; content?: string });
        
        default:
          throw new Error(`Tool ${name} not found`);
      }
    });
  }

  private async createWorksheet(args: { title: string; content?: string }) {
    try {
      // Generate basic keywords and questions to satisfy validation requirements
      const basicKeywords = [
        'study',
        'learning',
        args.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
      ].filter(Boolean);

      const basicQuestions = [
        `What are the key concepts in ${args.title}?`,
        `How do you apply ${args.title} in practice?`,
        `What are the main benefits of understanding ${args.title}?`
      ];

      const payload = {
        title: args.title,
        keywords: basicKeywords,
        questions: basicQuestions
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${WORKSHEETER_API_URL}/api/worksheets`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const worksheet = response.data;
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Worksheet created successfully!\n\n` +
                  `📚 Title: ${worksheet.title}\n` +
                  `🆔 ID: ${worksheet.id}\n` +
                  `📅 Created: ${new Date().toLocaleString()}\n\n` +
                  `🔗 View at: ${WORKSHEETER_API_URL}/worksheets/${worksheet.id}\n\n` +
                  `The worksheet is being processed by AI and will be ready shortly with enhanced keywords, definitions, and quiz questions.`,
          },
        ],
      };
    } catch (error: any) {
      console.error('Error creating worksheet:', error);
      
      return {
        content: [
          {
            type: 'text',
            text: `❌ Failed to create worksheet.\n\n` +
                  `Error: ${error.response?.data?.message || error.message}\n\n` +
                  `Please check that the Worksheeter platform is running and accessible.`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Worksheeter MCP server running on stdio');
  }
}

// Start the server
const server = new WorksheeterMCPServer();
server.run().catch(console.error);