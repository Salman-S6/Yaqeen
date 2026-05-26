import React, { useState, useEffect } from 'react';
import { employeeService } from '../../../api/employeeService';
import Header from '../../../components/Header/Header';
import DeleteConfirmModal from '../../../components/Modals/DeleteConfirmModal';
import EmployeeFormModal from '../../../components/Modals/EmployeeFormModal';
import { FaUserPlus, FaSearch, FaTrash, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import styles from './AdminUsersPage.module.css';

const AdminUsersPage = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('team');

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, employeeId: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userStatus, setUserStatus] = useState('active');

    const showNotification = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const response = await employeeService.getAll();
            const data = response.data && response.data.data ? response.data.data : response.data;
            setEmployees(Array.isArray(data) ? data : []);
        } catch (error) {
            showNotification(error.response?.data?.message || "فشل الاتصال بالخادم الرئيسي.", 'error');
            setEmployees([]);
        } finally { setIsLoading(false); }
    };

    useEffect(() => { if (activeTab === 'team') fetchEmployees(); }, [activeTab]);

    const handleOpenAddModal = () => {
        setIsAddMode(true); setSelectedEmployee(null); resetForm(); setIsModalOpen(true);
    };

    const handleOpenEditModal = (emp) => {
        setIsAddMode(false); setSelectedEmployee(emp);
        setFirstName(emp.first_name || ''); setLastName(emp.last_name || '');
        setNationalId(emp.national_id || ''); setUserEmail(emp.email || '');
        setPassword(''); setUserStatus(emp.status === 'active' ? 'active' : 'inactive');
        setIsModalOpen(true);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim() || !nationalId.trim() || !userEmail.trim()) {
            return showNotification("الرجاء ملء كافة الحقول المخصصة", "error");
        }
        if (isAddMode && !password.trim()) return showNotification("الرجاء إدخال كلمة المرور", "error");

        const payload = { first_name: firstName, last_name: lastName, national_id: nationalId, email: userEmail, status: userStatus };
        if (password.trim()) payload.password = password;

        try {
            if (isAddMode) {
                const response = await employeeService.create(payload);
                const created = response.data && response.data.data ? response.data.data : response.data;
                setEmployees(prev => [...prev, created]);
                showNotification(response.data?.message || "تم إنشاء حساب الموظف.", 'success');
            } else {
                const response = await employeeService.update(selectedEmployee.id, payload);
                const updated = response.data && response.data.data ? response.data.data : response.data;
                setEmployees(prev => prev.map(emp => emp.id === selectedEmployee.id ? { ...emp, ...updated } : emp));
                showNotification(response.data?.message || "تم تحديث بيانات الموظف بنجاح.", 'success');
            }
            setIsModalOpen(false); resetForm();
        } catch (error) {
            showNotification(error.response?.data?.message || "فشل التحديث، تفقد المدخلات.", 'error');
        }
    };

    const executeDeleteEmployee = async () => {
        const id = confirmDelete.employeeId;
        try {
            const response = await employeeService.delete(id);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
            showNotification(response.data?.message || "تم سحب الصلاحيات بنجاح.", 'success');
        } catch (error) { showNotification(error.response?.data?.message || "فشل الحذف.", 'error'); }
        finally { setConfirmDelete({ isOpen: false, employeeId: null }); }
    };

    const resetForm = () => {
        setFirstName(''); setLastName(''); setNationalId(''); setUserEmail(''); setPassword(''); setUserStatus('active');
    };

    const filteredEmployees = employees.filter(emp => {
        const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.pageContainer}>
            <Header title="إدارة النظام" subtitle="admin" />

            {toast.show && (
                <div className={`${styles.toastNotification} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
                    <div className={styles.toastBody}>
                        {toast.type === 'success' ? <FaCheckCircle className={styles.toastIcon} /> : <FaExclamationCircle className={styles.toastIcon} />}
                        <span className={styles.toastMessage}>{toast.message}</span>
                    </div>
                    <button className={styles.toastCloseBtn} onClick={() => setToast({ ...toast, show: false })}><FaTimes /></button>
                </div>
            )}

            <div className={styles.mainContentCard}>
                <div className={styles.pageTitleSection}>
                    {activeTab === 'team' && <button className={styles.addEmployeeBtn} onClick={handleOpenAddModal}><FaUserPlus /> إضافة موظف جديد</button>}
                    <div className={styles.titleInfo}><h2>إدارة المستخدمين</h2><p>إدارة صلاحيات الموظفين وسجلات المواطنين في النظام</p></div>
                </div>

                <div className={styles.tabsContainer}>
                    <button className={`${styles.tabBtn} ${activeTab === 'citizens' ? styles.activeTab : ''}`} onClick={() => setActiveTab('citizens')}>سجل المواطنين</button>
                    <button className={`${styles.tabBtn} ${activeTab === 'team' ? styles.activeTab : ''}`} onClick={() => setActiveTab('team')}>الفريق الوظيفي</button>
                </div>

                {activeTab === 'team' ? (
                    <>
                        <div className={styles.searchSection}>
                            <div className={styles.searchBarContainer}><FaSearch className={styles.searchIcon} /><input type="text" placeholder="بحث بالاسم أو البريد الإلكتروني..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} /></div>
                        </div>

                        {isLoading ? <div style={{ textAlign: 'center', padding: '40px', color: '#00a65a', fontWeight: 'bold' }}>جاري المزامنة...</div> : (
                            <div className={styles.tableWrapper}>
                                <table className={styles.usersTable}>
                                    <thead><tr><th>الاسم الكامل</th><th>الرقم الوطني</th><th>البريد الإلكتروني</th><th>الحالة</th><th>الإجراءات</th></tr></thead>
                                    <tbody>
                                        {filteredEmployees.map((emp) => (
                                            <tr key={emp.id}>
                                                <td className={styles.userNameText}>{emp.first_name} {emp.last_name}</td>
                                                <td style={{ fontWeight: '600', color: '#4a5568' }}>{emp.national_id || '---'}</td>
                                                <td className={styles.userEmailText}>{emp.email}</td>
                                                <td><span className={`${styles.statusBadge} ${emp.status === 'active' ? styles.active : styles.suspended}`}>{emp.status === 'active' ? 'نشط' : 'معلق'}</span></td>
                                                <td>
                                                    <div className={styles.actionsContainer}>
                                                        <button className={styles.statusToggleBtn} onClick={() => handleOpenEditModal(emp)}>تعديل</button>
                                                        <button className={styles.deleteUserBtn} onClick={() => setConfirmDelete({ isOpen: true, employeeId: emp.id })}><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : <div className={styles.emptyState}>سجل المواطنين مرتبط بقاعدة البيانات المركزية للهوية الشخصية.</div>}
            </div>

            {/* النوافذ المنبثقة المستدعاة برشق ونظافة تامة */}
            <DeleteConfirmModal isOpen={confirmDelete.isOpen} onClose={() => setConfirmDelete({ isOpen: false, employeeId: null })} onConfirm={executeDeleteEmployee} />

            <EmployeeFormModal
                isOpen={isModalOpen} isAddMode={isAddMode} onClose={() => setIsModalOpen(false)} onSave={handleSaveChanges}
                firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName}
                nationalId={nationalId} setNationalId={setNationalId} userEmail={userEmail} setUserEmail={setUserEmail}
                password={password} setPassword={setPassword} userStatus={userStatus} setUserStatus={setUserStatus}
            />
        </div>
    );
};

export default AdminUsersPage;