import 'package:flutter/material.dart';

import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/responsive_helper_utils.dart';
import 'common_sidebar_header_screen.dart';

class MenuItemModel {
  final String title;
  final IconData? icon;
  final List<MenuItemModel>? children;

  MenuItemModel({required this.title, this.icon, this.children});
}

class SidebarMenu extends StatelessWidget {
  final String userRole;
  final String userName; //   Add this
  final Function(String) onItemSelected;

  const SidebarMenu({
    super.key,
    required this.userRole,
    required this.userName, //   Accept in constructor
    required this.onItemSelected,
  });

  List<MenuItemModel> getMenuItems() {
    final String currentUserRole = this.userRole;

    switch (currentUserRole) {
      case 'SaleHOD':
        return [
          MenuItemModel(title: 'Dashboard', icon: Icons.dashboard),
          MenuItemModel(
            title: 'Raw Lead Management',
            icon: Icons.people,
            children: [
              MenuItemModel(title: 'Add Lead'),
              MenuItemModel(title: 'View Lead'),
              MenuItemModel(title: 'Pending Lead'),
            ],
          ),
          MenuItemModel(
            title: 'Lead Management',
            icon: Icons.assignment,
            children: [
              MenuItemModel(title: 'Lead Management Sheet'),
              MenuItemModel(title: 'Reporting'),
              MenuItemModel(title: 'View Reporting'),
            ],
          ),
          // MenuItemModel(title: 'Sales Management Sheet', icon: Icons.table_chart),
          MenuItemModel(
            title: 'Performance',
            icon: Icons.show_chart,
            children: [
              MenuItemModel(title: 'Sales Target'),
              MenuItemModel(title: 'Sales Incentive'),
            ],
          ),
          MenuItemModel(
            title: 'Sales Client Briefing',
            icon: Icons.people_outline,
            children: [
              MenuItemModel(title: 'Create Sales Client Briefing'),
              MenuItemModel(title: 'View Sales Client Briefing'),
            ],
          ),
          MenuItemModel(title: 'LogOut', icon: Icons.logout_rounded),
        ];

      case 'SalesTL':
        return [
          MenuItemModel(title: 'Dashboard', icon: Icons.dashboard),
          MenuItemModel(
            title: 'Raw Lead Management',
            icon: Icons.people,
            children: [
              // 'Add Lead' is hidden for SalesTL
              MenuItemModel(title: 'Add Lead'),
              MenuItemModel(title: 'View Lead'),
              MenuItemModel(title: 'Pending Lead'),
            ],
          ),
          MenuItemModel(
            title: 'Lead Management',
            icon: Icons.assignment,
            children: [
              MenuItemModel(title: 'Lead Management Sheet'),
              MenuItemModel(title: 'Reporting'),
              MenuItemModel(title: 'View Reporting'),
            ],
          ),
          MenuItemModel(title: 'Sales In Form', icon: Icons.receipt_long),
          MenuItemModel(
            title: 'Sales Management Sheet',
            icon: Icons.table_chart,
          ),
          MenuItemModel(
            title: 'Performance',
            icon: Icons.show_chart,
            children: [
              MenuItemModel(title: 'Sales Target'),
              MenuItemModel(title: 'Sales Incentive'),
            ],
          ),
          MenuItemModel(title: 'Daily Reporting (TL)', icon: Icons.date_range),
          // MenuItemModel(
          //   title: 'Sales Client Briefing',
          //   icon: Icons.people_outline,
          //   children: [
          //     MenuItemModel(title: 'Create Sales Client Briefing'),
          //     MenuItemModel(title: 'View Sales Client Briefing'),
          //   ],
          // ),
          MenuItemModel(title: 'LogOut', icon: Icons.logout_rounded),
        ];

      case 'SaleEmployee':
        return [
          MenuItemModel(title: 'Dashboard', icon: Icons.dashboard),
          MenuItemModel(
            title: 'Raw Lead Management',
            icon: Icons.people,
            children: [
              MenuItemModel(title: 'Add Lead'),
              MenuItemModel(title: 'Assigned Lead'),
              MenuItemModel(title: 'My Leads'),
            ],
          ),
          MenuItemModel(
            title: 'Daily Reporting',
            icon: Icons.today,
            children: [
              MenuItemModel(title: 'Reporting'),
              MenuItemModel(title: 'View Reporting'),
            ],
          ),

          MenuItemModel(
            title: 'Lead Management',
            icon: Icons.assignment,
            children: [MenuItemModel(title: 'Lead Management Sheet')],
          ),

          MenuItemModel(
            title: 'Sales Management Sheet',
            icon: Icons.table_chart,
          ),
          MenuItemModel(
            title: 'Sales Client Briefing',
            icon: Icons.people_outline,
            children: [
              MenuItemModel(title: 'Sales Client Briefing'),
              MenuItemModel(title: 'View Sales Client Briefing'),
            ],
          ),

          MenuItemModel(
            title: 'Recce',
            icon: Icons.show_chart,
            children: [
              MenuItemModel(title: 'Dashboard'),
              MenuItemModel(title: 'Assigned Recce'),
              MenuItemModel(title: 'Pending Recce'),
              MenuItemModel(title: 'Recce to Design Form'),
              MenuItemModel(title: 'Recce to Design List'),
              MenuItemModel(title: 'Rejected Recce'),
              MenuItemModel(title: 'Reporting'),
              // MenuItemModel(title: 'Performance'),
              MenuItemModel(
                title: 'Performance',
                icon: Icons.show_chart,
                children: [
                  MenuItemModel(title: 'Recce Target'),
                  MenuItemModel(title: 'Recce Incentive'),
                ],
              ),
            ],
          ),
          MenuItemModel(title: 'LogOut', icon: Icons.logout_rounded),
        ];

      default:
        // Default case for any other roles or if userRole is null/empty
        return [
          MenuItemModel(title: 'Dashboard', icon: Icons.dashboard),
          MenuItemModel(title: 'LogOut', icon: Icons.logout_rounded),
        ];
    }
  }

  Widget buildIcon(IconData? iconData, BuildContext context) {
    if (iconData == null) return const SizedBox(width: 32); // space for no icon
    return Icon(
      iconData,
      color: AppColors.whiteColor,
      size: ResponsiveHelper.iconSize(context, 15),
    );
  }

  List<Widget> buildMenuItems(
    BuildContext context,
    List<MenuItemModel> items,
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
            iconColor: Colors.white,
            collapsedIconColor: Colors.white,
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
          color: Colors.white,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final menuItems = getMenuItems();

    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8),
      children: [
        SidebarHeader(userName: userName), // You can pass the dynamic userName
        ...buildMenuItems(context, menuItems, 16),
      ],
    );

    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8),
      children: buildMenuItems(context, menuItems, 16),
    );
  }
}
