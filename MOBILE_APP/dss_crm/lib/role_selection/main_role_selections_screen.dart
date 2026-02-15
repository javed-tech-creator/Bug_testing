import 'dart:math';

import 'package:dss_crm/admin/admin_location_selection_screen.dart';
import 'package:dss_crm/admin/common/admin_base_dashboard_screen.dart';
import 'package:dss_crm/auth/screen/login_screen.dart';
import 'package:dss_crm/role_selection/sub_department_selections_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';

import '../ui_helper/app_text_styles.dart';
import '../utils/custom_buttons_utils.dart';
import '../utils/responsive_helper_utils.dart';
import '../utils/storage_util.dart';

class MainRoleSelectionScreen extends StatefulWidget {
  const MainRoleSelectionScreen({super.key});

  @override
  State<MainRoleSelectionScreen> createState() => _MainRoleSelectionScreenState();
}

class _MainRoleSelectionScreenState extends State<MainRoleSelectionScreen>   with TickerProviderStateMixin {

  final List<String> roleOptions = [
    "Customer",
    "Vendor",
    "Contractor",
    // "Employee",
    "Multi Unit Factories",
    "DSS Departments",
    "Admin",
    "Super Admin",
    // "In-Direct Departments",
  ];

  final List<String> roleIcons = [
    // Icons.person_outline,
    // Icons.local_shipping_outlined,
    // Icons.badge_outlined,
    // Icons.engineering_outlined,
    // Icons.admin_panel_settings,
    // Icons.security,
    // Icons.factory_outlined,
    // Icons.apartment,
    // Icons.apartment,
    'assets/images/department/customer.png',
    'assets/images/department/vendor.png',
    'assets/images/department/contractor.png',
    'assets/images/department/factory.png',
    'assets/images/department/department.png',
    'assets/images/department/admin.png',
    'assets/images/department/superadmin.png',
  ];

  int? selectedIndex;
  late final AnimationController _controller;
  late final AnimationController _gridSlideController;
  late final Animation<Offset> _gridSlideAnimation;


  @override
  void initState() {
    _gridSlideController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );

