import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/network/error_handler.dart';
import '../models/service_type_model.dart';
import '../models/request_model.dart';

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

  Future<RequestsResponse> getRequests() async {
    try {
      final response = await _dioClient.dio.get('/requests');
      return RequestsResponse.fromJson(response.data);
    } catch (e) {
      throw Exception(ErrorHandler.handle(e));
    }
  }

  Future<RequestModel> getRequestDetail(String id) async {
    try {
      final response = await _dioClient.dio.get('/requests/$id');
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