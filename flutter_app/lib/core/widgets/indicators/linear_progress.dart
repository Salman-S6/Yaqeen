import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';

class CustomLinearProgress extends StatelessWidget {
  final double progress;
  final Color? color;

  const CustomLinearProgress({super.key, required this.progress, this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 4.h,
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.border,
        borderRadius: BorderRadius.circular(2.r),
      ),
      child: FractionallySizedBox(
        alignment: Alignment.centerRight,
        widthFactor: progress,
        child: Container(
          decoration: BoxDecoration(
            color: color ?? AppColors.green,
            borderRadius: BorderRadius.circular(2.r),
          ),
        ),
      ),
    );
  }
}