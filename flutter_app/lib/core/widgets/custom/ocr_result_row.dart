import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
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
      padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 8.h),
      margin: EdgeInsets.only(bottom: 6.h),
      decoration: BoxDecoration(
        color: AppColors.gray,
        borderRadius: BorderRadius.circular(6.r),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTextStyles.smallLabel),
          Text(value, style: AppTextStyles.bodyBold.copyWith(fontSize: 10.sp)),
          Text(
            "${matchPercentage.toInt()}%",
            style: AppTextStyles.bodyBold.copyWith(
              color: isLow ? AppColors.red : AppColors.green,
              fontSize: 10.sp,
            ),
          ),
        ],
      ),
    );
  }
}