import 'package:equatable/equatable.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class Authenticated extends AuthState {
  final String role;
  final String token;

  const Authenticated({required this.role, required this.token});

  @override
  List<Object?> get props => [role, token];
}

class Unauthenticated extends AuthState {}
class PasswordResetLinkSent extends AuthState {}
class AuthError extends AuthState {
  final String message;

  const AuthError({required this.message});

  @override
  List<Object?> get props => [message];
}