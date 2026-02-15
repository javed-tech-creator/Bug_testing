import 'package:dss_crm/tech_module/tech_manager/controller/tech_manager_api_provider.dart';
import 'package:dss_crm/tech_module/tech_manager/model/data_security_access_controll/tech_data_access_control_list_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart' show Consumer;

import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/form_validations_utils.dart';
import '../../../../utils/responsive_dropdown_utils.dart';

class UpdateAccessControlScreen extends StatefulWidget {

  final Data productData; // existing product data
  final VoidCallback? onDeviceUpdated; // Add this callback


  const UpdateAccessControlScreen({
    Key? key,
    required this.productData,
    this.onDeviceUpdated, // Add this parameter
  }) : super(key: key);


  @override
  State<UpdateAccessControlScreen> createState() => _UpdateAccessControlScreenState();
}

class _UpdateAccessControlScreenState extends State<UpdateAccessControlScreen> {

  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController employeeIdController = TextEditingController(text: "EMP-");
  final TextEditingController loginHistoryController = TextEditingController();

  DateTime? _contractStartDate;
  DateTime? _contractEndDate;
  String? selectedRolePermissionType;
  String? selectedBindingType;
  String? accessControlId="";

  // System Access checkboxes
  Map<String, bool> systemAccess = {
    'Email': false,
    'CRM': false,
    'ERP': false,
    'Server': false,
    'VPN': false,
    'WiFi': false,
    'Door Access': false,
  };

  // Dropdown options
  final List<String> roleList = [
    'Admin',
    'Editor',
    'Viewer'
  ];
  // Dropdown options
  final List<String> deviceBinding = [
    'Laptop',
    'Phone',
    'Tablet'
  ];

  @override
  void initState() {
    super.initState();
    _initializeFormFields();
  }


  void _initializeFormFields() {
    final asset = widget.productData;
    // Initialize Text Controllers
    accessControlId = asset.sId ?? '';
    employeeIdController.text = asset.employeeId ?? '';
    loginHistoryController.text = asset.loginHistory ?? '';
    selectedRolePermissionType = asset.role;
    selectedBindingType = asset.deviceBinding;
    // Initialize System Access checkboxes from the provided data
    if (asset.systemAccess != null) {
      for (var accessItem in asset.systemAccess!) {
        if (systemAccess.containsKey(accessItem)) {
          systemAccess[accessItem] = true;
        }
      }
    }

  }



