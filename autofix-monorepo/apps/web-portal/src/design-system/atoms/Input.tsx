import React, { forwardRef } from 'react';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    inputSize?: InputSize;
    variant?: InputVariant;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            inputSize = 'md',
            variant = 'default',
            leftIcon,
            rightIcon,
            fullWidth = false,
            className = '',
            id,
            required,
            disabled,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = Boolean(error);

        const containerClasses = [
            styles.container,
            fullWidth && styles.fullWidth,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const inputWrapperClasses = [
            styles.inputWrapper,
            styles[inputSize],
            styles[variant],
            hasError && styles.error,
            disabled && styles.disabled,
            leftIcon && styles.hasLeftIcon,
            rightIcon && styles.hasRightIcon,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={containerClasses}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                        {required && <span className={styles.required} aria-label="required">*</span>}
                    </label>
                )}
                <div className={inputWrapperClasses}>
                    {leftIcon && <span className={styles.leftIcon} aria-hidden="true">{leftIcon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={styles.input}
                        disabled={disabled}
                        aria-invalid={hasError}
                        aria-describedby={
                            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                        }
                        {...props}
                    />
                    {rightIcon && <span className={styles.rightIcon} aria-hidden="true">{rightIcon}</span>}
                </div>
                {error && (
                    <span id={`${inputId}-error`} className={styles.errorText} role="alert">
                        {error}
                    </span>
                )}
                {!error && helperText && (
                    <span id={`${inputId}-helper`} className={styles.helperText}>
                        {helperText}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
