import 'package:equatable/equatable.dart';
import '../../data/models/request_model.dart';

abstract class CitizenState extends Equatable {
  const CitizenState();
  @override
  List<Object?> get props => [];
}

class CitizenInitial extends CitizenState {}
class CitizenLoading extends CitizenState {}

class RequestsLoaded extends CitizenState {
  final List<RequestModel> requests;
  const RequestsLoaded(this.requests);
  @override
  List<Object?> get props => [requests];
}

class RequestDetailLoaded extends CitizenState {
  final RequestModel request;
  const RequestDetailLoaded(this.request);
}

class NewRequestSubmitted extends CitizenState {}

class CitizenError extends CitizenState {
  final String message;
  const CitizenError(this.message);
}