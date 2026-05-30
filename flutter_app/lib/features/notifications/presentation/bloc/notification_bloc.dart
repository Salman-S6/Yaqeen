import 'package:flutter_bloc/flutter_bloc.dart';
import 'notification_event.dart';
import 'notification_state.dart';
import '../../data/repositories/notification_repository.dart';
import '../../data/models/notification_model.dart';

class NotificationBloc extends Bloc<NotificationEvent, NotificationState> {
  final NotificationRepository repository;

  NotificationBloc({required this.repository}) : super(NotificationInitial()) {
    on<LoadNotificationsEvent>(_onLoadNotifications);
    on<MarkAsReadEvent>(_onMarkAsRead);
  }

  Future<void> _onLoadNotifications(LoadNotificationsEvent event, Emitter<NotificationState> emit) async {
    emit(NotificationLoading());
    try {
      final response = await repository.fetchNotifications();
      emit(NotificationLoaded(
        notifications: response.notifications,
        unreadCount: response.unreadCount,
      ));
    } catch (e) {
      emit(NotificationError(e.toString()));
    }
  }

  Future<void> _onMarkAsRead(MarkAsReadEvent event, Emitter<NotificationState> emit) async {
    if (state is NotificationLoaded) {
      final currentState = state as NotificationLoaded;
      try {
        await repository.markNotificationAsRead(event.notificationId);

        final updatedList = currentState.notifications.map((n) {
          if (n.id == event.notificationId) {
            return NotificationModel(
                id: n.id,
                title: n.title,
                body: n.body,
                isRead: true,
                createdAt: n.createdAt
            );
          }
          return n;
        }).toList();

        int newUnreadCount = currentState.unreadCount - 1;
        if (newUnreadCount < 0) newUnreadCount = 0;

        emit(NotificationLoaded(notifications: updatedList, unreadCount: newUnreadCount));
      } catch (e) {
      }
    }
  }
}