import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controller/tech_manager_api_provider.dart';

// Data models (no change)
class Department {
  final String id;
  final String name;

  Department({required this.id, required this.name});
}

class Role {
  final String id;
  final String name;
  final String departmentId;

  Role({required this.id, required this.name, required this.departmentId});
}

class Employee {
  final String id;
  final String name;
  final String roleId;
  final String departmentId;

  Employee({required this.id, required this.name, required this.roleId, required this.departmentId});
}

// Bottom Sheet Widget
class ReassignBottomSheet extends StatefulWidget {
  final VoidCallback? onAssetDeleted;
  final String assetId; // Add assetId parameter
  final BuildContext? parentContext; // Add parent context
  final VoidCallback? onAssignmentSuccess; // Add callback for success

  final Function({
  required String departmentId,
  required String departmentName,
  required String roleId,
  required String roleName,
  required String employeeId,
  required String employeeName,
  })? onReassign;

  const ReassignBottomSheet({
    Key? key,
    this.onReassign,
    this.onAssetDeleted,
    required this.assetId, // Make assetId required
    this.parentContext, // Add parent context parameter
    this.onAssignmentSuccess,
  }) : super(key: key);

  @override
  State<ReassignBottomSheet> createState() => _ReassignBottomSheetState();
}

class _ReassignBottomSheetState extends State<ReassignBottomSheet> {
  String? selectedDepartmentId;
  String? selectedRoleId;
  String? selectedEmployeeId;
  bool isAssigning = false; // Add loading state

  // Sample data (no change)
  final List<Department> departments = [
    Department(id: '1', name: 'IT'),
    Department(id: '2', name: 'HR'),
    Department(id: '3', name: 'Finance'),
    Department(id: '4', name: 'Marketing'),
  ];

  final List<Role> roles = [
    Role(id: '1', name: 'Software Developer', departmentId: '1'),
    Role(id: '2', name: 'System Admin', departmentId: '1'),
    Role(id: '3', name: 'HR Manager', departmentId: '2'),
    Role(id: '4', name: 'Recruiter', departmentId: '2'),
    Role(id: '5', name: 'Accountant', departmentId: '3'),
    Role(id: '6', name: 'Financial Analyst', departmentId: '3'),
    Role(id: '7', name: 'Marketing Executive', departmentId: '4'),
    Role(id: '8', name: 'Content Writer', departmentId: '4'),
  ];

  final List<Employee> employees = [
    Employee(id: '1', name: 'John Doe', roleId: '1', departmentId: '1'),
    Employee(id: '2', name: 'Jane Smith', roleId: '2', departmentId: '1'),
    Employee(id: '3', name: 'Mike Johnson', roleId: '3', departmentId: '2'),
    Employee(id: '4', name: 'Sarah Wilson', roleId: '4', departmentId: '2'),
    Employee(id: '5', name: 'David Brown', roleId: '5', departmentId: '3'),
    Employee(id: '6', name: 'Emma Davis', roleId: '6', departmentId: '3'),
    Employee(id: '7', name: 'Tom Miller', roleId: '7', departmentId: '4'),
    Employee(id: '8', name: 'Lisa Anderson', roleId: '8', departmentId: '4'),
  ];

  List<Role> getFilteredRoles() {
    if (selectedDepartmentId == null) return [];
    return roles.where((role) => role.departmentId == selectedDepartmentId).toList();
  }

  List<Employee> getFilteredEmployees() {
    if (selectedRoleId == null) return [];
    return employees.where((employee) =>
    employee.roleId == selectedRoleId &&
        employee.departmentId == selectedDepartmentId
    ).toList();
  }

  void _onDepartmentChanged(String? value) {
    setState(() {
      selectedDepartmentId = value;
      selectedRoleId = null;
      selectedEmployeeId = null;
    });
  }

  void _onRoleChanged(String? value) {
    setState(() {
      selectedRoleId = value;
      selectedEmployeeId = null;
    });
  }

  void _onEmployeeChanged(String? value) {
    setState(() {
      selectedEmployeeId = value;
    });
  }

  bool get isFormValid =>
      selectedDepartmentId != null &&
          selectedRoleId != null &&
          selectedEmployeeId != null;

