import type { Metadata } from 'next';
import { RegisterForm } from '../../presentation/components/RegisterForm';
import { AutoFixLogo } from '../../design-system/atoms/AutoFixLogo';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Cadastro | AutoFix',
    description: 'Crie sua conta no sistema AutoFix',
};

/**
 * Register Page
 *
 * Página de cadastro de novos usuários.
 */
export default function RegisterPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <AutoFixLogo />
                    <h2 className={styles.brandName}>AutoFix</h2>
                </div>

                <RegisterForm />
            </div>
        </div>
    );
}
