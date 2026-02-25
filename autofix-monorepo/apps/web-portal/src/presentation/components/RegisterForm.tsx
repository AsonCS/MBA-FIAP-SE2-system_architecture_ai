'use client';

import React, { useState } from 'react';
import { Input } from '../../design-system/atoms/Input';
import { Button } from '../../design-system/atoms/Button';
import { useRegisterController } from '../hooks/useRegisterController';
import styles from './RegisterForm.module.css';

/**
 * Formata CNPJ enquanto o usuário digita: XX.XXX.XXX/XXXX-XX
 */
const formatCnpj = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};

/**
 * Register Form Component
 *
 * Formulário de cadastro de nova oficina.
 * Componente puro que recebe lógica via controller hook.
 */
export const RegisterForm: React.FC = () => {
    const { formState, errors, isSubmitting, handleFieldChange, handleSubmit } =
        useRegisterController();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const eyeOpenIcon = (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );

    const eyeClosedIcon = (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10 6c2.21 0 4 1.79 4 4 0 .73-.2 1.41-.54 2l2.37 2.37C17.07 13.14 18.25 11.67 19 10c-.73-2.89-4-6-9-6-1.18 0-2.3.19-3.32.52L8.54 6.38c.59-.34 1.27-.54 2-.54zM1 2.27l2.28 2.28.46.46C2.51 6.23 1.33 7.7 1 10c.73 2.89 4 6 9 6 1.55 0 3.03-.3 4.38-.84l.42.42L17.73 19 19 17.73 2.27 1 1 2.27zM10 14c-2.21 0-4-1.79-4-4 0-.73.2-1.41.54-2L9.46 11c.59.34 1.27.54 2 .54l2.92 2.92C13.03 13.7 11.55 14 10 14z"
                fill="currentColor"
            />
        </svg>
    );

    return (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.header}>
                <h1 className={styles.title}>Crie sua conta</h1>
                <p className={styles.subtitle}>
                    Preencha os dados da sua oficina para começar
                </p>
            </div>

            {errors.general && (
                <div className={styles.errorAlert} role="alert">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path
                            d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                            fill="currentColor"
                        />
                    </svg>
                    <span>{errors.general}</span>
                </div>
            )}

            {/* Seção: Dados da Oficina */}
            <div className={styles.section}>
                <p className={styles.sectionLabel}>Dados da oficina</p>
                <div className={styles.fields}>
                    <Input
                        label="Nome da oficina"
                        type="text"
                        id="tenantName"
                        name="tenantName"
                        autoComplete="organization"
                        required
                        fullWidth
                        value={formState.tenantName}
                        onChange={(e) => handleFieldChange('tenantName', e.target.value)}
                        error={errors.tenantName}
                        disabled={isSubmitting}
                        placeholder="Ex: AutoFix Workshop"
                    />

                    <Input
                        label="CNPJ"
                        type="text"
                        id="cnpj"
                        name="cnpj"
                        autoComplete="off"
                        required
                        fullWidth
                        value={formState.cnpj}
                        onChange={(e) =>
                            handleFieldChange('cnpj', formatCnpj(e.target.value))
                        }
                        error={errors.cnpj}
                        disabled={isSubmitting}
                        placeholder="00.000.000/0000-00"
                        inputMode="numeric"
                    />
                </div>
            </div>

            {/* Seção: Dados do Responsável */}
            <div className={styles.section}>
                <p className={styles.sectionLabel}>Dados do responsável</p>
                <div className={styles.fields}>
                    <Input
                        label="Nome completo"
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        autoComplete="name"
                        required
                        fullWidth
                        value={formState.ownerName}
                        onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                        error={errors.ownerName}
                        disabled={isSubmitting}
                        placeholder="Seu nome completo"
                    />

                    <Input
                        label="Email"
                        type="email"
                        id="ownerEmail"
                        name="ownerEmail"
                        autoComplete="email"
                        required
                        fullWidth
                        value={formState.ownerEmail}
                        onChange={(e) => handleFieldChange('ownerEmail', e.target.value)}
                        error={errors.ownerEmail}
                        disabled={isSubmitting}
                        placeholder="seu@email.com"
                    />

                    <div className={styles.passwordField}>
                        <Input
                            label="Senha"
                            type={showPassword ? 'text' : 'password'}
                            id="ownerPassword"
                            name="ownerPassword"
                            autoComplete="new-password"
                            required
                            fullWidth
                            value={formState.ownerPassword}
                            onChange={(e) => handleFieldChange('ownerPassword', e.target.value)}
                            error={errors.ownerPassword}
                            disabled={isSubmitting}
                            placeholder="Mínimo 8 caracteres"
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.togglePassword}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                    tabIndex={-1}
                                >
                                    {showPassword ? eyeOpenIcon : eyeClosedIcon}
                                </button>
                            }
                        />
                    </div>

                    <div className={styles.passwordField}>
                        <Input
                            label="Confirmar senha"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            autoComplete="new-password"
                            required
                            fullWidth
                            value={formState.confirmPassword}
                            onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                            error={errors.confirmPassword}
                            disabled={isSubmitting}
                            placeholder="Repita a senha"
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={styles.togglePassword}
                                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? eyeOpenIcon : eyeClosedIcon}
                                </button>
                            }
                        />
                    </div>
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
                {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
            </Button>

            <div className={styles.footer}>
                <span className={styles.loginText}>Já tem uma conta?</span>
                <a href="/login" className={styles.loginLink}>
                    Fazer login
                </a>
            </div>
        </form>
    );
};
