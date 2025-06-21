# Worksheeter

A microservices-based platform for generating and managing educational worksheets and quizzes using AI.

## Architecture

This project follows a microservices architecture with the following services:

### Core Services

- **Auth Service** (`auth/`) - User authentication and authorization
- **Worksheets Service** (`worksheets/`) - Worksheet management and CRUD operations
- **Quizzes Service** (`quizzes/`) - Quiz management and generation
- **AI Processor Service** (`ai-processor/`) - AI-powered content generation
- **Client** (`client/`) - Next.js frontend application

### Shared Components

- **Common Package** (`common/`) - Shared utilities, events, and middleware (published as npm package)

### Infrastructure

- **Kubernetes** (`infra/k8s/`) - Deployment configurations
- **Skaffold** (`skaffold.yaml`) - Development workflow automation

## Technology Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Frontend**: Next.js, React
- **Database**: MongoDB
- **Message Broker**: NATS
- **AI**: Claude API
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Development**: Skaffold

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker
- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- Skaffold CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd worksheeter
   ```

2. **Install dependencies for all services**
   ```bash
   # Install common package dependencies
   cd common && npm install && cd ..
   
   # Install service dependencies
   cd auth && npm install && cd ..
   cd worksheets && npm install && cd ..
   cd quizzes && npm install && cd ..
   cd ai-processor && npm install && cd ..
   cd client && npm install && cd ..
   ```

3. **Set up environment variables**
   Create `.env` files in each service directory with required environment variables.

4. **Start the development environment**
   ```bash
   skaffold dev
   ```

### Development

- **Local Development**: Each service can be run independently using `npm run dev`
- **Kubernetes Development**: Use `skaffold dev` for full-stack development
- **Production Deployment**: Use `skaffold run` for production deployment

## Service Communication

Services communicate through:
- **HTTP APIs** for synchronous requests
- **NATS Events** for asynchronous communication
- **Shared npm package** for common utilities and types

## Project Structure

```
worksheeter/
├── auth/                 # Authentication service
├── worksheets/           # Worksheet management service
├── quizzes/             # Quiz management service
├── ai-processor/        # AI content generation service
├── client/              # Next.js frontend
├── common/              # Shared utilities (npm package)
├── infra/
│   └── k8s/            # Kubernetes manifests
└── skaffold.yaml       # Skaffold configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Your License Here] 