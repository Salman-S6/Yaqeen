import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaArrowRight } from 'react-icons/fa';
import UserInfoCard from '../../components/UserInfoCard/UserInfoCard';
import DecisionActions from '../../components/DecisionActions/DecisionActions';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import RejectModal from '../../components/RejectModal/RejectModal';
import { useToast } from '../../components/Common/ToastProvider';
import { employeeRequestService } from '../../api/employeeRequestService';
import { getApiErrorMessage, getResponseData } from '../../utils/apiResponse';
import styles from './RequestReview.module.css';

const RequestReview = ({ isAdminMode = false }) => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const getBackPath = useCallback(() => {
    return isAdminMode ? '/admin/all-requests' : '/employee/pending-requests';
  }, [isAdminMode]);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await employeeRequestService.reviewRequest(requestId);
        setRequestData(getResponseData(response));
      } catch (error) {
        console.error('خطأ في جلب تفاصيل الطلب:', error);
        const backendMessage = getApiErrorMessage(error, 'فشل تحميل بيانات الطلب.');
        showToast(backendMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId, showToast]);

  const handleApproveSubmit = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await employeeRequestService.approveRequest(requestId);
      setShowConfirm(false);

      navigate(getBackPath(), {
        state: {
          toast: {
            message: 'تم اعتماد الطلب بنجاح وإصدار الوثيقة.',
            type: 'success'
          }
        }
      });
    } catch (error) {
      console.error('خطأ أثناء اعتماد الطلب:', error);
      setShowConfirm(false);

      const backendMessage = getApiErrorMessage(error, 'حدث خطأ أثناء اعتماد الطلب. تأكد من أن الطلب ما زال قيد الانتظار.');
      setTimeout(() => showToast(backendMessage, 'error'), 150);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async (reason) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await employeeRequestService.rejectRequest(requestId, reason || 'مرفوض');
      setShowReject(false);

      navigate(getBackPath(), {
        state: {
          toast: {
            message: 'تم رفض الطلب بنجاح وتسجيل سبب الرفض.',
            type: 'success'
          }
        }
      });
    } catch (error) {
      console.error('خطأ أثناء رفض الطلب:', error);
      setShowReject(false);

      const backendMessage = getApiErrorMessage(error, 'حدث خطأ أثناء رفض الطلب. تأكد من أن الطلب ما زال قيد الانتظار.');
      setTimeout(() => showToast(backendMessage, 'error'), 150);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>جاري التحميل...</div>;
  }

  if (!requestData) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>لا يوجد طلب.</div>;
  }

  const c = requestData.citizen || {};
  const fullData = [
    { label: 'الاسم', value: c.first_name || '---' },
    { label: 'النسبة', value: c.last_name || '---' },
    { label: 'اسم الأب', value: c.father_name || '---' },
    { label: 'اسم الأم', value: c.mother_first_name || '---' },
    { label: 'نسبة الأم', value: c.mother_last_name || '---' },
    { label: 'تاريخ الميلاد', value: c.date_of_birth || '---' },
    { label: 'مكان الولادة/القيد', value: c.place_of_registration || '---' },
    { label: 'الرقم الوطني', value: c.national_id || '---' }
  ];

  return (
    <div className={styles.pageWrapper}>
      <button onClick={() => navigate(getBackPath())} className={styles.backButton} type="button">
        <FaArrowRight />
        {isAdminMode ? 'عودة لسجل الطلبات' : 'عودة للطلبات المعلقة'}
      </button>

      <header className={styles.topHeader}>
        <h2 className={styles.mainTitle}>مراجعة بيانات الطلب: {c.first_name || ''} {c.last_name || ''}</h2>
      </header>

      <div className={styles.contentGrid}>
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

        <div className={styles.leftCol}>
          <div className={styles.sectionLabel}><FaFileAlt /> البيانات المدخلة</div>
          <UserInfoCard data={fullData} />

          {!isAdminMode && requestData.status === 'pending' && (
            <div className={styles.actionsContainer}>
              <DecisionActions
                onAccept={() => setShowConfirm(true)}
                onReject={() => setShowReject(true)}
                disabled={isProcessing}
              />
            </div>
          )}

          {!isAdminMode && requestData.status !== 'pending' && (
            <div style={{
              marginTop: '20px',
              padding: '14px',
              borderRadius: '8px',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              تمت معالجة هذا الطلب مسبقاً.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleApproveSubmit}
        isLoading={isProcessing}
        requestNumber={requestData.request_number}
      />
      <RejectModal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleRejectSubmit}
        isLoading={isProcessing}
        requestId={requestData.request_number}
      />
    </div>
  );
};

export default RequestReview;
