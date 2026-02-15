import 'package:dss_crm/ui_helper/theme/theme_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_colors.dart';

class ThemeSwitcher extends StatelessWidget {
  const ThemeSwitcher({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;
    return GestureDetector(
      onTap: () => themeProvider.toggleTheme(),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 400),
        transitionBuilder: (child, animation) {
          return RotationTransition(
            turns: child.key == const ValueKey("dark")
                ? Tween<double>(begin: 1, end: 0.75).animate(animation)
                : Tween<double>(begin: 0.75, end: 1).animate(animation),
            child: ScaleTransition(scale: animation, child: child),
          );
        },
        child: themeProvider.isDarkMode
            ? Icon(Icons.dark_mode, key: ValueKey("dark"), color:isDark ? AppColors.orangeColor : AppColors.primary,)
            : Icon(Icons.light_mode, key: ValueKey("light"), color: AppColors.iconColor(context)),
      ),
    );
  }
}
