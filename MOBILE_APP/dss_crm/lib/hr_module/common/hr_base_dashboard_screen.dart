import 'package:dss_crm/auth/screen/login_screen.dart';
import 'package:dss_crm/hr_module/common/hr_common_sidebar_screen.dart';
import 'package:dss_crm/hr_module/screen/candidate/screen/view_all_candidate_application_screen.dart';
import 'package:dss_crm/hr_module/screen/department_management_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/add_employee_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/kpi_management/hr_kpi_management_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/payroll/hr_payroll_management_list_screen.dart';
import 'package:dss_crm/hr_module/screen/hr_profile/hr_profile_screen.dart';
import 'package:dss_crm/hr_module/screen/job_opening/create_job_opening_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/employee_attendance/hr_emp_attendance_log_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/hr_employee_list_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/leave_module/emp__leaves_request_list_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/training_development/hr_emp_training_and_development_screen.dart';
import 'package:dss_crm/hr_module/screen/hr_dashboard_screen.dart';
import 'package:dss_crm/hr_module/screen/job_opening/view_all_job_opening_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/logout_bottom_sheet_utils.dart';
import '../../../utils/responsive_helper_utils.dart' show ResponsiveHelper;
import '../../../utils/storage_util.dart';
import '../../../utils/string_utils.dart';
import '../../main_dashboard_manager.dart';
import '../../splash/screen/role_base_dashboard_screen.dart';
import '../screen/notification/hr_notifications_screen.dart';
import '../screen/notification/notification_service.dart';

class HRBaseDashboardScreen extends StatefulWidget {
  final String userRole;

  const HRBaseDashboardScreen({super.key, required this.userRole});

  @override
  State<HRBaseDashboardScreen> createState() => _HRBaseDashboardScreenState();
}

class _HRBaseDashboardScreenState extends State<HRBaseDashboardScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Widget? _selectedScreen;
  String selectedMenu = 'HR Dashboard';
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
    _selectedScreen = _getDashboardScreen(widget.userRole);
    // navigateToDashboard(context,widget.userRole);
  }

  Widget _getDashboardScreen(String role) {
    switch (role) {
      case 'hr':
        return const HRDashboardScreen();
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
          break;
        case 'Add Employee':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const AddEmployeeScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'View Employee':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const HREmployeeListScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Manage Job Opening':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const ViewAllJobsManagementScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Candidate Application':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const ViewAllCandidateApplicationListScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Attendance Management':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const HREmployeeAttendanceUiDesign(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Training & Development':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const TrainingDevelopmentScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Leave Management':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const EmployeeLeaveRequestListScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Add Department':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const DepartmentManagementScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Payroll Management':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const PayrollManagementScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'KPI Management':
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const KpiManagementScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'LogOut':
          BottomSheetUtils.showLogoutBottomSheet(context);
          // _logout();
          break;
        case 'Reporting':
          break;
        case 'View Reporting':
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
    userName = "Priya HR";
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
            GestureDetector(
              onTap: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => HRNotificationsScreen(service: _notificationService),
                  ),
                );
                setState(() {}); // refresh badge count
              },
              child: Padding(
                padding: const EdgeInsets.only(right: 12.0),
                child: SizedBox(
                  width: 40,
                  height: 40,
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      const Align(
                        alignment: Alignment.center,
                        child: Icon(Icons.notifications_none, color: Colors.black87, size: 28),
                      ),
                      if (_notificationService.unreadCount > 0)
                        Positioned(
                          right: -2,
                          top: -1,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.redAccent,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(1, 2)),
                              ],
                            ),
                            child: Text(
                              _notificationService.unreadCount.toString(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
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
                    builder: (context) =>  HrProfilePage(),
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
                child: HRSidebarMenu(
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
