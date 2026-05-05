import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/network/api_endpoints.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/indicators/step_progress.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../bloc/citizen_bloc.dart';
import '../bloc/citizen_event.dart';
import '../bloc/citizen_state.dart';

class RequestFormScreen extends StatefulWidget {
  final int serviceId;
  final String serviceTitle;

  const RequestFormScreen({
    super.key,
    required this.serviceId,
    required this.serviceTitle,
  });

  @override
  State<RequestFormScreen> createState() => _RequestFormScreenState();
}

class _RequestFormScreenState extends State<RequestFormScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocConsumer<CitizenBloc, CitizenState>(
        listener: (context, state) {
          if (state is NewRequestSubmitted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text("تم تقديم الطلب بنجاح!", style: AppTextStyles.bodyBold.copyWith(color: AppColors.white)),
                backgroundColor: AppColors.green,
                behavior: SnackBarBehavior.floating,
              ),
            );
            context.read<CitizenBloc>().add(FetchRequestsEvent());
            Navigator.popUntil(context, ModalRoute.withName('/citizen_home'));
          } else if (state is CitizenError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message, style: AppTextStyles.bodyBold.copyWith(color: AppColors.white)), backgroundColor: AppColors.red),
            );
          }
        },
        builder: (context, citizenState) {
          return Column(
            children: [
              CustomAppBar(
                title: widget.serviceTitle,
                subtitle: "الخطوة 2: مراجعة البيانات وتأكيد الطلب",
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
                      const StepProgress(currentStep: 2, totalSteps: 3),
                      SizedBox(height: 24.h),

                      Text(
                        "مراجعة بيانات مقدم الطلب",
                        style: AppTextStyles.sectionTitle.copyWith(fontSize: 14.sp, color: AppColors.green),
                      ),
                      SizedBox(height: 4.h),
                      Text(
                        "يرجى التأكد من صحة بياناتك المسجلة قبل المتابعة",
                        style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid, fontSize: 10.sp),
                      ),

                      SizedBox(height: 20.h),

                      BlocBuilder<AuthBloc, AuthState>(
                        builder: (context, authState) {
                          String citizenName = "جاري التحميل...";
                          String nationalId = "جاري التحميل...";
                          String? idImageUrl;
                          String token = ""; // 🚀 متغير لحفظ التوكن

                          if (authState is Authenticated) {
                            citizenName = "${authState.user.firstName} ${authState.user.lastName}";
                            nationalId = authState.user.nationalId;
                            idImageUrl = authState.user.idImage;
                            token = authState.user.token;
                          }

                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _buildCitizenInfoCard(citizenName, nationalId),

                              SizedBox(height: 20.h),

                              Text(
                                "وثيقة التحقق المعتمدة",
                                style: AppTextStyles.bodyBold.copyWith(fontSize: 12.sp),
                              ),
                              SizedBox(height: 10.h),
                              _buildIdentityImagePreview(idImageUrl, token),
                            ],
                          );
                        },
                      ),

                      SizedBox(height: 40.h),

                      PrimaryButton(
                        text: "تأكيد وإرسال الطلب",
                        isLoading: citizenState is CitizenLoading,
                        onPressed: () {
                          context.read<CitizenBloc>().add(
                            SubmitNewRequestEvent(
                              serviceTypeId: widget.serviceId,
                              notes: "تم التأكيد من قبل المواطن",
                              quantity: 1,
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildCitizenInfoCard(String name, String nationalId) {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          _buildInfoRow("اسم المواطن:", name),
          Divider(height: 20.h, color: AppColors.gray),
          _buildInfoRow("الرقم الوطني:", nationalId),
          Divider(height: 20.h, color: AppColors.gray),
          _buildInfoRow("نوع الخدمة:", widget.serviceTitle),
        ],
      ),
    );
  }

  // 🚀 استقبال التوكن هنا
  Widget _buildIdentityImagePreview(String? imageUrl, String token) {
    print("================ DEBUG IMAGE ================");
    print("🔍 الرابط الأصلي من السيرفر: $imageUrl");

    String? fullImageUrl;
    if (imageUrl != null && imageUrl.isNotEmpty) {
      if (imageUrl.startsWith('http')) {
        fullImageUrl = imageUrl;
      } else {
        final domain = ApiEndpoints.baseUrl.replaceFirst('/api', '');
        final cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        fullImageUrl = "$domain/$cleanPath";
      }
    }

    print("🌐 الرابط النهائي للتحميل: $fullImageUrl");

    print("🔑 التوكن الذي يتم إرساله مع الصورة: $token");

    print("============================================");
    return Container(
      width: double.infinity,
      height: 180.h,
      decoration: BoxDecoration(
        color: AppColors.gray,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.border),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12.r),
        child: Stack(
          alignment: Alignment.center,
          children: [
            if (fullImageUrl != null)
              Image.network(
                fullImageUrl,
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
                headers: {
                  'Authorization': 'Bearer $token',
                  'Accept': 'application/json',
                  'ngrok-skip-browser-warning': 'true',
                },
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return const Center(child: CircularProgressIndicator(color: AppColors.green));
                },
                errorBuilder: (context, error, stackTrace) {
                  print("⚠️ فشل تحميل الصورة. الخطأ: $error");
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.broken_image_outlined, size: 40.sp, color: AppColors.red),
                      SizedBox(height: 8.h),
                      Text("فشل تحميل الصورة", style: AppTextStyles.smallLabel.copyWith(color: AppColors.red)),
                    ],
                  );
                },
              )
            else
              Icon(Icons.badge_outlined, size: 80.sp, color: AppColors.grayMid),

            Positioned(
              bottom: 12.h,
              left: 12.w,
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
                decoration: BoxDecoration(
                  color: AppColors.green,
                  borderRadius: BorderRadius.circular(20.r),
                ),
                child: Text(
                  "هوية معتمدة ✅",
                  style: AppTextStyles.bodyBold.copyWith(color: AppColors.white, fontSize: 9.sp),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid)),
        Text(value, style: AppTextStyles.bodyBold.copyWith(color: AppColors.black)),
      ],
    );
  }
}