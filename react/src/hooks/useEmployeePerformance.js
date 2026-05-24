import { useState, useEffect } from 'react';

export const useEmployeePerformance = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("1. بدء تشغيل الهوك..."); // تتبع المشكلة

        // استخدمنا بيانات ثابتة وآمنة لضمان عمل الواجهة أولاً
        const safeData = {
            summary: {
                topPerformer: "منال الحسن",
                avgEfficiency: "88%",
                totalViolations: 8
            },
            employees: [
                { id: 1, name: 'منال الحسن', requests: 47, avgTime: '2.4 ساعة', slaViolations: 0, approvalRate: '96%', performance: 95 },
                { id: 2, name: 'كمال الزيد', requests: 41, avgTime: '2.9 ساعة', slaViolations: 1, approvalRate: '93%', performance: 85 },
                { id: 3, name: 'رامي السيد', requests: 38, avgTime: '3.1 ساعة', slaViolations: 2, approvalRate: '91%', performance: 72 },
                { id: 4, name: 'سمر العلي', requests: 29, avgTime: '4.8 ساعة', slaViolations: 5, approvalRate: '82%', performance: 45 },
                { id: 5, name: 'خالد أحمد', requests: 35, avgTime: '3.5 ساعة', slaViolations: 0, approvalRate: '88%', performance: 78 }
            ]
        };

        const timer = setTimeout(() => {
            console.log("2. جلب البيانات نجح، يتم الآن تحديث الواجهة...");
            setStats(safeData);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return { stats, loading };
};