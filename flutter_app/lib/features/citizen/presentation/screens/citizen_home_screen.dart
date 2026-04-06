import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/navigation/custom_bottom_nav.dart';
import '../../../../core/widgets/cards_and_tiles/request_list_tile.dart';
import '../../../../core/widgets/indicators/status_badge.dart';

class CitizenHomeScreen extends StatefulWidget {
  const CitizenHomeScreen({super.key});

  @override
  State<CitizenHomeScreen> createState() => _CitizenHomeScreenState();
}

class _CitizenHomeScreenState extends State<CitizenHomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "مرحبًا، أحمد 👋",
            subtitle: "مواطن — الرقم الوطني: 12345678901",
            backgroundColor: AppColors.green,
            showFlag: false,
            actions: [
              IconButton(
                icon: Icon(Icons.notifications_none, color: AppColors.white, size: 24.sp),
                onPressed: () {},
              ),
            ],
          ),

          _buildQuickStats(),
          _buildNewRequestButton(),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
            child: Align(
              alignment: Alignment.centerRight,
              child: Text(
                "آخر الطلبات",
                style: AppTextStyles.sectionTitle.copyWith(fontSize: 12.sp),
              ),
            ),
          ),

          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                RequestListTile(
                  title: "إخراج قيد فردي",
                  requestId: "REQ-000042",
                  date: "2 أبريل",
                  icon: "📄",
                  status: RequestStatus.accepted,
                  onTap: () {},
                ),
                RequestListTile(
                  title: "بيان عائلي",
                  requestId: "REQ-000039",
                  date: "28 مارس",
                  icon: "👨‍👩‍👧",
                  status: RequestStatus.review,
                  onTap: () {},
                ),
                RequestListTile(
                  title: "وثيقة أخرى",
                  requestId: "REQ-000031",
                  date: "15 مارس",
                  icon: "📋",
                  status: RequestStatus.rejected,
                  onTap: () {},
                ),
              ],
            ),
          ),
        ],
      ),

      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }


  Widget _buildQuickStats() {
    return Container(
      width: double.infinity,
      color: AppColors.green,
      padding: EdgeInsets.fromLTRB(16.w, 0, 16.w, 16.h),
      child: Row(
        children: [
          _buildStatItem("5", "إجمالي"),
          SizedBox(width: 8.w),
          _buildStatItem("2", "مراجعة"),
          SizedBox(width: 8.w),
          _buildStatItem("3", "مكتملة"),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 10.h),
        decoration: BoxDecoration(
          color: AppColors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(6.r),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                color: AppColors.white,
                fontSize: 16.sp,
                fontWeight: FontWeight.w800,
              ),
            ),
            SizedBox(height: 2.h),
            Text(
              label,
              style: TextStyle(
                color: AppColors.white.withOpacity(0.8),
                fontSize: 9.sp,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNewRequestButton() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
      child: InkWell(
        onTap: () {
        },
        borderRadius: BorderRadius.circular(8.r),
        child: Container(
          padding: EdgeInsets.all(12.h),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(8.r),
            border: Border.all(color: AppColors.green, width: 1.5.w),
            boxShadow: [
              BoxShadow(
                color: AppColors.black.withOpacity(0.05),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.add_circle_outline, color: AppColors.green, size: 18.sp),
              SizedBox(width: 8.w),
              Text(
                "تقديم طلب جديد",
                style: AppTextStyles.bodyBold.copyWith(
                  color: AppColors.green,
                  fontSize: 12.sp,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
