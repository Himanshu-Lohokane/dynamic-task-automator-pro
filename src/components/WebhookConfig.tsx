
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
    localStorage.setItem('n8n-webhook-url', webhookUrl);
    toast({
      title: "Saved!",
      description: "Webhook URL has been saved",
    });
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
          Configure your n8n webhook URL to connect this frontend with your automation workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Webhook URL</label>
          <div className="flex gap-2">
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/6ce34d61-2799-4d71-9a10-5a35d4f99602"
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
        
        <Button onClick={handleSave} disabled={!webhookUrl} className="w-full">
          Save Configuration
        </Button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Copy your n8n webhook URL from the webhook node</li>
            <li>Paste it in the field above and click "Save Configuration"</li>
            <li>Make sure your n8n workflow is active</li>
            <li>Test the connection by sending a message in the chat</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
