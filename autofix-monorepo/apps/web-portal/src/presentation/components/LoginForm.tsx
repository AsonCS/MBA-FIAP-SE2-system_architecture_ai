'use client';

import React, { useState } from 'react';
import { Input } from '../../design-system/atoms/Input';
import { Button } from '../../design-system/atoms/Button';
import { useLoginController } from '../hooks/useLoginController';
import styles from './LoginForm.module.css';

/**
 * Login Form Component
 * 
 * Formulário de autenticação do usuário.
 * Componente puro que recebe lógica via controller hook.
 */
export const LoginForm: React.FC = () => {
    const { formState, errors, isSubmitting, handleFieldChange, handleSubmit } =
        useLoginController();

    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.header}>
                <h1 className={styles.title}>Bem-vindo de volta</h1>
                <p className={styles.subtitle}>
                    Entre com suas credenciais para acessar o sistema
                </p>
            </div>

            {errors.general && (
                <div className={styles.errorAlert} role="alert">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                            fill="currentColor"
                        />
                    </svg>
                    <span>{errors.general}</span>
                </div>
            )}

            <div className={styles.fields}>
                <Input
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    fullWidth
                    value={formState.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    error={errors.email}
                    disabled={isSubmitting}
                    placeholder="seu@email.com"
                />

                <div className={styles.passwordField}>
                    <Input
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        value={formState.password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        error={errors.password}
                        disabled={isSubmitting}
                        placeholder="••••••••"
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.togglePassword}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 6c2.21 0 4 1.79 4 4 0 .73-.2 1.41-.54 2l2.37 2.37C17.07 13.14 18.25 11.67 19 10c-.73-2.89-4-6-9-6-1.18 0-2.3.19-3.32.52L8.54 6.38c.59-.34 1.27-.54 2-.54zM1 2.27l2.28 2.28.46.46C2.51 6.23 1.33 7.7 1 10c.73 2.89 4 6 9 6 1.55 0 3.03-.3 4.38-.84l.42.42L17.73 19 19 17.73 2.27 1 1 2.27zM10 14c-2.21 0-4-1.79-4-4 0-.73.2-1.41.54-2L9.46 11c.59.34 1.27.54 2 .54l2.92 2.92C13.03 13.7 11.55 14 10 14z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                            </button>
                        }
                    />
                </div>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className={styles.footer}>
                <a href="/forgot-password" className={styles.forgotLink}>
                    Esqueceu sua senha?
                </a>
            </div>
        </form>
    );
};
