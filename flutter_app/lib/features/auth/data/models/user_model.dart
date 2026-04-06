class UserModel {
  final String role;
  final String token;

  UserModel({
    required this.role,
    required this.token,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      role: json['role'] ?? 'citizen',
      token: json['token'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'role': role,
      'token': token,
    };
  }
}