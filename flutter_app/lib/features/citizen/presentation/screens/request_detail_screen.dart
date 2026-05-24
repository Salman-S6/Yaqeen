import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/indicators/status_badge.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../../core/widgets/buttons/outline_button.dart';
import '../bloc/citizen_bloc.dart';
import '../bloc/citizen_event.dart';
import '../bloc/citizen_state.dart';

class RequestDetailScreen extends StatefulWidget {
  final String requestId;

  const RequestDetailScreen({super.key, required this.requestId});

  @override
  State<RequestDetailScreen> createState() => _RequestDetailScreenState();
}

class _RequestDetailScreenState extends State<RequestDetailScreen> {

  @override
  void initState() {
    super.initState();
    context.read<CitizenBloc>().add(FetchRequestDetailEvent(widget.requestId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocBuilder<CitizenBloc, CitizenState>(
        builder: (context, state) {
          String appBarSubtitle = "جاري التحميل...";

          if (state is RequestDetailLoaded) {
            appBarSubtitle = "رقم الطلب: ${state.request.requestNumber}";
          }

          return Column(
            children: [
              CustomAppBar(
                title: "تفاصيل الطلب",
                subtitle: appBarSubtitle,
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
                child: _buildBodyContent(state),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildBodyContent(CitizenState state) {
    if (state is CitizenLoading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.green));
    }
    else if (state is CitizenError) {
      return Center(
        child: Text(
          state.message,
          style: AppTextStyles.bodyBold.copyWith(color: AppColors.red),
        ),
      );
    }
    else if (state is RequestDetailLoaded) {
      final request = state.request;
      final bool isAccepted = request.status == RequestStatus.accepted;

      return SingleChildScrollView(
        padding: EdgeInsets.all(16.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStatusCard(
                title: request.title,
                status: request.status,
                date: request.date
            ),
            SizedBox(height: 20.h),

            Text("البيانات الشخصية", style: AppTextStyles.bodyBold.copyWith(fontSize: 12.sp)),
            SizedBox(height: 8.h),
            _buildDataBox(
              fullName: request.fullName ?? 'غير متوفر',
              nationalId: request.nationalId ?? 'غير متوفر',
              place: request.registrationPlace ?? 'غير متوفر',
            ),

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
      );
    }

    return const SizedBox();
  }

  Widget _buildStatusCard({required String title, required RequestStatus status, required String date}) {
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
              Text(title, style: AppTextStyles.sectionTitle.copyWith(fontSize: 14.sp)),
              StatusBadge(status: status),
            ],
          ),
          SizedBox(height: 12.h),
          Divider(color: AppColors.border, height: 1.h),
          SizedBox(height: 12.h),
          _buildInfoRow("تاريخ التقديم:", date),
          SizedBox(height: 8.h),
          _buildInfoRow("تاريخ التحديث:", date),
        ],
      ),
    );
  }

  Widget _buildDataBox({required String fullName, required String nationalId, required String place}) {
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
          _buildInfoRow("الاسم الكامل:", fullName),
          SizedBox(height: 10.h),
          _buildInfoRow("الرقم الوطني:", nationalId),
          SizedBox(height: 10.h),
          _buildInfoRow("مكان القيد:", place),
        ],
      ),
    );
  }

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
                Text("وثيقة_التحقق_المرفقة.jpg", style: AppTextStyles.bodyBold.copyWith(fontSize: 10.sp)),
                Text("تلقائي من النظام", style: AppTextStyles.smallLabel.copyWith(fontSize: 8.sp)),
              ],
            ),
          ),
          Icon(Icons.check_circle, color: AppColors.green, size: 20.sp),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTextStyles.smallLabel.copyWith(fontSize: 10.sp)),
        Text(value, style: AppTextStyles.bodyBold.copyWith(fontSize: 10.sp, color: AppColors.black)),
      ],
    );
  }
}