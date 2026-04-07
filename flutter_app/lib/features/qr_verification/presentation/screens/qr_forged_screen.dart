import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/buttons/danger_button.dart'; // الويدجت الأحمر الذي برمجناه
import '../../../../core/widgets/buttons/outline_button.dart';

class QrForgedScreen extends StatelessWidget {
  const QrForgedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "فشل التحقق",
            subtitle: "تنبيه: لم يتم تأكيد صحة الوثيقة",
            backgroundColor: AppColors.red,
            showFlag: false,
            actions: [
              IconButton(
                icon: Icon(Icons.close, color: AppColors.white, size: 24.sp),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),

          Expanded(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.w),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: EdgeInsets.all(16.w),
                    decoration: BoxDecoration(
                      color: AppColors.red.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.dangerous_rounded, color: AppColors.red, size: 70.sp),
                  ),

                  SizedBox(height: 24.h),

                  Text(
                    "تحذير: الوثيقة غير صالحة ⛔",
                    style: AppTextStyles.sectionTitle.copyWith(color: AppColors.red, fontSize: 18.sp),
                    textAlign: TextAlign.center,
                  ),

                  SizedBox(height: 12.h),

                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(16.w),
                    decoration: BoxDecoration(
                      color: AppColors.white,
                      borderRadius: BorderRadius.circular(12.r),
                      border: Border.all(color: AppColors.red, width: 1.w),
                    ),
                    child: Column(
                      children: [
                        Text(
                          "التوقيع الرقمي لهذه الوثيقة لا يطابق المفتاح العام المعتمد. قد تكون الوثيقة معدلة، مزورة، أو منتهية الصلاحية بشكل غير قانوني.",
                          style: AppTextStyles.bodyRegular.copyWith(
                            color: AppColors.red,
                            fontSize: 11.sp,
                            height: 1.5.h,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 12.h),
                        Divider(color: AppColors.border, height: 1.h),
                        SizedBox(height: 12.h),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.history_toggle_off_rounded, color: AppColors.grayMid, size: 14.sp),
                            SizedBox(width: 6.w),
                            Text(
                              "وقت الفحص: اليوم، 11:45 ص",
                              style: AppTextStyles.smallLabel.copyWith(fontSize: 9.sp),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 60.h),

                  DangerButton(
                    text: "محاولة مرة أخرى",
                    onPressed: () => Navigator.pop(context),
                  ),
                  SizedBox(height: 12.h),
                  CustomOutlineButton(
                    text: "العودة للقائمة",
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
}