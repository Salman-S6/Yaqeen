import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../../core/widgets/alerts/alert_banner.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _isLinkSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message, style: AppTextStyles.bodyBold.copyWith(color: AppColors.white)), backgroundColor: AppColors.red),
            );
          } else if (state is PasswordResetLinkSent) {
            setState(() => _isLinkSent = true);
          }
        },
        builder: (context, state) {
          return Column(
            children: [
              CustomAppBar(
                title: "استعادة كلمة المرور",
                subtitle: "سنرسل رابطاً على بريدك الإلكتروني",
                backgroundColor: AppColors.black,
                showFlag: false,
                actions: [
                  IconButton(icon: Icon(Icons.arrow_forward_ios, color: AppColors.white, size: 18.sp), onPressed: () => Navigator.pop(context)),
                ],
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 20.h),
                  child: Column(
                    children: [

                      if (_isLinkSent) ...[
                        Container(
                          width: double.infinity,
                          padding: EdgeInsets.all(12.w),
                          decoration: BoxDecoration(color: AppColors.badgeRevBg, borderRadius: BorderRadius.circular(8.r)),
                          child: Row(
                            children: [
                              Text("📧", style: TextStyle(fontSize: 14.sp)),
                              SizedBox(width: 8.w),
                              Expanded(
                                child: Text(
                                  "الرابط صالح 30 دقيقة — لاستخدام واحد فقط",
                                  style: AppTextStyles.smallLabel.copyWith(color: AppColors.badgeRevText, fontSize: 9.sp),
                                ),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(height: 24.h),
                      ],

                      _buildResponsiveInputField(label: "البريد الإلكتروني", controller: _emailController, hint: "ahmed@mail.com"),

                      SizedBox(height: 24.h),

                      PrimaryButton(
                        text: "إرسال رابط الاستعادة",
                        isLoading: state is AuthLoading,
                        onPressed: () {
                          if (_emailController.text.isNotEmpty) {
                            context.read<AuthBloc>().add(
                              ForgotPasswordEvent(email: _emailController.text.trim()),
                            );
                            _emailController.clear();
                          }
                        },
                      ),
                      if (_isLinkSent) ...[
                        SizedBox(height: 30.h),
                        const AlertBanner(message: "تم إرسال الرابط! تحقق من بريدك الإلكتروني", type: AlertType.success),
                      ],

                      SizedBox(height: 40.h),

                      Center(
                        child: GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: RichText(
                            text: TextSpan(
                              style: AppTextStyles.captionSemiBold.copyWith(color: AppColors.grayMid, fontSize: 9.sp),
                              children: [
                                const TextSpan(text: "تذكرت كلمة المرور؟ "),
                                TextSpan(text: "تسجيل الدخول", style: AppTextStyles.bodyBold.copyWith(color: AppColors.green, fontSize: 9.sp)),
                              ],
                            ),
                          ),
                        ),
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

  Widget _buildResponsiveInputField({required String label, required TextEditingController controller, required String hint}) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(color: AppColors.gray, borderRadius: BorderRadius.circular(8.r)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid, fontSize: 8.sp)),
          SizedBox(height: 4.h),
          TextField(
            controller: controller,
            keyboardType: TextInputType.emailAddress,
            style: AppTextStyles.bodyRegular.copyWith(color: AppColors.black, fontSize: 11.sp),
            decoration: InputDecoration(hintText: hint, isDense: true, border: InputBorder.none, hintStyle: TextStyle(color: AppColors.grayMid, fontSize: 11.sp)),
          ),
        ],
      ),
    );
  }
}