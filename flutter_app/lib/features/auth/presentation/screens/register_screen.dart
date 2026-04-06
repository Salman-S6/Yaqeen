import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/buttons/primary_button.dart';
import '../../../../core/widgets/indicators/step_progress.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _nationalIdController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  File? _idImage;
  int _currentStep = 2;

  @override
  void dispose() {
    _nationalIdController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        _idImage = File(image.path);
      });
    }
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
          } else if (state is Authenticated) {
            setState(() {
              _currentStep = 3;
            });

            Future.delayed(const Duration(seconds: 1), () {
              Navigator.pushReplacementNamed(context, '/citizen_home');
            });
          }
        },
        builder: (context, state) {
          return Column(
            children: [
              CustomAppBar(
                title: "إنشاء حساب",
                subtitle: "رفع صورة الهوية للتحقق",
                backgroundColor: AppColors.black,
                showFlag: false,
                actions: [
                  IconButton(icon: Icon(Icons.arrow_forward_ios, color: AppColors.white, size: 18.sp), onPressed: () => Navigator.pop(context)),
                ],
              ),

              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(16.w),
                  child: Column(
                    children: [
                      StepProgress(currentStep: _currentStep, totalSteps: 3),

                      SizedBox(height: 24.h),

                      _buildResponsiveInputField(label: "الرقم الوطني", hint: "12345678901", sub: "11 خانة رقمية", controller: _nationalIdController, keyboardType: TextInputType.number),
                      _buildResponsiveInputField(label: "البريد الإلكتروني", hint: "ahmed@mail.com", controller: _emailController, keyboardType: TextInputType.emailAddress),
                      _buildResponsiveInputField(label: "كلمة المرور", hint: "••••••••", controller: _passwordController, isPassword: true),

                      SizedBox(height: 16.h),

                      GestureDetector(
                        onTap: _pickImage,
                        child: Container(
                          width: double.infinity,
                          padding: EdgeInsets.symmetric(
                              vertical: _idImage == null ? 20.h : 8.h,
                              horizontal: 12.w
                          ),
                          decoration: BoxDecoration(
                            color: _idImage == null ? AppColors.greenPale : AppColors.white,
                            borderRadius: BorderRadius.circular(12.r),
                            border: Border.all(
                                color: _idImage == null ? AppColors.green : AppColors.border,
                                width: 2.w
                            ),
                          ),
                          child: _idImage == null
                              ? _buildPickImagePlaceholder()
                              : _buildImagePreview(),
                        ),
                      ),

                      SizedBox(height: 32.h),

                      PrimaryButton(
                        text: "تسجيل وإرسال",
                        isLoading: state is AuthLoading,
                        onPressed: () {
                          if (_nationalIdController.text.isNotEmpty &&
                              _emailController.text.isNotEmpty &&
                              _passwordController.text.isNotEmpty &&
                              _idImage != null) {

                            context.read<AuthBloc>().add(
                              RegisterEvent(
                                nationalId: _nationalIdController.text.trim(),
                                email: _emailController.text.trim(),
                                password: _passwordController.text,
                                idImage: _idImage!,
                              ),
                            );

                            _nationalIdController.clear();
                            _emailController.clear();
                            _passwordController.clear();
                            setState(() {
                              _idImage = null;
                            });
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text("يرجى تعبئة جميع الحقول وإرفاق صورة الهوية", style: AppTextStyles.smallLabel.copyWith(color: AppColors.white)), backgroundColor: AppColors.red),
                            );
                          }
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

  Widget _buildPickImagePlaceholder() {
    return Column(
      children: [
        Text("🪪", style: TextStyle(fontSize: 24.sp)),
        SizedBox(height: 8.h),
        Text(
          "اضغط لرفع صورة الهوية",
          style: AppTextStyles.bodyBold.copyWith(color: AppColors.greenDark, fontSize: 11.sp),
        ),
        SizedBox(height: 4.h),
        Text(
          "JPG/PNG — حد 5 MB",
          style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid, fontSize: 9.sp),
        ),
      ],
    );
  }

  Widget _buildImagePreview() {
    return Row(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(8.r),
          child: Image.file(
            _idImage!,
            width: 45.w,
            height: 45.h,
            fit: BoxFit.cover,
          ),
        ),
        SizedBox(width: 12.w),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "تم اختيار الصورة بنجاح",
                style: AppTextStyles.bodyBold.copyWith(color: AppColors.black, fontSize: 10.sp),
              ),
              SizedBox(height: 2.h),
              Text(
                "اضغط مرة أخرى لتغيير الصورة",
                style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid, fontSize: 8.sp),
              ),
            ],
          ),
        ),
        Icon(Icons.check_circle, color: AppColors.green, size: 20.sp),
      ],
    );
  }

  Widget _buildResponsiveInputField({required String label, required String hint, required TextEditingController controller, String? sub, bool isPassword = false, TextInputType keyboardType = TextInputType.text}) {
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(color: AppColors.gray, borderRadius: BorderRadius.circular(8.r)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid, fontSize: 8.sp)),
          SizedBox(height: 4.h),
          TextField(
            controller: controller,
            obscureText: isPassword,
            keyboardType: keyboardType,
            style: AppTextStyles.bodyRegular.copyWith(color: AppColors.black, fontSize: 11.sp),
            decoration: InputDecoration(hintText: hint, hintStyle: TextStyle(color: AppColors.grayMid, fontSize: 11.sp), isDense: true, border: InputBorder.none, contentPadding: EdgeInsets.symmetric(vertical: 2.h)),
          ),
          if (sub != null) ...[
            SizedBox(height: 4.h),
            Text(sub, style: AppTextStyles.smallLabel.copyWith(fontSize: 8.sp, color: AppColors.grayMid)),
          ]
        ],
      ),
    );
  }
}