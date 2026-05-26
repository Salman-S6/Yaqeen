import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaRobot, FaLock } from 'react-icons/fa';
import UserInfoCard from '../../../components/UserInfoCard/UserInfoCard';
import DecisionActions from '../../../components/DecisionActions/DecisionActions';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import RejectModal from '../../../components/RejectModal/RejectModal';
import styles from './RequestReview.module.css';

const RequestReview = ({ isAdminMode = false, onActionComplete }) => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const mockData = [
    { label: "الاسم الكامل", value: "خالد محمد الأحمد", confidence: 98 },
    { label: "الرقم الوطني", value: "12345678901", confidence: 99 },
    { label: "تاريخ الميلاد", value: "1988 / 3 / 15", confidence: 95 },
    { label: "مكان القيد", value: "دمشق - ريف دمشق", confidence: 52 },
    { label: "تاريخ الإصدار", value: "2018 / 1 / 20", confidence: 91 },
  ];

  const finalizeAction = () => {
    if (onActionComplete) {
      onActionComplete(requestId);
    }
    // التوجيه التلقائي للموظف فقط
    navigate('/employee/pending-requests');
  };

  return (
    <div className={styles.pageWrapper}>
      {isAdminMode && (
        <div className={styles.adminBreadcrumb} onClick={() => navigate('/admin/ocr')}>
          <FaArrowRight /> العودة لتقارير OCR | عرض تفاصيل الطلب التقنية: {requestId}
        </div>
      )}

      <header className={styles.topHeader}>
        <div className={styles.headerInfo}>
          <h2 className={styles.mainTitle}>
            {isAdminMode ? "وضع القراءة فقط (الرقابة)" : "مراجعة طلب"}
          </h2>
          {isAdminMode && <span className={styles.readOnlyBadge}><FaLock /> للعرض فقط</span>}
        </div>
        <p className={styles.subTitle}>خالد محمد الأحمد</p>
      </header>

      <div className={styles.contentGrid}>
        {/* العمود الأيمن (صورة الهوية والتحقق المتقدم) */}
        <div className={styles.rightCol}>
          <div className={styles.sectionLabel}>صورة الهوية الأصلية المرفوعة (الوثيقة الرقمية)</div>
          
          <div className={styles.blackCard}>
            <div className={styles.cardHeader}>الجمهورية العربية السورية</div>
            <div className={styles.idNumberDisplay}>1 0 9 8 7 6 5 4 3 2 1</div>
            <div className={styles.userNameDisplay}>خالد محمد الأحمد</div>
          </div>

          <div className={styles.statusSuccess}>✔️ الصورة أصلية - مطابقة حيوية صحيحة ولا تلاعب بالأوراق</div>

          <div className={styles.matchRateBox}>
            <FaRobot style={{ marginLeft: '8px' }} />
            دقة استخراج البيانات: <span className={styles.boldGreen}>96%</span>
            {isAdminMode && <div className={styles.engineDetail}>المحرك: PaddleOCR v2.8 (Arabic Optimized)</div>}
          </div>
        </div>

        {/* العمود الأيسر (البيانات المستخرجة والأزرار الشرطية) */}
        <div className={styles.leftCol}>
          <UserInfoCard data={mockData} isAdminMode={isAdminMode} />
          
          {/* 🟢 صندوق التنبيه الذكي المضاف من بتول عند ضعف دقة حقول مكان القيد */}
          <div className={styles.warningBox}>
            ⚠️ حقل "مكان القيد" نسبة ثقته أقل من 80% - يُنصح بالتحقق اليدوي قبل الاعتماد الفعلي
          </div>

          {/* 🟢 التحكم الذكي الصارم المدمج لظهور أزرار اتخاذ القرار */}
          {!isAdminMode ? (
            <div className={styles.actionsContainer}>
              <DecisionActions
                onAccept={() => setShowConfirm(true)}
                onReject={() => setShowReject(true)}
              />
            </div>
          ) : (
            <div className={styles.adminNotification}>
              💡 بصفتك مديراً للنظام، يمكنك الاطلاع على دقة استخراج الـ OCR فقط. معالجة وتمرير الطلبات تتم حصراً عبر قسم الموظفين.
            </div>
          )}
        </div>
      </div>

      {/* المودالات تظهر فقط في وضع الموظف لزيادة الأمان */}
      {!isAdminMode && (
        <>
          <ConfirmModal
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              finalizeAction();
            }}
          />

          <RejectModal
            isOpen={showReject}
            onClose={() => setShowReject(false)}
            onConfirm={() => {
              setShowReject(false);
              finalizeAction();
            }}
          />
        </>
      )}
    </div>
  );
};

export default RequestReview;