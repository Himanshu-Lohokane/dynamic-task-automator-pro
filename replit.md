# Overview

This is a React-based chat application that integrates with n8n automation workflows. The application provides a conversational interface where users can interact with an AI assistant that can perform actions like sending emails through Gmail and creating Google Calendar events via n8n webhooks. The system is built with a modern full-stack architecture using React for the frontend, Express.js for the backend, and PostgreSQL with Drizzle ORM for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Components**: Comprehensive shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints with `/api` prefix for clear separation
- **Request Handling**: Express middleware for JSON parsing, URL encoding, and request logging
- **Error Handling**: Centralized error middleware with proper status codes and JSON responses
- **Development Tools**: Hot reloading with tsx for seamless development experience

## Data Storage
- **Database**: PostgreSQL configured through Neon serverless platform
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema Management**: Drizzle Kit for migrations and database schema evolution
- **Connection**: Environment-based configuration with connection pooling
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

## Chat Integration
- **n8n Webhooks**: Direct integration with n8n automation platform for AI responses
- **Dual Connection Strategy**: Primary direct webhook connection with backend proxy fallback for CORS handling
- **Message Flow**: Real-time chat interface with proper loading states and error handling
- **Response Parsing**: Flexible response format handling supporting multiple n8n output structures

## External Dependencies

- **n8n Platform**: Automation workflow engine for AI processing and third-party integrations
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **Radix UI**: Headless component primitives for accessible UI components
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Vite**: Build tool with hot module replacement for development
- **TanStack Query**: Data fetching and caching library for API state management
- **Zod**: TypeScript-first schema validation for runtime type safety
- **React Hook Form**: Performant forms library with minimal re-renders
- **Lucide React**: Icon library with consistent design system
- **Date-fns**: Modern date utility library for time formatting