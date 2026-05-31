import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../api/employeeService';
import { getApiErrorMessage, getResponseCollection, getResponseData } from '../utils/apiResponse';

export const useOCRMonitoring = () => {
    const [ocrData, setOcrData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await employeeService.getOcrLogs();
            const payload = getResponseData(response, {});
            const logs = getResponseCollection(payload.ocr_logs || payload.logs || payload.ocrLogs || []);

            setOcrData({
                kpis: payload.kpis || {},
                ocr_logs: {
                    data: logs
                }
            });
        } catch (err) {
            console.error('خطأ في جلب بيانات OCR من السيرفر:', err);
            setError(getApiErrorMessage(err, 'تعذر تحميل سجلات OCR. تحقق من تشغيل الباك إند ومن صحة رابط API.'));
            setOcrData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        ocrData,
        loading,
        error,
        refetch: fetchData
    };
};
