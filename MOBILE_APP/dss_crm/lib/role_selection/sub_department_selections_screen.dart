import 'package:dss_crm/auth/screen/login_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import '../ui_helper/app_text_styles.dart';
import '../utils/responsive_helper_utils.dart';
import 'dart:math';

import '../utils/storage_util.dart'; // ✅ Add this line

class SubDepartmentRoleSelectionScreen extends StatefulWidget {
  // const SubDepartmentRoleSelectionScreen({super.key});

  final String mainRole;

  const SubDepartmentRoleSelectionScreen({Key? key, required this.mainRole})
    : super(key: key);

  @override
  State<SubDepartmentRoleSelectionScreen> createState() =>
      _SubDepartmentRoleSelectionScreenState();
}

class _SubDepartmentRoleSelectionScreenState
    extends State<SubDepartmentRoleSelectionScreen>
    with TickerProviderStateMixin {
  final List<String> roleOptions = [
    "Sales",
    "Recce",
    "Design",
    "Production",
    "Quality",
    "Installation",
    "Warehouse",
    "Service",
    "HR",
    "Account",
    "Finance",
    "Technology",
    "Marketing",
    "R&D",
  ];

  // final List<IconData> roleIcons = [
  //   Icons.trending_up,
  //   Icons.build_circle_outlined,
  //   Icons.location_searching,
  //   Icons.report_problem,
  //   Icons.design_services,
  //   Icons.shopping_cart_checkout,
  //   Icons.precision_manufacturing,
  //   Icons.verified,
  //   Icons.settings_input_component,
  //   Icons.local_shipping_outlined,
  //   Icons.miscellaneous_services,
  // ];

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
    'assets/images/department/sales.png',
    'assets/images/department/recce.png',
    'assets/images/department/design.png',
    'assets/images/department/production.png',
    'assets/images/department/qc.png',
    'assets/images/department/install.png',
    'assets/images/department/warehouse.png',
    'assets/images/department/service.png',
    'assets/images/department/hr.png',
    'assets/images/department/account.png',
    'assets/images/department/finance.png',
    'assets/images/department/tech.png',
    'assets/images/department/marketing.png',
    'assets/images/department/r&d.png',
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

    _gridSlideAnimation =
        Tween<Offset>(begin: const Offset(0, 0.1), end: Offset.zero).animate(
          CurvedAnimation(parent: _gridSlideController, curve: Curves.easeOut),
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

  void goToNextScreen() async{
    if (selectedIndex == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Please select a role")));
      return;
    }

    final selectedRole = roleOptions[selectedIndex!];
    if (selectedRole == "Sales") {
      await StorageHelper().setLoginRole("Sales");
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    } else if (selectedRole == "HR") {
      await StorageHelper().setLoginRole("HR");
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    } else if (selectedRole == "Technology") {
      await StorageHelper().setLoginRole("Technology");
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    }else if (selectedRole == "Marketing") {
      await StorageHelper().setLoginRole("Marketing");
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("$selectedRole selected, no screen to open.")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Responsive spacing based on screen width and height
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    // final double horizontalSpacing = screenWidth * 0.04; // 4% of screen width
    // final double verticalSpacing = screenHeight * 0.03;  // 3% of screen height
    // final double childAspectRatio = screenWidth < 600 ? 1.3 : 1.6; // Adjust for small vs large screens

    final double horizontalSpacing = screenWidth * 0.04; // 4% of screen width
    final double verticalSpacing = screenHeight * 0.038; // 3% of screen height
    final double childAspectRatio = screenWidth < 600
        ? 1.05
        : 1.6; // Adjust for small vs large screens

    return Scaffold(
      backgroundColor: AppColors.primary,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // const SizedBox(height: 15),
            Text(
              "DSS Internal Departments Login",
              style: AppTextStyles.heading1(
                context,
                overrideStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  fontSize: 18,
                ),
              ),
            ),
            // const SizedBox(height: 6),
            // Text(
            //   "3S Digital Signage Solutions Pvt. Ltd.",
            //   style: AppTextStyles.heading1(
            //     context,
            //     overrideStyle: const TextStyle(
            //       color: Colors.white,
            //       fontWeight: FontWeight.bold,
            //       fontSize: 18,
            //     ),
            //   ),
            // ),
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
                child: GridView.builder(
                  padding: const EdgeInsets.only(
                    top: 30,
                    bottom: 30,
                    left: 10,
                    right: 10,
                  ),
                  //   Avoid top cut
                  itemCount: roleOptions.length,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    // crossAxisCount: 2,
                    // mainAxisSpacing: 50,
                    // crossAxisSpacing: 20,
                    // childAspectRatio: 1.5,
                    crossAxisCount: screenWidth < 600 ? 3 : 3,
                    // 2 for phones, 3 for tablets
                    mainAxisSpacing: verticalSpacing,
                    crossAxisSpacing: horizontalSpacing,
                    childAspectRatio: childAspectRatio,
                  ),
                  itemBuilder: (context, index) {
                    final isSelected = selectedIndex == index;
                    final int row = index ~/ 3; // 3 columns
                    final int col = index % 3;
                    final double staggerDelay =
                        (row * 0.1) + (col * 0.05); // stagger row then col

                    // Modified Tween for right-to-left slide
                    final animation =
                        Tween<Offset>(
                          begin: const Offset(1.0, 0.0), // Start from right
                          end: Offset.zero,
                        ).animate(
                          CurvedAnimation(
                            parent: _controller,
                            curve: Interval(
                              staggerDelay,
                              min(1.0, staggerDelay + 0.4),
                              curve: Curves.easeOut,
                            ),
                          ),
                        );

                    final opacity = Tween<double>(begin: 0, end: 1).animate(
                      CurvedAnimation(
                        parent: _controller,
                        curve: Interval(
                          staggerDelay,
                          min(1.0, staggerDelay + 0.4),
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
                            Future.delayed(
                              const Duration(milliseconds: 100),
                              () {
                                goToNextScreen();
                              },
                            );
                            setState(() => selectedIndex = index);
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? Colors.deepPurple.shade50
                                  : Colors.white,
                              border: Border.all(
                                color: isSelected
                                    ? AppColors.primary
                                    : Colors.grey.shade300,
                                width: 1.5,
                              ),
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: AppColors.primary.withOpacity(
                                          0.15,
                                        ),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      ),
                                    ]
                                  : [],
                            ),
                            child: Stack(
                              clipBehavior: Clip.none,
                              children: [
                                // Main content of the grid item
                                Positioned(
                                  top: -20,
                                  // Controls how much the icon pops out (adjust as needed)
                                  left: 0,
                                  right: 0,
                                  child: Align(
                                    alignment: Alignment.topCenter,
                                    child: Container(
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Colors.pink,
                                        // background color of CircleAvatar
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withAlpha(25),
                                            spreadRadius: 1,
                                            blurRadius: 5,
                                            offset: Offset(
                                              0,
                                              1,
                                            ), // changes position of shadow
                                          ),
                                        ],
                                      ),
                                      child: CircleAvatar(
                                        radius: 25,
                                        backgroundColor: Colors.white,
                                        child: Image.asset(
                                          roleIcons[index],
                                          width: ResponsiveHelper.iconSize(
                                            context,
                                            25,
                                          ),
                                          height: ResponsiveHelper.iconSize(
                                            context,
                                            25,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                Center(
                                  child: Padding(
                                    padding: ResponsiveHelper.paddingOnly(
                                      context,
                                      top: 20,
                                    ),
                                    child: LayoutBuilder(
                                      builder: (context, constraints) {
                                        return Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.start,
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              roleOptions[index],
                                              textAlign: TextAlign.center,
                                              style: AppTextStyles.heading1(
                                                context,
                                                overrideStyle: TextStyle(
                                                  fontSize:
                                                      ResponsiveHelper.fontSize(
                                                        context,
                                                        12,
                                                      ),
                                                ),
                                              ),
                                            ),
                                            const SizedBox(height: 8),
                                            SizedBox(
                                              height: 30,
                                              child: TextButton(
                                                onPressed: () {
                                                  // ScaffoldMessenger.of(context).showSnackBar(
                                                  //   SnackBar(content: Text("Login tapped for ${roleOptions[index]}")),
                                                  // );

                                                  setState(
                                                    () => selectedIndex = index,
                                                  );
                                                  Future.delayed(
                                                    const Duration(
                                                      milliseconds: 100,
                                                    ),
                                                    () {
                                                      goToNextScreen();
                                                    },
                                                  );
                                                  // goToNextScreen();
                                                },
                                                style: TextButton.styleFrom(
                                                  padding:
                                                      const EdgeInsets.symmetric(
                                                        horizontal: 20,
                                                      ),
                                                  backgroundColor:
                                                      AppColors.primary,
                                                  foregroundColor: Colors.white,
                                                  minimumSize: Size(0, 30),
                                                  tapTargetSize:
                                                      MaterialTapTargetSize
                                                          .shrinkWrap,
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                          20,
                                                        ),
                                                  ),
                                                ),
                                                child: Text(
                                                  "Login",
                                                  style: AppTextStyles.heading1(
                                                    context,
                                                    overrideStyle:
                                                        const TextStyle(
                                                          fontWeight:
                                                              FontWeight.bold,
                                                          color: Colors.white,
                                                          fontSize: 12,
                                                        ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ],
                                        );
                                      },
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
