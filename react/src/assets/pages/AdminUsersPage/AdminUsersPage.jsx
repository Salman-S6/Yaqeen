import React, { useState } from 'react';
import UserTabs from '../../../components/UserTabs/UserTabs';
import UserTable from '../../../components/UserTable/UserTable';
import AddUserModal from '../../../components/AddUserModal/AddUserModal';
import styles from './AdminUsersPage.module.css';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'أحمد المحمود', email: 'ahmed@mail.com', role: 'مواطن', type: 'citizen', status: 'نشط' },
        { id: 2, name: 'منال الحسن', email: 'manal@gov.sy', role: 'مدقق بيانات', type: 'employee', status: 'نشط' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('employee');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.type === activeTab &&
        (user.name.includes(searchTerm) || user.email.includes(searchTerm))
    );

    const handleToggleStatus = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'نشط' ? 'موقوف' : 'نشط' } : u));
    };

    // ✅ دالة الحذف مع حماية حسابك الشخصي
    const handleDeleteUser = (id) => {
        const userToDelete = users.find(u => u.id === id);

        // منع حذف حسابك (عبد الرحمن سماق)
        if (userToDelete.email === "admin@yaqeen.gov.sy") {
            alert("لا يمكن حذف حساب مدير النظام الأساسي لضمان استقرار الصلاحيات.");
            return;
        }

        if (window.confirm(`هل أنت متأكد من حذف المستخدم "${userToDelete.name}" نهائياً؟`)) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleAddUser = (newUser) => {
        setUsers([...users, newUser]);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>إدارة المستخدمين</h1>
                    <p>إدارة صلاحيات الموظفين وسجلات المواطنين في النظام</p>
                </div>
                {activeTab === 'employee' && (
                    <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                        + إضافة موظف جديد
                    </button>
                )}
            </header>

            <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className={styles.searchSection}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="بحث بالاسم أو البريد الإلكتروني..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableCard}>
                <UserTable
                    users={filteredUsers}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteUser}
                    type={activeTab}
                />
            </div>

            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddUser}
            />
        </div>
    );
};

export default AdminUsersPage;