import 'package:flutter/material.dart';

import '../screen/sales_hod_dashboard_screen.dart';

class MenuItemModel {
  final String title;
  final IconData icon;
  final Widget? screen;

  MenuItemModel({required this.title, required this.icon, this.screen});
}

List<MenuItemModel> getSalesHODMenu() {
  return [
    MenuItemModel(title: 'HOD Home', icon: Icons.dashboard, screen: SalesHODDashboardScreen()),
    MenuItemModel(title: 'Reports', icon: Icons.bar_chart,),
    // Add more
  ];
}
