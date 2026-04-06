import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';

class StepProgress extends StatelessWidget {
  final int currentStep;
  final int totalSteps;

  const StepProgress({super.key, required this.currentStep, this.totalSteps = 3});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(totalSteps * 2 - 1, (index) {
        if (index % 2 == 0) {
          // دائرة الخطوة
          int stepNum = (index ~/ 2) + 1;
          bool isDone = stepNum < currentStep;
          bool isActive = stepNum == currentStep;

          return Container(
            width: 20.w,
            height: 20.w,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isDone
                  ? AppColors.green
                  : (isActive ? AppColors.white : AppColors.white.withOpacity(0.24)),
            ),
            alignment: Alignment.center,
            child: isDone
                ? Icon(Icons.check, size: 12.sp, color: AppColors.white)
                : Text(
              "$stepNum",
              style: TextStyle(
                fontSize: 10.sp,
                fontWeight: FontWeight.bold,
                color: isActive ? AppColors.black : AppColors.white.withOpacity(0.38),
              ),
            ),
          );
        } else {
          int lineNum = (index ~/ 2) + 1;
          bool isDone = lineNum < currentStep;
          return Expanded(
            child: Container(
              height: 2.h,
              color: isDone ? AppColors.green : AppColors.white.withOpacity(0.24),
            ),
          );
        }
      }),
    );
  }
}