import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../../api/employeeService';
import RequestsTable from '../../../components/RequestsTable/RequestsTable';
import { FaFilter, FaSearch, FaChevronDown } from 'react-icons/fa';

const STATUS_OPTIONS = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'approved', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' }
];

const AdminRequestsPage = () => {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const fetchAllRequests = async () => {
            setLoading(true);

            try {
                const response = await employeeService.getAllRequests();
                const rawData = response.data?.data || response.data || [];

                const mappedData = rawData.map(req => ({
                    id: req.id,
                    request_number: req.request_number,
                    citizen_name: `${req.citizen?.first_name || ''} ${req.citizen?.last_name || ''}`,
                    service_type: req.service_type?.name || 'غير محدد',
                    submitted_date: req.submitted_at?.split(' ')[0] || req.submitted_at,
                    status: req.status
                }));

                setRequests(mappedData);
            } catch (error) {
                console.error('خطأ في جلب بيانات الطلبات:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllRequests();
    }, []);

    const filteredRequests = requests.filter(req => {
        const requestNumber = req.request_number || '';
        const citizenName = req.citizen_name || '';

        const matchesSearch =
            requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            citizenName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (id) => {
        navigate(`/admin/review-request/${id}`);
    };

    const selectedStatusLabel =
        STATUS_OPTIONS.find(option => option.value === filterStatus)?.label || 'جميع الحالات';

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: '800' }}>
                        السجل الشامل للطلبات
                    </h1>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        إدارة ومراقبة كافة المعاملات المسجلة في النظام
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '20px',
                    backgroundColor: '#fff',
                    padding: '15px',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    alignItems: 'center'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#f1f5f9',
                        padding: '8px 15px',
                        borderRadius: '8px',
                        flex: 1,
                        border: '1px solid #e2e8f0'
                    }}
                >
                    <FaSearch color="#00a65a" style={{ marginLeft: '10px', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="ابحث برقم الطلب أو اسم المواطن..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            outline: 'none',
                            width: '100%',
                            fontSize: '14px',
                            color: '#334155'
                        }}
                    />
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 50 }}>
                    <FaFilter color="#00a65a" />

                    <button
                        type="button"
                        onClick={() => setIsFilterOpen(prev => !prev)}
                        style={{
                            minWidth: '160px',
                            height: '40px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #00a65a',
                            backgroundColor: '#e6f6ec',
                            color: '#117b34',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            direction: 'rtl',
                            boxShadow: isFilterOpen ? '0 0 0 3px rgba(0, 166, 90, 0.12)' : 'none'
                        }}
                    >
                        <span>{selectedStatusLabel}</span>
                        <FaChevronDown
                            size={11}
                            style={{
                                transition: 'transform 0.2s',
                                transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                        />
                    </button>

                    {isFilterOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '48px',
                                right: '28px',
                                width: '160px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #d1fae5',
                                borderRadius: '8px',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                                overflow: 'hidden',
                                zIndex: 999999
                            }}
                        >
                            {STATUS_OPTIONS.map(option => {
                                const isActive = filterStatus === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setFilterStatus(option.value);
                                            setIsFilterOpen(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '10px 14px',
                                            border: 'none',
                                            backgroundColor: isActive ? '#00a65a' : '#ffffff',
                                            color: isActive ? '#ffffff' : '#334155',
                                            fontSize: '13px',
                                            fontWeight: isActive ? '700' : '600',
                                            cursor: 'pointer',
                                            textAlign: 'right',
                                            transition: '0.2s'
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>
                        جاري تحميل سجل الطلبات...
                    </div>
                ) : (
                    <RequestsTable
                        data={filteredRequests}
                        onReview={handleViewDetails}
                        isAdminMode={true}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminRequestsPage;
