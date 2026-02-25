'use client';

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import { useLoginController } from '../hooks/useLoginController';
import styles from './LoginForm.module.css';

/**
 * Login Form Component
 *
 * Formulário de autenticação do usuário.
 * Usa componentes Material UI (TextField, LoadingButton) para
 * consistência visual e acessibilidade nativa.
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
                <Alert severity="error" role="alert">
                    {errors.general}
                </Alert>
            )}

            <div className={styles.fields}>
                <TextField
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    fullWidth
                    value={formState.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    disabled={isSubmitting}
                    placeholder="seu@email.com"
                    variant="outlined"
                />

                <TextField
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    fullWidth
                    value={formState.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    disabled={isSubmitting}
                    placeholder="••••••••"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                    edge="end"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
                sx={{ py: 1.5 }}
            >
                Entrar
            </LoadingButton>

            <div className={styles.forgotFooter}>
                <a href="/forgot-password" className={styles.forgotLink}>
                    Esqueceu sua senha?
                </a>
            </div>

            <div className={styles.registerFooter}>
                <span className={styles.footerText}>
                    Não tem uma conta?
                </span>
                <a href="/register" className={styles.forgotLink}>
                    Cadastre-se
                </a>
            </div>
        </form>
    );
};
