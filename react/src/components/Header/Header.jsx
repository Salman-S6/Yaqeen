import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaBars } from 'react-icons/fa'; // 🟢 استدعاء أيقونة القائمة
import styles from './Header.module.css';

const Header = ({ title, subtitle, currentUser = {}, activeRole = '', toggleSidebar }) => { // 🟢 استقبال الدالة
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const normalizedRole = String(activeRole).toLowerCase();
  const isAdmin = normalizedRole === 'admin' || normalizedRole === 'مدير النظام';

  const [notifications, setNotifications] = useState([
    { id: 1, text: isAdmin ? "هناك مستخدم جديد بانتظار التفعيل" : "طلب جديد بحاجة لمراجعة فورية", time: "قبل 5 دقائق", unread: true, link: isAdmin ? "/admin/users" : "/employee/pending-requests" },
    { id: 2, text: isAdmin ? "تقرير النظام الأسبوعي جاهز" : "تنبيه: طلبات تجاوزت وقت SLA", time: "قبل 15 دقيقة", unread: true, link: isAdmin ? "/admin/users" : "/employee/pending-requests" },
    { id: 3, text: "تم تحديث صلاحيات حسابك بنجاح", time: "قبل ساعتين", unread: false, link: "#" }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotificationClick = (id, link) => {
    setNotifications(prevNotifs => prevNotifs.map(n => n.id === id ? { ...n, unread: false } : n));
    setIsNotifOpen(false);
    if (link !== "#") navigate(link);
  };

  const markAllAsRead = () => setNotifications(prevNotifs => prevNotifs.map(n => ({ ...n, unread: false })));

  return (
    <header className={styles.header}>
      {/* 🟢 تجميعة زر القائمة + العنوان */}
      <div className={styles.headerRight}>
        <button className={styles.menuToggleBtn} onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.bellWrapper}>
          <div onClick={(e) => { e.stopPropagation(); setIsNotifOpen(!isNotifOpen); }} style={{ position: 'relative', cursor: 'pointer' }}>
            <FaBell className={styles.bellIcon} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </div>

          {isNotifOpen && (
            <div className={styles.notifDropdown} onClick={(e) => e.stopPropagation()}>
              <div className={styles.notifHeader}>
                <h4>الإشعارات</h4>
                <span className={styles.markRead} onClick={markAllAsRead}>تحديد كـ مقروء</span>
              </div>
              <ul className={styles.notifList}>
                {notifications.map(n => (
                  <li key={n.id} className={n.unread ? styles.unreadItem : styles.readItem} onClick={() => handleNotificationClick(n.id, n.link)}>
                    <p>{n.text}</p><small>{n.time}</small>
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