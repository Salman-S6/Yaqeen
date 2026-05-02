import React from 'react';
import styles from './UserTable.module.css';

const UserTable = ({ users, onToggleStatus, onDelete }) => {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الدور</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id} className={styles.row} style={{ animationDelay: `${index * 0.05}s` }}>
                            <td data-label="الاسم" className={styles.nameCell}>{user.name}</td>
                            <td data-label="البريد الإلكتروني">{user.email}</td>
                            <td data-label="الدور">
                                <span className={styles.roleBadge}>{user.role}</span>
                            </td>
                            <td data-label="الحالة">
                                <span className={user.status === 'نشط' ? styles.statusActive : styles.statusInactive}>
                                    {user.status}
                                </span>
                            </td>
                            <td data-label="الإجراءات" className={styles.actions}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => onToggleStatus(user.id)}
                                >
                                    {user.status === 'نشط' ? 'تعليق' : 'تفعيل'}
                                </button>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => onDelete(user.id)}
                                >
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;