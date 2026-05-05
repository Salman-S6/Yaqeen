import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from "../../../components/InputField/InputField";
import Button from "../../../components/Button/Button";
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const input = userId.trim().toLowerCase();

        if (input.includes('admin')) {
            localStorage.setItem('userRole', 'admin');
            navigate('/admin/users');
        }
        else if (input.length > 3) {
            localStorage.setItem('userRole', 'employee');
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