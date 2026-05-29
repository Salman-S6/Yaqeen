import '../../../../core/network/dio_client.dart';
import '../../../../core/network/api_endpoints.dart';
import '../models/notification_model.dart';

class NotificationRepository {
  final DioClient dioClient;

  NotificationRepository({required this.dioClient});

  /// جلب جميع الإشعارات مع العداد من السيرفر
  Future<NotificationsResponse> fetchNotifications() async {
    try {
      // 🌟 التعديل هنا: استخدمنا dioClient.dio.get بدلاً من dioClient.get
      final response = await dioClient.dio.get(ApiEndpoints.notifications);
      return NotificationsResponse.fromJson(response.data);
    } catch (e) {
      throw Exception("فشل في جلب الإشعارات: $e");
    }
  }

  /// إرسال طلب PATCH للسيرفر لجعل الإشعار "مقروءاً"
  Future<bool> markNotificationAsRead(int id) async {
    try {
      // 🌟 التعديل هنا: استخدمنا dioClient.dio.patch بدلاً من dioClient.patch
      await dioClient.dio.patch(ApiEndpoints.markNotificationAsRead(id));
      return true;
    } catch (e) {
      throw Exception("فشل في تحديث حالة الإشعار: $e");
    }
  }
}