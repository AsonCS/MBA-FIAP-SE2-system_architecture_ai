import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

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
 * Register Controller Hook
 *
 * Controller para a página de cadastro seguindo padrão MVVM.
 * Gerencia estado do formulário e orquestra o cadastro via AuthContext.
 * Toda a lógica de validação e negócio está no RegisterUseCase (core layer).
 */
export const useRegisterController = () => {
    const router = useRouter();
    const { register } = useAuth();

    const [formState, setFormState] = useState<RegisterFormState>({
        tenantName: '',
        cnpj: '',
        ownerName: '',
        ownerEmail: '',
        ownerPassword: '',
        confirmPassword: '',
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
     * Submete formulário de cadastro.
     * A validação de negócio é delegada ao RegisterUseCase via AuthContext.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Limpar erro geral
        setErrors((prev) => ({ ...prev, general: undefined }));

        setIsSubmitting(true);

        try {
            await register({
                tenantName: formState.tenantName,
                cnpj: formState.cnpj,
                ownerName: formState.ownerName,
                ownerEmail: formState.ownerEmail,
                ownerPassword: formState.ownerPassword,
                confirmPassword: formState.confirmPassword,
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
