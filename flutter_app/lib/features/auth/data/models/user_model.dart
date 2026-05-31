class UserModel {
  final String role;
  final String token;
  final String firstName;
  final String lastName;
  final String nationalId;
  final String? idImage;

  // 🌟 الحقول الجديدة
  final String email;
  final String fatherName;
  final String motherName;
  final String dateOfBirth;
  final String placeOfRegistration;

  UserModel({
    required this.role,
    required this.token,
    required this.firstName,
    required this.lastName,
    required this.nationalId,
    this.idImage,
    required this.email,
    required this.fatherName,
    required this.motherName,
    required this.dateOfBirth,
    required this.placeOfRegistration,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    final baseData = json['data'] ?? json['user'] ?? json;
    final details = baseData['citizen_details'] ?? baseData;
    final finalDetails = details['citizen_details'] ?? details;

    String? extractedImageUrl;
    if (finalDetails['attachments'] != null && (finalDetails['attachments'] as List).isNotEmpty) {
      extractedImageUrl = finalDetails['attachments'][0]['view_url']?.toString();
    }

    String mFirstName = finalDetails['mother_first_name']?.toString() ?? '';
    String mLastName = finalDetails['mother_last_name']?.toString() ?? '';
    String dobStr = finalDetails['date_of_birth']?.toString() ?? 'غير متوفر';
    if (dobStr.contains('T')) {
      dobStr = dobStr.split('T')[0];
    }

    return UserModel(
      role: baseData['role'] ?? (baseData['roles'] != null && (baseData['roles'] as List).isNotEmpty ? baseData['roles'][0] : 'citizen'),
      token: json['token'] ?? '',
      firstName: finalDetails['first_name'] ?? finalDetails['name']?.split(' ').first ?? 'مواطن',
      lastName: finalDetails['last_name'] ?? '',
      nationalId: finalDetails['national_id']?.toString() ?? 'غير متوفر',
      idImage: extractedImageUrl,

      email: baseData['email']?.toString() ?? finalDetails['email']?.toString() ?? 'غير متوفر',
      fatherName: finalDetails['father_name']?.toString() ?? 'غير متوفر',
      motherName: "$mFirstName $mLastName".trim().isEmpty ? 'غير متوفر' : "$mFirstName $mLastName".trim(),
      dateOfBirth: dobStr,
      placeOfRegistration: finalDetails['place_of_registration']?.toString() ?? 'غير متوفر',
    );
  }

  UserModel copyWith({
    String? role,
    String? token,
    String? firstName,
    String? lastName,
    String? nationalId,
    String? idImage,
    String? email,
    String? fatherName,
    String? motherName,
    String? dateOfBirth,
    String? placeOfRegistration,
  }) {
    return UserModel(
      role: role ?? this.role,
      token: token ?? this.token,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      nationalId: nationalId ?? this.nationalId,
      idImage: idImage ?? this.idImage,
      email: email ?? this.email,
      fatherName: fatherName ?? this.fatherName,
      motherName: motherName ?? this.motherName,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      placeOfRegistration: placeOfRegistration ?? this.placeOfRegistration,
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
      'email': email,
      'father_name': fatherName,
      'mother_name': motherName,
      'date_of_birth': dateOfBirth,
      'place_of_registration': placeOfRegistration,
    };
  }
}