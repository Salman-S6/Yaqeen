import React, { useState } from 'react';
import styles from './AddUserModal.module.css';

const AddUserModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'مدقق بيانات' });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ ...formData, id: Date.now(), type: 'employee', status: 'نشط' });
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>إضافة موظف جديد</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="اسم الموظف"
                        required
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        required
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <button type="submit" className={styles.submitBtn}>إضافة الآن</button>
                    <button type="button" onClick={onClose} className={styles.cancelBtn}>إلغاء</button>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;