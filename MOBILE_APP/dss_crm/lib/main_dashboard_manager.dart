import 'package:dss_crm/admin/common/admin_base_dashboard_screen.dart';
import 'package:dss_crm/hr_module/common/hr_base_dashboard_screen.dart';
import 'package:dss_crm/marketing_module/common/marketing_base_dashboard_screen.dart';
import 'package:dss_crm/tech_module/common/tech_base_dashboard_screen.dart';
import 'package:dss_crm/vendor_module/vendor_base_dashboard_screen.dart';
import 'package:flutter/material.dart';
import '../sales_module/common/screen/base_dashboard_screen.dart';
import 'auth/screen/login_screen.dart'; // Optional fallback

class MainDashboardManager {
  static Widget getDashboardForRole(String role) {
    final normalizedRole = role.trim().toLowerCase();
    debugPrint("🎯 Dashboard Manager - Selected role: $role");
    debugPrint("🎯 Dashboard Manager - Normalized role: $normalizedRole");

    switch (normalizedRole) {
    // 🧩 ADMIN ROLES
      case 'admin':
      case 'superadmin':
      case 'super admin':
        debugPrint("✅ Navigating to Admin Dashboard");
        return AdminBaseDashboardScreen();

    // 🧩 SALES ROLES
      case 'sales':
      case 'salehod':
      case 'sale hod':
      case 'salestl':
      case 'sales tl':
      case 'saleemployee':
      case 'sale employee':
      case 'sales executive':
        debugPrint("✅ Navigating to Sales Dashboard");
        return BaseDashboardScreen(userRole: normalizedRole);

    // 🧩 VENDOR
      case 'vendor':
        debugPrint("✅ Navigating to Vendor Dashboard");
        return VendorBaseDashboardScreen(userRole: "vendor");

    // 🧩 HR ROLES
      case 'hr':
      case 'human resource':
      case 'human resources':
        debugPrint("✅ Navigating to HR Dashboard");
        return HRBaseDashboardScreen(userRole: normalizedRole);

    // 🧩 MARKETING ROLES
      case 'marketing':
      case 'marketingmanager':
      case 'marketing manager':
      case 'marketingexecutive':
      case 'marketing executive':
        debugPrint("✅ Navigating to Marketing Dashboard");
        return MarketingBaseDashboardScreen(userRole: normalizedRole);

    // 🧩 TECHNOLOGY ROLES
      case 'technology':
      case 'tech':
      case 'techmanager':
      case 'tech manager':
      case 'techlead':
      case 'tech lead':
      case 'techengineer':
      case 'tech engineer':
      case 'techemployee':
      case 'tech employee':
      case 'developer':
        debugPrint("✅ Navigating to Tech Dashboard");
        return TechBaseDashboardScreen(userRole: normalizedRole);

    // 🧩 DEFAULT / UNKNOWN ROLE
      default:
        debugPrint("❌ Unknown role: $normalizedRole - Redirecting to Login");
        return const LoginScreen();
    }
  }
}




// class MainDashboardManager {
//   static Widget getDashboardForRole(String role) {
//     // Define role-to-module mapping
//     Map<String, String> roleToModule = {
//       // Sales Module Roles
//       'Admin': 'Admin',
//       'SaleHOD': 'sales',
//       'SalesTL': 'sales',
//       'SaleEmployee': 'sales',
//       'Sales Executive': 'Sales Executive',
//       'Vendor': 'vendor',
//       'MarketingManager': 'MarketingManager',
//       'techManager': 'technology',
//       'techEngineer': 'technology',
//       'techEmployee': 'technology',
//       'techLead': 'technology',
//       'teveloper': 'technology',
//     };
//
//     String module = roleToModule[role] ?? 'sales'; // Default to sales
//
//     switch (module) {
//       case 'sales':
//         return BaseDashboardScreen(userRole: role);
//       case 'vendor':
//         return VendorBaseDashboardScreen(userRole: "vendor");
//       case 'technology':
//         return TechBaseDashboardScreen(userRole: role);
//       case 'MarketingManager':
//         return MarketingBaseDashboardScreen(userRole: role);
//       case 'Sales Executive':
//         return HRBaseDashboardScreen(userRole: role);
//       case 'Admin':
//         return AdminBaseDashboardScreen();
//       default:
//         return BaseDashboardScreen(userRole: role);
//     }
//   }
// }