import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';

class CustomBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomBottomNav({super.key, required this.currentIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 65.h,
      decoration: BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 0.5.h)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(0, "🏠", "الرئيسية"),
          _buildNavItem(1, "📁", "طلباتي"),
          _buildNavItem(2, "🔐", "تحقق"),
          _buildNavItem(3, "⚙️", "إعدادات"),

        ],
      ),
    );
  }

  Widget _buildNavItem(int index, String icon, String label) {
    bool isActive = currentIndex == index;
    return InkWell(
      onTap: () => onTap(index),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(icon, style: TextStyle(fontSize: 20.sp)),
          if (isActive)
            Container(
              margin: EdgeInsets.only(top: 2.h),
              width: 4.w,
              height: 4.w,
              decoration: const BoxDecoration(
                color: AppColors.green,
                shape: BoxShape.circle,
              ),
            ),
          Text(
            label,
            style: AppTextStyles.smallLabel.copyWith(
              color: isActive ? AppColors.green : AppColors.grayMid,
              fontSize: 8.sp,
            ),
          ),
        ],
      ),
    );
  }
}