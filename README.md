# Dynamic Task Automator Pro

An advanced Retrieval Augmented Generation (RAG) system and comprehensive content processing platform that combines modern web technologies with AI-powered analysis for multiple types of media. The system serves as an intelligent memory augmentation tool that can process, understand, and retrieve information from various types of content (text, images, audio, video) while also leveraging real-time web search capabilities.

## 🎓 Key Use Cases

### Personal Knowledge Management
- Create your own AI-powered second brain
- Process and recall information from any type of media
- Build a personalized, searchable knowledge base
- Contextual understanding across different content types

### Enterprise Data Management
- Handle massive multimodal datasets efficiently
- Process company documentation, media, and communications
- Create an intelligent corporate memory system
- Scale from small teams to large organizations

## 🎯 Core Features

- Multi-modal content processing (PDF, Images, Audio, Video)
- AI-powered content analysis and understanding
- Semantic search across all content types
- Real-time chat interface with context awareness
- Document management dashboard
- Automated workflow processing

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React with TypeScript
- **UI Components**: 
  - Radix UI for accessible components
  - Tailwind CSS for styling
  - Custom theme support (light/dark)
- **State Management**: React Query
- **Routing**: Wouter
- **Authentication**: Custom auth system with protected routes

### Backend Stack
- **Server**: Express.js with TypeScript
- **File Processing**: Multer
- **Real-time**: WebSocket support
- **Error Handling**: Comprehensive error tracking and logging
- **API Design**: RESTful architecture

### AI Integration
- **Language Model**: Google Gemini
- **Embeddings**: OpenAI
- **Vector Database**: Pinecone
- **Web Search**: SerpAPI

## 🔄 Workflow System (n8n)

### 1. AI Agent Workflow
```
Input: User queries
Process: 
- Context-aware chat processing
- Vector DB knowledge retrieval
- Web search integration
Output: Intelligent responses
```

### 2. PDF Processing Workflow
```
Input: PDF files (max 10MB)
Process:
- Text chunking (1200 chars)
- Embedding generation
- Vector storage
Output: Searchable document content
```

### 3. Image Processing Workflow
```
Input: Image files (max 10MB)
Process:
- AI-powered image analysis
- Description generation
- Embedding creation
Output: Searchable image descriptions
```

### 4. Audio Processing Workflow
```
Input: Audio files (max 50MB)
Process:
- Speech transcription
- Content analysis
- Embedding generation
Output: Searchable audio transcripts
```

### 5. Video Processing Workflow
```
Input: Video files (max 100MB)
Process:
- Video content analysis
- Description generation
- Embedding creation
Output: Searchable video descriptions
```

## 💾 Data Architecture

### Vector Storage (Pinecone)
- Stores embeddings for all content types
- Enables semantic search
- Maintains metadata and relationships
- Supports context retrieval

### Memory Systems
- Chat history retention
- Context window management
- Session-based memory buffer

## 🔌 API Endpoints

### File Upload Endpoints
```
POST /api/upload-pdf   - PDF processing
POST /api/upload-image - Image processing
POST /api/upload-video - Video processing
POST /api/upload-audio - Audio processing
```

### Webhook Endpoints
```
POST /api/webhook/n8n  - n8n workflow triggers
```

## 🛡️ Security Features

- File type validation
- Size limitations per file type
- Protected routes
- Authentication system
- Secure file handling

## 🔧 Configuration

### File Size Limits
- PDF: 10MB
- Images: 10MB
- Video: 100MB
- Audio: 50MB

### Supported File Types
- PDF: application/pdf
- Images: image/*
- Video: video/*
- Audio: audio/*

## 🚀 Integration Flow

1. **Content Upload**
   - Frontend file selection
   - Type validation
   - Size check
   - Upload to server

2. **Processing Pipeline**
   - n8n workflow trigger
   - Content analysis
   - Embedding generation
   - Vector storage
   - Response formatting

3. **Retrieval System**
   - Semantic search
   - Context building
   - Response generation
   - User presentation

## 🤖 AI Capabilities

### Content Analysis
- Document understanding
- Image description
- Audio transcription
- Video content analysis

### Advanced RAG System
- Hybrid search combining vector and keyword search
- Multi-source information retrieval
  - Vector database (Pinecone)
  - Real-time web search (SerpAPI)
  - Local document context
- Adaptive response generation
- Dynamic context window management

### Search and Retrieval
- Semantic similarity search
- Context-aware responses
- Multi-modal content linking
- Knowledge base building
- Cross-reference across different media types
- Temporal context preservation

## 📦 Dependencies

### Core Dependencies
- React 18.x
- Express 4.x
- TypeScript 5.x
- n8n (latest)
- Tailwind CSS

### AI Services
- Google Gemini API
- OpenAI API
- Pinecone API
- SerpAPI

## 🌐 System Requirements

- Node.js 18+
- npm/yarn
- Sufficient storage for file processing
- Internet connection for AI services
- n8n workflow engine
- Vector database service (Pinecone)

## � Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Himanshu-Lohokane/dynamic-task-automator-pro.git
cd dynamic-task-automator-pro

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start development server
npm run dev
```

### Required API Keys
- Google Gemini API key
- OpenAI API key
- Pinecone API key and environment
- SerpAPI key
- n8n setup and configuration

## �🔍 Monitoring

- Request logging
- Processing status tracking
- Error reporting
- Performance metrics
- Vector database health monitoring
- Workflow execution tracking

## 📈 Scalability

### Horizontal Scaling
- Stateless server architecture
- Distributed file processing
- Load balancing support
- Session management across instances

### Storage Scaling
- Configurable storage backends
- Chunked file processing
- Streaming support for large files
- Efficient vector storage management

## 🤝 Contributing

Contributions are welcome! Please check our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Code style
- Development process
- Pull request process
- Bug reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This project is designed to be both modular and scalable, with clear separation of concerns and extensive use of modern web technologies and AI services. Each component is built to work independently while maintaining seamless integration with the entire system.
