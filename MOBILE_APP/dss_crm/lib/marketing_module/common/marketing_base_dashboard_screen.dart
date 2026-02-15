import 'package:dss_crm/auth/screen/login_screen.dart';
import 'package:dss_crm/marketing_module/common/marketing_common_sidebar_screen.dart';
import 'package:dss_crm/marketing_module/marketing_manager/screen/marketing_compaign_list_screen.dart';
import 'package:dss_crm/marketing_module/marketing_manager_dashboard_screen.dart';
import 'package:dss_crm/splash/screen/role_base_dashboard_screen.dart';
import 'package:dss_crm/tech_module/common/tech_common_sidebar_screen.dart';
import 'package:dss_crm/tech_module/tech_employee/screen/licence_software/tech_engineer_licence_software_list_screen.dart';
import 'package:dss_crm/tech_module/tech_employee/screen/my_assets/tech_engineer_asset_list_screen.dart';
import 'package:dss_crm/tech_module/tech_employee/screen/support/support_ticket_screen.dart';
import 'package:dss_crm/tech_module/tech_employee/screen/tech_engineer_assigned_ticket/tech_engineer_assigned_ticket_list_screen.dart';
import 'package:dss_crm/tech_module/tech_employee/tech_engineer_dashboard_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/data_security_access_controll/access_control__list_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/help_desk_and_ticketing/ticket_help_desk_list_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/it_asset_management_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/licence/licence_software_list_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/network_infrastructure/network_device__list_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/vendor_amc_management/vendor_amc__list_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/tech_manager_dashboard_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_category_list_screen.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_product_management_screen.dart';
import 'package:dss_crm/vendor_module/screen/purchase_order/vendor_purchase_order_screen.dart';
import 'package:dss_crm/vendor_module/screen/vendor_profile/vendor_profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/logout_bottom_sheet_utils.dart';
import '../../../../utils/responsive_helper_utils.dart' show ResponsiveHelper;
import '../../../../utils/storage_util.dart';
import '../../../../utils/string_utils.dart';
import '../../hr_module/screen/notification/notification_service.dart';

class MarketingBaseDashboardScreen extends StatefulWidget {
  final String userRole;

  const MarketingBaseDashboardScreen({super.key, required this.userRole});

  @override
  State<MarketingBaseDashboardScreen> createState() => _MarketingBaseDashboardScreenState();
}

class _MarketingBaseDashboardScreenState extends State<MarketingBaseDashboardScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Widget? _selectedScreen;
  String selectedMenu = 'Marketing Dashboard';
  bool _canPop = false;
  DateTime? _lastBackPressed;

  String? userName = '';
  String? userEmail = '';
  String? userPhone = '';
  String? userAltPhone = '';
  String? userWhatsappPhone = '';

  final NotificationService _notificationService = NotificationService();

  @override
  void initState() {
    super.initState();
    loadUserData();
    //    Always set dashboard screen according to role
    _selectedScreen = _getDashboardScreen(widget.userRole);
  }

  ///    Get Dashboard Screen Based on Role
  Widget _getDashboardScreen(String role) {
    switch (role) {
      case 'MarketingManager':
        return const MarketingManagerDashboardScreen();
      // case 'techEngineer':
      //   return const TechEngineerDashboardScreen();
      default:
        return const LoginScreen();
    }
  }

  ///    Handle Drawer Menu Item Selection
  void _handleMenuSelection(String title) {
    Navigator.of(context).pop(); // Close drawer
    setState(() {
      switch (title) {
        case 'Dashboard':
          _selectedScreen = _getDashboardScreen(widget.userRole);
          selectedMenu = "Dashboard";
          break;
        case 'Campaign Management':
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const MarketingCampaignListScreen()),
          );
          break;
        case 'LogOut':
          BottomSheetUtils.showLogoutBottomSheet(context);
          break;
        default:
          _selectedScreen = Center(child: Text("Selected: $title"));
      }
    });
  }

  ///    Load User Data (from storage)
  void loadUserData() async {
    userName = "Javed Tech Manager"; // Dummy
    userEmail = await StorageHelper().getLoginUserEmail() ?? "";
    userPhone = await StorageHelper().getLoginUserPhone() ?? "";
    userAltPhone = await StorageHelper().getLoginUserAltPhone() ?? "";
    userWhatsappPhone = await StorageHelper().getLoginUserWhatsappPhone() ?? "";
    setState(() {});
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
              icon: Icon(Icons.account_circle, color: Colors.grey[600], size: 30),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => VendorProfileScreen()),
                );
              },
            ),
            const SizedBox(width: 8),
          ],
        ),

        ///    Drawer Sidebar Based on Role
        drawer: Drawer(
          backgroundColor: AppColors.primary,
          child: Column(
            children: [
              Expanded(
                child: MarketingSidebarMenu(
                  userRole: widget.userRole,
                  userName: StringUtils.capitalizeFirstLetter(userName ?? ""),
                  onItemSelected: _handleMenuSelection,
                ),
              ),
            ],
          ),
        ),

        ///    Correct Dashboard / Screen rendering
        body: _selectedScreen ?? const Center(child: LoadingIndicatorUtils()),
      ),
    );
  }
}
