import 'package:dio/dio.dart';
import 'package:dss_crm/hr_module/common/hr_common_sidebar_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/employee_attendance/hr_emp_attendance_log_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/vendor_module/controller/vendor_api_provider.dart';
import 'package:dss_crm/vendor_module/controller/vendor_dashboard_api_provider.dart';
import 'package:dss_crm/vendor_module/data_table/vendor_home_screen_data_table_widget.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_categories_list_model.dart';
import 'package:dss_crm/vendor_module/model/dashboard/top_card_model.dart';
import 'package:dss_crm/vendor_module/screen/draft/vendor_draft_list_screen.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_category_list_screen.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_add_product_screen.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_product_management_screen.dart';
import 'package:dss_crm/vendor_module/screen/purchase_order/vendor_purchase_order_screen.dart';
import 'package:dss_crm/vendor_module/screen/vendor_customer/vendor_create_invoice_screen.dart' hide Data;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:math' as math;
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../../utils/storage_util.dart';
import 'dashboard_bar_graphs_screen_widget.dart';

class VendorDashboardScreen extends StatefulWidget {
  const VendorDashboardScreen({super.key});

  @override
  State<VendorDashboardScreen> createState() => _VendorDashboardScreenState();
}

class _VendorDashboardScreenState extends State<VendorDashboardScreen> {
  String selectedMenu = 'Vendor Dashboard';
  bool isDrawerOpen = true;
  String? userName = '';
  String? userRole = '';

  final Map<String, int> _attendanceStats = {
    'Paid': 3,
    'Pending': 1,
    'Partial': 1,
    // 'Total': 5,
  };
  final List<Map<String, String>> _upcomingEvents = [
    {'name': 'Rohan Sharma', 'event': 'Birthday', 'date': 'Aug 20'},
    {'name': 'Priya Singh', 'event': 'Anniversary', 'date': 'Aug 25'},
    {'name': 'Amit Verma', 'event': 'Birthday', 'date': 'Sep 02'},
  ];
  final List<Map<String, dynamic>> _hiringFunnel = [
    {'title': 'Applicants', 'count': 50, 'color': Colors.blue},
    {'title': 'Screening', 'count': 25, 'color': Colors.orange},
    {'title': 'Interview', 'count': 10, 'color': Colors.yellow},
    {'title': 'Offer Extended', 'count': 3, 'color': Colors.purple},
  ];
  final List<String> _notifications = [
    'Payroll deadline is August 25th.',
    'New company policy on remote work.',
    'Reminder: Q3 performance reviews due.',
  ];
  int _currentOrderPage = 1;
  final int _ordersPerPage = 10;

