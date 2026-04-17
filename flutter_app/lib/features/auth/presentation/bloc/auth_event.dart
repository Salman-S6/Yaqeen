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

class ForgotPasswordEvent extends AuthEvent {
  final String email;

  const ForgotPasswordEvent({required this.email});

  @override
  List<Object?> get props => [email];
}

class LogoutEvent extends AuthEvent {}

class RegisterEvent extends AuthEvent {
  final String firstName;
  final String lastName;
  final String nationalId;
  final String fatherName;
  final String motherFirstName;
  final String motherLastName;
  final String dateOfBirth;
  final String placeOfRegistration;
  final String email;
  final String password;
  final String passwordConfirmation;
  final File idImage;

  const RegisterEvent({
    required this.firstName,
    required this.lastName,
    required this.nationalId,
    required this.fatherName,
    required this.motherFirstName,
    required this.motherLastName,
    required this.dateOfBirth,
    required this.placeOfRegistration,
    required this.email,
    required this.password,
    required this.passwordConfirmation,
    required this.idImage,
  });

  @override
  List<Object?> get props => [
    firstName, lastName, nationalId, fatherName, motherFirstName,
    motherLastName, dateOfBirth, placeOfRegistration, email,
    password, passwordConfirmation, idImage
  ];
}