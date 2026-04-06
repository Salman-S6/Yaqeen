import 'package:equatable/equatable.dart';
import 'dart:io';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}
class CheckAuthStatusEvent extends AuthEvent {}

class LoginEvent extends AuthEvent {
  final String email;
  final String password;

  const LoginEvent({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}
class RegisterEvent extends AuthEvent {
  final String nationalId;
  final String email;
  final String password;
  final File idImage;

  const RegisterEvent({
    required this.nationalId,
    required this.email,
    required this.password,
    required this.idImage,
  });

  @override
  List<Object?> get props => [nationalId, email, password, idImage];
}
class ForgotPasswordEvent extends AuthEvent {
  final String email;

  const ForgotPasswordEvent({required this.email});

  @override
  List<Object?> get props => [email];
}

class LogoutEvent extends AuthEvent {}