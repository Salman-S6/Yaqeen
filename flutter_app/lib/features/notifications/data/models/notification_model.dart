class NotificationModel {
  final int id;
  final String title;
  final String body;
  final String? type;
  final String? requestNumber;
  final bool isRead;
  final String createdAt;

  NotificationModel({
    required this.id,
    required this.title,
    required this.body,
    this.type,
    this.requestNumber,
    required this.isRead,
    required this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,

      title: json['subject']?.toString() ?? json['title']?.toString() ?? 'تنبيه جديد',
      body: json['message']?.toString() ?? json['body']?.toString() ?? '',

      type: json['type']?.toString(),
      requestNumber: json['request_number']?.toString(),

      isRead: json['is_read'] == true ||
          json['is_read'] == 1 ||
          json['is_read'] == '1' ||
          json['read_at'] != null,

      createdAt: json['created_at']?.toString() ?? '',
    );
  }
}

class NotificationsResponse {
  final List<NotificationModel> notifications;
  final int unreadCount;
  final String status;

  NotificationsResponse({
    required this.notifications,
    required this.unreadCount,
    this.status = '',
  });

  factory NotificationsResponse.fromJson(Map<String, dynamic> json) {
    var list = json['data'] as List? ?? json['notifications'] as List? ?? [];
    List<NotificationModel> notificationList = list.map((i) => NotificationModel.fromJson(i)).toList();

    int count = json['unread_count'] is int
        ? json['unread_count']
        : int.tryParse(json['unread_count']?.toString() ?? '0') ?? 0;

    return NotificationsResponse(
      notifications: notificationList,
      unreadCount: count,
      status: json['status']?.toString() ?? '',
    );
  }
}