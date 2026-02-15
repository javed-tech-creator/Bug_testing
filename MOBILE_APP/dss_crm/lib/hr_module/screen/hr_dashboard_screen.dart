import 'package:dss_crm/hr_module/common/hr_common_sidebar_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/employee_attendance/hr_emp_attendance_log_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../../utils/storage_util.dart';

class HRDashboardScreen extends StatefulWidget {
  const HRDashboardScreen({super.key});

  @override
  State<HRDashboardScreen> createState() => _HRDashboardScreenState();
}

class _HRDashboardScreenState extends State<HRDashboardScreen> {
  String selectedMenu = 'HR Dashboard';
  bool isDrawerOpen = true;
  String? userName = '';
  String? userRole = '';

  // Mock data for the pie chart and other sections
  final Map<String, int> _attendanceStats = {
    'Present': 3,
    'Absent': 1,
    'Late': 1,
    'Total': 5,
  };
  final List<String> _complianceIssues = [
    'App Not Installed',
    'GPS Disabled',
    'Never Logged In',
  ];
  final List<Map<String, String>> _myTeamMembers = [
    {'name': 'Ashish Kumar', 'status': 'Punched-out'},
    {'name': 'Jitendra', 'status': 'Not Punched in'},
  ];
  final List<Map<String, String>> _newlyAdded = [
    {'title': 'Forms', 'value': 'XX'},
    {'title': 'Customers', 'value': '1'},
  ];
  final List<String> _leaderboard = [
    'Employee Name',
    'Employee Name',
    'Employee Name',
  ];

  final Map<String, int> _hrStats = {
    'total_employees': 75,
    'new_joinees': 3,
    'open_positions': 5,
    'pending_leaves': 8,
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

  @override
  void initState() {
    super.initState();
    loadUserData();
  }

  void loadUserData() async {
    userName = await StorageHelper().getLoginUserName() ?? "Ashish Kumar";
    userRole = await StorageHelper().getLoginRole() ?? "";
    setState(() {});
  }

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  void _navigateToAllEmployeesScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const HREmployeeAttendanceUiDesign(),
      ),
    );
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
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
    );
  }

  Widget _buildHiringFunnel() {
    return Column(
      children: _hiringFunnel.map((step) {
        final double percentage = (_hiringFunnel[0]['count'] > 0)
            ? (step['count'] / _hiringFunnel[0]['count'])
            : 0;

        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            children: [
              Expanded(
                child: Text(step['title'],
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: const TextStyle(fontSize: 14),
                  ),),
              ),
              Text(
                step['count'].toString(),
                // style: AppTextStyles.body1(
                //   context,
                // ).copyWith(fontWeight: FontWeight.bold),

                style: AppTextStyles.body1(
                  context,
                  overrideStyle: const TextStyle(fontSize: 14),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                flex: 2,
                child: LinearProgressIndicator(
                  value: percentage,
                  backgroundColor: Colors.grey[200],
                  color: step['color'],
                  minHeight: 10,
                ),
              ),
            ],
          ),
        );
      }).toList(),
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
    return Column(
      children: _notifications.map((notification) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            children: [
              Icon(
                Icons.notifications_active_outlined,
                color: AppColors.orangeColor,
                size: 20,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(notification,   style: AppTextStyles.body1(
                  context,
                  overrideStyle: const TextStyle(fontSize: 14),
                ),),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildMobileLayout() {
    return Column(
      children: [
        _buildStatsSection(),
        const SizedBox(height: 20),
        _buildAttendancePieChart(),
        const SizedBox(height: 20),
        _buildDashboardCard(
          title: 'Hiring Funnel',
          child: _buildHiringFunnel(),
        ),
        const SizedBox(height: 20),
        // Upcoming Events Section
        _buildDashboardCard(
          title: 'Upcoming Birthdays & Anniversaries',
          child: _buildUpcomingEvents(),
        ),
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
    return Container(
      width: double.infinity,
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  "Total Employees",
                  _attendanceStats['Total'].toString(),
                  Icons.people,
                  Colors.blue,
                  isFirst: true,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  "Present",
                  _attendanceStats['Present'].toString(),
                  Icons.check_circle,
                  Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  "Absent",
                  _attendanceStats['Absent'].toString(),
                  Icons.cancel,
                  Colors.red,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  "Late",
                  _attendanceStats['Late'].toString(),
                  Icons.access_time,
                  Colors.orange,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color, {
    bool isFirst = false,
  }) {
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
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 10),
                    ),
                  ),
                ),
                if (isFirst) ...[
                  GestureDetector(
                    onTap: _navigateToAllEmployeesScreen,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.grey.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Icon(
                        Icons.visibility,
                        size: ResponsiveHelper.iconSize(context, 15),
                        color: Colors.grey,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
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
                      'Present',
                      _attendanceStats['Present']!,
                    ),
                    _buildIndicator(
                      Colors.red,
                      'Absent',
                      _attendanceStats['Absent']!,
                    ),
                    _buildIndicator(
                      Colors.orange,
                      'Late',
                      _attendanceStats['Late']!,
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
        _attendanceStats['Present']! +
        _attendanceStats['Absent']! +
        _attendanceStats['Late']!;
    return [
      ChartData(
        'Present',
        _attendanceStats['Present']!.toDouble(),
        Colors.green,
        (total > 0 ? (_attendanceStats['Present']! / total * 100) : 0)
            .toStringAsFixed(1),
      ),
      ChartData(
        'Absent',
        _attendanceStats['Absent']!.toDouble(),
        Colors.red,
        (total > 0 ? (_attendanceStats['Absent']! / total * 100) : 0)
            .toStringAsFixed(1),
      ),
      ChartData(
        'Late',
        _attendanceStats['Late']!.toDouble(),
        Colors.orange,
        (total > 0 ? (_attendanceStats['Late']! / total * 100) : 0)
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title,  style: AppTextStyles.heading1(
                context,
                overrideStyle: const TextStyle(fontSize: 16),
              ),),
              GestureDetector(
                onTap: onTap,
                child: const Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                  color: Colors.grey,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Divider(),
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
