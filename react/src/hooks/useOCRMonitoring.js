import { useState, useEffect } from 'react';
import { employeeService } from '../api/employeeService'; // تأكد من صحة مسار الاستيراد

export const useOCRMonitoring = () => {
    const [ocrData, setOcrData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await employeeService.getOcrLogs();
                
                // هنا نقوم بتمرير البيانات بالكامل كما وردت في الـ JSON الخاص بك
                // الـ response.data هي الكائن الذي يحتوي على { status, data: { kpis, ocr_logs } }
                setOcrData(response.data.data);
                
                setLoading(false);
            } catch (err) {
                console.error("خطأ في جلب بيانات OCR من السيرفر:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { ocrData, loading, error };
};