  Future<void> _handleAssignAsset() async {
    if (!isFormValid || isAssigning) return;

    setState(() {
      isAssigning = true;
    });

    try {
      // Find the selected objects by their IDs
      final selectedDepartment = departments.firstWhere(
            (d) => d.id == selectedDepartmentId,
      );
      final selectedRole = roles.firstWhere(
            (r) => r.id == selectedRoleId,
      );
      final selectedEmployee = employees.firstWhere(
            (e) => e.id == selectedEmployeeId,
      );

      // Prepare the request body
      final body = {
        "department": selectedDepartment.name,
        "role": selectedRole.name,
        "assigned_to": selectedEmployee.name,
      };

      // Get the provider
      final assetAssignProvider = context.read<TechManagerApiProvider>();

      // Call the API
      await assetAssignProvider.assetAssignWithoutNavigation(
          context,
          body,
          widget.assetId
      );

      // Check if the assignment was successful
      if (assetAssignProvider.assignTechAssetsModelResponse?.success == true) {
        // Close the bottom sheet
        // Navigator.of(context).pop();

        // Wait a bit for the modal to fully dismiss
        await Future.delayed(const Duration(milliseconds: 300));
        final contextToUse = widget.parentContext ?? context;
        // Refresh the assets list
        if (contextToUse.mounted) {
          try {
            await assetAssignProvider.getAllTechAssetsList(context, 1, 5);

            // Call the success callback
            widget.onAssignmentSuccess?.call();
            // STEP 3: Now close the modal
            if (mounted && Navigator.canPop(context)) {
              Navigator.of(context).pop(true);
              print('Modal closed after successful refresh');
            }
            // Optional: Call the legacy callback if provided
            widget.onReassign?.call(
              departmentId: selectedDepartment.id,
              departmentName: selectedDepartment.name,
              roleId: selectedRole.id,
              roleName: selectedRole.name,
              employeeId: selectedEmployee.id,
              employeeName: selectedEmployee.name,
            );
          } catch (e) {
            print('Error refreshing list: $e');
          }
        }
      } else {
        // Handle assignment failure
        print('Assignment failed: ${assetAssignProvider.assignTechAssetsModelResponse?.message}');
      }
    } catch (e) {
      // Error is already handled by the provider
      print('Assignment error: $e');
    } finally {
      if (mounted) {
        setState(() {
          isAssigning = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              border: Border(
                bottom: BorderSide(color: Color(0xFFE5E5E5), width: 1),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.swap_horiz,
                  color: Colors.orange[400],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Reassign to Another',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
                const Spacer(),
                GestureDetector(
                  onTap: isAssigning ? null : () => Navigator.pop(context),
                  child: Icon(
                    Icons.close,
                    color: isAssigning ? Colors.grey[400] : Colors.grey,
                    size: 24,
                  ),
                ),
              ],
            ),
          ),

          // Form Content
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Department Dropdown
                const Text(
                  'Department',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: const Color(0xFFE5E5E5)),
                    borderRadius: BorderRadius.circular(8),
                    color: isAssigning ? const Color(0xFFF0F0F0) : const Color(0xFFF8F9FA),
                  ),
                  child: DropdownButtonFormField<String>(
                    value: selectedDepartmentId,
                    decoration: const InputDecoration(
                      hintText: 'Select Department',
                      hintStyle: TextStyle(color: Colors.grey),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    icon: const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
                    items: departments.map((department) {
                      return DropdownMenuItem<String>(
                        value: department.id,
                        child: Text(department.name),
                      );
                    }).toList(),
                    onChanged: isAssigning ? null : _onDepartmentChanged,
                  ),
                ),

                const SizedBox(height: 20),

                // Role Dropdown
                const Text(
                  'Role',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: const Color(0xFFE5E5E5)),
                    borderRadius: BorderRadius.circular(8),
                    color: (selectedDepartmentId == null || isAssigning)
                        ? const Color(0xFFF0F0F0)
                        : const Color(0xFFF8F9FA),
                  ),
                  child: DropdownButtonFormField<String>(
                    value: selectedRoleId,
                    decoration: const InputDecoration(
                      hintText: 'Select Role',
                      hintStyle: TextStyle(color: Colors.grey),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    icon: const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
                    items: selectedDepartmentId == null ? [] : getFilteredRoles().map((role) {
                      return DropdownMenuItem<String>(
                        value: role.id,
                        child: Text(role.name),
                      );
                    }).toList(),
                    onChanged: (selectedDepartmentId == null || isAssigning) ? null : _onRoleChanged,
                  ),
                ),

                const SizedBox(height: 20),

                // Employee Dropdown
                const Text(
                  'Employee',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: const Color(0xFFE5E5E5)),
                    borderRadius: BorderRadius.circular(8),
                    color: (selectedRoleId == null || isAssigning)
                        ? const Color(0xFFF0F0F0)
                        : const Color(0xFFF8F9FA),
                  ),
                  child: DropdownButtonFormField<String>(
                    value: selectedEmployeeId,
                    decoration: const InputDecoration(
                      hintText: 'Select Employee',
                      hintStyle: TextStyle(color: Colors.grey),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    icon: const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
                    items: selectedRoleId == null ? [] : getFilteredEmployees().map((employee) {
                      return DropdownMenuItem<String>(
                        value: employee.id,
                        child: Text(employee.name),
                      );
                    }).toList(),
                    onChanged: (selectedRoleId == null || isAssigning) ? null : _onEmployeeChanged,
                  ),
                ),

                const SizedBox(height: 30),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: TextButton(
                        onPressed: isAssigning ? null : () => Navigator.pop(context),
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                            side: BorderSide(color: isAssigning ? Colors.grey[300]! : const Color(0xFFE5E5E5)),
                          ),
                          backgroundColor: Colors.white,
                        ),
                        child: Text(
                          'Cancel',
                          style: TextStyle(
                            color: isAssigning ? Colors.grey[400] : Colors.black54,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: (isFormValid && !isAssigning) ? _handleAssignAsset : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: (isFormValid && !isAssigning)
                              ? Colors.orange[400]
                              : Colors.grey[300],
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          elevation: 0,
                        ),
                        child: isAssigning
                            ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                            : Text(
                          'Update',
                          style: TextStyle(
                            color: (isFormValid && !isAssigning) ? Colors.white : Colors.grey[600],
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
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
}