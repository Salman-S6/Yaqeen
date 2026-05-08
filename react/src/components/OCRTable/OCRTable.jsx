import React, { useState } from 'react';
import { FaSearch, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import styles from './OCRTable.module.css';

const OCRTable = ({ data = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const getConfidenceBadge = (confidenceStr) => {
        const value = parseInt(confidenceStr);
        if (value >= 80) return <span className={`${styles.badge} ${styles.badgeSuccess}`}>{confidenceStr}%</span>;
        if (value >= 60) return <span className={`${styles.badge} ${styles.badgeWarning}`}>{confidenceStr}%</span>;
        return <span className={`${styles.badge} ${styles.badgeDanger}`}>{confidenceStr}%</span>;
    };

    const filteredData = data.filter((row) =>
        row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.reason.includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
                <h3>سجل تحليل أخطاء محركات الـ OCR</h3>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="ابحث برقم الطلب..."
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
                            <th>رقم الطلب</th>
                            <th>سبب الرفض التقني</th>
                            <th>نسبة الثقة</th>
                            <th>المحرك المستخدم</th>
                            <th>تاريخ الفحص</th>
                            {/* 💡 تم حذف عمود "الإجراء" هنا بناءً على تعليمات الباك-إند */}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row) => (
                            <tr key={row.id} className={styles.tableRow}>
                                <td className={styles.reqId}>{row.id}</td>
                                <td>{row.reason}</td>
                                <td>{getConfidenceBadge(row.confidence)}</td>
                                <td><span className={styles.engineText}>{row.engine}</span></td>
                                <td>{row.date}</td>
                                {/* 💡 لا توجد أزرار مراجعة هنا للمدير */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
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