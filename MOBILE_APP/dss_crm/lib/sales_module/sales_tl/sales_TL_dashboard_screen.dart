import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import '../../../utils/storage_util.dart';
import '../../utils/full_screen_loader_utiil.dart';
import '../common/screen/common_sidebar_screen.dart';

class SalesTLDashboardScreen extends StatefulWidget {
  const SalesTLDashboardScreen({super.key});

  @override
  State<SalesTLDashboardScreen> createState() => _SalesTLDashboardScreenState();
}

class _SalesTLDashboardScreenState extends State<SalesTLDashboardScreen> {
  String selectedMenu = 'Sales HOD Dashboard';
  bool isDrawerOpen = true;
  String? userName = '';
  String? userEmail = '';
  String? userPhone = '';
  String? userAltPhone = '';
  String? userWhatsappPhone = '';
  String? userRole = '';

  @override
  void initState() {
    super.initState();
    loadUserData();

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

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Widget buildTextOnlyWidget() {
    return Center(
      child: GestureDetector(
        onTap: (){
          FullScreenLoader.show(context, message: "Logout");
          Future.delayed(Duration(seconds: 1), () async {
            FullScreenLoader.hide(context);
          });
        },
        child: Text(
          "Sales TL Dashboard",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      key: _scaffoldKey,
      drawer: Drawer(
        backgroundColor: AppColors.primary,
        child: Column(
          children: [
            Expanded(
              child: SidebarMenu(
                userRole: userRole ?? '',
                userName: userName ?? "Guest", // ← dynamic
                onItemSelected: (selected) {
                  // Navigator.pop(context);
                  // // if (selected == 'Add Lead') {
                  // //   Navigator.push(
                  // //     context,
                  // //     MaterialPageRoute(builder: (_) => const AddSalesHODLeadScreen()),
                  // //   );
                  // // } else
                  // if (selected == 'View Lead') {
                  //   Navigator.push(
                  //     context,
                  //     MaterialPageRoute(
                  //       builder: (_) => const SalesHODLeadListScreen(),
                  //     ),
                  //   );
                  // } else if (selected == 'LogOut') {
                  //   BottomSheetUtils.showLogoutBottomSheet(context);
                  // } else {
                  //   setState(() => selectedMenu = selected);
                  // }
                },
              ),
            ),
          ],
        ),
      ),

      // appBar: AppBar(
      //   backgroundColor: Colors.white,
      //   title: Text(
      //     selectedMenu,
      //     style: AppTextStyles.heading1(
      //       context,
      //       overrideStyle: TextStyle(
      //         fontSize: ResponsiveHelper.fontSize(context, 14),
      //       ),
      //     ),
      //   ),
      //   leading: IconButton(
      //     icon: const Icon(Icons.menu, color: AppColors.primary),
      //     onPressed: () => _scaffoldKey.currentState?.openDrawer(),
      //   ),
      // ),
      body: buildTextOnlyWidget(),
    );
  }
}
