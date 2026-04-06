import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../../core/widgets/indicators/step_progress.dart';

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: EdgeInsets.fromLTRB(14.w, 48.h, 14.w, 16.h),
            color: AppColors.black,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "إنشاء حساب",
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 13.sp,
                    fontWeight: FontWeight.w800,
                    fontFamily: AppTextStyles.fontFamily,
                  ),
                ),
                SizedBox(height: 2.h),
                Text(
                  "رفع صورة الهوية للتحقق",
                  style: TextStyle(
                    color: AppColors.white.withOpacity(0.6),
                    fontSize: 9.sp,
                    fontFamily: AppTextStyles.fontFamily,
                  ),
                ),
                SizedBox(height: 10.h),
                const StepProgress(currentStep: 2),
              ],
            ),
          ),

          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(12.w),
              child: Column(
                children: [
                  _buildField(
                    label: "الرقم الوطني",
                    hint: "12345678901",
                    sub: "11 خانة رقمية",
                  ),
                  _buildField(
                    label: "البريد الإلكتروني",
                    hint: "ahmed@mail.com",
                  ),

                  SizedBox(height: 8.h),

                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.symmetric(vertical: 12.h),
                    decoration: BoxDecoration(
                      color: AppColors.greenPale,
                      borderRadius: BorderRadius.circular(9.r),
                      border: Border.all(
                        color: AppColors.green,
                        width: 2.w,
                      ),
                    ),
                    child: Column(
                      children: [
                        Text("🪪", style: TextStyle(fontSize: 20.sp)),
                        SizedBox(height: 4.h),
                        Text(
                          "اضغط لرفع صورة الهوية",
                          style: AppTextStyles.bodyBold.copyWith(
                            color: AppColors.greenDark,
                            fontSize: 9.sp,
                          ),
                        ),
                        SizedBox(height: 2.h),
                        Text(
                          "JPG/PNG — حد 5 MB",
                          style: AppTextStyles.smallLabel.copyWith(
                            color: AppColors.grayMid,
                            fontSize: 8.sp,
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 20.h),

                  PrimaryButton(
                    text: "تسجيل وإرسال",
                    onPressed: () {},
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildField({required String label, required String hint, String? sub}) {
    return Container(
      margin: EdgeInsets.only(bottom: 8.h),
      padding: EdgeInsets.all(10.w),
      decoration: BoxDecoration(
        color: AppColors.gray,
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: AppTextStyles.smallLabel.copyWith(
              color: AppColors.grayMid,
              fontSize: 8.sp,
            ),
          ),
          TextField(
            style: AppTextStyles.bodyRegular.copyWith(
              color: AppColors.black,
              fontSize: 11.sp,
            ),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: TextStyle(color: AppColors.grayMid),
              isDense: true,
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(vertical: 2.h),
            ),
          ),
          if (sub != null)
            Text(
              sub,
              style: AppTextStyles.smallLabel.copyWith(
                fontSize: 8.sp,
                color: AppColors.grayMid,
              ),
            ),
        ],
      ),
    );
  }
}