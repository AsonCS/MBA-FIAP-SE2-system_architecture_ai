# Plano de Correção — web-portal

Corrige todos os 9 problemas identificados na análise de código, seguindo as diretrizes de `.ai/`.

---

## Proposed Changes

### Passo 1 — Instalação do Material UI
> MUI não está no [package.json](file:///home/node/app/package.json). É pré-requisito para o Passo 9.

#### [MODIFY] [package.json](file:///home/node/app/package.json)
Adicionar `@mui/material`, `@emotion/react`, `@emotion/styled` e `@mui/icons-material`.

---

### Passo 2 — Dados Hard-coded removidos
#### [MODIFY] [useLoginController.ts](file:///home/node/app/src/presentation/hooks/useLoginController.ts)
Estado inicial de `formState` passa de dados de teste para campos vazios.

#### [MODIFY] [useRegisterController.ts](file:///home/node/app/src/presentation/hooks/useRegisterController.ts)
Idem — todos os 6 campos passam para `''`.

---

### Passo 3 — `'use client'` removido dos hooks
#### [MODIFY] [useLoginController.ts](file:///home/node/app/src/presentation/hooks/useLoginController.ts)
Remover linha 1 (`'use client'`). Hooks são automaticamente client-side.

#### [MODIFY] [useRegisterController.ts](file:///home/node/app/src/presentation/hooks/useRegisterController.ts)
Idem.

---

### Passo 4 — RegisterUseCase (Core Layer)
#### [NEW] [RegisterUseCase.ts](file:///home/node/app/src/core/use-cases/RegisterUseCase.ts)
Use Case que:
- Valida campos obrigatórios
- Usa `CNPJ.isValid()` do Value Object já existente
- Usa `Email.isValid()` do Value Object já existente
- Delega ao `IAuthRepository.register()`

---

### Passo 5 — AuthContext: integra register + corrige useMemo
#### [MODIFY] [AuthContext.tsx](file:///home/node/app/src/presentation/contexts/AuthContext.tsx)
- Envolver `httpClient`, `authRepository`, e os 4 use cases com `useMemo`
- Adicionar método [register()](file:///home/node/app/src/core/repositories/IAuthRepository.ts#43-49) ao [AuthContextState](file:///home/node/app/src/presentation/contexts/AuthContext.tsx#14-22) e ao [AuthProvider](file:///home/node/app/src/presentation/contexts/AuthContext.tsx#35-133)
- Instanciar `RegisterUseCase` dentro do mesmo `useMemo`

---

### Passo 6 — useRegisterController refatorado
#### [MODIFY] [useRegisterController.ts](file:///home/node/app/src/presentation/hooks/useRegisterController.ts)
- Remover `createHttpClient` e [AuthRepository](file:///home/node/app/src/infra/repositories/AuthRepository.ts#22-226) do hook
- Usar [useAuth().register()](file:///home/node/app/src/presentation/contexts/AuthContext.tsx#134-146) em vez da instanciação direta
- Remover [isValidCnpj()](file:///home/node/app/src/presentation/hooks/useRegisterController.ts#38-63) e [cleanCnpj()](file:///home/node/app/src/presentation/hooks/useRegisterController.ts#33-37) locais (lógica delegada ao UseCase)
- Manter apenas a formatação visual de CNPJ (máscara no `onChange`, que é responsabilidade da UI)

---

### Passo 7 — AutoFixLogo: eliminar duplicação de SVG
#### [NEW] [AutoFixLogo.tsx](file:///home/node/app/src/design-system/atoms/AutoFixLogo.tsx)
Componente React que encapsula o SVG do logo.

#### [MODIFY] [login/page.tsx](file:///home/node/app/src/app/login/page.tsx)
Substituir bloco SVG literal pelo `<AutoFixLogo />`.

#### [MODIFY] [register/page.tsx](file:///home/node/app/src/app/register/page.tsx)
Idem.

---

### Passo 8 — Fonte: migrar para next/font
#### [MODIFY] [layout.tsx](file:///home/node/app/src/app/layout.tsx)
- Remover `<link>` manuais do Google Fonts
- Usar `import { Inter } from 'next/font/google'`
- Aplicar `inter.className` no `<body>`

---

### Passo 9 — CSS: tokens e sem fallbacks hardcoded
#### [MODIFY] [LoginForm.module.css](file:///home/node/app/src/presentation/components/LoginForm.module.css)
- `.errorAlert`: trocar `#fee/#fdd/#fcc/#c33` por `var(--color-danger-light)` e `var(--color-danger)`
- `.errorAlert`: `border-radius: var(--radius-md)`
- Remover fallbacks hex de todas as variáveis CSS

#### [MODIFY] [RegisterForm.module.css](file:///home/node/app/src/presentation/components/RegisterForm.module.css)
- Mesmas correções de `.errorAlert`
- Remover fallbacks hex

#### [MODIFY] [LoginForm.tsx](file:///home/node/app/src/presentation/components/LoginForm.tsx)
- Remover `style={{ fontSize: '0.875rem', color: '...' }}` inline
- Adicionar classe `.footerText` no CSS Module
- Renomear os dois `div.footer` para `.forgotFooter` e `.registerFooter`

#### [MODIFY] [LoginForm.module.css](file:///home/node/app/src/presentation/components/LoginForm.module.css)
- Adicionar `.footerText` (substitui o inline style)
- Renomear `.footer` conforme acima

---

### Passo 10 — Adotar MUI nos formulários
#### [MODIFY] [LoginForm.tsx](file:///home/node/app/src/presentation/components/LoginForm.tsx)
- Substituir `<Input>` customizado por `<TextField>` MUI
- Substituir `<Button>` customizado por `<Button>` MUI (com `LoadingButton` de `@mui/lab`)

#### [MODIFY] [RegisterForm.tsx](file:///home/node/app/src/presentation/components/RegisterForm.tsx)
- Idem

---

## Verification Plan

### Automated Tests

```bash
# Rodar todos os testes unitários do domínio
npm run test
```
Testes existentes em `core/domain/value-objects/__tests__/` validam CPF, Money e WorkOrderStatus. Passarão inalterados pois não tocamos no domínio desses VOs.

### Build Check

```bash
# Verificar compilação TypeScript sem erros
npm run build
```

### Manual Verification
1. Abrir `http://localhost:3000` — verificar que a página home carrega sem erros de console
2. Navegar para `/login` — confirmar que os campos estão **vazios** (não pré-preenchidos)
3. Navegar para `/register` — confirmar que todos os campos estão **vazios**
4. Verificar no DevTools → Network que a fonte Inter é carregada via `/\_next/static/media/` (next/font) e não via `fonts.googleapis.com`
5. Verificar no DevTools → Console que não há warnings de React sobre inline styles ou chave duplicada
