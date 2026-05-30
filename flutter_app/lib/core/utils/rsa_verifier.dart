import 'package:encrypt/encrypt.dart' as enc;
import 'package:pointycastle/asymmetric/api.dart';
import '../constants/app_keys.dart';

class RsaVerifier {
  static bool verifySignature({required String data, required String base64Signature}) {
    try {
      final parser = enc.RSAKeyParser();
      final RSAPublicKey publicKey = parser.parse(AppKeys.rsaPublicKey) as RSAPublicKey;

      final signer = enc.Signer(enc.RSASigner(enc.RSASignDigest.SHA256, publicKey: publicKey));

      return signer.verify64(data, base64Signature);
    } catch (e) {
      print("خطأ في عملية التحقق: $e");
      return false;
    }
  }
}