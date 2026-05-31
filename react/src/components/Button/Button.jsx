import React from 'react';
import styles from './Button.module.css';

const Button = ({
    text,
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
    ...props
}) => {
    const variantClass = styles[variant] || styles.primary;

    return (
        <button
            type={type}
            className={`${styles.btn} ${variantClass} ${className}`.trim()}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children || text}
        </button>
    );
};

export default Button;
