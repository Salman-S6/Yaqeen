import 'package:equatable/equatable.dart';

abstract class QrEvent extends Equatable {
  const QrEvent();

  @override
  List<Object?> get props => [];
}

class VerifyScannedQrEvent extends QrEvent {
  final String rawQrData;

  const VerifyScannedQrEvent(this.rawQrData);

  @override
  List<Object?> get props => [rawQrData];
}

class ResetQrScannerEvent extends QrEvent {}