import React, { useState } from 'react';
import { FaSearch, FaChevronRight, FaChevronLeft, FaEye } from 'react-icons/fa';
import styles from './OCRTable.module.css';

const OCRTable = ({ data = [], onViewResult }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // دالة لتلوين شارة الثقة حسب النسبة المئوية
    const getConfidenceBadge = (confidenceStr) => {
        // تحويل النسبة (مثلاً "75%") إلى رقم
        const value = parseInt(confidenceStr);
        if (value >= 80) return <span className={`${styles.badge} ${styles.badgeSuccess}`}>{confidenceStr}</span>;
        if (value >= 60) return <span className={`${styles.badge} ${styles.badgeWarning}`}>{confidenceStr}</span>;
        return <span className={`${styles.badge} ${styles.badgeDanger}`}>{confidenceStr}</span>;
    };

    // الفلترة بناءً على حقول الـ API الحقيقية
    const filteredData = data.filter((row) => {
        const citizenName = (row.citizen_name || '').toLowerCase();
        const nationalId = (row.national_id || '').toLowerCase();
        const search = searchTerm.toLowerCase();

        return citizenName.includes(search) || nationalId.includes(search);
    });

    const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
                <h3>سجل هويات المواطنين</h3>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="ابحث باسم المواطن أو الرقم الوطني..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.tableResponsive}>
                <table className={styles.ocrTable}>
                    <thead>
                        <tr>
                            <th>اسم المواطن</th>
                            <th>الرقم الوطني</th>
                            <th>نسبة الثقة</th>
                            <th>المحرك المستخدم</th>
                            <th>تاريخ التسجيل</th>
                            <th>تفاصيل الهوية</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.length > 0 ? (
                            currentRows.map((row) => (
                                <tr key={row.id} className={styles.tableRow}>
                                    <td style={{ color: '#007c4d', fontWeight: 'bold' }}>
                                        {row.citizen_name}
                                    </td>
                                    <td style={{ fontWeight: 'bold', color: '#374151' }}>
                                        {row.national_id}
                                    </td>
                                    <td>{getConfidenceBadge(row.confidence_score)}</td>
                                    <td><span className={styles.engineText}>{row.engine_used}</span></td>
                                    <td>{row.date}</td>
                                    
                                    <td>
                                        <button 
                                            onClick={() => onViewResult(row)}
                                            style={{
                                                backgroundColor: '#e8f5e9', color: '#007c4d', border: 'none',
                                                padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '13px', transition: '0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c8e6c9'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e8f5e9'}
                                        >
                                            <FaEye size={16} /> عرض
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                                    لا يوجد مواطنين مطابقين للبحث.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <FaChevronRight />
                    </button>
                    <span>صفحة {currentPage} من {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                        <FaChevronLeft />
                    </button>
                </div>
            )}
        </div>
    );
};

export default OCRTable;