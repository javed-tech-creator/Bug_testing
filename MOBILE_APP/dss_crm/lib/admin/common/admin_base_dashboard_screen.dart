import 'package:dss_crm/admin/admin_dashboard_screen.dart';
import 'package:dss_crm/admin/common/admin_sidebar_screen.dart';
import 'package:dss_crm/admin/screen/contractor/screen/all_contractor_list_screen.dart';
import 'package:dss_crm/admin/screen/department/branch_department_list_screen.dart';
import 'package:dss_crm/admin/screen/franchise/screen/all_franchise_list_screen.dart';
import 'package:dss_crm/admin/screen/freelancer/screen/all_freelancer_list_screen.dart';
import 'package:dss_crm/admin/screen/partner/screen/all_partner_list_screen.dart';
import 'package:dss_crm/admin/screen/product_management/add_new_product_screen.dart';
import 'package:dss_crm/admin/screen/user_registertion/registered_user_list_screen.dart';
import 'package:dss_crm/admin/screen/vendor/screen/all_vendor_list_screen.dart';
import 'package:dss_crm/admin/screen/zone_state_lsit_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/vendor_module/screen/vendor_profile/vendor_profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/logout_bottom_sheet_utils.dart';
import '../../../../utils/responsive_helper_utils.dart' show ResponsiveHelper;
import '../../../../utils/storage_util.dart';
import '../../../../utils/string_utils.dart';

class AdminBaseDashboardScreen extends StatefulWidget {
  // final String userRole;
  // const AdminBaseDashboardScreen({super.key, required this.userRole});

  @override
  State<AdminBaseDashboardScreen> createState() =>
      _AdminBaseDashboardScreenState();
}

class _AdminBaseDashboardScreenState extends State<AdminBaseDashboardScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Widget? _selectedScreen;
  String selectedMenu = 'Admin Dashboard';
  bool _canPop = false;
  DateTime? _lastBackPressed;

  String? userName = '';
  String? userEmail = '';
  String? userPhone = '';
  String? userAltPhone = '';
  String? userWhatsappPhone = '';

  @override
  void initState() {
    super.initState();
    loadUserData();
    _selectedScreen = _getDashboardScreen();
  }

  /// Get Dashboard Screen Based on Role
  Widget _getDashboardScreen() {
    return const AdminDashboardScreen();
  }

  ///  Handle Drawer Menu Item Selection
  void _handleMenuSelection(String title) {
    Navigator.of(context).pop(); // Close drawer
    setState(() {
      switch (title) {
        case 'Dashboard':
          _selectedScreen = _getDashboardScreen();
          selectedMenu = "Dashboard";
          break;
        case 'Location Management':
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const LocationManagementScreen()),
          );
          break;
        case 'Department Management':
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const DepartmentDesignationManagementScreen(),
            ),
          );
          break;
        case 'User Management':
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AdminRegisteredUserListScreen()),
          );
          break;
        case 'Product Management':
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const ProductWorkFormScreen()),
            // MaterialPageRoute(builder: (_) => const AdminProductListScreen()),
          );
          break;
        case 'Add Vendor':
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AllVendorListAtAdminScreen()),
            // MaterialPageRoute(builder: (_) => const AdminProductListScreen()),
          );
          break;
        case 'Add Contractor':
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AllContractorListAtAdminScreen()),
            // MaterialPageRoute(builder: (_) => const AdminProductListScreen()),
          );
          break;
        case 'Add Freelancer':
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AllFreelancerListAtAdminScreen()),
            // MaterialPageRoute(builder: (_) => const AdminProductListScreen()),
          );
          break;
        case 'Add Partner':
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AllPartnerListAtAdminScreen()),
            // MaterialPageRoute(builder: (_) => const AdminProductListScreen()),
          );
          break;
        case 'Add Franchise':
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AllFranchiseListAtAdminScreen()),
            // MaterialPageRoute(builder: (_) => const AdminProductListScreen()),
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

  /// Load User Data (from storage)
  void loadUserData() async {
    userName = "Admin";
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
              icon: Icon(
                Icons.account_circle,
                color: Colors.grey[600],
                size: 30,
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => VendorProfileScreen(),
                  ),
                );
              },
            ),
            const SizedBox(width: 8),
          ],
        ),

        ///  Drawer Sidebar Based on Role
        drawer: Drawer(
          backgroundColor: AppColors.primary,
          child: Column(
            children: [
              Expanded(
                child: AdminSidebarMenu(
                  userName: StringUtils.capitalizeFirstLetter(userName ?? ""),
                  onItemSelected: _handleMenuSelection,
                ),
              ),
            ],
          ),
        ),

        ///  Correct Dashboard / Screen rendering
        body: _selectedScreen ?? const Center(child: LoadingIndicatorUtils()),
      ),
    );
  }
}
