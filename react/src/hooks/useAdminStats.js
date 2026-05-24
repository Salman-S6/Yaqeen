import { useState, useEffect } from 'react';

export const useAdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // محاكاة البيانات الحقيقية من نظام "يَقِين"
                const mockData = {
                    summary: [
                        { title: "إجمالي الطلبات", value: 1247, trend: "12% عن الشهر الماضي", trendType: "up", color: "#2563eb" },
                        { title: "نسبة القبول", value: "89%", trend: "3% تحسن", trendType: "up", color: "#10b981" },
                        { title: "وقت المعالجة", value: 3.2, trend: "ساعات", trendType: "neutral", color: "#f59e0b" },
                        { title: "مستخدمون جدد", value: 324, trend: "18 اليوم", trendType: "up", color: "#8b5cf6" }
                    ],
                    dailyRequests: [
                        { name: 'السبت', count: 400 },
                        { name: 'الأحد', count: 650 },
                        { name: 'الاثنين', count: 300 },
                        { name: 'الثلاثاء', count: 800 },
                        { name: 'الأربعاء', count: 450 },
                        { name: 'الخميس', count: 320 },
                        { name: 'الجمعة', count: 500 }
                    ],
                    statusDistribution: [
                        { name: 'مقبولة', value: 50, color: '#10b981' },
                        { name: 'مرفوضة', value: 50, color: '#ef4444' }
                    ]
                };

                setStats(mockData);
                setLoading(false);
                setError(null);
            } catch (err) {
                setError("فشل تحديث البيانات");
                setLoading(false);
            }
        };

        fetchStats();
        const pollingInterval = setInterval(fetchStats, 60000);
        return () => clearInterval(pollingInterval);
    }, []);

    return { stats, loading, error };
};