import 'package:dss_crm/sales_module/sales_hod/lead/screen/sales_hod_lead_list_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/string_utils.dart';
import 'package:flutter/material.dart';

import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/logout_bottom_sheet_utils.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../../utils/storage_util.dart';
import '../lead/screen/sales_hod_add_lead_screen.dart';
import '../../common/screen/common_sidebar_screen.dart';

class SalesHODDashboardScreen extends StatefulWidget {
  const SalesHODDashboardScreen({super.key});

  @override
  State<SalesHODDashboardScreen> createState() =>
      _SalesHODDashboardScreenState();
}

class _SalesHODDashboardScreenState extends State<SalesHODDashboardScreen> {
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

  // Widget buildContentArea() {
  //   switch (selectedMenu) {
  //     case 'Sales HOD Dashboard':
  //       return buildDashboardContent();
  //     default:
  //       return Center(child: Text("📂 $selectedMenu"));
  //   }
  // }


  Widget buildDashboardCards() {
    final cardData = [
      {"title": "Total Leads", "value": "120", "icon": Icons.assignment},
      // {"title": "Opportunities", "value": "78", "icon": Icons.trending_up},
      // {"title": "Closed Deals", "value": "34", "icon": Icons.done_all},
      // {"title": "Revenue", "value": "₹1.5M", "icon": Icons.currency_rupee},
    ];

    return GridView.count(
      padding: const EdgeInsets.all(16),
      crossAxisCount: 2,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      children: cardData.map((item) {
        return _buildDashboardCard(
          title: item['title'].toString(),
          value: item['value'].toString(),
          iconData: item['icon'] as IconData,
        );
      }).toList(),
    );
  }

  Widget _buildDashboardCard({
    required String title,
    required String value,
    required IconData iconData,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.whiteColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.08),
            blurRadius: 10,
            spreadRadius: 2,
            offset: const Offset(2, 4),
          )
        ],
        border: Border.all(color: AppColors.primary.withOpacity(0.1)),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(iconData, size: 32, color: AppColors.primary),
          const SizedBox(height: 12),
          Text(
            title,
            style: AppTextStyles.heading1(
              context,
              overrideStyle: TextStyle(
                fontSize: ResponsiveHelper.fontSize(context, 14),
                color: AppColors.txtGreyColor,
              ),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: AppTextStyles.heading1(
              context,
              overrideStyle: TextStyle(
                fontSize: ResponsiveHelper.fontSize(context, 16),
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
          ),
        ],
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
            // DrawerHeader(
            //   decoration: const BoxDecoration(color: AppColors.primary),
            //   child: Row(
            //     children: [
            //       CircleAvatar(
            //         radius: 30,
            //         backgroundColor: Colors.white,
            //         child: Padding(
            //           padding: const EdgeInsets.all(0.0),
            //           child: Image.asset(
            //             "assets/images/transparent_dss_logo.png",
            //             fit: BoxFit.contain,
            //           ),
            //         ),
            //       ),
            //       const SizedBox(width: 12),
            //       Expanded(
            //         child: Column(
            //           mainAxisAlignment: MainAxisAlignment.center,
            //           crossAxisAlignment: CrossAxisAlignment.start,
            //           children: [
            //             Text(
            //               StringUtils.capitalizeFirstLetter(
            //                 userName.toString(),
            //               ),
            //               style: AppTextStyles.heading1(
            //                 context,
            //                 overrideStyle: TextStyle(
            //                   fontSize: ResponsiveHelper.fontSize(context, 14),
            //                   color: Colors.white,
            //                 ),
            //               ),
            //             ),
            //             SizedBox(height: 4),
            //             Text(
            //               "View Profile",
            //               style: AppTextStyles.body1(
            //                 context,
            //                 overrideStyle: TextStyle(
            //                   fontSize: ResponsiveHelper.fontSize(context, 14),
            //                   color: AppColors.blueColor,
            //                 ),
            //               ),
            //             ),
            //           ],
            //         ),
            //       ),
            //     ],
            //   ),
            // ),
            // Expanded(child: buildSidebarMenu(menuItems)),
            Expanded(
              child: SidebarMenu(
                userRole: userRole ?? '',
                userName: userName ?? "Gueste",
                onItemSelected: (selected) {
                  // Navigator.pop(context);
                  // if (selected == 'Add Lead') {
                  //   Navigator.push(
                  //     context,
                  //     MaterialPageRoute(
                  //       builder: (_) => const AddSalesHODLeadScreen(),
                  //     ),
                  //   );
                  // } else if (selected == 'View Lead') {
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
      // body: buildDashboardCards(),
      body: Center(child: Text("Sales HOD Dashboard")),
    );
  }
}
