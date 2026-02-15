import 'package:dss_crm/sales_module/common/controller/sales_module_common_controller.dart';
import 'package:dss_crm/sales_module/sales_employee/dashboard_api_controller.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/constants.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../utils/storage_util.dart';
import '../../ui_helper/app_text_styles.dart';
import '../sales_tl/employee/sales_tl_racce_tl_employee_list_screen.dart';

class SalesEmployeeDashboardScreen extends StatefulWidget {
  const SalesEmployeeDashboardScreen({super.key});

  @override
  State<SalesEmployeeDashboardScreen> createState() =>
      _SalesEmployeeDashboardScreenState();
}

class _SalesEmployeeDashboardScreenState
    extends State<SalesEmployeeDashboardScreen> {
  String selectedMenu = 'Sales Employee Dashboard';
  bool isDrawerOpen = true;
  String? userName = '';
  String? userEmail = '';
  String? userPhone = '';
  String? userAltPhone = '';
  String? userWhatsappPhone = '';
  String? userRole = '';

  late PageController _pageController;
  int _currentPageIndex = 0;

  // Add this list inside your _SalesEmployeeDashboardScreenState
  final List<Map<String, dynamic>> consultantList = [
    {"id": "C001", "name": "Dr. Khalid Ahmad", "totalRevenue": 5000},
    {"id": "C002", "name": "Dr. Abhishek Suryavanshi", "totalRevenue": 3200},
    {"id": "C002", "name": "Dr. Abhishek Suryavanshi", "totalRevenue": 3200},
    {"id": "C002", "name": "Dr. Abhishek Suryavanshi", "totalRevenue": 3200},
    {"id": "C002", "name": "Dr. Abhishek Suryavanshi", "totalRevenue": 3200},
  ];

  List<Map<String, dynamic>> filteredConsultants = [];

  @override
  void initState() {
    super.initState();
    loadUserData();
    _pageController = PageController();
    // Fetch the dashboard data as soon as the screen initializes
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<SalesEmpDashboardApiProvider>(
        context,
        listen: false,
      ).getSalesEmpDashboardData(context);
      Provider.of<SalesModuleCommonApiProvider>(
        context,
        listen: false,
      ).getAllEmpList(context);
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
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

  @override
  Widget build(BuildContext context) {
    // List of charts to be displayed in the PageView
    final List<Widget> chartPages = [
      _buildChartCard(
        context,
        title: 'Website View',
        description: 'Last Campaign Performance',
        chartContent: _buildBarChartPlaceholder(),
      ),
      _buildChartCard(
        context,
        title: 'Daily Sales',
        description: '15% increase in today sales',
        chartContent: _buildLineChartPlaceholder(Colors.blue),
      ),
      _buildChartCard(
        context,
        title: 'Completed Tasks',
        description: 'Last Campaign Performance',
        chartContent: _buildLineChartPlaceholder(Colors.green),
      ),
    ];

    return Scaffold(
      backgroundColor: Colors.grey[100],
      key: _scaffoldKey,
      // ... (drawer and other scaffold properties)
      body: Consumer<SalesEmpDashboardApiProvider>(
        builder: (context, provider, child) {
          // Show a loader if the API call is in progress
          if (provider.isLoading) {
            return LoadingIndicatorUtils(); // Assuming you have a FullScreenLoader widget
          }

          // Check for API errors
          // if (provider.getSalesEmployeeDashbaordDataModel?.error != null) {
          //   return Center(child: Text('Error: ${provider.getSalesEmployeeDashbaordDataModel!.error}'));
          // }

          // If data is successfully loaded, get the data object
          final dashboardData = provider.getSalesEmployeeDashbaordDataModel?.data?.data?.result;

          // If data is still null, you can show a message
          if (dashboardData == null) {
            return const Center(child: Text('No dashboard data available.'));
          }

          // Use the fetched data to build your GridView
          return SingleChildScrollView(
            padding: const EdgeInsets.all(0.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: MediaQuery.of(context).size.width > 600
                        ? 4
                        : 2,
                    childAspectRatio: 1.09,
                    mainAxisSpacing: 2.0,
                    crossAxisSpacing: 1.0,
                    children: [
                      _buildSummaryCard(
                        context,
                        title: "Total Lead",
                        value: "${dashboardData.totalLead ?? '0'}",
                        // Use API data here
                        percentage: "+55%",
                        // This seems to be a hardcoded placeholder
                        changeType: 'than last week',
                        icon: Icons.attach_money,
                        iconColor: Colors.green,
                        percentageColor: Colors.green,
                      ),
                      _buildSummaryCard(
                        context,
                        title: "This Month's Leads",
                        value: "${dashboardData.thisMonthLead ?? '0'}",
                        // Use API data here
                        percentage: "+3%",
                        changeType: 'than last month',
                        icon: Icons.person_add,
                        iconColor: Colors.blue,
                        percentageColor: Colors.green,
                      ),
                      _buildSummaryCard(
                        context,
                        title: "Pending Leads",
                        value: "${dashboardData.thisMonthPendingLead ?? '0'}",
                        // Use API data here
                        percentage: "-2%",
                        changeType: 'than yesterday',
                        icon: Icons.group,
                        iconColor: Colors.orange,
                        percentageColor: Colors.red,
                      ),
                      _buildSummaryCard(
                        context,
                        title: "Racce's Projects",
                        value: "${dashboardData.recceProjectWine ?? '0'}",
                        // Use API data here
                        percentage: "+5%",
                        changeType: 'than yesterday',
                        icon: Icons.work,
                        iconColor: Colors.purple,
                        percentageColor: Colors.green,
                      ),
                    ],
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 10),
                // ===== Consultant's Activity Section =====
                Container(
                  color: Colors.white,
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      children: [
                        ResponsiveHelper.sizedBoxHeight(context, 10),
                        Padding(
                          padding: ResponsiveHelper.paddingSymmetric(
                            context,
                            horizontal: 5,
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.person_outline, color: Colors.black87),
                              // SizedBox(width: 8),
                              ResponsiveHelper.sizedBoxWidth(context, 5),
                              Text(
                                "Employee Activity",
                                style: AppTextStyles.heading1(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      AppConstants.mainHeadingSize_14,
                                    ),
                                  ),
                                ),
                              ),
                              Spacer(),
                              Text(
                                "View all",
                                style: AppTextStyles.heading1(
                                  context,
                                  overrideStyle: TextStyle(
                                    color: Colors.orange,
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      12,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        // const SizedBox(height: 8),
                        // TextField(
                        //   decoration: InputDecoration(
                        //     hintText: 'Type to filter consultants by name',
                        //     prefixIcon: const Icon(Icons.search),
                        //     filled: true,
                        //     fillColor: Colors.white,
                        //     border: OutlineInputBorder(
                        //       borderRadius: BorderRadius.circular(8),
                        //       borderSide: BorderSide.none,
                        //     ),
                        //   ),
                        //   onChanged: (value) {
                        //     setState(() {
                        //       filteredConsultants = consultantList
                        //           .where(
                        //             (c) => c["name"].toString().toLowerCase().contains(
                        //           value.toLowerCase(),
                        //         ),
                        //       )
                        //           .toList();
                        //     });
                        //   },
                        // ),
                        // const SizedBox(height: 16),
                        ResponsiveHelper.sizedBoxHeight(context, 10),
                        Consumer<SalesModuleCommonApiProvider>(
                          builder: (context, empListProvider, child) {
                            if (empListProvider.isLoading) {
                              return LoadingIndicatorUtils();
                            }

                            final employeeList = empListProvider
                                .getAllEmployeeListModel?.data?.data?.result ?? [];

                            // Check if the list is empty
                            if (employeeList.isEmpty) {
                              return const Center(
                                child: Text('No employees found.'),
                              );
                            }

                            return Padding(
                              padding: ResponsiveHelper.paddingSymmetric(
                                  context,
                                  horizontal: 5),
                              child: GridView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                gridDelegate:
                                SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount:
                                  MediaQuery.of(context).size.width > 600
                                      ? 4
                                      : 2,
                                  childAspectRatio: 1.1,
                                  crossAxisSpacing: 0,
                                  mainAxisSpacing: 0,
                                ),
                                itemCount: employeeList.length,
                                itemBuilder: (context, index) {
                                  final employee = employeeList[index];

                                  return GestureDetector(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => EmployeeProfileScreen(
                                            name: employee.name ?? "",
                                            empId: employee.empId ?? "",
                                            totalPatients: 10,
                                            revenue: 30,
                                            paidToDoctor: 20 ?? 0.0,
                                            appointments: 500 ?? 0,
                                            invoices: 10 ?? 0,
                                          ),
                                        ),
                                      );
                                    },
                                    child: Card(
                                      color: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      elevation: 2,
                                      child: Padding(
                                        padding: ResponsiveHelper.paddingAll(
                                            context, 2),
                                        child: Column(
                                          crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                          mainAxisAlignment:
                                          MainAxisAlignment.center,
                                          children: [
                                            // Profile icon
                                            Container(
                                              height: ResponsiveHelper.containerWidth(
                                                context,
                                                45,
                                              ),
                                              width: ResponsiveHelper.containerHeight(
                                                context,
                                                45,
                                              ),
                                              decoration: const BoxDecoration(
                                                shape: BoxShape.circle,
                                                color: Color(
                                                  0xFF3F4B6E,
                                                ),
                                              ),
                                              child: ClipOval(
                                                child: Image.asset(
                                                  "assets/images/person_placeholder.png",
                                                  fit: BoxFit.contain,
                                                  color: Colors.white,
                                                ),
                                              ),
                                            ),
                                            ResponsiveHelper.sizedBoxHeight(
                                                context, 8),
                                            Center(
                                              child: Wrap(
                                                children: [
                                                  Text(
                                                    employee.name ?? "",
                                                    textAlign: TextAlign.center,
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 14,
                                                    ),
                                                    maxLines: 2,
                                                    overflow: TextOverflow.ellipsis,
                                                  ),
                                                ],
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              "ID: ${employee.empId ?? 'N/A'}",
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey,
                                              ),
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              "₹ ${employee.phoneNo ?? 0.0}",
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16,
                                                color: Colors.green,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),
                            );
                          },
                        ),

                        ResponsiveHelper.sizedBoxHeight(context, 10),
                      ],
                    ),
                  ),
                ),

                // Other widgets...
              ],
            ),
          );
        },
      ),
    );
  }

  // Helper method for Summary Cards
  Widget _buildSummaryCard(
    BuildContext context, {
    required String title,
    required String value,
    required String percentage,
    required String changeType,
    required IconData icon,
    required Color iconColor,
    required Color percentageColor,
  }) {
    return Card(
      elevation: 1,
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: iconColor, size: 28),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              title,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              value,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.txtGreyColor,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Text(
                  percentage,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: percentageColor,
                  ),
                ),
                const SizedBox(width: 4),
                Text(
                  changeType,
                  style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Helper method for Chart Cards
  Widget _buildChartCard(
    BuildContext context, {
    required String title,
    required String description,
    required Widget chartContent, // Widget for the actual chart
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.txtGreyColor,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              description,
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
            const SizedBox(height: 16),
            // Placeholder for the actual chart
            chartContent,
          ],
        ),
      ),
    );
  }

  // Placeholder for Bar Chart
  Widget _buildBarChartPlaceholder() {
    return Container(
      height: 150, // Adjust height as needed
      color: Colors.grey[200], // Background color for the chart area
      child: Center(
        child: CustomPaint(
          size: const Size(double.infinity, 150),
          painter: BarChartPainter(), // Custom painter for simple bars
        ),
      ),
    );
  }

  // Placeholder for Line Chart
  Widget _buildLineChartPlaceholder(Color lineColor) {
    return Container(
      height: 150, // Adjust height as needed
      color: Colors.grey[200], // Background color for the chart area
      child: Center(
        child: CustomPaint(
          size: const Size(double.infinity, 150),
          painter: LineChartPainter(
            lineColor,
          ), // Custom painter for a simple line
        ),
      ),
    );
  }
}

// Simple CustomPainter for a placeholder Bar Chart
class BarChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors
          .primary // Example bar color
      ..style = PaintingStyle.fill;

    final barWidth = size.width / 10; // Example: 8 bars + spacing
    final barSpacing = barWidth / 2;

    // Example bar heights (scale to size.height)
    final barHeights = [0.8, 0.4, 0.6, 0.2, 0.5, 0.9, 0.3, 0.7];
    final maxBarHeight = size.height * 0.8; // Max height to avoid touching top

    for (int i = 0; i < barHeights.length; i++) {
      final x = (i * (barWidth + barSpacing)) + barSpacing / 2;
      final barHeight = barHeights[i] * maxBarHeight;
      final rect = Rect.fromLTWH(
        x,
        size.height - barHeight,
        barWidth,
        barHeight,
      );
      canvas.drawRect(rect, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Simple CustomPainter for a placeholder Line Chart
class LineChartPainter extends CustomPainter {
  final Color lineColor;

  LineChartPainter(this.lineColor);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = lineColor
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    final points = [
      Offset(size.width * 0.05, size.height * 0.8),
      Offset(size.width * 0.2, size.height * 0.3),
      Offset(size.width * 0.35, size.height * 0.6),
      Offset(size.width * 0.5, size.height * 0.2),
      Offset(size.width * 0.65, size.height * 0.7),
      Offset(size.width * 0.8, size.height * 0.4),
      Offset(size.width * 0.95, size.height * 0.9),
    ];

    path.moveTo(points[0].dx, points[0].dy);
    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }

    canvas.drawPath(path, paint);

    // Draw circles at data points
    final circlePaint = Paint()
      ..color = lineColor
      ..style = PaintingStyle.fill;
    for (var point in points) {
      canvas.drawCircle(point, 4.0, circlePaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
