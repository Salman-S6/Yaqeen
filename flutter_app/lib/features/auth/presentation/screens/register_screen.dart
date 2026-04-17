import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/custom/custom_text_field.dart';
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
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _firstNameCtrl = TextEditingController();
  final TextEditingController _lastNameCtrl = TextEditingController();
  final TextEditingController _nationalIdCtrl = TextEditingController();
  final TextEditingController _fatherNameCtrl = TextEditingController();
  final TextEditingController _motherFirstNameCtrl = TextEditingController();
  final TextEditingController _motherLastNameCtrl = TextEditingController();
  final TextEditingController _dobCtrl = TextEditingController();
  final TextEditingController _placeOfRegCtrl = TextEditingController();
  final TextEditingController _emailCtrl = TextEditingController();
  final TextEditingController _passwordCtrl = TextEditingController();
  final TextEditingController _passwordConfirmCtrl = TextEditingController();

  File? _idImage;
  int _currentStep = 2;

  @override
  void dispose() {
    _firstNameCtrl.dispose();
    _lastNameCtrl.dispose();
    _nationalIdCtrl.dispose();
    _fatherNameCtrl.dispose();
    _motherFirstNameCtrl.dispose();
    _motherLastNameCtrl.dispose();
    _dobCtrl.dispose();
    _placeOfRegCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _passwordConfirmCtrl.dispose();
    super.dispose();
  }

  // --- دالة اختيار الصورة ---
  Future<void> _pickImage(ImageSource source) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: source);
    if (image != null) {
      final File file = File(image.path);
      final int sizeInBytes = file.lengthSync();
      final double sizeInMb = sizeInBytes / (1024 * 1024);

      if (sizeInMb > 5) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("حجم الصورة يجب ألا يتجاوز 5 ميغابايت"), backgroundColor: AppColors.red),
        );
        return;
      }

      setState(() => _idImage = file);
    }
    Navigator.pop(context);
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.green,
              onPrimary: AppColors.white,
              onSurface: AppColors.black,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _dobCtrl.text = "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
      });
    }
  }

  void _showImagePickerOptions() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20.r))),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.all(24.w),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("اختر مصدر الصورة", style: AppTextStyles.sectionTitle.copyWith(fontSize: 14.sp)),
              SizedBox(height: 20.h),
              Row(
                children: [
                  Expanded(child: _buildPickerOption(icon: Icons.camera_alt_rounded, label: "الكاميرا", onTap: () => _pickImage(ImageSource.camera))),
                  SizedBox(width: 16.w),
                  Expanded(child: _buildPickerOption(icon: Icons.photo_library_rounded, label: "الاستديو", onTap: () => _pickImage(ImageSource.gallery))),
                ],
              ),
              SizedBox(height: 10.h),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPickerOption({required IconData icon, required String label, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12.r),
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 20.h),
        decoration: BoxDecoration(color: AppColors.gray, borderRadius: BorderRadius.circular(12.r), border: Border.all(color: AppColors.border)),
        child: Column(
          children: [
            Icon(icon, size: 32.sp, color: AppColors.green),
            SizedBox(height: 8.h),
            Text(label, style: AppTextStyles.bodyBold.copyWith(fontSize: 11.sp, color: AppColors.black)),
          ],
        ),
      ),
    );
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
            setState(() => _currentStep = 3);
            Future.delayed(const Duration(seconds: 1), () {
              if (!mounted) return;
              Navigator.pushReplacementNamed(context, '/citizen_home');
            });
          }
        },
        builder: (context, state) {
          return Column(
            children: [
              CustomAppBar(
                title: "إنشاء حساب",
                subtitle: "الرجاء إدخال بياناتك بدقة",
                backgroundColor: AppColors.black,
                showFlag: false,
                actions: [
                  IconButton(icon: Icon(Icons.arrow_forward_ios, color: AppColors.white, size: 18.sp), onPressed: () => Navigator.pop(context)),
                ],
              ),

              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(16.w),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        StepProgress(currentStep: _currentStep, totalSteps: 3),
                        SizedBox(height: 24.h),

                        Text("البيانات الشخصية", style: AppTextStyles.sectionTitle.copyWith(fontSize: 12.sp, color: AppColors.green)),
                        SizedBox(height: 12.h),
                        Row(
                          children: [
                            Expanded(child: CustomTextField(label: "الاسم الأول", hint: "أحمد", controller: _firstNameCtrl, validator: (v) => v!.isEmpty ? "الاسم الأول مطلوب" : null)),
                            SizedBox(width: 12.w),
                            Expanded(child: CustomTextField(label: "الكنية", hint: "السوري", controller: _lastNameCtrl, validator: (v) => v!.isEmpty ? "الكنية مطلوبة" : null)),
                          ],
                        ),
                        Row(
                          children: [
                            Expanded(child: CustomTextField(label: "اسم الأب", hint: "محمد", controller: _fatherNameCtrl, validator: (v) => v!.isEmpty ? "اسم الأب مطلوب" : null)),
                            SizedBox(width: 12.w),
                            Expanded(child: CustomTextField(label: "اسم الأم", hint: "فاطمة", controller: _motherFirstNameCtrl, validator: (v) => v!.isEmpty ? "اسم الأم مطلوب" : null)),
                          ],
                        ),
                        CustomTextField(label: "كنية الأم", hint: "الحلبي", controller: _motherLastNameCtrl, validator: (v) => v!.isEmpty ? "كنية الأم مطلوبة" : null),

                        Row(
                          children: [
                            // حقل التقويم المحدث
                            Expanded(
                              child: CustomTextField(
                                label: "تاريخ الولادة",
                                hint: "اختر التاريخ 📅",
                                controller: _dobCtrl,
                                readOnly: true,
                                onTap: () => _selectDate(context),
                                validator: (v) => v!.isEmpty ? "تاريخ الولادة مطلوب" : null,
                              ),
                            ),
                            SizedBox(width: 12.w),
                            Expanded(child: CustomTextField(label: "مكان القيد", hint: "دمشق", controller: _placeOfRegCtrl, validator: (v) => v!.isEmpty ? "مكان القيد مطلوب" : null)),
                          ],
                        ),

                        CustomTextField(
                            label: "الرقم الوطني",
                            hint: "11 خانة",
                            controller: _nationalIdCtrl,
                            keyboardType: TextInputType.number,
                            validator: (v) {
                              if (v!.isEmpty) return "الرقم الوطني مطلوب";
                              if (v.length != 11) return "يجب أن يتكون من 11 رقماً";
                              return null;
                            }
                        ),

                        SizedBox(height: 16.h),
                        Divider(color: AppColors.border),
                        SizedBox(height: 16.h),

                        Text("بيانات الحساب", style: AppTextStyles.sectionTitle.copyWith(fontSize: 12.sp, color: AppColors.green)),
                        SizedBox(height: 12.h),

                        CustomTextField(
                            label: "البريد الإلكتروني",
                            hint: "ahmed@mail.com",
                            controller: _emailCtrl,
                            keyboardType: TextInputType.emailAddress,
                            validator: (v) {
                              if (v!.isEmpty) return "البريد الإلكتروني مطلوب";
                              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(v)) return "صيغة البريد غير صحيحة";
                              return null;
                            }
                        ),

                        CustomTextField(
                            label: "كلمة المرور",
                            hint: "••••••••",
                            controller: _passwordCtrl,
                            isPassword: true,
                            validator: (v) {
                              if (v!.isEmpty) return "كلمة المرور مطلوبة";
                              if (v.length < 8) return "يجب أن تكون 8 أحرف على الأقل";
                              return null;
                            }
                        ),

                        CustomTextField(
                            label: "تأكيد كلمة المرور",
                            hint: "••••••••",
                            controller: _passwordConfirmCtrl,
                            isPassword: true,
                            validator: (v) {
                              if (v!.isEmpty) return "يرجى تأكيد كلمة المرور";
                              if (v != _passwordCtrl.text) return "كلمة المرور غير متطابقة";
                              return null;
                            }
                        ),

                        SizedBox(height: 16.h),

                        // --- قسم رفع الصورة ---
                        GestureDetector(
                          onTap: _showImagePickerOptions,
                          child: Container(
                            width: double.infinity,
                            padding: EdgeInsets.symmetric(vertical: _idImage == null ? 20.h : 8.h, horizontal: 12.w),
                            decoration: BoxDecoration(
                              color: _idImage == null ? AppColors.greenPale : AppColors.white,
                              borderRadius: BorderRadius.circular(12.r),
                              border: Border.all(color: _idImage == null ? AppColors.green : AppColors.border, width: 2.w),
                            ),
                            child: _idImage == null ? _buildPickImagePlaceholder() : _buildImagePreview(),
                          ),
                        ),

                        SizedBox(height: 32.h),

                        PrimaryButton(
                          text: "تسجيل وإرسال",
                          isLoading: state is AuthLoading,
                          onPressed: () {
                            if (_formKey.currentState!.validate()) {
                              if (_idImage == null) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text("يرجى إرفاق صورة الهوية"), backgroundColor: AppColors.red),
                                );
                                return;
                              }

                              context.read<AuthBloc>().add(
                                RegisterEvent(
                                  firstName: _firstNameCtrl.text.trim(),
                                  lastName: _lastNameCtrl.text.trim(),
                                  nationalId: _nationalIdCtrl.text.trim(),
                                  fatherName: _fatherNameCtrl.text.trim(),
                                  motherFirstName: _motherFirstNameCtrl.text.trim(),
                                  motherLastName: _motherLastNameCtrl.text.trim(),
                                  dateOfBirth: _dobCtrl.text.trim(),
                                  placeOfRegistration: _placeOfRegCtrl.text.trim(),
                                  email: _emailCtrl.text.trim(),
                                  password: _passwordCtrl.text,
                                  passwordConfirmation: _passwordConfirmCtrl.text,
                                  idImage: _idImage!,
                                ),
                              );
                            }
                          },
                        ),
                        SizedBox(height: 20.h),
                      ],
                    ),
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
        Text("📷", style: TextStyle(fontSize: 24.sp)),
        SizedBox(height: 8.h),
        Text("اضغط لإرفاق صورة الهوية", style: AppTextStyles.bodyBold.copyWith(color: AppColors.greenDark, fontSize: 11.sp)),
      ],
    );
  }

  Widget _buildImagePreview() {
    return Row(
      children: [
        ClipRRect(borderRadius: BorderRadius.circular(8.r), child: Image.file(_idImage!, width: 45.w, height: 45.h, fit: BoxFit.cover)),
        SizedBox(width: 12.w),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("تم إرفاق الصورة", style: AppTextStyles.bodyBold.copyWith(color: AppColors.black, fontSize: 10.sp)),
              Text("اضغط لتغيير الصورة", style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid, fontSize: 8.sp)),
            ],
          ),
        ),
        Icon(Icons.check_circle, color: AppColors.green, size: 20.sp),
      ],
    );
  }
}