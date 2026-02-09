import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    className = '',
    ...props
}) => {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={classNames}
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            {loading && (
                <span className={styles.spinner} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="60"
                            strokeDashoffset="60"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                values="60;0"
                                dur="1s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </svg>
                </span>
            )}
            {!loading && leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
            <span className={styles.content}>{children}</span>
            {!loading && rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </button>
    );
};
