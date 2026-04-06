import 'package:equatable/equatable.dart';

abstract class CitizenEvent extends Equatable {
  const CitizenEvent();
  @override
  List<Object?> get props => [];
}

// حدث جلب كل الطلبات (للرئيسية والقائمة)
class FetchRequestsEvent extends CitizenEvent {}

// حدث جلب تفاصيل طلب محدد
class FetchRequestDetailEvent extends CitizenEvent {
  final String requestId;
  const FetchRequestDetailEvent(this.requestId);
}

// حدث تقديم طلب جديد (بعد الـ OCR)
class SubmitNewRequestEvent extends CitizenEvent {
  final String title;
  final Map<String, String> extractedData;
  const SubmitNewRequestEvent({required this.title, required this.extractedData});
}