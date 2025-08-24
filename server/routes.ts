import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { log } from "./vite";
import multer from "multer";
import { FormData as NodeFormData } from "formdata-node";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed!'));
      }
    },
  });

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

  // PDF Upload endpoint
  app.post("/api/upload-pdf", upload.single('file'), async (req, res) => {
    try {
      log('📄 [PDF] Received PDF upload request');
      
      if (!req.file) {
        log('❌ [PDF] No file in request');
        return res.status(400).json({ 
          success: false,
          error: 'No file uploaded',
          received: req.body 
        });
      }

      const { webhookUrl, fileName, timestamp } = req.body;
      
      if (!webhookUrl) {
        log('❌ [PDF] Missing webhookUrl in request body');
        return res.status(400).json({ 
          success: false,
          error: 'Missing webhookUrl in request body',
          received: req.body 
        });
      }

      log(`📋 [PDF] Processing file: ${req.file.originalname} (${req.file.size} bytes)`);
      log(`📤 [PDF] Forwarding to n8n: ${webhookUrl}`);

      // Prepare form data for n8n
      const formData = new NodeFormData();
      formData.append('file', new Blob([req.file.buffer], { type: 'application/pdf' }), req.file.originalname);
      formData.append('fileName', fileName || req.file.originalname);
      formData.append('timestamp', timestamp || new Date().toISOString());
      formData.append('source', 'replit-pdf-uploader');

      // Forward to n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData as any,
        headers: {
          'User-Agent': 'Replit-PDF-Proxy/1.0',
        }
      });

      log(`📥 [PDF] n8n response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        log(`❌ [PDF] n8n error: ${response.status} ${response.statusText}`);
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
      log(`📄 [PDF] Raw n8n response (full): "${responseText}"`);
      log(`📏 [PDF] Response length: ${responseText.length} characters`);

      let result;
      try {
        result = JSON.parse(responseText);
        log('✅ [PDF] Parsed n8n JSON response successfully');
      } catch (parseError) {
        log('📝 [PDF] n8n response was not JSON, treating as text');
        result = { message: responseText, raw: responseText };
      }

      // Return the result to frontend
      const successResponse = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
        source: 'replit-pdf-backend-proxy',
        webhookUrl: webhookUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size
      };

      log('✅ [PDF] Sending success response to frontend');
      res.json(successResponse);

    } catch (error) {
      log(`❌ [PDF] Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);

      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(200).json({
            success: false,
            error: 'File too large. Maximum size is 10MB.',
            details: error.message
          });
        }
      }

      res.status(200).json({
        success: false,
        error: 'Internal server error while processing PDF upload',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
