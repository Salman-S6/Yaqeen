import React, { useState } from 'react';
import UserInfoCard from '../../../components/UserInfoCard/UserInfoCard';
import DecisionActions from '../../../components/DecisionActions/DecisionActions';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import RejectModal from '../../../components/RejectModal/RejectModal';
import styles from './RequestReview.module.css';

const RequestReview = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const mockData = [
    { label: "الاسم الكامل", value: "خالد محمد الأحمد", confidence: 98 },
    { label: "الرقم الوطني", value: "12345678901", confidence: 99 },
    { label: "تاريخ الميلاد", value: "1988 / 3 / 15", confidence: 95 },
    { label: "مكان القيد", value: "دمشق - ريف دمشق", confidence: 72 },
    { label: "تاريخ الإصدار", value: "2018 / 1 / 20", confidence: 91 },
  ];

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.topHeader}>
        <h2 className={styles.mainTitle}>مراجعة طلب</h2>
        <p className={styles.subTitle}>خالد محمد الأحمد</p>
      </header>

      <div className={styles.contentGrid}>
        {/* العمود الأيمن (صورة الهوية) */}
        <div className={styles.rightCol}>
          <div className={styles.sectionLabel}>صورة الهوية الأصلية المرفوعة</div>
          
          <div className={styles.blackCard}>
            <div className={styles.cardHeader}>الجمهورية العربية السورية</div>
            <div className={styles.idNumberDisplay}>1 0 9 8 7 6 5 4 3 2 1</div>
            <div className={styles.userNameDisplay}>خالد محمد الأحمد</div>
          </div>
          
          <div className={styles.statusSuccess}>✔️ الصورة أصلية - لا توجد علامات تلاعب</div>
          <div className={styles.matchRateBox}>
            نسبة التطابق الإجمالية مع OCR: <span className={styles.boldGreen}>96%</span>
          </div>
        </div>

        {/* العمود الأيسر (البيانات المستخرجة والأزرار) */}
        <div className={styles.leftCol}>
          
          {/* تم حذف العنوان المكرر من هنا، والاعتماد على العنوان الموجود داخل UserInfoCard */}
          <UserInfoCard data={mockData} />
          
          {/* مربع التنبيه الأصفر اللي كان ناقص */}
          <div className={styles.warningBox}>
            ⚠️ حقل "مكان القيد" نسبة ثقته أقل من 80% - يُنصح بالتحقق اليدوي قبل الاعتماد
          </div>

          <div className={styles.actionsContainer}>
            <DecisionActions
              onAccept={() => setShowConfirm(true)}
              onReject={() => setShowReject(true)}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          console.log("تم الاعتماد");
          setShowConfirm(false);
        }}
      />

      <RejectModal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={() => {
          console.log("تم الرفض");
          setShowReject(false);
        }}
      />
    </div>
  );
};

export default RequestReview;