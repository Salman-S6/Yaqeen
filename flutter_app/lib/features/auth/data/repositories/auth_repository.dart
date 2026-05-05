import 'dart:io';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/network/api_endpoints.dart';
import '../../../../core/network/error_handler.dart';

class AuthRepository {
  final DioClient _dioClient = DioClient();

  void updateApiServiceToken(String token) {
    _dioClient.dio.options.headers["Authorization"] = "Bearer $token";
  }

  Future<UserModel> getMe() async {
    try {
      final response = await _dioClient.dio.get(ApiEndpoints.getMe);
      return UserModel.fromJson(response.data);
    } catch (e) {
      throw Exception(ErrorHandler.handle(e));
    }
  }

  Future<UserModel> login(String email, String password) async {
    try {
      final response = await _dioClient.dio.post(
        ApiEndpoints.login,
        data: {'email': email, 'password': password},
      );

      final token = response.data['token'];
      if (token != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        updateApiServiceToken(token);
      }

      return UserModel.fromJson(response.data);

    } catch (e) {
      throw Exception(ErrorHandler.handle(e));
    }
  }

  Future<UserModel> register({
    required String firstName,
    required String lastName,
    required String nationalId,
    required String fatherName,
    required String motherFirstName,
    required String motherLastName,
    required String dateOfBirth,
    required String placeOfRegistration,
    required String email,
    required String password,
    required String passwordConfirmation,
    required File idImage,
  }) async {
    try {
      FormData formData = FormData.fromMap({
        'first_name': firstName,
        'last_name': lastName,
        'national_id': nationalId,
        'father_name': fatherName,
        'mother_first_name': motherFirstName,
        'mother_last_name': motherLastName,
        'date_of_birth': dateOfBirth,
        'place_of_registration': placeOfRegistration,
        'email': email,
        'password': password,
        'password_confirmation': passwordConfirmation,
        'id_image': await MultipartFile.fromFile(
          idImage.path,
          filename: idImage.path.split('/').last,
        ),
      });

      final response = await _dioClient.dio.post(
        ApiEndpoints.register,
        data: formData,
      );

      final token = response.data['token'];
      if (token != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        updateApiServiceToken(token);
      }

      return UserModel.fromJson(response.data);

    } catch (e) {
      if (e is DioException) {
        if (e.response?.statusCode == 422 || e.response?.statusCode == 400) {
          final serverData = e.response?.data;
          String errorMessage = "خطأ في البيانات المدخلة";

          if (serverData != null) {
            if (serverData['message'] != null) {
              errorMessage = serverData['message'];
            } else if (serverData['errors'] != null) {
              errorMessage = serverData['errors'].toString();
            }
          }

          throw Exception(errorMessage);
        }
      }
      throw Exception(ErrorHandler.handle(e));
    }
  }

  Future<void> logout() async {
    try {
      await _dioClient.dio.post(ApiEndpoints.logout);
    } catch (e) {
    } finally {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('auth_token');
      _dioClient.dio.options.headers.remove("Authorization");
    }
  }
}