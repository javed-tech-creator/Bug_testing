import 'package:dss_crm/sales_module/common/model/sales_person_list_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_assigned_lead_model.dart' as empAssignedLeadModel;
import 'package:dss_crm/sales_module/sales_hod/lead/controller/sales_hod_lead_controller.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
import '../../../../utils/responsive_loader_utils.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/form_validations_utils.dart';


class SalesEmployeeLeadManagementFormScreen extends StatefulWidget {
  final empAssignedLeadModel.Result leadData;

  const SalesEmployeeLeadManagementFormScreen({super.key, required this.leadData});

  @override
  State<SalesEmployeeLeadManagementFormScreen> createState() => _SalesEmployeeLeadManagementFormScreenState();
}

class _SalesEmployeeLeadManagementFormScreenState extends State<SalesEmployeeLeadManagementFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _senderNameController = TextEditingController();
  final TextEditingController _concernPersonNameController = TextEditingController();
  final TextEditingController _mobileNumberController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _companyNameController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _pinCodeController = TextEditingController();
  final TextEditingController _remarkController = TextEditingController();
  final TextEditingController _designationController = TextEditingController();
  final TextEditingController _projectDetailController = TextEditingController();
  final TextEditingController _expectedBusinessSizeController = TextEditingController();
  final TextEditingController _profileCommentController = TextEditingController();

  String? _selectedLeadSource;
  String? _selectedLeadStatus;
  String? _selectedCity;
  String? _selectedZone;
  String? _selectedSalesPersonName;
  String? _selectedSalesPersonId;
  final List<String> clientRatingList =  ["Hot", "Warm", "Cold", "Loss", "Win"];
  // final List<String> businessTypeList = ['Retail', 'Corporate', 'Franchise'];
  final List<String> businessTypeList = ['B2B', 'B2C',"B2G","Retail","Wholesale","Manufacturing","Service","Other"];
  final List<String> contentSharedList = ['Yes', 'No'];
  final List<String> recceStatusList = ['Pending', 'In Progress', 'Success', 'Close'];

  String? _selectedClientRating;
  String? _selectedBusinessType;
  String? _selectedContentShared;
  String? _selectedRecceStatus;


  final List<String> leadSourcesList = [
    'Website', 'Phone', 'Email', 'Justdial', 'Facebook', 'Instagram', 'Indiamart'
  ];

  final List<String> leadStatusLIst = ['Pending', 'In Progress', 'Success', 'Close'];
  final List<String> salePersonCityLIst = ['Lucknow', 'Jodhpur'];
  final List<String> salePersonZoneList = ["Lucknow",'Thakurganj', 'Matiyari'];

  String? _selectedLeadType;

  @override
  void initState() {
    super.initState();

    final lead = widget.leadData;
    _selectedLeadSource = leadSourcesList.contains(lead.leadSource) ? lead.leadSource : null;
    _selectedLeadStatus = leadStatusLIst.contains(lead.leadStatus) ? lead.leadStatus : null;
    _senderNameController.text = lead.senderName ?? '';
    _concernPersonNameController.text = lead.concernPersonName ?? '';
    _mobileNumberController.text = lead.phone ?? '';
    _emailController.text = lead.email ?? '';
    _companyNameController.text = lead.companyName ?? '';
    _addressController.text = lead.address ?? '';
    _pinCodeController.text = lead.pincode ?? '';
    _remarkController.text = lead.requirement ?? '';

    // Initialize other dropdown values if they exist in the lead data
    // if (lead.businessType != null) {
    //   _selectedBusinessType = _mapApiBusinessTypeToDropdown(lead.businessType);
    // }

    // Fetch sales person list
    // Future.microtask(() {
    //   context.read<SalesHODLeadApiProvider>().getAllSalesPersonList(context);
    // });
  }
  // Add this helper method to map API values to dropdown values
  String? _mapApiBusinessTypeToDropdown(String? apiValue) {
    if (apiValue == null) return null;

    switch (apiValue.toLowerCase()) {
      case 'b2b':
        return 'B2B';
      case 'b2c':
        return 'B2C';
      case 'b2g':
        return 'B2G';
      case 'retail':
        return 'Retail';
      case 'wholesale':
        return 'Wholesale';
      case 'manufacturing':
        return 'Manufacturing';
      case 'service':
        return 'Service';
      case 'other':
        return 'Other';
      default:
        return businessTypeList.contains(apiValue.trim()) ? apiValue.trim() : null;
        return null; // Return null if no match found
    }
  }

  void handleSubmit() async{
    // if (_selectedSalesPersonId == null) {
    //   ScaffoldMessenger.of(context).showSnackBar(
    //     const SnackBar(content: Text("Please select a Sales Person")),
    //   );
    //   return;
    // }
    final salesTLlgoinId = await StorageHelper().getLoginUserId();

    print("Selected Sales Person ID = $_selectedSalesPersonId");

    print("salesTLID = ${salesTLlgoinId}");
    final leadProvider = context.read<SalesHODLeadApiProvider>();
    final addLeadBody = {
      "salesTLId": salesTLlgoinId,
      "saleEmployeeId": _selectedSalesPersonId,
      "leadSource": _selectedLeadSource,
      "leadType": _selectedLeadType,
      "company": _companyNameController.text.trim(),
      "concernPersonName": _concernPersonNameController.text.trim(),
      "concernPersonNameDesignation": _designationController.text.trim(),
      "email":  _emailController.text.trim(),
      "phone":  _mobileNumberController.text.trim(),
      "address": _addressController.text.trim(),
      "remark": _remarkController.text.trim(),
      // "requirement": _remarkController.text.trim(),
      "projectDetail": _projectDetailController.text.trim(),
      "costumerStatus": _selectedClientRating,
      "expectedBusinessSize": _expectedBusinessSizeController.text.trim(),
      // "contentShared": _selectedContentShared,
      "clientProfileComment": _profileCommentController.text.trim(),
      "businessType": _selectedBusinessType,
      "recceStatus": _selectedRecceStatus,

    };
    leadProvider.leadAssignToSalesEmp(
      context,
      addLeadBody,
      widget.leadData.sId,
      false
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SalesHODLeadApiProvider>();

    // Extract the sales person list safely
    final List<Result> salesPersonList =
        provider.getSalesEmpModelResponse?.data?.data?.result ?? [];

    // Get the names for the dropdown
    final salesPersonNames = salesPersonList
        .map((e) => e.name ?? '')
        .where((name) => name.isNotEmpty)
        .toList();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "Lead Sheet Management",
        backgroundColor: AppColors.primary,
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              /// Lead Source Dropdown
              ResponsiveDropdown<String>(
                label: 'Lead Source',
                hint: 'Select Lead Source',
                value: _selectedLeadSource,
                itemList: leadSourcesList,
                onChanged: (value) => setState(() => _selectedLeadSource = value),
              ),
              // ResponsiveDropdown<String>(
              //   label: 'Lead Type',
              //   hint: 'Select Lead Type',
              //   value: _selectedLeadType,
              //   itemList: ['Fresh', 'Repeat'],
              //   onChanged: (value) =>
              //       setState(() => _selectedLeadType = value),
              // ),

              // /// Lead Status Dropdown
              ResponsiveDropdown<String>(
                label: 'Lead Status',
                hint: 'Select Lead Status',
                value: _selectedLeadStatus,
                itemList: leadStatusLIst,
                onChanged: (value) => setState(() => _selectedLeadStatus = value),
              ),

              CustomTextField(
                title: "Company Name",
                hintText: "Enter company name",
                controller: _companyNameController,
                prefixIcon: Icons.perm_device_info,
                validator: (value) => FormValidatorUtils.validateRequired(value, fieldName: "Company Name"),
              ),
              // const SizedBox(height: 8),
              CustomTextField(
                title: "Concern Person Name",
                hintText: "Enter Concern Person name",
                controller: _concernPersonNameController,
                prefixIcon: Icons.person,
                validator: (value) => FormValidatorUtils.validateRequired(value, fieldName: "Concern Person Name"),
              ),

              CustomTextField(
                title: "Contact Person Designation",
                hintText: "Enter designation",
                controller: _designationController,
              ),
              // const SizedBox(height: 8),
              CustomTextField(
                title: "Mobile Number",
                hintText: "Enter mobile number",
                controller: _mobileNumberController,
                prefixIcon: Icons.phone,
                validator: FormValidatorUtils.validatePhone,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(10),
                ],
              ),
              // const SizedBox(height: 8),
              CustomTextField(
                title: "Email",
                hintText: "Enter email",
                controller: _emailController,
                prefixIcon: Icons.email,
                validator: (value) => FormValidatorUtils.validateEmail(value),
              ),

              // const SizedBox(height: 8),
              CustomTextField(
                title: "Address",
                hintText: "Enter address",
                controller: _addressController,
                prefixIcon: Icons.location_on,
              ),
              // const SizedBox(height: 8),
              // CustomTextField(
              //   title: "Pin Code",
              //   hintText: "Enter pin code",
              //   controller: _pinCodeController,
              //   prefixIcon: Icons.pin,
              //   // validator: (value) => FormValidatorUtils.validatePinCode(value),
              //   inputFormatters: [
              //     FilteringTextInputFormatter.digitsOnly,
              //     LengthLimitingTextInputFormatter(6),
              //   ],
              // ),
              // const SizedBox(height: 8),
              CustomTextField(
                title: "Remark",
                hintText: "Enter remark",
                controller: _remarkController,
                isMultiLine: true,
                maxLines: 4,
              ),

              CustomTextField(
                title: "Project Detail",
                hintText: "Enter project details",
                controller: _projectDetailController,
              ),

              ResponsiveDropdown<String>(
                label: 'Client Rating',
                hint: 'Select Rating',
                value: _selectedClientRating,
                itemList: clientRatingList,
                onChanged: (value) => setState(() => _selectedClientRating = value),
              ),

              CustomTextField(
                title: "Expected Business Size",
                hintText: "Enter expected business size",
                controller: _expectedBusinessSizeController,
              ),

              ResponsiveDropdown<String>(
                label: 'Content Shared',
                hint: 'Select Option',
                value: _selectedContentShared,
                itemList: contentSharedList,
                onChanged: (value) => setState(() => _selectedContentShared = value),
              ),

              CustomTextField(
                title: "Profile Comment",
                hintText: "Enter profile comment",
                controller: _profileCommentController,
              ),

              ResponsiveDropdown<String>(
                label: 'Business Type',
                hint: 'Select Business Type',
                value: _selectedBusinessType,
                itemList: businessTypeList,
                onChanged: (value) => setState(() => _selectedBusinessType = value),
              ),

              ResponsiveDropdown<String>(
                label: 'Recce Status',
                hint: 'Select Status',
                value: _selectedRecceStatus,
                itemList: recceStatusList,
                onChanged: (value) => setState(() => _selectedRecceStatus = value),
              ),


              const SizedBox(height: 24),

              /// Submit Button or Loader
              provider.isLoading
                  ? LoadingIndicatorUtils()
                  : CustomButton(
                color: AppColors.primary,
                text: "Submit",
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    handleSubmit();
                    debugPrint("Form Submitted");
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
