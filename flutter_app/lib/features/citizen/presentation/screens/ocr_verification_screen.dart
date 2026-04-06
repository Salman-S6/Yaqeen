import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/alerts/alert_banner.dart';
import '../../../../core/widgets/custom/ocr_result_row.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/indicators/step_progress.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../../core/widgets/buttons/outline_button.dart';

class OcrVerificationScreen extends StatelessWidget {
  const OcrVerificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "تأكيد بيانات الهوية",
            subtitle: "الخطوة 2: مراجعة البيانات المستخرجة",
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
                  const StepProgress(currentStep: 2, totalSteps: 3),

                  SizedBox(height: 24.h),

                  const AlertBanner(
                    message: "يرجى مراجعة البيانات بدقة. إذا كانت هناك أخطاء في القراءة، يرجى إعادة التصوير بظروف إضاءة أفضل.",
                    type: AlertType.warning,
                  ),

                  SizedBox(height: 24.h),

                  Text(
                    "نتائج المسح الضوئي (OCR)",
                    style: AppTextStyles.bodyBold.copyWith(fontSize: 12.sp),
                  ),
                  SizedBox(height: 8.h),

                  _buildExtractedDataBox(),

                  SizedBox(height: 32.h),

                  PrimaryButton(
                    text: "تأكيد ومتابعة",
                    onPressed: () {
                    },
                  ),
                  SizedBox(height: 12.h),
                  CustomOutlineButton(
                    text: "إعادة التصوير 🔄",
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExtractedDataBox() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.border, width: 1.w),
        boxShadow: [
          BoxShadow(
            color: AppColors.black.withOpacity(0.03),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("الحقل", style: AppTextStyles.smallLabel.copyWith(fontSize: 8.sp)),
                Text("القيمة", style: AppTextStyles.smallLabel.copyWith(fontSize: 8.sp)),
                Text("الدقة", style: AppTextStyles.smallLabel.copyWith(fontSize: 8.sp)),
              ],
            ),
          ),
          Divider(color: AppColors.border, thickness: 1.h),
          SizedBox(height: 4.h),

          const OcrResultRow(
            label: "الاسم الكامل",
            value: "أحمد محمد السوري",
            matchPercentage: 98.5,
          ),
          const OcrResultRow(
            label: "الرقم الوطني",
            value: "12345678901",
            matchPercentage: 99.9,
          ),
          const OcrResultRow(
            label: "تاريخ الولادة",
            value: "1990/05/15",
            matchPercentage: 95.0,
          ),
          const OcrResultRow(
            label: "مكان القيد",
            value: "دمـشـق",
            matchPercentage: 65.0,
          ),
        ],
      ),
    );
  }
}