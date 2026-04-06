import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';

class QrFrameOverlay extends StatelessWidget {
  final double? size;
  const QrFrameOverlay({super.key, this.size});

  @override
  Widget build(BuildContext context) {
    final double actualSize = size ?? 200.0.w;
    return SizedBox(
      width: actualSize,
      height: actualSize,
      child: Stack(
        children: [
          _buildCorner(top: 0, right: 0, isTop: true, isRight: true),
          _buildCorner(top: 0, left: 0, isTop: true, isRight: false),
          _buildCorner(bottom: 0, right: 0, isTop: false, isRight: true),
          _buildCorner(bottom: 0, left: 0, isTop: false, isRight: false),

          Center(
            child: Container(
              height: 2.h,
              width: actualSize * 0.8,
              color: AppColors.greenLight.withOpacity(0.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCorner({double? top, double? bottom, double? left, double? right, required bool isTop, required bool isRight}) {
    final double thickness = 3.0.w;
    final double length = 20.0.w;
    return Positioned(
      top: top, bottom: bottom, left: left, right: right,
      child: Container(
        width: length,
        height: length,
        decoration: BoxDecoration(
          border: Border(
            top: isTop ? BorderSide(color: AppColors.greenLight, width: thickness) : BorderSide.none,
            bottom: !isTop ? BorderSide(color: AppColors.greenLight, width: thickness) : BorderSide.none,
            right: isRight ? BorderSide(color: AppColors.greenLight, width: thickness) : BorderSide.none,
            left: !isRight ? BorderSide(color: AppColors.greenLight, width: thickness) : BorderSide.none,
          ),
        ),
      ),
    );
  }
}