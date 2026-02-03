# AutoFix SaaS - Sistema de Gestão para Oficinas Mecânicas

![AutoFix Status](https://img.shields.io/badge/status-em_desenvolvimento-orange?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

## 📋 Visão Geral
Este projeto é um sistema SaaS multi-tenant projetado para gerenciar oficinas mecânicas. A arquitetura é baseada em **Microserviços**, utilizando um **Monorepositório** em **TypeScript** para garantir tipagem forte e compartilhamento eficiente de código entre frontend e backend.

## 🛠 Tecnologias Utilizadas

### Core & Linguagem
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

### Frontend (Web & Mobile)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend (Microserviços & API)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

### DevOps & Infraestrutura
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)

---

## 🏗 Detalhes da Stack

* **Linguagem Principal:** **TypeScript** com **Node.js**. Utilizado em todo o monorepo para garantir consistência e facilitar a reutilização de DTOs e Interfaces.
* **Frontend:** **Next.js**.
    * Utiliza **SSG (Static Site Generation)** para páginas públicas (Landing Page, Documentação, Catálogo Público) visando alta performance e SEO.
    * Utiliza recursos híbridos para o Dashboard administrativo do SaaS.
* **Backend:** **NestJS**.
    * Framework progressivo para construção de microserviços escaláveis e eficientes.
    * Módulos independentes para cada domínio (Auth, Oficina, Estoque).
* **Mensageria:** **Apache Kafka**.
    * Responsável pela comunicação assíncrona entre os microserviços (Event-Driven Architecture).
    * Garante desacoplamento e resiliência (ex: processamento de pagamentos, baixa de estoque, notificações).

---

## 📂 Estrutura do Monorepositório

A estrutura é organizada para suportar múltiplos aplicativos e bibliotecas compartilhadas:

```text
/autofix-monorepo
├── /apps
│   ├── /web-portal            # Frontend Next.js (SSG + Dashboard)
│   ├── /api-gateway           # NestJS (Proxy reverso / BFF)
│   ├── /svc-auth              # Microserviço NestJS: Identidade
│   ├── /svc-work-order        # Microserviço NestJS: Ordens de Serviço
│   ├── /svc-inventory         # Microserviço NestJS: Estoque
│   └── /svc-notification      # Microserviço NestJS: Consumidor Kafka
├── /libs
│   ├── /shared-dtos           # Interfaces TypeScript compartilhadas
│   ├── /ui-kit                # Componentes React reutilizáveis
│   └── /kafka-client          # Configuração padrão do Kafka
├── /infra
│   ├── /docker                # Docker Compose para desenvolvimento local
│   └── /k8s                   # Helm charts / Manifestos
├── package.json
├── nest-cli.json
└── tsconfig.base.json
