import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeRequestService } from '../../../api/employeeRequestService';
import Header from '../../../components/Header/Header';
import ToastNotification from '../../../components/Common/ToastNotification';
import CustomConfirmModal from '../../../components/Common/CustomConfirmModal';
import { FaSearch, FaFilter, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaEye } from 'react-icons/fa';
import styles from './PendingRequests.module.css';

const PendingRequestsPage = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]); // تبدأ بمصفوفة فارغة تماماً لضمان الاعتماد على الباك-إند فقط
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // حالات الفلترة المتقدمة (pending, approved, rejected)
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    // نظام التنبيه والمودال الموحد لبوابة يقين
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [confirmReview, setConfirmReview] = useState({ isOpen: false, requestId: null, citizenName: '' });

    const showNotification = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    // 🟢 جلب البيانات الفعلي والمأمن ضد أخطاء السيرفر (500)
    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await employeeRequestService.getPendingRequests();

            if (response && response.data) {
                const data = response.data.data ? response.data.data : response.data;
                setRequests(Array.isArray(data) ? data : []);
            } else {
                setRequests([]);
            }
        } catch (error) {
            console.error("فشل جلب الطلبات من الباك-إند:", error);

            const errorStatus = error.response?.status;
            let friendlyMessage = "فشل الاتصال بخادم المعاملات المركزي.";

            if (errorStatus === 500) {
                friendlyMessage = "خطأ داخلي في السيرفر (500): يرجى تحقق مسؤول الباك-إند من تكامل علاقات الأنساب وقاعدة البيانات.";
            } else if (error.response?.data?.message) {
                friendlyMessage = error.response.data.message;
            }

            showNotification(friendlyMessage, 'error');
            setRequests([]); // تأمين الجدول فارغاً بأمان في حال الانهيار
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const triggerReviewConfirmation = (req) => {
        const fullName = req.citizen ? `${req.citizen.first_name} ${req.citizen.last_name}` : 'غير معروف';
        setConfirmReview({ isOpen: true, requestId: req.id, citizenName: fullName });
    };

    const executeReviewRequest = async () => {
        const id = confirmReview.requestId;
        try {
            await employeeRequestService.reviewRequest(id);
            navigate(`/employee/review-request/${id}`);
        } catch (error) {
            console.warn("جاري التوجيه التلقائي للمعاينة الفورية...");
            navigate(`/employee/review-request/${id}`);
        } finally {
            setConfirmReview({ isOpen: false, requestId: null, citizenName: '' });
        }
    };

    // ترجمة الحالات القادمة من السيرفر إلى شارات ملونة وأنيقة
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className={`${styles.statusBadge} ${styles.pendingBadge}`}><FaHourglassHalf /> قيد الانتظار</span>;
            case 'approved':
                return <span className={`${styles.statusBadge} ${styles.approvedBadge}`}><FaCheckCircle /> مقبول</span>;
            case 'rejected':
                return <span className={`${styles.statusBadge} ${styles.rejectedBadge}`}><FaTimesCircle /> مرفوض</span>;
            default:
                return <span className={styles.statusBadge}>{status}</span>;
        }
    };

    // دمج فلترة البحث الصارم مع فلاتر القائمة المنسدلة المضافة
    const filteredRequests = requests.filter(req => {
        const reqNumber = (req.request_number || '').toLowerCase();
        const citizenName = req.citizen ? `${req.citizen.first_name} ${req.citizen.last_name}`.toLowerCase() : '';
        const serviceName = req.service_type ? (req.service_type.name || '').toLowerCase() : '';
        const search = searchTerm.toLowerCase();

        const matchesSearch = reqNumber.includes(search) || citizenName.includes(search) || serviceName.includes(search);
        const matchesStatus = statusFilter === 'all' ? true : req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className={styles.pageContainer}>
            <Header title="الطلبات المعلّقة" subtitle={`${requests.length} معاملات مسجلة بالنظام`} />

            <ToastNotification toast={toast} onClose={() => setToast({ ...toast, show: false })} />

            <div className={styles.mainContentCard}>
                <div className={styles.tableTopHeader}>
                    <h3 className={styles.tableTitle}>قائمة المعاملات ({filteredRequests.length})</h3>
                    <div className={styles.controlsWrapper}>
                        <div className={styles.searchBarContainer}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="بحث برقم المعاملة أو اسم المواطن..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.filterDropdownContainer}>
                            <button
                                className={`${styles.filterBtn} ${statusFilter !== 'all' ? styles.filterActive : ''}`}
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                title="تصفية حسب حالة الطلب"
                            >
                                <FaFilter />
                            </button>

                            {isFilterDropdownOpen && (
                                <div className={styles.filterMenu}>
                                    <div className={styles.filterMenuTitle}>تصفية حسب الحالة</div>
                                    <button className={`${styles.filterOption} ${statusFilter === 'all' ? styles.optionActive : ''}`} onClick={() => { setStatusFilter('all'); setIsFilterDropdownOpen(false); }}>كل الطلبات</button>
                                    <button className={`${styles.filterOption} ${statusFilter === 'pending' ? styles.optionActive : ''}`} onClick={() => { setStatusFilter('pending'); setIsFilterDropdownOpen(false); }}>قيد الانتظار</button>
                                    <button className={`${styles.filterOption} ${statusFilter === 'approved' ? styles.optionActive : ''}`} onClick={() => { setStatusFilter('approved'); setIsFilterDropdownOpen(false); }}>المقبولة</button>
                                    <button className={`${styles.filterOption} ${statusFilter === 'rejected' ? styles.optionActive : ''}`} onClick={() => { setStatusFilter('rejected'); setIsFilterDropdownOpen(false); }}>المرفوضة</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className={styles.loadingText}>جاري جلب المعاملات الحية من السيرفر وتحديث لوحة التحكم...</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.requestsTable}>
                            <thead>
                                <tr>
                                    <th>رقم المعاملة</th>
                                    <th>المواطن صاحب الطلب</th>
                                    <th>نوع الخدمة الرقمية</th>
                                    <th>تاريخ ووقت التقديم</th>
                                    <th>حالة الطلب</th>
                                    <th>الإجراء</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td className={`${styles.reqIdText} ${styles.normalIdText}`}>
                                            {req.request_number}
                                        </td>
                                        <td className={styles.citizenName}>
                                            {req.citizen ? `${req.citizen.first_name} ${req.citizen.last_name}` : '---'}
                                        </td>
                                        <td className={styles.serviceName}>
                                            {req.service_type ? req.service_type.name : '---'}
                                        </td>
                                        <td className={styles.dateText}>
                                            {req.submitted_at || '---'}
                                        </td>
                                        <td>
                                            {renderStatusBadge(req.status)}
                                        </td>
                                        <td>
                                            <button
                                                className={`${styles.reviewBtn} ${styles.btnActiveGreen}`}
                                                onClick={() => triggerReviewConfirmation(req)}
                                            >
                                                مراجعة
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#a0aec0', fontWeight: '600' }}>
                                            لا توجد معاملات حية مسجلة بالسيرفر حالياً.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <CustomConfirmModal
                isOpen={confirmReview.isOpen}
                title="تأكيد سحب ومعالجة المعاملة"
                description={`هل أنت متأكد من بدء مراجعة وتدقيق المعاملة الخاصة بالمواطن (${confirmReview.citizenName})؟ سيتم فتح صفحة التدقيق الشاملة فوراً.`}
                isDanger={false}
                onClose={() => setConfirmReview({ isOpen: false, requestId: null, citizenName: '' })}
                onConfirm={executeReviewRequest}
            />
        </div>
    );
};

export default PendingRequestsPage;