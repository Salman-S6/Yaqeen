import React, { useState } from 'react';
import styles from './Reports.module.css';

const reportsData = [
  { id: 1, title: 'تقرير الطلبات الشهري', subtitle: 'أبريل ٢٠٢٥ - تلقائي', type: 'total_orders' },
  { id: 2, title: 'تقرير أداء الموظفين', subtitle: 'الأسبوع الأخير', type: 'employee_performance' },
  { id: 3, title: 'تقرير OCR الشهري', subtitle: 'معدلات النجاح والفشل', type: 'ocr_report' },
  { id: 4, title: 'سجل التحقق الخارجي', subtitle: 'جميع عمليات مسح QR', type: 'external_verification' }
];

// مصفوفة الخيارات الخاصة بالقائمة المنسدلة المخصصة
const dropdownOptions = [
  { value: 'total_orders', label: 'إجمالي الطلبات' },
  { value: 'employee_performance', label: 'أداء الموظفين' },
  { value: 'ocr_report', label: 'إحصائيات OCR' },
  { value: 'external_verification', label: 'سجل التحقق الخارجي' }
];

export default function Reports() {
  const [fromDate, setFromDate] = useState('2025-04-01');
  const [toDate, setToDate] = useState('2025-05-05');
  const [reportType, setReportType] = useState('total_orders');
  
  // الـ States الجديدة للتحكم بفتح وإغلاق القائمة المخصصة
  const [isOpen, setIsOpen] = useState(false);

  // جلب النص (Label) الخاص بالخيار المحدد حالياً لعرضه في البوكس
  const currentLabel = dropdownOptions.find(opt => opt.value === reportType)?.label;

  const handleExport = (type, format) => {
    console.log(`تصدير ${type} بصيغة ${format}`);
  };

  const handleSelectOption = (value) => {
    setReportType(value);
    setIsOpen(false); // إغلاق القائمة فوراً بعد الاختيار
  };

  return (
    <div className={styles.container}>
      
      {/* المربع الأبيض الرئيسي للفلاتر */}
      <section className={styles.filterCard}>
        <div className={styles.inputsGrid}>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>من تاريخ</label>
            <input 
              type="date" 
              className={styles.inputField} 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>إلى تاريخ</label>
            <input 
              type="date" 
              className={styles.inputField} 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
            />
          </div>
          
        </div>

        {/* نوع التقرير: تم تحويله إلى Custom Dropdown يتأثر بالـ CSS ليصبح شريط الاختيار أخضر */}
        <div className={styles.inputGroup} style={{ marginTop: '20px', position: 'relative' }}>
          <label className={styles.label}>نوع التقرير</label>
          
          {/* رأس القائمة المنسدلة المخصص */}
          <div 
            className={`${styles.inputField} ${styles.dropdownHeader}`} 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{currentLabel}</span>
            <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>▼</span>
          </div>

          {/* حاوية الخيارات المنبثقة الخضراء */}
          {isOpen && (
            <div className={styles.dropdownContainer}>
              {dropdownOptions.map((option) => (
                <div 
                  key={option.value}
                  className={`${styles.dropdownOption} ${reportType === option.value ? styles.optionActive : ''}`}
                  onClick={() => handleSelectOption(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.btnExcel} onClick={() => handleExport(reportType, 'Excel')}>تصدير Excel</button>
          <button className={styles.btnPdf} onClick={() => handleExport(reportType, 'PDF')}>تصدير PDF</button>
        </div>
      </section>

      {/* قائمة التقارير المتاحة */}
      <h2 className={styles.listTitle}>التقارير المتاحة</h2>
      <div className={styles.reportsList}>
        {reportsData.map((report) => (
          <div key={report.id} className={styles.reportCard}>
            
            {/* تفاصيل التقرير على اليمين */}
            <div className={styles.reportInfo}>
              <h3 className={styles.reportTitle}>{report.title}</h3>
              <p className={styles.reportSubtitle}>{report.subtitle}</p>
            </div>

            {/* أزرار التصدير على اليسار */}
            <div className={styles.cardActions}>
              <button className={styles.btnCardAction} onClick={() => handleExport(report.type, 'Excel')}>Excel</button>
              <button className={styles.btnCardAction} onClick={() => handleExport(report.type, 'PDF')}>PDF</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}