import 'package:dss_crm/sales_module/common/screen/sales_get_our__lead_list_screen.dart';
import 'package:dss_crm/sales_module/common/screen/sales_tl_hod_all_lead_list_screen.dart';
import 'package:dss_crm/sales_module/common/screen/sales_tl_hod_sales_management_sheet_list_screen.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/screen/sales_emp_all_lead_list_screen.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_employee_dashboard_screen.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_employee_lead_management_sheet_list_screen.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/screen/sales_hod_add_lead_screen.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/screen/sales_hod_lead_list_screen.dart';
import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/screen/sales_tl_reporting_view_screen.dart';
import 'package:dss_crm/sales_module/sales_tl/screen/sales_TL_lead_list_screen.dart';
import 'package:dss_crm/sales_module/sales_tl/screen/sales_TL_lead_management_sheet_list_screen.dart';
import 'package:dss_crm/sales_module/sales_tl/screen/sales_TL_pending_lead_list_screen.dart';
import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/screen/sales_tl_reporting_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:dss_crm/auth/screen/login_screen.dart';
import 'package:flutter/services.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/logout_bottom_sheet_utils.dart';
import '../../../utils/responsive_helper_utils.dart' show ResponsiveHelper;
import '../../../utils/storage_util.dart';
import '../../../utils/string_utils.dart';
import '../../raccee_module/racce_to_design_form_screen.dart';
import '../../sales_employee/sales_client_breifing/screen/sales_emp_client_briefing_list_screen.dart';
import '../../sales_hod/screen/sales_hod_dashboard_screen.dart';
import '../../sales_tl/sales_TL_dashboard_screen.dart';
import 'common_sidebar_screen.dart';

class BaseDashboardScreen extends StatefulWidget {
  final String userRole;

  const BaseDashboardScreen({super.key, required this.userRole});

  @override
  State<BaseDashboardScreen> createState() => _BaseDashboardScreenState();
}

class _BaseDashboardScreenState extends State<BaseDashboardScreen> {

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Widget? _selectedScreen;
  String selectedMenu = 'Dashboard';
  bool isDrawerOpen = true;
  String? userName = '';
  String? userEmail = '';
  String? userPhone = '';
  String? userAltPhone = '';
  String? userWhatsappPhone = '';
  String? userRole = '';

  bool _canPop = false;
  DateTime? _lastBackPressed;



  @override
  void initState() {
    super.initState();
    loadUserData();
    _selectedScreen = _getDashboardScreen(widget.userRole);
    // navigateToDashboard(context,widget.userRole);
  }

  Widget _getDashboardScreen(String role) {
    switch (role) {
      case 'SaleHOD':
        return const SalesHODDashboardScreen();
      case 'SalesTL':
        return const SalesTLDashboardScreen();
      case 'SaleEmployee':
        return const SalesEmployeeDashboardScreen();
      default:
        return const LoginScreen();
    }
  }

