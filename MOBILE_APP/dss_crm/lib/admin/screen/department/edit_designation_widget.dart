import 'package:dss_crm/admin/controller/admin_location_api_provider.dart';
import 'package:dss_crm/tech_module/tech_manager/widget/assign_bottom_sheet_widget.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/form_validations_utils.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import 'package:dss_crm/admin/model/department/designation/get_all_designation_list_model.dart';

class EditDesignationBottomSheet extends StatefulWidget {
  final Data designation;
  final VoidCallback onUpdated;

  const EditDesignationBottomSheet({
    Key? key,
    required this.designation,
    required this.onUpdated,
  }) : super(key: key);

  @override
  State<EditDesignationBottomSheet> createState() =>
      _EditDesignationBottomSheetState();
}

class _EditDesignationBottomSheetState
    extends State<EditDesignationBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  String? _selectedDepartmentId;
  String? _selectedBranchId;
  bool _isInitializing = true;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.designation.title);
    _descriptionController = TextEditingController(
      text: widget.designation.description,
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeData();
    });
  }

  Future<void> _initializeData() async {
    final provider = Provider.of<AdminLocationApiProvider>(
      context,
      listen: false,
    );

    // Load all branches if not loaded
    if (provider.getAllBranchListModelResponse == null) {
      await provider.getAllBranchList(context);
    }

    // Set branch from designation
    final branchId = widget.designation.branchId?.sId;
    final departmentId = widget.designation.depId?.sId;

    if (branchId != null && branchId.isNotEmpty) {
      // Fetch departments for this branch
      await provider.getAllDepartmentByBranchId(context, branchId);
    }

    // Set selected values after data is loaded
    setState(() {
      _selectedBranchId = branchId;
      _selectedDepartmentId = departmentId;
      _isInitializing = false;
    });
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(28),
          topRight: Radius.circular(28),
        ),
      ),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.8,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) {
          return SingleChildScrollView(
            controller: scrollController,
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                24,
                24,
                24,
                MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: _isInitializing
                  ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(40.0),
                  child: CircularProgressIndicator(
                    color: AppColors.primary,
                  ),
                ),
              )
                  : Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 48,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey[300],
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Edit Designation',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Update designation information',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Title Field
                    CustomTextField(
                      title: "Designation Title",
                      hintText: "Designation Title",
                      controller: _titleController,
                      prefixIcon: Icons.badge,
                      validator: (value) =>
                          FormValidatorUtils.validateRequired(
                            value,
                            fieldName: "Designation Title",
                          ),
                    ),

                    // Description Field
                    CustomTextField(
                      title: "Description",
                      hintText: "Description",
                      controller: _descriptionController,
                      maxLines: 3,
                      validator: (value) =>
                          FormValidatorUtils.validateRequired(
                            value,
                            fieldName: "Description",
                          ),
                    ),

                    // Branch Dropdown
                    Consumer<AdminLocationApiProvider>(
                      builder: (context, provider, _) {
                        final branches =
                            provider.getAllBranchListModelResponse?.data
                                ?.data ??
                                [];

                        // Remove duplicates
                        final uniqueBranchIds = branches
                            .map((b) => b.sId ?? '')
                            .where((id) => id.isNotEmpty)
                            .toSet()
                            .toList();

                        return ResponsiveDropdown<String>(
                          value: _selectedBranchId,
                          itemList: uniqueBranchIds,
                          onChanged: (branchId) async {
                            if (branchId != null && branchId.isNotEmpty) {
                              setState(() {
                                _selectedBranchId = branchId;
                                _selectedDepartmentId = null; // Reset
                              });

                              // Fetch departments for selected branch
                              await context
                                  .read<AdminLocationApiProvider>()
                                  .getAllDepartmentByBranchId(
                                context,
                                branchId,
                              );
                            }
                          },
                          hint: 'Choose a branch',
                          label: 'Select Branch',
                          itemDisplayBuilder: (id) {
                            try {
                              return branches
                                  .firstWhere((b) => b.sId == id)
                                  .title ??
                                  'N/A';
                            } catch (e) {
                              return 'N/A';
                            }
                          },
                          validator: (value) =>
                          (value == null || value.isEmpty)
                              ? 'Please select a branch'
                              : null,
                        );
                      },
                    ),

                    ResponsiveHelper.sizedBoxHeight(context, 10),
                    // // Department Dropdown
                    // Consumer<AdminLocationApiProvider>(
                    //   builder: (context, provider, _) {
                    //     final departments = provider
                    //         .getAllDepartmentByBranchIdModelResponse
                    //         ?.data
                    //         ?.data ??
                    //         [];
                    //     final isDepartmentLoading = provider.isDeprtLoading;
                    //
                    //     // Remove duplicates
                    //     final uniqueDepartmentIds = departments
                    //         .map((d) => d.sId ?? '')
                    //         .where((id) => id.isNotEmpty)
                    //         .toSet()
                    //         .toList();
                    //
                    //     // Validate selected department exists
                    //     if (_selectedDepartmentId != null &&
                    //         _selectedDepartmentId!.isNotEmpty &&
                    //         !uniqueDepartmentIds.contains(
                    //           _selectedDepartmentId,
                    //         )) {
                    //       WidgetsBinding.instance.addPostFrameCallback((_) {
                    //         if (mounted) {
                    //           setState(() {
                    //             _selectedDepartmentId = null;
                    //           });
                    //         }
                    //       });
                    //     }
                    //
                    //     return ResponsiveDropdown<String>(
                    //       value: _selectedDepartmentId,
                    //       itemList: uniqueDepartmentIds,
                    //       onChanged: _selectedBranchId == null
                    //           ? null
                    //           : (value) {
                    //         setState(() {
                    //           _selectedDepartmentId = value;
                    //         });
                    //       },
                    //       hint: _selectedBranchId == null
                    //           ? 'First select a branch'
                    //           : isDepartmentLoading
                    //           ? 'Loading departments...'
                    //           : departments.isEmpty
                    //           ? 'No departments available'
                    //           : 'Choose a department',
                    //       label: 'Select Department',
                    //       itemDisplayBuilder: (id) {
                    //         try {
                    //           return departments
                    //               .firstWhere((d) => d.sId == id)
                    //               .title ??
                    //               'N/A';
                    //         } catch (e) {
                    //           return 'N/A';
                    //         }
                    //       },
                    //       validator: (value) =>
                    //       (value == null || value.isEmpty)
                    //           ? 'Please select a department'
                    //           : null,
                    //     );
                    //   },
                    // ),
                    //
                    // const SizedBox(height: 20),

                    // Action Buttons
                    Consumer<AdminLocationApiProvider>(
                      builder: (context, provider, _) {
                        return Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: provider.isLoading
                                    ? null
                                    : () => Navigator.pop(context),
                                style: OutlinedButton.styleFrom(
                                  side: const BorderSide(
                                    color: Colors.grey,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius:
                                    BorderRadius.circular(12),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 14,
                                  ),
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
                                onPressed: provider.isLoading
                                    ? null
                                    : () async {
                                  if (_formKey.currentState!
                                      .validate()) {
                                    final body = {
                                      'title': _titleController.text,
                                      'description': _descriptionController.text,
                                      // 'depId': _selectedDepartmentId,
                                      'branchId': _selectedBranchId,
                                    };
                                    await provider.updateDesignation(
                                      context,
                                      widget.designation.sId ?? '',
                                      body,
                                    );

                                    if (context.mounted &&
                                        provider
                                            .updateDesignationModelResponse
                                            ?.success ==
                                            true) {
                                      widget.onUpdated();
                                    }
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius:
                                    BorderRadius.circular(12),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 14,
                                  ),
                                ),
                                child: provider.isLoading
                                    ? const SizedBox(
                                  height: 24,
                                  width: 24,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor:
                                    AlwaysStoppedAnimation(
                                      Colors.white,
                                    ),
                                  ),
                                )
                                    : const Text(
                                  'Update Designation',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}