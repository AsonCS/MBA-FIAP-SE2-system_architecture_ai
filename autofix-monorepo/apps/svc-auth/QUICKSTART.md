# Quick Start Guide - svc-auth

## 🚀 Início Rápido (5 minutos)

### 1. Configurar Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Instalar dependências (se ainda não instalou)
npm install
```

### 2. Iniciar Infraestrutura

```bash
# Subir PostgreSQL, Redis e Kafka
npm run docker:up

# Verificar se os containers estão rodando
docker ps
```

### 3. Executar o Serviço

```bash
# Modo desenvolvimento (com hot reload)
npm run start:dev
```

O serviço estará disponível em: `http://localhost:3000`

### 4. Testar a API

#### Registrar uma Oficina

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Oficina Teste",
    "cnpj": "12345678901234",
    "ownerName": "João Silva",
    "ownerEmail": "joao@teste.com",
    "ownerPassword": "senha12345"
  }'
```

#### Fazer Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@teste.com",
    "password": "senha12345"
  }'
```

Você receberá um `accessToken` e `refreshToken`.

#### Renovar Token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "SEU_REFRESH_TOKEN_AQUI"
  }'
```

#### Fazer Logout

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

## 🔧 Comandos Úteis

```bash
# Build para produção
npm run build

# Executar em produção
npm run start:prod

# Parar containers
npm run docker:down

# Ver logs do serviço
# (se rodando em background)
docker logs svc-auth-postgres
docker logs svc-auth-redis
docker logs svc-auth-kafka
```

## 📝 Variáveis de Ambiente Importantes

```env
# Porta do serviço
PORT=3000

# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=auth_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BROKER=localhost:9092

# JWT (MUDE EM PRODUÇÃO!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 🐛 Troubleshooting

### Erro de conexão com PostgreSQL
```bash
# Verificar se o container está rodando
docker ps | grep postgres

# Reiniciar o container
docker restart svc-auth-postgres
```

### Erro de conexão com Redis
```bash
# Verificar se o container está rodando
docker ps | grep redis

# Reiniciar o container
docker restart svc-auth-redis
```

### Erro de conexão com Kafka
```bash
# Kafka precisa do Zookeeper
docker ps | grep kafka
docker ps | grep zookeeper

# Reiniciar ambos
docker restart svc-auth-zookeeper
docker restart svc-auth-kafka
```

### Limpar tudo e recomeçar
```bash
# Parar e remover containers
npm run docker:down

# Remover volumes (CUIDADO: apaga dados!)
docker volume rm svc-auth_postgres_data
docker volume rm svc-auth_redis_data

# Subir novamente
npm run docker:up
```

## 📚 Próximos Passos

1. Explorar o código em `src/core/domain` para entender as regras de negócio
2. Revisar os Use Cases em `src/core/application`
3. Estudar a implementação dos adapters em `src/infra`
4. Adicionar novos casos de uso conforme necessário
5. Implementar testes unitários

## 🎯 Estrutura de Pastas Importante

```
src/
├── core/                    # Lógica de negócio pura
│   ├── domain/             # Entidades, VOs, Events
│   ├── ports/              # Interfaces
│   └── application/        # Use Cases
└── infra/                  # Implementações técnicas
    ├── database/           # TypeORM
    ├── cryptography/       # Bcrypt, JWT
    ├── cache/              # Redis
    ├── messaging/          # Kafka
    └── api/                # Controllers, DTOs
```

## ✅ Checklist de Validação

- [ ] Containers Docker rodando (postgres, redis, kafka, zookeeper)
- [ ] Serviço iniciado sem erros
- [ ] Endpoint `/auth/register` funcionando
- [ ] Endpoint `/auth/login` retornando tokens
- [ ] Endpoint `/auth/refresh` renovando tokens
- [ ] Endpoint `/auth/logout` revogando tokens

---

**Dúvidas?** Consulte o `README.md` para documentação completa.
