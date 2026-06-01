import React, { useState, useEffect, useCallback } from 'react';
import { serviceTypeService } from '../../api/serviceTypeService';
import { getApiErrorMessage, getResponseCollection, getResponseData } from '../../utils/apiResponse';
import AdminStatCard from '../../components/AdminStatCard/AdminStatCard';
import ServicesTable from '../../components/ServicesTable/ServicesTable';
import ServiceFormModal from '../../components/Modals/ServiceFormModal';
import { useToast } from '../../components/Common/ToastProvider';
import CustomConfirmModal from '../../components/Common/CustomConfirmModal';
import { FaServer, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from './AdminServicesPage.module.css';

const AdminServicesPage = () => {
    const [servicesList, setServicesList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [pageError, setPageError] = useState('');

    const { showToast } = useToast();
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, serviceId: null });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [modalName, setModalName] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const [modalActive, setModalActive] = useState('1');

    const fetchServices = useCallback(async () => {
        try {
            setIsLoadingPage(true);
            setPageError('');
            const response = await serviceTypeService.getAll();
            setServicesList(getResponseCollection(response));
        } catch (error) {
            console.error("فشل جلب البيانات من الـ API الحقيقي:", error);
            const message = getApiErrorMessage(error, "فشل جلب البيانات من الخادم.");
            setPageError(message);
            showToast(message, "error");
        } finally {
            setIsLoadingPage(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const triggerDeleteConfirmation = (id) => {
        setConfirmDelete({ isOpen: true, serviceId: id });
    };

    const executeDeleteService = async () => {
        const id = confirmDelete.serviceId;
        try {
            const response = await serviceTypeService.delete(id);
            setServicesList(prev => prev.filter(service => service.id !== id));
            showToast(response.data?.message || "تم حذف الخدمة الحكومية بنجاح.", "success");
        } catch (error) {
            console.error("خطأ أثناء الحذف:", error);
            showToast(getApiErrorMessage(error, "فشل حذف الخدمة من السيرفر."), "error");
        } finally {
            setConfirmDelete({ isOpen: false, serviceId: null });
        }
    };

    const handleOpenEditModal = (service) => {
        setIsAddMode(false);
        setSelectedService(service);
        setModalName(service.name);
        setModalDescription(service.description || '');
        setModalActive(service.is_active == true || service.is_active == 1 ? '1' : '0');
        setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setIsAddMode(true);
        setModalName('');
        setModalDescription('');
        setModalActive('1');
        setIsModalOpen(true);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!modalName.trim()) return showToast("الرجاء إدخال اسم الخدمة الحكومية", "error");

        const payload = {
            name: modalName,
            description: modalDescription,
            is_active: parseInt(modalActive, 10)
        };

        try {
            if (isAddMode) {
                const response = await serviceTypeService.create(payload);
                const newService = getResponseData(response);
                setServicesList(prev => [...prev, newService]);
                showToast(response.data?.message || "تم إضافة الخدمة الجديدة بنجاح للمنصة.", "success");
            } else {
                const response = await serviceTypeService.update(selectedService.id, payload);
                const updatedService = getResponseData(response);

                setServicesList(prev => prev.map(s =>
                    s.id === selectedService.id ? { ...s, ...updatedService } : s
                ));
                showToast(response.data?.message || "تم تحديث بيانات الخدمة بنجاح.", "success");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("خطأ أثناء حفظ التغييرات:", error);
            const backendErrorMsg = getApiErrorMessage(error, "فشل في حفظ البيانات على السيرفر.");
            showToast(backendErrorMsg, "error");
        }
    };

    const totalServices = servicesList.length;
    const activeServices = servicesList.filter(s => s.is_active == true || s.is_active == 1 || s.is_active == "1").length;
    const inactiveServices = totalServices - activeServices;

    const summaryStats = [
        { id: 1, title: 'إجمالي الخدمات المتاحة', value: totalServices, icon: <FaServer style={{ color: '#3182ce', fontSize: '24px' }} /> },
        { id: 2, title: 'الخدمات النشطة الآن', value: activeServices, icon: <FaCheckCircle style={{ color: '#00a65a', fontSize: '24px' }} /> },
        { id: 3, title: 'خدمات معطلة', value: inactiveServices, icon: <FaTimesCircle style={{ color: '#c53030', fontSize: '24px' }} /> }
    ];

    const filteredServices = servicesList.filter(service =>
        service.name && service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.statsGrid}>
                {summaryStats.map((stat) => (
                    <AdminStatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
                ))}
            </div>

            {isLoadingPage ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#00a65a', fontWeight: 'bold' }}>
                    جاري الاتصال بقاعدة بيانات يقين وجلب البيانات الحية...
                </div>
            ) : pageError ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444', fontWeight: 'bold' }}>
                    <p>{pageError}</p>
                    <button type="button" onClick={fetchServices} style={{ border: 'none', background: '#007c4d', color: '#fff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                        إعادة المحاولة
                    </button>
                </div>
            ) : (
                <ServicesTable
                    services={filteredServices}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onEditClick={handleOpenEditModal}
                    onDeleteClick={triggerDeleteConfirmation}
                    onAddClick={handleOpenAddModal}
                />
            )}

            <CustomConfirmModal
                isOpen={confirmDelete.isOpen}
                title="تأكيد حذف الخدمة الرقمية"
                description="هل أنت متأكد من حذف هذه الخدمة نهائياً من نظام يقين؟ لا يمكن التراجع عن هذا الإجراء."
                onClose={() => setConfirmDelete({ isOpen: false, serviceId: null })}
                onConfirm={executeDeleteService}
            />

            <ServiceFormModal
                isOpen={isModalOpen}
                isAddMode={isAddMode}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveChanges}
                modalName={modalName}
                setModalName={setModalName}
                modalDescription={modalDescription}
                setModalDescription={setModalDescription}
                modalActive={modalActive}
                setModalActive={setModalActive}
            />
        </div>
    );
};

export default AdminServicesPage;