import 'package:dss_crm/marketing_module/common/marketing_common_sidebar_header_screen.dart';
import 'package:dss_crm/tech_module/common/tech_common_sidebar_header_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../../ui_helper/app_colors.dart';
import '../../../../../ui_helper/app_text_styles.dart';
import '../../../../../utils/responsive_helper_utils.dart';
import '../../../ui_helper/theme/theme_provider.dart';

class MarketingMenuItemModel {
  final String title;
  final IconData? icon;
  final List<MarketingMenuItemModel>? children;

  MarketingMenuItemModel({required this.title, this.icon, this.children});
}

class MarketingSidebarMenu extends StatelessWidget {
  final String userRole;
  final String userName; //   Add this
  final Function(String) onItemSelected;

  const MarketingSidebarMenu({
    super.key,
    required this.userRole,
    required this.userName, //   Accept in constructor
    required this.onItemSelected,
  });

  List<MarketingMenuItemModel> getMenuItems() {
    final String currentUserRole = this.userRole;

    switch (currentUserRole) {
      case 'MarketingManager':
        return [
          MarketingMenuItemModel(title: 'Dashboard', icon: Icons.dashboard),
          MarketingMenuItemModel(
            title: 'Campaign Management',
            icon: Icons.category, // Updated icon
          ),
          MarketingMenuItemModel(
            title: 'Lead Management',
            icon: Icons.shopping_bag, // Updated icon
          ),
          MarketingMenuItemModel(
            title: 'Marketing Analytics',
            icon: Icons.receipt_long, // Updated icon
          ),
          MarketingMenuItemModel(
            title: 'Referral & Marketing',
            icon: Icons.receipt_long, // Updated icon
          ),
          MarketingMenuItemModel(
            title: 'Brand Repository Management',
            icon: Icons.receipt_long, // Updated icon
          ),
          MarketingMenuItemModel(title: 'LogOut', icon: Icons.logout_rounded),
        ];
      default:
        return [
          MarketingMenuItemModel(title: 'Dashboard', icon: Icons.dashboard),
          MarketingMenuItemModel(title: 'LogOut', icon: Icons.logout_rounded),
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
    List<MarketingMenuItemModel> items,
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
          MarketingSidebarHeader(userName: userName), // You can pass the dynamic userName
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
