import 'package:dss_crm/admin/controller/admin_location_api_provider.dart';
import 'package:dss_crm/admin/model/department/get_all_branch_department_list_model.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../ui_helper/app_colors.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/form_validations_utils.dart';
import '../../../utils/responsive_dropdown_utils.dart';


// Edit Department Bottom Sheet - Complete Code
class EditDepartmentBottomSheet extends StatefulWidget {
  final Data department;
  final VoidCallback onUpdated;

  const EditDepartmentBottomSheet({Key? key, required this.department, required this.onUpdated}) : super(key: key);

  @override
  State<EditDepartmentBottomSheet> createState() => _EditDepartmentBottomSheetState();
}

class _EditDepartmentBottomSheetState extends State<EditDepartmentBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  String? _selectedBranchId;
  String? _selectedStatus;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.department.title);
    _selectedBranchId = widget.department.branch?.sId;
    _selectedStatus = widget.department.status;
  }

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(topLeft: Radius.circular(28), topRight: Radius.circular(28)),
      ),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) {
          return SingleChildScrollView(
            controller: scrollController,
            child: Padding(
              padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(context).viewInsets.bottom + 24),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 48,
                        height: 4,
                        decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text('Edit Department', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.black87, letterSpacing: -0.5)),
                    const SizedBox(height: 8),
                    Text('Update department information', style: TextStyle(fontSize: 13, color: Colors.grey[600])),
                    const SizedBox(height: 18),
                    CustomTextField(
                      title: "Department Name",
                      hintText: "Department Name",
                      controller: _titleController,
                      prefixIcon: Icons.business,
                      validator: (value) => FormValidatorUtils.validateRequired(
                        value,
                        fieldName: "Department Name",
                      ),
                    ),

                    Consumer<AdminLocationApiProvider>(
                      builder: (context, provider, _) {
                        final branches = provider.getAllBranchListModelResponse?.data?.data ?? [];
                        final branchIds = branches.map((b) => b.sId ?? '').where((id) => id.isNotEmpty).toList();
                        return ResponsiveDropdown<String>(
                          value: _selectedBranchId, // Uses the state variable initialized with the department's branch ID
                          itemList: branchIds, // List of Branch IDs (Strings)
                          onChanged: (branchId) {
                            // Only update the selected branch ID in the state
                            setState(() {
                              _selectedBranchId = branchId;
                            });
                          },
                          hint: 'Choose a branch',
                          label: 'Select Branch',
                          // Custom logic to display the branch title based on its ID
                          itemDisplayBuilder: (id) {
                            try {
                              return branches
                                  .firstWhere((b) => b.sId == id)
                                  .title ??
                                  'N/A';
                            } catch (e) {
                              // Fallback if the ID is not found in the list (e.g., initial state)
                              return 'N/A';
                            }
                          },
                          validator: (value) => (value == null || value.isEmpty)
                              ? 'Please select a branch'
                              : null,
                        );
                      },
                    ),

                    ResponsiveHelper.sizedBoxHeight(context, 10),
                    Consumer<AdminLocationApiProvider>(
                      builder: (context, provider, _) {
                        return Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: provider.isLoading ? null : () => Navigator.pop(context),
                                style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: Colors.grey),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                ),
                                child: const Text('Cancel', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.grey)),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: provider.isLoading ? null : ()async {
                                  if (_formKey.currentState!.validate()) {
                                    final body = {
                                      'title': _titleController.text,
                                      'branch': _selectedBranchId,
                                      // 'status': _selectedStatus,
                                    };
                                   await provider.updateDepartment(context, widget.department.sId ?? '', body).then((_) {
                                      // Navigator.pop(context);
                                      provider.getAllDepartmentList(context);
                                    });
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                ),
                                child: provider.isLoading
                                    ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(Colors.white)))
                                    : const Text('Update', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
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