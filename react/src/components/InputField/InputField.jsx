import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './InputField.module.css';

// تمت إضافة الخصائص الإضافية (disabled, autoComplete) لكي تعمل شاشة الدخول بكفاءة
const InputField = ({ label, type = 'text', placeholder, value, onChange, required, disabled, autoComplete }) => {
    // حالة داخلية للتحكم بظهور كلمة المرور
    const [showPassword, setShowPassword] = useState(false);

    // التحقق مما إذا كان الحقل هو حقل كلمة مرور
    const isPassword = type === 'password';

    return (
        <div className={styles.inputGroup}>
            <label className={styles.label}>{label}</label>

            {/* حاوية جديدة لعزل الـ input مع الأيقونة فقط */}
            <div className={styles.inputWrapper}>
                <input
                    // تغيير النوع ديناميكياً بناءً على حالة الزر (فقط إذا كان الحقل أصلاً password)
                    type={isPassword && showPassword ? 'text' : type}
                    // إضافة كلاس خاص للبادينغ إذا كان الحقل كلمة مرور لكي لا يختفي النص تحت الأيقونة
                    className={`${styles.input} ${isPassword ? styles.passwordPadding : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                />

                {/* إظهار الأيقونة فقط إذا كان نوع الحقل password */}
                {isPassword && (
                    <span
                        className={styles.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "إخفاء" : "إظهار"}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                )}
            </div>
        </div>
    );
};

export default InputField;