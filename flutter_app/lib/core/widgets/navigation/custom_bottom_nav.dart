import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';

class CustomBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomBottomNav({super.key, required this.currentIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 65,
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 0.5)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(0, "🏠", "الرئيسية"),
          _buildNavItem(1, "📁", "طلباتي"),
          _buildNavItem(2, "➕", "جديد"),
          _buildNavItem(3, "🔐", "تحقق"),
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
          Text(icon, style: const TextStyle(fontSize: 20)),
          if (isActive)
            Container(
              margin: const EdgeInsets.only(top: 2),
              width: 4, height: 4,
              decoration: const BoxDecoration(color: AppColors.green, shape: BoxShape.circle),
            ),
          Text(
            label,
            style: AppTextStyles.smallLabel.copyWith(
              color: isActive ? AppColors.green : AppColors.grayMid,
              fontSize: 8,
            ),
          ),
        ],
      ),
    );
  }
}