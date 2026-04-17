import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_event.dart';
import '../../../auth/presentation/bloc/auth_state.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is Unauthenticated) {
          Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
        } else if (state is AuthError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message, style: AppTextStyles.bodyBold.copyWith(color: AppColors.white)),
              backgroundColor: AppColors.red,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: Column(
          children: [
            const CustomAppBar(
              title: "الإعدادات",
              subtitle: "إدارة حسابك وتفصيلات التطبيق",
              backgroundColor: AppColors.black,
              showFlag: false,
            ),

            Expanded(
              child: ListView(
                padding: EdgeInsets.all(16.w),
                children: [
                  _buildUserProfileCard(context),

                  SizedBox(height: 24.h),

                  Text(
                    "إجراءات الحساب",
                    style: AppTextStyles.sectionTitle.copyWith(fontSize: 14.sp, color: AppColors.grayMid),
                  ),
                  SizedBox(height: 12.h),

                  _buildLogoutButton(context),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUserProfileCard(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        if (state is Authenticated) {
          final user = state.user;

          // 🚀 أضف سطر الطباعة هنا لكشف السر!
          print("🔑 التوكن في الإعدادات: ${user.token}");

          return Container(
            padding: EdgeInsets.all(20.w),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(16.r),
              boxShadow: [
                BoxShadow(
                  color: AppColors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 55.w,
                  height: 55.w,
                  decoration: BoxDecoration(
                    color: AppColors.greenPale,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.green.withOpacity(0.2), width: 2),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(30.r), // لجعل الصورة دائرية
                    child: user.idImage != null && user.idImage!.isNotEmpty
                        ? Image.network(
                      user.idImage!,
                      fit: BoxFit.cover,
                      // الهيدرات التي أضفناها
                      headers: {
                        'Authorization': 'Bearer ${user.token}',
                        'Accept': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                      },
                      errorBuilder: (context, error, stackTrace) {
                        return Center(
                          child: Text(
                            user.firstName.isNotEmpty ? user.firstName[0] : "؟",
                            style: AppTextStyles.sectionTitle.copyWith(
                              color: AppColors.green,
                              fontSize: 22.sp,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        );
                      },
                    )
                        : Center(
                      child: Text(
                        user.firstName.isNotEmpty ? user.firstName[0] : "؟",
                        style: AppTextStyles.sectionTitle.copyWith(
                          color: AppColors.green,
                          fontSize: 22.sp,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 16.w),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "${user.firstName} ${user.lastName}",
                        style: AppTextStyles.sectionTitle.copyWith(fontSize: 15.sp),
                      ),
                      SizedBox(height: 4.h),
                      Row(
                        children: [
                          Icon(Icons.badge_outlined, size: 14.sp, color: AppColors.green),
                          SizedBox(width: 6.w),
                          Text(
                            "الرقم الوطني: ${user.nationalId}",
                            style: AppTextStyles.smallLabel.copyWith(
                              color: AppColors.grayMid,
                              fontSize: 11.sp,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        }
        return const SizedBox();
      },
    );
  }
  Widget _buildLogoutButton(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        bool isLoading = state is AuthLoading;

        return InkWell(
          onTap: isLoading ? null : () => _showLogoutConfirmation(context),
          borderRadius: BorderRadius.circular(12.r),
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 14.h),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(12.r),
              border: Border.all(color: AppColors.red.withOpacity(0.1)),
            ),
            child: Row(
              children: [
                Icon(Icons.logout_rounded, color: AppColors.red, size: 20.sp),
                SizedBox(width: 12.w),
                Text(
                  isLoading ? "جاري تسجيل الخروج..." : "تسجيل الخروج من الحساب",
                  style: AppTextStyles.bodyBold.copyWith(color: AppColors.red, fontSize: 13.sp),
                ),
                const Spacer(),
                if (!isLoading)
                  Icon(Icons.arrow_forward_ios, color: AppColors.red.withOpacity(0.3), size: 14.sp),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showLogoutConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          backgroundColor: AppColors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.r)),
          title: Text("تأكيد الخروج", style: AppTextStyles.sectionTitle.copyWith(fontSize: 16.sp)),
          content: Text("هل أنت متأكد من رغبتك في تسجيل الخروج؟", style: AppTextStyles.bodyBold),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: Text("إلغاء", style: AppTextStyles.bodyBold.copyWith(color: AppColors.grayMid)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(dialogContext);
                context.read<AuthBloc>().add(LogoutEvent());
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.red,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.r)),
              ),
              child: Text("خروج", style: AppTextStyles.bodyBold.copyWith(color: AppColors.white)),
            ),
          ],
        );
      },
    );
  }
}