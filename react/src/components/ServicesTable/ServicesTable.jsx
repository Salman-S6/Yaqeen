import React from 'react';
import { FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './ServicesTable.module.css';

const ServicesTable = ({ services, searchTerm, setSearchTerm, onEditClick, onDeleteClick, onAddClick }) => {
    
    const formatDate = (dateString) => {
        if (!dateString) return '---';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeaderControls}>
                <div className={styles.controlsLeft}>
                    <div className={styles.searchContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="بحث عن خدمة..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.customSearchInput}
                        />
                    </div>
                    <button className={styles.addServiceBtn} onClick={onAddClick}>
                        <FaPlus className={styles.btnIcon} />
                        إضافة خدمة جديدة
                    </button>
                </div>
                <h3 className={styles.tableTitle}>دليل الخدمات الرقمية</h3>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.mainTable}>
                    <thead>
                        <tr>
                            <th>رقم الخدمة</th>
                            <th>اسم الخدمة ووصفها</th>
                            <th>حالة الخدمة</th>
                            <th>تاريخ الإضافة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id}>
                                <td style={{ fontWeight: '600', color: '#718096' }}>#{service.id}</td>
                                <td className={styles.serviceInfoColumn}>
                                    <div className={styles.serviceName}>{service.name}</div>
                                    {service.description && (
                                        <div className={styles.serviceDescription} title={service.description}>
                                            {service.description}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {/* 🟢 تعديل الحالات البصرية إلى (مفعلة / معطلة) */}
                                    <span className={`${styles.statusBadge} ${service.is_active ? styles.active : styles.inactive}`}>
                                        <span className={styles.dot}></span>
                                        {service.is_active ? 'مفعلة' : 'معطلة'}
                                    </span>
                                </td>
                                <td className={styles.dateText}>{formatDate(service.created_at)}</td>
                                <td>
                                    <div className={styles.actionsWrapper}>
                                        {/* 🟢 تم تغيير النص إلى "تعديل" فقط */}
                                        <button className={styles.actionBtn} onClick={() => onEditClick(service)}>
                                            تعديل
                                        </button>
                                        <button className={styles.deleteBtn} onClick={() => onDeleteClick(service.id)} title="حذف">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {services.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#a0aec0' }}>
                                    لا توجد خدمات مطابقة للبحث الحالي.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServicesTable;