import 'dart:math';
import 'package:dss_crm/admin/model/employee_profile/get_all_admin_employee_list_model.dart';
import 'package:dss_crm/admin/screen/user_registertion/user_static_type.dart';
import 'package:dss_crm/utils/form_validations_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show FilteringTextInputFormatter, LengthLimitingTextInputFormatter;
import 'package:flutter/src/services/text_formatter.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../controller/admin_main_api_provider.dart';
import '../../utils/location_hierarchy_utils.dart';
import 'employee_dropdown_widget.dart';

class AddNewUserFormScreen extends StatefulWidget {
  const AddNewUserFormScreen({Key? key}) : super(key: key);

  @override
  State<AddNewUserFormScreen> createState() => _AddNewUserFormScreenState();
}

class _AddNewUserFormScreenState extends State<AddNewUserFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _userNameController = TextEditingController();
  final _userEmailController = TextEditingController();
  final _userPhoneController = TextEditingController();
  final _userWhatsappController = TextEditingController();
  final _userPasswordController = TextEditingController();
  final _locationKey = GlobalKey<LocationHierarchyDropdownsState>();

  String? _selectedEmployeeId;
  Data? _selectedEmployee;
  UserType? _selectedUserType;

  @override
  void dispose() {
    _userNameController.dispose();
    _userEmailController.dispose();
    _userPhoneController.dispose();
    _userWhatsappController.dispose();
    _userPasswordController.dispose();
    super.dispose();
  }

  void _populateFormWithEmployeeData(Data employee) {
    _userNameController.text = employee.name ?? '';
    _userEmailController.text = employee.email ?? '';
    _userPhoneController.text = employee.phone ?? '';
    _userWhatsappController.text = employee.whatsapp ?? '';
    _userPasswordController.clear();
  }

  String _generatePassword() {
    if (_selectedEmployee == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please select ${_selectedUserType?.displayName.toLowerCase() ?? "an employee"} first'),
          backgroundColor: Colors.orange,
        ),
      );
      return '';
    }

    final employeeId = _selectedEmployee!.employeeId ?? '';
    final randomNumber = Random().nextInt(900) + 100;
    final generatedPassword = '$employeeId@$randomNumber';

    return generatedPassword;
  }

  void _onGeneratePasswordTap() {
    final password = _generatePassword();
    if (password.isNotEmpty) {
      setState(() {
        _userPasswordController.text = password;
      });
    }
  }

  void _submitForm(AdminMainApiProvider provider) async {
    if (!(_formKey.currentState?.validate() ?? false)) {
      return;
    }

    if (_selectedUserType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a user type'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (_selectedEmployee == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please select a ${_selectedUserType?.displayName.toLowerCase()}'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final selectedIds = _locationKey.currentState!.getSelectedIds();
    final selectedActionIds = _locationKey.currentState!.getSelectedActionIds();

    print('Selected User Type: ${_selectedUserType?.displayName}');
    print('Selected User Type API Value: ${_selectedUserType?.apiValue}');

    final body = {
      'type': _selectedUserType?.apiValue.toUpperCase(),
      'manageBy': selectedIds['managedById'],
      'name': _userNameController.text,
      'email': _userEmailController.text,
      'phone': _userPhoneController.text,
      'whatsapp': _userWhatsappController.text,
      'password': _userPasswordController.text,
      'candidate': _selectedEmployee!.candidateId?.sId,
      'zone': selectedIds['zoneId'],
      'state': selectedIds['stateId'],
      'city': selectedIds['cityId'],
      'branch': selectedIds['branchId'],
      'department': selectedIds['departmentId'],
      'designation': selectedIds['designationId'],
      'profile': _selectedEmployee?.sId,
      // 'empId': _selectedEmployee!.employeeId,
      'actionGroups': selectedActionIds,
    };

    await provider.createAdminUserRegisteration(context, body);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: DefaultCommonAppBar(
        activityName: "Create New User",
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: ResponsiveHelper.paddingAll(context, 10),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ========== SECTION 1: USER TYPE SELECTION ==========
                _buildSectionCard(
                  context: context,
                  title: 'User Type Selection',
                  icon: Icons.category_outlined,
                  child: UserTypeDropdown(
                    selectedUserType: _selectedUserType,
                    onChanged: (userType) {
                      setState(() {
                        _selectedUserType = userType;
                        _selectedEmployee = null;
                        _selectedEmployeeId = null;
                        _userNameController.clear();
                        _userEmailController.clear();
                        _userPhoneController.clear();
                        _userWhatsappController.clear();
                        _userPasswordController.clear();
                      });
                    },
                    isRequired: true,
                  ),
                ),

                // ResponsiveHelper.sizedBoxHeight(context, 16),

                // ========== SECTION 2: EMPLOYEE/VENDOR SELECTION ==========
                _buildSectionCard(
                  context: context,
                  title: _selectedUserType == null
                      ? 'Select Profile'
                      : 'Select ${_selectedUserType!.displayName}',
                  icon: Icons.person_search_outlined,
                  child: EmployeeListDropdown(
                    selectedUserType: _selectedUserType,
                    onEmployeeSelected: (selectedEmployee) {
                      setState(() {
                        _selectedEmployee = selectedEmployee;
                        _selectedEmployeeId = selectedEmployee?.sId;
                        if (selectedEmployee != null) {
                          _populateFormWithEmployeeData(selectedEmployee);
                        }
                      });
                    },
                  ),
                ),

                // ResponsiveHelper.sizedBoxHeight(context, 16),

                // ========== SECTION 3: LOCATION HIERARCHY ==========
                _buildSectionCard(
                  context: context,
                  title: 'Location & Department Details',
                  icon: Icons.location_on_outlined,
                  child: LocationHierarchyDropdowns(
                    key: _locationKey,
                    onDepartmentChanged: (departmentId) {
                      print('Selected Department: $departmentId');
                    },
                  ),
                ),

                // ResponsiveHelper.sizedBoxHeight(context, 16),

                // ========== SECTION 4: USER DETAILS ==========
                _buildSectionCard(
                  context: context,
                  title: 'User Details',
                  icon: Icons.account_circle_outlined,
                  child: Column(
                    children: [
                      CustomTextField(
                        controller: _userNameController,
                        hintText: 'User Name',
                        title: 'User Name',
                        prefixIcon: Icons.person,
                        validationType: ValidationType.name,
                        keyboardType: TextInputType.text,
                      ),
                      CustomTextField(
                        controller: _userEmailController,
                        hintText: 'Email',
                        title: 'Email',
                        prefixIcon: Icons.email_outlined,
                        validationType: ValidationType.email,
                        keyboardType: TextInputType.emailAddress,
                      ),
                      CustomTextField(
                        controller: _userPhoneController,
                        hintText: 'Phone Number',
                        title: 'Phone Number',
                        maxLength: 10,
                        prefixIcon: Icons.phone_outlined,
                        validationType: ValidationType.phone,
                        keyboardType: TextInputType.phone,
                      ),
                      CustomTextField(
                        controller: _userWhatsappController,
                        hintText: 'WhatsApp Number',
                        title: 'WhatsApp Number',
                        maxLength: 10,
                        prefixIcon: Icons.phone_android_outlined,
                        validationType: ValidationType.phone,
                        keyboardType: TextInputType.phone,
                      ),
                    ],
                  ),
                ),

                // ResponsiveHelper.sizedBoxHeight(context, 16),

                // ========== SECTION 5: PASSWORD ==========
                _buildSectionCard(
                  context: context,
                  title: 'Password Configuration',
                  icon: Icons.lock_outlined,
                  child:    Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ResponsiveHelper.sizedBoxHeight(context, 6),
                      Text(
                        "Password",
                        style: AppTextStyles.heading1(
                          context,
                          overrideStyle: TextStyle(
                            fontSize: ResponsiveHelper.fontSize(context, 12),
                          ),
                        ),
                      ),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Expanded(
                            child: CustomTextField(
                              controller: _userPasswordController,
                              hintText: 'Enter Password',
                              validator: (value) => FormValidatorUtils.validateMinLength(
                                value,
                                6,
                                fieldName: "Password",
                              ),
                              keyboardType: TextInputType.visiblePassword,
                            ),
                          ),

                          ResponsiveHelper.sizedBoxWidth(context, 10),

                          // Generate Button (same height as textfield)
                          InkWell(
                            onTap: _onGeneratePasswordTap, // Same function as before
                            borderRadius: BorderRadius.circular(8),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 12.0),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children:  [
                                  Icon(Icons.refresh, color: AppColors.primary, size: ResponsiveHelper.iconSize(context, 20)),
                                  ResponsiveHelper.sizedBoxWidth(context, 4),

                                  Text(
                                    'Generate',
                                    style:  AppTextStyles.heading2(
                                      context,
                                      overrideStyle: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),

                                  ),
                                ],
                              ),
                            ),
                          )

                        ],
                      ),
                    ],
                  ),
                ),

                // ResponsiveHelper.sizedBoxHeight(context, 24),

                // ========== SUBMIT BUTTON ==========
                Consumer<AdminMainApiProvider>(
                  builder: (context, adminMainProvider, child) {
                    return Container(
                      width: double.infinity,
                      child: CustomButton(
                        color: AppColors.primary,
                        text: adminMainProvider.isLoading ? 'Creating User...' : "Create User",
                        onPressed: adminMainProvider.isLoading
                            ? null
                            : () {
                          if (_formKey.currentState!.validate()) {
                            _submitForm(adminMainProvider);
                          }
                        },
                      ),
                    );
                  },
                ),

                ResponsiveHelper.sizedBoxHeight(context, 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ========== REUSABLE SECTION CARD WIDGET ==========
  Widget _buildSectionCard({
    required BuildContext context,
    required String title,
    required IconData icon,
    required Widget child,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
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
          // Section Header
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: ResponsiveHelper.spacing(context, 16),
              vertical: ResponsiveHelper.spacing(context, 8),
            ),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.05),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: EdgeInsets.all(ResponsiveHelper.spacing(context, 8)),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    icon,
                    color: AppColors.primary,
                    size: ResponsiveHelper.iconSize(context, 20),
                  ),
                ),
                SizedBox(width: ResponsiveHelper.spacing(context, 12)),
                Expanded(
                  child: Text(
                    title,
                    style: AppTextStyles.heading2(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 12),
                        fontWeight: FontWeight.w600,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Section Content
          Padding(
            padding: ResponsiveHelper.paddingAll(context,14),
            child: child,
          ),
        ],
      ),
    );
  }
}