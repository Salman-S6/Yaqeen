import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../../api/employeeService'; // 🟢 تم التعديل هنا
import RequestsTable from '../../../components/RequestsTable/RequestsTable';
import { FaFilter, FaSearch } from 'react-icons/fa';

const AdminRequestsPage = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchAllRequests = async () => {
            setLoading(true);
            try {
                // 🟢 استخدام employeeService المحدث
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
                console.error("خطأ في جلب بيانات الطلبات:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllRequests();
    }, []);

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.citizen_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (id) => {
        navigate(`/admin/review-request/${id}`);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#1e293b', fontSize: '24px' }}>السجل الشامل للطلبات</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>إدارة ومراقبة كافة المعاملات المسجلة في النظام</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '8px 15px', borderRadius: '8px', flex: 1 }}>
                    <FaSearch color="#94a3b8" style={{ marginLeft: '10px' }} />
                    <input
                        type="text"
                        placeholder="ابحث برقم الطلب أو اسم المواطن..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaFilter color="#64748b" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="all">جميع الحالات</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="approved">مقبول</option>
                        <option value="rejected">مرفوض</option>
                    </select>
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>جاري تحميل سجل الطلبات...</div>
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