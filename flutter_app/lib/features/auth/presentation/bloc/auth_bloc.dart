import 'package:flutter_bloc/flutter_bloc.dart';
import 'auth_event.dart';
import 'auth_state.dart';
import '../../data/repositories/auth_repository.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository authRepository;

  AuthBloc({required this.authRepository}) : super(AuthInitial()) {
    on<LoginEvent>(_onLogin);
    on<RegisterEvent>(_onRegister);
    on<LogoutEvent>(_onLogout);
    on<ForgotPasswordEvent>(_onForgotPassword);
  }

  Future<void> _onLogin(LoginEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());

    try {
      final user = await authRepository.login(event.email, event.password);
      emit(Authenticated(role: user.role, token: user.token));
    } catch (e) {
      emit(AuthError(message: e.toString().replaceAll("Exception: ", "")));
    }
  }
  Future<void> _onRegister(RegisterEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());

    try {
      final user = await authRepository.register(
        event.nationalId,
        event.email,
        event.password,
        event.idImage,
      );
      emit(Authenticated(role: user.role, token: user.token));
    } catch (e) {
      emit(AuthError(message: e.toString().replaceAll("Exception: ", "")));
    }
  }
  Future<void> _onForgotPassword(ForgotPasswordEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());

    try {
      await Future.delayed(const Duration(seconds: 2));
      emit(PasswordResetLinkSent());
    } catch (e) {
      emit(AuthError(message: "حدث خطأ أثناء إرسال الرابط، يرجى التأكد من البريد الإلكتروني."));
    }
  }
  Future<void> _onLogout(LogoutEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());

    try {
      await authRepository.logout();
      emit(Unauthenticated());
    } catch (e) {
      emit(AuthError(message: "حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة لاحقاً."));
    }
  }
}