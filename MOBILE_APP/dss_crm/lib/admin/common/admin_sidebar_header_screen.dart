import 'package:dss_crm/hr_module/screen/hr_profile/hr_profile_screen.dart';
import 'package:dss_crm/vendor_module/screen/vendor_profile/vendor_profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../../ui_helper/theme/theme_color.dart';
import '../../../ui_helper/theme/theme_provider.dart';
import '../../../ui_helper/theme/theme_switcher_button.dart';
import '../../../utils/string_utils.dart';

class AdminSidebarHeader extends StatelessWidget {
  final String userName;

  const AdminSidebarHeader({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    return DrawerHeader(
      decoration: BoxDecoration(
        color: isDark ? AppColors.whiteColor : AppColors.primary,
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: isDark ? Colors.transparent : AppColors.whiteColor,
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
                      // color: isDark ? AppColors.primary : AppColors.whiteColor, // Name text always white
                      color:  AppColors.textPrimary(context) // Name text always white
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                GestureDetector(
                  onTap:(){
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>  VendorProfileScreen(),
                      ),
                    );
                  },
                  child: Text(
                    "View Profile",
                    style: AppTextStyles.body1(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 14),
                        color: AppColors.blueColor,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 12),
          // ThemeSwitcher(),
        ],
      ),
    );
  }
}
