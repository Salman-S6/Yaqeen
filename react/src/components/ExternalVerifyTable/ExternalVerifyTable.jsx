import React from 'react';
import { FaSearch } from 'react-icons/fa'; // أيقونة البحث الزرقاء الأصلية
import QRStatusBadge from '../QRStatusBadge/QRStatusBadge';
import styles from './ExternalVerifyTable.module.css';

const ExternalVerifyTable = ({ records, searchTerm, setSearchTerm }) => {
    return (
        <div className={styles.tableContainer}>
            
            {/* الهيدر الداخلي للجدول */}
            <div className={styles.tableHeaderControls}>
                
                {/* صندوق البحث المنسق بالكامل مثل الأصلي */}
                <div className={styles.searchContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="بحث..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.customSearchInput}
                    />
                </div>

                <h3 className={styles.tableTitle}>سجل عمليات مسح QR الخارجية</h3>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.mainTable}>
                    <thead>
                        <tr>
                            <th>رقم الوثيقة</th>
                            <th>المنظمة</th>
                            <th>النتيجة</th>
                            <th>الوقت</th>
                            <th>عنوان IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.id}>
                                <td className={styles.documentId}>{record.id}</td>
                                <td>{record.organization}</td>
                                <td>
                                    <QRStatusBadge status={record.status} text={record.statusText} />
                                </td>
                                <td>{record.time}</td>
                                <td className={styles.ipAddress}>{record.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExternalVerifyTable;