'use client';

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import { useRegisterController } from '../hooks/useRegisterController';
import styles from './RegisterForm.module.css';

/**
 * Formata CNPJ enquanto o usuário digita: XX.XXX.XXX/XXXX-XX
 * Responsabilidade da UI — máscara visual apenas.
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
 * Usa componentes Material UI (TextField, LoadingButton) para
 * consistência visual e acessibilidade nativa.
 * A lógica de validação é delegada ao RegisterUseCase via hook.
 */
export const RegisterForm: React.FC = () => {
    const { formState, errors, isSubmitting, handleFieldChange, handleSubmit } =
        useRegisterController();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.header}>
                <h1 className={styles.title}>Crie sua conta</h1>
                <p className={styles.subtitle}>
                    Preencha os dados da sua oficina para começar
                </p>
            </div>

            {errors.general && (
                <Alert severity="error" role="alert">
                    {errors.general}
                </Alert>
            )}

            {/* Seção: Dados da Oficina */}
            <div className={styles.section}>
                <p className={styles.sectionLabel}>Dados da oficina</p>
                <div className={styles.fields}>
                    <TextField
                        label="Nome da oficina"
                        type="text"
                        id="tenantName"
                        name="tenantName"
                        autoComplete="organization"
                        required
                        fullWidth
                        value={formState.tenantName}
                        onChange={(e) => handleFieldChange('tenantName', e.target.value)}
                        error={Boolean(errors.tenantName)}
                        helperText={errors.tenantName}
                        disabled={isSubmitting}
                        placeholder="Ex: AutoFix Workshop"
                        variant="outlined"
                    />

                    <TextField
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
                        error={Boolean(errors.cnpj)}
                        helperText={errors.cnpj}
                        disabled={isSubmitting}
                        placeholder="00.000.000/0000-00"
                        inputProps={{ inputMode: 'numeric' }}
                        variant="outlined"
                    />
                </div>
            </div>

            {/* Seção: Dados do Responsável */}
            <div className={styles.section}>
                <p className={styles.sectionLabel}>Dados do responsável</p>
                <div className={styles.fields}>
                    <TextField
                        label="Nome completo"
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        autoComplete="name"
                        required
                        fullWidth
                        value={formState.ownerName}
                        onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                        error={Boolean(errors.ownerName)}
                        helperText={errors.ownerName}
                        disabled={isSubmitting}
                        placeholder="Seu nome completo"
                        variant="outlined"
                    />

                    <TextField
                        label="Email"
                        type="email"
                        id="ownerEmail"
                        name="ownerEmail"
                        autoComplete="email"
                        required
                        fullWidth
                        value={formState.ownerEmail}
                        onChange={(e) => handleFieldChange('ownerEmail', e.target.value)}
                        error={Boolean(errors.ownerEmail)}
                        helperText={errors.ownerEmail}
                        disabled={isSubmitting}
                        placeholder="seu@email.com"
                        variant="outlined"
                    />

                    <TextField
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        id="ownerPassword"
                        name="ownerPassword"
                        autoComplete="new-password"
                        required
                        fullWidth
                        value={formState.ownerPassword}
                        onChange={(e) => handleFieldChange('ownerPassword', e.target.value)}
                        error={Boolean(errors.ownerPassword)}
                        helperText={errors.ownerPassword}
                        disabled={isSubmitting}
                        placeholder="Mínimo 8 caracteres"
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

                    <TextField
                        label="Confirmar senha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="new-password"
                        required
                        fullWidth
                        value={formState.confirmPassword}
                        onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                        disabled={isSubmitting}
                        placeholder="Repita a senha"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                        edge="end"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
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
                Criar conta
            </LoadingButton>

            <div className={styles.footer}>
                <span className={styles.loginText}>Já tem uma conta?</span>
                <a href="/login" className={styles.loginLink}>
                    Fazer login
                </a>
            </div>
        </form>
    );
};
