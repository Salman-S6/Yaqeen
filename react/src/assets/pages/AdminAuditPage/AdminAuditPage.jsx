import React, { useState, useEffect } from 'react';
import { employeeService } from '../../../api/employeeService';
import { FaClock, FaNetworkWired, FaChevronDown, FaChevronUp, FaExchangeAlt } from 'react-icons/fa';
import styles from './AdminAuditPage.module.css';

const AdminAuditPage = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedLogId, setExpandedLogId] = useState(null);

    // 🟢 States الفلترة
    const [actionFilter, setActionFilter] = useState('الكل');
    const [entityFilter, setEntityFilter] = useState('الكل');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await employeeService.getAuditLogs();
                const data = response.data?.data?.data || response.data?.data || response.data || [];
                setAuditLogs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("خطأ في جلب سجلات التدقيق:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getActionColor = (actionStr) => {
        if (!actionStr) return 'blue';
        if (actionStr.includes('حذف') || actionStr.includes('رفض')) return 'red';
        if (actionStr.includes('إضافة') || actionStr.includes('اعتماد') || actionStr.includes('إنشاء')) return 'green';
        if (actionStr.includes('تعديل') || actionStr.includes('تحديث')) return 'orange';
        return 'blue';
    };

    const toggleDetails = (id) => {
        if (expandedLogId === id) setExpandedLogId(null);
        else setExpandedLogId(id);
    };

    // 🟢 دالة تجميل الـ JSON وتحويله لقائمة مقروءة
    const formatChangesData = (dataObj) => {
        if (!dataObj || typeof dataObj !== 'object') {
            return <div className={styles.emptyData}>{dataObj || 'لا يوجد بيانات'}</div>;
        }

        const keys = Object.keys(dataObj);
        if (keys.length === 0) return <div className={styles.emptyData}>لا توجد تفاصيل</div>;

        return (
            <ul className={styles.prettyList}>
                {keys.map((key) => (
                    <li key={key} className={styles.prettyListItem}>
                        <span className={styles.dataKey}>{key}</span>
                        <span className={styles.dataValue}>
                            {dataObj[key] !== null && dataObj[key] !== '' ? String(dataObj[key]) : <span className={styles.nullValue}>فارغ</span>}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    // 🟢 منطق الفلترة المدمج (تاريخ + إجراء + كيان)
    const filteredLogs = auditLogs.filter(log => {
        // فلتر الإجراء
        const matchAction = actionFilter === 'الكل' || (log.action && log.action.includes(actionFilter));
        
        // فلتر الكيان
        const matchEntity = entityFilter === 'الكل' || (log.entity && log.entity.includes(entityFilter));
        
        // فلتر التاريخ
        let matchStartDate = true;
        let matchEndDate = true;
        const logDate = new Date(log.date.split(' ')[0]); // أخذ جزء التاريخ فقط YYYY-MM-DD
        
        if (startDate) {
            matchStartDate = logDate >= new Date(startDate);
        }
        if (endDate) {
            matchEndDate = logDate <= new Date(endDate);
        }

        return matchAction && matchEntity && matchStartDate && matchEndDate;
    });

    return (
        <div className={styles.pageWrapper}>
            {/* شريط الفلاتر المربوط بالـ States */}
            <div className={styles.filterBar}>
                <select 
                    className={styles.sturdySelect} 
                    value={actionFilter} 
                    onChange={(e) => setActionFilter(e.target.value)}
                >
                    <option value="الكل">كل الإجراءات</option>
                    <option value="إضافة">إضافة / إنشاء</option>
                    <option value="تعديل">تعديل / تحديث</option>
                    <option value="حذف">حذف</option>
                    <option value="اعتماد">اعتماد</option>
                    <option value="رفض">رفض</option>
                </select>

                <select 
                    className={styles.sturdySelect}
                    value={entityFilter} 
                    onChange={(e) => setEntityFilter(e.target.value)}
                >
                    <option value="الكل">كل الكيانات</option>
                    <option value="طلب">الطلبات</option>
                    <option value="مواطن">المواطنين</option>
                    <option value="مستخدم">المستخدمين</option>
                </select>

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
                                                    <FaClock style={{marginLeft: '4px'}}/> {log.date} | الكيان: {log.entity} {log.entity_id ? `(#${log.entity_id})` : ''}
                                                </p>
                                            </div>
                                            <button className={styles.expandBtn}>
                                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />} التفاصيل
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