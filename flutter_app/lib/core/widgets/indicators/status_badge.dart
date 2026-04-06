import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';

enum RequestStatus { accepted, review, rejected, pending }

class StatusBadge extends StatelessWidget {
  final RequestStatus status;

  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color textColor;
    String text;

    switch (status) {
      case RequestStatus.accepted:
        bgColor = AppColors.greenPale;
        textColor = AppColors.greenDark;
        text = "مقبول";
        break;
      case RequestStatus.review:
        bgColor = AppColors.badgeRevBg;
        textColor = AppColors.badgeRevText;
        text = "مراجعة";
        break;
      case RequestStatus.rejected:
        bgColor = AppColors.badgeRejBg;
        textColor = AppColors.badgeRejText;
        text = "مرفوض";
        break;
      case RequestStatus.pending:
        bgColor = AppColors.badgePendBg;
        textColor = AppColors.badgePendText;
        text = "معلق";
        break;
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 3.h),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(10.r),
      ),
      child: Text(
        text,
        style: AppTextStyles.captionSemiBold.copyWith(
          color: textColor,
          fontSize: 8.sp,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}