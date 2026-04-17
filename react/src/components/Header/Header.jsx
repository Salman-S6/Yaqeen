import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // لإمكانية التنقل عند الضغط
import { FaBell } from 'react-icons/fa';
import styles from './Header.module.css';

const Header = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // جعل الإشعارات في الحالة (State) لكي نتمكن من تعديلها (نقصان الرقم)
  const [notifications, setNotifications] = useState([
    { id: 1, text: "طلب جديد (بيان عائلي) بحاجة لمراجعة فورية", time: "قبل 5 دقائق", unread: true, link: "/pending-requests" },
    { id: 2, text: "تنبيه: 3 طلبات تجاوزت وقت SLA", time: "قبل 15 دقيقة", unread: true, link: "/pending-requests" },
    { id: 3, text: "تم تحديث صلاحيات حسابك بنجاح", time: "قبل ساعتين", unread: false, link: "#" }
  ]);

  // حساب الرقم الأحمر ديناميكياً بناءً على الإشعارات غير المقروءة فقط
  const unreadCount = notifications.filter(n => n.unread).length;

  // دالة التعامل مع الضغط على الإشعار
  const handleNotificationClick = (id, link) => {
    // 1. تحديث حالة الإشعار ليصبح "مقروء" (هذا سينقص الرقم تلقائياً)
    setNotifications(prevNotifs =>
      prevNotifs.map(n => n.id === id ? { ...n, unread: false } : n)
    );

    // 2. إغلاق القائمة
    setIsNotifOpen(false);

    // 3. التوجه للرابط المطلوب (مثلاً صفحة الطلبات)
    if (link !== "#") {
      navigate(link);
    }
  };

  // دالة لتحديد الكل كمقروء (تصفير الرقم تماماً)
  const markAllAsRead = () => {
    setNotifications(prevNotifs => prevNotifs.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.bellWrapper}>
          <div onClick={() => setIsNotifOpen(!isNotifOpen)} style={{ position: 'relative' }}>
            <FaBell className={styles.bellIcon} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </div>

          {isNotifOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <h4>الإشعارات</h4>
                <span className={styles.markRead} onClick={markAllAsRead}>تحديد كـ مقروء</span>
              </div>
              <ul className={styles.notifList}>
                {notifications.map(n => (
                  <li
                    key={n.id}
                    className={n.unread ? styles.unreadItem : styles.readItem}
                    onClick={() => handleNotificationClick(n.id, n.link)}
                  >
                    <p>{n.text}</p>
                    <small>{n.time}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;