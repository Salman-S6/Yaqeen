import React from 'react';
import styles from './Button.module.css';

const Button = ({ text, onClick, type = 'button', variant = 'primary' }) => {
    return (
        <button
            type={type}
            className={`${styles.btn} ${styles[variant]}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;