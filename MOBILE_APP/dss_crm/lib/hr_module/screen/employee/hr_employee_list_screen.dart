import 'dart:math';
import 'package:dss_crm/hr_module/controller/hr_employee_api_provider.dart';
import 'package:dss_crm/hr_module/screen/employee/hr_employee_detail_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/model/hr_employee_list_model.dart'
as empListDataModel;
import 'package:dss_crm/hr_module/screen/employee/update_employee_screen.dart';
import 'package:dss_crm/sales_module/sales_tl/employee/employee_list_model.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../../utils/string_utils.dart';

class HREmployeeListScreen extends StatefulWidget {
  const HREmployeeListScreen({super.key});

  @override
  State<HREmployeeListScreen> createState() => _HREmployeeListScreenState();
}

class _HREmployeeListScreenState extends State<HREmployeeListScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchEmployeeList();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _fetchEmployeeList() {
    Provider.of<HREmployeeApiProvider>(context, listen: false)
        .getAllHREmpList(context);
  }

  void _onSearchChanged(String value) {
    setState(() => _searchQuery = value.toLowerCase());
  }

  List<empListDataModel.Data> _getFilteredEmployees(List<empListDataModel.Data>? employees) {
    if (employees == null) return [];

    if (_searchQuery.isEmpty) {
      return employees;
    }

    return employees.where((employee) {
      return (employee.name?.toLowerCase().contains(_searchQuery) ?? false) ||
          (employee.email?.toLowerCase().contains(_searchQuery) ?? false) ||
          (employee.employeeId?.toLowerCase().contains(_searchQuery) ?? false);
    }).toList();
  }

  final List<Color> avatarBgColors = [
    Colors.blue.shade50,
    Colors.green.shade50,
    Colors.pink.shade50,
    Colors.orange.shade50,
    Colors.purple.shade50,
    Colors.teal.shade50,
    Colors.amber.shade50,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteColor,
      appBar: DefaultCommonAppBar(
        activityName: "All Employee",
        backgroundColor: AppColors.primary,
        actionIcons: const [Icons.refresh],
        onActionTap: [
              () {
            _fetchEmployeeList();
          },
        ],
      ),
      body: Column(
        children: [
          // Search Section
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: ResponsiveHelper.spacing(context, 10),
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Padding(
              padding: ResponsiveHelper.paddingSymmetric(
                context,
                horizontal: 12,
                vertical: 12,
              ),
              child: CustomTextField(
                controller: _searchController,
                hintText: 'Search by name, email or ID...',
                prefixIcon: Icons.search_rounded,
                validationType: ValidationType.none,
                onChanged: _onSearchChanged,
                onClear: () {
                  _searchController.clear();
                  _onSearchChanged('');
                },
                suffixIcon: null,
              ),
            ),
          ),

          // Employee List
          Expanded(
            child: Consumer<HREmployeeApiProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        LoadingIndicatorUtils(),
                        SizedBox(height: ResponsiveHelper.spacing(context, 16)),
                        Text(
                          'Loading employees...',
                          style: AppTextStyles.caption(context),
                        ),
                      ],
                    ),
                  );
                }

                if (provider.errorMessage.isNotEmpty) {
                  return Center(
                    child: Text(
                      provider.errorMessage,
                      style: AppTextStyles.heading2(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 12),
                        ),
                      ),
                    ),
                  );
                }

                final hrEmployeeListData = provider.getAllEmployeeListModel?.data?.data;

                if (hrEmployeeListData == null || hrEmployeeListData.isEmpty) {
                  return _buildEmptyState(
                    icon: Icons.people_outline,
                    title: 'No Employees Yet',
                    subtitle: 'Start by adding your first employee',
                  );
                }

                final filteredEmployees = _getFilteredEmployees(hrEmployeeListData);

                if (filteredEmployees.isEmpty) {
                  return _buildEmptyState(
                    icon: Icons.search_off_rounded,
                    title: 'No Results Found',
                    subtitle: 'Try adjusting your search',
                  );
                }

                return ListView.builder(
                  padding: EdgeInsets.fromLTRB(
                    ResponsiveHelper.spacing(context, 16),
                    ResponsiveHelper.spacing(context, 12),
                    ResponsiveHelper.spacing(context, 16),
                    ResponsiveHelper.spacing(context, 16),
                  ),
                  itemCount: filteredEmployees.length,
                  itemBuilder: (context, index) {
                    final employee = filteredEmployees[index];
                    return EmployeeListItem(
                      employeData: employee,
                      index: index,
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(ResponsiveHelper.spacing(context, 20)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(ResponsiveHelper.spacing(context, 0)),
              decoration: const BoxDecoration(
                color: AppColors.whiteColor,
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: ResponsiveHelper.iconSize(context, 64),
                color: Colors.grey[400],
              ),
            ),
            SizedBox(height: ResponsiveHelper.spacing(context, 16)),
            Text(
              title,
              style: AppTextStyles.heading1(context).copyWith(
                fontSize: ResponsiveHelper.fontSize(context, 16),
              ),
            ),
            SizedBox(height: ResponsiveHelper.spacing(context, 8)),
            Text(
              subtitle,
              style: AppTextStyles.caption(
                context,
                overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 10),
                ),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}


class EmployeeListItem extends StatelessWidget {
  final empListDataModel.Data employeData;
  final int index;

  EmployeeListItem({
    Key? key,
    required this.employeData,
    required this.index,
  }) : super(key: key);

  // Professional CRM color scheme
  final List<Color> statusColors = [
    const Color(0xFF2196F3), // Blue
    const Color(0xFF4CAF50), // Green
    const Color(0xFFFF9800), // Orange
    const Color(0xFF9C27B0), // Purple
    const Color(0xFF00BCD4), // Cyan
    const Color(0xFFE91E63), // Pink
    const Color(0xFFFFB300), // Amber
  ];

  @override
  Widget build(BuildContext context) {
    final statusColor = statusColors[index % statusColors.length];

    // Safe photo URL
    final String? photoUrl = employeData.photo?.publicUrl;
    final bool hasPhoto = photoUrl != null && photoUrl.isNotEmpty;

    return Container(
      margin: ResponsiveHelper.paddingOnly(context,bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () async {
            final employeeId = employeData.sId;
            if (employeeId == null) return;

            print("Employee Detail ID: $employeeId");
            await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => HREmployeeDetailScreen(
                  employeeId: employeeId,
                ),
              ),
            );
          },
          borderRadius: BorderRadius.circular(12),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  // Professional Avatar
                  Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Container(
                        width: ResponsiveHelper.containerWidth(context, 60),
                        height: ResponsiveHelper.containerHeight(context, 60),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: statusColor.withOpacity(0.1),
                          border: Border.all(
                            color: statusColor.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        child: ClipOval(
                          child: hasPhoto
                              ? Image.network(
                            photoUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Icon(
                                Icons.person,
                                size: ResponsiveHelper.iconSize(context,28),
                                color: statusColor.withOpacity(0.6),
                              );
                            },
                          )
                              : Icon(
                            Icons.person,
                            size: ResponsiveHelper.iconSize(context,28),
                            color: statusColor.withOpacity(0.6),
                          ),
                        ),
                      ),
                    ],
                  ),
                  ResponsiveHelper.sizedBoxWidth(context,14),

                  // Employee Info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Name & Role
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                StringUtils.capitalizeEachWord(
                                  employeData.name ?? "N/A",
                                ),
                                style: AppTextStyles.heading1(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(context, 12),
                                  ),
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 2),

                        // Email
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                employeData.email ?? "N/A",
                                style: AppTextStyles.body1(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(context, 10),
                                  ),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),

                        ResponsiveHelper.sizedBoxHeight(context, 2),
                        // Employee ID Badge
                        Container(
                          padding: ResponsiveHelper.paddingSymmetric(
                            context,
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF0F4F8),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                employeData.employeeId ?? "N/A",
                                style: AppTextStyles.heading1(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(context, 8),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        ResponsiveHelper.sizedBoxHeight(context,1),

                      ],
                    ),
                  ),
                  ResponsiveHelper.sizedBoxWidth(context,10),
                  // Action Button
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.orangeColor.withAlpha(30),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () {
                          final employeeId = employeData.sId;
                          if (employeeId == null) return;

                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => UpdateEmployeeScreen(
                                employeeId: employeeId,
                              ),
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(10),
                        child: Padding(
                          padding: ResponsiveHelper.paddingAll(context,8),
                          child: Icon(
                            Icons.edit_outlined,
                            color: AppColors.orangeColor,
                            size: ResponsiveHelper.iconSize(context, 18),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}