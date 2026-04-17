class UserModel {
  final String role;
  final String token;
  final String firstName;
  final String lastName;
  final String nationalId;
  final String? idImage;

  UserModel({
    required this.role,
    required this.token,
    required this.firstName,
    required this.lastName,
    required this.nationalId,
    this.idImage,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    print("📥 [UserModel] RAW JSON: $json");

    final baseData = json['data'] ?? json['user'] ?? json;

    final details = baseData['citizen_details'] ?? baseData;

    final finalDetails = details['citizen_details'] ?? details;

    String? extractedImageUrl;
    if (finalDetails['attachments'] != null && (finalDetails['attachments'] as List).isNotEmpty) {
      extractedImageUrl = finalDetails['attachments'][0]['view_url']?.toString();
    }

    print("📸 [UserModel] Final Extracted URL: $extractedImageUrl");

    return UserModel(
      role: baseData['role'] ?? (baseData['roles'] != null && (baseData['roles'] as List).isNotEmpty ? baseData['roles'][0] : 'citizen'),
      token: json['token'] ?? '',
      firstName: finalDetails['first_name'] ?? finalDetails['name']?.split(' ').first ?? 'مواطن',
      lastName: finalDetails['last_name'] ?? '',
      nationalId: finalDetails['national_id']?.toString() ?? 'غير متوفر',
      idImage: extractedImageUrl,
    );
  }
  UserModel copyWith({
    String? role,
    String? token,
    String? firstName,
    String? lastName,
    String? nationalId,
    String? idImage,
  }) {
    return UserModel(
      role: role ?? this.role,
      token: token ?? this.token,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      nationalId: nationalId ?? this.nationalId,
      idImage: idImage ?? this.idImage,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'role': role,
      'token': token,
      'first_name': firstName,
      'last_name': lastName,
      'national_id': nationalId,
      'id_image': idImage,
    };
  }
}