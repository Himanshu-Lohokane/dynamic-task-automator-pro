# n8n Workflows

This directory contains your n8n workflow configurations and documentation.

## Current Webhook Configuration

- **Webhook URL**: `https://kasimlohar.app.n8n.cloud/webhook-test/bdd9a358-e97e-4da2-8aed-6fd474dec5a7`
- **Method**: POST
- **Content-Type**: application/json

## Expected Request Format

```json
{
  "message": "User's chat message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "source": "replit-chat-frontend"
}
```

## Debugging and Connection Issues

Your chat application now includes:

1. **Comprehensive Debugging**: Detailed console logs for troubleshooting
2. **Dual Connection Method**: 
   - Direct connection to n8n webhook (tries first)
   - Backend proxy fallback (if direct fails due to CORS)
3. **Multiple Response Format Support**: Handles various n8n response formats

## Common Issues and Solutions

### CORS Issues
- **Problem**: Direct browser requests to n8n webhook blocked by CORS
- **Solution**: Backend proxy route automatically handles this

### n8n Workflow Configuration
- Ensure your n8n workflow is **active**
- Verify webhook URL is accessible
- Check workflow execution logs in n8n

### Response Format
Your workflow should return one of these formats:
- Plain text string
- `{ "response": "message" }`
- `{ "output": "message" }`
- `{ "text": "message" }`
- `{ "message": "message" }`

## Testing Your Setup

1. Open browser console (F12)
2. Send a test message in the chat
3. Look for detailed debug logs with emojis:
   - 🔍 Browser info
   - 📤 Outgoing requests  
   - 📥 Responses received
   - ✅ Success indicators
   - ❌ Error details

The logs will tell you exactly what's happening with your webhook connection.