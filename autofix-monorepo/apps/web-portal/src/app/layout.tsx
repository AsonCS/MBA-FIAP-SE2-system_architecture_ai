import type { Metadata } from "next";
import "../design-system/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
    title: "AutoFix - Sistema de Gestão de Oficina",
    description: "Sistema completo para gestão de oficinas mecânicas com controle de ordens de serviço, estoque e clientes",
    keywords: ["oficina", "mecânica", "gestão", "ordem de serviço", "autofix"],
    authors: [{ name: "AutoFix Team" }],
    viewport: "width=device-width, initial-scale=1",
    robots: "index, follow",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
