import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './InputField.module.css';

const InputField = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    autoComplete
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className={styles.inputGroup}>
            <label className={styles.label}>{label}</label>

            <div className={styles.inputWrapper}>
                <input
                    type={isPassword && showPassword ? 'text' : type}
                    className={`${styles.input} ${isPassword ? styles.passwordPadding : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                />

                {isPassword && (
                    <button
                        type="button"
                        className={styles.eyeIcon}
                        onClick={() => setShowPassword((prev) => !prev)}
                        title={showPassword ? 'إخفاء' : 'إظهار'}
                        disabled={disabled}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputField;
