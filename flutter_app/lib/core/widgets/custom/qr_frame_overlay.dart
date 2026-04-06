import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';

class QrFrameOverlay extends StatelessWidget {
  final double size;
  const QrFrameOverlay({super.key, this.size = 200.0});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        children: [
          _buildCorner(top: 0, right: 0, isTop: true, isRight: true),
          _buildCorner(top: 0, left: 0, isTop: true, isRight: false),
          _buildCorner(bottom: 0, right: 0, isTop: false, isRight: true),
          _buildCorner(bottom: 0, left: 0, isTop: false, isRight: false),

          Center(
            child: Container(
              height: 2,
              width: size * 0.8,
              color: AppColors.greenLight.withOpacity(0.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCorner({double? top, double? bottom, double? left, double? right, required bool isTop, required bool isRight}) {
    const double thickness = 3.0;
    const double length = 20.0;
    return Positioned(
      top: top, bottom: bottom, left: left, right: right,
      child: Container(
        width: length,
        height: length,
        decoration: BoxDecoration(
          border: Border(
            top: isTop ? const BorderSide(color: AppColors.greenLight, width: thickness) : BorderSide.none,
            bottom: !isTop ? const BorderSide(color: AppColors.greenLight, width: thickness) : BorderSide.none,
            right: isRight ? const BorderSide(color: AppColors.greenLight, width: thickness) : BorderSide.none,
            left: !isRight ? const BorderSide(color: AppColors.greenLight, width: thickness) : BorderSide.none,
          ),
        ),
      ),
    );
  }
}