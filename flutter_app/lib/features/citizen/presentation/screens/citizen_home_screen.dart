import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/navigation/custom_bottom_nav.dart';
import '../../../../core/widgets/cards_and_tiles/request_list_tile.dart';
import '../../../../core/widgets/indicators/status_badge.dart';
import '../bloc/citizen_bloc.dart';
import '../bloc/citizen_event.dart';
import '../bloc/citizen_state.dart';
import 'new_request_screen.dart';
import 'request_detail_screen.dart';

class CitizenHomeScreen extends StatefulWidget {
  const CitizenHomeScreen({super.key});

  @override
  State<CitizenHomeScreen> createState() => _CitizenHomeScreenState();
}

class _CitizenHomeScreenState extends State<CitizenHomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    context.read<CitizenBloc>().add(FetchRequestsEvent());
  }

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
            child: BlocBuilder<CitizenBloc, CitizenState>(
              builder: (context, state) {
                if (state is CitizenLoading) {
                  return const Center(child: CircularProgressIndicator());
                }
                else if (state is RequestsLoaded) {
                  if (state.requests.isEmpty) {
                    return const Center(child: Text("لا يوجد طلبات حالياً"));
                  }
                  return ListView.builder(
                    padding: EdgeInsets.zero,
                    itemCount: state.requests.length,
                    itemBuilder: (context, index) {
                      final request = state.requests[index];
                      return RequestListTile(
                        title: request.title,
                        requestId: request.id,
                        date: request.date,
                        icon: request.icon,
                        status: request.status,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => RequestDetailScreen(requestId: request.id),
                            ),
                          );
                        },
                      );
                    },
                  );
                }
                else if (state is CitizenError) {
                  return Center(child: Text(state.message, style: TextStyle(color: AppColors.red)));
                }
                return const SizedBox();
              },
            ),
          ),
        ],
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
            Text(value, style: TextStyle(color: AppColors.white, fontSize: 16.sp, fontWeight: FontWeight.w800)),
            SizedBox(height: 2.h),
            Text(label, style: TextStyle(color: AppColors.white.withOpacity(0.8), fontSize: 9.sp)),
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
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const NewRequestScreen()),
          );
        },
        borderRadius: BorderRadius.circular(8.r),
        child: Container(
          padding: EdgeInsets.all(12.h),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(8.r),
            border: Border.all(color: AppColors.green, width: 1.5.w),
            boxShadow: [
              BoxShadow(color: AppColors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2)),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.add_circle_outline, color: AppColors.green, size: 18.sp),
              SizedBox(width: 8.w),
              Text("تقديم طلب جديد", style: AppTextStyles.bodyBold.copyWith(color: AppColors.green, fontSize: 12.sp)),
            ],
          ),
        ),
      ),
    );
  }
}