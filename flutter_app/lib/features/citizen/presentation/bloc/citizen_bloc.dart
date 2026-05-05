import 'package:flutter_bloc/flutter_bloc.dart';
import 'citizen_event.dart';
import 'citizen_state.dart';
import '../../data/repositories/citizen_repository.dart';

class CitizenBloc extends Bloc<CitizenEvent, CitizenState> {
  final CitizenRepository repository;

  CitizenBloc({required this.repository}) : super(CitizenInitial()) {
    on<FetchRequestsEvent>(_onFetchRequests);
    on<FetchRequestDetailEvent>(_onFetchDetail);
    on<FetchServiceTypesEvent>(_onFetchServiceTypes);
    on<SubmitNewRequestEvent>(_onSubmitRequest);
  }

  Future<void> _onFetchRequests(FetchRequestsEvent event, Emitter<CitizenState> emit) async {
    emit(CitizenLoading());
    try {
      final requests = await repository.getRequests();
      emit(RequestsLoaded(requests));
    } catch (e) {
      emit(CitizenError(e.toString().replaceAll("Exception: ", "")));
    }
  }

  Future<void> _onFetchDetail(FetchRequestDetailEvent event, Emitter<CitizenState> emit) async {
    emit(CitizenLoading());
    try {
      final detail = await repository.getRequestDetail(event.requestId);
      emit(RequestDetailLoaded(detail));
    } catch (e) {
      emit(CitizenError(e.toString().replaceAll("Exception: ", "")));
    }
  }

  Future<void> _onFetchServiceTypes(FetchServiceTypesEvent event, Emitter<CitizenState> emit) async {
    emit(CitizenLoading());
    try {
      final services = await repository.getServiceTypes();
      emit(ServiceTypesLoaded(services));
    } catch (e) {
      emit(CitizenError(e.toString().replaceAll("Exception: ", "")));
    }
  }

  Future<void> _onSubmitRequest(SubmitNewRequestEvent event, Emitter<CitizenState> emit) async {
    emit(CitizenLoading());
    try {
      await repository.submitRequest(
        serviceTypeId: event.serviceTypeId,
        notes: event.notes,
        quantity: event.quantity,
      );
      emit(NewRequestSubmitted());
    } catch (e) {
      emit(CitizenError(e.toString().replaceAll("Exception: ", "")));
    }
  }
}