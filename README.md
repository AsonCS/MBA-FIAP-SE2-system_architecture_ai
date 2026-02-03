# AutoFix SaaS - Sistema de Gestão para Oficinas Mecânicas

## 📋 Visão Geral
Este projeto é um sistema SaaS (Software as a Service) multi-tenant projetado para gerenciar oficinas mecânicas. A arquitetura é baseada em **Microserviços**, utilizando um **Monorepositório** para facilitar o compartilhamento de código e a padronização.

## 🛠 Tecnologias Sugeridas
* **Frontend:** Single Page Application (React, Vue ou Angular).
* **Backend (Serviços):** Node.js (NestJS), Java (Spring Boot) ou Go.
* **API Gateway:** Kong ou Nginx.
* **Banco de Dados:** PostgreSQL (Relacional para dados críticos) e Redis (Cache).
* **Mensageria:** RabbitMQ ou Kafka (para comunicação assíncrona entre serviços).
* **Infraestrutura:** Docker, Kubernetes.

## 📂 Estrutura do Monorepositório
A estrutura de pastas segue o padrão de isolamento de aplicações e bibliotecas compartilhadas.

```text
/autofix-monorepo
├── /apps
│   ├── /frontend-web          # Aplicação Web para Desktop
│   ├── /frontend-mobile       # App para mecânicos (opcional)
│   ├── /api-gateway           # Ponto de entrada único
│   ├── /svc-auth              # Serviço de Identidade e Acesso
│   ├── /svc-customer-vehicle  # Serviço de Clientes e Veículos
│   ├── /svc-work-order        # Serviço de Ordens de Serviço (Core)
│   └── /svc-inventory         # Serviço de Estoque e Peças
├── /libs
│   ├── /common                # DTOs, Enums, Utils compartilhados
│   ├── /database-client       # Configurações de conexão DB
│   └── /ui-components         # Biblioteca de componentes visuais
├── /infra
│   ├── /k8s                   # Manifestos Kubernetes
│   └── /terraform             # IaC
├── docker-compose.yml
└── package.json (ou pom.xml/build.gradle)
