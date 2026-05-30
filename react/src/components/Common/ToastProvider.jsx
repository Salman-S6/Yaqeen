/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimes
} from 'react-icons/fa';
import styles from './ToastProvider.module.css';

const ToastContext = createContext(null);

const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    warning: <FaExclamationTriangle />,
    info: <FaInfoCircle />
};

const titles = {
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    warning: 'تنبيه',
    info: 'معلومة'
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));

        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }
    }, []);

    const showToast = useCallback((messageOrOptions, type = 'success', duration = 4000) => {
        const options = typeof messageOrOptions === 'object'
            ? messageOrOptions
            : { message: messageOrOptions, type, duration };

        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const toastType = options.type || 'success';
        const toastDuration = options.duration ?? duration;

        const toast = {
            id,
            type: toastType,
            title: options.title || titles[toastType] || titles.info,
            message: options.message || '',
            duration: toastDuration
        };

        setToasts((prev) => [toast, ...prev].slice(0, 4));

        if (toastDuration !== 0) {
            timersRef.current[id] = setTimeout(() => {
                removeToast(id);
            }, toastDuration);
        }

        return id;
    }, [removeToast]);

    const clearToasts = useCallback(() => {
        Object.values(timersRef.current).forEach(clearTimeout);
        timersRef.current = {};
        setToasts([]);
    }, []);

    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach(clearTimeout);
        };
    }, []);

    const value = useMemo(() => ({ showToast, removeToast, clearToasts }), [showToast, removeToast, clearToasts]);

    return (
        <ToastContext.Provider value={value}>
            {children}

            {createPortal(
                <div className={styles.toastStack} dir="rtl">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`${styles.toastCard} ${styles[toast.type] || styles.info}`}
                            role="status"
                            aria-live="polite"
                        >
                            <div className={styles.toastIcon}>
                                {icons[toast.type] || icons.info}
                            </div>

                            <div className={styles.toastContent}>
                                <div className={styles.toastTitle}>{toast.title}</div>
                                <div className={styles.toastMessage}>{toast.message}</div>
                            </div>

                            <button
                                type="button"
                                className={styles.toastCloseBtn}
                                onClick={() => removeToast(toast.id)}
                                aria-label="إغلاق الإشعار"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used inside ToastProvider');
    }

    return context;
};

export const RouteToastListener = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        const routeToast = location.state?.toast;

        if (!routeToast) return;

        showToast({
            message: routeToast.message,
            type: routeToast.type || 'success',
            title: routeToast.title,
            duration: routeToast.duration ?? 4000
        });

        const nextState = { ...(location.state || {}) };
        delete nextState.toast;

        navigate(`${location.pathname}${location.search}`, {
            replace: true,
            state: Object.keys(nextState).length ? nextState : null
        });
    }, [location.pathname, location.search, location.state, navigate, showToast]);

    return null;
};