  void _handleMenuSelection(String title) {
    Navigator.of(context).pop(); // Close drawer
    setState(() {
      switch (title) {
      case 'Dashboard':
        // setState(() {
        //   navigateToDashboard(context, widget.userRole);
        // });
        _selectedScreen = _getDashboardScreen(widget.userRole);
        break;
      case 'LogOut':
        BottomSheetUtils.showLogoutBottomSheet(context);
        // _logout();
        break;
      case 'Add Lead':
        // setState(() => _selectedScreen = const AddSalesHODLeadScreen());
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const AddSalesHODLeadScreen(),
          ),
        );
        break;
      case 'View Lead':
        if (widget.userRole == 'SaleHOD') {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const SalesHODLeadListScreen()),
          );
        } else if (widget.userRole == 'SalesTL') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const SalesTLLeadListScreen(),
            ), // Replace with TL lead screen
          );
        } else {
          // Default lead view or error
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('View Lead not available for this role')),
          );
        }
        break;
      case 'Lead Management Sheet':
        if (widget.userRole == 'SaleEmployee') {
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const SalesEmpLeadManagementSheetListScreen(),
            ), // Replace with TL lead screen
          );
        }else if (widget.userRole == 'SalesTL') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const SalesTLLeadManagementSheetListScreen(),
            ), // Replace with TL lead screen
          );
        } else {
          // Default lead view or error
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Not available for this role')),
          );
        }

        break;
        case 'Assigned Lead':
          if (widget.userRole == 'SaleEmployee') {
            Navigator.push(
              context,
              MaterialPageRoute(
                // builder: (_) => const SalesEmployeeLeadListScreen(),
                builder: (_) => const SalesEmployeeLeadListScreen(),
              ), // Replace with TL lead screen
            );
          }
          else {
            // Default lead view or error
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Not available for this role')),
            );
          }
          break;
        case 'My Leads':
          if (widget.userRole == 'SaleEmployee') {
            Navigator.push(
              context,
              MaterialPageRoute(
                // builder: (_) => const SalesEmployeeLeadListScreen(),
                builder: (_) => const SalesGetOurLeadListScreen(),
              ), // Replace with TL lead screen
            );
          }
          else {
            // Default lead view or error
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Not available for this role')),
            );
          }
          break;
      case 'Reporting':
        if (widget.userRole == 'SaleHOD') {
          // Navigator.push(
          //   context,
          //   MaterialPageRoute(builder: (_) => const SalesHODLeadListScreen()),
          // );
        } else if (widget.userRole == 'SalesTL') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => SalesTLReportScreen(),
            ), // Replace with TL lead screen
          );
        } else if (widget.userRole == 'SaleEmployee') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => SalesTLReportScreen(),
            ), // Replace with TL lead screen
          );
        } else {
          // Default lead view or error
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('View Lead not available for this role')),
          );
        }



        break;
      case 'View Reporting':
        if (widget.userRole == 'SaleHOD') {
          // Navigator.push(
          //   context,
          //   MaterialPageRoute(builder: (_) => const SalesHODLeadListScreen()),
          // );
        } else if (widget.userRole == 'SalesTL') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => SalesReportingViewScreen(),
            ), // Replace with TL lead screen
          );
        } else if (widget.userRole == 'SaleEmployee') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => SalesReportingViewScreen(),
            ), // Replace with TL lead screen
          );
        } else {
          // Default lead view or error
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('View Lead not available for this role')),
          );
        }

        // Navigator.push(
        //   context,
        //   MaterialPageRoute(
        //     builder: (_) => SalesReportingViewScreen(),
        //   ), // Replace with TL lead screen
        // );
        break;
        case 'Sales In Form':
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => SalesTLHODLeadListScreen(),
            ), // Replace with TL lead screen
          );
          break;
        case 'Sales Management Sheet':
          if (widget.userRole == 'SaleHOD') {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => SalesTLHODSalesManagementSheetLeadListScreen(),
              ), // Replace with TL lead screen
            );
          } else if (widget.userRole == 'SalesTL') {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => SalesTLHODSalesManagementSheetLeadListScreen(),
              ), // Replace with TL lead screen
            );
          }else if (widget.userRole == 'SaleEmployee') {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => SalesTLHODSalesManagementSheetLeadListScreen(),
              ), // Replace with TL lead screen
            );
          } else {
            // Default lead view or error
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Pending Lead not available for this role')),
            );
          }

          break;
      case 'Pending Lead':
        if (widget.userRole == 'SaleHOD') {
          // Navigator.push(
          //   context,
          //   MaterialPageRoute(builder: (_) => const SalesHODLeadListScreen()),
          // );
        } else if (widget.userRole == 'SalesTL') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const SalesTLPendingLeadListScreen(),
            ), // Replace with TL lead screen
          );
        } else {
          // Default lead view or error
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Pending Lead not available for this role')),
          );
        }
        break;
      case 'Sales Client Briefing':
        if (widget.userRole == 'SaleEmployee') {
          Navigator.push(
            context,
            MaterialPageRoute(
              // builder: (_) => const SalesEmployeeLeadListScreen(),
              builder: (_) => const SalesEmployeeLeadListScreen(),
            ), // Replace with TL lead screen
          );
        }
        else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Not available for this role')),
          );
        }
        break;
      case 'View Sales Client Briefing':
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const SalesEmpClientBriefingListViewScreen(),
            ), // Replace with TL lead screen
          );
        break;

        case 'Recce to Design Form':
         if (widget.userRole == 'SaleEmployee') {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => RecceToDesignFormScreen(),
              ), // Replace with TL lead screen
            );
          } else {
            // Default lead view or error
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Pending Lead not available for this role')),
            );
          }

          break;
      default:
        setState(
          () => _selectedScreen = Center(child: Text("dummy testing ${title}")),
        );
    }
  });
  }

  void navigateToDashboard(BuildContext context, String userRole) {
    Widget screen;
    switch (userRole) {
      case 'SaleHOD':
        screen = const SalesHODDashboardScreen();
        break;
      case 'SalesTL':
        screen = const SalesTLDashboardScreen();
        break;
      default:
        screen = const SalesTLDashboardScreen(); // fallback or error screen
        break;
    }
    Navigator.push(context, MaterialPageRoute(builder: (context) => screen));
  }

  void loadUserData() async {
    userName = await StorageHelper().getLoginUserName() ?? "";
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
            IconButton(
              icon: Icon(Icons.notifications_none, color: Colors.grey[600]),
              onPressed: () {
                // Handle notifications action
              },
            ),
            IconButton(
              icon: Icon(Icons.account_circle, color: Colors.grey[600], size: 30),
              onPressed: () {
                // Handle profile action
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
                child: SidebarMenu(
                  userRole: widget.userRole,
                  userName: StringUtils.capitalizeFirstLetter(userName.toString(),),
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
