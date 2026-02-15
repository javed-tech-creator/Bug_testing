 import 'package:dss_crm/role_selection/main_role_selections_screen.dart';
  import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_colors.dart';
 import '../../main_dashboard_manager.dart';
import '../../sales_module/common/screen/base_dashboard_screen.dart';
import '../../utils/responsive_helper_utils.dart';
import '../../utils/storage_util.dart';
import '../controller/network_provider_controller.dart';
import 'NoInternetScreen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => _checkConnectivity());
  }

  void _checkConnectivity() async {
    await Future.delayed(const Duration(seconds: 1));

    bool isConnected = Provider.of<NetworkProvider>(
      context,
      listen: false,
    ).isConnected;

    if (!isConnected) {
      _navigateTo(NoInternetScreen());
      return;
    }
    final role = await StorageHelper().getLoginRole();
    final isLoggedIn =await StorageHelper().getBoolIsLoggedIn();
    final loginUserId =await StorageHelper().getLoginUserId();
    print("loginUserId: $loginUserId");
    print("role: $role");
    // if (isLoggedIn) {
    //   if (role =="SaleHOD") {
    //     _navigateTo(const SalesHODDashboardScreen());
    //   }
    //   if (role =="SalesTL") {
    //     _navigateTo(const SalesTLDashboardScreen());
    //   }
    // }else{
    //   _navigateTo(const MainRoleSelectionScreen());
    // }
    if (isLoggedIn && role != null && role.isNotEmpty) {
      // Use MainDashboardManager to get appropriate dashboard for any role/module
      Widget dashboard = MainDashboardManager.getDashboardForRole(role);
      _navigateTo(dashboard);
    } else {
      _navigateTo(const MainRoleSelectionScreen());
    }

    // _navigateTo(const MainRoleSelectionScreen());
  }

  void _navigateTo(Widget screen) {
    Navigator.of(
      context,
    ).pushReplacement(MaterialPageRoute(builder: (_) => screen));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteColor,
      body: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Center(
                child: Image.asset(
                  "assets/images/app_icon.png",
                  width: ResponsiveHelper.iconSize(context, 250),
                  height: ResponsiveHelper.iconSize(context, 250),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
