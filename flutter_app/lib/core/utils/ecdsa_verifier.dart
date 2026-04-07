import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:elliptic/elliptic.dart';
import 'package:ecdsa/ecdsa.dart';
import 'package:flutter/foundation.dart';

class EcdsaVerifier {
  /// ------------------------------------------------------------------
  /// [المفتاح العام - Public Key]
  /// هاد هو السطر الوحيد اللي رح تعدله لاحقاً!
  /// بس يخلص مبرمج الباك إند، قله: "أعطيني الـ Public Key بصيغة Hex"
  /// واستبدل هاد النص الطويل بالمفتاح اللي بيعطيك ياه.
  /// ------------------------------------------------------------------
  static const String _serverPublicKeyHex =
      "04b4c79421a2cbcd3050bc77cc3c778726beea3ec05f033cfeddb9d7cd58b9cf2a129ef3e316d3e69f8c47ef1e7bce1f42e431dfc9f13ba339ed5b07246ec36e6e";


  static bool verifyOffline({required String payload, required String signatureHex}) {
    try {
      // 1. تحديد نوع منحنى التشفير (نفس اللي بيستخدمه السيرفر، P256 هو الأشهر)
      var curve = getP256();

      // 2. قراءة المفتاح العام
      var publicKey = PublicKey.fromHex(curve, _serverPublicKeyHex);

      // 3. تشفير بيانات الـ QR لتصبح بصمة (Hash)
      var hashBytes = sha256.convert(utf8.encode(payload)).bytes;

      // 4. قراءة التوقيع الرقمي اللي جاي من الـ QR
      var signature = Signature.fromASN1Hex(signatureHex);

      // 5. التحقق الرياضي! (هل التوقيع يطابق البيانات والمفتاح؟)
      bool isValid = verify(publicKey, hashBytes, signature);

      if (isValid) {
        debugPrint("✅ التوقيع الرقمي صحيح - الوثيقة أصلية");
      } else {
        debugPrint("❌ التوقيع الرقمي خاطئ - الوثيقة مزورة أو معدلة");
      }

      return isValid;

    } catch (e) {
      // التقاط أي خطأ إذا كان الـ QR معطوب أو مو مكتوب صح
      debugPrint("⚠️ خطأ في عملية فحص التشفير: $e");
      return false;
    }
  }
}