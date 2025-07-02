
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
      content: "Hi! I'm your AI assistant. I can help you send emails, create calendar events, and work with dates. What would you like me to help you with today?",
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

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Replace this URL with your actual n8n webhook URL
      const webhookUrl = 'https://your-n8n-instance.com/webhook/6ce34d61-2799-4d71-9a10-5a35d4f99602';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: result.response || result.output || 'Task completed successfully!',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I encountered an error processing your request. Please make sure the webhook URL is configured correctly and try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Please check your n8n webhook configuration",
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
                <p className="text-sm leading-relaxed">{message.content}</p>
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
                  <p className="text-sm text-gray-600">AI is thinking...</p>
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
          Try: "Send an email to john@example.com" or "Create a meeting for tomorrow at 2 PM"
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
