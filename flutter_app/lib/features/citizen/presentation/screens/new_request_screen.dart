import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/indicators/step_progress.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../bloc/citizen_bloc.dart';
import '../bloc/citizen_event.dart';
import '../bloc/citizen_state.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import 'request_form_screen.dart';

class NewRequestScreen extends StatefulWidget {
  const NewRequestScreen({super.key});

  @override
  State<NewRequestScreen> createState() => _NewRequestScreenState();
}

class _NewRequestScreenState extends State<NewRequestScreen> {

  @override
  void initState() {
    super.initState();
    context.read<CitizenBloc>().add(FetchServiceTypesEvent());
  }

  IconData _getIconFromString(String iconName) {
    switch (iconName.toLowerCase()) {
      case 'person': return Icons.person_outline;
      case 'family': return Icons.family_restroom;
      case 'gavel': return Icons.gavel;
      case 'home': return Icons.home_work_outlined;
      case 'work': return Icons.work_off_outlined;
      case 'child': return Icons.child_care;
      default: return Icons.description_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = context.read<AuthBloc>().state;
    if (authState is Authenticated) {
      print("🖼️ UI [NewRequest]: User Image from AuthState -> ${authState.user.idImage}");
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "تقديم طلب جديد",
            subtitle: "الخطوة 1: اختر نوع الوثيقة المطلوبة",
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
                  const StepProgress(currentStep: 1, totalSteps: 3),
                  SizedBox(height: 24.h),
                  Text(
                    "الخدمات المتاحة",
                    style: AppTextStyles.sectionTitle.copyWith(fontSize: 14.sp, color: AppColors.green),
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    "اختر الوثيقة التي ترغب في استخراجها للمتابعة",
                    style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid, fontSize: 10.sp),
                  ),
                  SizedBox(height: 20.h),
                  BlocBuilder<CitizenBloc, CitizenState>(
                    builder: (context, state) {
                      if (state is CitizenLoading) {
                        return Center(
                            child: Padding(
                              padding: EdgeInsets.symmetric(vertical: 40.h),
                              child: const CircularProgressIndicator(color: AppColors.green),
                            )
                        );
                      }
                      else if (state is ServiceTypesLoaded) {
                        final services = state.serviceTypes;
                        if (services.isEmpty) {
                          return Center(child: Text("لا يوجد خدمات متاحة حالياً", style: AppTextStyles.bodyBold));
                        }
                        return GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12.w,
                            mainAxisSpacing: 12.h,
                            childAspectRatio: 1.1,
                          ),
                          itemCount: services.length,
                          itemBuilder: (context, index) {
                            final service = services[index];
                            return _buildServiceCard(
                              context: context,
                              title: service.name,
                              icon: _getIconFromString(service.icon),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => RequestFormScreen(
                                      serviceId: service.id,
                                      serviceTitle: service.name,
                                    ),
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
                  SizedBox(height: 20.h),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard({
    required BuildContext context,
    required String title,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: AppColors.white,
      borderRadius: BorderRadius.circular(12.r),
      elevation: 2,
      shadowColor: AppColors.black.withOpacity(0.05),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12.r),
        splashColor: AppColors.greenPale,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12.r),
            border: Border.all(color: AppColors.border, width: 1),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: EdgeInsets.all(12.w),
                decoration: const BoxDecoration(
                  color: AppColors.gray,
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: AppColors.green, size: 28.sp),
              ),
              SizedBox(height: 12.h),
              Text(
                title,
                style: AppTextStyles.bodyBold.copyWith(fontSize: 11.sp, color: AppColors.black),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}