import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';
import 'syrian_flag_stripe.dart';

class CustomAppBar extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Color? backgroundColor;
  final List<Widget>? actions;
  final bool showFlag;

  const CustomAppBar({
    super.key,
    required this.title,
    this.subtitle,
    this.backgroundColor,
    this.actions,
    this.showFlag = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(16.w, 48.h, 16.w, 20.h),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.black,
        gradient: backgroundColor == null ? AppColors.darkGradient : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showFlag) ...[
            const SyrianFlagStripe(),
            SizedBox(height: 8.h),
          ],
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTextStyles.sectionTitle.copyWith(
                      color: AppColors.white,
                      fontSize: 16.sp,
                    ),
                  ),
                  if (subtitle != null)
                    Text(
                      subtitle!,
                      style: AppTextStyles.smallLabel.copyWith(
                        color: AppColors.white.withValues(alpha: 0.7),
                      ),
                    ),
                ],
              ),
              if (actions != null) Row(children: actions!),
            ],
          ),
        ],
      ),
    );
  }
}