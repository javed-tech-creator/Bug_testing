import 'package:dss_crm/tech_module/tech_manager/controller/tech_manager_api_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart' show Consumer;

import '../../../sales_module/sales_tl/sales_tl_report/controller/sales_tl_reporting_controller.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/form_validations_utils.dart';
import '../../../utils/responsive_dropdown_utils.dart';

class TechMangerAddAssetScreen extends StatefulWidget {
  const TechMangerAddAssetScreen({Key? key}) : super(key: key);

  @override
  State<TechMangerAddAssetScreen> createState() => _TechMangerAddAssetScreenState();
}

class _TechMangerAddAssetScreenState extends State<TechMangerAddAssetScreen> {

  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController assetTagController = TextEditingController();
  final TextEditingController brandController = TextEditingController();
  final TextEditingController modelSerialController = TextEditingController();
  final TextEditingController vendorSupplierController = TextEditingController();
  final TextEditingController purchaseDateController = TextEditingController();
  final TextEditingController warrantyEndDateController = TextEditingController();
  final TextEditingController contractNoController = TextEditingController();
  final TextEditingController validityController = TextEditingController();

  // Date objects to hold the selected dates for API formatting
  DateTime? _purchaseDate;
  DateTime? _warrantyEndDate;
  DateTime? _validityDate;

  // Dropdown values
  String? selectedAssetType;
  String? selectedLocation;
  String? selectedStatus;
  String? selectedAMCContract;

  // Dropdown options
  final List<String> assetTypes = [
    'Laptop',
    'Server',
    'LED Display Controller',
    'Printer',
    'Camera',
    'Router',
    'Other'
  ];

  final List<String> locations = [
    'Head Office',
    'Manufacturing Hub',
    'Client Site',
  ];

  final List<String> statusOptions = [
    'In Use',
    'Repair',
    'Spare',
    'Scrap'
  ];

  final List<String> amcOptions = ['Yes', 'No'];

