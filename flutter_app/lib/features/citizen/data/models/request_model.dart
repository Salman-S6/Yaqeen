import '../../../../core/widgets/indicators/status_badge.dart';

class RequestModel {
  final String id;
  final String title;
  final String date;
  final String icon;
  final RequestStatus status;
  final String? nationalId;
  final String? fullName;
  final String? birthDate;
  final String? registrationPlace;

  RequestModel({
    required this.id,
    required this.title,
    required this.date,
    required this.icon,
    required this.status,
    this.nationalId,
    this.fullName,
    this.birthDate,
    this.registrationPlace,
  });

  // تحويل JSON القادم من السيرفر إلى كائن Dart
  factory RequestModel.fromJson(Map<String, dynamic> json) {
    return RequestModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      date: json['date'] ?? '',
      icon: json['icon'] ?? '📄',
      status: _parseStatus(json['status']),
      nationalId: json['national_id'],
      fullName: json['full_name'],
      birthDate: json['birth_date'],
      registrationPlace: json['registration_place'],
    );
  }

  static RequestStatus _parseStatus(String? status) {
    switch (status) {
      case 'accepted': return RequestStatus.accepted;
      case 'rejected': return RequestStatus.rejected;
      default: return RequestStatus.review;
    }
  }
}