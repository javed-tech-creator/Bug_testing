// user_static_type.dart
import 'package:flutter/material.dart';
import 'package:dss_crm/utils/responsive_dropdown_utils.dart';

enum UserType {
  employee('Employee', 'employee'),
  vendor('Vendor', 'vendor'),
  contractor('Contractor', 'contractor'),
  freelancer('Freelancer', 'freelancer'),
  partner('Partner', 'partner'),
  franchise('Franchise', 'franchise');

  final String displayName;
  final String apiValue; // lowercase for API calls
  const UserType(this.displayName, this.apiValue);
}

class UserTypeDropdown extends StatelessWidget {
  final UserType? selectedUserType;
  final ValueChanged<UserType?>? onChanged;
  final bool isRequired;
  final bool isReadOnly;

  const UserTypeDropdown({
    Key? key,
    this.selectedUserType,
    this.onChanged,
    this.isRequired = true,
    this.isReadOnly = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ResponsiveDropdown<UserType>(
      value: selectedUserType,
      itemList: UserType.values,
      itemDisplayBuilder: (type) => type.displayName,
      onChanged: isReadOnly ? null : onChanged,
      hint: '-- Select User Type --',
      label: 'Select User Type',
      isReadOnly: isReadOnly,
      validator: isRequired
          ? (value) => value == null ? 'Please select a user type' : null
          : null,
    );
  }
}