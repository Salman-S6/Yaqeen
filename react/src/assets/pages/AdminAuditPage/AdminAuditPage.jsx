import React from 'react';
import styles from './AdminAuditPage.module.css';

const AdminAuditPage = () => {
  const auditLogs = [
    { id: 1, user: "منال الحسن", action: "اعتمدت الطلب REQ-000042 للمواطن أحمد المحمود", time: "3 أبريل 2025 - 12:30 م", details: "موظف | طلبات | pending → approved", color: "green" },
    { id: 2, user: "رامي السيد", action: "رفض الطلب REQ-000041 - السبب: الهوية غير واضحة للمواطن يوسف العمر", time: "3 أبريل 2025 - 9:15 ص", details: "موظف | طلبات | pending → rejected", color: "red" },
    { id: 3, user: "خالد الأحمد", action: "قدّم طلباً جديداً REQ-000044 - إخراج قيد فردي للمواطن خالد الأحمد", time: "3 أبريل 2025 - 8:00 ص", details: "مواطن | طلبات", color: "orange" },
    { id: 4, user: "المدير", action: "عرض تقرير الأداء الأسبوعي للإدارة", time: "2 أبريل 2025 - 3:45 م", details: "مدير | تقارير", color: "blue" },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* شريط الفلاتر مرتب من اليمين لليسار */}
      <div className={styles.filterBar}>
        
        {/* 1. كل الإجراءات */}
        <select className={styles.sturdySelect}>
          <option>كل الإجراءات</option>
          <option>اعتماد</option>
          <option>رفض</option>
          <option>تسجيل دخول</option>
          <option>تعليق حساب</option>
        </select>

        {/* 2. كل الأدوار */}
        <select className={styles.sturdySelect}>
          <option>كل الأدوار</option>
          <option>مدير</option>
          <option>موظف</option>
          <option>مواطن</option>
        </select>

        {/* 3. من [التاريخ] */}
        <div className={styles.dateItem}>
          <span className={styles.label}>من</span>
          <div className={styles.inputBox}>
            <input type="text" value="01/04/2025" readOnly /> 📅
          </div>
        </div>

        {/* 4. إلى [التاريخ] */}
        <div className={styles.dateItem}>
          <span className={styles.label}>إلى</span>
          <div className={styles.inputBox}>
            <input type="text" value="05/04/2025" readOnly /> 📅
          </div>
        </div>
      </div>

      {/* الكرت الأبيض الأساسي */}
      <div className={styles.auditCard}>
        <h2 className={styles.cardTitle}>السجل الزمني – لا يمكن الحذف</h2>
        <div className={styles.forceLine}></div> {/* خط تحت العنوان */}

        <div className={styles.logsList}>
          {auditLogs.map((log, index) => (
            <div key={log.id}>
              <div className={styles.logItem}>
                <div className={`${styles.statusDot} ${styles[log.color]}`}></div>
                <div className={styles.textStack}>
                  <p className={styles.actionText}><strong>{log.user}</strong> {log.action}</p>
                  <p className={styles.metaText}>{log.time} | {log.details}</p>
                </div>
              </div>
              {/* الخط الأفقي تحت كل موظف (منال، رامي...) */}
              {index !== auditLogs.length - 1 && <div className={styles.forceLine}></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAuditPage;