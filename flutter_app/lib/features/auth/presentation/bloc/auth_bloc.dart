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
      final userWithToken = await authRepository.login(event.email, event.password);

      final fullUser = await authRepository.getMe();

      final finalUser = fullUser.copyWith(token: userWithToken.token);

      print("👤 BLOC [Auth]: Login Success with /me. User Image -> ${finalUser.idImage}");

      emit(Authenticated(role: finalUser.role, user: finalUser));
    } catch (e) {
      emit(AuthError(message: e.toString().replaceAll("Exception: ", "")));
    }
  }

  Future<void> _onRegister(RegisterEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    try {
      final user = await authRepository.register(
        firstName: event.firstName,
        lastName: event.lastName,
        nationalId: event.nationalId,
        fatherName: event.fatherName,
        motherFirstName: event.motherFirstName,
        motherLastName: event.motherLastName,
        dateOfBirth: event.dateOfBirth,
        placeOfRegistration: event.placeOfRegistration,
        email: event.email,
        password: event.password,
        passwordConfirmation: event.passwordConfirmation,
        idImage: event.idImage,
      );

      print("👤 BLOC [Auth]: Register Success. User Image -> ${user.idImage}");

      emit(Authenticated(role: user.role, user: user));
    } catch (e) {
      String errorMessage = e.toString().toLowerCase();
      if (errorMessage.contains('email') || errorMessage.contains('بريد')) {
        emit(const AuthError(message: "هذا البريد الإلكتروني مسجل لدينا مسبقاً!"));
      }
      else if (errorMessage.contains('national') || errorMessage.contains('وطني')) {
        emit(const AuthError(message: "الرقم الوطني مستخدم في حساب آخر!"));
      }
      else {
        emit(AuthError(message: e.toString().replaceAll("Exception: ", "")));
      }
    }
  }

  Future<void> _onForgotPassword(ForgotPasswordEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    try {
      await Future.delayed(const Duration(seconds: 2));
      emit(PasswordResetLinkSent());
    } catch (e) {
      emit(const AuthError(message: "حدث خطأ أثناء إرسال الرابط، يرجى التأكد من البريد الإلكتروني."));
    }
  }

  Future<void> _onLogout(LogoutEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    try {
      await authRepository.logout();
      emit(Unauthenticated());
    } catch (e) {
      emit(const AuthError(message: "حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة لاحقاً."));
    }
  }
}