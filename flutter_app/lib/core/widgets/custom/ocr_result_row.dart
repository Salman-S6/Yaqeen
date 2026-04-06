import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';

class OcrResultRow extends StatelessWidget {
  final String label;
  final String value;
  final double matchPercentage;

  const OcrResultRow({
    super.key,
    required this.label,
    required this.value,
    required this.matchPercentage,
  });

  @override
  Widget build(BuildContext context) {
    bool isLow = matchPercentage < 80;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      margin: const EdgeInsets.only(bottom: 6),
      decoration: BoxDecoration(
        color: AppColors.gray,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTextStyles.smallLabel),
          Text(value, style: AppTextStyles.bodyBold.copyWith(fontSize: 10)),
          Text(
            "${matchPercentage.toInt()}%",
            style: AppTextStyles.bodyBold.copyWith(
              color: isLow ? AppColors.red : AppColors.green,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }
}