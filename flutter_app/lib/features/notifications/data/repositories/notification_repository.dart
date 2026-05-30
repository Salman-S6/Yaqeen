import '../../../../core/network/dio_client.dart';
import '../../../../core/network/api_endpoints.dart';
import '../models/notification_model.dart';

class NotificationRepository {
  final DioClient dioClient;

  NotificationRepository({required this.dioClient});

  Future<NotificationsResponse> fetchNotifications() async {
    try {
      final response = await dioClient.dio.get(ApiEndpoints.notifications);
      return NotificationsResponse.fromJson(response.data);
    } catch (e) {
      throw Exception("فشل في جلب الإشعارات: $e");
    }
  }

  Future<bool> markNotificationAsRead(int id) async {
    try {
      await dioClient.dio.patch(ApiEndpoints.markNotificationAsRead(id));
      return true;
    } catch (e) {
      throw Exception("فشل في تحديث حالة الإشعار: $e");
    }
  }
}