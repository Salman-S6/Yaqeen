import React from 'react';
import styles from '../../assets/pages/AdminServicesPage/AdminServicesPage.module.css';

const ServiceFormModal = ({
    isOpen, isAddMode, onClose, onSave,
    modalName, setModalName, modalDescription, setModalDescription,
    modalActive, setModalActive
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>
                    {isAddMode ? 'إضافة خدمة رقمية جديدة' : 'تعديل بيانات الخدمة'}
                </h3>
                <form onSubmit={onSave}>
                    <div className={styles.formGroup}>
                        <label>اسم الخدمة الحكومية:</label>
                        <input
                            type="text"
                            value={modalName}
                            onChange={(e) => setModalName(e.target.value)}
                            className={styles.modalInput}
                            placeholder="مثال: بيان زواج، خلاصة سجل عدلي..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>وصف الخدمة ومتطلباتها:</label>
                        <textarea
                            value={modalDescription}
                            onChange={(e) => setModalDescription(e.target.value)}
                            className={styles.modalTextarea}
                            placeholder="أدخل وصفاً تفصيلياً لمتطلبات الخدمة أو غرضها..."
                            rows="3"
                        ></textarea>
                    </div>

                    <div className={styles.formGroupRow}>
                        <label className={styles.switchLabel}>حالة الخدمة بالنظام:</label>
                        <select
                            value={modalActive}
                            onChange={(e) => setModalActive(e.target.value)}
                            className={styles.modalSelect}
                        >
                            <option value="1">مفعلة بالنظام</option>
                            <option value="0">معطلة بالنظام</option>
                        </select>
                    </div>
                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.saveBtn}>حفظ التغييرات</button>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceFormModal;