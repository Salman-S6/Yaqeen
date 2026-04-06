import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/alerts/alert_banner.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/indicators/step_progress.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../../core/widgets/buttons/outline_button.dart';
import 'ocr_verification_screen.dart';

class NewRequestScreen extends StatelessWidget {
  const NewRequestScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "طلب وثيقة جديدة",
            subtitle: "الخطوة 1: التحقق من الهوية الشخصية",
            backgroundColor: AppColors.black,
            showFlag: true,
            actions: [
              IconButton(
                icon: Icon(Icons.arrow_forward_ios, color: AppColors.white, size: 18.sp),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),

          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(16.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const StepProgress(currentStep: 1, totalSteps: 3),

                  SizedBox(height: 24.h),

                  const AlertBanner(
                    message: "يرجى التأكد من إضاءة الغرفة ووضوح كافة بيانات الهوية قبل التقاط الصورة لضمان سرعة المعالجة.",
                    type: AlertType.warning,
                  ),

                  SizedBox(height: 24.h),

                  Text(
                    "صورة الهوية (الوجه الأمامي)",
                    style: AppTextStyles.bodyBold.copyWith(fontSize: 12.sp),
                  ),
                  SizedBox(height: 8.h),

                  _buildUploadArea(),

                  SizedBox(height: 32.h),

                  PrimaryButton(
                    text: "التقاط صورة 📷",
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const OcrVerificationScreen(),
                        ),
                      );
                    },
                  ),
                  SizedBox(height: 12.h),
                  CustomOutlineButton(
                    text: "إلغاء الطلب",
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUploadArea() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(vertical: 32.h, horizontal: 16.w),
      decoration: BoxDecoration(
        color: AppColors.greenPale,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.green, width: 2.w),
      ),
      child: Column(
        children: [
          Icon(Icons.credit_card, size: 48.sp, color: AppColors.greenDark),
          SizedBox(height: 12.h),
          Text(
            "اضغط هنا لفتح الكاميرا",
            style: AppTextStyles.bodyBold.copyWith(color: AppColors.greenDark, fontSize: 13.sp),
          ),
          SizedBox(height: 4.h),
          Text(
            "يجب أن تكون الصورة واضحة وبصيغة JPG أو PNG",
            style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid, fontSize: 9.sp),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}