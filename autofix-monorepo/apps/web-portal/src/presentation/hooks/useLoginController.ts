'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * Form State
 */
interface LoginFormState {
    email: string;
    password: string;
}

/**
 * Form Errors
 */
interface LoginFormErrors {
    email?: string;
    password?: string;
    general?: string;
}

/**
 * Login Controller Hook
 * 
 * Controller para a página de login seguindo padrão MVVM.
 * Gerencia estado do formulário, validações e orquestração do login.
 */
export const useLoginController = () => {
    const router = useRouter();
    const { login } = useAuth();

    const [formState, setFormState] = useState<LoginFormState>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Atualiza campo do formulário
     */
    const handleFieldChange = (field: keyof LoginFormState, value: string) => {
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
        const newErrors: LoginFormErrors = {};

        // Validar email
        if (!formState.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            newErrors.email = 'Email inválido';
        }

        // Validar senha
        if (!formState.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formState.password.length < 8) {
            newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Submete formulário
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
            await login(formState.email, formState.password);

            // Redirecionar para dashboard após login bem-sucedido
            router.push('/dashboard');
        } catch (error) {
            // Tratar erro de login
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Erro ao realizar login. Tente novamente.';

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
