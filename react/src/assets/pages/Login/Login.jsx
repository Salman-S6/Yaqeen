import React, { useState } from 'react';
import { authService } from '../../../api/authService'; 
import InputField from "../../../components/InputField/InputField";
import Button from "../../../components/Button/Button";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 🟢 استيراد أيقونات العين
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 🟢 حالة إظهار كلمة المرور

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({
                email: email.trim(),
                password: password
            });

            const responseData = response.data; 
            const token = responseData?.token || responseData?.access_token; 
            const user = responseData?.user || responseData?.data || responseData; 

            if (!token || !user) {
                throw new Error("بيانات المستخدم غير مكتملة");
            }

            // التخزين في LocalStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // سحب الصلاحية وتوجيه المستخدم
            let role = 'employee'; 
            if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
                role = user.roles[0]; 
            } else if (user.role) {
                role = user.role; 
            }

            localStorage.setItem('userRole', role);

            const normalizedRole = String(role).toLowerCase();
            
            if (normalizedRole === 'admin' || normalizedRole === 'مدير النظام') {
                window.location.replace('/admin/users'); 
            } else {
                window.location.replace('/employee/dashboard');
            }

        } catch (err) {
            console.error("Login Error:", err);
            const serverMessage = err.response?.data?.message 
                || err.response?.data?.error 
                || 'فشل تسجيل الدخول، يرجى التأكد من البيانات';
            setError(serverMessage);
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
                        placeholder="admin@yaqeen.test"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="username" 
                    />
                    
                    {/* 🟢 الحاوية الذكية لكلمة المرور والأيقونة */}
                    <div className={styles.passwordContainer}>
                        <InputField
                            label="كلمة المرور"
                            type={showPassword ? "text" : "password"} // 🟢 تغيير النوع ديناميكياً
                            placeholder="........"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />
                        <span 
                            className={styles.passwordIcon} 
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}
                    
                    <div className={styles.forgotPassword}>
                        <a href="#">نسيت كلمة المرور؟ تواصل مع الدعم الفني</a>
                    </div>
                    
                    <Button
                        text={loading ? "جاري الدخول..." : "دخول إلى النظام"}
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