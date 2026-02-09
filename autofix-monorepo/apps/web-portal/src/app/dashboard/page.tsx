'use client';

import { useAuth } from '../../presentation/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '../../design-system/atoms/Button';
import styles from './page.module.css';

/**
 * Dashboard Page
 * 
 * Página protegida que requer autenticação.
 * Demonstra o uso do contexto de autenticação.
 */
export default function DashboardPage() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirecionar para login se não autenticado
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <Button variant="outline" onClick={handleLogout}>
                    Sair
                </Button>
            </div>

            <div className={styles.content}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Bem-vindo!</h2>
                    <div className={styles.userInfo}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Nome:</span>
                            <span className={styles.value}>{user.name}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.value}>{user.email.value}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Perfil:</span>
                            <span className={styles.badge}>{user.role}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Tenant ID:</span>
                            <span className={styles.value}>{user.tenantId}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Status da Autenticação</h2>
                    <div className={styles.statusInfo}>
                        <div className={styles.statusItem}>
                            <div className={styles.statusDot}></div>
                            <span>Autenticado com sucesso</span>
                        </div>
                        <p className={styles.statusText}>
                            Você está conectado ao sistema AutoFix. Seus tokens estão sendo gerenciados
                            automaticamente e serão renovados quando necessário.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
