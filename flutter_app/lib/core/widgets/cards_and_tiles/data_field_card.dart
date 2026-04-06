import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
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
      padding: EdgeInsets.all(10.w),
      margin: EdgeInsets.only(bottom: 8.h),
      decoration: BoxDecoration(
        color: AppColors.gray,
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTextStyles.smallLabel),
          SizedBox(height: 2.h),
          Text(value, style: AppTextStyles.bodyRegular),
          if (hint != null) ...[
            SizedBox(height: 2.h),
            Text(hint!, style: AppTextStyles.smallLabel.copyWith(fontSize: 7.sp)),
          ],
        ],
      ),
    );
  }
}