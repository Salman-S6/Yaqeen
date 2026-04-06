import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';

class DataFieldCard extends StatelessWidget {
  final String label;
  final String value;
  final String? hint;

  const DataFieldCard({
    super.key,
    required this.label,
    required this.value,
    this.hint,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppColors.gray,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTextStyles.smallLabel),
          const SizedBox(height: 2),
          Text(value, style: AppTextStyles.bodyRegular),
          if (hint != null) ...[
            const SizedBox(height: 2),
            Text(hint!, style: AppTextStyles.smallLabel.copyWith(fontSize: 7)),
          ],
        ],
      ),
    );
  }
}