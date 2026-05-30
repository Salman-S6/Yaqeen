import 'package:flutter/material.dart';
import 'package:flutter_app/features/notifications/presentation/bloc/notification_bloc.dart';
import 'package:flutter_app/features/notifications/presentation/bloc/notification_event.dart';
import 'package:flutter_app/features/notifications/presentation/bloc/notification_state.dart';
import 'package:flutter_app/features/notifications/presentation/screens/notifications_screen.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/headers/custom_app_bar.dart';
import '../../../../core/widgets/cards_and_tiles/request_list_tile.dart';
import '../bloc/citizen_bloc.dart';
import '../bloc/citizen_event.dart';
import '../bloc/citizen_state.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import 'new_request_screen.dart';
import 'request_detail_screen.dart';

class CitizenHomeScreen extends StatefulWidget {
  const CitizenHomeScreen({super.key});

  @override
  State<CitizenHomeScreen> createState() => _CitizenHomeScreenState();
}

class _CitizenHomeScreenState extends State<CitizenHomeScreen> {
  @override
  void initState() {
    super.initState();
    _loadRequests();
    context.read<NotificationBloc>().add(LoadNotificationsEvent());
  }

  void _loadRequests() {
    context.read<CitizenBloc>().add(FetchRequestsEvent());
  }

  Future<void> _handleRefresh() async {
    _loadRequests();
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
          BlocBuilder<AuthBloc, AuthState>(
            builder: (context, authState) {
              String name = "جاري التحميل...";
              String nationalId = "---";

              if (authState is Authenticated) {
                name = "${authState.user.firstName} ${authState.user.lastName}";
                nationalId = authState.user.nationalId;
              }

              return CustomAppBar(
                title: "مرحبًا، $name 👋",
                subtitle: "مواطن — الرقم الوطني: $nationalId",
                backgroundColor: AppColors.green,
                showFlag: false,
                actions: [
                  BlocBuilder<NotificationBloc, NotificationState>(
                    builder: (context, notifState) {
                      int unread = 0;
                      if (notifState is NotificationLoaded) {
                        unread = notifState.unreadCount;
                      }

                      return Stack(
                        alignment: Alignment.center,
                        children: [
                          IconButton(
                            icon: Icon(Icons.notifications_none, color: AppColors.white, size: 24.sp),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                              ).then((_) {
                                if (mounted) {
                                  context.read<NotificationBloc>().add(LoadNotificationsEvent());
                                }
                              });
                            },
                          ),
                          if (unread > 0)
                            Positioned(
                              right: 8.w,
                              top: 8.h,
                              child: Container(
                                padding: EdgeInsets.all(4.w),
                                decoration: const BoxDecoration(
                                  color: AppColors.red,
                                  shape: BoxShape.circle,
                                ),
                                child: Text(
                                  "$unread",
                                  style: TextStyle(
                                    color: AppColors.white,
                                    fontSize: 8.sp,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                        ],
                      );
                    },
                  ),
                ],
              );
            },
          ),

          BlocBuilder<CitizenBloc, CitizenState>(
            builder: (context, state) {
              String total = "0";
              String review = "0";
              String completed = "0";

              if (state is RequestsLoaded) {
                total = state.totalCount.toString();
                review = state.pendingCount.toString();
                completed = state.completedCount.toString();
              }

              return _buildQuickStats(total, review, completed);
            },
          ),

          _buildNewRequestButton(),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
            child: Align(
              alignment: Alignment.centerRight,
              child: Text(
                "آخر الطلبات",
                style: AppTextStyles.sectionTitle.copyWith(fontSize: 12.sp),
              ),
            ),
          ),
          Expanded(
            child: RefreshIndicator(
              color: AppColors.green,
              onRefresh: _handleRefresh,
              child: BlocBuilder<CitizenBloc, CitizenState>(
                buildWhen: (previous, current) {
                  return current is CitizenLoading || current is RequestsLoaded || current is CitizenError;
                },
                builder: (context, state) {
                  return LayoutBuilder(
                    builder: (context, constraints) {
                      if (state is CitizenLoading) {
                        return _buildScrollableEmptyState(
                          constraints,
                          const CircularProgressIndicator(color: AppColors.green),
                        );
                      } else if (state is RequestsLoaded) {
                        if (state.requests.isEmpty) {
                          return _buildScrollableEmptyState(
                            constraints,
                            const Text("لا يوجد طلبات حالياً"),
                          );
                        }
                        return ListView.builder(
                          physics: const AlwaysScrollableScrollPhysics(),
                          padding: EdgeInsets.zero,
                          itemCount: state.requests.length,
                          itemBuilder: (context, index) {
                            final request = state.requests[index];
                            return RequestListTile(
                              title: request.title,
                              requestId: request.id.toString(),
                              date: request.date,
                              icon: request.icon,
                              status: request.status,
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => RequestDetailScreen(requestId: request.id.toString()),
                                  ),
                                ).then((_) {
                                  _loadRequests();
                                });
                              },
                            );
                          },
                        );
                      } else if (state is CitizenError) {
                        return _buildScrollableEmptyState(
                          constraints,
                          Text(state.message, style: const TextStyle(color: AppColors.red)),
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

  Widget _buildQuickStats(String total, String review, String completed) {
    return Container(
      width: double.infinity,
      color: AppColors.green,
      padding: EdgeInsets.fromLTRB(16.w, 0, 16.w, 16.h),
      child: Row(
        children: [
          _buildStatItem(total, "إجمالي"),
          SizedBox(width: 8.w),
          _buildStatItem(review, "مراجعة"),
          SizedBox(width: 8.w),
          _buildStatItem(completed, "مكتملة"),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 10.h),
        decoration: BoxDecoration(
          color: AppColors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(6.r),
        ),
        child: Column(
          children: [
            Text(value, style: TextStyle(color: AppColors.white, fontSize: 16.sp, fontWeight: FontWeight.w800)),
            SizedBox(height: 2.h),
            Text(label, style: TextStyle(color: AppColors.white.withOpacity(0.8), fontSize: 9.sp)),
          ],
        ),
      ),
    );
  }

  Widget _buildNewRequestButton() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const NewRequestScreen()),
          ).then((_) {
            _loadRequests();
          });
        },
        borderRadius: BorderRadius.circular(8.r),
        child: Container(
          padding: EdgeInsets.all(12.h),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(8.r),
            border: Border.all(color: AppColors.green, width: 1.5.w),
            boxShadow: [
              BoxShadow(color: AppColors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2)),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.add_circle_outline, color: AppColors.green, size: 18.sp),
              SizedBox(width: 8.w),
              Text("تقديم طلب جديد", style: AppTextStyles.bodyBold.copyWith(color: AppColors.green, fontSize: 12.sp)),
            ],
          ),
        ),
      ),
    );
  }
}