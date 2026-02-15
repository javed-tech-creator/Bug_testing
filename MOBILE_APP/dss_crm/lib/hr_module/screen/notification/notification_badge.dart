import 'package:flutter/material.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'hr_notifications_screen.dart';
import 'notification_service.dart';

class NotificationBadge extends StatefulWidget {
  final NotificationService service;
  const NotificationBadge({super.key, required this.service});

  @override
  State<NotificationBadge> createState() => _NotificationBadgeState();
}

class _NotificationBadgeState extends State<NotificationBadge> {
  int _unread = 0;

  Future<void> _refreshCount() async {
    final items = await widget.service.fetch();
    setState(() => _unread = items.where((e) => !e.read).length);
  }

  @override
  void initState() {
    super.initState();
    _refreshCount();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        IconButton(
          icon: Icon(Icons.notifications_none, color: AppColors.textPrimary(context)),
          onPressed: () async {
            await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => HRNotificationsScreen(service: widget.service),
              ),
            );
            _refreshCount();
          },
        ),
        if (_unread > 0)
          Positioned(
            right: 8,
            top: 8,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.red,
                borderRadius: BorderRadius.circular(10),
              ),
              constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
              child: Center(
                child: Text(
                  _unread.toString(),
                  style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
