import React, { useEffect, useState, useCallback } from 'react';
import { FaUserCircle, FaEnvelope, FaIdCard, FaUserShield } from 'react-icons/fa';
import { authService } from '../../api/authService';
import { getApiErrorMessage, getResponseData } from '../../utils/apiResponse';
import { getStoredUser } from '../../utils/auth';
import styles from './UserProfilePage.module.css';

const UserProfilePage = () => {
    const [user, setUser] = useState(() => getStoredUser());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await authService.getProfile();
            const userData = getResponseData(response, null);

            if (userData && typeof userData === 'object') {
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (err) {
            console.error('فشل جلب بيانات الملف الشخصي:', err);
            setError(getApiErrorMessage(err, 'فشل تحميل بيانات الملف الشخصي.'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const getFullName = () => {
        if (!user) return '---';
        if (user.name) return user.name;
        if (user.full_name) return user.full_name;

        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();

        return fullName || '---';
    };

    const getRole = () => {
        if (!user) return localStorage.getItem('userRole') || '---';

        if (Array.isArray(user.roles) && user.roles.length > 0) {
            return user.roles[0]?.name || user.roles[0];
        }

        return user.role?.name || user.role || localStorage.getItem('userRole') || '---';
    };

    if (isLoading) {
        return <div className={styles.loading}>جاري تحميل بيانات الملف الشخصي...</div>;
    }

    if (error && !user) {
        return (
            <div className={styles.loading}>
                <p style={{ color: '#ef4444' }}>{error}</p>
                <button type="button" onClick={fetchProfile}>إعادة المحاولة</button>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {error && <div className={styles.warningBox}>{error}</div>}

            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>
                        <FaUserCircle />
                    </div>

                    <div>
                        <h2>{getFullName()}</h2>
                        <p>{getRole()}</p>
                    </div>
                </div>

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><FaUserCircle /></div>
                        <div>
                            <span>الاسم الكامل</span>
                            <strong>{getFullName()}</strong>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><FaEnvelope /></div>
                        <div>
                            <span>البريد الإلكتروني</span>
                            <strong>{user?.email || '---'}</strong>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><FaIdCard /></div>
                        <div>
                            <span>الرقم الوطني</span>
                            <strong>{user?.national_id || '---'}</strong>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><FaUserShield /></div>
                        <div>
                            <span>الدور داخل النظام</span>
                            <strong>{getRole()}</strong>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><FaUserShield /></div>
                        <div>
                            <span>حالة الحساب</span>
                            <strong>
                                {user?.status === 'active'
                                    ? 'نشط'
                                    : user?.status === 'inactive'
                                        ? 'غير نشط'
                                        : user?.status || '---'}
                            </strong>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><FaIdCard /></div>
                        <div>
                            <span>معرّف المستخدم</span>
                            <strong>{user?.id || '---'}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
