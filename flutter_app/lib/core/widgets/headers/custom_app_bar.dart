import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_text_styles.dart';
import 'syrian_flag_stripe.dart';

class CustomAppBar extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Color? backgroundColor;
  final List<Widget>? actions;
  final bool showFlag;

  const CustomAppBar({
    super.key,
    required this.title,
    this.subtitle,
    this.backgroundColor,
    this.actions,
    this.showFlag = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 48, 16, 20),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.black,
        gradient: backgroundColor == null ? AppColors.darkGradient : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showFlag) ...[
            const SyrianFlagStripe(),
            const SizedBox(height: 8),
          ],
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppTextStyles.sectionTitle.copyWith(color: Colors.white, fontSize: 16)),
                  if (subtitle != null)
                    Text(subtitle!, style: AppTextStyles.smallLabel.copyWith(color: Colors.white70)),
                ],
              ),
              if (actions != null) Row(children: actions!),
            ],
          ),
        ],
      ),
    );
  }
}