import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/responsive_helper_utils.dart';
import 'hr_notification_model.dart';
import 'notification_service.dart';

class HRNotificationsScreen extends StatefulWidget {
  final NotificationService service;
  const HRNotificationsScreen({super.key, required this.service});

  @override
  State<HRNotificationsScreen> createState() => _HRNotificationsScreenState();
}

class _HRNotificationsScreenState extends State<HRNotificationsScreen> {
  late Future<List<NotificationItem>> _future;

  @override
  void initState() {
    super.initState();
    _future = widget.service.fetch();
  }

  Future<void> _reload() async {
    setState(() => _future = widget.service.fetch());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('Notifications', style: AppTextStyles.heading1(
          context,
          overrideStyle: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 14),
              color:  AppColors.textPrimary(context) // Name text always white
          ),
        )),
        actions: [
          TextButton(
            onPressed: () async {
              await widget.service.markAllRead();
              _reload();
            },
            child:  Text('Mark all read', style: AppTextStyles.heading1(
              context,
              overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 12),
                  color:  AppColors.textPrimary(context) // Name text always white
              ),
            ),),
          ),
        ],
      ),
      body: FutureBuilder<List<NotificationItem>>(
        future: _future,
        builder: (context, snap) {
          if (!snap.hasData) {
            return const Center(child: CircularProgressIndicator());
          }
          final items = snap.data!;
          if (items.isEmpty) {
            return const Center(
              child: Text(
                'No notifications',
                style: TextStyle(color: Colors.black87),
              ),
            );
          }

          return ListView.separated(
            itemCount: items.length,
            separatorBuilder: (_, __) =>
            const Divider(color: Colors.grey, height: 0),
            itemBuilder: (context, i) {
              final n = items[i];
              final time =
              DateFormat('dd MMM, hh:mm a').format(n.timestamp);
              return Dismissible(
                key: ValueKey(n.id),
                background: Container(
                  color: Colors.green,
                  alignment: Alignment.centerLeft,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: const Icon(Icons.done, color: Colors.white),
                ),
                direction: DismissDirection.startToEnd,
                // confirmDismiss: (_) async {
                //   await widget.service.markRead(n.id);
                //   _reload();
                //   return false; // keep in list, but marked read
                // },
                confirmDismiss: (_) async {
                  setState(() {
                    items[i] = items[i].copyWith(read: true);
                  });
                  await widget.service.markRead(n.id);
                  return false; // list me rehne do, bas read ho jaye
                },
                child: ListTile(
                  tileColor: n.read ? null : Colors.grey.shade200,
                  leading: CircleAvatar(
                    backgroundColor:
                    priorityColor(context, n.priority).withOpacity(0.15),
                    child: Icon(
                      _iconForType(n.type),
                      color: priorityColor(context, n.priority),
                    ),
                  ),
                  title: Text(
                    n.title,
                    style: TextStyle(
                      color: Colors.black87,
                      fontWeight:
                      n.read ? FontWeight.w500 : FontWeight.w700,
                    ),
                  ),
                  subtitle: Text(
                    '${n.message}\n$time',
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.black54,
                      height: 1.2,
                    ),
                  ),
                  isThreeLine: true,
                  trailing: n.read
                      ? const SizedBox()
                      : const Icon(Icons.fiber_new,
                      color: Colors.red, size: 18),
                  onTap: () async {
                    // 🔹 Pehle UI update karo
                    setState(() {
                      items[i] = items[i].copyWith(read: true);
                    });

                    // 🔹 Phir service me markRead call karo
                    await widget.service.markRead(n.id);

                    // 🔹 Agar route di gayi hai to us screen pe jao
                    if (n.route != null && n.route!.isNotEmpty) {
                      // Navigator.pushNamed(context, n.route!, arguments: n.meta);
                    }
                  },


                ),
              );
            },
          );
        },
      ),
    );
  }

  IconData _iconForType(NotificationType t) {
    switch (t) {
      case NotificationType.leaveRequest:
        return Icons.event_available;
      case NotificationType.leaveDecision:
        return Icons.assignment_turned_in;
      case NotificationType.attendanceAnomaly:
        return Icons.access_time_filled;
      case NotificationType.overtime:
        return Icons.timer;
      case NotificationType.shiftChange:
        return Icons.swap_horiz;
      case NotificationType.jobApplication:
        return Icons.person_add_alt_1;
      case NotificationType.interview:
        return Icons.mic_none;
      case NotificationType.offerDecision:
        return Icons.assignment_ind_outlined;
      case NotificationType.bgvUpdate:
        return Icons.verified_user;
      case NotificationType.kpiWindow:
        return Icons.analytics_outlined;
      case NotificationType.kpiLowAlert:
        return Icons.trending_down;
      case NotificationType.appraisalPending:
        return Icons.rate_review_outlined;
      case NotificationType.trainingDue:
        return Icons.school_outlined;
      case NotificationType.policyUpdate:
        return Icons.policy_outlined;
      case NotificationType.complianceExpiry:
        return Icons.warning_amber_outlined;
      case NotificationType.onboardingTask:
        return Icons.person_search_outlined;
      case NotificationType.probationDue:
        return Icons.flag_outlined;
      case NotificationType.exitRequest:
        return Icons.output_outlined;
      case NotificationType.birthday:
        return Icons.cake_outlined;
      case NotificationType.announcement:
        return Icons.campaign_outlined;
      case NotificationType.payroll:
        return Icons.payments_outlined;
      case NotificationType.systemAlert:
        return Icons.error_outline;
    }
  }
}
