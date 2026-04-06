import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/alerts/alert_banner.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../../core/widgets/headers/syrian_flag_stripe.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  int _failedAttempts = 0;
  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthError) {
            setState(() {
              _failedAttempts++;
            });

            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message, style: AppTextStyles.bodyBold.copyWith(color: AppColors.white)),
                backgroundColor: AppColors.red,
                behavior: SnackBarBehavior.floating,
              ),
            );
          } else if (state is Authenticated) {
            if (state.role == 'citizen') {
              setState(() => _failedAttempts = 0);
              Navigator.pushReplacementNamed(context, '/citizen_home');
            }
          }
        },
        builder: (context, state) {
          return SingleChildScrollView(
            child: Column(
              children: [
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.only(top: 60.h, bottom: 30.h),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topRight,
                      end: Alignment.bottomLeft,
                      colors: [AppColors.greenDark, AppColors.green],
                    ),
                  ),
                  child: Column(
                    children: [
                      Text("يقين", style: AppTextStyles.headerExtraBold.copyWith(fontSize: 30.sp)),
                      SizedBox(height: 8.h),
                      SyrianFlagStripe(width: 56.w),
                      SizedBox(height: 10.h),
                      Text(
                        "منصة الخدمات الحكومية الرقمية",
                        style: AppTextStyles.captionSemiBold.copyWith(color: Colors.white.withOpacity(0.55), fontSize: 9.sp),
                      ),
                    ],
                  ),
                ),

                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 20.h),
                  child: Column(
                    children: [
                      _buildResponsiveInput(label: "البريد الإلكتروني", hint: "ahmed@mail.com", controller: _emailController),
                      _buildResponsiveInput(label: "كلمة المرور", hint: "••••••••", isPassword: true, controller: _passwordController),

                      Align(
                        alignment: Alignment.centerLeft,
                        child: TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/forgot_password'),
                          child: Text("نسيت كلمة المرور؟", style: AppTextStyles.bodyBold.copyWith(color: AppColors.green, fontSize: 9.sp)),
                        ),
                      ),

                      SizedBox(height: 10.h),

                      PrimaryButton(
                        text: "دخول",
                        isLoading: state is AuthLoading,
                        onPressed: () {
                          if (_emailController.text.isNotEmpty && _passwordController.text.isNotEmpty) {
                            context.read<AuthBloc>().add(
                              LoginEvent(
                                email: _emailController.text.trim(),
                                password: _passwordController.text,
                              ),
                            );

                            _emailController.clear();
                            _passwordController.clear();
                          }
                        },
                      ),
                      SizedBox(height: 12.h),

                      if (_failedAttempts >= 5)
                        const AlertBanner(
                          message: "بعد 5 محاولات — تجميد 15 دقيقة",
                          type: AlertType.warning,
                        ),

                      SizedBox(height: 80.h),

                      Center(
                        child: GestureDetector(
                          onTap: () => Navigator.pushNamed(context, '/register'),
                          child: RichText(
                            text: TextSpan(
                              style: AppTextStyles.captionSemiBold.copyWith(color: AppColors.grayMid, fontSize: 9.sp),
                              children: [
                                const TextSpan(text: "ليس لديك حساب؟ "),
                                TextSpan(text: "إنشاء حساب", style: AppTextStyles.bodyBold.copyWith(color: AppColors.green, fontSize: 9.sp)),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildResponsiveInput({required String label, required String hint, required TextEditingController controller, bool isPassword = false}) {
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
      decoration: BoxDecoration(color: AppColors.gray, borderRadius: BorderRadius.circular(8.r)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTextStyles.smallLabel.copyWith(fontSize: 8.sp)),
          TextField(
            controller: controller,
            obscureText: isPassword,
            style: AppTextStyles.bodyRegular.copyWith(fontSize: 11.sp),
            decoration: InputDecoration(hintText: hint, isDense: true, border: InputBorder.none, hintStyle: TextStyle(fontSize: 11.sp, color: AppColors.grayMid)),
          ),
        ],
      ),
    );
  }
}