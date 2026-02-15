import 'package:flutter/material.dart';

enum NotificationType {
  leaveRequest,
  leaveDecision,
  attendanceAnomaly,
  overtime,
  shiftChange,
  jobApplication,
  interview,
  offerDecision,
  bgvUpdate,
  kpiWindow,
  kpiLowAlert,
  appraisalPending,
  trainingDue,
  policyUpdate,
  complianceExpiry,
  onboardingTask,
  probationDue,
  exitRequest,
  birthday,
  announcement,
  payroll,
  systemAlert,
}

class NotificationItem {
  final String id;
  final NotificationType type;
  final String title;
  final String message;
  final DateTime timestamp;
  final int priority; // 1=High, 2=Medium, 3=Low
  final String? route; // optional: where to navigate
  final Map<String, dynamic>? meta;
   bool read;

  NotificationItem({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.timestamp,
    this.priority = 2,
    this.read = false,
    this.route,
    this.meta,
  });

  /// 🔹 copyWith method added
  NotificationItem copyWith({
    String? id,
    NotificationType? type,
    String? title,
    String? message,
    DateTime? timestamp,
    int? priority,
    bool? read,
    String? route,
    Map<String, dynamic>? meta,
  }) {
    return NotificationItem(
      id: id ?? this.id,
      type: type ?? this.type,
      title: title ?? this.title,
      message: message ?? this.message,
      timestamp: timestamp ?? this.timestamp,
      priority: priority ?? this.priority,
      read: read ?? this.read,
      route: route ?? this.route,
      meta: meta ?? this.meta,
    );
  }
}

/// Simple priority color helper
Color priorityColor(BuildContext context, int p) {
  if (p == 1) return Colors.red;
  if (p == 2) return Colors.orange;
  return Colors.blueGrey;
}
