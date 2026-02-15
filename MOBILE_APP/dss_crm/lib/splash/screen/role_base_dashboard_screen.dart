import 'package:dss_crm/tech_module/tech_manager/tech_manager_dashboard_screen.dart';
import 'package:flutter/material.dart';

// Import your dashboards
import 'package:dss_crm/hr_module/screen/hr_dashboard_screen.dart';
import 'package:dss_crm/vendor_module/screen/vendor_dashboard_screen.dart';
import 'package:dss_crm/auth/screen/login_screen.dart';

class RoleDashboardMapper {
  static Widget getDashboardScreen(String role) {
    final Map<String, Widget> roleScreens = {
      "hr": const HRDashboardScreen(),
      "vendor": const VendorDashboardScreen(),
      "techManager": const TechManagerDashboardScreen(),
      // yaha aur roles add karte jao
    };

    return roleScreens[role.toLowerCase()] ?? const LoginScreen();
  }
}
