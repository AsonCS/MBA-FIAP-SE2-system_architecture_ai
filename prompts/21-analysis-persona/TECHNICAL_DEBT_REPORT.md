# Relatório de Dívida Técnica - AutoFix

Este relatório detalha as principais áreas de dívida técnica identificadas no projeto AutoFix, classificadas por Arquiteto de Software.

## 1. Arquitetura

### 🏗️ Violação do Princípio de Responsabilidade Única (SRP) nos Repositórios
**Onde:** `src/infra/repositories/AuthRepository.ts`
**Problema:** O repositório está gerenciando tanto as chamadas de API quanto a persistência local (`localStorage`). 
**Impacto:** Dificulta a substituição da estratégia de armazenamento (ex: trocar `localStorage` por Cookies ou IndexedDB) e torna os testes unitários mais complexos.
**Recomendação:** Extrair a lógica de armazenamento para uma interface `IStorage` e injetá-la no repositório.

### 🧩 Injeção de Dependência Manual no Contexto
**Onde:** `src/presentation/contexts/AuthContext.tsx`
**Problema:** O `AuthProvider` atua como um "Composition Root", instanciando diretamente classes de infraestrutura e casos de uso.
**Impacto:** Acoplamento forte entre a camada de apresentação e a infraestrutura. Se o `HttpClient` mudar, o contexto precisa ser alterado.
**Recomendação:** Criar uma fábrica de dependências ou centralizar a composição em um único arquivo fora do contexto React.

### 🧪 Duplicação de Lógica de Validação
**Onde:** `LoginUseCase.ts` e `useLoginController.ts`
**Problema:** Regras de negócio como "senha deve ter 8 caracteres" estão duplicadas tanto na camada de domínio quanto na de apresentação.
**Impacto:** Risco de inconsistência se a regra mudar em apenas um lugar.
**Recomendação:** Centralizar validações de negócio em Value Objects ou nos Use Cases, deixando o controller apenas com validações de formato básico (UI).

---

## 2. Segurança

### 🔑 Armazenamento Inseguro de Tokens
**Onde:** `src/infra/http/HttpClient.ts` e `AuthRepository.ts`
**Problema:** JWTs e dados sensíveis do usuário são armazenados no `localStorage`.
**Impacto:** Alta vulnerabilidade a ataques de **XSS (Cross-Site Scripting)**. Scripts maliciosos injetados podem roubar o token de acesso facilmente.
**Recomendação:** Migrar para **HttpOnly Cookies** para o armazenamento de tokens de sessão, protegendo-os de acesso via JavaScript.

### 📢 Vazamento de Informação em Erros
**Onde:** Diversos catch blocks nos repositórios.
**Problema:** Erros brutos da API são capturados e, às vezes, repassados com mensagens que podem expor detalhes internos.
**Impacto:** Facilita o reconhecimento do sistema por atacantes.
**Recomendação:** Implementar um mapeamento de erros rigoroso (Domain Errors) que traduz erros técnicos em mensagens amigáveis e seguras para o usuário.

---

## 3. Performance

### 🔄 Redundância de Estado de Carregamento
**Onde:** `AuthContext.tsx`
**Problema:** Chamadas redundantes a `setIsLoading(false)` em blocos `catch` e `finally`.
**Impacto:** Embora não afete a experiência visual drasticamente, indica um código que pode gerar re-renders desnecessários se o estado for atualizado em cascata.
**Recomendação:** Limpar a lógica de estado para garantir que alterações ocorram apenas uma vez por transição.

### 📦 Uso de Componentes Pesados
**Onde:** `LoginForm.tsx`
**Problema:** Uso direto de dependências do `@mui/lab` e ícones pesados sem treeshaking verificado.
**Recomendação:** Garantir que o build final esteja otimizando a importação de ícones e componentes.

---

## 4. Usabilidade e UI/UX

### 🎨 Inconsistência no Design System
**Onde:** `src/presentation/components` vs `src/design-system`
**Problema:** O projeto possui uma pasta `design-system` com átomos (`Button`, `Input`), mas os formulários principais (`LoginForm`, `RegisterForm`) usam componentes brutos do MUI (`TextField`, `LoadingButton`).
**Impacto:** Fragmentação visual. Alterações no `design-system` não se refletirão nas páginas principais.
**Recomendação:** Refatorar os componentes de apresentação para utilizarem exclusivamente os Atoms do Design System, encapsulando o MUI dentro deles.

### ♿ Acessibilidade (a11y)
**Problema:** Embora o MUI ajude, faltam testes de navegação via teclado e anúncios de leitores de tela para feedbacks dinâmicos além do `role="alert"`.
**Recomendação:** Implementar testes de acessibilidade (ex: `axe-core`) e garantir que todos os elementos interativos tenham labels claros.
