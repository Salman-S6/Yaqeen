import React, { useState, useEffect, useCallback } from 'react';
import { employeeService } from "../../../api/employeeService";
import DeleteConfirmModal from '../../../components/Modals/DeleteConfirmModal';
import EmployeeFormModal from '../../../components/Modals/EmployeeFormModal';
import EmployeePermissionsModal from '../../../components/Modals/EmployeePermissionsModal'; // 🟢 استيراد مودال الصلاحيات
import CitizensTable from '../../../components/CitizensTable/CitizensTable';
import { useToast } from '../../../components/Common/ToastProvider';
import { FaUserPlus, FaSearch, FaTrash, FaTimes, FaIdCard } from 'react-icons/fa';
import styles from './AdminUsersPage.module.css';

const AdminUsersPage = () => {
    // حالات الفريق الوظيفي
    const [employees, setEmployees] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, employeeId: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // 🟢 حالة مودال الصلاحيات
    const [permissionsModal, setPermissionsModal] = useState({ isOpen: false, employeeId: null, employeeName: '' });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userStatus, setUserStatus] = useState('active');

    // حالات المواطنين
    const [citizens, setCitizens] = useState([]);
    const [selectedCitizenDetails, setSelectedCitizenDetails] = useState(null);
    const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);

    // حالات عامة
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('team'); // تم جعله الافتراضي لرؤية الموظفين أسرع
    const { showToast } = useToast();

    const showNotification = useCallback((message, type = 'success') => {
        showToast(message, type);
    }, [showToast]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'team') {
                const response = await employeeService.getAll();
                const data = response.data?.data || response.data || [];
                setEmployees(Array.isArray(data) ? data : []);
            } else if (activeTab === 'citizens') {
                const response = await employeeService.getCitizens();
                const data = response.data?.data?.data || [];
                setCitizens(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            showNotification(error.response?.data?.message || "فشل الاتصال بالخادم الرئيسي.", 'error');
            if(activeTab === 'team') setEmployees([]);
            if(activeTab === 'citizens') setCitizens([]);
        } finally { 
            setIsLoading(false); 
        }
    }, [activeTab, showNotification]);

    useEffect(() => {
        fetchData();
        setSearchTerm(''); 
    }, [fetchData]);

    const handleToggleCitizenStatus = async (id) => {
        try {
            await employeeService.toggleCitizenStatus(id);
            setCitizens(prev => prev.map(c => 
                c.id === id ? { ...c, account_status: c.account_status === 'active' ? 'suspended' : 'active' } : c
            ));
            showNotification("تم تغيير حالة حساب المواطن بنجاح", "success");
        } catch (error) {
            console.error("خطأ أثناء تغيير حالة المواطن:", error);
            showNotification("حدث خطأ أثناء تغيير حالة المواطن", "error");
        }
    };

    const handleViewCitizenDetails = async (id) => {
        try {
            setIsLoading(true);
            const response = await employeeService.getCitizenDetails(id);
            setSelectedCitizenDetails(response.data?.data);
            setIsCitizenModalOpen(true);
        } catch (error) {
            console.error("فشل جلب تفاصيل المواطن:", error);
            showNotification("فشل جلب تفاصيل المواطن.", "error");
        } finally {
            setIsLoading(false);
        }
    };

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

    const filteredCitizens = citizens.filter(c => {
        const fullName = (c.full_name || '').toLowerCase();
        const nId = (c.national_id || '').toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || nId.includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.pageContainer}>
            <div className={styles.mainContentCard}>
                <div className={styles.pageTitleSection}>
                    {activeTab === 'team' && <button className={styles.addEmployeeBtn} onClick={handleOpenAddModal}><FaUserPlus /> إضافة موظف جديد</button>}
                    <div className={styles.titleInfo}><h2>إدارة المستخدمين</h2><p>إدارة صلاحيات الموظفين وسجلات المواطنين في النظام</p></div>
                </div>

                <div className={styles.tabsContainer}>
                    <button className={`${styles.tabBtn} ${activeTab === 'citizens' ? styles.activeTab : ''}`} onClick={() => setActiveTab('citizens')}>سجل المواطنين</button>
                    <button className={`${styles.tabBtn} ${activeTab === 'team' ? styles.activeTab : ''}`} onClick={() => setActiveTab('team')}>الفريق الوظيفي</button>
                </div>

                <div className={styles.searchSection}>
                    <div className={styles.searchBarContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder={activeTab === 'team' ? "بحث بالاسم أو البريد الإلكتروني..." : "بحث بالاسم أو الرقم الوطني..."} 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className={styles.searchInput} 
                        />
                    </div>
                </div>

                {isLoading && !isCitizenModalOpen ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#00a65a', fontWeight: 'bold' }}>جاري المزامنة...</div>
                ) : (
                    <>
                        {activeTab === 'citizens' && (
                            <CitizensTable 
                                citizens={filteredCitizens} 
                                onToggleStatus={handleToggleCitizenStatus} 
                                onViewDetails={handleViewCitizenDetails} 
                            />
                        )}

                        {activeTab === 'team' && (
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
                                                        {/* 🟢 الزر الجديد الخاص بالصلاحيات باللون الأرجواني */}
                                                        <button 
                                                            style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                                                            onClick={() => setPermissionsModal({ isOpen: true, employeeId: emp.id, employeeName: `${emp.first_name} ${emp.last_name}` })}
                                                            onMouseOver={(e) => e.target.style.backgroundColor = '#c7d2fe'}
                                                            onMouseOut={(e) => e.target.style.backgroundColor = '#e0e7ff'}
                                                        >
                                                            صلاحيات
                                                        </button>
                                                        
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
                )}
            </div>

            {/* ======================= النوافذ المنبثقة ======================= */}
            <DeleteConfirmModal isOpen={confirmDelete.isOpen} onClose={() => setConfirmDelete({ isOpen: false, employeeId: null })} onConfirm={executeDeleteEmployee} />
            
            <EmployeeFormModal
                isOpen={isModalOpen} isAddMode={isAddMode} onClose={() => setIsModalOpen(false)} onSave={handleSaveChanges}
                firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName}
                nationalId={nationalId} setNationalId={setNationalId} userEmail={userEmail} setUserEmail={setUserEmail}
                password={password} setPassword={setPassword} userStatus={userStatus} setUserStatus={setUserStatus}
            />

            {/* 🟢 نافذة الصلاحيات الديناميكية */}
            <EmployeePermissionsModal 
                isOpen={permissionsModal.isOpen} 
                employeeId={permissionsModal.employeeId}
                employeeName={permissionsModal.employeeName}
                onClose={() => setPermissionsModal({ isOpen: false, employeeId: null, employeeName: '' })}
                showNotification={showNotification}
            />

            {/* نافذة تفاصيل المواطن */}
            {isCitizenModalOpen && selectedCitizenDetails && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#fff', width: '600px', borderRadius: '12px', overflow: 'hidden', direction: 'rtl', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FaIdCard color="#007c4d"/> ملف المواطن: {selectedCitizenDetails.full_name}</h3>
                            <button onClick={() => setIsCitizenModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}><FaTimes /></button>
                        </div>
                        
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                <div><strong style={{color: '#6b7280'}}>الرقم الوطني:</strong> <div>{selectedCitizenDetails.national_id}</div></div>
                                <div><strong style={{color: '#6b7280'}}>تاريخ الميلاد:</strong> <div>{selectedCitizenDetails.date_of_birth}</div></div>
                                <div><strong style={{color: '#6b7280'}}>اسم الأب:</strong> <div>{selectedCitizenDetails.father_name}</div></div>
                                <div><strong style={{color: '#6b7280'}}>اسم الأم:</strong> <div>{selectedCitizenDetails.mother_full_name}</div></div>
                                <div><strong style={{color: '#6b7280'}}>محل القيد:</strong> <div>{selectedCitizenDetails.place_of_registration}</div></div>
                                <div><strong style={{color: '#6b7280'}}>تاريخ التسجيل:</strong> <div>{selectedCitizenDetails.registration_date}</div></div>
                            </div>

                            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>المرفقات (صورة الهوية)</h4>
                            {selectedCitizenDetails.attachments && selectedCitizenDetails.attachments.length > 0 ? (
                                <img 
                                    src={selectedCitizenDetails.attachments[0].view_url} 
                                    alt="الهوية" 
                                    style={{ width: '100%', borderRadius: '8px', border: '1px solid #ddd', marginTop: '10px' }} 
                                />
                            ) : (
                                <div style={{ background: '#f3f4f6', padding: '20px', textAlign: 'center', borderRadius: '8px', color: '#6b7280', marginTop: '10px' }}>
                                    لا توجد مرفقات مسجلة لهذا المواطن.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;