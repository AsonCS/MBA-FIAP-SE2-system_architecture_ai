# API Gateway

API Gateway (BFF - Backend for Frontend) for AutoFix SaaS system.

## Description

This is the main entry point for all client requests. It aggregates data from multiple microservices and provides a unified REST API.

## Architecture

- **Clean Architecture**: Separation of concerns with ports, use cases, and adapters
- **TDD**: Test-driven development approach
- **Swagger**: Automatic API documentation

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
SVC_AUTH_URL=http://localhost:3001
SVC_WORK_ORDER_URL=http://localhost:3002
SVC_CUSTOMER_URL=http://localhost:3003
SVC_INVENTORY_URL=http://localhost:3004
```

## Endpoints

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard overview

### Work Orders
- `POST /api/v1/work-orders` - Create new work order
- `GET /api/v1/work-orders` - List work orders
- `PATCH /api/v1/work-orders/:id/status` - Update status

### Customers & Vehicles
- `GET /api/v1/customers` - List customers
- `POST /api/v1/customers` - Create customer
- `POST /api/v1/customers/:id/vehicles` - Add vehicle
- `GET /api/v1/vehicles/:placa` - Get vehicle by plate

### Inventory
- `GET /api/v1/products` - List products
- `POST /api/v1/products/movement` - Register stock movement

## Multi-tenant Support

All requests must include the `x-tenant-id` header to identify the tenant (workshop).
