import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../design-system/tokens.css';
import './globals.css';
import { AuthProvider } from '../presentation/contexts/AuthContext';

/**
 * Carregamento otimizado da fonte Inter via next/font.
 * Elimina a dependência do Google Fonts CDN em runtime,
 * servindo os arquivos localmente para melhor performance e privacidade.
 */
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'AutoFix - Sistema de Gestão de Oficina',
    description: 'Sistema completo para gestão de oficinas mecânicas com controle de ordens de serviço, estoque e clientes',
    keywords: ['oficina', 'mecânica', 'gestão', 'ordem de serviço', 'autofix'],
    authors: [{ name: 'AutoFix Team' }],
    robots: 'index, follow',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={inter.variable}>
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
