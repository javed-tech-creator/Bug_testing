import 'package:dss_crm/hr_module/screen/widget/hr_employee_calender_view_widget.dart';

// UI file ke top mein
import 'package:dss_crm/hr_module/screen/employee/employee_attendance/model/hr_emp_attendance_list_model.dart'
    as AttendanceModel;
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/ui_helper/app_text_styles.dart';
import 'package:provider/provider.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../controller/hr_employee_api_provider.dart';

class HREmployeeAttendanceUiDesign extends StatefulWidget {
  const HREmployeeAttendanceUiDesign({Key? key}) : super(key: key);

  @override
  State<HREmployeeAttendanceUiDesign> createState() =>
      _HREmployeeAttendanceUiDesignState();
}

class _HREmployeeAttendanceUiDesignState
    extends State<HREmployeeAttendanceUiDesign> {
  String? selectedDepartment;
  String? selectedStatus;
  String selectedShow = '10';
  bool isTableView = false;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Fetch attendance data when the screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HREmployeeApiProvider>().getHRAllEmpAttendanceList(context);
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'present':
        return Colors.green;
      case 'absent':
        return Colors.red;
      case 'late':
        return Colors.orange;
      case 'half day':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'present':
        return Icons.check_circle;
      case 'absent':
        return Icons.cancel;
      case 'late':
        return Icons.access_time;
      case 'half day':
        return Icons.schedule;
      default:
        return Icons.help;
    }
  }

  String _formatTime(String? time) {
    if (time == null || time.isEmpty || time == '--') return '--';

    try {
      final dateTime = DateTime.parse(time);
      return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return time;
    }
  }

  String _getWorkingHours(String? loginTime, String? logoutTime) {
    if (loginTime == null ||
        logoutTime == null ||
        loginTime.isEmpty ||
        logoutTime.isEmpty) {
      return '--';
    }

    try {
      final login = DateTime.parse(loginTime);
      final logout = DateTime.parse(logoutTime);
      final difference = logout.difference(login);

      final hours = difference.inHours;
      final minutes = difference.inMinutes.remainder(60);

      return '${hours}h ${minutes}m';
    } catch (e) {
      return '--';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: DefaultCommonAppBar(
        activityName: "Attendance Management",
        backgroundColor: AppColors.primary,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(vertical: 20.0),
          child: Column(
            children: [_buildFiltersSection(), _buildBodyContent()],
          ),
        ),
      ),
    );
  }

  Widget _buildBodyContent() {
    return isTableView
        ? _buildDataSection(context)
        : const HREmpCalendarViewWidget();
  }

  Widget _buildFiltersSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          // View Toggle
          Row(
            children: [
              GestureDetector(
                onTap: () {
                  setState(() {
                    isTableView = true;
                  });
                },
                child: _buildViewToggle("Table View", isTableView),
              ),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: () {
                  setState(() {
                    isTableView = false;
                  });
                },
                child: _buildViewToggle("Calendar View", !isTableView),
              ),
            ],
          ),

          if (isTableView)
            Padding(
              padding: ResponsiveHelper.paddingSymmetric(context, vertical: 10),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey[300]!),
                      ),
                      child: TextField(
                        controller: _searchController,
                        onChanged: (value) {
                          setState(() {}); // Trigger rebuild for search
                        },
                        decoration: const InputDecoration(
                          hintText: "Search employees...",
                          hintStyle: TextStyle(fontSize: 14),
                          prefixIcon: Icon(Icons.search, size: 18),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    height: 40,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(Icons.download, color: Colors.white, size: 16),
                        SizedBox(width: 4),
                        Text(
                          "Export",
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                            fontSize: 14,
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
    );
  }

  Widget _buildViewToggle(String text, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary : Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isSelected ? AppColors.primary : Colors.grey[300]!,
        ),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: isSelected ? Colors.white : Colors.grey[700],
          fontWeight: FontWeight.w600,
          fontSize: 14,
        ),
      ),
    );
  }

  Widget _buildDataSection(BuildContext context) {
    final provider = context.watch<HREmployeeApiProvider>();

    if (provider.isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    final attendanceList = provider.getHrAllEmployeeAttendanceListModel?.data?.data;

    if (attendanceList == null || attendanceList.isEmpty) {
      return Center(
        child: Text(
          'No attendance data found',
          style: AppTextStyles.heading2(context),
        ),
      );
    }

    // Filter data based on search
    final filteredData = _filterAttendanceData(attendanceList);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
      decoration: BoxDecoration(
        color: AppColors.whiteColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: AppColors.blackColor.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Data Table
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: DataTable(
                columnSpacing: 20.0,
                dataRowHeight: 70.0,
                headingRowHeight: 50.0,
                headingRowColor: WidgetStateProperty.all(
                  AppColors.txtGreyColor.withAlpha(50),
                ),
                columns: [
                  DataColumn(
                    label: Text(
                      'Employee',
                      style: AppTextStyles.heading2(
                          context,overrideStyle: const TextStyle(fontSize: 14)
                      ),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'Status',
                      style: AppTextStyles.heading2(
                          context,overrideStyle: const TextStyle(fontSize: 14)
                      ),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'Check In',
                      style: AppTextStyles.heading2(
                          context,overrideStyle: const TextStyle(fontSize: 14)
                      ),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'Check Out',
                      style: AppTextStyles.heading2(
                          context,overrideStyle: const TextStyle(fontSize: 14)
                      ),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'Duration',
                      style: AppTextStyles.heading2(
                          context,overrideStyle: const TextStyle(fontSize: 14)
                      ),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'Location',
                      style: AppTextStyles.heading2(
                          context,overrideStyle: const TextStyle(fontSize: 14)
                      ),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'Actions',
                      style: AppTextStyles.heading2(
                          context,overrideStyle: const TextStyle(fontSize: 14)
                      ),
                    ),
                  ),
                ],
                rows: filteredData.asMap().entries.map((entry) {
                  final index = entry.key;
                  final data = entry.value;

                  return DataRow(
                    color: WidgetStateProperty.all(
                      index.isEven
                          ? AppColors.whiteColor
                          : AppColors.txtGreyColor.withAlpha(10),
                    ),
                    cells: [
                      // Cell 1: Employee
                      DataCell(
                        Row(
                          children: [
                            // Photo Container
                            Container(
                              width: ResponsiveHelper.containerWidth(context, 40),
                              height: ResponsiveHelper.containerHeight(context, 40),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: _getStatusColor(data.status ?? 'Absent'),
                                  width: 2,
                                ),
                              ),
                              child: ClipOval(
                                child: (data.photo?.publicUrl != null && data.photo!.publicUrl!.isNotEmpty)
                                    ? Image.network(
                                  data.photo!.publicUrl!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Container(
                                      color: AppColors.primary.withOpacity(0.1),
                                      child: Icon(
                                        Icons.person,
                                        size: ResponsiveHelper.iconSize(context, 24),
                                        color: AppColors.primary,
                                      ),
                                    );
                                  },
                                  loadingBuilder: (context, child, loadingProgress) {
                                    if (loadingProgress == null) return child;
                                    return Container(
                                      color: AppColors.primary.withOpacity(0.1),
                                      child: Center(
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          valueColor: AlwaysStoppedAnimation<Color>(
                                            AppColors.primary,
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                )
                                    : Container(
                                  color: AppColors.primary.withOpacity(0.1),
                                  child: Icon(
                                    Icons.person,
                                    size: ResponsiveHelper.iconSize(context, 24),
                                    color: AppColors.primary,
                                  ),
                                ),
                              ),
                            ),
                            ResponsiveHelper.sizedBoxWidth(context, 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    data.name ?? 'Unknown',
                                    style: AppTextStyles.heading2(
                                      context,
                                      overrideStyle: const TextStyle(fontSize: 14),
                                    ),
                                  ),
                                  Text(
                                    data.email ?? '--',
                                    style: AppTextStyles.caption(context),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Cell 2: Status
                      DataCell(
                        Container(
                          padding: ResponsiveHelper.paddingSymmetric(context,horizontal: 10,vertical: 4),
                          decoration: BoxDecoration(
                            color: _getStatusColor(data.status ?? 'Absent').withAlpha(20),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                _getStatusIcon(data.status ?? 'Absent'),
                                size: AppTextStyles.fontSize(context, 12),
                                color: _getStatusColor(data.status ?? 'Absent'),
                              ),
                              const SizedBox(width: 4),
                              Flexible(
                                child: Text(
                                  data.status ?? 'Absent',
                                  style: AppTextStyles.caption(context)
                                      .copyWith(
                                    fontWeight: FontWeight.w600,
                                    color: _getStatusColor(data.status ?? 'Absent'),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      // Cell 3: Check In
                      DataCell(
                        Text(
                          data.loginTime != null ? _formatTime(data.loginTime) : '--',
                          style: AppTextStyles.caption(
                            context,
                          ).copyWith(fontWeight: FontWeight.w500),
                        ),
                      ),
                      // Cell 4: Check Out
                      DataCell(
                        Text(
                          data.logoutTime != null ? _formatTime(data.logoutTime) : '--',
                          style: AppTextStyles.caption(
                            context,
                          ).copyWith(color: AppColors.txtGreyColor),
                        ),
                      ),
                      // Cell 5: Duration
                      DataCell(
                        Text(
                          data.workingHours ?? _getWorkingHours(data.loginTime, data.logoutTime),
                          style: AppTextStyles.caption(
                            context,
                          ).copyWith(fontWeight: FontWeight.w500),
                        ),
                      ),
                      // Cell 6: Location
                      DataCell(
                        Text(
                          data.location?.name ?? 'Office',
                          style: AppTextStyles.caption(
                            context,
                          ).copyWith(color: AppColors.txtGreyColor),
                        ),
                      ),
                      // Cell 7: Actions (MUST HAVE THIS 7th CELL)
                      DataCell(
                        PopupMenuButton<String>(
                          color: Colors.white,
                          icon: Icon(
                            Icons.more_vert,
                            size: AppTextStyles.fontSize(context, 18),
                            color: AppColors.txtGreyColor,
                          ),
                          onSelected: (String value) {
                            _handleMenuAction(value, data);
                          },
                          itemBuilder: (BuildContext context) => [
                            PopupMenuItem<String>(
                              value: 'edit',
                              child: Row(
                                children: [
                                  const Icon(Icons.edit, size: 16),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Edit',
                                    style: AppTextStyles.caption(context).copyWith(
                                      fontWeight: FontWeight.w500,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            PopupMenuItem<String>(
                              value: 'view',
                              child: Row(
                                children: [
                                  const Icon(Icons.visibility, size: 16),
                                  const SizedBox(width: 8),
                                  Text(
                                    'View Details',
                                    style: AppTextStyles.caption(context).copyWith(
                                      fontWeight: FontWeight.w500,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
          // Footer
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.lightBgColor,
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(12),
                bottomRight: Radius.circular(12),
              ),
            ),
            child: Row(
              children: [
                Text(
                  'Showing ${filteredData.length} employees',
                  style: AppTextStyles.body2(
                    context,
                  ).copyWith(color: AppColors.txtGreyColor),
                ),
                const Spacer(),
                Row(
                  children: [
                    IconButton(
                      onPressed: () {},
                      icon: Icon(
                        Icons.chevron_left,
                        color: AppColors.txtGreyColor,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '1',
                        style: AppTextStyles.body2(context).copyWith(
                          color: AppColors.whiteColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () {},
                      icon: Icon(
                        Icons.chevron_right,
                        color: AppColors.txtGreyColor,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  List<AttendanceModel.Data> _filterAttendanceData(List<AttendanceModel.Data> allData) {
    if (_searchController.text.isEmpty) {
      return allData;
    }

    final searchTerm = _searchController.text.toLowerCase();
    return allData.where((data) {
      final employeeName = data.name?.toLowerCase() ?? '';
      final employeeId = data.sId?.toLowerCase() ?? '';
      final status = data.status?.toLowerCase() ?? '';

      return employeeName.contains(searchTerm) ||
          employeeId.contains(searchTerm) ||
          status.contains(searchTerm);
    }).toList();
  }

  void _handleMenuAction(String value, AttendanceModel.Data attendanceData) {
    switch (value) {
      case 'edit':
      // Handle edit action
        break;
      case 'view':
      // Handle view details action
        break;
    }
  }

  // void _handleMenuAction(String value, Data attendanceData) {
  //   switch (value) {
  //     case 'edit':
  //       // Handle edit action
  //       break;
  //     case 'view':
  //       // Handle view details action
  //       break;
  //   }
  // }
}
