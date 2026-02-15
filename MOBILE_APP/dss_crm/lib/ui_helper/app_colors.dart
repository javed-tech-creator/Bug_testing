import 'package:dss_crm/ui_helper/theme/theme_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AppColors {

  static const whiteColor = Color(0xFFffffff);
  static const blackColor = Color(0xFF000000);
  static const primary = Color(0xFF000000);
  static final txtGreyColor = Color(0xff575757);
  static final blueColor = Color(0xFF1E88E5);
  static final orangeColor = Color(0xFFF97316);
  static final lightBlueColor = Color(0xFFF1FBFC);
  static final lightYellowColor = Color(0xFFF9F7F4);
  static final endingGreyColor = Color(0xFFF8F8FB);
  static final lightBgColor = Color(0xFFF8F8F8);





  // ---------------------------
  // 🎯 Dynamic colors with Theme
  // ---------------------------
  static Color background(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? whiteColor : blackColor;
  }

  static Color textPrimary(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? blackColor : whiteColor;
  }

  static Color textSecondary(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? Colors.white70 : whiteColor;
  }

  static Color iconColor(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? blackColor : whiteColor;
  }
  static Color cardBackground(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? const Color(0xFF1E1E1E) : whiteColor;
  }

  static Color divider(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? Colors.grey.shade300: Colors.grey.shade800;
  }

  static Color primaryColor(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark ? blueColor : blackColor;
  }
  static Color textFieldBackground(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    return isDark
        ? const Color(0xFF2A2A2A) // Dark mode ke liye thoda dark grey
        : const Color(0xFF2A2A2A);          // Light mode ke liye halka background
  }


}
