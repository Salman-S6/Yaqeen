class NotificationModel {
  final int id;
  final String title;
  final String body;
  final bool isRead;
  final String createdAt;

  NotificationModel({
    required this.id,
    required this.title,
    required this.body,
    required this.isRead,
    required this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      // معالجة الـ id سواء رجع رقم أو نص
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      title: json['title']?.toString() ?? 'تنبيه جديد',
      body: json['body']?.toString() ?? '',
      // معالجة حالة القراءة سواء رجعت true/false أو 1/0 أو إذا كان في تاريخ للقراءة
      isRead: json['is_read'] == true ||
          json['is_read'] == 1 ||
          json['is_read'] == '1' ||
          json['read_at'] != null,
      createdAt: json['created_at']?.toSt() ?? '',
    );
  }
}

// 🌟 هذا الكلاس الثاني لنستقبل القائمة ومعها العداد في ضربة واحدة
class NotificationsResponse {
  final List<NotificationModel> notifications;
  final int unreadCount;

  NotificationsResponse({
    required this.notifications,
    required this.unreadCount,
  });

  factory NotificationsResponse.fromJson(Map<String, dynamic> json) {
    // 1. استخراج قائمة الإشعارات
    var list = json['data'] as List? ?? json['notifications'] as List? ?? [];
    List<NotificationModel> notificationList = list.map((i) => NotificationModel.fromJson(i)).toList();

    // 2. استخراج عداد غير المقروء
    int count = json['unread_count'] is int
        ? json['unread_count']
        : int.tryParse(json['unread_count']?.toString() ?? '0') ?? 0;

    return NotificationsResponse(
      notifications: notificationList,
      unreadCount: count,
    );
  }
}