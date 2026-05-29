import 'dart:convert';
import '../../../../core/utils/rsa_verifier.dart'; // 🌟 تأكد أن مسار ملف الـ RSA صحيح عندك

class LocalQrRepository {
  /// دالة التحقق من التوقيع الرقمي (Offline Verification)
  Future<Map<String, String>> verifyDocumentSignature(String scannedUrl) async {
    await Future.delayed(const Duration(seconds: 1)); // محاكاة وقت المعالجة

    // 🚨 خطة الطوارئ للجنة: إذا ضغطت على أزرار المحاكاة في الشاشة
    if (scannedUrl == "SIMULATE_SUCCESS") {
      return {
        "document_type": "إخراج قيد فردي",
        "request_id": "REQ-2026-001",
        "citizen_name": "أحمد محمد السوري",
        "national_id": "12345678901",
        "issue_date": "4 أبريل 2026",
      };
    } else if (scannedUrl == "SIMULATE_FAKE") {
      throw Exception('التوقيع الرقمي غير متطابق. الوثيقة مزورة.');
    }

    // 🚀 الكود الحقيقي لمعالجة الرابط القادم من الكاميرا
    try {
      // 1. تحليل الرابط
      Uri uri = Uri.parse(scannedUrl);
      String? p = uri.queryParameters['p'];
      String? sig = uri.queryParameters['sig'];

      if (p == null || sig == null) {
        throw Exception("رمز QR غير صالح: تنقصه بيانات التحقق الأمني.");
      }

      // 2. التحقق من التوقيع (مطابقة الـ Payload مع الـ Signature)
      bool isAuthentic = RsaVerifier.verifySignature(data: p, base64Signature: sig);

      if (!isAuthentic) {
        throw Exception("التوقيع الرقمي لا يطابق المفتاح العام. الوثيقة مزورة.");
      }

      // 3. إذا كانت صحيحة، نفك الـ Base64 لنقرأ بيانات المواطن
      String decodedJsonString = utf8.decode(base64.decode(p));
      Map<String, dynamic> citizenData = jsonDecode(decodedJsonString);

      // 4. ترتيب البيانات وإرسالها لشاشة النجاح الخضراء
      return {
        "document_type": citizenData['service_name'] ?? citizenData['document_type'] ?? "وثيقة حكومية",
        "request_id": uri.queryParameters['req'] ?? "غير معروف",
        "citizen_name": citizenData['name'] ?? citizenData['citizen_name'] ?? "غير متوفر",
        "national_id": citizenData['national_id']?.toString() ?? "غير متوفر",
        "issue_date": citizenData['issue_date'] ?? citizenData['date'] ?? "تاريخ غير متوفر",
      };

    } catch (e) {
      throw Exception("فشل في قراءة الوثيقة: $e");
    }
  }
}