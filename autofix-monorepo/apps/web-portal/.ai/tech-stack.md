# Technology Stack - web-portal

## 1. Core Frameworks
* **Framework:** Next.js (App Router)
* **Library:** React
* **Language:** TypeScript

## 2. Communication & Data
* **HTTP Client:** Axios
* **Data Sources:** 
    * REST API (Primary)
    * Next.js API Routes (Proxy/Aggregation)
    * LocalStorage / IndexedDB (Offline-first / Draft persistence)

## 3. SEO & Acessibilidade
* **Metadata:** Next.js Metadata API
* **Rendering:** SSG (Public pages) and CSR (Dashboard)
* **Images/Fonts:** `next/image` and `next/font` for performance
* **Compliance:** WCAG 2.1 AA (ARIA labels, keyboard nav)

## 4. State & Styling
* **Global State:** Context API
* **Styling:** Vanilla CSS or CSS Modules (Flexible/Premium Aestethics)
* **Design System:** Internal library based on Atomic Design principles

## 5. Security
* **Authentication:** NextAuth.js or JWT managed via Context/Interceptors.
* **Storage:** HttpOnly Cookies for tokens (Recommended).
