import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaArrowRight } from 'react-icons/fa';
import UserInfoCard from '../../../components/UserInfoCard/UserInfoCard';
import DecisionActions from '../../../components/DecisionActions/DecisionActions';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import RejectModal from '../../../components/RejectModal/RejectModal';
import { employeeRequestService } from '../../../api/employeeRequestService';
import styles from './RequestReview.module.css';

const RequestReview = ({ isAdminMode = false }) => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await employeeRequestService.reviewRequest(requestId);
        setRequestData(response.data?.data || response.data);
      } catch (error) {
        console.error("خطأ:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequestDetails();
  }, [requestId]);

  const handleApproveSubmit = async () => {
    setIsProcessing(true);
    try {
      await employeeRequestService.approveRequest(requestId);
      alert("تم الاعتماد بنجاح!");
      navigate('/employee/pending-requests');
    } catch (e) { alert("حدث خطأ!"); }
    finally { setIsProcessing(false); }
  };

  const handleRejectSubmit = async (reason) => {
    setIsProcessing(true);
    try {
      await employeeRequestService.rejectRequest(requestId, reason || "مرفوض");
      alert("تم الرفض!");
      navigate('/employee/pending-requests');
    } catch (e) { alert("حدث خطأ!"); }
    finally { setIsProcessing(false); }
  };

  if (isLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>جاري التحميل...</div>;
  if (!requestData) return <div style={{ padding: '50px', textAlign: 'center' }}>لا يوجد طلب.</div>;

  const c = requestData.citizen || {};
  const fullData = [
    { label: "الاسم", value: c.first_name },
    { label: "النسبة", value: c.last_name },
    { label: "اسم الأب", value: c.father_name },
    { label: "اسم الأم", value: c.mother_first_name },
    { label: "نسبة الأم", value: c.mother_last_name },
    { label: "تاريخ الميلاد", value: c.date_of_birth },
    { label: "مكان الولادة/القيد", value: c.place_of_registration },
    { label: "الرقم الوطني", value: c.national_id },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* 🟢 زر العودة المنسق */}
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FaArrowRight /> عودة للسجل الشامل
      </button>

      <header className={styles.topHeader}>
        <h2 className={styles.mainTitle}>مراجعة بيانات الطلب: {c.first_name} {c.last_name}</h2>
      </header>

      <div className={styles.contentGrid}>
        {/* العمود الأيمن: عرض الصورة */}
        <div className={styles.rightCol}>
          <div className={styles.sectionLabel}>صورة الهوية</div>
          <div className={styles.imageContainer}>
            {requestData.identity_image_url ? (
              <img
                key={requestData.id}
                src={requestData.identity_image_url}
                alt="الهوية"
                className={styles.idCardImage}
              />
            ) : <div className={styles.noImagePlaceholder}>لا توجد صورة</div>}
          </div>
        </div>

        {/* العمود الأيسر: البيانات */}
        <div className={styles.leftCol}>
          <div className={styles.sectionLabel}><FaFileAlt /> البيانات المدخلة</div>
          <UserInfoCard data={fullData} />

          {!isAdminMode && requestData.status === 'pending' && (
            <div className={styles.actionsContainer}>
              <DecisionActions
                onAccept={() => setShowConfirm(true)}
                onReject={() => setShowReject(true)}
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleApproveSubmit}
        isLoading={isProcessing}
      />
      <RejectModal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleRejectSubmit}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default RequestReview;