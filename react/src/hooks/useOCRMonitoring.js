import { useState, useEffect } from 'react';

export const useOCRMonitoring = () => {
    const [ocrData, setOcrData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // محاكاة جلب البيانات من الخادم
        const mockData = {
            summary: {
                activeEngine: "PaddleOCR / Tesseract", // دمج المحركات
                manualInterventions: 78,
                successRate: "94%"
            },
            rejectedRequests: [
                { id: 'REQ-000038', reason: 'صورة غير واضحة', confidence: '42%', engine: 'Tesseract', date: '4 أبريل 2026' },
                { id: 'REQ-000035', reason: 'انعكاس ضوئي', confidence: '58%', engine: 'Tesseract', date: '3 أبريل 2026' },
                { id: 'REQ-000033', reason: 'الهوية مقصوصة', confidence: '67%', engine: 'PaddleOCR', date: '3 أبريل 2026' },
                { id: 'REQ-000029', reason: 'خط يدوي غير مقروء', confidence: '39%', engine: 'Google Vision', date: '1 أبريل 2026' },
            ]
        };

        const timer = setTimeout(() => {
            setOcrData(mockData);
            setLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return { ocrData, loading };
};