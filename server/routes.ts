import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Proxy route for n8n webhook to avoid CORS issues
  app.post("/api/webhook/n8n", async (req, res) => {
    try {
      log('🔄 [WEBHOOK] Received proxy request');
      log(`📋 [WEBHOOK] Request body: ${JSON.stringify(req.body)}`);

      const { message, timestamp, source, webhookUrl } = req.body;
      
      if (!message) {
        log('❌ [WEBHOOK] Missing message in request body');
        return res.status(400).json({ 
          success: false,
          error: 'Missing message in request body',
          received: req.body 
        });
      }

      if (!webhookUrl) {
        log('❌ [WEBHOOK] Missing webhookUrl in request body');
        return res.status(400).json({ 
          success: false,
          error: 'Missing webhookUrl in request body',
          received: req.body 
        });
      }
      
      log(`📤 [WEBHOOK] Forwarding to n8n: ${webhookUrl}`);

      // Forward request to n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Replit-ChatBot-Proxy/1.0',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
          message,
          timestamp: timestamp || new Date().toISOString(),
          source: source || 'replit-chat-backend'
        })
      });

      log(`📥 [WEBHOOK] n8n response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        log(`❌ [WEBHOOK] n8n error: ${response.status} ${response.statusText}`);
        return res.status(200).json({
          success: false,
          error: `n8n webhook returned ${response.status}: ${response.statusText}`,
          details: {
            status: response.status,
            statusText: response.statusText,
            webhookUrl: webhookUrl
          }
        });
      }

      // Get response text first to handle any format
      const responseText = await response.text();
      log(`📄 [WEBHOOK] Raw n8n response (full): "${responseText}"`);
      log(`📏 [WEBHOOK] Response length: ${responseText.length} characters`);

      let result;
      try {
        result = JSON.parse(responseText);
        log('✅ [WEBHOOK] Parsed n8n JSON response successfully');
      } catch (parseError) {
        log('📝 [WEBHOOK] n8n response was not JSON, treating as text');
        result = { message: responseText, raw: responseText };
      }

      // Return the result to frontend
      const successResponse = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
        source: 'replit-backend-proxy',
        webhookUrl: webhookUrl
      };

      log('✅ [WEBHOOK] Sending success response to frontend');
      res.json(successResponse);

    } catch (error) {
      log(`❌ [WEBHOOK] Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}`);

      res.status(200).json({
        success: false,
        error: 'Internal server error while proxying to n8n webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
