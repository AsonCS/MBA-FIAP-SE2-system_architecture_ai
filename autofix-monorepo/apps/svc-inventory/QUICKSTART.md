# Quick Start Guide - svc-inventory

## 1. Setup

```bash
# Navigate to service directory
cd autofix-monorepo/apps/svc-inventory

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## 2. Configure Environment

Edit `.env` file with your local settings:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=inventory

REDIS_HOST=localhost
REDIS_PORT=6379

KAFKA_BROKERS=localhost:9092
```

## 3. Start Dependencies

### Using Docker Compose (Recommended)

```bash
# From monorepo root
docker-compose up -d postgres redis kafka
```

### Manual Setup

**PostgreSQL:**
```bash
createdb inventory
```

**Redis:**
```bash
redis-server
```

**Kafka:**
```bash
# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka
bin/kafka-server-start.sh config/server.properties
```

## 4. Run Migrations

```bash
npm run typeorm migration:run
```

## 5. Start Service

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 6. Verify Installation

Open your browser:
- API Documentation: http://localhost:3002/api/docs
- Health Check: http://localhost:3002/health

## 7. Test API

### Create a Product

```bash
curl -X POST http://localhost:3002/inventory/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "OIL-FIL-001",
    "name": "Oil Filter Premium",
    "description": "High-quality oil filter",
    "category": "Filters",
    "initialStock": 100,
    "minStockLevel": 10,
    "cost": 25.50,
    "sellingPrice": 45.00,
    "currency": "BRL"
  }'
```

### Check Availability

```bash
curl http://localhost:3002/inventory/products/OIL-FIL-001/availability
```

### Reserve Stock

```bash
curl -X POST http://localhost:3002/inventory/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "OIL-FIL-001",
    "quantity": 5,
    "workOrderId": "WO-2024-001"
  }'
```

## 8. Development Workflow

### Watch Mode
```bash
npm run start:dev
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`

### Redis Connection Error
- Verify Redis is running: `redis-cli ping`
- Should return `PONG`

### Kafka Connection Error
- Check Kafka is running: `kafka-topics.sh --list --bootstrap-server localhost:9092`

## Next Steps

1. Review the [Architecture Documentation](./docs/architecture.md)
2. Understand [Business Rules](./docs/business-rules.md)
3. Explore the [API Documentation](http://localhost:3002/api/docs)
