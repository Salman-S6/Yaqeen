import React from 'react';
import styles from '../../pages/AdminUsersPage/AdminUsersPage.module.css';

const EmployeeFormModal = ({
    isOpen, isAddMode, onClose, onSave,
    firstName, setFirstName, lastName, setLastName,
    nationalId, setNationalId, userEmail, setUserEmail,
    password, setPassword, userStatus, setUserStatus,
    isSaving = false
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>
                    {isAddMode ? 'إضافة موظف جديد للنظام' : 'تعديل بيانات الموظف المعتمد'}
                </h3>
                <form onSubmit={onSave}>
                    <div className={styles.formGroupRow}>
                        <div className={styles.subFormGroup}>
                            <label>الاسم الأول:</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles.modalInput} placeholder="اسم الموظف..." disabled={isSaving} />
                        </div>
                        <div className={styles.subFormGroup}>
                            <label>النسبة / الشهرة:</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles.modalInput} placeholder="الكنية..." disabled={isSaving} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>الرقم الوطني الشخصي (National ID):</label>
                        <input type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} className={styles.modalInput} placeholder="أدخل الرقم الوطني المكوّن من 11 خانة" maxLength="11" disabled={isSaving} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>البريد الإلكتروني المعتمد:</label>
                        <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className={styles.modalInput} placeholder="البريد الإلكتروني الوظيفي" disabled={isSaving} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>{isAddMode ? 'كلمة المرور الافتراضية للحساب (Password):' : 'تغيير كلمة المرور (اتركها فارغة للإبقاء على الحالية):'}</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.modalInput} placeholder="أدخل كلمة مرور الحساب..." autoComplete="new-password" disabled={isSaving} />
                    </div>

                    <div className={styles.formGroupRow}>
                        <div className={styles.subFormGroup} style={{ width: '100%' }}>
                            <label>حالة الموظف بالنظام:</label>
                            <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)} className={styles.modalSelect} disabled={isSaving}>
                                <option value="active">مفعل وله صلاحية الدخول الكاملة</option>
                                <option value="inactive">معطل ومحجوب مؤقتاً</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeFormModal;
