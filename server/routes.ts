import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Proxy route for n8n webhook to avoid CORS issues
  app.post("/api/webhook/n8n", async (req, res) => {
    try {
      console.log('🔄 [SERVER] Received webhook proxy request:', {
        body: req.body,
        headers: req.headers,
        timestamp: new Date().toISOString()
      });

      const { message, timestamp, source } = req.body;
      
      if (!message) {
        console.error('❌ [SERVER] Missing message in request body');
        return res.status(400).json({ 
          error: 'Missing message in request body',
          received: req.body 
        });
      }

      // n8n webhook URL 
      const webhookUrl = 'https://kasimlohar.app.n8n.cloud/webhook-test/bdd9a358-e97e-4da2-8aed-6fd474dec5a7';
      
      console.log('📤 [SERVER] Forwarding to n8n webhook:', {
        url: webhookUrl,
        payload: { message, timestamp, source }
      });

      // Forward request to n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Replit-ChatBot-Proxy/1.0'
        },
        body: JSON.stringify({
          message,
          timestamp: timestamp || new Date().toISOString(),
          source: source || 'replit-chat-backend'
        })
      });

      console.log('📥 [SERVER] n8n webhook response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        console.error('❌ [SERVER] n8n webhook error:', {
          status: response.status,
          statusText: response.statusText
        });
        return res.status(response.status).json({
          error: `n8n webhook returned ${response.status}: ${response.statusText}`,
          details: {
            status: response.status,
            statusText: response.statusText
          }
        });
      }

      // Get response text first to handle any format
      const responseText = await response.text();
      console.log('📄 [SERVER] Raw n8n response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('✅ [SERVER] Parsed n8n JSON response:', result);
      } catch (parseError) {
        console.log('📝 [SERVER] n8n response was not JSON, treating as text');
        result = { message: responseText, raw: responseText };
      }

      // Return the result to frontend
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
        source: 'replit-backend-proxy'
      });

    } catch (error) {
      console.error('❌ [SERVER] Webhook proxy error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        body: req.body
      });

      res.status(500).json({
        error: 'Internal server error while proxying to n8n webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
