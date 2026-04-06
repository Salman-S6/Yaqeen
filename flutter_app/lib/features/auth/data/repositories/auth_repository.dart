import 'dart:io';
import '../models/user_model.dart';

class AuthRepository {

  Future<UserModel> login(String email, String password) async {
    await Future.delayed(const Duration(seconds: 2));

    if (email == "ahmed@mail.com" && password == "12345678") {
      final mockJsonResponse = {
        "token": "mock_token_12345_abcde",
        "role": "citizen"
      };
      return UserModel.fromJson(mockJsonResponse);
    } else {
      throw Exception("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  }

  Future<UserModel> register(String nationalId, String email, String password, File idImage) async {
    await Future.delayed(const Duration(seconds: 3));

    final mockJsonResponse = {
      "token": "mock_token_98765_xyz",
      "role": "citizen"
    };

    return UserModel.fromJson(mockJsonResponse);
  }

  Future<void> logout() async {
    await Future.delayed(const Duration(milliseconds: 500));
  }
}