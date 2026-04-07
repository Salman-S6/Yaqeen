import 'package:flutter_bloc/flutter_bloc.dart';
import 'citizen_event.dart';
import 'citizen_state.dart';
import '../../data/repositories/citizen_repository.dart';

class CitizenBloc extends Bloc<CitizenEvent, CitizenState> {
  final CitizenRepository repository;

  CitizenBloc({required this.repository}) : super(CitizenInitial()) {
    on<FetchRequestsEvent>(_onFetchRequests);
    on<FetchRequestDetailEvent>(_onFetchDetail);
    on<SubmitNewRequestEvent>(_onSubmitRequest);
  }

  Future<void> _onFetchRequests(FetchRequestsEvent event, Emitter<CitizenState> emit) async {
    emit(CitizenLoading());
    try {
      final requests = await repository.getRequests();
      emit(RequestsLoaded(requests));
    } catch (e) {
      emit(const CitizenError("فشل تحميل الطلبات"));
    }
  }

  Future<void> _onFetchDetail(FetchRequestDetailEvent event, Emitter<CitizenState> emit) async {
    emit(CitizenLoading());
    try {
      final detail = await repository.getRequestDetail(event.requestId);
      emit(RequestDetailLoaded(detail));
    } catch (e) {
      emit(const CitizenError("فشل تحميل تفاصيل الطلب"));
    }
  }

  Future<void> _onSubmitRequest(SubmitNewRequestEvent event, Emitter<CitizenState> emit) async {
    emit(CitizenLoading());
    await Future.delayed(const Duration(seconds: 2));
    emit(NewRequestSubmitted());
  }
}