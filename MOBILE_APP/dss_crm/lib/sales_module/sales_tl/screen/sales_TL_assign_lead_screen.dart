import 'package:dss_crm/sales_module/common/model/sales_person_list_model.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/controller/sales_hod_lead_controller.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/model/sales_hod_lead_list_model.dart'as leadModel;
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


class SalesTLAssignedLeadScreen extends StatefulWidget {
  final leadModel.Result leadData;
  final bool isReassign;

  const SalesTLAssignedLeadScreen({super.key, required this.leadData,this.isReassign = false});

  @override
  State<SalesTLAssignedLeadScreen> createState() => _SalesTLAssignedLeadScreenState();
}

class _SalesTLAssignedLeadScreenState extends State<SalesTLAssignedLeadScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _queryDateController = TextEditingController();
  final TextEditingController _senderNameController = TextEditingController();
  final TextEditingController _concernPersonNameController = TextEditingController();
  final TextEditingController _mobileNumberController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _companyNameController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _pinCodeController = TextEditingController();
  final TextEditingController _requirementController = TextEditingController();


  String? _selectedLeadSource;
  String? _selectedLeadStatus;
  String? _selectedCity;
  String? _selectedZone;
  String? _selectedSalesPersonName;
  String? _selectedSalesPersonId;

  final List<String> leadSourcesList = [
    'Website', 'Phone', 'Email', 'Justdial', 'Facebook', 'Instagram', 'Indiamart','Other'
  ];

  final List<String> leadStatusLIst = ['pending', 'inProgress', 'success'];
  final List<String> salePersonCityLIst = ['Lucknow', 'Azamgarh'];
  final List<String> salePersonZoneList = ["Lucknow",'Barabanki', 'Chinhat', 'Thakurganj'];

  @override
  void initState() {
    super.initState();

    final lead = widget.leadData;
    _selectedLeadSource = leadSourcesList.contains(lead.leadSource) ? lead.leadSource : null;
    _selectedLeadStatus = leadStatusLIst.contains(lead.status) ? lead.status : null;
    _selectedCity = salePersonCityLIst.contains(lead.city) ? lead.city : null;
    _senderNameController.text = lead.senderName ?? '';
    _concernPersonNameController.text = lead.concernPersonName ?? '';
    _mobileNumberController.text = lead.phone ?? '';
    _emailController.text = lead.email ?? '';
    _companyNameController.text = lead.company ?? '';
    _addressController.text = lead.address ?? '';
    _pinCodeController.text = lead.pincode ?? '';
    _requirementController.text = lead.requirement ?? '';

    // Fetch sales person list
    // Future.microtask(() {
    //   context.read<SalesHODLeadApiProvider>().getAllSalesPersonList(context);
    // });
  }

  void handleSubmit() async{
    if (_selectedSalesPersonId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select a Sales Person")),
      );
      return;
    }
    final salesTLlgoinId = await StorageHelper().getLoginUserId();

    print("Selected Sales Person ID = $_selectedSalesPersonId");

    print("salesTLID = ${salesTLlgoinId}");
    final leadProvider = context.read<SalesHODLeadApiProvider>();
    // Conditional key names
    final leadAssignmentKeys = widget.isReassign
        ? {
      "salesTLId": salesTLlgoinId,
      "saleEmployeeId2": _selectedSalesPersonId,
    }
        : {
      "salesTLId": salesTLlgoinId,
      "saleEmployeeId": _selectedSalesPersonId,
    };

    final addLeadBody = {
      // "salesTLId": salesTLlgoinId,
      // "saleEmployeeId": _selectedSalesPersonId,
      ...leadAssignmentKeys,
      "leadSource": _selectedLeadSource,
      // "leadType": _selectedLeadType,
      // "senderName": _senderNameController.text.trim(),
      "concernPersonName": _concernPersonNameController.text.trim(),
      "email":  _emailController.text.trim(),
      "phone":  _mobileNumberController.text.trim(),
      "address": _addressController.text.trim(),
      "pinCode": _pinCodeController.text.trim(),
      "requirement": _requirementController.text.trim(),
    };
    leadProvider.leadAssignToSalesEmp(
      context,
      addLeadBody,
      widget.leadData.sId,
      widget.isReassign

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
        activityName: "Assign Lead",
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

              /// Lead Status Dropdown
              // ResponsiveDropdown<String>(
              //   label: 'Lead Status',
              //   hint: 'Select Lead Status',
              //   value: _selectedLeadStatus,
              //   itemList: leadStatusLIst,
              //   onChanged: (value) => setState(() => _selectedLeadStatus = value),
              // ),

              // CustomTextField(
              //   title: "Sender Name",
              //   hintText: "Enter sender name",
              //   controller: _senderNameController,
              //   prefixIcon: Icons.person,
              //   validator: (value) => FormValidatorUtils.validateRequired(value, fieldName: "Sender Name"),
              // ),
              // const SizedBox(height: 8),
              CustomTextField(
                title: "Concern Person Name",
                hintText: "Enter Customer name",
                controller: _concernPersonNameController,
                prefixIcon: Icons.person,
                validator: (value) => FormValidatorUtils.validateRequired(value, fieldName: "Sender Name"),
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
              CustomTextField(
                title: "Pin Code",
                hintText: "Enter pin code",
                controller: _pinCodeController,
                prefixIcon: Icons.pin,
                // validator: (value) => FormValidatorUtils.validatePinCode(value),
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(6),
                ],
              ),
              // const SizedBox(height: 8),
              CustomTextField(
                title: "Requirement",
                hintText: "Enter requirement",
                controller: _requirementController,
                isMultiLine: true,
                maxLines: 4,
              ),

              /// City Dropdown
              /// City Dropdown
              ResponsiveDropdown<String>(
                label: 'City',
                hint: 'Select City',
                value: _selectedCity,
                itemList: salePersonCityLIst,
                onChanged: (value) {
                  setState(() {
                    _selectedCity = value;
                    _selectedZone = null;
                    _selectedSalesPersonName = null;
                    _selectedSalesPersonId = null;
                  });

                  if (value != null && _selectedZone != null) {
                    context.read<SalesHODLeadApiProvider>().getAllSalesPersonList(
                      context,
                      value,
                      _selectedZone!,
                    );
                  }
                },
              ),

              /// Zone Dropdown
              if (_selectedCity != null)
                ResponsiveDropdown<String>(
                  label: 'Zone',
                  hint: 'Select Zone',
                  value: _selectedZone,
                  itemList: salePersonZoneList,
                  onChanged: (value) {
                    setState(() {
                      _selectedZone = value;
                      _selectedSalesPersonName = null;
                      _selectedSalesPersonId = null;
                    });

                    if (_selectedCity != null && value != null) {
                      context.read<SalesHODLeadApiProvider>().getAllSalesPersonList(
                        context,
                        _selectedCity!,
                        value,
                      );
                    }
                  },
                ),

              /// Sales Person Dropdown (Only show if both selected)
              if (_selectedCity != null && _selectedZone != null)
                ResponsiveDropdown<String>(
                  label: 'Assign To Sales Person',
                  hint: 'Select Sales Person',
                  value: _selectedSalesPersonName,
                  itemList: salesPersonNames,
                  onChanged: (value) {
                    final selectedPerson = salesPersonList.firstWhere(
                          (e) => e.name == value,
                      orElse: () => Result(),
                    );

                    setState(() {
                      _selectedSalesPersonName = value;
                      _selectedSalesPersonId = selectedPerson.sId;
                    });
                  },
                ),


              /// Sales Person Dropdown
              // ResponsiveDropdown<String>(
              //   label: 'Assign To Sales Person',
              //   hint: 'Select Sales Person',
              //   value: _selectedSalesPersonName,
              //   itemList: salesPersonNames,
              //   onChanged: (value) {
              //     final selectedPerson = salesPersonList.firstWhere(
              //           (e) => e.name == value,
              //       orElse: () => Result(),
              //     );
              //
              //     setState(() {
              //       _selectedSalesPersonName = value;
              //       _selectedSalesPersonId = selectedPerson.sId;
              //     });
              //   },
              // ),

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
