import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI assistant powered by n8n. I can help you send emails through Gmail and create calendar events in Google Calendar. Please configure your webhook URL first, then we can start chatting!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    // Hardcoded webhook URL
    const webhookUrl = 'https://kasimlohar.app.n8n.cloud/webhook-test/bdd9a358-e97e-4da2-8aed-6fd474dec5a7';

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Debug: Log browser environment details
    console.log('🔍 [DEBUG] Browser debugging info:', {
      userAgent: navigator.userAgent,
      currentOrigin: window.location.origin,
      targetWebhook: webhookUrl,
      timestamp: new Date().toISOString()
    });

    try {
      console.log('📤 [DEBUG] Sending message via backend proxy:', { 
        message: currentInput, 
        originalWebhookUrl: webhookUrl,
        requestPayload: {
          message: currentInput,
          timestamp: new Date().toISOString(),
        }
      });

      // Use backend proxy only (direct connection fails due to CORS)
      const response = await fetch('/api/webhook/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          timestamp: new Date().toISOString(),
          source: 'replit-chat-frontend'
        }),
      });

      console.log('📥 [DEBUG] Backend proxy response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        type: response.type
      });

      if (!response.ok) {
        console.error('❌ [DEBUG] Backend proxy HTTP error:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        throw new Error(`Backend proxy error ${response.status}: ${response.statusText}`);
      }

      // Get the JSON response from backend proxy
      const result = await response.json();
      console.log('✅ [DEBUG] Backend proxy JSON response:', result);
      
      // Check if backend proxy had an error
      if (!result.success) {
        console.error('❌ [DEBUG] Backend proxy returned error:', result);
        throw new Error(result.error || 'Backend proxy request failed');
      }
      
      // Extract the actual n8n response data
      const actualN8nResult = result.data;
      console.log('🔄 [DEBUG] n8n webhook response data:', actualN8nResult);
      
      // Check for empty responses
      if (actualN8nResult && actualN8nResult.raw === "") {
        console.log('⚠️ [DEBUG] n8n returned EMPTY response - workflow may have errors');
      }
      
      // Handle different response formats from n8n
      let botResponse = 'Task completed successfully!';
      
      console.log('🔄 [DEBUG] Processing n8n response format:', typeof actualN8nResult, actualN8nResult);
      
      if (typeof actualN8nResult === 'string') {
        botResponse = actualN8nResult;
        console.log('📝 [DEBUG] Using string response directly');
      } else if (actualN8nResult && actualN8nResult.response) {
        botResponse = actualN8nResult.response;
        console.log('📝 [DEBUG] Using result.response field');
      } else if (actualN8nResult && actualN8nResult.output) {
        botResponse = actualN8nResult.output;
        console.log('📝 [DEBUG] Using result.output field');
      } else if (actualN8nResult && actualN8nResult.text) {
        botResponse = actualN8nResult.text;
        console.log('📝 [DEBUG] Using result.text field');
      } else if (actualN8nResult && actualN8nResult.message) {
        botResponse = actualN8nResult.message;
        console.log('📝 [DEBUG] Using result.message field');
      } else if (actualN8nResult && actualN8nResult.raw) {
        if (actualN8nResult.raw.trim() === "") {
          botResponse = "⚠️ n8n workflow returned empty response. Check your workflow for errors, especially the LangChain memory buffer configuration.";
          console.log('⚠️ [DEBUG] Empty raw response from n8n workflow');
        } else {
          botResponse = actualN8nResult.raw;
          console.log('📝 [DEBUG] Using result.raw field (plain text from n8n)');
        }
      } else if (actualN8nResult && actualN8nResult.data) {
        botResponse = JSON.stringify(actualN8nResult.data);
        console.log('📝 [DEBUG] Using result.data field (stringified)');
      } else {
        botResponse = JSON.stringify(actualN8nResult);
        console.log('📝 [DEBUG] Using stringified full result');
      }

      console.log('✅ [DEBUG] Final bot response:', botResponse);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      toast({
        title: "Success",
        description: "Message processed successfully",
      });

    } catch (error) {
      console.error('❌ [DEBUG] Detailed error information:', {
        error: error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : 'No stack trace',
        errorName: error instanceof Error ? error.name : 'Unknown error type',
        webhookUrl: webhookUrl,
        inputMessage: currentInput
      });

      // Check for specific error types
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🚫 [DEBUG] Network/CORS Error detected');
        console.log('💡 [DEBUG] This could be:');
        console.log('  1. Backend proxy route not working');
        console.log('  2. n8n workflow not active');
        console.log('  3. Network connectivity issue');
        console.log('  4. Webhook URL incorrect');
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I'm sorry, I encountered an error processing your request. 

Error: ${error instanceof Error ? error.message : 'Unknown error'}

Troubleshooting steps:
1. Check that your n8n workflow is active
2. Verify the webhook URL: ${webhookUrl}
3. Check the browser console for detailed debug logs
4. Ensure your internet connection is stable

The system uses a backend proxy to avoid CORS issues. Check the server logs as well.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Check console for detailed error information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  return (
    <div className="flex flex-col h-full max-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">AI Assistant</h1>
              <p className="text-sm text-gray-600">Powered by n8n automation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <Card className={`p-4 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg'
                  : 'bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-md'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </Card>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <Card className="p-4 bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <p className="text-sm text-gray-600">AI is processing your request...</p>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to send an email, create a calendar event, or anything else..."
            className="flex-1 bg-white/90 border-gray-300/50 focus:border-blue-500 focus:ring-blue-500/20"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Try: "Send an email to john@example.com about our meeting" or "Create a meeting for tomorrow at 2 PM"
        </p>
        <p className="text-xs text-gray-400 mt-1 text-center">
          Connected to: kasimlohar.app.n8n.cloud
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
