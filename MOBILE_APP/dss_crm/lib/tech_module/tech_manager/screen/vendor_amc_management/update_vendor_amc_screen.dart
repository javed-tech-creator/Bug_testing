import 'package:dss_crm/tech_module/tech_manager/controller/tech_manager_api_provider.dart';
import 'package:dss_crm/tech_module/tech_manager/model/vendor_amc_management/tech_vendor_amc_list_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart' show Consumer;

import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/form_validations_utils.dart';
import '../../../../utils/responsive_dropdown_utils.dart';

class UpdateAMCScreen extends StatefulWidget {
  final Data productData; // existing product data
  final VoidCallback? onDeviceUpdated; // Add this callback


  const UpdateAMCScreen({
    Key? key,
    required this.productData,
    this.onDeviceUpdated, // Add this parameter
  }) : super(key: key);


  @override
  State<UpdateAMCScreen> createState() => _UpdateAMCScreenState();
}

class _UpdateAMCScreenState extends State<UpdateAMCScreen> {

  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController vendorIdController = TextEditingController(text: "VND-");
  final TextEditingController companyNameController = TextEditingController();
  final TextEditingController contactPersonController = TextEditingController();
  final TextEditingController contactPhoneController = TextEditingController();
  final TextEditingController contactEmailController = TextEditingController();
  final TextEditingController renewalTermsCostDetailsController = TextEditingController();
  final TextEditingController slaDetailsController = TextEditingController();
  final TextEditingController previousServiceLogsController = TextEditingController();
  final TextEditingController contractStartDateController = TextEditingController();
  final TextEditingController contractEndDateController = TextEditingController();

  DateTime? _contractStartDate;
  DateTime? _contractEndDate;
  String? selectedServiceProvidedType;
  String? amcVendorId="";


  // Dropdown options
  final List<String> deviceTypesList = [
    'AMC',
    'Network',
    'Server',
    'Cloud'
  ];

  @override
  void initState() {
    super.initState();
    _initializeFormFields();
  }


  void _initializeFormFields() {
    final asset = widget.productData;
    // Initialize Text Controllers
    amcVendorId = asset.sId ?? '';
    vendorIdController.text = asset.vendorId ?? '';
    companyNameController.text = asset.companyName ?? '';
    contactPersonController.text = asset.contactName.toString() ?? '';
    contactPhoneController.text = asset.contactPhone.toString() ?? '';
    contactEmailController.text = asset.contactEmail.toString() ?? '';
    renewalTermsCostDetailsController.text = asset.renewalTerms.toString() ?? '';
    slaDetailsController.text = asset.slaCommitments.toString() ?? '';
    previousServiceLogsController.text = asset.serviceLogs.toString() ?? '';
    selectedServiceProvidedType = asset.services;
    if (asset.contractStart != null) {
      _contractStartDate = DateTime.parse(asset.contractStart!);
      contractStartDateController.text = DateFormat('dd-MM-yyyy').format(_contractStartDate!);
    }
      if (asset.contractEnd != null) {
        _contractEndDate = DateTime.parse(asset.contractEnd!);
        contractEndDateController.text = DateFormat('dd-MM-yyyy').format(_contractEndDate!);
    }

  }



