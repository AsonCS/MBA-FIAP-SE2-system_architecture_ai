.PHONY: help up down restart logs ps build clean rebuild test

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)AutoFix Monorepo - Docker Compose Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

up: ## Start all services
	@echo "$(BLUE)Starting all services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)All services started!$(NC)"
	@echo "$(YELLOW)Run 'make logs' to see logs$(NC)"

down: ## Stop all services
	@echo "$(BLUE)Stopping all services...$(NC)"
	docker-compose down
	@echo "$(GREEN)All services stopped!$(NC)"

restart: ## Restart all services
	@echo "$(BLUE)Restarting all services...$(NC)"
	docker-compose restart
	@echo "$(GREEN)All services restarted!$(NC)"

logs: ## Show logs from all services
	docker-compose logs -f

logs-api: ## Show logs from API Gateway
	docker-compose logs -f api-gateway

logs-auth: ## Show logs from Auth Service
	docker-compose logs -f svc-auth

logs-inventory: ## Show logs from Inventory Service
	docker-compose logs -f svc-inventory

logs-work-order: ## Show logs from Work Order Service
	docker-compose logs -f svc-work-order

logs-notification: ## Show logs from Notification Service
	docker-compose logs -f svc-notification

logs-web: ## Show logs from Web Portal
	docker-compose logs -f web-portal

ps: ## Show status of all services
	docker-compose ps

build: ## Build all services
	@echo "$(BLUE)Building all services...$(NC)"
	docker-compose build
	@echo "$(GREEN)Build complete!$(NC)"

clean: ## Stop services and remove volumes
	@echo "$(RED)Stopping services and removing volumes...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)Cleanup complete!$(NC)"

rebuild: clean build up ## Clean, rebuild and start all services
	@echo "$(GREEN)Rebuild complete!$(NC)"

# Infrastructure services
infra-up: ## Start only infrastructure services (postgres, redis, kafka)
	@echo "$(BLUE)Starting infrastructure services...$(NC)"
	docker-compose up -d postgres redis zookeeper kafka
	@echo "$(GREEN)Infrastructure services started!$(NC)"

infra-down: ## Stop only infrastructure services
	@echo "$(BLUE)Stopping infrastructure services...$(NC)"
	docker-compose stop postgres redis zookeeper kafka
	@echo "$(GREEN)Infrastructure services stopped!$(NC)"

# Database commands
db-shell: ## Access PostgreSQL shell
	docker-compose exec postgres psql -U autofix -d autofix

db-migrate: ## Run database migrations (placeholder)
	@echo "$(YELLOW)Database migration commands should be implemented per service$(NC)"

# Redis commands
redis-shell: ## Access Redis CLI
	docker-compose exec redis redis-cli

redis-flush: ## Flush all Redis data
	@echo "$(RED)Flushing Redis data...$(NC)"
	docker-compose exec redis redis-cli FLUSHALL
	@echo "$(GREEN)Redis flushed!$(NC)"

# Kafka commands
kafka-topics: ## List Kafka topics
	docker-compose exec kafka kafka-topics --list --bootstrap-server localhost:9092

kafka-create-topic: ## Create a Kafka topic (usage: make kafka-create-topic TOPIC=my-topic)
	@if [ -z "$(TOPIC)" ]; then \
		echo "$(RED)Error: TOPIC is required. Usage: make kafka-create-topic TOPIC=my-topic$(NC)"; \
		exit 1; \
	fi
	docker-compose exec kafka kafka-topics --create --topic $(TOPIC) --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# Service-specific commands
restart-api: ## Restart API Gateway
	docker-compose restart api-gateway

restart-auth: ## Restart Auth Service
	docker-compose restart svc-auth

restart-inventory: ## Restart Inventory Service
	docker-compose restart svc-inventory

restart-work-order: ## Restart Work Order Service
	docker-compose restart svc-work-order

restart-notification: ## Restart Notification Service
	docker-compose restart svc-notification

restart-web: ## Restart Web Portal
	docker-compose restart web-portal

# Development helpers
shell-api: ## Access API Gateway container shell
	docker-compose exec api-gateway sh

shell-auth: ## Access Auth Service container shell
	docker-compose exec svc-auth sh

shell-inventory: ## Access Inventory Service container shell
	docker-compose exec svc-inventory sh

shell-work-order: ## Access Work Order Service container shell
	docker-compose exec svc-work-order sh

shell-notification: ## Access Notification Service container shell
	docker-compose exec svc-notification sh

shell-web: ## Access Web Portal container shell
	docker-compose exec web-portal sh

# Testing
test: ## Run tests in all services (placeholder)
	@echo "$(YELLOW)Running tests...$(NC)"
	@echo "$(BLUE)Auth Service:$(NC)"
	docker-compose exec svc-auth npm test || true
	@echo "$(BLUE)Inventory Service:$(NC)"
	docker-compose exec svc-inventory npm test || true
	@echo "$(BLUE)Work Order Service:$(NC)"
	docker-compose exec svc-work-order npm test || true
	@echo "$(BLUE)Notification Service:$(NC)"
	docker-compose exec svc-notification npm test || true

# Health checks
health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo "$(GREEN)API Gateway:$(NC)"
	@curl -s http://localhost:3000/health || echo "$(RED)Not responding$(NC)"
	@echo ""
	@echo "$(GREEN)Auth Service:$(NC)"
	@curl -s http://localhost:3001/health || echo "$(RED)Not responding$(NC)"
	@echo ""
	@echo "$(GREEN)Inventory Service:$(NC)"
	@curl -s http://localhost:3002/health || echo "$(RED)Not responding$(NC)"
	@echo ""
	@echo "$(GREEN)Work Order Service:$(NC)"
	@curl -s http://localhost:3003/health || echo "$(RED)Not responding$(NC)"
	@echo ""
	@echo "$(GREEN)Notification Service:$(NC)"
	@curl -s http://localhost:3004/health || echo "$(RED)Not responding$(NC)"
	@echo ""

# Monitoring
stats: ## Show Docker stats for all containers
	docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