  @override
  void dispose() {
    assetTagController.dispose();
    brandController.dispose();
    modelSerialController.dispose();
    vendorSupplierController.dispose();
    purchaseDateController.dispose();
    warrantyEndDateController.dispose();
    contractNoController.dispose();
    validityController.dispose();
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
        activityName: "Add Asset",
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
                  'Fill in the details to add a new asset to the system',
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
                      controller: assetTagController,
                      // focusNode: _accountHolderNameFocusNode,
                      prefixIcon: Icons.person_pin,
                      hintText: "Enter unique asset tag",
                      title: "Asset Tag",
                      keyboardType: TextInputType.text,
                      validator: (val) =>FormValidatorUtils.validateRequired(  val, fieldName: 'Account Holder Name', ),
                    ),
                    ResponsiveDropdown<String>(
                      value: selectedAssetType,
                      itemList: assetTypes,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedAssetType = newValue;
                        });
                      },
                      hint: 'Select Asset Type',
                      label: 'Asset Type *',
                    ),
                    CustomTextField(
                      title: "Brand",
                      hintText: "Enter brand name",
                      controller: brandController,
                      prefixIcon: Icons.business,
                      validator: FormValidatorUtils.validateRequired,
                    ),
                  ],
                ),

                // SizedBox(height: isTablet ? 20 : 16),

                // Second Row
                _buildResponsiveRow(
                  isTablet: isTablet,
                  isDesktop: isDesktop,
                  children: [
                    CustomTextField(
                      title: "Model/Serial Number",
                      hintText: "Enter model name or serial number",
                      controller: modelSerialController,
                      prefixIcon: Icons.confirmation_number,
                      validator: FormValidatorUtils.validateRequired,
                    ),
                    ResponsiveDropdown<String>(
                      value: selectedLocation,
                      itemList: locations,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedLocation = newValue;
                        });
                      },
                      hint: 'Select Location',
                      label: 'Location *',
                    ),
                    ResponsiveDropdown<String>(
                      value: selectedStatus,
                      itemList: statusOptions,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedStatus = newValue;
                        });
                      },
                      hint: 'Select Status',
                      label: 'Status *',
                    ),
                  ],
                ),


                // Third Row
                _buildResponsiveRow(
                  isTablet: isTablet,
                  isDesktop: isDesktop,
                  children: [
                    CustomTextField(
                      title: "Vendor/Supplier Name",
                      hintText: "Enter vendor or supplier name",
                      controller: vendorSupplierController,
                      prefixIcon: Icons.person,
                      validator: FormValidatorUtils.validateRequired,
                    ),
                    CustomTextField(
                      title: "Purchase Date",
                      hintText: "Select Date",
                      controller: purchaseDateController,
                      prefixIcon: Icons.calendar_month,
                      validator: FormValidatorUtils.validateRequired,
                      onTap: () => _selectDate(context, purchaseDateController, (date) => _purchaseDate = date),
                      readOnly: true,
                    ),
                    CustomTextField(
                      title: "Warranty End Date",
                      hintText: "Select Date",
                      controller: warrantyEndDateController,
                      prefixIcon: Icons.shield_moon_outlined,
                      validator: FormValidatorUtils.validateRequired,
                      onTap: () => _selectDate(context, warrantyEndDateController, (date) => _warrantyEndDate = date),
                      readOnly: true,
                    ),
                  ],
                ),

                // Fourth Row - AMC Contract
                _buildResponsiveRow(
                  isTablet: isTablet,
                  isDesktop: isDesktop,
                  children: [
                    ResponsiveDropdown<String>(
                      value: selectedAMCContract,
                      itemList: amcOptions,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedAMCContract = newValue;
                          if (newValue != 'Yes') {
                            contractNoController.clear();
                            validityController.clear();
                          }
                        });
                      },
                      hint: 'Select AMC Contract',
                      label: 'AMC Contract *',
                    ),
                    // Conditionally show Contract No.
                    if (selectedAMCContract == 'Yes')
                      CustomTextField(
                        title: "Contract No.",
                        hintText: "Enter contract number",
                        controller: contractNoController,
                        prefixIcon: Icons.description,
                        validator: FormValidatorUtils.validateRequired,
                      )
                    else
                      const SizedBox.shrink(),
                    // Conditionally show Validity
                    if (selectedAMCContract == 'Yes')
                      CustomTextField(
                        title: "Validity",
                        hintText: "Select Date",
                        controller: validityController,
                        prefixIcon: Icons.check_circle,
                        validator: FormValidatorUtils.validateRequired,
                        onTap: () => _selectDate(context, validityController,(date) => _validityDate = date),
                        readOnly: true,
                      )
                    else
                      const SizedBox.shrink(),
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
                      text: addAssetProvider.isLoading ? 'Adding...' : "Add Asset",
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
    // Validate form
    print('Asset Tag: ${assetTagController.text}');
    print('Asset Type: $selectedAssetType');
    print('Brand: ${brandController.text}');
    print('Model/Serial: ${modelSerialController.text}');
    print('Location: $selectedLocation');
    print('Status: $selectedStatus');
    print('Vendor/Supplier: ${vendorSupplierController.text}');
    print('Purchase Date: ${purchaseDateController.text}');
    print('Warranty End Date: ${warrantyEndDateController.text}');
    print('AMC Contract: $selectedAMCContract');
    if (selectedAMCContract == 'Yes') {
      print('Contract No: ${contractNoController.text}');
      print('Validity: ${validityController.text}');
    }

    if (_formKey.currentState?.validate() ?? false) {
      final body = {
        "tag": assetTagController.text,
        "type": selectedAssetType!,
        "brand": brandController.text,
        "model": modelSerialController.text,
        "location": selectedLocation!,
        "status": selectedStatus,
        "vendor_name": vendorSupplierController.text,
        "purchase_date": _purchaseDate!.toIso8601String().split('T')[0], // YYYY-MM-DD format
        "warranty_end": _warrantyEndDate!.toIso8601String().split('T')[0], // YYYY-MM-DD format
        "amc_contract": selectedAMCContract!,
      };

      if (selectedAMCContract == 'Yes') {
        body["contract_no"] = contractNoController.text;
        body["validity"] = _validityDate!.toIso8601String().split('T')[0]; // YYYY-MM-DD format
      }

      provider.addTechAssets(context, body);
    }

  }
}

