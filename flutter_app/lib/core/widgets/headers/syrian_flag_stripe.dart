import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';

class SyrianFlagStripe extends StatelessWidget {
  final double? height;
  final double? width;

  const SyrianFlagStripe({super.key, this.height, this.width});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height ?? 3.0.h,
      width: width ?? 56.0.w,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(2.r),
        gradient: const LinearGradient(
          colors: [
            AppColors.flagGreen,
            AppColors.white,
            AppColors.white,
            AppColors.black,
          ],
          stops: [0.33, 0.33, 0.66, 0.66],
        ),
      ),
    );
  }
}