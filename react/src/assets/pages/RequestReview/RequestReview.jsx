import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaRobot } from 'react-icons/fa';
import UserInfoCard from '../../../components/UserInfoCard/UserInfoCard';
import DecisionActions from '../../../components/DecisionActions/DecisionActions';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import RejectModal from '../../../components/RejectModal/RejectModal';
import styles from './RequestReview.module.css';

const RequestReview = ({ isAdminMode = false }) => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReject, setShowReject] = useState(false);

  // بيانات المحاكاة مع تفاوت نسب الثقة
  const mockData = [
    { label: "الاسم الكامل", value: "خالد محمد الأحمد", confidence: 98 },
    { label: "الرقم الوطني", value: "12345678901", confidence: 99 },
    { label: "تاريخ الميلاد", value: "1988 / 3 / 15", confidence: 95 },
    { label: "مكان القيد", value: "دمشق - ريف دمشق", confidence: 52 }, // ثقة منخفضة
    { label: "تاريخ الإصدار", value: "2018 / 1 / 20", confidence: 91 },
  ];

  return (
    <div className={styles.pageWrapper}>
      {isAdminMode && (
        <div className={styles.adminBreadcrumb} onClick={() => navigate('/admin/ocr')}>
          <FaArrowRight /> العودة لمراقبة OCR | تدقيق الطلب رقم: {requestId || 'جديد'}
        </div>
      )}

      <header className={styles.topHeader}>
        <h2 className={styles.mainTitle}>
          {isAdminMode ? "تدقيق أخطاء المحرك" : "مراجعة طلب"}
        </h2>
        <p className={styles.subTitle}>خالد محمد الأحمد</p>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.rightCol}>
          <div className={styles.sectionLabel}>الوثيقة المرفوعة</div>
          <div className={styles.blackCard}>
            <div className={styles.cardHeader}>الجمهورية العربية السورية</div>
            <div className={styles.idNumberDisplay}>1 0 9 8 7 6 5 4 3 2 1</div>
            <div className={styles.userNameDisplay}>خالد محمد الأحمد</div>
          </div>
          <div className={styles.statusSuccess}>✔️ التحقق الحيوي: الوثيقة مطابقة للأصل</div>
          
          <div className={styles.matchRateBox}>
            <FaRobot style={{ marginLeft: '8px' }} />
            كفاءة الاستخراج (OCR): <span className={styles.boldGreen}>96%</span>
            {isAdminMode && <div className={styles.engineDetail}>المحرك النشط: PaddleOCR (Arabic Model)</div>}
          </div>
        </div>

        <div className={styles.leftCol}>
          {/* تمرير خاصية التمييز للبطاقة */}
          <UserInfoCard data={mockData} isAdminMode={isAdminMode} />
          
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
          setShowConfirm(false);
          if(isAdminMode) navigate('/admin/ocr');
        }}
      />

      <RejectModal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={() => {
          setShowReject(false);
          if(isAdminMode) navigate('/admin/ocr');
        }}
      />
    </div>
  );
};

export default RequestReview;