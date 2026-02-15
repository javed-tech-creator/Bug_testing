import 'package:dss_crm/admin/model/employee_profile/get_all_admin_employee_list_model.dart';
import 'package:dss_crm/admin/screen/user_registertion/user_static_type.dart';
import 'package:dss_crm/utils/form_validations_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

class EditAdminUserScreen extends StatefulWidget {
  final String userId;

  const EditAdminUserScreen({Key? key, required this.userId}) : super(key: key);

  @override
  State<EditAdminUserScreen> createState() => _EditAdminUserScreenState();
}

class _EditAdminUserScreenState extends State<EditAdminUserScreen> {
  final _formKey = GlobalKey<FormState>();
  final _userNameController = TextEditingController();
  final _userEmailController = TextEditingController();
  final _userPhoneController = TextEditingController();
  final _userWhatsappController = TextEditingController();
  final _userPasswordController = TextEditingController();
  final _locationKey = GlobalKey<LocationHierarchyDropdownsState>();

  bool _isLoading = true;
  String? _selectedEmployeeId;
  Data? _selectedEmployee;
  UserType? _selectedUserType;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadUserData();
    });
  }

  Future<void> _loadUserData() async {
    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    await provider.getAdminSingleRegisteredUserDetail(context, widget.userId);

    debugPrint("widgetUserId : ${widget.userId}");

    final user = provider.getAdminSingleRegisteredUserDetailModelResponse?.data?.data?.user;
    if (user != null) {
      setState(() {
        _userNameController.text = user.name ?? '';
        _userEmailController.text = user.email ?? '';
        _userPhoneController.text = user.phone ?? '';
        _userWhatsappController.text = user.whatsapp ?? '';

        debugPrint("user UserId : ${user.sId}");

        // ✅ IMPORTANT: Use profile ID, not user ID
        // Check if profile exists and get its _id
        if (user.profile != null && user.profile!.sId != null) {
          _selectedEmployeeId = user.profile!.sId;  // ✅ Profile ID
          debugPrint("Selected Profile ID: $_selectedEmployeeId");
        } else {
          debugPrint("⚠️ No profile found for user");
        }

        // Set user type from API response
        // Convert API value to enum
        if (user.type != null) {
          try {
            _selectedUserType = UserType.values.firstWhere(
                  (type) => type.apiValue.toLowerCase() == user.type!.toLowerCase(),
            );
            debugPrint("Selected User Type: ${_selectedUserType?.displayName}");
          } catch (e) {
            debugPrint("Could not match user type: ${user.type}");
          }
        }

        _isLoading = false;
      });
    }
  }

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

    final body = {
      'type': _selectedUserType?.apiValue.toUpperCase(),
      'manageBy': selectedIds['managedById'], // ✅ Added managed by ID
      'name': _userNameController.text,
      'email': _userEmailController.text,
      'phone': _userPhoneController.text,
      'whatsapp': _userWhatsappController.text,
      'zone': selectedIds['zoneId'],
      'state': selectedIds['stateId'],
      'city': selectedIds['cityId'],
      'branch': selectedIds['branchId'],
      'department': selectedIds['departmentId'],
      'designation': selectedIds['designationId'],
      'actionGroups': selectedActionIds,
      // 'password': _userPasswordController.text,
      'candidate': _selectedEmployee!.candidateId?.sId,
      'profile': _selectedEmployee?.sId, // ✅ Changed from employeeProfile to profile (same as create)
      // 'empId': _selectedEmployee!.employeeId, // ✅ Removed - not needed like in create user
    };

    debugPrint('Update Body: $body');

    await provider.updateAdminUserRegisteredDetails(context, body, widget.userId);

    if (provider.updateAdminUserRegisterDetailsModelResponse?.success == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('User updated successfully'),
          backgroundColor: Colors.green,
        ),
      );
      // Navigator.pop(context, true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: DefaultCommonAppBar(
        activityName: "Update User",
        backgroundColor: AppColors.primary,
      ),
      body: _isLoading
          ? Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
        ),
      )
          : Consumer<AdminMainApiProvider>(
        builder: (context, provider, child) {
          final user = provider.getAdminSingleRegisteredUserDetailModelResponse?.data?.data?.user;

          if (user == null) {
            return const Center(
              child: Text('Failed to load user data'),
            );
          }

          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ========== SECTION 1: EMPLOYEE INFO CARD ==========
                    _buildSectionCard(
                      context: context,
                      title: 'Current Employee Information',
                      icon: Icons.info_outline,
                      child: Column(
                        children: [
                          _buildInfoRow('Employee ID', user.userId ?? 'N/A'),
                          _buildInfoRow('Designation', user.designation?.title ?? 'N/A'),
                          _buildInfoRow('Department', user.department?.title ?? 'N/A'),
                          _buildInfoRow('Branch', user.branch?.title ?? 'N/A'),
                        ],
                      ),
                    ),

                    SizedBox(height: 24),

                    // ========== SECTION 2: USER TYPE SELECTION (DISABLED IN EDIT MODE) ==========
                    _buildSectionCard(
                      context: context,
                      title: 'User Type Selection',
                      icon: Icons.category_outlined,
                      child: UserTypeDropdown(
                        selectedUserType: _selectedUserType,
                        onChanged: null, // ✅ Disabled in edit mode
                        isRequired: true,
                        isReadOnly: true, // ✅ Make it read-only
                      ),
                    ),

                    SizedBox(height: 24),

                    // ========== SECTION 3: EMPLOYEE/VENDOR SELECTION ==========
                    if (_selectedUserType != null)
                      _buildSectionCard(
                        context: context,
                        title: 'Select ${_selectedUserType!.displayName}',
                        icon: Icons.person_search_outlined,
                        child: EmployeeListDropdown(
                          key: ValueKey(_selectedUserType), // ✅ Force rebuild when type changes
                          selectedUserType: _selectedUserType,
                          initialEmployeeId: _selectedEmployeeId,
                          onEmployeeSelected: (selectedEmployee) {
                            setState(() {
                              _selectedEmployee = selectedEmployee;
                              _selectedEmployeeId = selectedEmployee?.sId;
                              // ❌ DON'T populate form - keep user's existing data
                              // User data should remain as loaded from API
                            });
                          },
                        ),
                      ),

                    SizedBox(height: 24),

                    // ========== SECTION 4: LOCATION HIERARCHY ==========
                    _buildSectionCard(
                      context: context,
                      title: 'Location & Department Details',
                      icon: Icons.location_on_outlined,
                      child: LocationHierarchyDropdowns(
                        key: _locationKey,
                        initialZoneId: user.zone?.sId,
                        initialStateId: user.state?.sId,
                        initialCityId: user.city?.sId,
                        initialBranchId: user.branch?.sId,
                        initialDepartmentId: user.department?.sId,
                        initialDesignationId: user.designation?.sId,
                        initialMangedById: user.manageBy?.sId, // ✅ Added Managed By initial value
                        initialSelectedActionIds: user.actionGroups?.map((ag) => ag.sId ?? '').toList() ?? [],
                        onDepartmentChanged: (departmentId) {
                          print('Selected Department: $departmentId');
                        },
                      ),
                    ),

                    SizedBox(height: 24),

                    // ========== SECTION 5: USER DETAILS ==========
                    _buildSectionCard(
                      context: context,
                      title: 'User Details',
                      icon: Icons.account_circle_outlined,
                      child: Column(
                        children: [
                          _buildTextField(
                            label: 'User Name',
                            controller: _userNameController,
                            hint: 'Enter user name',
                            isRequired: true,
                            validator: (value) => FormValidatorUtils.validateRequired(
                              value,
                              fieldName: 'User Name',
                            ),
                          ),
                          _buildTextField(
                            label: 'Email',
                            controller: _userEmailController,
                            hint: 'Enter Email',
                            isRequired: true,
                            validator: FormValidatorUtils.validateEmail,
                          ),
                          _buildTextField(
                            label: 'Phone Number',
                            controller: _userPhoneController,
                            hint: 'Phone Number',
                            isRequired: true,
                            validator: FormValidatorUtils.validatePhone,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly,
                              LengthLimitingTextInputFormatter(10),
                            ],
                          ),
                          _buildTextField(
                            label: 'Whatsapp Number',
                            controller: _userWhatsappController,
                            hint: 'Whatsapp Number',
                            isRequired: true,
                            validator: FormValidatorUtils.validatePhone,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly,
                              LengthLimitingTextInputFormatter(10),
                            ],
                          ),
                          // _buildTextField(
                          //   label: 'Generate Password',
                          //   controller: _userPasswordController,
                          //   hint: 'Enter Your Password',
                          //   isRequired: true,
                          //   validator: (value) => FormValidatorUtils.validateMinLength(
                          //     value,
                          //     6,
                          //     fieldName: "Password",
                          //   ),
                          // ),
                        ],
                      ),
                    ),

                    SizedBox(height: 24),

                    // ========== SUBMIT BUTTON ==========
                    Container(
                      width: double.infinity,
                      child: CustomButton(
                        color: AppColors.primary,
                        text: provider.isLoading ? 'Updating...' : "Update User",
                        onPressed: provider.isLoading
                            ? null
                            : () {
                          if (_formKey.currentState!.validate()) {
                            _submitForm(provider);
                          }
                        },
                      ),
                    ),

                    SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          );
        },
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
              vertical: ResponsiveHelper.spacing(context, 12),
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
                        fontSize: ResponsiveHelper.fontSize(context, 14),
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
            padding: const EdgeInsets.all(16.0),
            child: child,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: AppTextStyles.body2(
                context,
                overrideStyle: TextStyle(
                  color: Colors.grey.shade600,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: AppTextStyles.body2(
                context,
                overrideStyle: const TextStyle(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    required String hint,
    required bool isRequired,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
    List<TextInputFormatter>? inputFormatters,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomTextField(
          controller: controller,
          validator: validator,
          hintText: hint,
          title: label,
          keyboardType: keyboardType,
          inputFormatters: inputFormatters,
        ),
      ],
    );
  }
}