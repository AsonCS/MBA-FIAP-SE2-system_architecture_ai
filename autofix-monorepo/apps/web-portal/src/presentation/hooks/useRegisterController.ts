'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthRepository } from '../../infra/repositories/AuthRepository';
import { createHttpClient } from '../../infra/http/HttpClient';

/**
 * Form State
 */
interface RegisterFormState {
    tenantName: string;
    cnpj: string;
    ownerName: string;
    ownerEmail: string;
    ownerPassword: string;
    confirmPassword: string;
}

/**
 * Form Errors
 */
interface RegisterFormErrors {
    tenantName?: string;
    cnpj?: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPassword?: string;
    confirmPassword?: string;
    general?: string;
}

/**
 * Remove formatação do CNPJ, mantendo apenas dígitos
 */
const cleanCnpj = (value: string) => value.replace(/\D/g, '');

/**
 * Valida CNPJ usando algoritmo oficial
 */
const isValidCnpj = (cnpj: string): boolean => {
    const digits = cleanCnpj(cnpj);

    if (digits.length !== 14) return false;
    if (/^(\d)\1+$/.test(digits)) return false; // todos iguais

    const calc = (d: string, weights: number[]) =>
        weights.reduce((sum, w, i) => sum + parseInt(d[i]) * w, 0);

    const mod = (n: number) => {
        const r = n % 11;
        return r < 2 ? 0 : 11 - r;
    };

    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const d1 = mod(calc(digits, w1));
    const d2 = mod(calc(digits, w2));

    return d1 === parseInt(digits[12]) && d2 === parseInt(digits[13]);
};

/**
 * Register Controller Hook
 *
 * Controller para a página de cadastro seguindo padrão MVVM.
 * Gerencia estado do formulário, validações e orquestração do registro.
 */
export const useRegisterController = () => {
    const router = useRouter();

    const [formState, setFormState] = useState<RegisterFormState>({
        tenantName: 'Oficina do Zé',
        cnpj: '18320743000104',
        ownerName: 'José Silva',
        ownerEmail: 'ze@example.com',
        ownerPassword: 'password',
        confirmPassword: 'password',
    });

    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Atualiza campo do formulário
     */
    const handleFieldChange = (field: keyof RegisterFormState, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Limpar erro do campo ao digitar
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    /**
     * Valida formulário
     */
    const validateForm = (): boolean => {
        const newErrors: RegisterFormErrors = {};

        // Validar nome da oficina
        if (!formState.tenantName.trim()) {
            newErrors.tenantName = 'Nome da oficina é obrigatório';
        } else if (formState.tenantName.trim().length < 2) {
            newErrors.tenantName = 'Nome deve ter no mínimo 2 caracteres';
        }

        // Validar CNPJ
        const rawCnpj = cleanCnpj(formState.cnpj);
        if (!formState.cnpj.trim()) {
            newErrors.cnpj = 'CNPJ é obrigatório';
        } else if (rawCnpj.length !== 14) {
            newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
        } else if (!isValidCnpj(formState.cnpj)) {
            newErrors.cnpj = 'CNPJ inválido';
        }

        // Validar nome do responsável
        if (!formState.ownerName.trim()) {
            newErrors.ownerName = 'Nome do responsável é obrigatório';
        } else if (formState.ownerName.trim().length < 2) {
            newErrors.ownerName = 'Nome deve ter no mínimo 2 caracteres';
        }

        // Validar email
        if (!formState.ownerEmail.trim()) {
            newErrors.ownerEmail = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.ownerEmail)) {
            newErrors.ownerEmail = 'Email inválido';
        }

        // Validar senha
        if (!formState.ownerPassword) {
            newErrors.ownerPassword = 'Senha é obrigatória';
        } else if (formState.ownerPassword.length < 8) {
            newErrors.ownerPassword = 'Senha deve ter no mínimo 8 caracteres';
        }

        // Validar confirmação de senha
        if (!formState.confirmPassword) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (formState.ownerPassword !== formState.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Submete formulário de cadastro
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Limpar erro geral
        setErrors((prev) => ({ ...prev, general: undefined }));

        // Validar formulário
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const httpClient = createHttpClient({
                baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001',
            });
            const authRepository = new AuthRepository(httpClient);

            await authRepository.register({
                tenantName: formState.tenantName.trim(),
                cnpj: cleanCnpj(formState.cnpj),
                ownerName: formState.ownerName.trim(),
                ownerEmail: formState.ownerEmail.trim(),
                ownerPassword: formState.ownerPassword,
            });

            // Redirecionar para login após cadastro bem-sucedido
            router.push('/login?registered=true');
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Erro ao realizar cadastro. Tente novamente.';

            setErrors({
                general: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formState,
        errors,
        isSubmitting,
        handleFieldChange,
        handleSubmit,
    };
};