  Future<void> _selectDate(
      BuildContext context, TextEditingController controller, Function(DateTime) onDateSelected) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null) {
      setState(() {
        controller.text =
        "${picked.day.toString().padLeft(2, '0')}-${picked.month.toString().padLeft(2, '0')}-${picked.year}";
        onDateSelected(picked);
      });
    }
  }

  void _submitForm(TechManagerApiProvider provider) {
    if (_formKey.currentState?.validate() ?? false) {
      final body = {
        "vendorId": vendorIdController.text,
        "companyName": companyNameController.text,
        "services": selectedServiceProvidedType,
        "contactName": contactPersonController.text,
        "contactPhone": contactPhoneController.text,
        "contactEmail": contactEmailController.text,
        "contractStart": _contractStartDate!.toIso8601String().split('T')[0], // YYYY-MM-DD format
        "contractEnd": _contractEndDate!.toIso8601String().split('T')[0], // YYYY-MM-DD format
        "renewalTerms": renewalTermsCostDetailsController.text,
        "slaCommitments": slaDetailsController.text,
        "serviceLogs": previousServiceLogsController.text,
      };

      // provider.updateTechDevice(context, body,assetId.toString());
      provider.updateTechVendorAMC(context, body, amcVendorId.toString()).then((_) {
        // Call the callback if provided and update was successful
        if (provider.updateTechVendorAMCModelResponse?.success == true) {
          widget.onDeviceUpdated?.call();
        }
      });
    }

  }

  @override
  void dispose() {

    vendorIdController.dispose();
    companyNameController.dispose();
    contactPersonController.dispose();
    contactPhoneController.dispose();
    contactEmailController.dispose();
    renewalTermsCostDetailsController.dispose();
    slaDetailsController.dispose();
    previousServiceLogsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth >= 600;
    final isDesktop = screenWidth >= 1024;

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: DefaultCommonAppBar(
        activityName: "Update Vendor AMC",
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(isTablet ? 24.0 : 0.0),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                spreadRadius: 2,
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          padding: EdgeInsets.all(isTablet ? 32.0 : 20.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Asset Information',
                  style: TextStyle(
                    fontSize: isTablet ? 24 : 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[800],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Fill in the details to add a new device to the system',
                  style: TextStyle(
                    fontSize: isTablet ? 16 : 14,
                    color: Colors.grey[600],
                  ),
                ),
                SizedBox(height: isTablet ? 32 : 24),

                // First Row
                _buildResponsiveRow(
                  isTablet: isTablet,
                  isDesktop: isDesktop,
                  children: [
                    CustomTextField(
                      controller: vendorIdController,
                      // focusNode: _accountHolderNameFocusNode,
                      prefixIcon: Icons.person_pin,
                      hintText: "VND-123..",
                      title: "Vendor Id",
                      keyboardType: TextInputType.text,
                    ),

                    CustomTextField(
                      title: "Company Name",
                      hintText: "Company Name",
                      controller: companyNameController,
                      prefixIcon: Icons.business,
                      validator: FormValidatorUtils.validateRequired,
                    ),
                    ResponsiveDropdown<String>(
                      value: selectedServiceProvidedType,
                      itemList: deviceTypesList,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedServiceProvidedType = newValue;
                        });
                      },
                      hint: 'Service Provided',
                      label: 'Service Provided',
                    ),


                    CustomTextField(
                      title: "Contact Name",
                      hintText: "Contact Name",
                      controller: contactPersonController,
                      prefixIcon: Icons.supervised_user_circle,
                      validator: FormValidatorUtils.validateRequired,
                    ),
                    CustomTextField(
                      title: "Contact Phone",
                      hintText: "Contact Phone",
                      controller: contactPhoneController,
                      prefixIcon: Icons.phone_android,
                      maxLength: 10,
                      validator: FormValidatorUtils.validateRequired,
                    ),
                    CustomTextField(
                      title: "Contact Email",
                      hintText: "Contact Email",
                      controller: contactEmailController,
                      prefixIcon: Icons.email_outlined,
                      validator: FormValidatorUtils.validateRequired,
                    ),
                    CustomTextField(
                      title: "Contract Start Date",
                      hintText: "Select Date",
                      controller: contractStartDateController,
                      prefixIcon: Icons.calendar_month_outlined,
                      validator: FormValidatorUtils.validateRequired,
                      onTap: () => _selectDate(context, contractStartDateController, (date) => _contractStartDate = date),
                      readOnly: true,
                    ),
                    CustomTextField(
                      title: "Contract End Date",
                      hintText: "Select Date",
                      controller: contractEndDateController,
                      prefixIcon: Icons.calendar_month_outlined,
                      validator: FormValidatorUtils.validateRequired,
                      onTap: () => _selectDate(context, contractEndDateController, (date) => _contractEndDate = date),
                      readOnly: true,
                    ),
                    CustomTextField(
                      title: "Renewal Terms & Cost",
                      hintText: "Enter Renewal Terms & Cost",
                      maxLines: 4,
                      controller: renewalTermsCostDetailsController,
                      validator: FormValidatorUtils.validateRequired,
                    ),

                    CustomTextField(
                      title: "SLA Commitments",
                      hintText: "Enter SLA Commitments",
                      maxLines: 4,
                      controller: slaDetailsController,
                      validator: FormValidatorUtils.validateRequired,
                    ),

                    CustomTextField(
                      title: "Previous Service Logs",
                      hintText: "Previous Service Logs",
                      maxLines: 4,
                      controller: previousServiceLogsController,
                      validator: FormValidatorUtils.validateRequired,
                    ),


                  ],
                ),

                Consumer<TechManagerApiProvider>(
                  builder: (context, addAssetProvider, child) {
                    return CustomButton(
                      color: Colors.black,
                      text: addAssetProvider.isLoading ? 'Updating...' : "Update",
                      onPressed: addAssetProvider.isLoading
                          ? null
                          : () {
                        // if (validateFields()) {
                        _submitForm(addAssetProvider);

                      },
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildResponsiveRow({
    required bool isTablet,
    required bool isDesktop,
    required List<Widget> children,
  }) {
    if (isDesktop) {
      // Desktop: 3 columns
      return Row(
        children: children
            .map((child) => Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: child,
          ),
        ))
            .toList(),
      );
    } else if (isTablet) {
      // Tablet: 2 columns
      return Column(
        children: [
          Row(
            children: children
                .take(2)
                .map((child) => Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: child,
              ),
            ))
                .toList(),
          ),
          if (children.length > 2) ...[
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: children[2],
                  ),
                ),
                const Expanded(child: SizedBox()),
              ],
            ),
          ],
        ],
      );
    } else {
      // Mobile: 1 column
      return Column(
        children: children
            .map((child) => Padding(
          padding: const EdgeInsets.only(bottom: 0.0),
          child: child,
        ))
            .toList(),
      );
    }
  }

}

