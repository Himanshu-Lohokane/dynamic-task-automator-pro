
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ChatInterface from '@/components/ChatInterface';
import PDFUpload from '@/components/PDFUpload';
import ImageUpload from '@/components/ImageUpload';
import VideoUpload from '@/components/VideoUpload';
import AudioUpload from '@/components/AudioUpload';
import DocumentsDashboard from '@/components/DocumentsDashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'pdf':
        return <PDFUpload />;
      case 'image':
        return <ImageUpload />;
      case 'video':
        return <VideoUpload />;
      case 'audio':
        return <AudioUpload />;
      case 'documents':
        return <DocumentsDashboard />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
