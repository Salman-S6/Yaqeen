class LocalQrRepository {
  /// محاكاة دالة التحقق من التوقيع الرقمي (Offline Verification)
  /// تستقبل النص الخام من الـ QR وترجع البيانات إذا كان صحيحاً، أو ترمي خطأ إذا كان مزوراً.
  Future<Map<String, String>> verifyDocumentSignature(String rawData) async {
    await Future.delayed(const Duration(seconds: 2));

    if (rawData.toLowerCase().contains('fake')) {
      throw Exception('التوقيع الرقمي غير متطابق. الوثيقة مزورة.');
    }
    return {
      "document_type": "إخراج قيد فردي",
      "request_id": "REQ-2026-001",
      "citizen_name": "أحمد محمد السوري",
      "national_id": "12345678901",
      "issue_date": "4 أبريل 2026",
    };
  }
}