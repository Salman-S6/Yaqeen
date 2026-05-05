import 'package:equatable/equatable.dart';
import '../../data/models/user_model.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}

class Authenticated extends AuthState {
  final String role;
  final UserModel user;

  const Authenticated({required this.role, required this.user});

  @override
  List<Object?> get props => [role, user];
}

class Unauthenticated extends AuthState {}
class PasswordResetLinkSent extends AuthState {}

class AuthError extends AuthState {
  final String message;

  const AuthError({required this.message});

  @override
  List<Object?> get props => [message];
}