import 'package:dss_crm/auth/screen/login_screen.dart';
import 'package:dss_crm/hr_module/common/hr_common_sidebar_screen.dart';
import 'package:dss_crm/hr_module/screen/department_management_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/add_employee_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/kpi_management/hr_kpi_management_screen.dart';
import 'package:dss_crm/hr_module/screen/hr_profile/hr_profile_screen.dart';
import 'package:dss_crm/hr_module/screen/job_opening/create_job_opening_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/employee_attendance/hr_emp_attendance_log_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/hr_employee_list_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/leave_module/emp__leaves_request_list_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/training_development/hr_emp_training_and_development_screen.dart';
import 'package:dss_crm/hr_module/screen/hr_dashboard_screen.dart';
import 'package:dss_crm/hr_module/screen/job_opening/view_all_job_opening_screen.dart';
import 'package:dss_crm/splash/screen/role_base_dashboard_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_category_list_screen.dart';
import 'package:dss_crm/vendor_module/screen/vendor_dashboard_screen.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_product_management_screen.dart';
import 'package:dss_crm/vendor_module/screen/purchase_order/vendor_purchase_order_screen.dart';
import 'package:dss_crm/vendor_module/screen/vendor_profile/vendor_profile_screen.dart';
import 'package:dss_crm/vendor_module/vendor_common_sidebar_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/logout_bottom_sheet_utils.dart';
import '../../../utils/responsive_helper_utils.dart' show ResponsiveHelper;
import '../../../utils/storage_util.dart';
import '../../../utils/string_utils.dart';
import '../hr_module/screen/notification/hr_notifications_screen.dart';
import '../hr_module/screen/notification/notification_service.dart';

class VendorBaseDashboardScreen extends StatefulWidget {
  final String userRole;

  const VendorBaseDashboardScreen({super.key, required this.userRole});

  @override
  State<VendorBaseDashboardScreen> createState() => _VendorBaseDashboardScreenState();
}

class _VendorBaseDashboardScreenState extends State<VendorBaseDashboardScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Widget? _selectedScreen;
  String selectedMenu = 'Vendor Dashboard';
  bool isDrawerOpen = true;
  String? userName = '';
  String? userEmail = '';
  String? userPhone = '';
  String? userAltPhone = '';
  String? userWhatsappPhone = '';
  String? userRole = '';

  bool _canPop = false;
  DateTime? _lastBackPressed;

  final NotificationService _notificationService = NotificationService();


  @override
  void initState() {
    super.initState();
    loadUserData();
    // _selectedScreen = _getDashboardScreen(widget.userRole);
    _selectedScreen = RoleDashboardMapper.getDashboardScreen(widget.userRole);
    // navigateToDashboard(context,widget.userRole);
  }

  Widget _getDashboardScreen(String role) {
    switch (role) {
      case 'vendor':
        return const VendorDashboardScreen();
      default:
        return const LoginScreen();
    }

    return const HRDashboardScreen();
  }


  void _handleMenuSelection(String title) {
    Navigator.of(context).pop(); // Close drawer
    setState(() {
      switch (title) {
        case 'Dashboard':
          _selectedScreen = _getDashboardScreen(widget.userRole);
          // _selectedScreen = RoleDashboardMapper.getDashboardScreen(widget.userRole);
          break;
        case 'Add Product Category':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const VendorCategoryLIstScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Product Management':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const VendorProductManagementListScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Purchase Order':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const VendorPurchaseOrderManagementListScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'LogOut':
          BottomSheetUtils.showLogoutBottomSheet(context);
          // _logout();
          break;
        default:
          setState(
            () => _selectedScreen = Center(child: Text("testing ${title}")),
          );
      }
    });
  }

  void loadUserData() async {
    // userName = await StorageHelper().getLoginUserName() ?? "";
    userName = "Javed Vendor";
    userEmail = await StorageHelper().getLoginUserEmail() ?? "";
    userPhone = await StorageHelper().getLoginUserPhone() ?? "";
    userAltPhone = await StorageHelper().getLoginUserAltPhone() ?? "";
    userWhatsappPhone = await StorageHelper().getLoginUserWhatsappPhone() ?? "";
    userRole = await StorageHelper().getLoginRole() ?? "";

    setState(() {}); // Update UI
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: _canPop,
      onPopInvoked: (didPop) {
        if (didPop) return;
        final now = DateTime.now();
        if (_lastBackPressed == null ||
            now.difference(_lastBackPressed!) > const Duration(seconds: 2)) {
          _lastBackPressed = now;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Press back again to exit the app"),
              duration: Duration(seconds: 2),
            ),
          );
        } else {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        key: _scaffoldKey,
        appBar: AppBar(
          backgroundColor: Colors.white,
          title: Text(
            selectedMenu,
            style: AppTextStyles.heading1(
              context,
              overrideStyle: TextStyle(
                fontSize: ResponsiveHelper.fontSize(context, 14),
              ),
            ),
          ),
          leading: IconButton(
            icon: const Icon(Icons.menu, color: AppColors.primary),
            onPressed: () => _scaffoldKey.currentState?.openDrawer(),
          ),

          actions: [
            // 🔔 Notification Icon (badge ke sath replace kiya)
            // GestureDetector(
            //   onTap: () async {
            //     await Navigator.push(
            //       context,
            //       MaterialPageRoute(
            //         builder: (context) => HRNotificationsScreen(service: _notificationService),
            //       ),
            //     );
            //     setState(() {}); // refresh badge count
            //   },
            //   child: Padding(
            //     padding: const EdgeInsets.only(right: 12.0),
            //     child: SizedBox(
            //       width: 40,
            //       height: 40,
            //       child: Stack(
            //         clipBehavior: Clip.none,
            //         children: [
            //           const Align(
            //             alignment: Alignment.center,
            //             child: Icon(Icons.notifications_none, color: Colors.black87, size: 28),
            //           ),
            //           if (_notificationService.unreadCount > 0)
            //             Positioned(
            //               right: -2,
            //               top: -1,
            //               child: Container(
            //                 padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            //                 decoration: BoxDecoration(
            //                   color: Colors.redAccent,
            //                   borderRadius: BorderRadius.circular(12),
            //                   boxShadow: [
            //                     BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(1, 2)),
            //                   ],
            //                 ),
            //                 child: Text(
            //                   _notificationService.unreadCount.toString(),
            //                   style: const TextStyle(
            //                     color: Colors.white,
            //                     fontSize: 8,
            //                     fontWeight: FontWeight.bold,
            //                   ),
            //                 ),
            //               ),
            //             ),
            //         ],
            //       ),
            //     ),
            //   ),
            // ),
            IconButton(
              icon: Icon(
                Icons.account_circle,
                color: Colors.grey[600],
                size: 30,
              ),
              onPressed: () {
                // Handle profile action
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>  VendorProfileScreen(),
                  ),
                );
              },
            ),
            const SizedBox(width: 8),
          ],
        ),
        // appBar: AppBar(title: Text('${widget.userRole} Dashboard')),
        drawer: Drawer(
          backgroundColor: AppColors.primary,
          child: Column(
            children: [
              Expanded(
                child: VendorSidebarMenu(
                  userRole: widget.userRole,
                  userName: StringUtils.capitalizeFirstLetter(
                    userName.toString(),
                  ),
                  onItemSelected: _handleMenuSelection,
                ),
              ),
            ],
          ),
        ),
        body: _selectedScreen ?? const Center(child: LoadingIndicatorUtils()),
      ),
    );
  }
}
