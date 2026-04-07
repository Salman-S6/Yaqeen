import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/indicators/status_badge.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../../core/widgets/buttons/outline_button.dart';

class QrSuccessScreen extends StatelessWidget {
  final Map<String, String> documentData;

  const QrSuccessScreen({super.key, required this.documentData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "نتيجة التحقق",
            subtitle: "البيانات المستخرجة من التوقيع الرقمي للوثيقة",
            backgroundColor: AppColors.green,
            showFlag: false,
            actions: [
              IconButton(
                icon: Icon(Icons.close, color: AppColors.white, size: 24.sp),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),

          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(16.w),
              child: Column(
                children: [
                  SizedBox(height: 16.h),
                  _buildSuccessIndicator(),
                  SizedBox(height: 24.h),

                  _buildDocumentDataCard(),

                  SizedBox(height: 32.h),

                  PrimaryButton(
                    text: "العودة للمسح",
                    onPressed: () => Navigator.pop(context),
                  ),
                  SizedBox(height: 12.h),
                  CustomOutlineButton(
                    text: "مشاركة إثبات الصحة",
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

  Widget _buildSuccessIndicator() {
    return Column(
      children: [
        Container(
          padding: EdgeInsets.all(16.w),
          decoration: const BoxDecoration(
            color: AppColors.greenPale,
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.check_circle_rounded, color: AppColors.green, size: 60.sp),
        ),
        SizedBox(height: 12.h),
        Text(
          "الوثيقة أصلية ومعتمدة ✅",
          style: AppTextStyles.sectionTitle.copyWith(color: AppColors.green, fontSize: 16.sp),
        ),
        Text(
          "تم التحقق من التوقيع الرقمي بنجاح",
          style: AppTextStyles.smallLabel.copyWith(color: AppColors.greenDark),
        ),
      ],
    );
  }

  Widget _buildDocumentDataCard() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.greenLight, width: 1.w),
        boxShadow: [
          BoxShadow(color: AppColors.green.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("بيانات الوثيقة", style: AppTextStyles.bodyBold.copyWith(color: AppColors.greenDark)),
              const StatusBadge(status: RequestStatus.accepted),
            ],
          ),
          SizedBox(height: 12.h),
          Divider(color: AppColors.border, height: 1.h),
          SizedBox(height: 12.h),

          _buildInfoRow("نوع الوثيقة:", documentData["document_type"] ?? "غير معروف"),
          SizedBox(height: 10.h),
          _buildInfoRow("رقم الطلب:", documentData["request_id"] ?? "غير معروف"),
          SizedBox(height: 10.h),
          _buildInfoRow("اسم المواطن:", documentData["citizen_name"] ?? "غير معروف"),
          SizedBox(height: 10.h),
          _buildInfoRow("الرقم الوطني:", documentData["national_id"] ?? "غير معروف"),
          SizedBox(height: 10.h),
          _buildInfoRow("تاريخ الإصدار:", documentData["issue_date"] ?? "غير معروف"),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTextStyles.smallLabel.copyWith(fontSize: 10.sp)),
        Text(value, style: AppTextStyles.bodyBold.copyWith(fontSize: 10.sp, color: AppColors.greenDark)),
      ],
    );
  }
}