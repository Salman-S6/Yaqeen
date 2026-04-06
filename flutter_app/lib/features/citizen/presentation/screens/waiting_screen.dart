import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/buttons/primary_button.dart';

class WaitingScreen extends StatelessWidget {
  const WaitingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: 24.w),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(20.w),
              decoration: BoxDecoration(
                color: AppColors.greenPale,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.hourglass_empty_rounded,
                size: 60.sp,
                color: AppColors.green,
              ),
            ),

            SizedBox(height: 32.h),

            Text(
              "قيد المعالجة والتحقق",
              style: AppTextStyles.sectionTitle.copyWith(
                color: AppColors.black,
                fontSize: 18.sp,
              ),
              textAlign: TextAlign.center,
            ),

            SizedBox(height: 12.h),

            Text(
              "نحن الآن نقوم بالتحقق من بيانات الهوية التي قمت برفعها. ستصلك رسالة إشعار فور الانتهاء من عملية التدقيق.",
              style: AppTextStyles.bodyRegular.copyWith(
                color: AppColors.grayMid,
                fontSize: 11.sp,
              ),
              textAlign: TextAlign.center,
            ),

            SizedBox(height: 40.h),

            ClipRRect(
              borderRadius: BorderRadius.circular(10.r),
              child: LinearProgressIndicator(
                backgroundColor: AppColors.border,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.green),
                minHeight: 6.h,
              ),
            ),

            SizedBox(height: 60.h),

            PrimaryButton(
              text: "العودة للرئيسية",
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    );
  }
}