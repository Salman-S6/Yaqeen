
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

      Map<String, dynamic> citizenData = jsonDecode(decodedJsonString);

      return {
        "document_type": citizenData['service_name']?.toString()
            ?? citizenData['service']?.toString()
            ?? citizenData['document_type']?.toString()
            ?? "وثيقة حكومية",
        "request_id":   citizenData['request_number']?.toString() ?? "غير معروف",
        "citizen_name": citizenData['citizen_name']?.toString()    ?? "غير متوفر",
        "national_id":  citizenData['national_id']?.toString()     ?? "غير متوفر",
        "issue_date":   _safeDate(citizenData['issued_at']),
      };

    } catch (e) {
      throw Exception("فشل في قراءة الوثيقة: $e");
    }
  }

  String _safeDate(dynamic value) {
    if (value == null) return "تاريخ غير متوفر";
    final s = value.toString();
    return s.length >= 10 ? s.substring(0, 10) : s;
  }
}