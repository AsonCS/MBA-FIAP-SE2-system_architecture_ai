# 🚀 Quick Start Guide - AutoFix Development Environment

## Início Rápido (3 passos)

### 1. Subir todos os serviços

```bash
cd autofix-monorepo
make up
```

Ou usando docker-compose diretamente:

```bash
docker-compose up -d
```

### 2. Verificar se tudo está rodando

```bash
make ps
```

Você deve ver todos os serviços com status "Up" e "healthy".

### 3. Acessar os serviços

- **Web Portal**: http://localhost:3005
- **API Gateway**: http://localhost:3000
- **API Docs (Swagger)**: http://localhost:3000/api

## 📊 Comandos Úteis

```bash
# Ver logs de todos os serviços
make logs

# Ver logs de um serviço específico
make logs-auth
make logs-inventory
make logs-work-order
make logs-notification
make logs-web

# Parar todos os serviços
make down

# Reiniciar um serviço específico
make restart-auth

# Acessar shell de um container
make shell-auth

# Ver status dos serviços
make ps

# Ver uso de recursos
make stats
```

## 🗄️ Acessar Banco de Dados

```bash
# Via Makefile
make db-shell

# Ou diretamente
docker-compose exec postgres psql -U autofix -d autofix
```

## 🔧 Troubleshooting

### Serviços não iniciam?

```bash
# Limpar tudo e recomeçar
make clean
make up
```

### Ver logs de erro?

```bash
make logs
```

### Kafka demorando para iniciar?

É normal! Kafka pode levar 30-60 segundos para ficar pronto. Aguarde até que o healthcheck esteja OK.

## 📚 Documentação Completa

Para mais detalhes, consulte [DOCKER-README.md](./DOCKER-README.md)

## 🎯 Estrutura de Portas

| Serviço | Porta |
|---------|-------|
| Web Portal | 3005 |
| API Gateway | 3000 |
| Auth Service | 3001 |
| Inventory Service | 3002 |
| Work Order Service | 3003 |
| Notification Service | 3004 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Kafka | 9092, 29092 |

## ⚡ Dicas de Produtividade

1. **Use o Makefile**: Todos os comandos comuns estão no Makefile
2. **Hot Reload**: Alterações no código são refletidas automaticamente
3. **Logs Focados**: Use `make logs-<service>` para ver logs de um serviço específico
4. **Health Checks**: Use `make health` para verificar se todos os serviços estão respondendo

## 🆘 Precisa de Ajuda?

```bash
# Ver todos os comandos disponíveis
make help
```
