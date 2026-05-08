import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 1. استيراد الهوك الخاص بالتنقل
import { FaSearch, FaChevronRight, FaChevronLeft, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './OCRTable.module.css';

const OCRTable = ({ data }) => {
    const navigate = useNavigate(); // 👈 2. تفعيل الهوك
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // دالة الانتقال عند كبس الزر
    const handleReviewClick = (id) => {
        // 👈 3. التوجيه للمسار الذي عرفناه في App.jsx
        navigate(`/admin/review/${id}`);
    };

    const getConfidenceBadge = (confidenceStr) => {
        const value = parseInt(confidenceStr);
        if (value >= 80) return <span className={`${styles.badge} ${styles.badgeSuccess}`}>{confidenceStr}</span>;
        if (value >= 60) return <span className={`${styles.badge} ${styles.badgeWarning}`}>{confidenceStr}</span>;
        return <span className={`${styles.badge} ${styles.badgeDanger}`}>{confidenceStr}</span>;
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
                <h3>الطلبات المرفوضة بواسطة OCR</h3>
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
                            <th>سبب الرفض</th>
                            <th>نسبة الثقة</th>
                            <th>المحرك</th>
                            <th>التاريخ</th>
                            <th>إجراء</th>
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
                                <td>
                                    {/* 👈 4. ربط الدالة بالزر هنا */}
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => handleReviewClick(row.id)}
                                    >
                                        <FaExternalLinkAlt /> مراجعة
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* ... باقي كود الترقيم (Pagination) كما هو ... */}
        </div>
    );
};

export default OCRTable;