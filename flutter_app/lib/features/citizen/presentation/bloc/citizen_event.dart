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

class FetchServiceTypesEvent extends CitizenEvent {}

class SubmitNewRequestEvent extends CitizenEvent {
  final int serviceTypeId;
  final String notes;
  final int quantity;

  const SubmitNewRequestEvent({
    required this.serviceTypeId,
    required this.notes,
    required this.quantity,
  });
}