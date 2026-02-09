import type { Metadata } from 'next';
import { LoginForm } from '../../presentation/components/LoginForm';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Login | AutoFix',
    description: 'Acesse sua conta no sistema AutoFix',
};

/**
 * Login Page
 * 
 * Página de autenticação do sistema.
 */
export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="AutoFix Logo"
                    >
                        <rect width="48" height="48" rx="12" fill="url(#gradient)" />
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
                                id="gradient"
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
                    <h2 className={styles.brandName}>AutoFix</h2>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
