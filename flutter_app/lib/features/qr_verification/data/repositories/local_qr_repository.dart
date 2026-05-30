import 'dart:convert';
import '../../../../core/utils/rsa_verifier.dart';

class LocalQrRepository {
  Future<Map<String, String>> verifyDocumentSignature(String scannedUrl) async {
    try {
      Uri uri = Uri.parse(scannedUrl);
      String? p = uri.queryParameters['p'];
      String? sig = uri.queryParameters['sig'];

      if (p == null || sig == null) {
        throw Exception("رمز QR غير صالح: تنقصه بيانات التحقق الأمني.");
      }

      bool isAuthentic = RsaVerifier.verifySignature(data: p, base64Signature: sig);

      if (!isAuthentic) {
        throw Exception("التوقيع الرقمي لا يطابق المفتاح العام. الوثيقة مزورة.");
      }

      String decodedJsonString = utf8.decode(base64.decode(p));

      print("QR_DEBUG_DATA: $decodedJsonString");

      Map<String, dynamic> citizenData = jsonDecode(decodedJsonString);

      return {
        "document_type": citizenData['service']?.toString() ?? "وثيقة حكومية",
        "request_id": citizenData['request_number']?.toString() ?? "غير معروف",
        "citizen_name": citizenData['citizen_name']?.toString() ?? "غير متوفر",
        "national_id": citizenData['national_id']?.toString() ?? "غير متوفر",
        "issue_date": citizenData['issued_at']?.toString().substring(0, 10) ?? "تاريخ غير متوفر",  "document_type": citizenData['service_name'] ?? citizenData['document_type'] ?? "وثيقة حكومية",
      };

    } catch (e) {
      throw Exception("فشل في قراءة الوثيقة: $e");
    }
  }
}