
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, FileText, Image } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import PDFUpload from '@/components/PDFUpload';
import ImageUpload from '@/components/ImageUpload';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-3 bg-white border-b shadow-sm">
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            data-testid="chat-tab"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="pdf" 
            className="flex items-center gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            data-testid="pdf-tab"
          >
            <FileText className="w-4 h-4" />
            📄 Save PDF
          </TabsTrigger>
          <TabsTrigger 
            value="image" 
            className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
            data-testid="image-tab"
          >
            <Image className="w-4 h-4" />
            🖼️ Save Image
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
          <ChatInterface />
        </TabsContent>
        
        <TabsContent value="pdf" className="flex-1 m-0 overflow-hidden">
          <PDFUpload />
        </TabsContent>
        
        <TabsContent value="image" className="flex-1 m-0 overflow-hidden">
          <ImageUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
