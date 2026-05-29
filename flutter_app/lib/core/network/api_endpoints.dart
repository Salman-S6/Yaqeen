class ApiEndpoints {
  static const String baseUrl = "https://septifragally-unprotesting-darcie.ngrok-free.dev/api";

  // روابط المصادقة
  static const String register = "/auth/register";
  static const String login = "/auth/login";
  static const String logout = "/auth/logout";
  static const String getMe = "/auth/me";

  // روابط الطلبات والخدمات
  static const String serviceTypes = "/service-types";
  static const String requests = "/requests";

  // 🌟 روابط الإشعارات (الجديدة)
  static const String notifications = "/notifications";
  static String markNotificationAsRead(int id) => "/notifications/$id/read";
}