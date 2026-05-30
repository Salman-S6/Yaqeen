import { Navigate } from 'react-router-dom';

// خريطة لتحويل الأدوار العربية والإنجليزية إلى قيم موحدة
const roleMap = {
    employee: 'employee',
    'موظف': 'employee',
    admin: 'admin',
    'مدير النظام': 'admin'
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    // قراءة الدور من LocalStorage (يمكن أن يكون بالعربية أو الإنجليزية)
    const rawRole = localStorage.getItem('userRole');
    // تحويل الدور إلى قيمة موحدة حسب الخريطة
    const canonicalRole = rawRole && roleMap[rawRole] ? roleMap[rawRole] : rawRole;
    const roleKey = canonicalRole ? canonicalRole.toLowerCase() : null;

    // التحقق من أن الدور موجود ضمن الأدوار المسموح بها (مع تحويل الأدوار العربية)
    const isAllowed = roleKey && allowedRoles.some((role) => {
        const canonicalAllowed = roleMap[role] ? roleMap[role] : role;
        return canonicalAllowed.toLowerCase() === roleKey;
    });
    
    // إذا كان الدور غير صالح أو غير مسموح به، إعادة التوجيه لصفحة الدخول
    if (!isAllowed) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;