import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:dss_crm/hr_module/screen/employee/payroll/model/hr_payroll_management_list_model.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
import '../../../controller/hr_employee_api_provider.dart';

class PayrollManagementScreen extends StatefulWidget {
  const PayrollManagementScreen({Key? key}) : super(key: key);

  @override
  State<PayrollManagementScreen> createState() =>
      _PayrollManagementScreenState();
}

class _PayrollManagementScreenState extends State<PayrollManagementScreen>
    with SingleTickerProviderStateMixin {
  int selectedMonth = DateTime.now().month;
  int selectedYear = DateTime.now().year;
  String searchQuery = '';
  bool showFilters = false;
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadPayrollData();
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _loadPayrollData() {
    _animationController.forward(from: 0);
    final provider = context.read<HREmployeeApiProvider>();
    provider.getHrPayrollManagementList(
      context,
      month: selectedMonth,
      year: selectedYear,
    );
  }

  void _toggleFilters() {
    setState(() {
      showFilters = !showFilters;
    });
  }

  void _applyFilters() {
    setState(() {
      showFilters = false;
    });
    _loadPayrollData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          'Payroll Management',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              fontSize: 16,
              color: AppColors.whiteColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(
              showFilters ? Icons.close : Icons.filter_list,
              color: AppColors.whiteColor,
            ),
            onPressed: _toggleFilters,
            tooltip: 'Filter',
          ),
          IconButton(
            icon: RotationTransition(
              turns: _animationController,
              child: Icon(Icons.refresh, color: AppColors.whiteColor),
            ),
            onPressed: _loadPayrollData,
            tooltip: 'Refresh',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Consumer<HREmployeeApiProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return LoadingIndicatorUtils();
          }

          final response = provider.getHrPayrollManagementListModel;

          if (response == null || response.data == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.receipt_long,
                    size: ResponsiveHelper.iconSize(context, 62),
                    color: Colors.grey[300],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No payroll data available',
                    style: AppTextStyles.heading2(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: 16,
                        color: AppColors.whiteColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  ResponsiveHelper.sizedBoxHeight(context, 8),
                  Text(
                    'Try selecting a different period',
                    style: AppTextStyles.heading2(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: 12,
                        color: AppColors.txtGreyColor,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }

          final payrollData = response.data!;
          final employees = payrollData.data ?? [];
          final stats = _calculateStats(employees);

          final filteredEmployees = employees.where((emp) {
            if (searchQuery.isEmpty) return true;
            final query = searchQuery.toLowerCase();
            return (emp.employeeName?.toLowerCase().contains(query) ?? false) ||
                (emp.employeeCode?.toLowerCase().contains(query) ?? false) ||
                (emp.email?.toLowerCase().contains(query) ?? false);
          }).toList();

          return Column(
            children: [
              // Filter Section
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                height: showFilters ? null : 0,
                child: showFilters
                    ? Container(
                        color: Colors.white,
                        padding: ResponsiveHelper.paddingAll(context, 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Filter by Period',
                              style: AppTextStyles.heading2(
                                context,
                                overrideStyle: TextStyle(fontSize: 14),
                              ),
                            ),
                            const SizedBox(height: 12),
                            // Filter Section - Replace the old dropdowns with ResponsiveDropdown
                            Padding(
                              padding: ResponsiveHelper.paddingSymmetric(
                                context,
                                horizontal: 0,
                                vertical: 8,
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: ResponsiveDropdown<int>(
                                      value: selectedMonth,
                                      itemList: List.generate(
                                        12,
                                        (index) => index + 1,
                                      ),
                                      onChanged: (value) => setState(
                                        () => selectedMonth = value!,
                                      ),
                                      hint: 'Select Month',
                                      label: 'Month',
                                      itemDisplayBuilder: (month) =>
                                          _getMonthName(month),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: ResponsiveDropdown<int>(
                                      value: selectedYear,
                                      itemList: List.generate(
                                        10,
                                        (index) => DateTime.now().year - index,
                                      ),
                                      onChanged: (value) =>
                                          setState(() => selectedYear = value!),
                                      hint: 'Select Year',
                                      label: 'Year',
                                      itemDisplayBuilder: (year) =>
                                          year.toString(),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 12),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _applyFilters,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blue[700],
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 12,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                child: const Text(
                                  'Apply Filter',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      )
                    : const SizedBox.shrink(),
              ),

              // Status Cards
              Container(
                color: Colors.white,
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Container(
                    //   padding: const EdgeInsets.symmetric(
                    //     horizontal: 12,
                    //     vertical: 8,
                    //   ),
                    //   decoration: BoxDecoration(
                    //     color: Colors.blue[50],
                    //     borderRadius: BorderRadius.circular(8),
                    //   ),
                    //   child: Row(
                    //     mainAxisSize: MainAxisSize.min,
                    //     children: [
                    //       Icon(Icons.calendar_today,
                    //           size: 16, color: Colors.blue[700]),
                    //       const SizedBox(width: 8),
                    //       Text(
                    //         payrollData.period ??
                    //             '${_getMonthName(selectedMonth)} $selectedYear',
                    //         style: TextStyle(
                    //           fontWeight: FontWeight.w600,
                    //           fontSize: 14,
                    //           color: Colors.blue[700],
                    //         ),
                    //       ),
                    //     ],
                    //   ),
                    // ),
                    // const SizedBox(height: 12),
                    _buildStatusCards(stats),
                  ],
                ),
              ),

              // Search Bar
              Padding(
                padding: const EdgeInsets.all(16),
                child: TextField(
                  onChanged: (value) => setState(() => searchQuery = value),
                  decoration: InputDecoration(
                    hintText: 'Search employees...',
                    prefixIcon: const Icon(Icons.search, size: 20),
                    suffixIcon: searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 20),
                            onPressed: () => setState(() => searchQuery = ''),
                          )
                        : null,
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                ),
              ),

              // Employee List
              Expanded(
                child: filteredEmployees.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.people_outline,
                              size: 64,
                              color: Colors.grey[300],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              searchQuery.isEmpty
                                  ? 'No employees found'
                                  : 'No results found',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Colors.black87,
                              ),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        itemCount: filteredEmployees.length,
                        itemBuilder: (context, index) {
                          final employee = filteredEmployees[index];
                          return _buildEmployeeCard(employee);
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStatusCards(Map<String, dynamic> stats) {
    return Row(
      children: [
        Expanded(
          child: _buildStatusCard(
            'Total',
            stats['totalEmployees'].toString(),
            Icons.people,
            Colors.blue,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatusCard(
            'Paid',
            stats['paid'].toString(),
            Icons.check_circle,
            Colors.green,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatusCard(
            'Payout',
            '₹${_formatAmountShort(stats['totalPayout'])}',
            Icons.account_balance_wallet,
            Colors.orange,
          ),
        ),
      ],
    );
  }

  Widget _buildStatusCard(
    String title,
    String value,
    IconData icon,
    MaterialColor color,
  ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color[50],
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color[100]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey[700],
                  fontWeight: FontWeight.w500,
                ),
              ),
              Icon(icon, color: color[700], size: 18),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color[700],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmployeeCard(Data employee) {
    final isPaid = employee.status?.toLowerCase() == 'paid';
    final attendancePercentage =
    employee.totalWorkingDays != null && employee.totalWorkingDays! > 0
        ? ((employee.presentDays ?? 0) / employee.totalWorkingDays! * 100)
        : 0.0;

    return Card(
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shadowColor: Colors.black.withOpacity(0.08),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey[100]!, width: 1),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => _showEmployeeDetail(employee),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.white,
                isPaid ? Colors.green[50]!.withOpacity(0.3) : Colors.orange[50]!.withOpacity(0.3),
              ],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Section with Avatar & Status
                Row(
                  children: [
                    // Enhanced Avatar with Gradient
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Colors.blue[400]!,
                            Colors.blue[700]!,
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.blue[200]!.withOpacity(0.5),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: 24,
                        backgroundColor: Colors.transparent,
                        child: Text(
                          (employee.employeeName ?? 'N')
                              .substring(0, 1)
                              .toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            employee.employeeName ?? 'N/A',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: Colors.black87,
                              letterSpacing: 0.2,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(
                                Icons.badge_outlined,
                                size: 13,
                                color: Colors.grey[600],
                              ),
                              const SizedBox(width: 4),
                              Text(
                                employee.employeeCode ?? 'N/A',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    // Enhanced Status Badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: isPaid
                              ? [Colors.green[400]!, Colors.green[600]!]
                              : [Colors.orange[400]!, Colors.orange[600]!],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: (isPaid ? Colors.green[300]! : Colors.orange[300]!)
                                .withOpacity(0.4),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isPaid ? Icons.check_circle : Icons.schedule,
                            size: 14,
                            color: Colors.white,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            employee.status ?? 'Pending',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Elegant Divider
                Container(
                  height: 1,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent,
                        Colors.grey[300]!,
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Salary Info Cards with Icons
                Row(
                  children: [
                    Expanded(
                      child: _buildSalaryCard(
                        'Actual Salary',
                        '₹${_formatAmount(employee.actualSalary ?? 0)}',
                        Icons.account_balance_wallet_outlined,
                        Colors.purple,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSalaryCard(
                        'Estimate',
                        '₹${_formatAmount(employee.estimateSalary ?? 0)}',
                        Icons.calculate_outlined,
                        Colors.blue,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Attendance Chips with Better Design
                Row(
                  children: [
                    Expanded(
                      child: _buildModernAttendanceChip(
                        'Present',
                        employee.presentDays?.toString() ?? '0',
                        Icons.check_circle_outline,
                        Colors.green,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildModernAttendanceChip(
                        'Half Day',
                        employee.halfDays?.toString() ?? '0',
                        Icons.timelapse_outlined,
                        Colors.orange,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildModernAttendanceChip(
                        'Absent',
                        employee.absentDays?.toString() ?? '0',
                        Icons.cancel_outlined,
                        Colors.red,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Attendance Progress Section
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.grey[200]!),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.trending_up,
                                size: 16,
                                color: _getAttendanceColor(attendancePercentage),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Attendance',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.grey[700],
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: _getAttendanceColor(attendancePercentage)
                                  .withOpacity(0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '${attendancePercentage.toStringAsFixed(1)}%',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: _getAttendanceColor(attendancePercentage),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: Stack(
                          children: [
                            Container(
                              height: 8,
                              decoration: BoxDecoration(
                                color: Colors.grey[200],
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ),
                            FractionallySizedBox(
                              widthFactor: attendancePercentage / 100,
                              child: Container(
                                height: 8,
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      _getAttendanceColor(attendancePercentage),
                                      _getAttendanceColor(attendancePercentage)
                                          .withOpacity(0.7),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(6),
                                  boxShadow: [
                                    BoxShadow(
                                      color: _getAttendanceColor(attendancePercentage)
                                          .withOpacity(0.4),
                                      blurRadius: 4,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

// New helper method for salary cards
  Widget _buildSalaryCard(
      String label,
      String value,
      IconData icon,
      MaterialColor color,
      ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        // gradient: LinearGradient(
        //   begin: Alignment.topLeft,
        //   end: Alignment.bottomRight,
        //   colors: [
        //     color[50]!,
        //     color[100]!.withOpacity(0.5),
        //   ],
        // ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color[200]!, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, size: 16, color: color[700]),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 10,
                    color: color[700],
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: color[800],
            ),
          ),
        ],
      ),
    );
  }

// Enhanced attendance chip
  Widget _buildModernAttendanceChip(
      String label,
      String value,
      IconData icon,
      MaterialColor color,
      ) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        // border: Border.all(color: color[200]!, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: color[100]!.withOpacity(0.3),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Icon(icon, size: 18, color: color[600]),
          // const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: color[700],
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 9,
              color: color[600],
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 10, color: Colors.grey[600])),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
      ],
    );
  }

  Widget _buildAttendanceChip(String label, String value, MaterialColor color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(
          color: color[50],
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: color[100]!),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: color[700],
              ),
            ),
            Text(label, style: TextStyle(fontSize: 9, color: color[700])),
          ],
        ),
      ),
    );
  }

  Color _getAttendanceColor(double percentage) {
    if (percentage >= 90) return Colors.green[700]!;
    if (percentage >= 75) return Colors.orange[700]!;
    return Colors.red[700]!;
  }

  void _showEmployeeDetail(Data employee) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => PayrollDetailSheet(
        employee: employee,
        selectedMonth: selectedMonth,
        // ← ye important hai
        selectedYear: selectedYear,
      ),
    );
  }

  Map<String, dynamic> _calculateStats(List<Data> employees) {
    int paid = 0;
    int totalPayout = 0;
    for (var emp in employees) {
      if (emp.status?.toLowerCase() == 'paid') {
        paid++;
        totalPayout += emp.paidAmount ?? 0;
      }
    }
    return {
      'totalEmployees': employees.length,
      'paid': paid,
      'totalPayout': totalPayout,
    };
  }

  String _formatAmount(int amount) {
    final formatter = NumberFormat('#,##,###');
    return formatter.format(amount);
  }

  String _formatAmountShort(int amount) {
    if (amount >= 10000000) {
      return '${(amount / 10000000).toStringAsFixed(1)}Cr';
    } else if (amount >= 100000) {
      return '${(amount / 100000).toStringAsFixed(1)}L';
    } else if (amount >= 1000) {
      return '${(amount / 1000).toStringAsFixed(1)}K';
    }
    return amount.toString();
  }

  String _getMonthName(int month) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  }
}

// Payroll Detail Bottom Sheet
class PayrollDetailSheet extends StatelessWidget {
  final Data employee;
  final int selectedMonth;
  final int selectedYear;

  const PayrollDetailSheet({
    Key? key,
    required this.employee,
    required this.selectedMonth,
    required this.selectedYear,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isPaid = employee.status?.toLowerCase() == 'paid';

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollController) {
          return Column(
            children: [
              // Drag Handle
              Padding(
                padding: const EdgeInsets.only(top: 12, bottom: 8),
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Expanded(
                child: ListView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(20),
                  children: [
                    // Header
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 28,
                          backgroundColor: Colors.blue[100],
                          child: Text(
                            (employee.employeeName ?? 'N')
                                .substring(0, 1)
                                .toUpperCase(),
                            style: TextStyle(
                              color: Colors.blue[700],
                              fontWeight: FontWeight.bold,
                              fontSize: 24,
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                employee.employeeName ?? 'N/A',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                ),
                              ),
                              Text(
                                employee.employeeCode ?? 'N/A',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.grey[600],
                                ),
                              ),
                              if (employee.email != null)
                                Text(
                                  employee.email!,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[500],
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Status
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: isPaid ? Colors.green[50] : Colors.orange[50],
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: isPaid
                              ? Colors.green[200]!
                              : Colors.orange[200]!,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            isPaid ? Icons.check_circle : Icons.schedule,
                            color: isPaid
                                ? Colors.green[700]
                                : Colors.orange[700],
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Status: ${employee.status ?? 'Pending'}',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: isPaid
                                  ? Colors.green[700]
                                  : Colors.orange[700],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Salary Section
                    _buildSection('Salary Information', [
                      _buildDetailRow(
                        'Actual Salary',
                        '₹${_formatAmount(employee.actualSalary ?? 0)}',
                      ),
                      _buildDetailRow(
                        'Estimated Salary',
                        '₹${_formatAmount(employee.estimateSalary ?? 0)}',
                      ),
                      _buildDetailRow(
                        'Paid Amount',
                        '₹${_formatAmount(employee.paidAmount ?? 0)}',
                      ),
                    ]),

                    const SizedBox(height: 20),

                    // Attendance Section
                    _buildSection('Attendance Details', [
                      _buildDetailRow(
                        'Present Days',
                        '${employee.presentDays ?? 0}',
                      ),
                      _buildDetailRow('Half Days', '${employee.halfDays ?? 0}'),
                      _buildDetailRow(
                        'Absent Days',
                        '${employee.absentDays ?? 0}',
                      ),
                      _buildDetailRow(
                        'Total Working Days',
                        '${employee.totalWorkingDays ?? 0}',
                      ),
                      _buildDetailRow(
                        'Attendance Records',
                        '${employee.attendanceRecords ?? 0}',
                      ),
                    ]),

                    if (employee.period != null) ...[
                      const SizedBox(height: 20),
                      _buildDetailRow('Period', employee.period!),
                    ],
                  ],
                ),
              ),

              // ListView ke andar, last item ke baad yeh add karo
              const SizedBox(height: 20),

              // Action Buttons - Approve & Reject
              if (employee.status?.toLowerCase() != 'paid' && employee.status?.toLowerCase() != 'rejected') // Sirf agar paid nahi hai tab dikhao
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      Expanded(
                        child: CustomButton(
                          text: "Reject",
                          color: Colors.grey[300]!,
                          textColor: Colors.black,
                          type: ButtonType.outlined,
                          onPressed: () => _performSalaryAction(
                            context,
                            employee.employeeId.toString(),
                            'reject',
                          ),
                        ),


                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: CustomButton(
                          text: "Approve",
                          onPressed: () => _performSalaryAction(
                            context,
                            employee.employeeId.toString(),
                            'approve',
                          ),
                        ),

                      ),
                    ],
                  ),
                ),

              const SizedBox(height: 20),
            ],
          );
        },
      ),
    );
  }

  void _performSalaryAction(
    BuildContext context,
    String employeeId,
    String action,
  ) async {
    // Bottom sheet close karo
    Navigator.pop(context);

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      message: action == 'approve'
          ? 'Approving payroll...'
          : 'Rejecting payroll...',
      backgroundColor: Colors.orange,
    );

    try {
      await provider.hrPayrollSalaryAction(
        context,
        employeeId: employeeId,
        month: selectedMonth, // ← Yahi selected filter se aayega
        year: selectedYear, // ← Yahi selected filter se aayega
        action: action, // "approve" or "reject"
      );

      // Success pe list refresh (same filter ke saath)
      if (context.mounted) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: action == 'approve'
              ? 'Payroll approved successfully!'
              : 'Payroll rejected!',
          backgroundColor: action == 'approve' ? Colors.green : Colors.red,
        );

        provider.getHrPayrollManagementList(
          context,
          month: selectedMonth,
          year: selectedYear,
        );
      }
    } catch (e) {
      // Agar kuch galat hua toh bhi refresh kar do (latest data dikhe)
      if (context.mounted) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: 'Action failed. Please try again.',
          backgroundColor: Colors.red,
        );
        provider.getHrPayrollManagementList(
          context,
          month: selectedMonth,
          year: selectedYear,
        );
      }
    }
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: Colors.grey[50],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[200]!),
          ),
          child: Column(children: children),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 13, color: Colors.grey[700])),
          Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  String _formatAmount(int amount) {
    final formatter = NumberFormat('#,##,###');
    return formatter.format(amount);
  }
}
