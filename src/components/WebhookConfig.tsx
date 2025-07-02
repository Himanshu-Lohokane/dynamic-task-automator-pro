
import React, { useState } from 'react';
import { Settings, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const WebhookConfig = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Webhook URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('n8n-webhook-url', webhookUrl);
    toast({
      title: "Saved!",
      description: "Webhook URL has been saved",
    });
  };

  const handleTest = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test connection from frontend',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Connection test successful",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your webhook URL and ensure your n8n workflow is active",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('n8n-webhook-url');
    if (saved) {
      setWebhookUrl(saved);
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          n8n Webhook Configuration
        </CardTitle>
        <CardDescription>
          Configure your n8n webhook URL to connect this frontend with your AI automation workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Webhook URL</label>
          <div className="flex gap-2">
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/my_webhook"
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!webhookUrl}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!webhookUrl} className="flex-1">
            Save Configuration
          </Button>
          <Button onClick={handleTest} disabled={!webhookUrl} variant="outline" className="flex-1">
            Test Connection
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Copy your n8n webhook URL (ends with <code className="bg-blue-200 px-1 rounded">/webhook/my_webhook</code>)</li>
            <li>Make sure your n8n workflow is <strong>active</strong></li>
            <li>Paste the URL in the field above and click "Save Configuration"</li>
            <li>Click "Test Connection" to verify everything works</li>
            <li>Start chatting with your AI assistant!</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Your n8n Workflow Features:</h4>
          <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
            <li><strong>Gmail Integration:</strong> Send emails through your Gmail account</li>
            <li><strong>Google Calendar:</strong> Create calendar events and manage schedules</li>
            <li><strong>AI Memory:</strong> Remembers conversation context</li>
            <li><strong>Smart Responses:</strong> Powered by Google Gemini AI</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
          <h4 className="font-medium text-amber-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>Your webhook accepts POST requests with JSON data</li>
            <li>Ensure your n8n workflow is <strong>active</strong> before testing</li>
            <li>Make sure your Google accounts are properly authenticated in n8n</li>
            <li>The AI can handle natural language requests for emails and calendar events</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
