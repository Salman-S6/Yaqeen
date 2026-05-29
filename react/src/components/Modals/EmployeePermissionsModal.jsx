import React, { useState, useEffect } from 'react';
import { employeeService } from '../../api/employeeService';
import { FaTimes, FaShieldAlt, FaSave } from 'react-icons/fa';
import styles from './EmployeePermissionsModal.module.css';

const EmployeePermissionsModal = ({ isOpen, onClose, employeeId, employeeName, showNotification }) => {
    const [permissionsData, setPermissionsData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && employeeId) {
            fetchPermissions();
        }
    }, [isOpen, employeeId]);

    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const response = await employeeService.getEmployeePermissions(employeeId);
            
            // 🟢 التعديل هنا: قراءة المفتاح الصحيح permissions_groups من الـ JSON
            const groups = response.data?.data?.permissions_groups || {};
            
            setPermissionsData(groups);
        } catch (error) {
            showNotification("فشل جلب صلاحيات الموظف.", "error");
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = (category, permName) => {
        setPermissionsData(prev => ({
            ...prev,
            [category]: prev[category].map(p => 
                p.name === permName ? { ...p, is_assigned: !p.is_assigned } : p
            )
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const selectedPermissions = [];
        
        Object.values(permissionsData).forEach(categoryPerms => {
            if (Array.isArray(categoryPerms)) {
                categoryPerms.forEach(p => {
                    if (p.is_assigned) selectedPermissions.push(p.name);
                });
            }
        });

        try {
            await employeeService.updateEmployeePermissions(employeeId, selectedPermissions);
            showNotification("تم تحديث صلاحيات الموظف بنجاح", "success");
            onClose();
        } catch (error) {
            showNotification("فشل حفظ التعديلات", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        <FaShieldAlt className={styles.titleIcon} /> 
                        تخصيص صلاحيات: {employeeName}
                    </h3>
                    <button className={styles.closeBtn} onClick={onClose}><FaTimes /></button>
                </div>

                <div className={styles.modalBody}>
                    {isLoading ? (
                        <div className={styles.loadingState}>جاري تحميل هيكل الصلاحيات من السيرفر...</div>
                    ) : Object.keys(permissionsData).length === 0 ? (
                        <div className={styles.loadingState}>لا يوجد صلاحيات مسجلة لهذا النظام بعد.</div>
                    ) : (
                        <div className={styles.permissionsGrid}>
                            {Object.entries(permissionsData).map(([category, perms]) => {
                                if (!Array.isArray(perms)) return null;

                                return (
                                    <div key={category} className={styles.categoryCard}>
                                        <h4 className={styles.categoryTitle}>{category}</h4>
                                        <div className={styles.checkboxesContainer}>
                                            {perms.map(perm => (
                                                <label key={perm.name} className={styles.checkboxLabel}>
                                                    <input 
                                                        type="checkbox" 
                                                        className={styles.customCheckbox}
                                                        checked={!!perm.is_assigned}
                                                        onChange={() => handleToggle(category, perm.name)}
                                                    />
                                                    <span className={styles.labelText}>{perm.label || perm.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>إلغاء</button>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving || isLoading}>
                        <FaSave /> {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeePermissionsModal;