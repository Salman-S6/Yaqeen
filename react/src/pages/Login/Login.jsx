import React, { useState } from 'react';
import { authService } from '../../api/authService';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import { getApiErrorMessage } from '../../utils/apiResponse';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError('');
        setLoading(true);

        try {
            const response = await authService.login({
                email: email.trim(),
                password
            });

            const responseData = response.data;
            const token = responseData?.token || responseData?.access_token;
            const user = responseData?.user || responseData?.data || responseData;

            if (!token || !user || typeof user !== 'object') {
                throw new Error('بيانات المستخدم غير مكتملة');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            let role = 'employee';
            if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
                role = user.roles[0]?.name || user.roles[0];
            } else if (user.role) {
                role = user.role?.name || user.role;
            }

            localStorage.setItem('userRole', role);

            const normalizedRole = String(role).toLowerCase();

            if (normalizedRole === 'admin' || normalizedRole === 'مدير النظام') {
                window.location.replace('/admin/users');
            } else {
                window.location.replace('/employee/dashboard');
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError(getApiErrorMessage(err, 'فشل تسجيل الدخول، يرجى التأكد من البيانات'));
        } finally {
            setLoading(false);
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
                        label="البريد الإلكتروني"
                        type="email"
                        placeholder="أدخل البريد الإلكتروني الوظيفي"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="username"
                    />

                    <InputField
                        label="كلمة المرور"
                        type="password"
                        placeholder="أدخل كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="current-password"
                    />

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <div className={styles.forgotPassword}>
                        <button
                            type="button"
                            className={styles.supportLink}
                            onClick={() => setError('يرجى التواصل مع مدير النظام أو الدعم الفني لإعادة تعيين كلمة المرور.')}
                        >
                            نسيت كلمة المرور؟ تواصل مع الدعم الفني
                        </button>
                    </div>

                    <Button
                        text={loading ? 'جاري الدخول...' : 'دخول إلى النظام'}
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    />

                    <div className={styles.alertBox}>
                        <span className={styles.warningMessage}>⚠️ الدخول مصرح فقط لموظفي منصة يقين</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
