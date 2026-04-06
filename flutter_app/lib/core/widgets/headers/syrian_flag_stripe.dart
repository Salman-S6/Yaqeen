import 'package:flutter/material.dart';

class SyrianFlagStripe extends StatelessWidget {
  final double height;
  final double? width;

  const SyrianFlagStripe({super.key, this.height = 3.0, this.width});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: width ?? 56.0,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(2),
        gradient: const LinearGradient(
          colors: [
            Color(0xFF007A3D),
            Colors.white,
            Colors.white,
            Color(0xFFCE1126),
          ],
          stops: [0.33, 0.33, 0.66, 0.66],
        ),
      ),
    );
  }
}