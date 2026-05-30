import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../bloc/notification_bloc.dart';
import '../bloc/notification_event.dart';
import '../bloc/notification_state.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    context.read<NotificationBloc>().add(LoadNotificationsEvent());
  }

  Future<void> _handleRefresh() async {
    context.read<NotificationBloc>().add(LoadNotificationsEvent());
    await Future.delayed(const Duration(milliseconds: 800));
  }

  Widget _buildScrollableEmptyState(BoxConstraints constraints, Widget child) {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: ConstrainedBox(
        constraints: BoxConstraints(minHeight: constraints.maxHeight),
        child: Center(child: child),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          CustomAppBar(
            title: "التنبيهات والإشعارات",
            subtitle: "تحديثات المعاملات والطلبات الرسمية فوراً",
            backgroundColor: AppColors.black,
            showFlag: true,
            actions: [
              IconButton(
                icon: Icon(Icons.arrow_forward_ios, color: AppColors.white, size: 18.sp),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          Expanded(
            child: RefreshIndicator(
              color: AppColors.green,
              onRefresh: _handleRefresh,
              child: BlocBuilder<NotificationBloc, NotificationState>(
                builder: (context, state) {
                  return LayoutBuilder(
                    builder: (context, constraints) {
                      if (state is NotificationLoading) {
                        return _buildScrollableEmptyState(
                          constraints,
                          const CircularProgressIndicator(color: AppColors.green),
                        );
                      } else if (state is NotificationError) {
                        return _buildScrollableEmptyState(
                          constraints,
                          Text(
                            state.message,
                            style: AppTextStyles.bodyBold.copyWith(color: AppColors.red),
                            textAlign: TextAlign.center,
                          ),
                        );
                      } else if (state is NotificationLoaded) {
                        if (state.notifications.isEmpty) {
                          return _buildScrollableEmptyState(
                            constraints,
                            Text(
                              "لا توجد إشعارات حالياً",
                              style: AppTextStyles.bodyBold.copyWith(color: AppColors.grayMid),
                            ),
                          );
                        }

                        return ListView.builder(
                          physics: const AlwaysScrollableScrollPhysics(),
                          padding: EdgeInsets.all(16.w),
                          itemCount: state.notifications.length,
                          itemBuilder: (context, index) {
                            final item = state.notifications[index];
                            final bool isUnread = !item.isRead;

                            return GestureDetector(
                              onTap: () {
                                if (isUnread) {
                                  context.read<NotificationBloc>().add(MarkAsReadEvent(item.id));
                                }
                              },
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                margin: EdgeInsets.only(bottom: 12.h),
                                padding: EdgeInsets.all(16.w),
                                decoration: BoxDecoration(
                                  color: isUnread ? AppColors.white : AppColors.gray,
                                  borderRadius: BorderRadius.circular(12.r),
                                  border: Border.all(
                                    color: isUnread ? AppColors.green : AppColors.border,
                                    width: 1.w,
                                  ),
                                  boxShadow: isUnread
                                      ? [
                                    BoxShadow(
                                      color: AppColors.green.withOpacity(0.08),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    )
                                  ]
                                      : [],
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Icon(
                                      isUnread
                                          ? Icons.notifications_active_rounded
                                          : Icons.notifications_none_rounded,
                                      color: isUnread ? AppColors.green : AppColors.grayMid,
                                      size: 24.sp,
                                    ),
                                    SizedBox(width: 12.w),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item.title,
                                            style: AppTextStyles.bodyBold.copyWith(
                                              fontSize: 12.sp,
                                              color: isUnread ? AppColors.black : AppColors.grayMid,
                                            ),
                                          ),
                                          SizedBox(height: 6.h),
                                          Text(
                                            item.body,
                                            style: AppTextStyles.bodyRegular.copyWith(
                                              fontSize: 10.sp,
                                              height: 1.5,
                                            ),
                                          ),
                                          SizedBox(height: 8.h),
                                          Text(
                                            item.createdAt,
                                            style: AppTextStyles.smallLabel.copyWith(
                                              fontSize: 9.sp,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (isUnread)
                                      Container(
                                        width: 8.w,
                                        height: 8.w,
                                        margin: EdgeInsets.only(top: 4.h),
                                        decoration: const BoxDecoration(
                                          color: AppColors.red,
                                          shape: BoxShape.circle,
                                        ),
                                      )
                                  ],
                                ),
                              ),
                            );
                          },
                        );
                      }
                      return _buildScrollableEmptyState(constraints, const SizedBox());
                    },
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}