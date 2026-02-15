import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';

import '../../utils/custom_buttons_utils.dart';
import '../../utils/default_common_app_bar.dart';

// Mock data for the table
final List<Map<String, dynamic>> _departments = List.generate(
  25,
  (index) => {
    'name': 'Department ${index + 1}',
    'employees': index % 5,
    'location': 'Location ${index % 3 + 1}',
    'operating': index % 2 == 0 ? 'In Office' : 'On Field',
    'createdOn': '14 Aug 2025',
  },
);

class DepartmentManagementScreen extends StatefulWidget {
  const DepartmentManagementScreen({super.key});

  @override
  State<DepartmentManagementScreen> createState() =>
      _DepartmentManagementScreenState();
}

class _DepartmentManagementScreenState
    extends State<DepartmentManagementScreen> {
  int _rowsPerPage = 10;
  int _currentPage = 1;
  late List<Map<String, dynamic>> _pagedDepartments;
  String _searchQuery = '';
  List<Map<String, dynamic>> _filteredDepartments = [];

  // Controllers for the new department form
  final _departmentNameController = TextEditingController();
  String _selectedLocation = 'Head Office';
  int _selectedEmployees = 0;
  String _selectedOperating = 'On Field';

  // Mock data for dropdowns
  final List<String> _locations = ['Head Office', 'Branch A', 'Branch B'];
  final List<int> _employeeNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  @override
  void initState() {
    super.initState();
    _filteredDepartments = _departments;
    _updatePagedDepartments();
  }

  void _updatePagedDepartments() {
    final startIndex = (_currentPage - 1) * _rowsPerPage;
    final endIndex = startIndex + _rowsPerPage;
    _pagedDepartments = _filteredDepartments.sublist(
      startIndex,
      endIndex.clamp(startIndex, _filteredDepartments.length),
    );
  }

  void _onNextPage() {
    if ((_currentPage * _rowsPerPage) < _filteredDepartments.length) {
      setState(() {
        _currentPage++;
        _updatePagedDepartments();
      });
    }
  }

  void _onPreviousPage() {
    if (_currentPage > 1) {
      setState(() {
        _currentPage--;
        _updatePagedDepartments();
      });
    }
  }

  void _onRowsPerPageChanged(int? value) {
    if (value != null) {
      setState(() {
        _rowsPerPage = value;
        _currentPage = 1;
        _updatePagedDepartments();
      });
    }
  }

  void _onSearchChanged(String query) {
    setState(() {
      _searchQuery = query;
      if (query.isEmpty) {
        _filteredDepartments = _departments;
      } else {
        _filteredDepartments = _departments
            .where(
              (dept) =>
                  dept['name'].toLowerCase().contains(query.toLowerCase()) ||
                  dept['location'].toLowerCase().contains(
                    query.toLowerCase(),
                  ) ||
                  dept['operating'].toLowerCase().contains(query.toLowerCase()),
            )
            .toList();
      }
      _currentPage = 1;
      _updatePagedDepartments();
    });
  }

  Color _getOperatingColor(String operating) {
    switch (operating) {
      case 'In Office':
        return Colors.green;
      case 'On Field':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  int get _totalPages => (_filteredDepartments.length / _rowsPerPage).ceil();

  void _addNewDepartment() {
    setState(() {
      _departments.add({
        'name': _departmentNameController.text.isNotEmpty
            ? _departmentNameController.text
            : 'New Department',
        'employees': _selectedEmployees,
        'location': _selectedLocation,
        'operating': _selectedOperating,
        'createdOn': '14 Aug 2025',
      });
      _onSearchChanged(_searchQuery); // Refresh filtered list and pagination
      _departmentNameController.clear();
      _selectedLocation = _locations.first;
      _selectedEmployees = _employeeNumbers.first;
      _selectedOperating = 'On Field';
    });
    Navigator.of(context).pop();
  }


  void _deleteDepartment(Map<String, dynamic> department) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Confirm Deletion'),
          content: Text('Are you sure you want to delete "${department['name']}"?'),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              child: const Text('Delete', style: TextStyle(color: Colors.white)),
              onPressed: () {
                setState(() {
                  _departments.remove(department);
                  _onSearchChanged(_searchQuery); // Refresh filtered list and pagination
                });
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = ResponsiveHelper.isMobile(context);

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: DefaultCommonAppBar(
        activityName: 'Department Management',
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        // padding: EdgeInsets.all(isMobile ? 12.0 : 24.0),
        padding: ResponsiveHelper.paddingAll(context , isMobile ? 10.0 : 10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Section
            Container(
              padding:ResponsiveHelper.paddingAll(context, 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Departments',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Manage your organization departments',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  ResponsiveHelper.sizedBoxHeight(context, 10),
                  // Search Bar
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: TextField(
                      onChanged: _onSearchChanged,
                      decoration: InputDecoration(
                        hintText: 'Search departments...',
                        prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                      ),
                    ),


                  ),
                ],
              ),
            ),
            // const SizedBox(height: 24),


            // Stats Cards
            if (isMobile)
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        'Total Departments',
                        _departments.length.toString(),
                        Icons.business,
                        Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        'Total Employees',
                        _departments
                            .fold(
                              0,
                              (sum, dept) => sum + (dept['employees'] as int),
                            )
                            .toString(),
                        Icons.people,
                        Colors.green,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        'Active Locations',
                        _departments
                            .map((d) => d['location'])
                            .toSet()
                            .length
                            .toString(),
                        Icons.location_on,
                        Colors.orange,
                      ),
                    ),
                  ],
                ),
              ),

            // if (!isMobile) const SizedBox(height: 24),

            // Table Container
            Padding(
              padding: ResponsiveHelper.paddingSymmetric(context,horizontal: 0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    // Table Header
                    Container(
                      padding: const EdgeInsets.all(0),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(12),
                          topRight: Radius.circular(12),
                        ),
                      ),
                      child: Padding(
                        padding: ResponsiveHelper.paddingAll(context,5),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Department List (${_filteredDepartments.length})',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            Row(
                              children: [
                                const Text('Show'),
                                const SizedBox(width: 8),
                                Container(
                                  height: 40,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                  ),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: Colors.grey.shade300),
                                    borderRadius: BorderRadius.circular(4),
                                    color: Colors.white,
                                  ),
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton<int>(
                                      value: _rowsPerPage,
                                      items: [5, 10, 20]
                                          .map(
                                            (e) => DropdownMenuItem(
                                              value: e,
                                              child: Text('$e'),
                                            ),
                                          )
                                          .toList(),
                                      onChanged: _onRowsPerPageChanged,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                const Text('entries'),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Table Content
                    _filteredDepartments.isEmpty
                        ? _buildEmptyState()
                        : isMobile
                        ? _buildMobileList()
                        : _buildDesktopTable(),

                    // Pagination
                    if (_filteredDepartments.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: const BorderRadius.only(
                            bottomLeft: Radius.circular(12),
                            bottomRight: Radius.circular(12),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.first_page),
                                  onPressed: _currentPage > 1
                                      ? () {
                                          setState(() {
                                            _currentPage = 1;
                                            _updatePagedDepartments();
                                          });
                                        }
                                      : null,
                                ),
                                IconButton(
                                  icon: const Icon(Icons.chevron_left),
                                  onPressed: _currentPage > 1
                                      ? _onPreviousPage
                                      : null,
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 8,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.blue.shade100,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    '$_currentPage of $_totalPages',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.blue.shade800,
                                    ),
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.chevron_right),
                                  onPressed: _currentPage < _totalPages
                                      ? _onNextPage
                                      : null,
                                ),
                                IconButton(
                                  icon: const Icon(Icons.last_page),
                                  onPressed: _currentPage < _totalPages
                                      ? () {
                                          setState(() {
                                            _currentPage = _totalPages;
                                            _updatePagedDepartments();
                                          });
                                        }
                                      : null,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // Mobile Add Button
            if (isMobile) ...[
              CustomButton(
                color: AppColors.primary,
                // text: "Submit",
                text:   'Add Department',
                onPressed: () {
                  _showAddDepartmentBottomSheet(context);
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              const Spacer(),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              title,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Padding(
      padding: const EdgeInsets.all(32.0),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.business_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              _searchQuery.isEmpty
                  ? 'No departments found'
                  : 'No matching departments',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _searchQuery.isEmpty
                  ? 'Add your first department to get started'
                  : 'Try adjusting your search criteria',
              style: TextStyle(fontSize: 14, color: Colors.grey[500]),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMobileList() {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: _pagedDepartments.length,
      itemBuilder: (context, index) {
        final dept = _pagedDepartments[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      dept['name'],
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getOperatingColor(dept['operating']).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      dept['operating'],
                      style: TextStyle(
                        color: _getOperatingColor(dept['operating']),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.people, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text('${dept['employees']} employees'),
                  const Spacer(),
                  Icon(Icons.location_on, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(dept['location']),
                ],
              ),
              // const SizedBox(height: 8),
              // Updated Row for the created date and delete icon
              Container(
                height: 40,
                child: Row(
                  children: [
                    Icon(Icons.calendar_today, size: 16, color: Colors.grey[600]),
                    const SizedBox(width: 4),
                    Text('Created: ${dept['createdOn']}'),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red, size: 20,),
                      onPressed: () => _deleteDepartment(dept),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDesktopTable() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        columnSpacing: 20,
        dataRowHeight: 60,
        headingRowHeight: 56,
        columns: const [
          DataColumn(
            label: Text(
              'Department Name',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          DataColumn(
            label: Text(
              'Employees',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          DataColumn(
            label: Text(
              'Location',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          DataColumn(
            label: Text(
              'Operating',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          DataColumn(
            label: Text(
              'Created On',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ],
        rows: _pagedDepartments.map((department) {
          return DataRow(
            cells: [
              DataCell(
                Text(
                  department['name'],
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ),
              DataCell(
                Row(
                  children: [
                    Icon(Icons.people, size: 16, color: Colors.grey[600]),
                    const SizedBox(width: 4),
                    Text('${department['employees']}'),
                  ],
                ),
              ),
              DataCell(Text(department['location'])),
              DataCell(
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: _getOperatingColor(
                      department['operating'],
                    ).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    department['operating'],
                    style: TextStyle(
                      color: _getOperatingColor(department['operating']),
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              DataCell(Text(department['createdOn'])),
            ],
          );
        }).toList(),
      ),
    );
  }

  void _showAddDepartmentBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              child: Container(
                padding: const EdgeInsets.all(24.0),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                ),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Add Department',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      _buildFormRow(
                        label: 'Name',
                        child: TextField(
                          controller: _departmentNameController,
                          decoration: const InputDecoration(
                            hintText: 'IT Department',
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      _buildFormRow(
                        label: 'Locations',
                        child: DropdownButtonFormField<String>(
                          value: _selectedLocation,
                          items: _locations
                              .map(
                                (e) =>
                                    DropdownMenuItem(value: e, child: Text(e)),
                              )
                              .toList(),
                          onChanged: (value) {
                            if (value != null) {
                              setState(() {
                                _selectedLocation = value;
                              });
                            }
                          },
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      _buildFormRow(
                        label: 'Employees',
                        child: DropdownButtonFormField<int>(
                          value: _selectedEmployees,
                          items: _employeeNumbers
                              .map(
                                (e) => DropdownMenuItem(
                                  value: e,
                                  child: Text('$e'),
                                ),
                              )
                              .toList(),
                          onChanged: (value) {
                            if (value != null) {
                              setState(() {
                                _selectedEmployees = value;
                              });
                            }
                          },
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      _buildFormRow(
                        label: 'Operating',
                        child: Row(
                          children: [
                            Expanded(
                              child: RadioListTile<String>(
                                title: const Text('On Field'),
                                value: 'On Field',
                                groupValue: _selectedOperating,
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() {
                                      _selectedOperating = value;
                                    });
                                  }
                                },
                                dense: true,
                                contentPadding: EdgeInsets.zero,
                              ),
                            ),
                            Expanded(
                              child: RadioListTile<String>(
                                title: const Text('In Office'),
                                value: 'In Office',
                                groupValue: _selectedOperating,
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() {
                                      _selectedOperating = value;
                                    });
                                  }
                                },
                                dense: true,
                                contentPadding: EdgeInsets.zero,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          // OutlinedButton(
                          //   onPressed: () => Navigator.of(context).pop(),
                          //   child: const Text('CLOSE'),
                          // ),
                          Expanded(
                            child: CustomButton(
                              color: AppColors.primary,
                              type: ButtonType.outlined,
                              text:   'CLOSE',
                              textColor: Colors.black,
                              onPressed: () {
                                Navigator.of(context).pop();
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          // ElevatedButton(
                          //   onPressed: _addNewDepartment,
                          //   child: const Text('SAVE'),
                          // ),
                          Expanded(
                            child: CustomButton(
                              color: AppColors.primary,
                              text:   'SAVE',
                              onPressed: () {
                                _addNewDepartment();
                              },
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildFormRow({required String label, required Widget child}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        SizedBox(
          width: 100,
          child: Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: Colors.grey[700],
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(child: child),
      ],
    );
  }
}
