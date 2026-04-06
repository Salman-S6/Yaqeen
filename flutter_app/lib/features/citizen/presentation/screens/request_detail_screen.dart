import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/indicators/status_badge.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../../core/widgets/buttons/outline_button.dart';
class RequestDetailScreen extends StatelessWidget {
  final bool isAccepted = true;

  const RequestDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "تفاصيل الطلب",
            subtitle: "رقم الطلب: REQ-2026-001",
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
                  _buildStatusCard(),
                  SizedBox(height: 20.h),
                  Text("البيانات الشخصية", style: AppTextStyles.bodyBold.copyWith(fontSize: 12.sp)),
                  SizedBox(height: 8.h),
                  _buildDataBox(),
                  SizedBox(height: 20.h),
                  Text("المرفقات", style: AppTextStyles.bodyBold.copyWith(fontSize: 12.sp)),
                  SizedBox(height: 8.h),
                  _buildAttachmentCard(),

                  SizedBox(height: 32.h),

                  if (isAccepted) ...[
                    PrimaryButton(
                      text: "تحميل الوثيقة (PDF) 📥",
                      onPressed: () {
                      },
                    ),
                    SizedBox(height: 12.h),
                  ],

                  CustomOutlineButton(
                    text: "مشاركة تفاصيل الطلب",
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

  Widget _buildStatusCard() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("إخراج قيد فردي", style: AppTextStyles.sectionTitle.copyWith(fontSize: 14.sp)),
              const StatusBadge(status: RequestStatus.accepted), // أو review حسب الطلب
            ],
          ),
          SizedBox(height: 12.h),
          Divider(color: AppColors.border, height: 1.h),
          SizedBox(height: 12.h),
          _buildInfoRow("تاريخ التقديم:", "2 أبريل 2026"),
          SizedBox(height: 8.h),
          _buildInfoRow("تاريخ التحديث:", "4 أبريل 2026"),
        ],
      ),
    );
  }

  // --- صندوق البيانات ---
  Widget _buildDataBox() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          _buildInfoRow("الاسم الكامل:", "أحمد محمد السوري"),
          SizedBox(height: 10.h),
          _buildInfoRow("الرقم الوطني:", "12345678901"),
          SizedBox(height: 10.h),
          _buildInfoRow("مكان القيد:", "دمشق"),
        ],
      ),
    );
  }

  // --- بطاقة المرفقات (شكل ملف) ---
  Widget _buildAttachmentCard() {
    return Container(
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: AppColors.gray,
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: Row(
        children: [
          Icon(Icons.image_outlined, color: AppColors.grayMid, size: 28.sp),
          SizedBox(width: 12.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("صورة_الهوية_الامامية.jpg", style: AppTextStyles.bodyBold.copyWith(fontSize: 10.sp)),
                Text("2.4 MB", style: AppTextStyles.smallLabel.copyWith(fontSize: 8.sp)),
              ],
            ),
          ),
          Icon(Icons.remove_red_eye, color: AppColors.green, size: 20.sp),
        ],
      ),
    );
  }

  // دالة مساعدة لترتيب النصوص
  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTextStyles.smallLabel.copyWith(fontSize: 10.sp)),
        Text(value, style: AppTextStyles.bodyBold.copyWith(fontSize: 10.sp)),
      ],
    );
  }
}