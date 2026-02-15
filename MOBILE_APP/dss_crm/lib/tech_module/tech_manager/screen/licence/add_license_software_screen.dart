import 'package:dss_crm/tech_module/tech_manager/controller/tech_manager_api_provider.dart';
import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_licence_list_model.dart';
// import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_assets_list_model.dart';
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

class TechMangerAddLicenseSoftwareScreen extends StatefulWidget {
  // final Data productData; // existing product data
  //
  // const AddLicenseSoftwareScreen({Key? key, required this.productData})
  //     : super(key: key);

  @override
  State<TechMangerAddLicenseSoftwareScreen> createState() => _TechMangerAddLicenseSoftwareScreenState();
}

class _TechMangerAddLicenseSoftwareScreenState extends State<TechMangerAddLicenseSoftwareScreen> {

  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController licensceIdController = TextEditingController();
  final TextEditingController licenseSoftwareNameController = TextEditingController();
  final TextEditingController seatController = TextEditingController();
  final TextEditingController vendorDetailsController = TextEditingController();
  final TextEditingController validityStartDateController = TextEditingController();
  final TextEditingController validityEndDateController = TextEditingController();

  // Date objects to hold the selected dates for API formatting
  DateTime? _validityStartDate;
  DateTime? _validityEndDate;
  DateTime? _validityDate;

  // Dropdown values
  String? selectedVersionType;
  String? selectedRenewalExpiry;
  String? selectedStatus;
  String? selectedAMCContract;
  String? assetId="";


  // Dropdown options
  final List<String> versionTypes = [
    'Single License',
    'Volume License',
    'Cloud'
  ];

  final List<String> renewalAlertsList = [
    '15 days before expiry',
    '30 days before expiry',
    '45 days before expiry',
    '60 days before expiry',
  ];

  @override
  void initState() {
    super.initState();
    // _initializeFormFields();
  }
  // void _initializeFormFields() {
  //   final asset = widget.productData;
  //
  //   // Initialize Text Controllers
  //   assetId = asset.sId ?? '';
  //   licensceIdController.text = asset.licenseId ?? '';
  //   licenseSoftwareNameController.text = asset.softwareName ?? '';
  //   seatController.text = asset.seats.toString() ?? '';
  //   vendorDetailsController.text = asset.vendorDetails ?? '';
  //   // Initialize Dropdowns
  //   selectedVersionType = asset.versionType;
  //   selectedRenewalExpiry = asset.renewalAlert;
  //   if (asset.validityStart != null) {
  //     _validityStartDate = DateTime.parse(asset.validityStart!);
  //     validityStartDateController.text = DateFormat('dd-MM-yyyy').format(_validityStartDate!);
  //   }
  //   if (asset.validityEnd != null) {
  //     _validityEndDate = DateTime.parse(asset.validityEnd!);
  //     validityEndDateController.text = DateFormat('dd-MM-yyyy').format(_validityEndDate!);
  //   }
  //
  // }


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
        "licenseId": licensceIdController.text,
        "softwareName": licenseSoftwareNameController.text,
        "versionType": selectedVersionType!,
        "validityStart": _validityStartDate!.toIso8601String().split('T')[0], // YYYY-MM-DD format
        "validityEnd": _validityEndDate!.toIso8601String().split('T')[0], // YYYY-MM-DD format
        "seats": seatController.text,
        "renewalAlert": selectedRenewalExpiry!,
        "vendorDetails": vendorDetailsController.text,
      };

      provider.addTechLicenceSoftware(context, body);
    }

  }


  @override
  void dispose() {
    licensceIdController.dispose();
    licenseSoftwareNameController.dispose();
    seatController.dispose();
    vendorDetailsController.dispose();
    validityStartDateController.dispose();
    validityEndDateController.dispose();
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
        activityName: "Add Licence",
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
                  'Licence Information',
                  style: TextStyle(
                    fontSize: isTablet ? 24 : 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[800],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Fill in the details to add a new licence to the system',
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
                    // CustomTextField(
                    //   title: "Asset Tag",
                    //   hintText: "Enter unique asset tag",
                    //   controller: assetTagController,
                    //   prefixIcon: Icons.tag,
                    //   validator: FormValidatorUtils.validateRequired,
                    // ),
                    CustomTextField(
                      controller: licensceIdController,
                      // focusNode: _accountHolderNameFocusNode,
                      prefixIcon: Icons.person_pin,
                      hintText: "License Id",
                      title: "License Id",
                      keyboardType: TextInputType.text,
                    ),
                    CustomTextField(
                      title: "Name",
                      hintText: "Name",
                      controller: licenseSoftwareNameController,
                      prefixIcon: Icons.business,
                      validator: FormValidatorUtils.validateRequired,
                    ),
                    ResponsiveDropdown<String>(
                      value: selectedVersionType,
                      itemList: versionTypes,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedVersionType = newValue;
                        });
                      },
                      hint: 'Select Asset Type',
                      label: 'Asset Type *',
                    ),
                    CustomTextField(
                      title: "Validity Start Date",
                      hintText: "Select Date",
                      controller: validityStartDateController,
                      prefixIcon: Icons.calendar_month,
                      validator: FormValidatorUtils.validateRequired,
                      onTap: () => _selectDate(context, validityStartDateController, (date) => _validityStartDate = date),
                      readOnly: true,
                    ),
                    CustomTextField(
                      title: "Validity End Date",
                      hintText: "Select Date",
                      controller: validityEndDateController,
                      prefixIcon: Icons.shield_moon_outlined,
                      validator: FormValidatorUtils.validateRequired,
                      onTap: () => _selectDate(context, validityEndDateController, (date) => _validityEndDate = date),
                      readOnly: true,
                    ),
                    CustomTextField(
                      title: "Seats",
                      hintText: "Enter seats",
                      controller: seatController,
                      prefixIcon: Icons.confirmation_number,
                      validator: FormValidatorUtils.validateRequired,
                    ),
                    ResponsiveDropdown<String>(
                      value: selectedRenewalExpiry,
                      itemList: renewalAlertsList,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedRenewalExpiry = newValue;
                        });
                      },
                      hint: 'Select Renewal Alerts',
                      label: 'Renewal Alerts *',
                    ),
                  ],
                ),

                _buildResponsiveRow(
                  isTablet: isTablet,
                  isDesktop: isDesktop,
                  children: [
                    CustomTextField(
                      title: "Vendor Details",
                      hintText: "Enter Details",
                      controller: vendorDetailsController,
                      prefixIcon: Icons.person,
                      validator: FormValidatorUtils.validateRequired,
                    ),

                  ],
                ),

                SizedBox(height: isTablet ? 32 : 24),

                // CustomButton(
                //   color: Colors.black,
                //   text: "Add Asset",
                //   onPressed: () {
                //     _submitForm();
                //   },
                // ),
                Consumer<TechManagerApiProvider>(
                  builder: (context, addAssetProvider, child) {
                    return CustomButton(
                      color: Colors.black,
                      text: addAssetProvider.isLoading ? 'Adding...' : "Add Licence",
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

