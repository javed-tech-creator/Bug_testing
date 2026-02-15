import 'package:flutter/material.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/responsive_dropdown_utils.dart';


class LeadManagementFormWidget extends StatelessWidget {
  final TextEditingController companyNameController;
  final TextEditingController concernPersonNameController;
  final TextEditingController concernPersonDesignationController;
  final TextEditingController addressController;
  final TextEditingController phoneController;
  final TextEditingController remarkController;
  final TextEditingController projectDetailController;
  final TextEditingController clientRatingController;
  final TextEditingController clientProfileCommentController;
  final TextEditingController expectedBusinessSizeController;

  final String? selectedLeadSource;
  final String? selectedBusinessType;
  final String? selectedLeadStatus;
  final String? selectedContentShared;
  final String? selectedReccaStatus;

  final ValueChanged<String?> onLeadSourceChanged;
  final ValueChanged<String?> onBusinessTypeChanged;
  final ValueChanged<String?> onLeadStatusChanged;
  final ValueChanged<String?> onContentSharedChanged;
  final ValueChanged<String?> onReccaStatusChanged;

  const LeadManagementFormWidget({
    Key? key,
    required this.companyNameController,
    required this.concernPersonNameController,
    required this.concernPersonDesignationController,
    required this.addressController,
    required this.phoneController,
    required this.remarkController,
    required this.projectDetailController,
    required this.clientRatingController,
    required this.clientProfileCommentController,
    required this.expectedBusinessSizeController,
    required this.selectedLeadSource,
    required this.selectedBusinessType,
    required this.selectedLeadStatus,
    required this.selectedContentShared,
    required this.selectedReccaStatus,
    required this.onLeadSourceChanged,
    required this.onBusinessTypeChanged,
    required this.onLeadStatusChanged,
    required this.onContentSharedChanged,
    required this.onReccaStatusChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CustomTextField(
          controller: companyNameController,
          title: "Company / Individual Name *",
          hintText: "Company / Individual Name",
          readOnly: true,
        ),
        CustomTextField(
          controller: concernPersonNameController,
          title: "Concern Person Name *",
          hintText: "Concern Person Name",
          readOnly: true,
        ),
        CustomTextField(
          controller: concernPersonDesignationController,
          title: "Concern Person Designation *",
          hintText: "Concern Person Designation",
          readOnly: true,
        ),
        CustomTextField(
          controller: addressController,
          title: "Address",
          hintText: "Address",
          readOnly: true,
        ),
        CustomTextField(
          controller: phoneController,
          title: "Phone *",
          hintText: "Phone",
          keyboardType: TextInputType.phone,
          readOnly: true,
        ),
        CustomTextField(
          controller: remarkController,
          title: "Remark",
          hintText: "Remark",
          readOnly: true,
        ),
        CustomTextField(
          controller: projectDetailController,
          title: "Project Detail",
          hintText: "Project Detail",
          readOnly: true,
        ),
        CustomTextField(
          controller: clientRatingController,
          title: "Client Rating",
          hintText: "Client Rating",
          keyboardType: TextInputType.number,
          readOnly: true,
        ),
        CustomTextField(
          controller: clientProfileCommentController,
          title: "Client Profile Comment",
          hintText: "Client Profile Comment",
          readOnly: true,
        ),
        CustomTextField(
          controller: expectedBusinessSizeController,
          title: "Expected Business Size",
          hintText: "Expected Business Size",
          keyboardType: TextInputType.number,
          prefixIcon: Icons.currency_rupee_rounded,
          readOnly: true,
        ),
        ResponsiveDropdown<String>(
          value: selectedLeadSource,
          // itemList: ['Website', 'Referral', 'Social Media', 'Other'],
          itemList:  ['Website', 'Phone','Email','Justdial','Facebook','Instagram', 'Indiamart',"Other"],
          onChanged: onLeadSourceChanged,
          hint: "Select Lead Source",
          label: "Lead Source",
          isReadOnly: true,
        ),
        // ResponsiveDropdown<String>(
        //   value: selectedBusinessType,
        //   itemList: ['B2B', 'B2C',"B2G","Retail","Wholesale","Manufacturing","Service","Other"],
        //   onChanged: onBusinessTypeChanged,
        //   hint: "Select Business Type",
        //   label: "Business Type",
        //   isReadOnly: true,
        // ),
        ResponsiveDropdown<String>(
          value: selectedLeadStatus,
          itemList: ['Pending', 'In Progress', 'Closed', 'Success'],
          onChanged: onLeadStatusChanged,
          hint: "Select Lead Status",
          label: "Lead Status",
          isReadOnly: true,
        ),
        // ResponsiveDropdown<String>(
        //   value: selectedContentShared,
        //   itemList: ['true', 'false'],
        //   onChanged: onContentSharedChanged,
        //   hint: "Select Content Shared",
        //   label: "Content Shared",
        //   isReadOnly: true,
        // ),
        ResponsiveDropdown<String>(
          value: selectedReccaStatus,
          itemList: ['Pending', 'Completed', 'Canceled'],
          onChanged: onReccaStatusChanged,
          hint: "Select Recce Status",
          label: "Recce Status",
          isReadOnly: true,
        ),
      ],
    );
  }
}