    _gridSlideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.1),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _gridSlideController,
        curve: Curves.easeOut,
      ),
    );

    _gridSlideController.forward();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..forward();
    super.initState();
  }

  @override
  void dispose() {
    _controller.dispose();
    _gridSlideController.dispose();
    super.dispose();
  }

  void goToNextScreen() async {
    if (selectedIndex == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select a role")),
      );
      return;
    }

    final selectedRole = roleOptions[selectedIndex!];

    // Save role in shared preferences with proper formatting
    if (selectedRole == "DSS Departments") {
      // Don't save role here, let sub-department selection save it
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => SubDepartmentRoleSelectionScreen(mainRole: selectedRole),
        ),
      );
    } else if (selectedRole == "Vendor") {
      await StorageHelper().setLoginRole("vendor"); // lowercase for consistency
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => LoginScreen(),
        ),
      );
    } else if (selectedRole == "Admin") {
      await StorageHelper().setLoginRole("admin"); // lowercase for consistency
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => LoginScreen(), // Go to login first
        ),
      );
    } else if (selectedRole == "Super Admin") {
      await StorageHelper().setLoginRole("superadmin");
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => LoginScreen(),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("$selectedRole selected, no screen to open.")),
      );
    }
  }

  // Sub Department Screen - goToNextScreen() method
  // void goToNextScreen() async {
  //   if (selectedIndex == null) {
  //     ScaffoldMessenger.of(context).showSnackBar(
  //       const SnackBar(content: Text("Please select a role")),
  //     );
  //     return;
  //   }
  //
  //   final selectedRole = roleOptions[selectedIndex!];
  //
  //   // Save role in lowercase for consistency with MainDashboardManager
  //   if (selectedRole == "Sales") {
  //     await StorageHelper().setLoginRole("salehod"); // or "salestl" or "saleemployee" as needed
  //   } else if (selectedRole == "HR") {
  //     await StorageHelper().setLoginRole("hr");
  //   } else if (selectedRole == "Technology") {
  //     await StorageHelper().setLoginRole("techmanager"); // or "techlead", "techengineer", "developer"
  //   } else if (selectedRole == "Marketing") {
  //     await StorageHelper().setLoginRole("marketingmanager");
  //   } else {
  //     // For other departments, save as lowercase
  //     await StorageHelper().setLoginRole(selectedRole.toLowerCase());
  //   }
  //
  //   // Navigate to login screen
  //   Navigator.push(
  //     context,
  //     MaterialPageRoute(builder: (context) => LoginScreen()),
  //   );
  // }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    // final double horizontalSpacing = screenWidth * 0.04; // 4% of screen width
    // final double verticalSpacing = screenHeight * 0.03;  // 3% of screen height
    // final double childAspectRatio = screenWidth < 600 ? 1.3 : 1.6; // Adjust for small vs large screens

    final double horizontalSpacing = screenWidth * 0.04; // 4% of screen width
    final double verticalSpacing = screenHeight * 0.038;  // 3% of screen height
    final double childAspectRatio = screenWidth < 600 ? 0.95 : 1.6; // Adjust for small vs large screens


    // Determine if the last item needs to be centered
    final bool isOdd = roleOptions.length % 2 != 0;
    final int crossAxisCount = 2;


    return Scaffold(
      backgroundColor: AppColors.primary,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        toolbarHeight: ResponsiveHelper.containerHeight(context, 70),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // const SizedBox(height: 15),
            Text(
              "Welcome To",
              style: AppTextStyles.heading1(
                context,
                overrideStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  fontSize: 18,
                ),
              ),
            ),
            const SizedBox(height: 6),
            Center(
              child: Text(
                "3S Digital Signage Solutions Pvt. Ltd.",
                style: AppTextStyles.heading1(
                  context,
                  overrideStyle: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ),
            ),
            // const SizedBox(height: 10),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SlideTransition(
                position: _gridSlideAnimation,
                child: SingleChildScrollView(
                  // padding: const EdgeInsets.only(top: 40, bottom: 30, left: 10, right: 10),
                  padding: ResponsiveHelper.paddingOnly(context,top: 40, bottom: 30, left: 10, right: 10),
                  child: Wrap(
                    spacing: 20, // Horizontal spacing
                    runSpacing: 50, // Vertical spacing
                    alignment: WrapAlignment.center, // Centers items in the last row
                    children: List.generate(roleOptions.length, (index) {
                      return SizedBox(
                        width: (screenWidth / crossAxisCount) - 30, // Item width calculation
                        child: _buildGridItem(context, index),
                      );
                    }),
                  ),
                ),
              ),
            ),

          ],
        ),
      ),
    );
  }
  Widget _buildGridItem(BuildContext context, int index) {
    final isSelected = selectedIndex == index;

    // Modified Tween for right-to-left slide
    final animation = Tween<Offset>(
      begin: const Offset(1.0, 0.0), // Start from right
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(
          index * 0.08, // delay per item
          min(1.0, (index * 0.08) + 0.4),
          curve: Curves.easeOut,
        ),
      ),
    );

    final opacity = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(
          index * 0.08, // delay per item
          min(1.0, (index * 0.08) + 0.4),
          curve: Curves.easeOut,
        ),
      ),
    );

    return FadeTransition(
      opacity: opacity,
      child: SlideTransition(
        position: animation,
        child: GestureDetector(
          onTap: () {
            setState(() => selectedIndex = index);

            // if (roleOptions[index] == "Customer") {
            //   showModalBottomSheet(
            //     shape: const RoundedRectangleBorder(
            //       borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
            //     ),
            //     context: context,
            //     builder: (_) => Padding(
            //       padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
            //       child: Column(
            //         mainAxisSize: MainAxisSize.min,
            //         children: [
            //           ListTile(title: const Text("Retail"), onTap: () => Navigator.pop(context)),
            //           ListTile(title: const Text("Franchise"), onTap: () => Navigator.pop(context)),
            //           ListTile(title: const Text("B2B"), onTap: () => Navigator.pop(context)),
            //           ListTile(title: const Text("Freelancer"), onTap: () => Navigator.pop(context)),
            //         ],
            //       ),
            //     ),
            //   );
            // } else {
              goToNextScreen();
            // }
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            decoration: BoxDecoration(
              color: isSelected ? Colors.deepPurple.shade50 : Colors.white,
              border: Border.all(
                color: isSelected ? AppColors.primary : Colors.grey.shade300,
                width: 1.5,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: isSelected
                  ? [
                BoxShadow(
                  color: AppColors.primary.withOpacity(0.15),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ]
                  : [],
            ),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Positioned(
                  top: -20,
                  left: 0,
                  right: 0,
                  child: Align(
                    alignment: Alignment.topCenter,
                    child: Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.pink,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withAlpha(25),
                            spreadRadius: 1,
                            blurRadius: 5,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: ResponsiveHelper.circleRadius(context, 25),
                        backgroundColor: Colors.white,
                        child: Padding(
                          padding: ResponsiveHelper.paddingAll(context, 10),
                          child: Image.asset(
                            roleIcons[index],
                            // width: ResponsiveHelper.iconSize(context, 25),
                            // height: ResponsiveHelper.iconSize(context, 25),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                Center(
                  child: Padding(
                    padding: ResponsiveHelper.paddingOnly(context,top: 30),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        ResponsiveHelper.sizedBoxHeight(context, 10),
                        Text(
                          roleOptions[index],
                          textAlign: TextAlign.center,
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                              fontSize: ResponsiveHelper.fontSize(context, 12),
                            ),
                          ),
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 10),
                        SizedBox(
                          // height:ResponsiveHelper.containerHeight(context, 25),
                          child: TextButton(
                            onPressed: () {
                              if (roleOptions[index] == "DSS Departments") {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => SubDepartmentRoleSelectionScreen(mainRole: roleOptions[index]),
                                  ),
                                );
                              } else if (roleOptions[index] == "Vendor") {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => LoginScreen(),
                                  ),
                                );
                              } else if (roleOptions[index] == "Admin") {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => AdminBaseDashboardScreen(),
                                    // builder: (context) => AdminLocationSelectionScreen(),
                                  ),
                                );
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text("Login tapped for ${roleOptions[index]}")),
                                );
                              }
                            },
                            style: TextButton.styleFrom(
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              minimumSize: const Size(0, 30),
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                              ),
                            ),
                            child: Text(
                              "Login",
                              style: AppTextStyles.heading1(
                                context,
                                overrideStyle: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ),
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 10),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
