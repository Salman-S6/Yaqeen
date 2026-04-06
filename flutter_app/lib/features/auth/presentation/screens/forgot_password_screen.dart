import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/buttons/primary_button.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: EdgeInsets.symmetric(vertical: 40.h),
              color: AppColors.black,
              child: Column(
                children: [
                  Text("🔒", style: TextStyle(fontSize: 35.sp)),
                  SizedBox(height: 10.h),
                  Text(
                    "استعادة كلمة المرور",
                    style: TextStyle(
                      color: AppColors.white,
                      fontSize: 16.sp,
                      fontWeight: FontWeight.bold,
                      fontFamily: AppTextStyles.fontFamily,
                    ),
                  ),
                  SizedBox(height: 5.h),
                  Text(
                    "سنرسل رابطاً على بريدك الإلكتروني",
                    style: TextStyle(
                      color: AppColors.white.withOpacity(0.6),
                      fontSize: 10.sp,
                      fontFamily: AppTextStyles.fontFamily,
                    ),
                  ),
                ],
              ),
            ),

            Padding(
              padding: EdgeInsets.symmetric(
                horizontal: 24.w,
                vertical: 20.h,
              ),
              child: Column(
                children: [
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(12.w),
                    decoration: BoxDecoration(
                      color: AppColors.badgeRevBg,
                      borderRadius: BorderRadius.circular(8.r),
                    ),
                    child: Row(
                      children: [
                        Text("📧", style: TextStyle(fontSize: 14.sp)),
                        SizedBox(width: 8.w),
                        Expanded(
                          child: Text(
                            "الرابط صالح 30 دقيقة — لاستخدام واحد فقط",
                            style: AppTextStyles.smallLabel.copyWith(
                              color: AppColors.badgeRevText,
                              fontSize: 9.sp,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 24.h),

                  _buildResponsiveInputField(
                    label: "البريد الإلكتروني",
                    controller: _emailController,
                    hint: "ahmed@mail.com",
                  ),

                  SizedBox(height: 24.h),

                  PrimaryButton(
                    text: "إرسال رابط الاستعادة",
                    onPressed: () {
                    },
                  ),

                  SizedBox(height: 30.h),

                  _buildResponsiveSuccessBox(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResponsiveInputField({
    required String label,
    required TextEditingController controller,
    required String hint,
  }) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(12.w),
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
          SizedBox(height: 4.h),
          TextField(
            controller: controller,
            keyboardType: TextInputType.emailAddress,
            style: AppTextStyles.bodyRegular.copyWith(
              color: AppColors.black,
              fontSize: 11.sp,
            ),
            decoration: InputDecoration(
              hintText: hint,
              isDense: true,
              border: InputBorder.none,
              hintStyle: TextStyle(
                color: AppColors.grayMid,
                fontSize: 11.sp,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResponsiveSuccessBox() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(15.w),
      decoration: BoxDecoration(
        color: AppColors.greenPale,
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(9.r),
      ),
      child: Column(
        children: [
          const Text("✅", style: TextStyle(fontSize: 20)),
          SizedBox(height: 8.h),
          Text(
            "تم إرسال الرابط!",
            style: AppTextStyles.bodyBold.copyWith(
              color: AppColors.greenDark, //
              fontSize: 11.sp,
            ),
          ),
          Text(
            "تحقق من بريدك الإلكتروني",
            style: AppTextStyles.smallLabel.copyWith(
              color: AppColors.grayMid,
              fontSize: 9.sp,
            ),
          ),
        ],
      ),
    );
  }
}