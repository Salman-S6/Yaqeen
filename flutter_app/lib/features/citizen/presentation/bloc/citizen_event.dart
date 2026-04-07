import 'package:equatable/equatable.dart';

abstract class CitizenEvent extends Equatable {
  const CitizenEvent();
  @override
  List<Object?> get props => [];
}

class FetchRequestsEvent extends CitizenEvent {}

class FetchRequestDetailEvent extends CitizenEvent {
  final String requestId;
  const FetchRequestDetailEvent(this.requestId);
}

class SubmitNewRequestEvent extends CitizenEvent {
  final String title;
  final Map<String, String> extractedData;
  const SubmitNewRequestEvent({required this.title, required this.extractedData});
}