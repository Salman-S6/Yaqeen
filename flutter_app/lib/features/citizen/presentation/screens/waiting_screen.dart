import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../bloc/citizen_bloc.dart';
import '../bloc/citizen_event.dart';
import '../bloc/citizen_state.dart';

class WaitingScreen extends StatelessWidget {
  const WaitingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,

      body: BlocListener<CitizenBloc, CitizenState>(
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
          }
          else if (state is CitizenError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: AppColors.red),
            );
            Navigator.pop(context);
          }
        },
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 24.w),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: EdgeInsets.all(20.w),
                decoration: const BoxDecoration(
                  color: AppColors.greenPale,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.hourglass_empty_rounded,
                  size: 60.sp,
                  color: AppColors.green,
                ),
              ),

              SizedBox(height: 32.h),

              Text(
                "قيد المعالجة والتحقق",
                style: AppTextStyles.sectionTitle.copyWith(color: AppColors.black, fontSize: 18.sp),
                textAlign: TextAlign.center,
              ),

              SizedBox(height: 12.h),

              Text(
                "نحن الآن نقوم بالتحقق من بيانات الهوية التي قمت برفعها. ستصلك رسالة إشعار فور الانتهاء من عملية التدقيق.",
                style: AppTextStyles.bodyRegular.copyWith(color: AppColors.grayMid, fontSize: 11.sp),
                textAlign: TextAlign.center,
              ),

              SizedBox(height: 40.h),

              ClipRRect(
                borderRadius: BorderRadius.circular(10.r),
                child: LinearProgressIndicator(
                  backgroundColor: AppColors.border,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppColors.green),
                  minHeight: 6.h,
                ),
              ),

              SizedBox(height: 60.h),

              PrimaryButton(
                text: "العودة للرئيسية",
                onPressed: () {
                  Navigator.popUntil(context, ModalRoute.withName('/citizen_home'));
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}