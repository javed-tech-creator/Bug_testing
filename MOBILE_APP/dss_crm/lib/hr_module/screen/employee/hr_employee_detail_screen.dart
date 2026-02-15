import 'dart:math';
import 'package:dss_crm/hr_module/controller/hr_employee_api_provider.dart';
import 'package:dss_crm/hr_module/screen/employee/emp_document_module/add_employee_documents_screen.dart';
import 'package:dss_crm/hr_module/screen/employee/model/hr_employee_list_detail_model.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../../utils/storage_util.dart';
import '../../../utils/string_utils.dart';

class HREmployeeDetailScreen extends StatefulWidget {
  final String employeeId;

  const HREmployeeDetailScreen({Key? key, required this.employeeId})
    : super(key: key);

  @override
  State<HREmployeeDetailScreen> createState() => _HREmployeeDetailScreenState();
}

class _HREmployeeDetailScreenState extends State<HREmployeeDetailScreen>  with SingleTickerProviderStateMixin {

  late TabController _tabController;
  final List<Map<String, dynamic>> _tabs = [
    {"name": "Personal Information", "icon": Icons.person},
    {"name": "Work Details", "icon": Icons.work_history_outlined},
    {"name": "Bank & Salary", "icon": Icons.account_balance},
    {"name": "Documents", "icon": Icons.file_download_outlined},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<HREmployeeApiProvider>(
        context,
        listen: false,
      ).getHREmployeeDetail(widget.employeeId);
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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

  void _previewImage(BuildContext context, String imageUrl) {
    showDialog(
      context: context,
      barrierColor: Colors.black87,
      builder: (_) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.all(20),
        child: Stack(
          children: [
            // Main Image Container
            Center(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.white.withOpacity(0.3),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    constraints: BoxConstraints(
                      maxHeight: MediaQuery.of(context).size.height * 0.8,
                      maxWidth: MediaQuery.of(context).size.width * 0.9,
                    ),
                    child: InteractiveViewer(
                      minScale: 0.5,
                      maxScale: 4.0,
                      child: Image.network(
                        imageUrl,
                        fit: BoxFit.contain,
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return Container(
                            color: Colors.grey.shade900,
                            child: Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  CircularProgressIndicator(
                                    value:
                                        loadingProgress.expectedTotalBytes !=
                                            null
                                        ? loadingProgress
                                                  .cumulativeBytesLoaded /
                                              loadingProgress
                                                  .expectedTotalBytes!
                                        : null,
                                    color: Colors.white,
                                  ),
                                  ResponsiveHelper.sizedBoxHeight(context, 14),
                                  Text(
                                    'Loading image...',
                                      style: AppTextStyles.heading1(
                                        context,
                                        overrideStyle: TextStyle(
                                          fontSize: ResponsiveHelper.fontSize(context, 14),
                                        ),
                                      )
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                        errorBuilder: (_, __, ___) => Container(
                          padding: ResponsiveHelper.paddingAll(context,36),
                          color: Colors.grey.shade900,
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.broken_image_outlined,
                                  color: Colors.white70,
                                  size: 64,
                                ),
                                SizedBox(height: 16),
                                Text(
                                  'Image not found',
                                    style: AppTextStyles.heading1(
                                      context,
                                      overrideStyle: TextStyle(
                                        color: Colors.white,
                                        fontSize: ResponsiveHelper.fontSize(context, 14),
                                      ),
                                    )
                                ),
                                SizedBox(height: 8),
                                Text(
                                  'Unable to load image',
                                    style: AppTextStyles.heading1(
                                      context,
                                      overrideStyle: TextStyle(
                                        color: Colors.white,
                                        fontSize: ResponsiveHelper.fontSize(context, 14),
                                      ),
                                    )
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Close Button - Top Right
            Positioned(
              top: 10,
              right: 10,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.6),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 8,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => Navigator.pop(context),
                    borderRadius: BorderRadius.circular(50),
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      child:  Icon(
                        Icons.close_rounded,
                        color: Colors.white,
                        size: ResponsiveHelper.iconSize(context, 22),
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Optional: Zoom hint text (bottom center)
            Positioned(
              bottom: 20,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children:  [
                      Icon(Icons.zoom_in, color: Colors.white70,
                        size: ResponsiveHelper.iconSize(context, 16),),
                      SizedBox(width: 8),
                      Text(
                        'Pinch to zoom',
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.white,
                              fontSize: ResponsiveHelper.fontSize(context, 10),
                            ),
                          )
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBgColor,
      appBar: const DefaultCommonAppBar(
        activityName: "Profile",
        backgroundColor: AppColors.primary,
      ),
      body: Column(
        children: [
          // Tab Bar
          Container(
            color: AppColors.primary,
            child: TabBar(
              controller: _tabController,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              labelColor: AppColors.whiteColor,
              unselectedLabelColor: AppColors.whiteColor.withOpacity(0.7),
              indicatorColor: AppColors.whiteColor,
              indicatorWeight: 4.0,
              labelStyle: AppTextStyles.heading1(
                context,
                overrideStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
              tabs: _tabs
                  .map(
                    (tab) => Tab(
                      text: tab["name"],
                      icon: Icon(tab["icon"], size: ResponsiveHelper.iconSize(context, 18)),
                    ),
                  )
                  .toList(),
            ),
          ),
          // Tab Bar View
          Expanded(
            child: Consumer<HREmployeeApiProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return LoadingIndicatorUtils();
                }
                if (provider.errorMessage.isNotEmpty) {
                  return Center(
                    child: Text(
                      provider.errorMessage,
                      style: AppTextStyles.heading2(context),
                    ),
                  );
                }

                final employee = provider.employeeListDetailModel?.data;
                if (employee == null) {
                  return const Center(child: Text('No employee data found.'));
                }

                return TabBarView(
                  controller: _tabController,
                  children: [
                    // === TAB 1: Personal Information ===
                    _buildPersonalInfoTab(employee),

                    // === TAB 2: Work Details ===
                    _buildWorkDetailsTab(employee),

                    // === TAB 3: Bank & Salary ===
                    _buildBankSalaryTab(employee),

                    // === TAB 4: Documents ===
                    AddEmpDocumentUploadWidget(empId: widget.employeeId),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPersonalInfoTab(Data employee) {
    return RefreshIndicator(
      onRefresh: () => Provider.of<HREmployeeApiProvider>(
        context,
        listen: false,
      ).getHREmployeeDetail(widget.employeeId),
      child: SingleChildScrollView(
        padding: ResponsiveHelper.paddingAll(context,1),
        child: Column(
          children: [
            // Profile Header
            _buildProfileHeader(employee),

            ResponsiveHelper.sizedBoxHeight(context, 18),

            // Personal Details
            _buildSectionCard(
              title: "Personal Details",
              children: [
                _ProfileField(label: "Full Name", value: employee.name ?? '-'),
                _ProfileField(label: "Email", value: employee.email ?? '-'),
                _ProfileField(
                  label: "Work Email",
                  value: employee.workEmail ?? '-',
                ),
                _ProfileField(label: "Phone", value: employee.phone ?? '-'),
                _ProfileField(
                  label: "Alternate No",
                  value: employee.alternateNo ?? '-',
                ),
                _ProfileField(
                  label: "WhatsApp",
                  value: employee.whatsapp ?? '-',
                ),
                _ProfileField(
                  label: "Date of Birth",
                  value: employee.dob != null
                      ? DateFormatterUtils.formatToShortMonth(employee.dob!)
                      : '-',
                ),
                _ProfileField(
                  label: "Gender",
                  value: StringUtils.capitalizeFirstLetter(
                    employee.gender ?? '-',
                  ),
                ),
                _ProfileField(
                  label: "Marital Status",
                  value: StringUtils.capitalizeFirstLetter(
                    employee.maritalStatus ?? '-',
                  ),
                ),
                _ProfileField(
                  label: "Blood Group",
                  value: employee.bloodGroup ?? '-',
                ),
                _ProfileField(
                  label: "Qualification",
                  value: StringUtils.toUpperCase(employee.qualification ?? '-'),
                ),
              ],
            ),
            ResponsiveHelper.sizedBoxHeight(context, 14),
            // Address Details
            _buildSectionCard(
              title: "Address Details",
              children: [
                _ProfileField(
                  label: "Current Address",
                  value: StringUtils.capitalizeEachWord(
                    employee.currentAddress ?? '-',
                  ),
                ),
                _ProfileField(
                  label: "Permanent Address",
                  value: StringUtils.capitalizeEachWord(
                    employee.permanentAddress ?? '-',
                  ),
                ),
                _ProfileField(label: "Country", value: employee.country ?? '-'),
                _ProfileField(
                  label: "Zone",
                  value: StringUtils.capitalizeFirstLetter(
                    employee.zoneId?.title ?? '-',
                  ),
                ),
                _ProfileField(
                  label: "State",
                  value: StringUtils.capitalizeFirstLetter(
                      employee.stateId?.title ?? '-'
                    // employee.state?.toString().trim().isNotEmpty == true
                    //     ? employee.state!
                    //     : employee.stateId?.title ?? '-',
                  ),
                ),
                _ProfileField(
                  label: "City",
                  value: StringUtils.capitalizeFirstLetter(
                      employee.cityId?.title ?? '-'
                    // employee.city?.toString().trim().isNotEmpty == true
                    //     ? employee.city!
                    //     : employee.cityId?.title ?? '-',
                  ),
                ),

                _ProfileField(
                  label: "Branch",
                  value: StringUtils.capitalizeFirstLetter(
                    employee.branchId?.title ?? '-',
                  ),
                ),
                _ProfileField(
                  label: "Department",
                  value: StringUtils.capitalizeFirstLetter(
                    employee.departmentId?.title ?? '-',
                  ),
                ),
                _ProfileField(
                  label: "Designation",
                  value: StringUtils.capitalizeFirstLetter(
                    employee.designationId?.title ?? '-',
                  ),
                ),
              ],
            ),

            ResponsiveHelper.sizedBoxHeight(context, 14),
            // Emergency Contact
            if (employee.emergencyContact != null)
              _buildSectionCard(
                title: "Emergency Contact",
                children: [
                  _ProfileField(
                    label: "Name",
                    value: (employee.emergencyContact?.name?.trim().isNotEmpty == true)
                        ? StringUtils.capitalizeEachWord(employee.emergencyContact!.name!)
                        : '-',
                  ),
                  _ProfileField(
                    label: "Relation",
                    value: (employee.emergencyContact?.relation?.trim().isNotEmpty == true)
                        ? StringUtils.capitalizeFirstLetter(employee.emergencyContact!.relation!)
                        : '-',
                  ),
                  _ProfileField(
                    label: "Phone",
                    value: (employee.emergencyContact?.phone?.trim().isNotEmpty == true)
                        ? employee.emergencyContact!.phone!
                        : '-',
                  ),

                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkDetailsTab(Data employee) {
    return SingleChildScrollView(
      padding: ResponsiveHelper.paddingAll(context,1),
      child: Column(
        children: [
          _buildSectionCard(
            title: "Official Details",
            children: [
              _ProfileField(
                label: "Employee ID",
                value: employee.employeeId ?? '-',
              ),
              _ProfileField(
                label: "Joining Date",
                value: employee.joiningDate != null
                    ? DateFormatterUtils.formatToLongDate(employee.joiningDate!)
                    : '-',
              ),
              _ProfileField(
                label: "Employee Type",
                value: StringUtils.capitalizeEachWord(
                  employee.employeeType ?? '-',
                ),
              ),
              _ProfileField(
                label: "Probation Period",
                value: employee.probationPeriod ?? '-',
              ),
              _ProfileField(
                label: "Training Period",
                value: employee.trainingPeriod ?? '-',
              ),
              _ProfileField(
                label: "Work Location",
                value: StringUtils.capitalizeEachWord(
                  employee.workLocation ?? '-',
                ),
              ),
              _ProfileField(
                label: "Status",
                value: StringUtils.capitalizeFirstLetter(
                  employee.status ?? '-',
                ),
              ),
            ],
          ),

          ResponsiveHelper.sizedBoxHeight(context, 14),
          // Branch & Department Info
          _buildSectionCard(
            title: "Organization Details",
            children: [
              _ProfileField(
                label: "Branch",
                value: employee.branchId?.title ?? '-',
              ),
              _ProfileField(
                label: "Department",
                value: employee.departmentId?.title ?? '-',
              ),
              _ProfileField(
                label: "Designation",
                value: employee.designationId?.title ?? '-',
              ),
              _ProfileField(
                label: "State",
                value: employee.stateId?.title ?? '-',
              ),
              _ProfileField(
                label: "City",
                value: employee.cityId?.title ?? '-',
              ),
              _ProfileField(
                label: "Zone",
                value: employee.zoneId?.title ?? '-',
              ),
            ],
          ),

        ResponsiveHelper.sizedBoxHeight(context, 14),

          // PF & ESIC
          _buildSectionCard(
            title: "Statutory Details",
            children: [
              _ProfileField(
                label: "PF Account No",
                value: employee.pfAccountNo ?? '-',
              ),
              _ProfileField(label: "UAN", value: employee.uan ?? '-'),
              _ProfileField(label: "ESIC No", value: employee.esicNo ?? '-'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBankSalaryTab(Data employee) {
    return SingleChildScrollView(
      padding: ResponsiveHelper.paddingAll(context,1),
      child: Column(
        children: [
          // Bank Details
          if (employee.bankDetail != null)
            _buildSectionCard(
              title: "Bank Details",
              children: [
                _ProfileField(
                  label: "Bank Name",
                  value: employee.bankDetail!.bankName ?? '-',
                ),
                _ProfileField(
                  label: "Account Holder",
                  value: employee.bankDetail!.accountHolderName ?? '-',
                ),
                _ProfileField(
                  label: "Account Number",
                  value: employee.bankDetail!.accountNumber?.toString() ?? '-',
                ),
                _ProfileField(
                  label: "IFSC Code",
                  value: employee.bankDetail!.ifscCode ?? '-',
                ),
                _ProfileField(
                  label: "Branch Name",
                  value: employee.bankDetail!.branchName ?? '-',
                ),
              ],
            ),

          ResponsiveHelper.sizedBoxHeight(context, 14),

          // Salary Details
          if (employee.salary != null)
            _buildSectionCard(
              title: "Salary Breakdown (CTC)",
              children: [
                _ProfileField(
                  label: "CTC",
                  value: employee.salary!.ctc != null
                      ? "₹ ${employee.salary!.ctc}"
                      : '-',
                ),
                _ProfileField(
                  label: "Basic",
                  value: employee.salary!.basic != null
                      ? "₹ ${employee.salary!.basic}"
                      : '-',
                ),
                _ProfileField(
                  label: "HRA",
                  value: employee.salary!.hra != null
                      ? "₹ ${employee.salary!.hra}"
                      : '-',
                ),
                _ProfileField(
                  label: "Allowances",
                  value: employee.salary!.allowances != null
                      ? "₹ ${employee.salary!.allowances}"
                      : '-',
                ),
                _ProfileField(
                  label: "Deductions",
                  value: employee.salary!.deductions != null
                      ? "₹ ${employee.salary!.deductions}"
                      : '-',
                ),
              ],
            ),
        ],
      ),
    );
  }

  Widget _buildProfileHeader(Data employee) {
    final int colorIndex = (employee.sId?.hashCode ?? 0).abs() % avatarBgColors.length;
    final String? photoUrl = employee.photo?.publicUrl ?? employee.photo?.url;

    return Container(
      padding: ResponsiveHelper.paddingAll(context,10),
      decoration: BoxDecoration(
        color: Colors.white,
        // borderRadius: BorderRadius.circular(12),
        // boxShadow: [
        //   BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 2)),
        // ],
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () {
              if (photoUrl != null && photoUrl.isNotEmpty) {
                _previewImage(context, photoUrl);
              }
            },
            child: Container(
              padding:ResponsiveHelper.paddingAll(context,2),
              decoration: BoxDecoration(
                color: avatarBgColors[colorIndex],
                shape: BoxShape.circle,
              ),
              child: CircleAvatar(
                radius: 36,
                backgroundColor: Colors.white,
                backgroundImage: photoUrl != null && photoUrl.isNotEmpty
                    ? NetworkImage(photoUrl)
                    : null,
                child: photoUrl == null || photoUrl.isEmpty
                    ? Icon(Icons.person, size: ResponsiveHelper.iconSize(context,48), color: Colors.grey[600])
                    : null,
              ),
            ),
          ),
         ResponsiveHelper.sizedBoxWidth(context, 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  employee.name ?? 'N/A',
                  style: AppTextStyles.heading2(context).copyWith(fontSize: 14),
                ),
                Text(
                  employee.email ?? 'N/A',
                  style: AppTextStyles.body2(
                    context,
                  ).copyWith(color: Colors.grey[700],fontSize: 12),
                ),
                if (employee.employeeId != null)
                  Text(
                    employee.employeeId.toString() ?? "N/A",
                      style: AppTextStyles.heading1(
                        context,
                        overrideStyle: TextStyle(
                          color: AppColors.blueColor,
                          fontSize: ResponsiveHelper.fontSize(context, 10),
                        ),
                      )
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required List<Widget> children,
  }) {
    return Container(
      width: double.infinity,
      padding:ResponsiveHelper.paddingAll(context,14),
      decoration: BoxDecoration(
        color: Colors.white,
        // borderRadius: BorderRadius.circular(12),
        // boxShadow: [
        //   BoxShadow(color: Colors.black12, blurRadius: 6, offset: Offset(0, 2)),
        // ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: AppTextStyles.heading2(
              context,
            ).copyWith(color: AppColors.primary, fontSize: 15),
          ),
        ResponsiveHelper.sizedBoxHeight(context, 10),
          ...children,
        ],
      ),
    );
  }
}

class _ProfileField extends StatelessWidget {
  final String label;
  final String value;

  const _ProfileField({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:ResponsiveHelper.paddingSymmetric(context,vertical:4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              "$label:",
              style: AppTextStyles.heading1(
                context,
                overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 10),
                ),
              )
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 10),
                  ),
                )
            ),
          ),
        ],
      ),
    );
  }
}
