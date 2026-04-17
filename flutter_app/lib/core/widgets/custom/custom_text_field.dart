import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';

class CustomTextField extends StatelessWidget {
  final String label;
  final String hint;
  final TextEditingController controller;
  final bool isPassword;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final bool readOnly;
  final VoidCallback? onTap;

  const CustomTextField({
    super.key,
    required this.label,
    required this.hint,
    required this.controller,
    this.isPassword = false,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.readOnly = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.only(right: 4.w, bottom: 4.h),
            child: Text(
              label,
              style: AppTextStyles.smallLabel.copyWith(color: AppColors.grayMid, fontSize: 8.sp),
            ),
          ),
          TextFormField(
            controller: controller,
            obscureText: isPassword,
            keyboardType: keyboardType,
            readOnly: readOnly,
            onTap: onTap,
            style: AppTextStyles.bodyRegular.copyWith(color: AppColors.black, fontSize: 11.sp),
            validator: validator,
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: TextStyle(color: AppColors.grayMid, fontSize: 11.sp),
              filled: true,
              fillColor: AppColors.gray,
              isDense: true,
              contentPadding: EdgeInsets.symmetric(vertical: 10.h, horizontal: 12.w),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.r),
                borderSide: const BorderSide(color: AppColors.green, width: 1),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.r),
                borderSide: const BorderSide(color: AppColors.green, width: 1.5),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.r),
                borderSide: const BorderSide(color: AppColors.red, width: 1),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.r),
                borderSide: const BorderSide(color: AppColors.red, width: 1.5),
              ),
              errorStyle: TextStyle(color: AppColors.red, fontSize: 8.sp),
            ),
          ),
        ],
      ),
    );
  }
}