# Coding Standards - web-portal (Frontend)

## 1. Architectural Patterns
* **Clean Architecture in React:** Separation between UI (Presentation), Business Logic (Core/Domain), and API communication (Infra).
* **Repository Pattern:** UI components and Hooks should never call Axios/Fetch directly. They must use Repositories defined in the `core` layer.
* **Component Governance:** Follow **Atomic Design** for the Design System (`atoms`, `molecules`, `organisms`).
* **MAPPERS:** Always use Mappers to convert API JSON (DTOs) into rich Domain Entities and vice versa.

## 2. Naming Conventions
* **Components:** PascalCase (e.g., `Button.tsx`, `WorkOrderTable.tsx`).
* **Hooks:** camelCase with `use` prefix (e.g., `useWorkOrder.ts`).
* **Interfaces (Ports):** Prefix with `I` (e.g., `IWorkOrderRepository`).
* **Mappers:** Suffix with `Mapper` (e.g., `WorkOrderMapper`).
* **Use Cases:** Suffix with `UseCase` (e.g., `CreateWorkOrderUseCase`).

## 3. Implementation Rules
* **Business Logic:** Must live in `core/domain` (Entities/VOs) or `core/use-cases`. Avoid logic inside React components.
* **State Management:** Use Context API for global state (Auth, Theme) and custom Hooks as controllers for local business logic.
* **SEO:** Mandatory use of Next.js Metadata API, semantic HTML, and `next/image`.
* **A11y (Accessibility):** Conform to WCAG 2.1 AA. Every interactive element must be keyboard-accessible and have ARIA labels.

## 4. Performance Standards
* **Core Web Vitals:** Optimize for LCP, FID, and CLS.
* **Lazy Loading:** Use dynamic imports for heavy components or modals.
* **Caching:** Leverage Next.js SSG for public pages and efficient CSR for the dashboard.
