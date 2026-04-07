import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/repositories/local_qr_repository.dart';
import 'qr_event.dart';
import 'qr_state.dart';

class QrBloc extends Bloc<QrEvent, QrState> {
  final LocalQrRepository repository;

  QrBloc({required this.repository}) : super(QrInitial()) {
    on<VerifyScannedQrEvent>(_onVerifyScannedQr);
    on<ResetQrScannerEvent>(_onResetQrScanner);
  }

  Future<void> _onVerifyScannedQr(VerifyScannedQrEvent event, Emitter<QrState> emit) async {
    emit(QrVerifying());

    try {
      final documentData = await repository.verifyDocumentSignature(event.rawQrData);

      emit(QrValid(documentData));
    } catch (e) {
      emit(QrForged(e.toString()));
    }
  }

  void _onResetQrScanner(ResetQrScannerEvent event, Emitter<QrState> emit) {
    emit(QrInitial());
  }
}