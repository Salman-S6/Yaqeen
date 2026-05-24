import 'package:dio/dio.dart';

class ErrorHandler {
  static String handle(dynamic error) {
    String errorMessage = "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.";

    if (error is DioException) {
      if (error.type == DioExceptionType.connectionTimeout ||
          error.type == DioExceptionType.receiveTimeout) {
        return "انتهى وقت الاتصال. يرجى التأكد من جودة الإنترنت أو حالة السيرفر.";
      }

      if (error.type == DioExceptionType.connectionError) {
        return "لا يوجد اتصال بالإنترنت أو السيرفر متوقف.";
      }

      if (error.response != null && error.response?.data != null) {
        final responseData = error.response!.data;

        if (responseData is Map<String, dynamic>) {
          errorMessage = responseData['message'] ?? errorMessage;

          if (responseData['errors'] != null) {
            final errors = responseData['errors'] as Map<String, dynamic>;
            if (errors.isNotEmpty) {
              errorMessage = errors.values.first[0].toString();
            }
          }
        } else if (responseData is String) {
          errorMessage = "حدث خطأ في السيرفر (500). يرجى مراجعة الدعم الفني.";
        }
      }
    } else {
      errorMessage = error.toString().replaceAll("Exception: ", "");
    }

    return errorMessage;
  }
}