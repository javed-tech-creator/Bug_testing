import 'package:dss_crm/admin/controller/admin_location_api_provider.dart';
import 'package:dss_crm/admin/model/action_groups/get_all_action_groups_list_model.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
import '../../../utils/location_hierarchy_utils.dart';

class ActionGroupsListScreen extends StatefulWidget {
  const ActionGroupsListScreen({Key? key}) : super(key: key);

  @override
  State<ActionGroupsListScreen> createState() => _ActionGroupsListScreenState();
}

class _ActionGroupsListScreenState extends State<ActionGroupsListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadInitialData();
    });
  }

  Future<void> _loadInitialData() async {
    final provider = Provider.of<AdminLocationApiProvider>(context, listen: false);
    await provider.getAllActionGroupList(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.endingGreyColor,
      body: Consumer<AdminLocationApiProvider>(
        builder: (context, provider, _) {
          final actionGroupsList = provider.getAllActionGroupListModelResponse?.data?.data ?? [];

          return RefreshIndicator(
            onRefresh: _loadInitialData,
            color: AppColors.primary,
            backgroundColor: Colors.white,
            strokeWidth: 3,
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: _buildSectionHeader(
                    title: 'Action Groups',
                    itemCount: actionGroupsList.length,
                    onAddPressed: () async {
                      final result = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const AddActionGroupScreen(),
                        ),
                      );
                      if (result == true) {
                        _loadInitialData();
                      }
                    },
                  ),
                ),
                Expanded(child: _buildActionGroupsList(provider)),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSectionHeader({
    required String title,
    required int itemCount,
    required VoidCallback onAddPressed,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '$itemCount items available',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          ElevatedButton.icon(
            onPressed: onAddPressed,
            icon: const Icon(Icons.add_rounded),
            label: const Text('Add New'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionGroupsList(AdminLocationApiProvider provider) {
    if (provider.isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: AppColors.primary),
            const SizedBox(height: 16),
            Text(
              'Loading action groups...',
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      );
    }

    final actionGroups = provider.getAllActionGroupListModelResponse?.data?.data ?? [];

    if (actionGroups.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Icon(
                Icons.shield_outlined,
                size: 64,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No action groups yet',
              style: TextStyle(
                fontSize: 18,
                color: Colors.black87,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Create your first action group to get started',
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      itemCount: actionGroups.length,
      itemBuilder: (context, index) => ActionGroupCard(
        actionGroup: actionGroups[index],
        onEdit: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => AddActionGroupScreen(
                actionGroup: actionGroups[index],
                isEdit: true,
              ),
            ),
          );
          if (result == true) {
            provider.getAllActionGroupList(context);
          }
        },
      ),
    );
  }
}

class ActionGroupCard extends StatefulWidget {
  final Data actionGroup;
  final VoidCallback onEdit;

  const ActionGroupCard({
    Key? key,
    required this.actionGroup,
    required this.onEdit,
  }) : super(key: key);

  @override
  State<ActionGroupCard> createState() => _ActionGroupCardState();
}

class _ActionGroupCardState extends State<ActionGroupCard> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.orange,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.shield_outlined,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.actionGroup.title ?? 'N/A',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        widget.actionGroup.description ?? 'Full permissions',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                InkWell(
                  onTap: widget.onEdit,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.orange, width: 2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      Icons.edit_outlined,
                      color: Colors.orange,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 8),
            child: InkWell(
              onTap: () {
                setState(() {
                  _isExpanded = !_isExpanded;
                });
              },
              child: Row(
                children: [
                  Text(
                    _isExpanded ? 'Hide Permissions' : 'View Permissions',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    _isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                    size: 20,
                    color: Colors.orange,
                  ),
                ],
              ),
            ),
          ),
          if (_isExpanded) _buildPermissionsDetails(),
        ],
      ),
    );
  }

  Widget _buildPermissionsDetails() {
    final permissions = widget.actionGroup.permissions;
    if (permissions == null) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Text('No permissions available'),
      );
    }

    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (permissions.crud != null && permissions.crud!.isNotEmpty)
            _buildPermissionRow('Crud', permissions.crud!),
          if (permissions.workflow != null && permissions.workflow!.isNotEmpty)
            _buildPermissionRow('Workflow', permissions.workflow!),
          if (permissions.data != null && permissions.data!.isNotEmpty)
            _buildPermissionRow('Data', permissions.data!),
          if (permissions.system != null && permissions.system!.isNotEmpty)
            _buildPermissionRow('System', permissions.system!),
        ],
      ),
    );
  }

  Widget _buildPermissionRow(String label, List<String> items) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 4,
            height: 4,
            margin: const EdgeInsets.only(top: 8),
            decoration: const BoxDecoration(
              color: Colors.black87,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: RichText(
              text: TextSpan(
                children: [
                  TextSpan(
                    text: '$label: ',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                  TextSpan(
                    text: items.join(', '),
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ===== ADD/EDIT ACTION GROUP SCREEN =====
class AddActionGroupScreen extends StatefulWidget {
  final Data? actionGroup;
  final bool isEdit;

  const AddActionGroupScreen({
    Key? key,
    this.actionGroup,
    this.isEdit = false,
  }) : super(key: key);

  @override
  State<AddActionGroupScreen> createState() => _AddActionGroupScreenState();
}

class _AddActionGroupScreenState extends State<AddActionGroupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _hierarchyKey = GlobalKey<LocationHierarchyDropdownsState>();
  String? _selectedZoneId;
  String? _selectedStateId;
  String? _selectedCityId;
  String? _selectedBranchId;
  String? _selectedDepartmentId;

  // Permission selections
  final Map<String, bool> _crudPermissions = {
    'view': false,
    'create': false,
    'update': false,
    'delete': false,
  };

  final Map<String, bool> _workflowPermissions = {
    'import': false,
    'export': false,
    'assign': false,
    'approve': false,
    'reject': false,
    'submit': false,
  };

  final Map<String, bool> _dataPermissions = {
    'filter': false,
    'search': false,
    'sort': false,
    'generate_report': false,
  };

  final Map<String, bool> _systemPermissions = {
    'login': false,
    'logout': false,
    'reset_password': false,
    'notify': false,
    'track': false,
  };

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<AdminLocationApiProvider>(context, listen: false);
      provider.getAllZoneList(context);

      if (widget.isEdit && widget.actionGroup != null) {
        _populateEditData();
      }
    });
  }

  void _populateEditData() {
    _titleController.text = widget.actionGroup!.title ?? '';
    _descriptionController.text = widget.actionGroup!.description ?? '';
    _selectedDepartmentId = widget.actionGroup!.department?.sId;
    final provider = Provider.of<AdminLocationApiProvider>(context, listen: false);
    final department = widget.actionGroup!.department;

    if (department != null) {
      _selectedDepartmentId = department.sId;

      setState(() {});
    }
    // Populate permissions
    final permissions = widget.actionGroup!.permissions;
    if (permissions != null) {
      if (permissions.crud != null) {
        for (var perm in permissions.crud!) {
          if (_crudPermissions.containsKey(perm)) {
            _crudPermissions[perm] = true;
          }
        }
      }
      if (permissions.workflow != null) {
        for (var perm in permissions.workflow!) {
          if (_workflowPermissions.containsKey(perm)) {
            _workflowPermissions[perm] = true;
          }
        }
      }
      if (permissions.data != null) {
        for (var perm in permissions.data!) {
          if (_dataPermissions.containsKey(perm)) {
            _dataPermissions[perm] = true;
          }
        }
      }
      if (permissions.system != null) {
        for (var perm in permissions.system!) {
          if (_systemPermissions.containsKey(perm)) {
            _systemPermissions[perm] = true;
          }
        }
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteColor,
      appBar: DefaultCommonAppBar(
        activityName: widget.isEdit ? 'Edit Action Group' : 'Add Action Group',
        backgroundColor: AppColors.primary,
      ),
      body: Consumer<AdminLocationApiProvider>(
        builder: (context, provider, _) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // _buildTextField(
                  //   label: 'Title *',
                  //   controller: _titleController,
                  //   hint: 'Enter group title',
                  //   validator: (value) {
                  //     if (value == null || value.isEmpty) {
                  //       return 'Please enter title';
                  //     }
                  //     return null;
                  //   },
                  // ),


                  CustomTextField(
                    controller: _titleController,
                    hintText: 'Group Name',
                    title: 'Group Title',
                    prefixIcon: Icons.title,
                    validationType: ValidationType.name,
                    keyboardType: TextInputType.text,
                  ),


                  // _buildTextField(
                  //   label: 'Description *',
                  //   controller: _descriptionController,
                  //   hint: 'Enter description',
                  //   maxLines: 3,
                  //   validator: (value) {
                  //     if (value == null || value.isEmpty) {
                  //       return 'Please enter description';
                  //     }
                  //     return null;
                  //   },
                  // ),

                  CustomTextField(
                    controller: _descriptionController,
                    hintText: 'Description',
                    title: 'Description',
                    maxLines: 3,
                    validationType: ValidationType.name,
                    keyboardType: TextInputType.text,
                  ),


                  const SizedBox(height: 24),

                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [AppColors.primary.withOpacity(0.1), AppColors.primary.withOpacity(0.05)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.primary.withOpacity(0.3), width: 1.5),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.location_on_outlined,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Location Hierarchy',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'Required',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: Colors.black87,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (!widget.isEdit) ...[
                    LocationHierarchyDropdowns(
                      key: _hierarchyKey,
                      showUpTo: LocationLevel.department,
                      enableValidation: true,
                      initialZoneId: null,
                      initialStateId: null,
                      initialCityId: null,
                      initialBranchId: null,
                      initialDepartmentId: null,
                    ),
                  ],

                  // In Edit Mode - Show only Department name (read-only)
                  if (widget.isEdit && widget.actionGroup?.department != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Department',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.black87,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.grey[100],
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.grey[300]!),
                            ),
                            child: Row(
                              children: [
                                Icon(Icons.corporate_fare, color: AppColors.primary, size: 20),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    widget.actionGroup!.department!.title ?? 'N/A',
                                    style: const TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.orange.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text(
                                    'Read Only',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.orange,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.orange.withAlpha(30),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.orange.withAlpha(60), width: 1),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.security, color: Colors.orange, size: 20),
                        const SizedBox(width: 10),
                        const Text(
                          'Permissions',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildPermissionSection('Crud', _crudPermissions),
                  const SizedBox(height: 16),
                  _buildPermissionSection('Workflow', _workflowPermissions),
                  const SizedBox(height: 16),
                  _buildPermissionSection('Data', _dataPermissions),
                  const SizedBox(height: 16),
                  _buildPermissionSection('System', _systemPermissions),
                  const SizedBox(height: 32),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: provider.isLoading ? null : () => Navigator.pop(context),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.grey),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          child: const Text(
                            'Cancel',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: provider.isLoading ? null : _handleSubmit,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          child: provider.isLoading
                              ? const SizedBox(
                            height: 24,
                            width: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation(Colors.white),
                            ),
                          )
                              : Text(
                            widget.isEdit ? 'Update' : 'Create',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    required String hint,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 8),
          TextFormField(
            controller: controller,
            maxLines: maxLines,
            decoration: InputDecoration(
              hintText: hint,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: AppColors.primary, width: 2),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
            validator: validator,
          ),
        ],
      ),
    );
  }

  Widget _buildDropdownCard({
    required String title,
    required IconData icon,
    required Widget child,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [AppColors.primary, AppColors.primary.withOpacity(0.8)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(icon, color: Colors.white, size: 18),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: Colors.black87,
                      letterSpacing: 0.3,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            child,
          ],
        ),
      ),
    );
  }

  Widget _buildZoneDropdown(AdminLocationApiProvider provider) {
    final zones = provider.getAllZoneListModelResponse?.data?.data ?? [];

    return ResponsiveDropdown<String>(
      value: _selectedZoneId,
      itemList: zones.map((zone) => zone.sId!).toList(),
      itemDisplayBuilder: (id) {
        final zone = zones.firstWhere((z) => z.sId == id);
        return zone.title ?? 'N/A';
      },
      onChanged: (value) {
        if (value != null) {
          setState(() {
            _selectedZoneId = value;
            _selectedStateId = null;
            _selectedCityId = null;
            _selectedBranchId = null;
            _selectedDepartmentId = null;
          });
          provider.getAllStateByZoneId(context, value);
        }
      },
      hint: 'Choose Zone',
      label: 'Zone',
      validator: (value) => value == null ? 'Please select a zone' : null,
    );
  }

  Widget _buildStateDropdown(AdminLocationApiProvider provider) {
    final states = provider.getAllStateByZoneIdModelResponse?.data?.data ?? [];
    final isEnabled = _selectedZoneId != null && states.isNotEmpty;

    return ResponsiveDropdown<String>(
      value: _selectedStateId,
      itemList: isEnabled ? states.map((state) => state.sId!).toList() : [],
      itemDisplayBuilder: (id) {
        final state = states.firstWhere((s) => s.sId == id);
        return state.title ?? 'N/A';
      },
      onChanged: (value) {
        if (value != null) {
          setState(() {
            _selectedStateId = value;
            _selectedCityId = null;
            _selectedBranchId = null;
            _selectedDepartmentId = null;
          });
          provider.getAllCityByStateId(context, value);
        }
      },
      hint: _selectedZoneId == null ? 'Select Zone first' : 'Choose State',
      label: 'State',
      isReadOnly: !isEnabled,
      validator: (value) => value == null ? 'Please select a state' : null,
    );
  }

  Widget _buildCityDropdown(AdminLocationApiProvider provider) {
    final cities = provider.getAllCityByStateIdModelResponse?.data?.data ?? [];
    final isEnabled = _selectedStateId != null && cities.isNotEmpty;
    return ResponsiveDropdown<String>(
      value: _selectedCityId,
      itemList: isEnabled ? cities.map((city) => city.sId!).toList() : [],
      itemDisplayBuilder: (id) {
        final city = cities.firstWhere((c) => c.sId == id);
        return city.title ?? 'N/A';
      },
      onChanged: (value) {
        if (value != null) {
          setState(() {
            _selectedCityId = value;
            _selectedBranchId = null;
            _selectedDepartmentId = null;
          });
          provider.getAllBranchByCityId(context, value);
        }
      },
      hint: _selectedStateId == null ? 'Select State first' : 'Choose City',
      label: 'City',
      isReadOnly: !isEnabled,
      validator: (value) => value == null ? 'Please select a city' : null,
    );
  }

  Widget _buildBranchDropdown(AdminLocationApiProvider provider) {
    final branches = provider.getAllBranchByCityIdModelResponse?.data?.data ?? [];
    final isEnabled = _selectedCityId != null && branches.isNotEmpty;


    return ResponsiveDropdown<String>(
      value: _selectedBranchId,
      itemList: isEnabled ? branches.map((branch) => branch.sId!).toList() : [],
      itemDisplayBuilder: (id) {
        final branch = branches.firstWhere((b) => b.sId == id);
        return branch.title ?? 'N/A';
      },
      onChanged: (value) {
        if (value != null) {
          setState(() {
            _selectedBranchId = value;
            _selectedDepartmentId = null;
          });
          provider.getAllDepartmentByBranchId(context, value);
        }
      },
      hint: _selectedCityId == null ? 'Select City first' : 'Choose Branch',
      label: 'Branch',
      isReadOnly: !isEnabled,
      validator: (value) => value == null ? 'Please select a branch' : null,
    );
  }

  Widget _buildDepartmentDropdown(AdminLocationApiProvider provider) {
    final departments = provider.getAllDepartmentByBranchIdModelResponse?.data?.data ?? [];
    final isEnabled = _selectedBranchId != null && departments.isNotEmpty;

    return ResponsiveDropdown<String>(
      value: _selectedDepartmentId,
      itemList: isEnabled ? departments.map((dept) => dept.sId!).toList() : [],
      itemDisplayBuilder: (id) {
        final dept = departments.firstWhere((d) => d.sId == id);
        return dept.title ?? 'N/A';
      },
      onChanged: (value) {
        if (value != null) {
          setState(() {
            _selectedDepartmentId = value;
          });
        }
      },
      hint: _selectedBranchId == null ? 'Select Branch first' : 'Choose Department',
      label: 'Department',
      isReadOnly: !isEnabled,
      validator: (value) => value == null ? 'Please select a department' : null,
    );
  }
  Widget _buildPermissionSection(String title, Map<String, bool> permissions) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Simple Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.endingGreyColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(10),
                topRight: Radius.circular(10),
              ),
            ),
            child: Row(
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
                const Spacer(),
                Text(
                  '${permissions.values.where((v) => v).length}/${permissions.length}',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          // Grid Permissions
          Padding(
            padding: const EdgeInsets.all(12),
            child: GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 8,
                mainAxisSpacing: 8,
                childAspectRatio: 3.5,
              ),
              itemCount: permissions.length,
              itemBuilder: (context, index) {
                final entry = permissions.entries.elementAt(index);
                return InkWell(
                  onTap: () => setState(() => permissions[entry.key] = !entry.value),
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: entry.value ? Colors.orange.withOpacity(0.1) : Colors.grey[100],
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: entry.value ? Colors.orange : Colors.grey[300]!,
                        width: 1.5,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          entry.value ? Icons.check_box : Icons.check_box_outline_blank,
                          color: entry.value ? Colors.orange : Colors.grey[400],
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            entry.key.replaceAll('_', ' '),
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: entry.value ? FontWeight.w600 : FontWeight.w500,
                              color: entry.value ? Colors.orange : Colors.grey[700],
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      final selectedCrud = _crudPermissions.entries
          .where((e) => e.value)
          .map((e) => e.key)
          .toList();
      final selectedWorkflow = _workflowPermissions.entries
          .where((e) => e.value)
          .map((e) => e.key)
          .toList();
      final selectedData = _dataPermissions.entries
          .where((e) => e.value)
          .map((e) => e.key)
          .toList();
      final selectedSystem = _systemPermissions.entries
          .where((e) => e.value)
          .map((e) => e.key)
          .toList();

      final Map<String, dynamic> body = {
        'title': _titleController.text.trim(),
        'department': _selectedDepartmentId,
        'description': _descriptionController.text.trim(),
        'permissions': {},
      };

      // Only add non-empty permission arrays
      if (selectedCrud.isNotEmpty) {
        body['permissions']['crud'] = selectedCrud;
      }
      if (selectedWorkflow.isNotEmpty) {
        body['permissions']['workflow'] = selectedWorkflow;
      }
      if (selectedData.isNotEmpty) {
        body['permissions']['data'] = selectedData;
      }
      if (selectedSystem.isNotEmpty) {
        body['permissions']['system'] = selectedSystem;
      }

      final provider = Provider.of<AdminLocationApiProvider>(context, listen: false);

      if (widget.isEdit && widget.actionGroup?.sId != null) {
        // Update existing action group
        await provider.updateActionGroup(
          context,
          widget.actionGroup!.sId!,
          body,
        );
      } else {
        // Create new action group
        await provider.createActionGroup(context, body);
      }
    }
  }
}