  @override
  void initState() {
    super.initState();
    loadUserData();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<VendorDashboardApiProvider>(
        context,
        listen: false,
      ).getVendorDashboardData(context);
      Provider.of<VendorDashboardApiProvider>(
        context,
        listen: false,
      ).getVendorDashboardChartData(context);
      Provider.of<VendorModuleApiProvider>(
        context,
        listen: false,
      ).getAllVendorCategoryList(context);
      Provider.of<VendorDashboardApiProvider>(
        context,
        listen: false,
      ).getAllVendorRecentOrderList(context, _currentOrderPage, _ordersPerPage);
    });
  }

  void loadUserData() async {
    userName = await StorageHelper().getLoginUserName() ?? "Ashish Kumar";
    userRole = await StorageHelper().getLoginRole() ?? "";
    setState(() {});
  }

  // The new, updated method to fetch dashboard data.
  Future<void> _fetchTopCardData() async {
    final apiProvider = Provider.of<VendorDashboardApiProvider>(
      context,
      listen: false,
    );
    apiProvider.getVendorDashboardData(context);
  }

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Map<String, dynamic> _getCategoryStyle(String categoryName) {
    final Map<String, Map<String, dynamic>> categoryStyles = {
      'strip light': {'icon': Icons.lightbulb_outline, 'color': Colors.amber},
      'wire': {'icon': Icons.cable, 'color': Colors.blue},
      'module': {'icon': Icons.memory, 'color': Colors.green},
      'silicon': {'icon': Icons.science, 'color': Colors.purple},
      'glue': {'icon': Icons.format_paint, 'color': Colors.orange},
      'double tape': {'icon': Icons.content_cut, 'color': Colors.red},
      'blockout tape': {'icon': Icons.block, 'color': Colors.grey},
      'power supply': {'icon': Icons.power, 'color': Colors.indigo},
      'adapter': {'icon': Icons.power_settings_new, 'color': Colors.teal},
      'neon light': {'icon': Icons.wb_incandescent, 'color': Colors.pink},
      // Add more categories for common cases
      'led': {'icon': Icons.lightbulb, 'color': Colors.yellow},
      'controller': {'icon': Icons.control_camera, 'color': Colors.deepPurple},
      'battery': {'icon': Icons.battery_full, 'color': Colors.green},
      'sensor': {'icon': Icons.sensors, 'color': Colors.orange},
      'display': {'icon': Icons.monitor, 'color': Colors.blue},
      'connector': {
        'icon': Icons.settings_input_component,
        'color': Colors.brown,
      },
      'resistor': {'icon': Icons.electrical_services, 'color': Colors.red},
      'capacitor': {'icon': Icons.circle, 'color': Colors.purple},
      'switch': {'icon': Icons.toggle_on, 'color': Colors.teal},
      'relay': {'icon': Icons.sync_alt, 'color': Colors.indigo},
      'circuit': {'icon': Icons.account_tree, 'color': Colors.cyan},
      'board': {'icon': Icons.developer_board, 'color': Colors.brown},
      'chip': {'icon': Icons.memory, 'color': Colors.blueGrey},
      'cable': {'icon': Icons.cable, 'color': Colors.grey},
      'tool': {'icon': Icons.build, 'color': Colors.orange},
      'part': {'icon': Icons.extension, 'color': Colors.purple},
    };

    String key = categoryName.toLowerCase();

    // First try exact match
    if (categoryStyles.containsKey(key)) {
      return categoryStyles[key]!;
    }
    // Then try partial matches for better coverage
    for (String styleKey in categoryStyles.keys) {
      if (key.contains(styleKey) || styleKey.contains(key)) {
        return categoryStyles[styleKey]!;
      }
    }

    // If no match found, generate consistent style based on category name
    final List<IconData> defaultIcons = [
      Icons.category,
      Icons.inventory_2,
      Icons.shopping_bag,
      Icons.build_circle,
      Icons.precision_manufacturing,
      Icons.construction,
      Icons.handyman,
      Icons.hardware,
      Icons.settings_applications,
      Icons.widgets,
    ];

    final List<Color> defaultColors = [
      Colors.blue,
      Colors.green,
      Colors.orange,
      Colors.purple,
      Colors.red,
      Colors.teal,
      Colors.indigo,
      Colors.pink,
      Colors.brown,
      Colors.cyan,
    ];

    // Generate consistent hash-based selection
    int hash = categoryName.hashCode;
    int iconIndex = hash.abs() % defaultIcons.length;
    int colorIndex = hash.abs() % defaultColors.length;

    return {
      'icon': defaultIcons[iconIndex],
      'color': defaultColors[colorIndex],
    };

    // return categoryStyles[key] ??
    //     {'icon': Icons.category, 'color': Colors.blue};
  }



  // Add this method to build the category grid section
  Widget _buildCategoryGridSection() {
    return Consumer<VendorModuleApiProvider>(
      builder: (context, apiProvider, child) {
        final categoryData =
            apiProvider.getVendorCategoryListModelResponse?.data;
        final bool isLoading = apiProvider.isLoading;

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Product Categories',
                    style: AppTextStyles.heading1(
                      context,
                      overrideStyle: const TextStyle(fontSize: 16),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              if (isLoading)
                _buildCategoryLoadingSkeleton()
              else if (categoryData == null)
                _buildNoCategoriesWidget()
              else
                _buildCategoryGrid(categoryData.data ?? []),
            ],
          ),
        );
      },
    );
  }

  // Build the actual category grid
  Widget _buildCategoryGrid(List<Data> categories) {
    // Show maximum 6 categories in grid (2x3)
    final displayCategories = categories.toList();

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      // gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
      //   crossAxisCount: 2,
      //   childAspectRatio: 1.2,
      //   crossAxisSpacing: 12,
      //   mainAxisSpacing: 12,
      // ),
      itemCount: displayCategories.length,
      itemBuilder: (context, index) {
        return _buildGridCategoryItem(displayCategories[index]);
      },
    );
  }

  // Loading skeleton for categories
  Widget _buildCategoryLoadingSkeleton() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 1.2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: 6,
      // Show 6 skeleton items
      itemBuilder: (context, index) {
        return _buildSkeletonCategoryItem();
      },
    );
  }

  // Skeleton item for loading state
  Widget _buildSkeletonCategoryItem() {
    return Card(
      elevation: 2,
      shadowColor: Colors.black.withAlpha(30),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: ResponsiveHelper.paddingAll(context, 14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: Colors.grey.shade100,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ],
            ),
            ResponsiveHelper.sizedBoxHeight(context, 12),
            Container(
              width: double.infinity,
              height: 16,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            const SizedBox(height: 8),
            Container(
              width: 60,
              height: 14,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // No categories widget
  Widget _buildNoCategoriesWidget() {
    return Center(
      child: Column(
        children: [
          Icon(Icons.category_outlined, size: 48, color: Colors.grey.shade400),
          const SizedBox(height: 12),
          Text(
            'No Categories Available',
            style: AppTextStyles.heading2(
              context,
              overrideStyle: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 16,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Categories will appear here once they are added.',
            style: AppTextStyles.body1(
              context,
              overrideStyle: TextStyle(
                color: Colors.grey.shade500,
                fontSize: 12,
              ),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildGridCategoryItem(Data category) {
    final style = _getCategoryStyle(category.categoryName ?? '');

    return Card(
      elevation: 0,
      shadowColor: Colors.black.withOpacity(0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 0),
      child: InkWell(
        onTap: () {
          print("Selected ${category.categoryName}");
          // Add your navigation or detail screen logic here
        },
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            // Use a background pattern image
            color: Colors.white.withOpacity(0.2),
            image: const DecorationImage(
              image: AssetImage('assets/images/img_pattern2.jpg'), // Replace with your image path
              fit: BoxFit.cover, // Adjust the fit as needed
              opacity: 0.4, // Set opacity for a subtle effect
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              // Icon and background circle
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  // Remove gradient, use a solid color
                  color: style['color'].withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(style['icon'], color: style['color'], size: 24),
              ),
              const SizedBox(width: 16),
              // Title and subtitle
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      category.categoryName ?? 'Unknown',
                      style: AppTextStyles.heading1(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 14),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "${category.productCount ?? 'N/A'} Products",
                      style: AppTextStyles.body1(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 12),
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Trailing icon
              Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: Colors.grey.shade500,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _refreshDashboard() async {
    try {
      // Show loading state if needed
      final apiProvider = Provider.of<VendorDashboardApiProvider>(
        context,
        listen: false,
      );
      final vendorApiProvider = Provider.of<VendorModuleApiProvider>(
        context,
        listen: false,
      );

      // Refresh all dashboard data
      await Future.wait([
        apiProvider.getVendorDashboardData(context),
        apiProvider.getVendorDashboardChartData(context),
        vendorApiProvider.getAllVendorCategoryList(context),
        apiProvider.getAllVendorRecentOrderList(context, 1, _ordersPerPage), // Reset to first page
      ]);

      // Reset current page to 1 after refresh
      setState(() {
        _currentOrderPage = 1;
      });

    } catch (e) {
      // Handle error - you might want to show a snackbar or toast
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to refresh dashboard: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    bool isTablet = ResponsiveHelper.isTablet(context);

    return Scaffold(
      backgroundColor: AppColors.lightBgColor,
      key: _scaffoldKey,
      drawer: Drawer(
        backgroundColor: AppColors.primary,
        child: Column(
          children: [
            Expanded(
              child: HRSidebarMenu(
                userRole: userRole ?? '',
                userName: userName ?? "Gueste",
                onItemSelected: (selected) {},
              ),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child:  RefreshIndicator(
          onRefresh: _refreshDashboard, // This is the key fix
          color: AppColors.primary,
          backgroundColor: Colors.white,
          strokeWidth: 2.0,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // _buildHeader(isTablet),
                // const SizedBox(height: 20),
                _buildMobileLayout(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUpcomingEvents() {
    return Column(
      children: _upcomingEvents.map((event) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            children: [
              const Icon(Icons.event, color: AppColors.primary, size: 20),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      event['name']!,
                      style: AppTextStyles.heading1(
                        context,
                        overrideStyle: const TextStyle(fontSize: 14),
                      ),
                    ),
                    Text(
                      '${event['event']!} on ${event['date']!}',
                      style: AppTextStyles.body1(
                        context,
                        overrideStyle: const TextStyle(fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildNotifications() {

    // Sample data for the chart
    final List<MonthlySalesData> salesData = [
      MonthlySalesData(month: "Jan 2025", sales: 12000),
      MonthlySalesData(month: "Feb 2025", sales: 18000),
      MonthlySalesData(month: "Mar 2025", sales: 15000),
      MonthlySalesData(month: "Apr 2025", sales: 25000),
      MonthlySalesData(month: "May 2025", sales: 11000),
      MonthlySalesData(month: "June 2025", sales: 13000),
    ];

    double maxSalesValue = salesData
        .map((e) => e.sales)
        .reduce((a, b) => a > b ? a : b) +
        5000; // Adding a buffer
    maxSalesValue = (maxSalesValue / 5000).ceil() * 5000; // Round up to nearest 5000 for clean axis

    return  MonthlySalesBarChart(
      title: 'Monthly Sales',
      salesData: salesData,
      maxYValue: maxSalesValue,
      gradientStartColor: const Color(0xFF64B5F6), // Optional: customize colors
      gradientEndColor: const Color(0xFF1E88E5),
    );
  }

  // Sample data based on your image
  final List<TableRowData> productInventoryData = [
    TableRowData({
      'productCode': 'PRO-041',
      'productName': 'Strip Light (WW) 5mm',
      'brand': 'Generic',
      'unitType': 'pcs',
      'size': 'Medium',
      'totalStock': '426',
      'usedStock': '184',
      'inStock': '242',
      'rate': '327.47',
      'gst': '12',
      'category': 'Strip Light',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Strip Light (WW) 5mm - Premium quality strip light for signage and lighting',
    }),
    TableRowData({
      'productCode': 'PRO-040',
      'productName': 'Strip Light (W) 5mm',
      'brand': 'Generic',
      'unitType': 'pcs',
      'size': 'Large',
      'totalStock': '210',
      'usedStock': '10',
      'inStock': '200',
      'rate': '303.29',
      'gst': '12',
      'category': 'Strip Light',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Strip Light (W) 5mm - Premium quality strip light for signage and lighting',
    }),
    TableRowData({
      'productCode': 'PRO-042',
      'productName': 'Strip Light (W) 4mm',
      'brand': 'Philips',
      'unitType': 'pcs',
      'size': 'Small',
      'totalStock': '156',
      'usedStock': '5',
      'inStock': '151',
      'rate': '365.72',
      'gst': '12',
      'category': 'Strip Light',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Strip Light (W) 4mm - Premium quality strip light for signage and lighting',
    }),
    TableRowData({
      'productCode': 'PRO-038',
      'productName': 'Mini Module (White) 0.72W',
      'brand': 'Generic',
      'unitType': 'pcs',
      'size': 'Slim',
      'totalStock': '378',
      'usedStock': '0',
      'inStock': '378',
      'rate': '226.81',
      'gst': '12',
      'category': 'Module',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Mini Module (White) 0.72W - Premium quality module for signage and lighting',
    }),
    TableRowData({
      'productCode': 'PRO-039',
      'productName': 'Mini Module (WW) 0.72W',
      'brand': 'Syska',
      'unitType': 'pcs',
      'size': 'Standard',
      'totalStock': '75',
      'usedStock': '5',
      'inStock': '70',
      'rate': '294.64',
      'gst': '12',
      'category': 'Module',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Mini Module (WW) 0.72W - Premium quality module for signage and lighting',
    }),
    TableRowData({
      'productCode': 'PRO-043',
      'productName': 'Strip Light (Straight)',
      'brand': 'Syska',
      'unitType': 'pcs',
      'size': 'Slim',
      'totalStock': '48',
      'usedStock': '0',
      'inStock': '48',
      'rate': '474.86',
      'gst': '12',
      'category': 'Strip Light',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Strip Light (Straight) - Premium quality strip light for signage and lighting',
    }),
    TableRowData({
      'productCode': 'PRO-037',
      'productName': 'Module (Pink) 1.5W',
      'brand': 'Syska',
      'unitType': 'pcs',
      'size': 'Large',
      'totalStock': '214',
      'usedStock': '0',
      'inStock': '214',
      'rate': '248.03',
      'gst': '12',
      'category': 'Module',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Module (Pink) 1.5W - Premium quality module for signage and lighting',
    }),
    TableRowData({
      'productCode': 'PRO-035',
      'productName': 'Module (Green) 1.5W',
      'brand': 'Osram',
      'unitType': 'pcs',
      'size': 'Slim',
      'totalStock': '123',
      'usedStock': '0',
      'inStock': '123',
      'rate': '156.23',
      'gst': '12',
      'category': 'Module',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Module (Green) 1.5W - Premium quality module for signage and lighting',
    }),
    TableRowData({
      'productCode': 'PRO-033',
      'productName': 'Module (Red) 1.5W',
      'brand': 'Osram',
      'unitType': 'pcs',
      'size': 'Small',
      'totalStock': '138',
      'usedStock': '0',
      'inStock': '138',
      'rate': '112.85',
      'gst': '12',
      'category': 'Module',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Module (Red) 1.5W - Premium quality module for signage and lighting',
    }),
    TableRowData({
      'productCode': 'PRO-036',
      'productName': 'Module (Yellow) 1.5W',
      'brand': 'Generic',
      'unitType': 'pcs',
      'size': 'Big',
      'totalStock': '149',
      'usedStock': '0',
      'inStock': '149',
      'rate': '295.49',
      'gst': '12',
      'category': 'Module',
      'createdAt': '16 Aug 2025\n11:46:59 AM',
      'description':
          'Module (Yellow) 1.5W - Premium quality module for signage and lighting',
    }),
  ];

  // Column configuration matching your image
  final List<TableColumnConfig> productInventoryColumns = [
    TableColumnConfig(
      key: 'productCode',
      title: 'PRODUCT CODE',
      width: 90,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'productName',
      title: 'PRODUCT NAME',
      width: 180,
      sortable: true,
      textAlign: TextAlign.left,
    ),
    TableColumnConfig(
      key: 'brand',
      title: 'BRAND',
      width: 80,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'unitType',
      title: 'UNIT TYPE',
      width: 60,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'size',
      title: 'SIZE',
      width: 80,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'totalStock',
      title: 'TOTAL STOCK',
      width: 90,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'usedStock',
      title: 'USED STOCK',
      width: 90,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'inStock',
      title: 'IN STOCK',
      width: 80,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'rate',
      title: 'RATE UNIT',
      width: 80,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'gst',
      title: 'GST (%)',
      width: 60,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'category',
      title: 'CATEGORY',
      width: 100,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'createdAt',
      title: 'CREATED AT',
      width: 120,
      sortable: true,
      textAlign: TextAlign.center,
    ),
    TableColumnConfig(
      key: 'description',
      title: 'DESCRIPTION',
      width: 250,
      sortable: false,
      textAlign: TextAlign.left,
    ),
  ];

  Widget _buildRecentOrdersSection() {
    return Consumer<VendorDashboardApiProvider>(
      builder: (context, apiProvider, child) {
        final recentOrdersData =
            apiProvider.getVendorDashboardRecentOrderModelResponse?.data?.data;
        final bool isLoading = apiProvider.isLoading ?? false;
        final int totalItems =
            apiProvider
                .getVendorDashboardRecentOrderModelResponse
                ?.data
                ?.total ??
            0;
        final int totalPages = (totalItems / _ordersPerPage).ceil();

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Recent Orders',
                    style: AppTextStyles.heading1(
                      context,
                      overrideStyle: const TextStyle(fontSize: 16),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Loading State
              if (isLoading)
                _buildOrdersLoadingSkeleton()
              // No Data State
              else if (recentOrdersData == null || recentOrdersData.isEmpty)
                _buildNoOrdersWidget()
              // Data Available
              else ...[
                // Orders Cards
                ...recentOrdersData
                    .map((order) => _buildOrderCardFromApi(order))
                    .toList(),

                const SizedBox(height: 16),
                _buildPagination(totalPages),
              ],
            ],
          ),
        );
      },
    );
  }

  // Build order card from API data
  Widget _buildOrderCardFromApi(dynamic order) {
    // Map your API response fields to the display format
    final billNumber = order?.invoiceId ?? 'N/A';
    final customerName = order?.customerName ?? '';
    final customerPhone = order?.customerPhone ?? '';
    final date = order?.createdAt ?? '';
    final amount = '₹${order?.grandTotal?.toString() ?? '0'}';
    final status = order?.paymentStatus ?? 'Pending';
    final mode = order?.paymentMode ?? 'Pending';
    final amountPaid = order?.amountPaid ?? 0;
    final grandTotal = order?.grandTotal ?? 0;
    final pendingAmount = grandTotal - amountPaid;

    Color statusColor = _getStatusColor(status);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        children: [
          // Header Row with Bill# and Status
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                billNumber,
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 14),
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: statusColor.withOpacity(0.3)),
                ),
                child: Text(
                  status,
                  style: AppTextStyles.body2(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 11),
                      color: statusColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Customer Info Row
          if (customerName.isNotEmpty) ...[
            Row(
              children: [
                Icon(
                  Icons.person_outline,
                  size: ResponsiveHelper.iconSize(context, 16),
                  color: Colors.grey.shade600,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        customerName,
                        style: AppTextStyles.heading2(
                          context,
                          overrideStyle: TextStyle(
                            fontSize: ResponsiveHelper.fontSize(context, 13),
                          ),
                        ),
                      ),
                      if (customerPhone.isNotEmpty)
                        Text(
                          customerPhone,
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: TextStyle(
                              fontSize: ResponsiveHelper.fontSize(context, 12),
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
          ],

          // Date and Amount Row
          Row(
            children: [
              // Date section
              Expanded(
                child: Row(
                  children: [
                    Icon(
                      Icons.calendar_today_outlined,
                      size: ResponsiveHelper.iconSize(context, 16),
                      color: Colors.grey.shade600,
                    ),
                    const SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        DateFormatterUtils.formatUtcToReadable(date),
                        style: AppTextStyles.body1(
                          context,
                          overrideStyle: TextStyle(
                            fontSize: ResponsiveHelper.fontSize(context, 12),
                            color: Colors.grey.shade700,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Amount section
              Row(
                children: [
                  // Icon(
                  //   Icons.currency_rupee,
                  //   size: ResponsiveHelper.iconSize(context, 16),
                  //   color: Colors.green.shade600,
                  // ),
                  // const SizedBox(width: 4),
                  Text(
                    amount,
                    style: AppTextStyles.heading2(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 14),
                        color: Colors.green.shade600,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Payment Mode Row
          if (mode.isNotEmpty && mode != 'Pending') ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  _getPaymentModeIcon(mode),
                  size: ResponsiveHelper.iconSize(context, 16),
                  color: Colors.blue.shade600,
                ),
                const SizedBox(width: 8),
                Text(
                  mode,
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 12),
                      color: Colors.blue.shade600,
                    ),
                  ),
                ),
              ],
            ),
          ],

          // Pending Amount Row (for partial payments)
          if (status == 'Partial' && pendingAmount != null) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.pending_actions,
                  size: ResponsiveHelper.iconSize(context, 16),
                  color: Colors.orange.shade600,
                ),
                const SizedBox(width: 8),
                Text(
                  'Pending: $pendingAmount',
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 12),
                      color: Colors.orange.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  // Add loading skeleton for orders
  Widget _buildOrdersLoadingSkeleton() {
    return Column(
      children: List.generate(10, (index) => _buildSkeletonOrderCard()),
    );
  }

  Widget _buildSkeletonOrderCard() {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        children: [
          // Header skeleton
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 120,
                height: 16,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              Container(
                width: 60,
                height: 20,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Content skeleton
          Row(
            children: [
              Container(
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                width: 100,
                height: 14,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ],
          ),

          const SizedBox(height: 8),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 16,
                    height: 16,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    width: 80,
                    height: 14,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ],
              ),
              Container(
                width: 60,
                height: 16,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNoOrdersWidget() {
    return Center(
      child: Column(
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: 48,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 12),
          Text(
            'No Recent Orders',
            style: AppTextStyles.heading2(
              context,
              overrideStyle: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 16,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Recent orders will appear here.',
            style: AppTextStyles.body1(
              context,
              overrideStyle: TextStyle(
                color: Colors.grey.shade500,
                fontSize: 12,
              ),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildPagination(int totalPages) {
    if (totalPages <= 1)
      return Container(); // Don't show pagination if only 1 page

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Previous Button
        GestureDetector(
          onTap: _currentOrderPage > 1
              ? () => _changePage(_currentOrderPage - 1)
              : null,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: _currentOrderPage > 1
                  ? Colors.grey.shade200
                  : Colors.grey.shade100,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Text(
              'Prev',
              style: AppTextStyles.body1(
                context,
                overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 12),
                  color: _currentOrderPage > 1
                      ? Colors.black87
                      : Colors.grey.shade500,
                ),
              ),
            ),
          ),
        ),

        const SizedBox(width: 8),

        // Page Numbers (show current page and adjacent pages)
        ...List.generate(totalPages, (index) {
              final pageNum = index + 1;
              final isCurrentPage = pageNum == _currentOrderPage;

              // Show current page, previous page, next page and first/last pages
              if (pageNum == 1 ||
                  pageNum == totalPages ||
                  (pageNum >= _currentOrderPage - 1 &&
                      pageNum <= _currentOrderPage + 1)) {
                return GestureDetector(
                  onTap: () => _changePage(pageNum),
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: isCurrentPage
                          ? AppColors.primary
                          : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                        color: isCurrentPage
                            ? AppColors.primary
                            : Colors.grey.shade300,
                      ),
                    ),
                    child: Text(
                      '$pageNum',
                      style: AppTextStyles.body1(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 12),
                          color: isCurrentPage ? Colors.white : Colors.black87,
                          fontWeight: isCurrentPage
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                  ),
                );
              } else if (pageNum == _currentOrderPage - 2 ||
                  pageNum == _currentOrderPage + 2) {
                // Show dots for gaps
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 8,
                  ),
                  child: Text(
                    '...',
                    style: AppTextStyles.body1(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 12),
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ),
                );
              }
              return Container(); // Don't show this page number
            })
            .where(
              (widget) =>
                  widget.runtimeType != Container ||
                  (widget as Container).child != null,
            )
            .toList(),

        const SizedBox(width: 8),

        // Next Button
        GestureDetector(
          onTap: _currentOrderPage < totalPages
              ? () => _changePage(_currentOrderPage + 1)
              : null,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: _currentOrderPage < totalPages
                  ? Colors.grey.shade200
                  : Colors.grey.shade100,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Text(
              'Next',
              style: AppTextStyles.body1(
                context,
                overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 12),
                  color: _currentOrderPage < totalPages
                      ? Colors.black87
                      : Colors.grey.shade500,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // Helper methods
  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'paid':
        return Colors.green;
      case 'pending':
        return Colors.red;
      case 'partial':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  IconData _getPaymentModeIcon(String mode) {
    switch (mode.toLowerCase()) {
      case 'net banking':
        return Icons.account_balance;
      case 'cash':
        return Icons.money;
      case 'card':
        return Icons.credit_card;
      case 'upi':
        return Icons.qr_code;
      default:
        return Icons.payment;
    }
  }

  void _changePage(int page) async {
    if (page == _currentOrderPage) return; // Prevent unnecessary calls

    setState(() {
      _currentOrderPage = page;
    });

    // Call API with new page and await the response
    await Provider.of<VendorDashboardApiProvider>(
      context,
      listen: false,
    ).getAllVendorRecentOrderList(context, page, _ordersPerPage);
  }

  // First, add the QuickActionsCard widget method to your class
  Widget _buildQuickActionsCard() {
    final quickActions = [
      QuickActionItem(
        title: 'Add Product',
        icon: Icons.add,
        backgroundColor: const Color(0xFFEBF8FF),
        iconColor: const Color(0xFF2563EB),
        borderColor: const Color(0xFFDBEAFE),
        onTap: () {
          // Handle Add Product action
          print('Add Product tapped');
          // Navigator.push(...) or your action logic
        },
      ),
      QuickActionItem(
        title: 'Create Invoice',
        icon: Icons.description_outlined,
        backgroundColor: const Color(0xFFF0FDF4),
        iconColor: const Color(0xFF16A34A),
        borderColor: const Color(0xFFDCFCE7),
        onTap: () {
          // Handle Create Invoice action
          print('Create Invoice tapped');
        },
      ),
      QuickActionItem(
        title: 'View Drafts',
        icon: Icons.visibility_outlined,
        backgroundColor: const Color(0xFFFEFCE8),
        iconColor: const Color(0xFFCA8A04),
        borderColor: const Color(0xFFFEF3C7),
        onTap: () {
          // Handle View Drafts action
          print('View Drafts tapped');
        },
      ),
      QuickActionItem(
        title: 'Add Category',
        icon: Icons.folder_outlined,
        backgroundColor: const Color(0xFFFAF5FF),
        iconColor: const Color(0xFF9333EA),
        borderColor: const Color(0xFFE9D5FF),
        onTap: () {
          // Handle Add Category action
          print('Add Category tapped');
        },
      ),
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 0),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFFFCE7F3),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Transform.rotate(
                    angle: 0.785398, // 45 degrees
                    child: Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        color: const Color(0xFFEC4899),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Quick Actions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF1F2937),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Actions Grid
          Padding(
            padding: ResponsiveHelper.paddingOnly(
              context,
              left: 0.0,
              right: 0,
              top: 0,
            ),
            child: SizedBox(
              width: double.infinity,
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                          child: GestureDetector(
                            onTap: (){
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => VendorAddProductScreen(),
                                ),
                              );
                            },
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(0),
                                        decoration: BoxDecoration(
                                          color: AppColors.whiteColor,
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Icon(
                                          Icons.add,
                                          color: AppColors.blackColor,
                                          size: ResponsiveHelper.iconSize(context, 20),
                                        ),
                                      ),
                                      ResponsiveHelper.sizedBoxWidth(context, 10),
                                      Text(
                                        "Add Product",
                                        style: AppTextStyles.heading2(
                                          context,
                                          overrideStyle: TextStyle(
                                            fontSize: ResponsiveHelper.fontSize(context, 12),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          )
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                          child: GestureDetector(
                            onTap: (){
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => VendorCreateInvoiceScreen(),
                                ),
                              );
                            },
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(0),
                                        decoration: BoxDecoration(
                                          color: AppColors.whiteColor,
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Icon(
                                          Icons.description_outlined,
                                          color: AppColors.blackColor,
                                          size: ResponsiveHelper.iconSize(context, 20),
                                        ),
                                      ),
                                      ResponsiveHelper.sizedBoxWidth(context, 10),
                                      Text(
                                        "Create Invoice",
                                        style: AppTextStyles.heading2(
                                          context,
                                          overrideStyle: TextStyle(
                                            fontSize: ResponsiveHelper.fontSize(context, 12),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          )
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                          child: GestureDetector(
                            onTap: (){
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => VendorDraftListSceeen(),
                                ),
                              );
                            },
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(0),
                                        decoration: BoxDecoration(
                                          color: AppColors.whiteColor.withAlpha(30),
                                          borderRadius: BorderRadius.circular(100),
                                        ),
                                        child: Icon(
                                          Icons.visibility_outlined,
                                          color: AppColors.orangeColor,
                                          size: ResponsiveHelper.iconSize(context, 20),
                                        ),
                                      ),
                                      ResponsiveHelper.sizedBoxWidth(context, 10),
                                      Text(
                                        "View Drafts",
                                        style: AppTextStyles.heading2(
                                          context,
                                          overrideStyle: TextStyle(
                                            fontSize: ResponsiveHelper.fontSize(context, 12),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          )
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                          child: GestureDetector(
                            onTap: (){
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => VendorCategoryLIstScreen(),
                                ),
                              );
                            },
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(0),
                                        decoration: BoxDecoration(
                                          color: AppColors.whiteColor.withAlpha(30),
                                          borderRadius: BorderRadius.circular(100),
                                        ),
                                        child: Icon(
                                          Icons.add,
                                          color: AppColors.blueColor,
                                          size: ResponsiveHelper.iconSize(context, 20),
                                        ),
                                      ),
                                      ResponsiveHelper.sizedBoxWidth(context, 10),
                                      Text(
                                        "Add Category",
                                        style: AppTextStyles.heading2(
                                          context,
                                          overrideStyle: TextStyle(
                                            fontSize: ResponsiveHelper.fontSize(context, 12),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          )
                      ),
                    ],
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildQuickActionButton(QuickActionItem action) {
    return GestureDetector(
      onTap: action.onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        decoration: BoxDecoration(
          color: action.backgroundColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: action.borderColor,
            width: 1.5,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: action.backgroundColor,
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: action.iconColor.withOpacity(0.1),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Icon(
                action.icon,
                color: action.iconColor,
                size: 22,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              action.title,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: Color(0xFF374151),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

// Data model for Quick Action


  Widget _buildMobileLayout() {
    return Column(
      children: [
        _buildStatsSection(),
        const SizedBox(height: 20),
        _buildCategoryGridSection(),
        const SizedBox(height: 20),
        _buildQuickActionsCard(),
        const SizedBox(height: 20),
        _buildRecentOrdersSection(), // Add this line
        const SizedBox(height: 20),
        _buildAttendancePieChart(),
        const SizedBox(height: 20),
        // Upcoming Events Section
        // _buildDashboardCard(
        //   title: 'Upcoming Birthdays & Anniversaries',
        //   child: _buildUpcomingEvents(),
        // ),
        const SizedBox(height: 20),
        // Notifications Section
        _buildDashboardCard(
          title: 'Announcements & Reminders',
          child: _buildNotifications(),
        ),
        // const SizedBox(height: 20),
        // _buildComplianceCard(),
        // const SizedBox(height: 20),
        // _buildMyTeamCard(),
        // const SizedBox(height: 20),
        // _buildCurrentActivityCard(),
        // const SizedBox(height: 20),
        // _buildNewlyAddedCard(),
        // const SizedBox(height: 20),
        // _buildLeaderboardCard(),
      ],
    );
  }

  Widget _buildStatsSection() {
    // Use Consumer to listen to changes in VendorDashboardApiProvider
    return Consumer<VendorDashboardApiProvider>(
      builder: (context, apiProvider, child) {
        // Determine the data to show based on the loading state
        final data =
            apiProvider.getVendorDashboardTopCardDataModelResponse?.data;
        final bool isLoading = apiProvider.isLoading;

        // Use a ternary operator to set values based on the loading state
        final totalInvoices = isLoading
            ? '0'
            : (data?.totalInvoices?.toString() ?? '0');
        final totalProducts = isLoading
            ? '0'
            : (data?.totalProducts?.toString() ?? '0');
        final totalSales = isLoading
            ? '0'
            : '₹${data?.totalSales?.toString() ?? '0'}';
        final totalCustomers = isLoading
            ? '0'
            : (data?.totalCustomers?.toString() ?? '0');

        return Padding(
          padding: ResponsiveHelper.paddingOnly(
            context,
            left: 12.0,
            right: 12,
            top: 12,
          ),
          child: SizedBox(
            width: double.infinity,
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        "Total Invoices",
                        totalInvoices,
                        Icons.receipt,
                        Colors.blue,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => VendorPurchaseOrderManagementListScreen()),
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildStatCard(
                        "Total Products",
                        totalProducts,
                        Icons.shopping_bag,
                        Colors.green,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => VendorProductManagementListScreen()),
                          );
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        "Total Sales",
                        totalSales,
                        Icons.monetization_on,
                        Colors.red,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildStatCard(
                        "Total Customers",
                        totalCustomers,
                        Icons.people,
                        Colors.orange,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color, {
    bool isFirst = false, // Keep this parameter if you need it for other logic
        VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withAlpha(30),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: ResponsiveHelper.iconSize(context, 20),
                  ),
                ),
                const Spacer(),
                Text(
                  value,
                  style: AppTextStyles.heading2(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 16),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                title,
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 10),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAttendancePieChart() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.whiteColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Attendance Summary',
                style: AppTextStyles.heading1(
                  context,
                  overrideStyle: const TextStyle(fontSize: 16),
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              SizedBox(
                height: 200,
                width: 200,
                child: CustomPaint(painter: PieChartPainter(_getChartData())),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildIndicator(
                      Colors.green,
                      'Paid',
                      _attendanceStats['Paid']!,
                    ),
                    _buildIndicator(
                      Colors.red,
                      'Pending',
                      _attendanceStats['Pending']!,
                    ),
                    _buildIndicator(
                      Colors.orange,
                      'Partial',
                      _attendanceStats['Partial']!,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  List<ChartData> _getChartData() {
    final total =
        _attendanceStats['Paid']! +
        _attendanceStats['Pending']! +
        _attendanceStats['Partial']!;
    return [
      ChartData(
        'Paid',
        _attendanceStats['Paid']!.toDouble(),
        Colors.green,
        (total > 0 ? (_attendanceStats['Paid']! / total * 100) : 0)
            .toStringAsFixed(1),
      ),
      ChartData(
        'Pending',
        _attendanceStats['Pending']!.toDouble(),
        Colors.red,
        (total > 0 ? (_attendanceStats['Pending']! / total * 100) : 0)
            .toStringAsFixed(1),
      ),
      ChartData(
        'Partial',
        _attendanceStats['Partial']!.toDouble(),
        Colors.orange,
        (total > 0 ? (_attendanceStats['Partial']! / total * 100) : 0)
            .toStringAsFixed(1),
      ),
    ];
  }

  Widget _buildIndicator(Color color, String text, int value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(shape: BoxShape.circle, color: color),
          ),
          const SizedBox(width: 4),
          Text('$text ($value)', style: AppTextStyles.body2(context)),
        ],
      ),
    );
  }

  Widget _buildDashboardCard({
    required String title,
    required Widget child,
    VoidCallback? onTap,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Row(
          //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
          //   children: [
          //     Text(
          //       title,
          //       style: AppTextStyles.heading1(
          //         context,
          //         overrideStyle: const TextStyle(fontSize: 16),
          //       ),
          //     ),
          //     GestureDetector(
          //       onTap: onTap,
          //       child: const Icon(
          //         Icons.arrow_forward_ios,
          //         size: 16,
          //         color: Colors.grey,
          //       ),
          //     ),
          //   ],
          // ),
          // const SizedBox(height: 10),
          // const Divider(),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }
}

// Data model for chart
class ChartData {
  final String label;
  final double value;
  final Color color;
  final String percentage;

  ChartData(this.label, this.value, this.color, this.percentage);
}

// Custom Painter for Pie Chart
class PieChartPainter extends CustomPainter {
  final List<ChartData> data;

  PieChartPainter(this.data);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = math.min(size.width, size.height) / 2 - 20;
    final innerRadius = radius * 0.5; // For donut chart effect

    double total = data.fold(0, (sum, item) => sum + item.value);
    double startAngle = -math.pi / 2; // Start from top

    // Draw pie slices
    for (int i = 0; i < data.length; i++) {
      final sweepAngle = (data[i].value / total) * 2 * math.pi;

      final paint = Paint()
        ..color = data[i].color
        ..style = PaintingStyle.fill;

      // Draw the pie slice
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        true,
        paint,
      );

      // Draw inner circle for donut effect
      final innerPaint = Paint()
        ..color = Colors.white
        ..style = PaintingStyle.fill;

      canvas.drawCircle(center, innerRadius, innerPaint);

      // Calculate position for percentage text
      final middleAngle = startAngle + sweepAngle / 2;
      final textRadius = (radius + innerRadius) / 2;
      final textX = center.dx + textRadius * math.cos(middleAngle);
      final textY = center.dy + textRadius * math.sin(middleAngle);

      // Draw percentage text
      final textPainter = TextPainter(
        text: TextSpan(
          text: '${data[i].percentage}%',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
        textDirection: TextDirection.ltr,
      );

      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(textX - textPainter.width / 2, textY - textPainter.height / 2),
      );

      startAngle += sweepAngle;
    }

    // Draw center text
    final centerTextPainter = TextPainter(
      text: const TextSpan(
        text: 'Today\nAttendance',
        style: TextStyle(
          color: Colors.black87,
          fontWeight: FontWeight.bold,
          fontSize: 10,
        ),
      ),
      textDirection: TextDirection.ltr,
      textAlign: TextAlign.center,
    );

    centerTextPainter.layout();
    centerTextPainter.paint(
      canvas,
      Offset(
        center.dx - centerTextPainter.width / 2,
        center.dy - centerTextPainter.height / 2,
      ),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
class QuickActionItem {
  final String title;
  final IconData icon;
  final Color backgroundColor;
  final Color iconColor;
  final Color borderColor;
  final VoidCallback onTap;

  QuickActionItem({
    required this.title,
    required this.icon,
    required this.backgroundColor,
    required this.iconColor,
    required this.borderColor,
    required this.onTap,
  });
}