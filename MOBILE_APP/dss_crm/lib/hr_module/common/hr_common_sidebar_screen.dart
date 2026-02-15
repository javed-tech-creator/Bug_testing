import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../ui_helper/theme/theme_provider.dart';
import 'hr_common_sidebar_header_screen.dart';

class HRMenuItemModel {
  final String title;
  final IconData? icon;
  final List<HRMenuItemModel>? children;

  HRMenuItemModel({required this.title, this.icon, this.children});
}

class HRSidebarMenu extends StatelessWidget {
  final String userRole;
  final String userName; //   Add this
  final Function(String) onItemSelected;

  const HRSidebarMenu({
    super.key,
    required this.userRole,
    required this.userName, //   Accept in constructor
    required this.onItemSelected,
  });

  List<HRMenuItemModel> getMenuItems() {
    final String currentUserRole = this.userRole;

    switch (currentUserRole) {
      case 'hr':
        return [
          HRMenuItemModel(title: 'Dashboard', icon: Icons.dashboard),
          HRMenuItemModel(
            title: 'Employee Recruitment',
            icon: Icons.person_add, // Updated icon
            children: [
              HRMenuItemModel(title: 'Add Employee'),
              HRMenuItemModel(title: 'View Employee'),
            ],
          ),
          HRMenuItemModel(
            title: 'Job Posting',
            icon: Icons.person_add, // Updated icon
            children: [
              HRMenuItemModel(title: 'Manage Job Opening'),
              HRMenuItemModel(title: 'Candidate Application'),
              // HRMenuItemModel(title: 'View All Job Openings'),
              // HRMenuItemModel(title: 'All Application'),
            ],
          ),
          HRMenuItemModel(
            title: 'Department Management',
            icon: Icons.business, // Updated icon
            children: [
              HRMenuItemModel(title: 'Add Department'),
            ],
          ),
          HRMenuItemModel(
            title: 'Training & Development',
            icon: Icons.school, // Updated icon
          ),
          HRMenuItemModel(
            title: 'Ratings & Performance Review',
            icon: Icons.trending_up, // Updated icon
          ),
          HRMenuItemModel(title: 'Attendance Management', icon: Icons.calendar_month), // Updated icon
          HRMenuItemModel(title: 'Leave Management', icon: Icons.flight_takeoff), // Updated icon
          HRMenuItemModel(title: 'Payroll Management', icon: Icons.monetization_on), // Updated icon
          HRMenuItemModel(title: 'KPI Management', icon: Icons.analytics), // Updated icon
          HRMenuItemModel(title: 'LogOut', icon: Icons.logout_rounded),
        ];

      default:
        return [
          HRMenuItemModel(title: 'Dashboard', icon: Icons.dashboard),
          HRMenuItemModel(title: 'LogOut', icon: Icons.logout_rounded),
        ];
    }
  }

  Widget buildIcon(IconData? iconData, BuildContext context) {
    if (iconData == null) return const SizedBox(width: 32); // space for no icon
    return Icon(
      iconData,
      // color: AppColors.whiteColor,
      color: AppColors.iconColor(context),
      size: ResponsiveHelper.iconSize(context, 15),
    );
  }

  List<Widget> buildMenuItems(
    BuildContext context,
    List<HRMenuItemModel> items,
    double indent,
  ) {
    return items.map((item) {
      final hasChildren = item.children != null && item.children!.isNotEmpty;
      final Widget leading = buildIcon(item.icon, context);

      final EdgeInsets contentPadding = EdgeInsets.only(
        left: indent,
        right: 16,
        top: 0,
        bottom: 0,
      );

      if (hasChildren) {
        return Theme(
          data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
          child: ExpansionTile(
            dense: true,
            leading: leading,
            title: buildTitleText(item.title, context),
            iconColor:AppColors.iconColor(context),
            // collapsedIconColor: Colors.white,
            collapsedIconColor: AppColors.iconColor(context),
            tilePadding: contentPadding,
            childrenPadding: EdgeInsets.only(left: indent + 8),
            children: item.children!.map((child) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 1.0),
                child: ListTile(
                  dense: true,
                  visualDensity: const VisualDensity(vertical: -3),
                  contentPadding: EdgeInsets.only(
                    // left: indent,
                    right: 16,
                  ),
                  leading: const SizedBox(width: 32),
                  title: buildTitleText(child.title, context),
                  onTap: () => onItemSelected(child.title),
                ),
              );
            }).toList(),
          ),
        );
      } else {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 2.0),
          child: ListTile(
            dense: true,
            visualDensity: const VisualDensity(vertical: -2),
            contentPadding: contentPadding,
            leading: leading,
            title: buildTitleText(item.title, context),
            onTap: () => onItemSelected(item.title),
          ),
        );
      }
    }).toList();
  }

  Text buildTitleText(String text, BuildContext context) {
    return Text(
      text,
      style: AppTextStyles.heading1(
        context,
        overrideStyle: TextStyle(
          fontSize: ResponsiveHelper.fontSize(context, 12),
          // color: Colors.white,
          color: AppColors.textPrimary(context), //   themeProvider
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {

    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    final menuItems = getMenuItems();

    return Container(
      color:  AppColors.background(context), //   background
      child: ListView(
        padding: const EdgeInsets.symmetric(vertical: 8),
        children: [
          HRSidebarHeader(userName: userName), // You can pass the dynamic userName
          ...buildMenuItems(context, menuItems, 16),
        ],
      ),
    );

    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8),
      children: buildMenuItems(context, menuItems, 16),
    );
  }
}
