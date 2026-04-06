import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';

class CustomLinearProgress extends StatelessWidget {
  final double progress;
  final Color? color;

  const CustomLinearProgress({super.key, required this.progress, this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 4,
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.border,
        borderRadius: BorderRadius.circular(2),
      ),
      child: FractionallySizedBox(
        alignment: Alignment.centerRight,
        widthFactor: progress,
        child: Container(
          decoration: BoxDecoration(
            color: color ?? AppColors.green,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      ),
    );
  }
}