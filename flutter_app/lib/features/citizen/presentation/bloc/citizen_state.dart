import 'package:equatable/equatable.dart';
import '../../data/models/service_type_model.dart';
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
  final int totalCount;
  final int pendingCount;
  final int completedCount;

  const RequestsLoaded({
    required this.requests,
    required this.totalCount,
    required this.pendingCount,
    required this.completedCount,
  });

  @override
  List<Object?> get props => [requests, totalCount, pendingCount, completedCount];
}

class RequestDetailLoaded extends CitizenState {
  final RequestModel request;
  const RequestDetailLoaded(this.request);
}

class ServiceTypesLoaded extends CitizenState {
  final List<ServiceTypeModel> serviceTypes;
  const ServiceTypesLoaded(this.serviceTypes);
  @override
  List<Object?> get props => [serviceTypes];
}

class NewRequestSubmitted extends CitizenState {}

class CitizenError extends CitizenState {
  final String message;
  const CitizenError(this.message);
  @override
  List<Object?> get props => [message];
}