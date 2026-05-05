import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/network/api_endpoints.dart';
import '../../../../core/network/error_handler.dart';
import '../models/service_type_model.dart';
import '../models/request_model.dart'; // استدعاء الموديل الجديد

class CitizenRepository {
  final DioClient _dioClient = DioClient();

  Future<List<ServiceTypeModel>> getServiceTypes() async {
    try {
      final response = await _dioClient.dio.get('/service-types');
      final List data = response.data['data'] ?? response.data;
      return data.map((json) => ServiceTypeModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception(ErrorHandler.handle(e));
    }
  }

  // التعديل: إرجاع RequestModel
  Future<List<RequestModel>> getRequests() async {
    try {
      final response = await _dioClient.dio.get('/requests');
      final List data = response.data['data'] ?? response.data;
      return data.map((json) => RequestModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception(ErrorHandler.handle(e));
    }
  }

  // التعديل: إرجاع RequestModel
  Future<RequestModel> getRequestDetail(String id) async {
    try {
      final response = await _dioClient.dio.get('/requests/$id');
      print("====== الداتا القادمة من السيرفر للطلب رقم $id ======");
      print(response.data);
      print("=======================================");
      final data = response.data['data'] ?? response.data;
      return RequestModel.fromJson(data);
    } catch (e) {
      throw Exception(ErrorHandler.handle(e));
    }
  }

  Future<void> submitRequest({
    required int serviceTypeId,
    required String notes,
    required int quantity,
  }) async {
    try {
      await _dioClient.dio.post(
        '/requests',
        data: {
          'service_type_id': serviceTypeId,
          'notes': notes,
          'quantity': quantity,
        },
      );
    } catch (e) {
      if (e is DioException && e.response?.statusCode == 422) {
        final serverData = e.response?.data;
        String errorMsg = serverData['message'] ?? "بيانات الطلب غير صالحة";
        throw Exception(errorMsg);
      }
      throw Exception(ErrorHandler.handle(e));
    }
  }
}