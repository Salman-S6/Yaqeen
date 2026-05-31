import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { clearAuthData, getPrimaryRole, normalizeRole } from '../../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const rolesKey = useMemo(() => allowedRoles.map((role) => normalizeRole(role)).join('|'), [allowedRoles]);
    const [loading, setLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                clearAuthData();
                setIsAllowed(false);
                setLoading(false);
                return;
            }

            try {
                const response = await authService.getProfile();

                const user =
                    response.data?.user ||
                    response.data?.data ||
                    response.data;

                const realRole = getPrimaryRole(user);
                const normalizedRealRole = normalizeRole(realRole);

                const allowed = rolesKey.split('|').includes(normalizedRealRole);

                if (!allowed) {
                    setIsAllowed(false);
                    setLoading(false);
                    return;
                }

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userRole', normalizedRealRole);

                if (user?.email) {
                    localStorage.setItem('userEmail', user.email);
                }

                setIsAllowed(true);
            } catch (error) {
                console.error('فشل التحقق من صلاحية المستخدم:', error);
                clearAuthData();
                setIsAllowed(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [rolesKey]);

    if (loading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    direction: 'rtl',
                    color: '#2d5a4c',
                    fontWeight: '700',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                جاري التحقق من الصلاحيات...
            </div>
        );
    }

    if (!isAllowed) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;