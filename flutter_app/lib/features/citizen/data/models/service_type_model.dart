
class ServiceTypeModel {
  final int id;
  final String name;
  final String icon;

  ServiceTypeModel({
    required this.id,
    required this.name,
    required this.icon,
  });

  factory ServiceTypeModel.fromJson(Map<String, dynamic> json) {
    return ServiceTypeModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? json['title'] ?? 'خدمة غير معروفة',
      icon: json['icon'] ?? '📄',
    );
  }
}