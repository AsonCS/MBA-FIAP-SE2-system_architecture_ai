import { Button } from '@/design-system/atoms';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.hero}>
                <h1 className={styles.title}>
                    Bem-vindo ao <span className={styles.brand}>AutoFix</span>
                </h1>
                <p className={styles.description}>
                    Sistema completo de gestão para oficinas mecânicas
                </p>
                <div className={styles.actions}>
                    <Link href="/login">
                        <Button size="lg" variant="primary">
                            Começar Agora
                        </Button>
                    </Link>
                    <Link href="/about">
                        <Button size="lg" variant="outline">
                            Saiba Mais
                        </Button>
                    </Link>
                </div>
            </div>

            <section className={styles.features}>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>📋</div>
                    <h3>Ordens de Serviço</h3>
                    <p>Gerencie todas as suas ordens de serviço de forma eficiente</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>📦</div>
                    <h3>Controle de Estoque</h3>
                    <p>Mantenha o controle completo do seu inventário de peças</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>👥</div>
                    <h3>Gestão de Clientes</h3>
                    <p>Cadastro completo de clientes e histórico de serviços</p>
                </div>
            </section>
        </main>
    );
}
