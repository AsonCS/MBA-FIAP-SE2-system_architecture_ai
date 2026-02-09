# svc-inventory

Inventory management microservice for the AutoFix SaaS platform.

## Overview

The `svc-inventory` service is responsible for:
- **Stock Management**: Track product availability, reservations, and consumption
- **Optimistic Locking**: Prevent race conditions during concurrent stock updates
- **Event-Driven Integration**: React to work order events (approved, completed)
- **Audit Trail (Kardex)**: Maintain immutable history of all stock movements
- **Cache-Aside Pattern**: High-performance reads using Redis

## Architecture

This service follows **Clean Architecture** and **CQRS** patterns:

```
/src
├── /core
│   ├── /domain          # Business logic (Aggregates, VOs, Events)
│   ├── /ports           # Interfaces for external dependencies
│   └── /application     # Use cases (Commands & Queries)
└── /infra
    ├── /database        # TypeORM repositories
    ├── /cache           # Redis implementation
    ├── /messaging       # Kafka consumers/producers
    └── /api             # REST controllers
```

## Key Features

### 1. Optimistic Locking
Uses version-based concurrency control to handle simultaneous stock updates:
```typescript
await productRepository.save(product, expectedVersion);
```

### 2. Domain Events
Publishes events for:
- `LowStockDetected`: When stock falls below minimum level
- `PriceChanged`: When product price is updated
- `StockAdjusted`: For manual corrections

### 3. Event Handlers
Consumes events from other services:
- `WorkOrder.Approved` → Reserve stock
- `WorkOrder.Completed` → Consume stock

### 4. Idempotency
All event handlers implement idempotency checks to prevent duplicate processing.

## API Endpoints

### Products
- `POST /inventory/products` - Create new product
- `GET /inventory/products/:sku/availability` - Get product availability
- `GET /inventory/products/:sku/ledger` - Get stock movement history

### Stock Operations
- `POST /inventory/adjust` - Manual stock adjustment
- `POST /inventory/reserve` - Reserve stock for work order
- `POST /inventory/consume` - Confirm stock consumption

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Kafka 3+

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run database migrations
npm run typeorm migration:run

# Start development server
npm run start:dev
```

### Environment Variables

See `.env.example` for required configuration.

### Docker

```bash
# Build image
docker build -t svc-inventory .

# Run container
docker run -p 3002:3002 --env-file .env svc-inventory
```

## Testing

```bash
# Unit tests
npm test

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Database Schema

### Products Table
- Stores product information with version column for optimistic locking
- Tracks available and reserved stock separately
- Maintains average cost and selling price

### Stock Movements Table
- Immutable audit log (Kardex)
- Records all stock changes with type, reason, and reference
- Indexed by SKU and creation date for efficient queries

## Business Rules

1. **Stock Integrity**: Available stock can never be negative
2. **Reservation Flow**: Stock must be reserved before consumption
3. **Immutability**: Stock movements cannot be edited or deleted
4. **Concurrency**: Uses optimistic locking with automatic retry

## Integration

### Kafka Topics

**Consumes:**
- `work-order.events` (WorkOrder.Approved, WorkOrder.Completed)

**Produces:**
- `inventory.events` (LowStockDetected, PriceChanged, StockAdjusted)

### Redis Cache

Cache keys follow the pattern: `product:{SKU}`

TTL: 1 hour (3600 seconds)

## Monitoring

- Swagger documentation: `http://localhost:3002/api/docs`
- Health check endpoint: `http://localhost:3002/health`

## License

Proprietary - AutoFix SaaS Platform
