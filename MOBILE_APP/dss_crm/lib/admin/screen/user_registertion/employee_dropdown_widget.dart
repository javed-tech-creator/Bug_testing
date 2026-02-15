import 'package:dss_crm/admin/model/employee_profile/get_all_admin_employee_list_model.dart';
import 'package:dss_crm/admin/screen/user_registertion/user_static_type.dart';
import 'package:dss_crm/admin/screen/vendor/model/all_vendor_list_model.dart' as vendor_model;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import '../../controller/admin_main_api_provider.dart';


class EmployeeListDropdown extends StatefulWidget {
  final Function(Data?) onEmployeeSelected;
  final String? initialEmployeeId;
  final UserType? selectedUserType;

  const EmployeeListDropdown({
    Key? key,
    required this.onEmployeeSelected,
    this.initialEmployeeId,
    this.selectedUserType,
  }) : super(key: key);

  @override
  State<EmployeeListDropdown> createState() => _EmployeeListDropdownState();
}

class _EmployeeListDropdownState extends State<EmployeeListDropdown> {
  String? _selectedEmployeeId;
  Data? _selectedEmployee;
  UserType? _previousUserType;

  @override
  void initState() {
    super.initState();
    _selectedEmployeeId = widget.initialEmployeeId;
    _previousUserType = widget.selectedUserType;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchDataBasedOnUserType();
    });
  }

  @override
  void didUpdateWidget(EmployeeListDropdown oldWidget) {
    super.didUpdateWidget(oldWidget);

    // CRITICAL: Check if User Type changed
    if (oldWidget.selectedUserType != widget.selectedUserType) {
      print('🔄 User Type Changed: ${oldWidget.selectedUserType?.name} -> ${widget.selectedUserType?.name}');

      // Clear selection immediately (NO setState needed here - didUpdateWidget already triggers rebuild)
      _selectedEmployeeId = null;
      _selectedEmployee = null;
      _previousUserType = widget.selectedUserType;

      // Notify parent AFTER build completes
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          widget.onEmployeeSelected(null);
          _fetchDataBasedOnUserType();
        }
      });
    }
  }

  void _fetchDataBasedOnUserType() {
    if (!mounted) return;

    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    final userType = widget.selectedUserType;

    if (userType == null) {
      print('⚠️ No user type selected yet');
      return;
    }

    switch (userType) {
      case UserType.employee:
        print('📞 Fetching Employee List');
        provider.getAllAdminEmployeeList(context);
        break;
      case UserType.vendor:
        print('📞 Fetching Vendor List');
        provider.getAllVendorListAtAdmin(context);
        break;
      case UserType.contractor:
        print('📞 Fetching Contractor List');
        provider.getAllContractorListAtAdmin(context);
        break;
      case UserType.freelancer:
        print('📞 Fetching Freelancer List');
        provider.getAllFreelancerListAtAdmin(context);
        break;
      case UserType.partner:
        print('📞 Fetching Partner List');
        provider.getAllPartnerListAtAdmin(context);
        break;
      case UserType.franchise:
        print('📞 Fetching Franchise List');
        provider.getAllFranchiseListAtAdmin(context);
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AdminMainApiProvider>(
      builder: (context, adminProvider, child) {
        List<dynamic>? itemList;
        String dropdownLabel = 'Select Employee';
        String hintText = 'Choose an employee';

        final userType = widget.selectedUserType;

        if (userType == null) {
          return ResponsiveDropdown<String>(
            value: null,
            itemList: [],
            itemDisplayBuilder: (id) => '',
            onChanged: null,
            hint: 'Please select a user type first',
            label: 'Select Employee',
            isReadOnly: true,
            validator: (value) => 'Please select a user type first',
          );
        }

        // Get list based on selected user type
        switch (userType) {
          case UserType.employee:
            if (adminProvider.getAllAdminEmployeeListListModelResponse?.data != null) {
              final responseData = adminProvider.getAllAdminEmployeeListListModelResponse?.data as dynamic;
              if (responseData is GetAllAdminEmployeeListModelResponse) {
                itemList = responseData.data?.cast<dynamic>();
              } else if (responseData is List) {
                itemList = responseData;
              }
            }
            dropdownLabel = 'Select Employee';
            hintText = 'Choose an employee';
            break;

          case UserType.vendor:
            if (adminProvider.getAllVendorListAtAdminModelResponse?.data?.data != null) {
              itemList = adminProvider.getAllVendorListAtAdminModelResponse?.data?.data?.cast<dynamic>();
            }
            dropdownLabel = 'Select Vendor';
            hintText = 'Choose a vendor';
            break;

          case UserType.contractor:
            if (adminProvider.getAllVendorListAtAdminModelResponse?.data?.data != null) {
              itemList = adminProvider.getAllVendorListAtAdminModelResponse?.data?.data?.cast<dynamic>();
            }
            dropdownLabel = 'Select Contractor';
            hintText = 'Choose a contractor';
            break;

          case UserType.freelancer:
            if (adminProvider.getAllVendorListAtAdminModelResponse?.data?.data != null) {
              itemList = adminProvider.getAllVendorListAtAdminModelResponse?.data?.data?.cast<dynamic>();
            }
            dropdownLabel = 'Select Freelancer';
            hintText = 'Choose a freelancer';
            break;

          case UserType.partner:
            if (adminProvider.getAllVendorListAtAdminModelResponse?.data?.data != null) {
              itemList = adminProvider.getAllVendorListAtAdminModelResponse?.data?.data?.cast<dynamic>();
            }
            dropdownLabel = 'Select Partner';
            hintText = 'Choose a partner';
            break;

          case UserType.franchise:
            if (adminProvider.getAllVendorListAtAdminModelResponse?.data?.data != null) {
              itemList = adminProvider.getAllVendorListAtAdminModelResponse?.data?.data?.cast<dynamic>();
            }
            dropdownLabel = 'Select Franchise';
            hintText = 'Choose a franchise';
            break;
        }

        final isLoading = adminProvider.isLoading;
        final items = itemList ?? [];
        final isEnabled = !isLoading && items.isNotEmpty;

        // Only try to find selected item if we have a valid ID and items
        if (_selectedEmployeeId != null && items.isNotEmpty) {
          final foundItem = items.firstWhere(
                (item) => _getItemId(item) == _selectedEmployeeId,
            orElse: () => null,
          );

          if (foundItem != null) {
            if (_selectedEmployee == null || _getItemId(_selectedEmployee) != _getItemId(foundItem)) {
              _selectedEmployee = _convertToData(foundItem, userType);

              WidgetsBinding.instance.addPostFrameCallback((_) {
                if (mounted) {
                  widget.onEmployeeSelected(_selectedEmployee);
                }
              });
            }
          }
        }

        return ResponsiveDropdown<String>(
          key: ValueKey('${userType.name}_dropdown'), // Force rebuild on type change
          value: _selectedEmployeeId,
          itemList: isEnabled ? items.map((item) => _getItemId(item)!).toList() : [],
          itemDisplayBuilder: (id) {
            final item = items.firstWhere(
                  (i) => _getItemId(i) == id,
              orElse: () => null,
            );

            if (item == null) return 'N/A';

            final name = _getItemName(item);
            final employeeId = _getEmployeeId(item);

            return employeeId != null ? '$name - $employeeId' : name;
          },
          onChanged: isEnabled
              ? (value) {
            if (value != null) {
              final selectedItem = items.firstWhere(
                    (i) => _getItemId(i) == value,
                orElse: () => null,
              );

              if (selectedItem != null) {
                setState(() {
                  _selectedEmployeeId = value;
                  _selectedEmployee = _convertToData(selectedItem, userType);
                });
                widget.onEmployeeSelected(_selectedEmployee);

                print('✅ Selected ${userType.displayName}: ${_getItemName(selectedItem)}');
              }
            }
          }
              : null,
          hint: isLoading ? 'Loading ${userType.displayName.toLowerCase()}s...' : hintText,
          label: dropdownLabel,
          isReadOnly: !isEnabled,
          validator: (value) => value == null ? 'Please select a ${userType.displayName.toLowerCase()}' : null,
        );
      },
    );
  }

  String? _getItemId(dynamic item) {
    if (item == null) return null;
    if (item is Data) return item.sId;
    if (item is vendor_model.Data) return item.sId;
    return null;
  }

  String _getItemName(dynamic item) {
    if (item == null) return 'N/A';
    if (item is Data) return item.name ?? 'N/A';
    if (item is vendor_model.Data) return item.contactPersonName ?? 'N/A';
    return 'N/A';
  }

  String? _getEmployeeId(dynamic item) {
    if (item == null) return null;
    if (item is Data) return item.employeeId;
    if (item is vendor_model.Data) return item.profileId;
    return null;
  }

  Data _convertToData(dynamic item, UserType userType) {
    if (item is Data) {
      return item;
    }

    if (item is vendor_model.Data) {
      return Data(
        sId: item.sId,
        name: item.contactPersonName,
        email: item.email,
        phone: item.contactNumber,
        whatsapp: item.alternateContact,
        employeeId: item.profileId,
      );
    }

    return Data();
  }
}