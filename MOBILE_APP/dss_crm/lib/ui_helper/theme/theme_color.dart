import 'package:dss_crm/ui_helper/theme/theme_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_colors.dart';

class ThemeColors {
  static Color background(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? AppColors.primary : AppColors.whiteColor;
  }

  static Color text(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? AppColors.primary : AppColors.whiteColor;
  }

  static Color primary(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? AppColors.primary : AppColors.whiteColor;
  }
}
