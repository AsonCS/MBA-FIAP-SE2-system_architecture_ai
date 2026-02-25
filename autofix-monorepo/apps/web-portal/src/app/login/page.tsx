import type { Metadata } from 'next';
import { LoginForm } from '../../presentation/components/LoginForm';
import { AutoFixLogo } from '../../design-system/atoms/AutoFixLogo';
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
                    <AutoFixLogo />
                    <h2 className={styles.brandName}>AutoFix</h2>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
