import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
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
      padding: EdgeInsets.all(10.w),
      decoration: BoxDecoration(
        color: isWarning ? AppColors.warningBg : AppColors.greenPale,
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: Row(
        children: [
          Text(isWarning ? "⚠️" : "✅", style: TextStyle(fontSize: 14.sp)),
          SizedBox(width: 8.w),
          Expanded(
            child: Text(
              message,
              style: AppTextStyles.smallLabel.copyWith(
                color: isWarning ? AppColors.warningText : AppColors.greenDark,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}