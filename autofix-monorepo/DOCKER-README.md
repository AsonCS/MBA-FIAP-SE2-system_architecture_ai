# AutoFix Monorepo - Docker Compose Development Environment

Este repositório contém a configuração Docker Compose para executar todos os microserviços do AutoFix em ambiente de desenvolvimento.

## 📋 Pré-requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Pelo menos 8GB de RAM disponível
- Portas disponíveis: 3000-3005, 5432, 6379, 9092, 2181, 29092

## 🏗️ Arquitetura

O ambiente de desenvolvimento inclui:

### Serviços de Infraestrutura
- **PostgreSQL** (porta 5432): Banco de dados relacional
- **Redis** (porta 6379): Cache e sessões
- **Kafka + Zookeeper** (portas 9092, 29092, 2181): Message broker para eventos

### Microserviços
- **API Gateway** (porta 3000): Gateway de API REST
- **Auth Service** (porta 3001): Autenticação e autorização
- **Inventory Service** (porta 3002): Gerenciamento de inventário
- **Work Order Service** (porta 3003): Gerenciamento de ordens de serviço
- **Notification Service** (porta 3004): Notificações (email, SMS, push)
- **Web Portal** (porta 3005): Interface web Next.js

## 🚀 Como Usar

### 1. Iniciar todos os serviços

```bash
cd autofix-monorepo
docker-compose up -d
```

### 2. Verificar status dos serviços

```bash
docker-compose ps
```

### 3. Ver logs de um serviço específico

```bash
# Ver logs do API Gateway
docker-compose logs -f api-gateway

# Ver logs de todos os serviços
docker-compose logs -f
```

### 4. Parar todos os serviços

```bash
docker-compose down
```

### 5. Parar e remover volumes (limpar dados)

```bash
docker-compose down -v
```

## 🔧 Desenvolvimento

### Hot Reload

Todos os serviços estão configurados com hot reload. Alterações no código serão refletidas automaticamente sem necessidade de rebuild.

### Acessar um container

```bash
# Acessar o container do Auth Service
docker-compose exec svc-auth sh

# Executar comandos npm
docker-compose exec svc-auth npm run test
```

### Rebuild de um serviço específico

```bash
docker-compose up -d --build api-gateway
```

### Rebuild de todos os serviços

```bash
docker-compose up -d --build
```

## 🌐 URLs dos Serviços

- **API Gateway**: http://localhost:3000
  - Swagger: http://localhost:3000/api
- **Auth Service**: http://localhost:3001
- **Inventory Service**: http://localhost:3002
- **Work Order Service**: http://localhost:3003
- **Notification Service**: http://localhost:3004
- **Web Portal**: http://localhost:3005

## 🗄️ Banco de Dados

### Conectar ao PostgreSQL

```bash
# Via Docker
docker-compose exec postgres psql -U autofix -d autofix

# Via cliente local
psql -h localhost -p 5432 -U autofix -d autofix
```

**Senha**: `autofix123`

### Schemas

O banco de dados possui schemas separados para cada serviço:
- `auth`: Tabelas do Auth Service
- `inventory`: Tabelas do Inventory Service
- `work_order`: Tabelas do Work Order Service
- `notification`: Tabelas do Notification Service

## 📊 Monitoramento

### Kafka

Acessar tópicos do Kafka:

```bash
# Listar tópicos
docker-compose exec kafka kafka-topics --list --bootstrap-server localhost:9092

# Ver mensagens de um tópico
docker-compose exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic work-order-events \
  --from-beginning
```

### Redis

```bash
# Acessar Redis CLI
docker-compose exec redis redis-cli

# Ver todas as chaves
docker-compose exec redis redis-cli KEYS '*'
```

## 🐛 Troubleshooting

### Serviços não iniciam

1. Verificar se as portas estão disponíveis:
```bash
lsof -i :3000-3005
lsof -i :5432
lsof -i :6379
lsof -i :9092
```

2. Verificar logs de erro:
```bash
docker-compose logs
```

3. Limpar e reiniciar:
```bash
docker-compose down -v
docker-compose up -d --build
```

### Problemas com Kafka

Kafka pode demorar alguns segundos para inicializar. Aguarde até que o healthcheck esteja OK:

```bash
docker-compose ps kafka
```

### Problemas de memória

Se os containers estão sendo mortos por falta de memória:

1. Aumentar memória disponível para Docker
2. Iniciar serviços gradualmente:
```bash
# Primeiro a infraestrutura
docker-compose up -d postgres redis zookeeper kafka

# Depois os serviços
docker-compose up -d svc-auth svc-inventory svc-work-order svc-notification

# Por último o gateway e web portal
docker-compose up -d api-gateway web-portal
```

## 📝 Variáveis de Ambiente

As variáveis de ambiente estão definidas diretamente no `docker-compose.yaml` para facilitar o desenvolvimento. Para produção, use arquivos `.env` ou secrets management.

Veja `.env.example` para referência de todas as variáveis disponíveis.

## 🔐 Segurança

⚠️ **IMPORTANTE**: As credenciais neste arquivo são apenas para desenvolvimento local. **NUNCA** use estas credenciais em produção!

Para produção:
- Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Gere senhas fortes e únicas
- Use certificados SSL/TLS
- Configure firewalls e network policies

## 📚 Documentação Adicional

- [Guia de Implementação - Auth Service](./apps/svc-auth/.ai/01_impl.md)
- [Guia de Implementação - Inventory Service](./apps/svc-inventory/.ai/01_impl.md)
- [Guia de Implementação - Work Order Service](./apps/svc-work-order/.ai/01_impl.md)
- [Guia de Implementação - Notification Service](./apps/svc-notification/.ai/01_impl.md)
- [Guia de Implementação - Web Portal](./apps/web-portal/.ai/01_impl.md)

## 🤝 Contribuindo

1. Faça suas alterações
2. Teste localmente com `docker-compose up`
3. Verifique os logs para erros
4. Commit e push

## 📄 Licença

Proprietary - AutoFix SaaS System
