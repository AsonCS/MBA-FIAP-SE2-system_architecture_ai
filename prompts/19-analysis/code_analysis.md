# Análise de Código — web-portal

Análise comparando o código atual em `/src` com as diretrizes definidas em `.ai/`.

---

## 1. 🔴 Uso Desnecessário de `'use client'`

O `'use client'` transforma um Server Component em um Client Bundle, impedindo SSR/SSG e prejudicando SEO.

| Arquivo | Problema |
|---|---|
| [useLoginController.ts](file:///home/node/app/src/presentation/hooks/useLoginController.ts#L1) | `'use client'` em um hook — **desnecessário**. Hooks são automaticamente client-side quando importados por um Client Component. |
| [useRegisterController.ts](file:///home/node/app/src/presentation/hooks/useRegisterController.ts#L1) | Mesmo problema. |
| [LoginForm.tsx](file:///home/node/app/src/presentation/components/LoginForm.tsx#L1) | `'use client'` correto aqui (usa `useState`/`useEffect`), porém considerar a criação de um Server Component wrapper para SSR da estrutura externa. |
| [RegisterForm.tsx](file:///home/node/app/src/presentation/components/RegisterForm.tsx#L1) | Idem `LoginForm.tsx` |
| [dashboard/page.tsx](file:///home/node/app/src/app/dashboard/page.tsx#L1) | `'use client'` necessário para hooks, **mas o ideal é extrair a parte interativa** para um componente filho, mantendo o `page.tsx` como Server Component para SEO e possibilitar `export const metadata`. |

> [!IMPORTANT]
> Hooks **não precisam** de `'use client'`. A diretiva só é necessária em arquivos que exportam componentes React com interatividade. Remover de `useLoginController.ts` e `useRegisterController.ts`.

---

## 2. 🔴 Dados Hard-coded na UI

Dados de desenvolvimento/teste deixados no estado inicial da aplicação:

| Arquivo | Linhas | Dado Hard-coded |
|---|---|---|
| [useLoginController.ts](file:///home/node/app/src/presentation/hooks/useLoginController.ts#L35-L37) | 35–37 | `email: 'ze@example.com'`, `password: 'password'` — credenciais de teste expostas no código |
| [useRegisterController.ts](file:///home/node/app/src/presentation/hooks/useRegisterController.ts#L74-L80) | 74–80 | `tenantName: 'Oficina do Zé'`, `cnpj: '18320743000104'`, `ownerName: 'José Silva'`, `ownerEmail: 'ze@example.com'`, `ownerPassword: 'password'` — todos os campos pré-preenchidos |

> [!CAUTION]
> Esses dados foram claramente inseridos para agilizar testes manuais mas **nunca foram removidos**. Em produção, credenciais hard-coded são uma vulnerabilidade de segurança e uma péssima UX (campos pré-preenchidos confundem usuários reais).

**Fix:** Todos os campos devem iniciar com `''` (string vazia).

---

## 3. 🟡 Problemas de Formatação

### 3.1 Inline Styles misturados com CSS Modules

```tsx
// LoginForm.tsx — linha 138
<span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #666)' }}>
```
O projeto tem tokens CSS e CSS Modules definidos. Não há justificativa para inline style. Deveria usar uma classe CSS Module (ex: `.loginText`) — exatamente como o `RegisterForm.tsx` já faz corretamente na linha 216.

### 3.2 Dois elementos `.footer` consecutivos em LoginForm

```tsx
// LoginForm.tsx — linhas 131-145
<div className={styles.footer}>  {/* "Esqueceu sua senha?" */}
    ...
</div>
<div className={styles.footer}>  {/* "Não tem uma conta?" */}
    ...
</div>
```
Dois `div`s com a mesma classe consecutivos indica que deveriam ser agrupados ou ter classes distintas (`.footerPrimary`, `.footerSecondary`).

### 3.3 Logo SVG duplicado entre páginas

O bloco SVG do logo AutoFix está **copiado literalmente** entre [login/page.tsx](file:///home/node/app/src/app/login/page.tsx#L20-L56) e [register/page.tsx](file:///home/node/app/src/app/register/page.tsx#L20-L56). Isso deve ser extraído para um componente `<AutoFixLogo />` no design-system.

### 3.4 Fonte carregada via `<link>` manual no `<head>`

```tsx
// layout.tsx — linhas 23-28
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter..." />
```
O `tech-stack.md` especifica usar `next/font` para performance. A forma correta é:
```ts
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

---

## 4. 🔴 Problemas de Arquitetura

### 4.1 Violação do Repository Pattern em `useRegisterController`

```ts
// useRegisterController.ts — linhas 175-186
const httpClient = createHttpClient({ ... });
const authRepository = new AuthRepository(httpClient);
await authRepository.register({ ... });
```
Conforme `standards.md`:
> *"UI components and Hooks should never call Axios/Fetch directly. They must use Repositories defined in the core layer."*

O hook está **instanciando infraestrutura diretamente**. Deveria existir um `RegisterUseCase` no `core/use-cases/` e o hook deveria chamar `registerUseCase.execute(...)`, assim como `useLoginController` usa `loginUseCase` via `AuthContext`.

### 4.2 Validação de negócio no hook, não no Core

A lógica de validação de CNPJ (`isValidCnpj`) em [useRegisterController.ts#L41-L62](file:///home/node/app/src/presentation/hooks/useRegisterController.ts#L41-L62) e a validação de email em `useLoginController.ts` devem residir nos **Value Objects** do domínio:
- `CNPJ` VO já existe em `core/domain/value-objects/CNPJ.ts` — por que não usá-lo?
- `Email` VO já existe em `core/domain/value-objects/Email.ts` — idem.

### 4.3 Dependências instanciadas a cada render em `AuthContext`

```ts
// AuthContext.tsx — linhas 46-52 (dentro do corpo do componente)
const httpClient = createHttpClient({ ... });
const authRepository = new AuthRepository(httpClient);
const loginUseCase = new LoginUseCase(authRepository);
```
Essas instâncias são **recriadas a cada re-render** do `AuthProvider`. Devem usar `useMemo` ou ser extraídas para fora do componente.

### 4.4 `view-models/` está vazio

O diretório `src/presentation/view-models/` existe mas está vazio. Os tipos `LoginFormState` e `RegisterFormState` estão declarados inline nos hooks. Esses tipos pertencem a `view-models/`.

### 4.5 Dashboard: SEO perdido por `'use client'` no page nível

O `dashboard/page.tsx` usa `'use client'`, o que impede `export const metadata`. O guard de autenticação deveria ser extraído para um componente `<DashboardGuard>` com `'use client'`, mantendo `page.tsx` como Server Component.

---

## 5. 🟡 Uso de CSS

### 5.1 Fallback de cores hard-coded ignorando Design Tokens

```css
/* LoginForm.module.css */
color: var(--color-text-primary, #1a1a1a);   /* fallback desnecessário */
color: var(--color-text-secondary, #666);    /* idem */
```
O `tokens.css` já define todas essas variáveis com valores corretos. Os fallbacks `#1a1a1a` e `#666` estão desalinhados com o sistema (que usa valores HSL), e o Design System garante que os tokens sempre existirão. Os valores de fallback devem ser removidos ou alinhados com os tokens.

### 5.2 Cores hex brutas no CSS de erro

```css
/* LoginForm.module.css — linhas 34-37 */
background: linear-gradient(135deg, #fee 0%, #fdd 100%);
border: 1px solid #fcc;
color: #c33;
```
O token `--color-danger` e `--color-danger-light` já existem no Design System. Deveriam ser usados aqui.

### 5.3 `border-radius: 8px` hardcoded

```css
/* LoginForm.module.css — linha 37 */
border-radius: 8px;
```
O token `--radius-md: 0.5rem` (8px) existe. Deveria ser `var(--radius-md)`.

---

## 6. 🔴 Não Uso de Material UI Components

Conforme `tech-stack.md`:
> *"Styling: Material UI (MUI), Vanilla CSS or CSS Modules (Flexible/Premium Aesthetics)"*

O projeto **não usa nenhum componente MUI** em lugar algum. O design-system interno (`atoms/Button`, `atoms/Input`) reimplementa componentes já disponíveis no MUI com muito mais robustez:

| Componente Customizado | Equivalente MUI | O que MUI oferece a mais |
|---|---|---|
| [Button.tsx](file:///home/node/app/src/design-system/atoms/Button.tsx) | `<Button>` (MUI) | Ripple effect, integração com tema, variantes `contained/outlined/text`, `LoadingButton` |
| [Input.tsx](file:///home/node/app/src/design-system/atoms/Input.tsx) | `<TextField>` (MUI) | Animação de label (float), helperText nativo, integração com `react-hook-form`, acessibilidade nativa completa |

> [!NOTE]
> O design-system interno (`atoms/`) pode **coexistir com MUI**, estendendo seus componentes via `sx` prop ou `styled()`. A escolha deve ser documentada. Se MUI for adotado, os átomos custom podem ser wrappers que padronizam o tema.

---

## Resumo Priorizado

| Prioridade | Categoria | Qtd. de Ocorrências |
|---|---|---|
| 🔴 Alta | Dados hard-coded (credenciais de teste) | 2 arquivos |
| 🔴 Alta | Violação do Repository Pattern | 1 hook |
| 🔴 Alta | Validação de negócio fora do Core | 2 hooks |
| 🔴 Alta | Não uso de MUI (decisão não documentada) | Global |
| 🟡 Média | `'use client'` desnecessário em hooks | 2 hooks |
| 🟡 Média | Instâncias recriadas a cada render (AuthContext) | 1 contexto |
| 🟡 Média | Logo SVG duplicado | 2 páginas |
| 🟡 Média | Fonte via `<link>` em vez de `next/font` | 1 layout |
| 🟢 Baixa | Fallbacks de cores fora do Design Token | CSS Modules |
| 🟢 Baixa | Inline style / classe CSS duplicada | LoginForm |
