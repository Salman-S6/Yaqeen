import 'package:equatable/equatable.dart';

abstract class QrState extends Equatable {
  const QrState();

  @override
  List<Object?> get props => [];
}

class QrInitial extends QrState {}
class QrVerifying extends QrState {}

class QrValid extends QrState {
  final Map<String, String> documentData;

  const QrValid(this.documentData);

  @override
  List<Object?> get props => [documentData];
}

class QrForged extends QrState {
  final String reason;
  const QrForged(this.reason);

  @override
  List<Object?> get props => [reason];
}

class QrError extends QrState {
  final String message;

  const QrError(this.message);

  @override
  List<Object?> get props => [message];
}