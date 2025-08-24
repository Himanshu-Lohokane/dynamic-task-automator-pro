
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, FileText, Image, Video, Music, Folder } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import PDFUpload from '@/components/PDFUpload';
import ImageUpload from '@/components/ImageUpload';
import VideoUpload from '@/components/VideoUpload';
import AudioUpload from '@/components/AudioUpload';
import DocumentsDashboard from '@/components/DocumentsDashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-6 bg-white border-b shadow-sm">
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
          <TabsTrigger 
            value="video" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            data-testid="video-tab"
          >
            <Video className="w-4 h-4" />
            🎬 Save Video
          </TabsTrigger>
          <TabsTrigger 
            value="audio" 
            className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
            data-testid="audio-tab"
          >
            <Music className="w-4 h-4" />
            🎵 Save Audio
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="flex items-center gap-2 data-[state=active]:bg-slate-50 data-[state=active]:text-slate-700"
            data-testid="documents-tab"
          >
            <Folder className="w-4 h-4" />
            📁 Documents
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
        
        <TabsContent value="video" className="flex-1 m-0 overflow-hidden">
          <VideoUpload />
        </TabsContent>
        
        <TabsContent value="audio" className="flex-1 m-0 overflow-hidden">
          <AudioUpload />
        </TabsContent>
        
        <TabsContent value="documents" className="flex-1 m-0 overflow-hidden">
          <DocumentsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
