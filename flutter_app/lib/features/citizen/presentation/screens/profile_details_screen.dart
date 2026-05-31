import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../auth/data/models/user_model.dart';

class ProfileDetailsScreen extends StatelessWidget {
  final UserModel user;

  const ProfileDetailsScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "المعلومات الشخصية",
            subtitle: "بيانات هويتك المسجلة في النظام",
            backgroundColor: AppColors.black,
            showFlag: false,
            actions: [
              IconButton(
                icon: Icon(Icons.arrow_forward_ios, color: AppColors.white, size: 18.sp),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.all(16.w),
              children: [
                _buildInfoCard(
                  icon: Icons.person_outline,
                  title: "الاسم الكامل",
                  value: "${user.firstName} ${user.lastName}",
                ),
                _buildInfoCard(
                  icon: Icons.badge_outlined,
                  title: "الرقم الوطني",
                  value: user.nationalId,
                ),
                _buildInfoCard(
                  icon: Icons.email_outlined,
                  title: "البريد الإلكتروني",
                  value: user.email,
                ),
                _buildInfoCard(
                  icon: Icons.family_restroom_outlined,
                  title: "اسم الأب",
                  value: user.fatherName,
                ),
                _buildInfoCard(
                  icon: Icons.pregnant_woman_outlined,
                  title: "اسم الأم",
                  value: user.motherName,
                ),
                _buildInfoCard(
                  icon: Icons.calendar_today_outlined,
                  title: "تاريخ الميلاد",
                  value: user.dateOfBirth,
                  isDate: true,
                ),
                _buildInfoCard(
                  icon: Icons.location_on_outlined,
                  title: "محل ورقم القيد",
                  value: user.placeOfRegistration,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String value,
    bool isDate = false,
  }) {
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(10.w),
            decoration: BoxDecoration(
              color: AppColors.greenPale,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: AppColors.green, size: 20.sp),
          ),
          SizedBox(width: 16.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid),
                ),
                SizedBox(height: 4.h),
                Text(
                  value,
                  style: AppTextStyles.bodyBold.copyWith(
                    color: AppColors.black,
                    fontSize: 14.sp,
                    fontFamily: isDate ? 'sans-serif' : null,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}