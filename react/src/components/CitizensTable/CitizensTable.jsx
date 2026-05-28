import React from 'react';
import { FaEye, FaPowerOff, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from "./CitizensTable.module.css";

const CitizensTable = ({ citizens, onToggleStatus, onViewDetails }) => {
    if (!citizens || citizens.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>لا يوجد مواطنين مسجلين حالياً.</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>الاسم الكامل</th>
                        <th>الرقم الوطني</th>
                        <th>البريد الإلكتروني</th>
                        <th>التوثيق</th>
                        <th>حالة الحساب</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {citizens.map((citizen, index) => (
                        <tr key={citizen.id} className={styles.row} style={{ animationDelay: `${index * 0.05}s` }}>
                            <td style={{ fontWeight: 'bold', color: '#007c4d' }}>{citizen.full_name}</td>
                            <td style={{ fontWeight: '600', color: '#4a5568' }}>{citizen.national_id}</td>
                            <td>{citizen.email}</td>
                            <td>
                                {citizen.is_verified ? (
                                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}><FaCheckCircle /> موثق</span>
                                ) : (
                                    <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '5px' }}><FaTimesCircle /> غير موثق</span>
                                )}
                            </td>
                            <td>
                                <span className={citizen.account_status === 'active' ? styles.statusActive : styles.statusInactive}>
                                    {citizen.account_status === 'active' ? 'نشط' : 'موقوف'}
                                </span>
                            </td>
                            <td className={styles.actions} style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => onViewDetails(citizen.id)}
                                    style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}
                                >
                                    <FaEye /> تفاصيل
                                </button>
                                <button
                                    onClick={() => onToggleStatus(citizen.id)}
                                    style={{ background: citizen.account_status === 'active' ? '#fee2e2' : '#d1fae5', color: citizen.account_status === 'active' ? '#dc2626' : '#059669', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}
                                >
                                    <FaPowerOff /> {citizen.account_status === 'active' ? 'إيقاف' : 'تفعيل'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CitizensTable;