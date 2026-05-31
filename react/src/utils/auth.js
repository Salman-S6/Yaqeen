export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
};

export const normalizeRole = (role) => {
    if (!role) return null;

    if (typeof role === 'object') {
        if (role.name) return normalizeRole(role.name);
        if (role.role) return normalizeRole(role.role);
        if (role.title) return normalizeRole(role.title);
        return null;
    }

    const value = String(role).trim();
    const lowerValue = value.toLowerCase();

    const roleMap = {
        admin: 'admin',
        employee: 'employee',
        'مدير النظام': 'admin',
        'موظف': 'employee',
        'موظف النظام': 'employee'
    };

    return roleMap[value] || roleMap[lowerValue] || lowerValue;
};

export const getPrimaryRole = (user) => {
    if (!user) return null;

    if (Array.isArray(user.roles) && user.roles.length > 0) {
        return normalizeRole(user.roles[0]);
    }

    if (user.role) {
        return normalizeRole(user.role);
    }

    return null;
};

export const getStoredUser = () => {
    const savedUser = localStorage.getItem('user');

    if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
        return null;
    }

    try {
        return JSON.parse(savedUser);
    } catch {
        clearAuthData();
        return null;
    }
};

export const handleUnauthorized = () => {
    clearAuthData();

    if (window.location.pathname !== '/login') {
        window.location.replace('/login');
    }
};