  Future<void> _selectDate(
      BuildContext context, TextEditingController controller, Function(DateTime) onDateSelected) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null) {
      setState(() {
        controller.text =
        "${picked.day.toString().padLeft(2, '0')}-${picked.month.toString().padLeft(2, '0')}-${picked.year}";
        onDateSelected(picked);
      });
    }
  }

  void _submitForm(TechManagerApiProvider provider) {
    if (_formKey.currentState?.validate() ?? false) {
      // Get selected system access
      List<String> selectedAccess = systemAccess.entries
          .where((entry) => entry.value)
          .map((entry) => entry.key)
          .toList();


      final body = {
        "employeeId": employeeIdController.text,
        "systemAccess": selectedAccess,
        "role": selectedRolePermissionType,
        "loginHistory": loginHistoryController.text,
        "deviceBinding": selectedBindingType,
      };

      // provider.updateTechDevice(context, body,assetId.toString());
      provider.updateTechAccessControl(context, body, accessControlId.toString()).then((_) {
        // Call the callback if provided and update was successful
        if (provider.updateTechAccessControlModelResponse?.success == true) {
          widget.onDeviceUpdated?.call();
        }
      });
    }
  }

  Widget _buildSystemAccessSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header with icon and description
        Container(
          padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 0),
          child: Row(
            children: [
              Icon(
                Icons.security,
                color: AppColors.primary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                'System Access Permissions',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[800],
                ),
              ),
              Text(
                ' *',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.red[600],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Select the systems and services this user can access',
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey[600],
          ),
        ),
        const SizedBox(height: 16),

        // Enhanced access cards container
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey[200]!, width: 1.5),
            borderRadius: BorderRadius.circular(12),
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.04),
                spreadRadius: 1,
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Quick Actions
              Container(
                padding: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(color: Colors.grey[200]!, width: 1),
                  ),
                ),
                child: Row(
                  children: [
                    _buildQuickActionButton(
                      'Select All',
                      Icons.check_circle_outline,
                      Colors.green[600]!,
                          () => _toggleAllAccess(true),
                    ),
                    const SizedBox(width: 12),
                    _buildQuickActionButton(
                      'Clear All',
                      Icons.clear_all,
                      Colors.red[600]!,
                          () => _toggleAllAccess(false),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '${_getSelectedCount()} selected',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Access categories
              _buildAccessCategory(
                'Communication & Collaboration',
                Icons.message,
                Colors.blue,
                ['Email', 'CRM'],
              ),
              const SizedBox(height: 16),

              _buildAccessCategory(
                'Business Systems',
                Icons.business,
                Colors.orange,
                ['ERP'],
              ),
              const SizedBox(height: 16),

              _buildAccessCategory(
                'Network & Infrastructure',
                Icons.network_check,
                Colors.green,
                ['Server', 'VPN', 'WiFi'],
              ),
              const SizedBox(height: 16),

              _buildAccessCategory(
                'Physical Access',
                Icons.door_sliding,
                Colors.purple,
                ['Door Access'],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildQuickActionButton(String text, IconData icon, Color color, VoidCallback onPressed) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          border: Border.all(color: color.withOpacity(0.3)),
          borderRadius: BorderRadius.circular(8),
          color: color.withOpacity(0.05),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 6),
            Text(
              text,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccessCategory(String title, IconData categoryIcon, MaterialColor color, List<String> items) {
    bool isAllSelected = items.every((item) => systemAccess[item] == true);
    bool isSomeSelected = items.any((item) => systemAccess[item] == true);

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isSomeSelected ? color.withOpacity(0.3) : Colors.grey[200]!,
          width: 1,
        ),
        color: isSomeSelected ? color.withOpacity(0.02) : Colors.grey[25],
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          initiallyExpanded: true,
          tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          childrenPadding: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(categoryIcon, size: 18, color: color[600]),
          ),
          title: Row(
            children: [
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[800],
                  ),
                ),
              ),
              InkWell(
                onTap: () => _toggleCategoryAccess(items, !isAllSelected),
                borderRadius: BorderRadius.circular(4),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isAllSelected ? color[600] : Colors.transparent,
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(color: color[300]!),
                  ),
                  child: Text(
                    isAllSelected ? 'All' : 'None',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: isAllSelected ? Colors.white : color[600],
                    ),
                  ),
                ),
              ),
            ],
          ),
          children: [
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
                childAspectRatio: 4,
                crossAxisSpacing: 8,
                mainAxisSpacing: 8,
              ),
              itemCount: items.length,
              itemBuilder: (context, index) {
                return _buildEnhancedCheckboxTile(items[index], color);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEnhancedCheckboxTile(String title, MaterialColor color) {
    bool isSelected = systemAccess[title] ?? false;

    return InkWell(
      onTap: () {
        setState(() {
          systemAccess[title] = !isSelected;
        });
      },
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? color[400]! : Colors.grey[300]!,
            width: isSelected ? 1 : 0.5,
          ),
          color: isSelected ? color.withOpacity(0.1) : Colors.white,
        ),
        child: Row(
          children: [
            Container(
              width: 18,
              height: 18,
              decoration: BoxDecoration(
                color: isSelected ? color[600] : Colors.transparent,
                border: Border.all(
                  color: isSelected ? color[600]! : Colors.grey[400]!,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(4),
              ),
              child: isSelected
                  ? const Icon(
                Icons.check,
                size: 12,
                color: Colors.white,
              )
                  : null,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  color: isSelected ? color[700] : Colors.grey[700],
                ),
              ),
            ),
            if (isSelected)
              Icon(
                Icons.check_circle,
                size: 14,
                color: color[600],
              ),
          ],
        ),
      ),
    );
  }

