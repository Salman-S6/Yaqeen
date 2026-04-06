import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';
import '../indicators/status_badge.dart';

class RequestListTile extends StatelessWidget {
  final String title;
  final String requestId;
  final String date;
  final String icon;
  final RequestStatus status;
  final VoidCallback onTap;

  const RequestListTile({
    super.key,
    required this.title,
    required this.requestId,
    required this.date,
    required this.icon,
    required this.status,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.border, width: 0.5.w)),
        ),
        child: Row(
          children: [
            Container(
              width: 40.w,
              height: 40.w,
              decoration: BoxDecoration(
                color: AppColors.greenPale,
                borderRadius: BorderRadius.circular(8.r),
              ),
              alignment: Alignment.center,
              child: Text(icon, style: TextStyle(fontSize: 18.sp)),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppTextStyles.bodyBold),
                  Text("$requestId • $date", style: AppTextStyles.smallLabel),
                ],
              ),
            ),
            StatusBadge(status: status),
          ],
        ),
      ),
    );
  }
}