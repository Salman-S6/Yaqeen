import React, { useState } from 'react';
import { FaSearch, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import styles from './PerformanceTable.module.css';

const PerformanceTable = ({ data = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const filteredData = data.filter((emp) =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow); 
    const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1; 

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className={styles.tableCard}>
            <div className={styles.cardHeader}>
                <h3>تقرير أداء الموظفين - الأسبوع الأخير</h3>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="ابحث عن موظف..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>الموظف</th>
                            <th>طلبات مُعالجة</th>
                            <th>متوسط وقت المعالجة</th>
                            <th>تجاوزات SLA</th>
                            <th>نسبة القبول</th>
                            <th>الأداء</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.length > 0 ? (
                            currentRows.map((emp) => (
                                <tr key={emp.id}>
                                    <td className={styles.empName}>{emp.name}</td>
                                    <td>{emp.processed_requests}</td>
                                    <td>{emp.avg_processing_time}</td>
                                    <td className={emp.sla_breaches > 2 ? styles.dangerText : ''}>
                                        {emp.sla_breaches}
                                    </td>
                                    <td>{emp.acceptance_rate}</td>
                                    <td className={styles.progressCell}>
                                        <div className={styles.progressBarBg}>
                                            <div
                                                className={styles.progressBarFill}
                                                style={{
                                                    width: `${emp.performance_score}%`,
                                                    backgroundColor: emp.performance_score > 80 ? '#10b981' : emp.performance_score > 60 ? '#f59e0b' : '#ef4444'
                                                }}
                                            ></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                                    لا يوجد نتائج لمصطلح البحث: "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <button type="button" onClick={handlePrevPage} disabled={currentPage === 1} className={styles.pageBtn}>
                    <FaChevronRight /> السابق
                </button>
                <span className={styles.pageInfo}>صفحة {currentPage} من {totalPages}</span>
                <button type="button" onClick={handleNextPage} disabled={currentPage === totalPages} className={styles.pageBtn}>
                    التالي <FaChevronLeft />
                </button>
            </div>
        </div>
    );
};

export default PerformanceTable;