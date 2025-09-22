import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FormData } from 'formdata-node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🎵 [AUDIO] Received audio upload request');
    console.log('🔍 [AUDIO] Request headers:', req.headers);
    console.log('🔍 [AUDIO] Content type:', req.headers['content-type']);
    
    if (!req.body) {
      console.log('❌ [AUDIO] No request body');
      return res.status(400).json({ 
        success: false,
        error: 'No request body received'
      });
    }

    // Extract data from the JSON request
    const { webhookUrl, fileName, timestamp, file, fileType, fileSize } = req.body;
    
    if (!file) {
      console.log('❌ [AUDIO] No file in request body');
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded - file field missing',
        received: {
          hasWebhookUrl: !!webhookUrl,
          hasFileName: !!fileName,
          hasTimestamp: !!timestamp,
          bodyKeys: Object.keys(req.body || {})
        }
      });
    }

    if (!webhookUrl) {
      console.log('❌ [AUDIO] Missing webhookUrl in request body');
      return res.status(400).json({ 
        success: false,
        error: 'Missing webhookUrl in request body',
        received: {
          hasFile: !!file,
          hasFileName: !!fileName,
          bodyKeys: Object.keys(req.body || {})
        }
      });
    }

    console.log(`📋 [AUDIO] Processing file: ${fileName} (${fileSize} bytes)`);
    console.log(`📤 [AUDIO] Forwarding to n8n: ${webhookUrl}`);

    // Create FormData for n8n - handle base64 data
    const formData = new FormData();
    
    // Convert base64 to buffer
    const base64Data = file.split(',')[1] || file;
    const fileBuffer = Buffer.from(base64Data, 'base64');
    
    formData.append('file', new Blob([fileBuffer], { type: fileType || 'audio/mpeg' }), fileName);
    formData.append('fileName', fileName);
    formData.append('timestamp', timestamp || new Date().toISOString());
    formData.append('source', 'vercel-audio-uploader');

    // Forward to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData as any,
      headers: {
        'User-Agent': 'Vercel-Audio-Proxy/1.0',
      }
    });

    console.log(`📥 [AUDIO] n8n response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.log(`❌ [AUDIO] n8n error: ${response.status} ${response.statusText}`);
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
    console.log(`📄 [AUDIO] Raw n8n response (full): "${responseText}"`);
    console.log(`📏 [AUDIO] Response length: ${responseText.length} characters`);

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ [AUDIO] Parsed n8n JSON response successfully');
    } catch (parseError) {
      console.log('📝 [AUDIO] n8n response was not JSON, treating as text');
      result = { message: responseText, raw: responseText };
    }

    // Return the result to frontend
    const successResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      source: 'vercel-audio-backend-proxy',
      webhookUrl: webhookUrl,
      fileName: fileName,
      fileSize: req.body.file.length
    };

    console.log('✅ [AUDIO] Sending success response to frontend');
    res.json(successResponse);

  } catch (error) {
    console.log(`❌ [AUDIO] Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);

    res.status(200).json({
      success: false,
      error: 'Internal server error while processing audio upload',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
