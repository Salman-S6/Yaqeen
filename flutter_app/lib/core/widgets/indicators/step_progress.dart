import 'package:flutter/material.dart';
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
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isDone ? AppColors.green : (isActive ? Colors.white : Colors.white24),
            ),
            alignment: Alignment.center,
            child: isDone
                ? const Icon(Icons.check, size: 12, color: Colors.white)
                : Text("$stepNum", style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: isActive ? AppColors.black : Colors.white38
            )),
          );
        } else {
          int lineNum = (index ~/ 2) + 1;
          bool isDone = lineNum < currentStep;
          return Expanded(
            child: Container(
              height: 2,
              color: isDone ? AppColors.green : Colors.white24,
            ),
          );
        }
      }),
    );
  }
}