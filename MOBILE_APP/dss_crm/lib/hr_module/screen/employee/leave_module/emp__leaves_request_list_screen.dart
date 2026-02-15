import 'package:dss_crm/hr_module/screen/employee/leave_module/model/all_emp_leave_requests_model.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../../../utils/string_utils.dart';
import 'admin_leave_api_provider.dart';



class EmployeeLeaveRequestListScreen extends StatefulWidget {
  const EmployeeLeaveRequestListScreen({Key? key}) : super(key: key);

  @override
  State<EmployeeLeaveRequestListScreen> createState() =>
      _EmployeeLeaveRequestListScreenState();
}

class _EmployeeLeaveRequestListScreenState
    extends State<EmployeeLeaveRequestListScreen> with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  String? selectedDepartment;
  String? selectedStatus;
  String? selectedMonth;
  String? selectedYear;
  String? entriesPerPage = '50';

  List<Data> filteredLeaves = [];
  bool showFilters = false;
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _animation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );

    Future.microtask(
          () => Provider.of<HREmployeeLeaveApiProvider>(
        context,
        listen: false,
      ).getAllLeaveRequests(),
    );
  }

  void _toggleFilters() {
    setState(() {
      showFilters = !showFilters;
      if (showFilters) {
        _animationController.forward();
      } else {
        _animationController.reverse();
      }
    });
  }

  void _refreshData() {
    Provider.of<HREmployeeLeaveApiProvider>(context, listen: false)
        .getAllLeaveRequests();
    setState(() {
      _searchController.clear();
      selectedDepartment = null;
      selectedStatus = null;
      selectedMonth = null;
      selectedYear = null;
      entriesPerPage = '50';
    });
  }

  void _applyFilters(List<Data> allLeaves) {
    filteredLeaves = allLeaves.where((leave) {
      // Search filter
      if (_searchController.text.isNotEmpty) {
        final searchText = _searchController.text.toLowerCase();
        final name = leave.employeeId?.name?.toLowerCase() ?? '';
        final email = leave.employeeId?.email?.toLowerCase() ?? '';
        if (!name.contains(searchText) && !email.contains(searchText)) {
          return false;
        }
      }

      // Department filter
      if (selectedDepartment != null && selectedDepartment != 'All') {
        if (leave.employeeId?.departmentId?.title != selectedDepartment) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus != null && selectedStatus != 'All') {
        if (leave.status?.toLowerCase() != selectedStatus?.toLowerCase()) {
          return false;
        }
      }

      // Month filter
      if (selectedMonth != null && selectedMonth != 'All') {
        try {
          final leaveDate = DateTime.parse(leave.startDate ?? '');
          final monthName = DateFormat('MMMM').format(leaveDate);
          if (monthName != selectedMonth) {
            return false;
          }
        } catch (_) {}
      }

      // Year filter
      if (selectedYear != null && selectedYear != 'All') {
        try {
          final leaveDate = DateTime.parse(leave.startDate ?? '');
          if (leaveDate.year.toString() != selectedYear) {
            return false;
          }
        } catch (_) {}
      }

      return true;
    }).toList();

    // Apply entries limit
    final limit = int.parse(entriesPerPage ?? '50');
    if (limit < filteredLeaves.length) {
      filteredLeaves = filteredLeaves.sublist(0, limit);
    }
  }

  List<String> _getDepartments(List<Data> leaves) {
    final departments = leaves
        .where((l) => l.employeeId?.departmentId?.title != null)
        .map((l) => l.employeeId!.departmentId!.title!)
        .toSet()
        .toList();
    departments.insert(0, 'All');
    return departments;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: DefaultCommonAppBar(
        activityName: "Leave Requests",
        backgroundColor: AppColors.primary,
        actionIcons: [Icons.refresh, showFilters ? Icons.filter_list : Icons.filter_list_outlined],
        onActionTap: [
              () => _refreshData(),
              () => _toggleFilters(),
        ],
      ),
      body: Consumer<HREmployeeLeaveApiProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const LoadingIndicatorUtils();
          }

          if (provider.errorMessage.isNotEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(
                    provider.errorMessage,
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ],
              ),
            );
          }

          if (provider.empLeaveRequestListModel?.data?.isEmpty ?? true) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.inbox_outlined, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  const Text(
                    "No leave requests found",
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            );
          }

          final allLeaves = provider.empLeaveRequestListModel!.data!;
          _applyFilters(allLeaves);

          final departments = _getDepartments(allLeaves);
          final statusList = ['All', 'Pending', 'Approved', 'Rejected'];
          final monthList = [
            'All',
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
            'December'
          ];
          final yearList = ['All', '2025', '2024', '2023', '2022', '2021'];
          final entriesList = ['10', '25', '50', '100'];

          return Column(
            children: [
              // Search Bar (Always Visible)
              Container(
                color: Colors.white,
                padding: const EdgeInsets.all(16),
                child: TextField(
                  controller: _searchController,
                  onChanged: (value) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Search employee...',
                    hintStyle: TextStyle(color: Colors.grey[400]),
                    prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchController.clear();
                        setState(() {});
                      },
                    )
                        : null,
                    filled: true,
                    fillColor: Colors.grey[100],
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                ),
              ),

              // Animated Filters Section
              SizeTransition(
                sizeFactor: _animation,
                child: Container(
                  color: Colors.white,
                  padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
                  child: Column(
                    children: [
                      // Filter Dropdowns Row 1
                      Row(
                        children: [
                          // Department Filter
                          Expanded(
                            child: ResponsiveDropdown<String>(
                              value: selectedDepartment,
                              itemList: departments,
                              onChanged: (v) => setState(() => selectedDepartment = v),
                              hint: 'Department',
                              label: 'Department',
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Status Filter
                          Expanded(
                            child: ResponsiveDropdown<String>(
                              value: selectedStatus,
                              itemList: statusList,
                              onChanged: (v) => setState(() => selectedStatus = v),
                              hint: 'Status',
                              label: 'Status',
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Filter Dropdowns Row 2
                      Row(
                        children: [
                          // Month Filter
                          Expanded(
                            child: ResponsiveDropdown<String>(
                              value: selectedMonth,
                              itemList: monthList,
                              onChanged: (v) => setState(() => selectedMonth = v),
                              hint: 'Month',
                              label: 'Month',
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Year Filter
                          Expanded(
                            child: ResponsiveDropdown<String>(
                              value: selectedYear,
                              itemList: yearList,
                              onChanged: (v) => setState(() => selectedYear = v),
                              hint: 'Year',
                              label: 'Year',
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Entries Per Page Filter
                      ResponsiveDropdown<String>(
                        value: entriesPerPage,
                        itemList: entriesList,
                        onChanged: (v) => setState(() => entriesPerPage = v),
                        hint: 'Entries per page',
                        label: 'Entries per page',
                      ),
                    ],
                  ),
                ),
              ),

              // Results Count
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                color: Colors.grey[100],
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Showing ${filteredLeaves.length} of ${allLeaves.length} requests',
                      style: TextStyle(
                        color: Colors.grey[700],
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    if (_searchController.text.isNotEmpty ||
                        selectedDepartment != null ||
                        selectedStatus != null ||
                        selectedMonth != null ||
                        selectedYear != null)
                      TextButton.icon(
                        onPressed: () {
                          setState(() {
                            _searchController.clear();
                            selectedDepartment = null;
                            selectedStatus = null;
                            selectedMonth = null;
                            selectedYear = null;
                          });
                        },
                        icon: const Icon(Icons.clear_all, size: 16),
                        label: const Text('Clear Filters'),
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                        ),
                      ),
                  ],
                ),
              ),

              // List
              Expanded(
                child: filteredLeaves.isEmpty
                    ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.search_off, size: 64, color: Colors.grey[400]),
                      const SizedBox(height: 16),
                      const Text(
                        "No matching results found",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextButton(
                        onPressed: () {
                          setState(() {
                            _searchController.clear();
                            selectedDepartment = null;
                            selectedStatus = null;
                            selectedMonth = null;
                            selectedYear = null;
                          });
                        },
                        child: const Text('Clear all filters'),
                      ),
                    ],
                  ),
                )
                    : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filteredLeaves.length,
                  itemBuilder: (context, index) {
                    final leave = filteredLeaves[index];
                    return EmployeeLeaveCard(
                      leave: leave,
                      serialNumber: index + 1,
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    _animationController.dispose();
    super.dispose();
  }
}

class EmployeeLeaveCard extends StatefulWidget {
  final Data leave;
  final int serialNumber;

  const EmployeeLeaveCard({
    Key? key,
    required this.leave,
    required this.serialNumber,
  }) : super(key: key);

  @override
  State<EmployeeLeaveCard> createState() => _EmployeeLeaveCardState();
}

class _EmployeeLeaveCardState extends State<EmployeeLeaveCard> {
  bool showRejectReasonField = false;
  final TextEditingController _reasonController = TextEditingController();

  Color getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'approved':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String formatDate(String? dateStr) {
    if (dateStr == null) return '';
    try {
      return DateFormat('dd MMM yyyy').format(DateTime.parse(dateStr));
    } catch (_) {
      return dateStr;
    }
  }

  String formatBreakDown(String? breakdown) {
    switch (breakdown) {
      case 'full':
        return 'Full Day Leave';
      case 'first_haf':
        return 'First Half Leave';
      case 'second_haf':
        return 'Second Half Leave';
      default:
        return '-';
    }
  }

  Future<void> handleReject(BuildContext context) async {
    if (!showRejectReasonField) {
      setState(() {
        showRejectReasonField = true;
      });
      return;
    }

    final reason = _reasonController.text.trim();
    if (reason.isEmpty) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Reason cannot be empty!',
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 2),
      );
      return;
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          'Confirm Rejection',
          style: TextStyle(color: Colors.black),
        ),
        content: const Text('Are you sure you want to reject this leave?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel')),
          TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Reject', style: TextStyle(color: Colors.red))),
        ],
      ),
    );

    if (confirmed == true) {
      final provider =
      Provider.of<HREmployeeLeaveApiProvider>(context, listen: false);
      await provider.rejectLeave(
        context,
        widget.leave.sId.toString(),
        reason,
      );
      if(provider.leaveRejectedModel?.success == true){
        Future.microtask(
              () => Provider.of<HREmployeeLeaveApiProvider>(
            context,
            listen: false,
          ).getAllLeaveRequests(),
        );
      }
      setState(() {
        showRejectReasonField = false;
        _reasonController.clear();
      });
    }
  }

  Future<void> handleApprove(BuildContext context) async {
    if (!showRejectReasonField) {
      setState(() {
        showRejectReasonField = true;
      });
      return;
    }

    final reason = _reasonController.text.trim();
    if (reason.isEmpty) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Reason cannot be empty!',
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 2),
      );
      return;
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Leave Approval',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 14),
            ),
          ),
        ),
        content: Text(
          'Are you sure you want to approve this leave?',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 12),
            ),
          ),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text(
                'Cancel',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    color: Colors.red,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              )),
          TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text(
                'Approve',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    color: AppColors.primary,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              )),
        ],
      ),
    );

    if (confirmed == true) {
      print("leave id ${ widget.leave.sId.toString()}");
      final provider =  Provider.of<HREmployeeLeaveApiProvider>(context, listen: false);
      await provider.approvedLeave(
        context,
        widget.leave.sId.toString(),
        reason,
      );
      if(provider.leaveApprovedModel?.success == true){
        Future.microtask(
              () => Provider.of<HREmployeeLeaveApiProvider>(
            context,
            listen: false,
          ).getAllLeaveRequests(),
        );
      }
      setState(() {
        showRejectReasonField = false;
        _reasonController.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.leave.employeeId == null) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Card(
        color: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        elevation: 4,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Leave Details
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Serial Number & Name and status
                  Row(
                    children: [
                      // Serial Number Badge
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Center(
                          child: Text(
                            '${widget.serialNumber}',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              StringUtils.capitalizeEachWord(
                                  widget.leave.employeeId!.name.toString().trim()),
                              style: AppTextStyles.heading1(
                                context,
                                overrideStyle: TextStyle(
                                  fontSize: ResponsiveHelper.fontSize(context, 14),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            if (widget.leave.employeeId?.departmentId?.title != null)
                              Text(
                                widget.leave.employeeId!.departmentId!.title!,
                                style: TextStyle(
                                  fontSize: ResponsiveHelper.fontSize(context, 11),
                                  color: Colors.grey[600],
                                ),
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: getStatusColor(widget.leave.status).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          widget.leave.status ?? "Unknown",
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                              color: getStatusColor(widget.leave.status),
                              fontSize: ResponsiveHelper.fontSize(context, 12),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Type Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      widget.leave.leaveType?.toUpperCase() ?? '-',
                      style: TextStyle(
                        color: Colors.blue.shade700,
                        fontSize: ResponsiveHelper.fontSize(context, 11),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Dates
                  Row(
                    children: [
                      Icon(Icons.calendar_month, size: 14, color: Colors.indigo.shade400),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "${formatDate(widget.leave.startDate)} - ${formatDate(widget.leave.endDate)}",
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                                fontSize: ResponsiveHelper.fontSize(context, 12)),
                          ),
                        ),
                      ),
                    ],
                  ),

                  if (widget.leave.description?.isNotEmpty ?? false)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        "Reason: ${widget.leave.description}",
                        style: AppTextStyles.body2(
                          context,
                          overrideStyle: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: ResponsiveHelper.fontSize(context, 12),
                          ),
                        ),
                      ),
                    ),
                  Align(
                    alignment: Alignment.bottomRight,
                    child: Text(
                      "Applied: ${formatDate(widget.leave.appliedAt)}",
                      style: AppTextStyles.body2(
                        context,
                        overrideStyle: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: ResponsiveHelper.fontSize(context, 11),
                          color: Colors.grey[600],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Reject reason field (if shown)
            if (showRejectReasonField)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: TextField(
                  controller: _reasonController,
                  decoration: const InputDecoration(
                    labelText: "Reason",
                    hintText: "Reason",
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 2,
                ),
              ),

            // Action buttons
            if (widget.leave.status?.toLowerCase() == 'pending')
              SizedBox(
                height: 40,
                child: Row(
                  children: [
                    Expanded(
                      child: TextButton(
                        style: TextButton.styleFrom(
                          backgroundColor: const Color(0xFFD3F1EC),
                          shape: const RoundedRectangleBorder(
                            borderRadius: BorderRadius.only(
                              bottomLeft: Radius.circular(15),
                            ),
                          ),
                        ),
                        onPressed: () {
                          handleApprove(context);
                        },
                        child: Text(
                          "Approve",
                          style: AppTextStyles.heading2(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.teal,
                              fontSize: ResponsiveHelper.fontSize(context, 12),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: TextButton(
                        style: TextButton.styleFrom(
                          backgroundColor: const Color(0xFFFBEAEA),
                          shape: const RoundedRectangleBorder(
                            borderRadius: BorderRadius.only(
                              bottomRight: Radius.circular(15),
                            ),
                          ),
                        ),
                        onPressed: () => handleReject(context),
                        child: Text(
                          "Reject",
                          style: AppTextStyles.heading2(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.red,
                              fontSize: ResponsiveHelper.fontSize(context, 12),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }
}