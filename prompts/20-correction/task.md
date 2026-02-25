# Task: Corrigir Problemas Identificados — web-portal [CONCLUÍDO]

## Instalação MUI
- [x] Instalar `@mui/material`, `@emotion/react`, `@emotion/styled` e `@mui/icons-material`

## Passo 1 — Dados Hard-coded
- [x] [useLoginController.ts](file:///home/node/app/src/presentation/hooks/useLoginController.ts): limpar campos iniciais (credenciais de teste removidas)
- [x] [useRegisterController.ts](file:///home/node/app/src/presentation/hooks/useRegisterController.ts): limpar todos os campos iniciais para `''`

## Passo 2 — 'use client' desnecessário
- [x] Remover `'use client'` de [useLoginController.ts](file:///home/node/app/src/presentation/hooks/useLoginController.ts)
- [x] Remover `'use client'` de [useRegisterController.ts](file:///home/node/app/src/presentation/hooks/useRegisterController.ts)

## Passo 3 — Criar RegisterUseCase (Core Layer)
- [x] Criar [src/core/use-cases/RegisterUseCase.ts](file:///home/node/app/src/core/use-cases/RegisterUseCase.ts) usando CNPJ e Email VOs

## Passo 4 — Refatorar useRegisterController para usar RegisterUseCase via AuthContext
- [x] Adicionar [register()](file:///home/node/app/src/core/repositories/IAuthRepository.ts#43-49) ao [AuthContext](file:///home/node/app/src/presentation/contexts/AuthContext.tsx#22-31)
- [x] Atualizar [useRegisterController.ts](file:///home/node/app/src/presentation/hooks/useRegisterController.ts) para usar [useAuth().register()](file:///home/node/app/src/presentation/contexts/AuthContext.tsx#161-173)
- [x] Remover instanciação direta de [AuthRepository](file:///home/node/app/src/infra/repositories/AuthRepository.ts#22-226)/`createHttpClient`
- [x] Remover validação de CNPJ e email duplicada (delegada ao UseCase)

## Passo 5 — Corrigir AuthContext (instâncias recriadas)
- [x] Envolver dependências com `useMemo` em [AuthContext.tsx](file:///home/node/app/src/presentation/contexts/AuthContext.tsx)

## Passo 6 — Extrair componente AutoFixLogo
- [x] Criar [src/design-system/atoms/AutoFixLogo.tsx](file:///home/node/app/src/design-system/atoms/AutoFixLogo.tsx)
- [x] Substituir SVG duplicado em [login/page.tsx](file:///home/node/app/src/app/login/page.tsx)
- [x] Substituir SVG duplicado em [register/page.tsx](file:///home/node/app/src/app/register/page.tsx)

## Passo 7 — Fonte: usar next/font
- [x] Remover `<link>` manual de [layout.tsx](file:///home/node/app/src/app/layout.tsx)
- [x] Adicionar `Inter` via `next/font/google`

## Passo 8 — CSS: usar Design Tokens
- [x] [LoginForm.module.css](file:///home/node/app/src/presentation/components/LoginForm.module.css): substituir cores hex por tokens
- [x] [LoginForm.module.css](file:///home/node/app/src/presentation/components/LoginForm.module.css): remover fallbacks de cores desnecessários
- [x] [RegisterForm.module.css](file:///home/node/app/src/presentation/components/RegisterForm.module.css): mesmas correções de CSS
- [x] [LoginForm.tsx](file:///home/node/app/src/presentation/components/LoginForm.tsx): substituir styles inline por classe CSS Module
- [x] [LoginForm.tsx](file:///home/node/app/src/presentation/components/LoginForm.tsx): resolver divs de footer duplicados

## Passo 9 — Adotar MUI nos componentes de formulário
- [x] Substituir Input/Button custom por MUI TextField/LoadingButton no Login
- [x] Substituir Input/Button custom por MUI TextField/LoadingButton no Registro

## Verificação
- [x] Verificar compilação com `npm run start:dev` (realizado pelo usuário)