// Helper methods to add to your class
  void _toggleAllAccess(bool value) {
    setState(() {
      systemAccess.updateAll((key, oldValue) => value);
    });
  }

  void _toggleCategoryAccess(List<String> items, bool value) {
    setState(() {
      for (String item in items) {
        systemAccess[item] = value;
      }
    });
  }

  int _getSelectedCount() {
    return systemAccess.values.where((value) => value).length;
  }

  Widget _buildCheckboxTile(String title) {
    return CheckboxListTile(
      title: Text(
        title,
        style: const TextStyle(fontSize: 14),
      ),
      value: systemAccess[title],
      onChanged: (bool? value) {
        setState(() {
          systemAccess[title] = value ?? false;
        });
      },
      controlAffinity: ListTileControlAffinity.leading,
      contentPadding: const EdgeInsets.symmetric(horizontal: 0),
      dense: true,
      activeColor: AppColors.primary,
    );
  }

  @override
  void dispose() {
    employeeIdController.dispose();
    loginHistoryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth >= 600;
    final isDesktop = screenWidth >= 1024;

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: DefaultCommonAppBar(
        activityName: "Update Security & Access",
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        // padding: EdgeInsets.all(isTablet ? 24.0 : 0.0),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                spreadRadius: 2,
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          padding: EdgeInsets.all(isTablet ? 32.0 : 20.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Section
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.security,
                        color: AppColors.primary,
                        size: 24,
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Update Security & Access',
                        style: TextStyle(
                          fontSize: isTablet ? 20 : 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Update the details for access control',
                  style: TextStyle(
                    fontSize: isTablet ? 16 : 14,
                    color: Colors.grey[600],
                  ),
                ),
                SizedBox(height: isTablet ? 30 : 16),

                // First Row - Employee ID, Role Permission, Device Binding
                _buildResponsiveRow(
                  isTablet: isTablet,
                  isDesktop: isDesktop,
                  children: [
                    CustomTextField(
                      controller: employeeIdController,
                      prefixIcon: Icons.person_pin,
                      hintText: "Enter Employee ID",
                      title: "Employee ID",
                      keyboardType: TextInputType.text,
                      validator: FormValidatorUtils.validateRequired,
                    ),

                    ResponsiveDropdown<String>(
                      value: selectedRolePermissionType,
                      itemList: roleList,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedRolePermissionType = newValue;
                        });
                      },
                      hint: 'Select Role',
                      label: 'Permissions / Role',
                    ),
                    ResponsiveDropdown<String>(
                      value: selectedBindingType,
                      itemList: deviceBinding,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedBindingType = newValue;
                        });
                      },
                      hint: 'Select Device',
                      label: 'Device Binding',
                    ),
                  ],
                ),

                SizedBox(height: isTablet ? 24 : 16),

                // System Access Section
                _buildSystemAccessSection(),

                // Login History Section
                CustomTextField(
                  title: "Login History / Logs",
                  hintText: "Enter login history details",
                  maxLines: 4,
                  controller: loginHistoryController,
                  validator: FormValidatorUtils.validateRequired,
                ),

                SizedBox(height: isTablet ? 32 : 24),

                // Submit Button
                Consumer<TechManagerApiProvider>(
                  builder: (context, addAssetProvider, child) {
                    return Container(
                      width: double.infinity,
                      child: CustomButton(
                        color: Colors.orange,
                        text: addAssetProvider.isLoading ? 'Updating...' : "Update",
                        onPressed: addAssetProvider.isLoading
                            ? null
                            : () {
                          _submitForm(addAssetProvider);
                        },
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildResponsiveRow({
    required bool isTablet,
    required bool isDesktop,
    required List<Widget> children,
  }) {
    if (isDesktop) {
      // Desktop: 3 columns
      return Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: children
                .map((child) => Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: child,
              ),
            ))
                .toList(),
          ),
          const SizedBox(height: 20),
        ],
      );
    } else if (isTablet) {
      // Tablet: 2 columns
      return Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: children
                .take(2)
                .map((child) => Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: child,
              ),
            ))
                .toList(),
          ),
          const SizedBox(height: 16),
          if (children.length > 2) ...[
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: children[2],
                  ),
                ),
                const Expanded(child: SizedBox()),
              ],
            ),
            const SizedBox(height: 16),
          ],
        ],
      );
    } else {
      // Mobile: 1 column
      return Column(
        children: children
            .map((child) => Padding(
          padding: const EdgeInsets.only(bottom: 0.0),
          child: child,
        ))
            .toList(),
      );
    }
  }
}