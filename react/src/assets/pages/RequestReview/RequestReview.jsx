import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaLock, FaCheckCircle, FaTimesCircle, FaFileAlt } from 'react-icons/fa';
import UserInfoCard from '../../../components/UserInfoCard/UserInfoCard';
import DecisionActions from '../../../components/DecisionActions/DecisionActions';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import RejectModal from '../../../components/RejectModal/RejectModal';
import { employeeRequestService } from '../../../api/employeeRequestService';
import styles from './RequestReview.module.css';

const RequestReview = ({ isAdminMode = false, onActionComplete }) => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestStatus, setRequestStatus] = useState('pending');

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await employeeRequestService.reviewRequest(requestId);
        const data = response.data?.data || response.data;

        if (data.status === 'مقبول' || data.status === 'approved') {
          setRequestStatus('approved');
        } else if (data.status === 'مرفوض' || data.status === 'rejected') {
          setRequestStatus('rejected');
        } else {
          setRequestStatus('pending');
        }
      } catch (error) {
        console.error("خطأ في جلب تفاصيل الطلب:", error);
      }
    };
    fetchRequestDetails();
  }, [requestId]);

  // 🟢 تم تنظيف البيانات الوهمية من نسب الثقة (confidence) لأنها لم تعد OCR
  const mockData = [
    { label: "الاسم الكامل", value: "خالد محمد الأحمد" },
    { label: "الرقم الوطني", value: "12345678901" },
    { label: "تاريخ الميلاد", value: "1988 / 3 / 15" },
    { label: "مكان القيد", value: "دمشق - ريف دمشق" },
    { label: "تاريخ الإصدار", value: "2018 / 1 / 20" },
  ];

  const finalizeAction = () => {
    if (onActionComplete) onActionComplete(requestId);
    navigate('/employee/pending-requests');
  };

  const handleApproveSubmit = async () => {
    try {
      setIsProcessing(true);
      await employeeRequestService.approveRequest(requestId);
      alert("تم اعتماد الطلب بنجاح!");
      setRequestStatus('approved');
      setShowConfirm(false);
    } catch (error) {
      alert("حدث خطأ أثناء محاولة اعتماد الطلب.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async (reason) => {
    try {
      setIsProcessing(true);
      const rejectionReason = reason || "مرفوض بسبب عدم استيفاء الشروط المطلوبة.";
      await employeeRequestService.rejectRequest(requestId, rejectionReason);
      alert("تم رفض الطلب بنجاح.");
      setRequestStatus('rejected');
      setShowReject(false);
    } catch (error) {
      alert("حدث خطأ أثناء محاولة رفض الطلب.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {isAdminMode && (
        <div className={styles.adminBreadcrumb} onClick={() => navigate('/admin/users')}>
          <FaArrowRight /> العودة للوحة الإدارة | رقم الطلب: {requestId}
        </div>
      )}

      <header className={styles.topHeader}>
        <div className={styles.headerInfo}>
          <h2 className={styles.mainTitle}>
            {isAdminMode ? "وضع القراءة فقط (الرقابة)" : "مراجعة بيانات الطلب"}
          </h2>
        </div>
        <p className={styles.subTitle}>خالد محمد الأحمد</p>
      </header>

      <div className={styles.contentGrid}>
        {/* 🟢 العمود الأيمن: تم حذف صندوق نسبة دقة الـ OCR منه */}
        <div className={styles.rightCol}>
          <div className={styles.sectionLabel}>الوثيقة المرفقة مع الطلب</div>
          <div className={styles.blackCard}>
            <div className={styles.cardHeader}>الجمهورية العربية السورية</div>
            <div className={styles.idNumberDisplay}>1 0 9 8 7 6 5 4 3 2 1</div>
            <div className={styles.userNameDisplay}>خالد محمد الأحمد</div>
          </div>
          <div className={styles.statusSuccess}>✔️ الوثيقة مطابقة لشروط النظام الأساسية</div>
        </div>

        {/* 🟢 العمود الأيسر: تم حذف صناديق التحذير الصفراء بالكامل */}
        <div className={styles.leftCol}>

          <div className={styles.sectionLabel} style={{ marginBottom: '15px', color: '#4b5563', fontWeight: 'bold' }}>
            <FaFileAlt style={{ marginLeft: '8px', color: '#007c4d' }} />
            البيانات المدخلة في الطلب
          </div>

          <UserInfoCard data={mockData} isAdminMode={isAdminMode} />

          {/* التحكم الذكي بظهور الأزرار بناءً على حالة الطلب */}
          {!isAdminMode ? (
            <div className={styles.actionsContainer} style={{ marginTop: '25px' }}>
              {requestStatus === 'pending' ? (
                <DecisionActions
                  onAccept={() => setShowConfirm(true)}
                  onReject={() => setShowReject(true)}
                />
              ) : (
                <div className={`${styles.lockedStatusBox} ${requestStatus === 'approved' ? styles.statusApproved : styles.statusRejected}`}>
                  {requestStatus === 'approved' ? (
                    <><FaCheckCircle size={20} /> تمت معالجة هذا الطلب مسبقاً (مقبول ومعتمد)</>
                  ) : (
                    <><FaTimesCircle size={20} /> تمت معالجة هذا الطلب مسبقاً (مرفوض)</>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.adminNotification}>
              💡 بصفتك مديراً للنظام، يمكنك الاطلاع على بيانات الطلب فقط.
            </div>
          )}
        </div>
      </div>

      {!isAdminMode && requestStatus === 'pending' && (
        <>
          <ConfirmModal isOpen={showConfirm} onClose={() => !isProcessing && setShowConfirm(false)} onConfirm={handleApproveSubmit} isLoading={isProcessing} />
          <RejectModal isOpen={showReject} onClose={() => !isProcessing && setShowReject(false)} onConfirm={handleRejectSubmit} isLoading={isProcessing} />
        </>
      )}
    </div>
  );
};

export default RequestReview;