import React from 'react';
import { FaSearch } from 'react-icons/fa';
import QRStatusBadge from '../QRStatusBadge/QRStatusBadge';
import styles from './ExternalVerifyTable.module.css';

const ExternalVerifyTable = ({ records, searchTerm, setSearchTerm }) => {
    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeaderControls}>
                <div className={styles.searchContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="بحث برقم الوثيقة أو المنظمة..." 
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
                            <th>الوقت والتاريخ</th>
                            <th>عنوان IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? (
                            records.map((record) => (
                                <tr key={record.id}>
                                    {/* 🟢 ربط مفاتيح الباك-إند */}
                                    <td className={styles.documentId}>{record.request_number}</td>
                                    <td>{record.organization}</td>
                                    <td>
                                        <QRStatusBadge 
                                            status={record.result} 
                                            text={record.result === 'valid' ? 'صالحة' : record.result === 'forged' ? 'مزورة' : 'غير محدد'} 
                                        />
                                    </td>
                                    {/* 🟢 دمج الوقت والتاريخ معاً */}
                                    <td>{`${record.date} - ${record.time}`}</td>
                                    <td className={styles.ipAddress}>{record.ip_address}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                                    لا توجد سجلات مطابقة للبحث.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExternalVerifyTable;