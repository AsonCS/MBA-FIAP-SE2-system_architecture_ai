'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    ReactNode,
} from 'react';
import { UserAggregate } from '../../core/domain/entities/User';
import { LoginUseCase } from '../../core/use-cases/LoginUseCase';
import { LogoutUseCase } from '../../core/use-cases/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../core/use-cases/GetCurrentUserUseCase';
import { RegisterUseCase, RegisterUseCaseInput } from '../../core/use-cases/RegisterUseCase';
import { AuthRepository } from '../../infra/repositories/AuthRepository';
import { createHttpClient } from '../../infra/http/HttpClient';

/**
 * Auth Context State
 */
interface AuthContextState {
    user: UserAggregate | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (input: RegisterUseCaseInput) => Promise<void>;
    refreshUser: () => Promise<void>;
}

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextState | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Auth Provider Component
 *
 * Gerencia o estado global de autenticação da aplicação.
 * Fornece métodos para login, logout, register e refresh do usuário.
 *
 * As dependências de infraestrutura são criadas com useMemo para evitar
 * recriação em cada render.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserAggregate | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Inicializar dependências uma única vez via useMemo
    const useCases = useMemo(() => {
        const httpClient = createHttpClient({
            baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001',
        });
        const authRepository = new AuthRepository(httpClient);

        return {
            loginUseCase: new LoginUseCase(authRepository),
            logoutUseCase: new LogoutUseCase(authRepository),
            getCurrentUserUseCase: new GetCurrentUserUseCase(authRepository),
            registerUseCase: new RegisterUseCase(authRepository),
        };
    }, []);

    /**
     * Carregar usuário ao montar o componente
     */
    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Carrega usuário do localStorage
     */
    const loadUser = async () => {
        setIsLoading(true);
        try {
            const currentUser = await useCases.getCurrentUserUseCase.execute();
            setUser(currentUser);
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Realiza login
     */
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await useCases.loginUseCase.execute({ email, password });
            setUser(result.user);
        } catch (error) {
            setIsLoading(false);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Realiza logout
     */
    const logout = async () => {
        setIsLoading(true);
        try {
            await useCases.logoutUseCase.execute();
            setUser(null);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Mesmo com erro, limpar estado local
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Registra uma nova oficina — delega ao RegisterUseCase
     */
    const register = async (input: RegisterUseCaseInput) => {
        await useCases.registerUseCase.execute(input);
    };

    /**
     * Atualiza dados do usuário
     */
    const refreshUser = async () => {
        try {
            const currentUser = await useCases.getCurrentUserUseCase.execute();
            setUser(currentUser);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
        }
    };

    const value: AuthContextState = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        register,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acessar o contexto de autenticação
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
};
