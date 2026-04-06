import '../../../../core/widgets/indicators/status_badge.dart';
import '../models/request_model.dart';

class CitizenRepository {
  // محاكاة جلب الطلبات
  Future<List<RequestModel>> getRequests() async {
    await Future.delayed(const Duration(seconds: 1));
    return [
      RequestModel(id: "REQ-000042", title: "إخراج قيد فردي", date: "2 أبريل", icon: "📄", status: RequestStatus.accepted),
      RequestModel(id: "REQ-000039", title: "بيان عائلي", date: "28 مارس", icon: "👨‍👩‍👧", status: RequestStatus.review),
    ];
  }

  // محاكاة جلب تفاصيل طلب
  Future<RequestModel> getRequestDetail(String id) async {
    await Future.delayed(const Duration(milliseconds: 500));
    return RequestModel(
      id: id,
      title: "إخراج قيد فردي",
      date: "2 أبريل 2026",
      icon: "📄",
      status: RequestStatus.accepted,
      fullName: "أحمد محمد السوري",
      nationalId: "12345678901",
      registrationPlace: "دمشق",
    );
  }
}
