// sidebar_header.dart
import 'package:flutter/material.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../../utils/string_utils.dart';

class SidebarHeader extends StatelessWidget {
  final String userName;

  const SidebarHeader({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    return DrawerHeader(
      decoration: const BoxDecoration(color: AppColors.primary),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(5.0),
              child: Image.asset(
                "assets/images/transparent_dss_logo.png",
                fit: BoxFit.contain,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  StringUtils.capitalizeFirstLetter(userName),
                  style: AppTextStyles.heading1(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 14),
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  "View Profile",
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 14),
                      color: AppColors.blueColor,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
