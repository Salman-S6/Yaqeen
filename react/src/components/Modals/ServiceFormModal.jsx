import React from 'react';
import styles from './ServiceFormModal.module.css';

const ServiceFormModal = ({
    isOpen, isAddMode, onClose, onSave,
    modalName, setModalName,
    modalDescription, setModalDescription,
    modalActive, setModalActive
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <h2 className={styles.modalTitle}>
                    {isAddMode ? 'إضافة خدمة حكومية جديدة' : 'تعديل بيانات الخدمة'}
                </h2>

                <form onSubmit={onSave}>
                    <div className={styles.formGroup}>
                        <label>اسم الخدمة الحكومية:</label>
                        <input
                            type="text"
                            value={modalName}
                            onChange={(e) => setModalName(e.target.value)}
                            className={styles.modalInput}
                            placeholder="مثال: إخراج قيد فردي..."
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>وصف الخدمة ومتطلباتها:</label>
                        <textarea
                            value={modalDescription}
                            onChange={(e) => setModalDescription(e.target.value)}
                            className={styles.modalTextarea}
                            placeholder="أدخل وصفاً تفصيلياً لمتطلبات الخدمة..."
                            rows="3"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>حالة الخدمة بالنظام:</label>

                        <div className={styles.radioGroup}>
                            <label className={`${styles.radioOption} ${modalActive === '1' ? styles.radioOptionActive : ''}`}>
                                <input
                                    type="radio"
                                    name="serviceStatus"
                                    value="1"
                                    checked={modalActive === '1'}
                                    onChange={(e) => setModalActive(e.target.value)}
                                />
                                <span className={styles.radioText}>مفعلة ومتاحة للمواطنين</span>
                            </label>

                            <label className={`${styles.radioOption} ${modalActive === '0' ? styles.radioOptionInactive : ''}`}>
                                <input
                                    type="radio"
                                    name="serviceStatus"
                                    value="0"
                                    checked={modalActive === '0'}
                                    onChange={(e) => setModalActive(e.target.value)}
                                />
                                <span className={styles.radioText}>معطلة / قيد الصيانة مؤقتاً</span>
                            </label>
                        </div>
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
