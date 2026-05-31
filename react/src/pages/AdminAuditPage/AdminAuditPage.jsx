import React, { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../../api/employeeService';
import { getApiErrorMessage, getResponseCollection } from '../../utils/apiResponse';
import {
    FaClock,
    FaNetworkWired,
    FaChevronDown,
    FaChevronUp,
    FaExchangeAlt
} from 'react-icons/fa';
import styles from './AdminAuditPage.module.css';

const ACTION_OPTIONS = [
    { value: 'الكل', label: 'كل الإجراءات' },
    { value: 'إضافة', label: 'إضافة / إنشاء' },
    { value: 'تعديل', label: 'تعديل / تحديث' },
    { value: 'حذف', label: 'حذف' },
    { value: 'اعتماد', label: 'اعتماد' },
    { value: 'رفض', label: 'رفض' }
];

const ENTITY_OPTIONS = [
    { value: 'الكل', label: 'كل الكيانات' },
    { value: 'طلب', label: 'الطلبات' },
    { value: 'مواطن', label: 'المواطنين' },
    { value: 'مستخدم', label: 'المستخدمين' },
    { value: 'نوع خدمة', label: 'أنواع الخدمات' }
];

const CustomDropdown = ({ value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(option => option.value === value)?.label || options[0]?.label;

    return (
        <div className={styles.customSelectWrapper}>
            <button
                type="button"
                className={`${styles.customSelectButton} ${isOpen ? styles.customSelectButtonOpen : ''}`}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span>{selectedLabel}</span>
                <FaChevronDown className={`${styles.customSelectArrow} ${isOpen ? styles.arrowOpen : ''}`} />
            </button>

            {isOpen && (
                <div className={styles.customSelectMenu}>
                    {options.map(option => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={`${styles.customSelectOption} ${isSelected ? styles.customSelectOptionActive : ''}`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const AdminAuditPage = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedLogId, setExpandedLogId] = useState(null);

    const [actionFilter, setActionFilter] = useState('الكل');
    const [entityFilter, setEntityFilter] = useState('الكل');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await employeeService.getAuditLogs();
            setAuditLogs(getResponseCollection(response));
        } catch (err) {
            console.error('خطأ في جلب سجلات التدقيق:', err);
            setAuditLogs([]);
            setError(getApiErrorMessage(err, 'فشل تحميل سجلات التدقيق.'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const getActionColor = (actionStr) => {
        if (!actionStr) return 'blue';
        if (actionStr.includes('حذف') || actionStr.includes('رفض')) return 'red';
        if (actionStr.includes('إضافة') || actionStr.includes('اعتماد') || actionStr.includes('إنشاء')) return 'green';
        if (actionStr.includes('تعديل') || actionStr.includes('تحديث')) return 'orange';
        return 'blue';
    };

    const toggleDetails = (id) => {
        setExpandedLogId(prev => (prev === id ? null : id));
    };

    const formatChangesData = (dataObj) => {
        if (!dataObj || typeof dataObj !== 'object') {
            return <div className={styles.emptyData}>{dataObj || 'لا يوجد بيانات'}</div>;
        }

        const keys = Object.keys(dataObj);

        if (keys.length === 0) {
            return <div className={styles.emptyData}>لا توجد تفاصيل</div>;
        }

        return (
            <ul className={styles.prettyList}>
                {keys.map((key) => (
                    <li key={key} className={styles.prettyListItem}>
                        <span className={styles.dataKey}>{key}</span>
                        <span className={styles.dataValue}>
                            {dataObj[key] !== null && dataObj[key] !== ''
                                ? String(dataObj[key])
                                : <span className={styles.nullValue}>فارغ</span>}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    const filteredLogs = auditLogs.filter(log => {
        const matchAction = actionFilter === 'الكل' || (log.action && log.action.includes(actionFilter));
        const matchEntity = entityFilter === 'الكل' || (log.entity && log.entity.includes(entityFilter));

        let matchStartDate = true;
        let matchEndDate = true;

        if (log.date) {
            const logDate = new Date(String(log.date).split(' ')[0]);

            if (startDate) {
                matchStartDate = logDate >= new Date(startDate);
            }

            if (endDate) {
                matchEndDate = logDate <= new Date(endDate);
            }
        }

        return matchAction && matchEntity && matchStartDate && matchEndDate;
    });

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.filterBar}>
                <CustomDropdown
                    value={actionFilter}
                    options={ACTION_OPTIONS}
                    onChange={setActionFilter}
                />

                <CustomDropdown
                    value={entityFilter}
                    options={ENTITY_OPTIONS}
                    onChange={setEntityFilter}
                />

                <div className={styles.dateItem}>
                    <span className={styles.label}>من</span>
                    <div className={styles.inputBox}>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.dateItem}>
                    <span className={styles.label}>إلى</span>
                    <div className={styles.inputBox}>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.auditCard}>
                <h2 className={styles.cardTitle}>السجل الزمني – لا يمكن الحذف أو التعديل (Immutable)</h2>
                <div className={styles.forceLine}></div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px', fontWeight: 'bold', color: '#007c4d' }}>
                        جاري جلب السجلات المشفرة من السيرفر...
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444', fontWeight: 700 }}>
                        <p>{error}</p>
                        <button type="button" onClick={fetchLogs} style={{ border: 'none', background: '#007c4d', color: '#fff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                            إعادة المحاولة
                        </button>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        لا توجد سجلات تدقيق تطابق معايير البحث الحالية.
                    </div>
                ) : (
                    <div className={styles.timelineContainer}>
                        {filteredLogs.map((log) => {
                            const hasChanges = log.changes && (log.changes.old || log.changes.new);
                            const isExpanded = expandedLogId === log.id;

                            return (
                                <div key={log.id} className={styles.timelineItem}>
                                    <div className={`${styles.statusDot} ${styles[getActionColor(log.action)]}`}></div>

                                    <div className={styles.logContent}>
                                        <div className={styles.logHeader} onClick={() => toggleDetails(log.id)}>
                                            <div className={styles.textStack}>
                                                <p className={styles.actionText}>
                                                    <strong>{log.user_name}</strong> {log.action}
                                                </p>

                                                <p className={styles.metaText}>
                                                    <FaClock style={{ marginLeft: '4px' }} />
                                                    {log.date} | الكيان: {log.entity}
                                                    {log.entity_id ? ` (#${log.entity_id})` : ''}
                                                </p>
                                            </div>

                                            <button className={styles.expandBtn} type="button">
                                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                التفاصيل
                                            </button>
                                        </div>

                                        {isExpanded && (
                                            <div className={styles.expandedDetails}>
                                                <div className={styles.ipBadge}>
                                                    <FaNetworkWired /> IP: {log.ip_address}
                                                </div>

                                                {hasChanges && (
                                                    <div className={styles.changesBox}>
                                                        <div className={styles.changeTitle}>التعديلات التي طرأت:</div>

                                                        <div className={styles.diffGrid}>
                                                            <div className={styles.oldValue}>
                                                                <strong className={styles.diffHeading}>البيانات السابقة:</strong>
                                                                {formatChangesData(log.changes.old)}
                                                            </div>

                                                            <div className={styles.diffArrow}><FaExchangeAlt /></div>

                                                            <div className={styles.newValue}>
                                                                <strong className={styles.diffHeading}>البيانات الجديدة:</strong>
                                                                {formatChangesData(log.changes.new)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAuditPage;
