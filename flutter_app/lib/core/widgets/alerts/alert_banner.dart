import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';

enum AlertType { warning, success }

class AlertBanner extends StatelessWidget {
  final String message;
  final AlertType type;

  const AlertBanner({super.key, required this.message, required this.type});

  @override
  Widget build(BuildContext context) {
    final bool isWarning = type == AlertType.warning;
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: isWarning ? const Color(0xFFFEF3C7) : AppColors.greenPale,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Text(isWarning ? "⚠️" : "✅", style: const TextStyle(fontSize: 14)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: AppTextStyles.smallLabel.copyWith(
                color: isWarning ? const Color(0xFF78350F) : AppColors.greenDark,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}