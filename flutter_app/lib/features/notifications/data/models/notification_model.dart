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

    String parseSmartTime(String? dateStr) {
      if (dateStr == null || dateStr.isEmpty) return 'الآن';

      try {
        if (dateStr.endsWith('Z')) {
          dateStr = dateStr.substring(0, dateStr.length - 1);
        }

        DateTime parsedDate = DateTime.parse(dateStr);
        DateTime now = DateTime.now();
        Duration diff = now.difference(parsedDate);

        if (diff.isNegative) {
          return 'الآن';
        }

        if (diff.inDays > 365) {
          int years = (diff.inDays / 365).floor();
          return years == 1 ? 'منذ سنة' : (years == 2 ? 'منذ سنتين' : 'منذ $years سنوات');
        } else if (diff.inDays > 30) {
          int months = (diff.inDays / 30).floor();
          return months == 1 ? 'منذ شهر' : (months == 2 ? 'منذ شهرين' : 'منذ $months أشهر');
        } else if (diff.inDays > 0) {
          return diff.inDays == 1 ? 'منذ يوم' : (diff.inDays == 2 ? 'منذ يومين' : (diff.inDays <= 10 ? 'منذ ${diff.inDays} أيام' : 'منذ ${diff.inDays} يوماً'));
        } else if (diff.inHours > 0) {
          return diff.inHours == 1 ? 'منذ ساعة' : (diff.inHours == 2 ? 'منذ ساعتين' : (diff.inHours <= 10 ? 'منذ ${diff.inHours} ساعات' : 'منذ ${diff.inHours} ساعة'));
        } else if (diff.inMinutes > 0) {
          return diff.inMinutes == 1 ? 'منذ دقيقة' : (diff.inMinutes == 2 ? 'منذ دقيقتين' : (diff.inMinutes <= 10 ? 'منذ ${diff.inMinutes} دقائق' : 'منذ ${diff.inMinutes} دقيقة'));
        } else {
          return 'الآن';
        }
      } catch (e) {
        return 'الآن';
      }
    }

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

      createdAt: parseSmartTime(json['created_at']?.toString()),
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