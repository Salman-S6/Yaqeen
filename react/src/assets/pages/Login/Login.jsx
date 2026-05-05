import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from "../../../components/InputField/InputField";
import Button from "../../../components/Button/Button";
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // لإظهار رسائل الخطأ

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // تصفير الأخطاء عند محاولة الدخول

        // تنظيف المدخلات (Normalization)
        const input = userId.trim().toLowerCase();

        // لوجيك الدخول الافتراضي للاختبار
        if (input.includes('admin')) {
            // 1. تخزين الدور ليتعرف عليه ProtectedRoute
            localStorage.setItem('userRole', 'admin');

            // 2. التوجيه لمسار الإدارة المركزية
            navigate('/admin/users');
        }
        else if (input.length > 3) { // فرضاً أن أي إيميل موظف أطول من 3 حروف
            // 1. تخزين الدور كموظف
            localStorage.setItem('userRole', 'employee');

            // 2. التوجيه لبوابة الموظفين (الطلبات المعلقة)
            navigate('/employee/pending-requests');
        } else {
            setError('يرجى التأكد من البيانات المدخلة');
        }
    };

    return (
        <div className={styles.loginPageWrapper}>
            <div className={styles.loginCard}>
                <div className={styles.logoSection}>
                    <h1 className={styles.logoTitle}>يَقِين</h1>
                    <p className={styles.logoSubtitle}>بوابة الموظفين والإدارة المركزية</p>
                </div>

                <form onSubmit={handleLogin}>
                    <InputField
                        label="الرقم الوظيفي أو البريد الإلكتروني"
                        type="text"
                        placeholder="exam@gmail.com"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />

                    <InputField
                        label="كلمة المرور"
                        type="password"
                        placeholder="........"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <div className={styles.forgotPassword}>
                        <a href="#">نسيت كلمة المرور؟ تواصل مع الدعم الفني</a>
                    </div>

                    {/* تأكد أن الـ Button يمرر type="submit" للوسم الداخلي */}
                    <Button text="دخول إلى النظام" type="submit" variant="primary" />

                    <div className={styles.alertBox}>
                        <span className={styles.warningMessage}>⚠️ الدخول مصرح فقط لموظفي منصة يقين</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;