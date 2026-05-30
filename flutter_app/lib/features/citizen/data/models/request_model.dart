import '../../../../core/widgets/indicators/status_badge.dart';

class RequestStats {
  final int total;
  final int pending;
  final int completed;

  RequestStats({
    required this.total,
    required this.pending,
    required this.completed,
  });

  factory RequestStats.fromJson(Map<String, dynamic> json) {
    return RequestStats(
      total: json['total'] ?? 0,
      pending: json['pending'] ?? 0,
      completed: json['completed'] ?? 0,
    );
  }
}

class RequestsResponse {
  final List<RequestModel> requests;
  final RequestStats stats;

  RequestsResponse({
    required this.requests,
    required this.stats,
  });

  factory RequestsResponse.fromJson(Map<String, dynamic> json) {
    var list = json['data'] as List? ?? [];
    List<RequestModel> requestsList = list.map((i) => RequestModel.fromJson(i)).toList();

    RequestStats requestStats = RequestStats(total: 0, pending: 0, completed: 0);
    if (json['stats'] != null) {
      requestStats = RequestStats.fromJson(json['stats']);
    }

    return RequestsResponse(
      requests: requestsList,
      stats: requestStats,
    );
  }
}

class RequestModel {
  final int id;
  final String requestNumber;
  final String title;
  final String date;
  final String icon;
  final RequestStatus status;

  final String? fullName;
  final String? nationalId;
  final String? registrationPlace;
  final String? qrUrl;

  RequestModel({
    required this.id,
    required this.requestNumber,
    required this.title,
    required this.date,
    required this.icon,
    required this.status,
    this.fullName,
    this.nationalId,
    this.registrationPlace,
    this.qrUrl,
  });

  factory RequestModel.fromJson(Map<String, dynamic> json) {
    RequestStatus parseStatus(String? statusStr) {
      if (statusStr == 'approved' || statusStr == 'accepted') return RequestStatus.accepted;
      if (statusStr == 'rejected') return RequestStatus.rejected;
      return RequestStatus.review;
    }

    String extractTitle(Map<String, dynamic> data) {
      if (data['service_type'] != null && data['service_type']['name'] != null) {
        return data['service_type']['name'].toString();
      }
      return data['title']?.toString() ?? data['service_name']?.toString() ?? 'طلب غير معروف';
    }

    String extractDate(Map<String, dynamic> data) {
      final dateStr = data['submitted_at'] ?? data['created_at'];
      if (dateStr != null && dateStr.toString().length >= 10) {
        return dateStr.toString().substring(0, 10);
      }
      return 'غير محدد';
    }

    String? extractFullName(Map<String, dynamic> data) {
      if (data['citizen'] != null) {
        final fName = data['citizen']['first_name'] ?? '';
        final lName = data['citizen']['last_name'] ?? '';
        return "$fName $lName".trim();
      }
      return data['full_name']?.toString();
    }

    return RequestModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      requestNumber: json['request_number']?.toString() ?? json['id']?.toString() ?? 'غير متوفر',
      title: extractTitle(json),
      date: extractDate(json),
      icon: '📄',
      status: parseStatus(json['status']?.toString()),
      fullName: extractFullName(json),
      nationalId: json['citizen']?['national_id']?.toString() ?? json['national_id']?.toString() ?? 'غير متوفر',
      registrationPlace: json['citizen']?['place_of_registration']?.toString() ?? json['registration_place']?.toString() ?? 'غير متوفر',
      qrUrl: json['qr_url']?.toString(),
    );
  }
}