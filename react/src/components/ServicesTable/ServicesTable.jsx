import React from 'react';
import { FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './ServicesTable.module.css';

const ServicesTable = ({
    services,
    searchTerm,
    setSearchTerm,
    onEditClick,
    onDeleteClick,
    onAddClick
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return '---';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
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

            <div className={styles.gridTable}>
                <div className={`${styles.gridRow} ${styles.headerRow}`}>
                    <div>رقم الخدمة</div>
                    <div>اسم الخدمة ووصفها</div>
                    <div>حالة الخدمة</div>
                    <div>تاريخ الإضافة</div>
                    <div>الإجراءات</div>
                </div>

                {services.length > 0 ? (
                    services.map((service) => (
                        <div className={styles.gridRow} key={service.id}>
                            <div className={styles.serviceId}>#{service.id}</div>

                            <div className={styles.serviceInfoColumn}>
                                <div className={styles.serviceName}>{service.name}</div>
                                {service.description && (
                                    <div className={styles.serviceDescription} title={service.description}>
                                        {service.description}
                                    </div>
                                )}
                            </div>

                            <div className={styles.centerCell}>
                                <span className={`${styles.statusBadge} ${service.is_active ? styles.active : styles.inactive}`}>
                                    <span className={styles.dot}></span>
                                    {service.is_active ? 'مفعلة' : 'معطلة'}
                                </span>
                            </div>

                            <div className={styles.dateText}>{formatDate(service.created_at)}</div>

                            <div className={styles.actionsWrapper}>
                                <button className={styles.actionBtn} onClick={() => onEditClick(service)}>
                                    تعديل
                                </button>

                                <button className={styles.deleteBtn} onClick={() => onDeleteClick(service.id)} title="حذف">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>لا توجد خدمات مطابقة للبحث الحالي.</div>
                )}
            </div>
        </div>
    );
};

export default ServicesTable;
