import 'dart:async';

import 'hr_notification_model.dart';

class NotificationService {
  // pretend server store
  final List<NotificationItem> _items = [
    NotificationItem(
      id: '1',
      type: NotificationType.leaveRequest,
      title: 'New Leave Request',
      message: 'Alice Johnson requested Casual Leave (2 days).',
      timestamp: DateTime.now().subtract(const Duration(minutes: 12)),
      priority: 1,
      route: '/leave/requests',
    ),
    NotificationItem(
      id: '2',
      type: NotificationType.jobApplication,
      title: 'Application Received',
      message: 'Candidate: Rahul Verma for Flutter Developer.',
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      priority: 2,
      route: '/recruitment/applications',
    ),
    NotificationItem(
      id: '3',
      type: NotificationType.kpiLowAlert,
      title: 'KPI Below Threshold',
      message: 'John (Sales) KPI at 62% this month.',
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      priority: 1,
      route: '/kpi/management',
    ),
    NotificationItem(
      id: '4',
      type: NotificationType.trainingDue,
      title: 'Training Due Tomorrow',
      message: 'POSH Awareness – 24 hrs remaining.',
      timestamp: DateTime.now().subtract(const Duration(days: 2)),
      priority: 2,
      route: '/training',
    ),
    NotificationItem(
      id: '5',
      type: NotificationType.birthday,
      title: 'Birthday Today',
      message: 'Wish Priya Sharma 🎉',
      timestamp: DateTime.now().subtract(const Duration(hours: 5)),
      priority: 3,
      route: '/employees',
    ),
  ];

  Future<List<NotificationItem>> fetch() async {
    await Future.delayed(const Duration(milliseconds: 350));
    _items.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return List<NotificationItem>.from(_items);
  }

  Future<void> markRead(String id) async {
    final n = _items.firstWhere((e) => e.id == id, orElse: () => _items.first);
    n.read = true;
  }

  Future<void> markAllRead() async {
    for (final n in _items) {
      n.read = true;
    }
  }

  int get unreadCount => _items.where((e) => !e.read).length;
}
