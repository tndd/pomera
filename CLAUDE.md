# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a microservices architecture called "Pomera" with the following components:

- **firecrawl/**: Web scraping service (submodule) - TypeScript/Node.js API with worker processes
- **store/**: Data storage service in Rust - handles scraping and mapping operations
- **store_go/**: Alternative Go implementation of storage service
- **analytics/**: Python service for data analysis
- **mock/crawled_server/**: Next.js mock server for testing crawled content

## Development Commands

### Main Services (Docker Compose)
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up <service-name>

# Available services: redis, playwright-service, firecrawl-api, firecrawl-worker, store, analytics
```

### Using Tilt (Kubernetes Development)
```bash
# Start development environment
tilt up
```

### Firecrawl API (TypeScript)
```bash
cd firecrawl/apps/api

# Development
pnpm run start:dev

# Production
pnpm run start:production

# Workers
pnpm run workers

# Tests
pnpm run test
pnpm run test:snips
pnpm run test:local-no-auth

# Build
pnpm run build
```

### Store Service (Rust)
```bash
cd store

# Run
cargo run

# Build
cargo build --release
```

### Store Service (Go)
```bash
cd store_go

# Run
go run main.go

# Build
go build
```

### Mock Server (Next.js)
```bash
cd mock/crawled_server

# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## Service Communication

- **Firecrawl API**: Port 3002 (configurable via PORT env var)
- **Playwright Service**: Port 3000
- **Redis**: Port 6379
- **Mock Server**: Next.js default port (3000)

Services communicate via the `pomera-net-v1` Docker network.

## Key Environment Variables

- `REDIS_URL`: Redis connection string
- `PLAYWRIGHT_MICROSERVICE_URL`: Playwright service endpoint
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `FIRECRAWL_API_KEY`: For accessing Firecrawl services (use "FC_DUMMY_API_KEY" for local dev)

## Testing

The project includes comprehensive test suites:

- **E2E Tests**: `firecrawl/apps/api/src/__tests__/e2e_*`
- **Unit Tests**: `firecrawl/apps/api/src/__tests__/snips/`
- **Integration Tests**: Queue concurrency and deep research tests

## Data Flow

1. **Store services** use Firecrawl to scrape and map web content
2. **Analytics service** processes scraped data
3. **Mock server** provides test data for development
4. All services use **Redis** for caching and job queuing

The Rust store service focuses on scraping and mapping URLs (particularly Yahoo News), while the Go version provides an alternative implementation with similar functionality.