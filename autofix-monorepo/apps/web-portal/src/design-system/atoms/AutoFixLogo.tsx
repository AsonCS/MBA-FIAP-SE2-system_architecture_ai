/**
 * AutoFix Logo Component
 *
 * Componente atômico que encapsula o SVG do logotipo da aplicação.
 * Centraliza a definição do logo evitando duplicação entre páginas.
 */
export const AutoFixLogo = () => (
    <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="AutoFix Logo"
    >
        <rect width="48" height="48" rx="12" fill="url(#autofix-gradient)" />
        <path
            d="M24 12L28 20H20L24 12Z"
            fill="white"
            opacity="0.9"
        />
        <path
            d="M16 24L24 28L32 24L24 20L16 24Z"
            fill="white"
        />
        <path
            d="M24 36L20 28H28L24 36Z"
            fill="white"
            opacity="0.9"
        />
        <defs>
            <linearGradient
                id="autofix-gradient"
                x1="0"
                y1="0"
                x2="48"
                y2="48"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#0066FF" />
                <stop offset="1" stopColor="#0052CC" />
            </linearGradient>
        </defs>
    </svg>
);
