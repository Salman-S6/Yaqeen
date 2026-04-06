import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/cards_and_tiles/request_list_tile.dart';
import '../../../../core/widgets/indicators/status_badge.dart';
class RequestsListScreen extends StatelessWidget {
  const RequestsListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "طلباتي",
            subtitle: "عرض وإدارة كافة طلباتك السابقة",
            backgroundColor: AppColors.black,
            showFlag: true,
          ),

          _buildFilters(),

          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.zero,
              itemCount: 8,
              itemBuilder: (context, index) {
                return RequestListTile(
                  title: index % 2 == 0 ? "إخراج قيد فردي" : "بيان عائلي",
                  requestId: "REQ-2026-00${index + 1}",
                  date: "${index + 1} أبريل 2026",
                  icon: index % 2 == 0 ? "📄" : "👨‍👩‍👧",
                  status: index == 0
                      ? RequestStatus.accepted
                      : (index == 1 ? RequestStatus.rejected : RequestStatus.review),
                  onTap: () {
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      height: 50.h,
      padding: EdgeInsets.symmetric(vertical: 10.h),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: 16.w),
        children: [
          _filterChip("الكل", true),
          _filterChip("مقبول", false),
          _filterChip("قيد المعالجة", false),
          _filterChip("مرفوض", false),
        ],
      ),
    );
  }

  Widget _filterChip(String label, bool isSelected) {
    return Container(
      margin: EdgeInsets.only(left: 8.w),
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.green : AppColors.gray,
        borderRadius: BorderRadius.circular(20.r),
      ),
      alignment: Alignment.center,
      child: Text(
        label,
        style: AppTextStyles.smallLabel.copyWith(
          color: isSelected ? AppColors.white : AppColors.grayMid,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }
}