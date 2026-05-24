import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/cards_and_tiles/request_list_tile.dart';
import '../../../../core/widgets/indicators/status_badge.dart';

import '../bloc/citizen_bloc.dart';
import '../bloc/citizen_state.dart';
import 'request_detail_screen.dart';

class RequestsListScreen extends StatefulWidget {
  const RequestsListScreen({super.key});

  @override
  State<RequestsListScreen> createState() => _RequestsListScreenState();
}

class _RequestsListScreenState extends State<RequestsListScreen> {
  String _selectedFilter = "الكل";

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
            child: BlocBuilder<CitizenBloc, CitizenState>(
              builder: (context, state) {
                if (state is CitizenLoading) {
                  return const Center(child: CircularProgressIndicator(color: AppColors.green));
                }
                else if (state is RequestsLoaded) {
                  final allRequests = state.requests;

                  if (allRequests.isEmpty) {
                    return Center(
                      child: Text(
                        "لا يوجد لديك أي طلبات سابقة",
                        style: AppTextStyles.bodyBold.copyWith(color: AppColors.grayMid),
                      ),
                    );
                  }

                  final filteredRequests = allRequests.where((request) {
                    if (_selectedFilter == "الكل") return true;
                    if (_selectedFilter == "مقبول" && request.status == RequestStatus.accepted) return true;
                    if (_selectedFilter == "قيد المعالجة" && request.status == RequestStatus.review) return true;
                    if (_selectedFilter == "مرفوض" && request.status == RequestStatus.rejected) return true;
                    return false;
                  }).toList();

                  if (filteredRequests.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.search_off, size: 40.sp, color: AppColors.grayMid),
                          SizedBox(height: 12.h),
                          Text(
                            "لا يوجد طلبات في هذا التصنيف",
                            style: AppTextStyles.bodyBold.copyWith(color: AppColors.grayMid),
                          ),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: EdgeInsets.zero,
                    itemCount: filteredRequests.length,
                    itemBuilder: (context, index) {
                      final request = filteredRequests[index];
                      return RequestListTile(
                        title: request.title,
                        requestId: request.id.toString(),
                        date: request.date,
                        icon: request.icon,
                        status: request.status,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => RequestDetailScreen(requestId: request.id.toString(),),
                            ),
                          );
                        },
                      );
                    },
                  );
                }
                else if (state is CitizenError) {
                  return Center(
                    child: Text(state.message, style: AppTextStyles.bodyBold.copyWith(color: AppColors.red)),
                  );
                }

                return const SizedBox();
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
          _filterChip("الكل"),
          _filterChip("مقبول"),
          _filterChip("قيد المعالجة"),
          _filterChip("مرفوض"),
        ],
      ),
    );
  }

  Widget _filterChip(String label) {
    bool isSelected = _selectedFilter == label;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedFilter = label;
        });
      },
      child: Container(
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
      ),
    );
  }
}