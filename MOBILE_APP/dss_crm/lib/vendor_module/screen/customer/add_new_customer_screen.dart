import 'dart:io';

import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/vendor_module/controller/vendor_api_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../ui_helper/app_colors.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/form_validations_utils.dart';

class AddNewCustomerlScreen extends StatefulWidget {
  const AddNewCustomerlScreen({Key? key}) : super(key: key);

  @override
  State<AddNewCustomerlScreen> createState() => _AddNewCustomerlScreenState();
}

class _AddNewCustomerlScreenState extends State<AddNewCustomerlScreen> {
  final TextEditingController customerNameController = TextEditingController();
  final TextEditingController customerPhoneController = TextEditingController();
  final TextEditingController customerEmailController = TextEditingController();
  final TextEditingController companyGSTNumberController =
      TextEditingController();
  final TextEditingController comapanyNameController = TextEditingController();
  final TextEditingController address1Controller = TextEditingController();
  final TextEditingController address2Controller = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController pincodeController = TextEditingController();
  final TextEditingController stateController = TextEditingController();
  final TextEditingController countryController = TextEditingController(text: "India");

  // final FocusNode _bankNameFocusNode = FocusNode();
  // final FocusNode _accountNumberFocusNode = FocusNode();
  // final FocusNode _branchFocusNode = FocusNode();
  // final FocusNode _ifscCodeFocusNode = FocusNode();
  // final FocusNode _bankCodeFocusNode = FocusNode();
  // final FocusNode _bankAddressFocusNode = FocusNode();
  // final FocusNode _countryFocusNode = FocusNode();
  final _formKey = GlobalKey<FormState>();

  // handle the login api here
  Future<void> handleSubmit() async {
    final addNewCustomerProvider = context.read<VendorModuleApiProvider>();
    if (customerPhoneController.text.isEmpty ||
        customerEmailController.text.isEmpty) {
      print("🔴 Validation Failed: Fields are empty");
      return;
    }


    Map<String, dynamic> requestBodyAddEmployee = {
    "fullName": customerNameController.text.trim(),
    "email": customerEmailController.text.trim(),
    "phone": customerPhoneController.text.trim(),
    "gstin": companyGSTNumberController.text.trim(),
    "companyName": comapanyNameController.text.trim(),
      "addressLine1": address1Controller.text.trim(),
      "addressLine2": address2Controller.text.trim(),
      "city": cityController.text.trim(),
      "pincode": pincodeController.text.trim(),
      "state": stateController.text.trim(),
      "country": countryController.text.trim(),
    };
    addNewCustomerProvider.addVendorCustomer(context, requestBodyAddEmployee);
  }

  @override
  void initState() {
    super.initState();

    // List<FocusNode> focusNodes = [
    //   _bankNameFocusNode,
    //   _accountNumberFocusNode,
    //   _branchFocusNode,
    //   _ifscCodeFocusNode,
    //   _bankCodeFocusNode,
    //   _countryFocusNode,
    //   _bankAddressFocusNode,
    // ];
    //
    // for (var node in focusNodes) {
    //   node.addListener(() => setState(() {}));
    // }
  }

  @override
  void dispose() {
    customerNameController.dispose();
    customerPhoneController.dispose();
    customerEmailController.dispose();
    companyGSTNumberController.dispose();
    comapanyNameController.dispose();
    countryController.dispose();
    address1Controller.dispose();
    // _bankNameFocusNode.dispose();
    // _accountNumberFocusNode.dispose();
    // _branchFocusNode.dispose();
    // _ifscCodeFocusNode.dispose();
    // _bankCodeFocusNode.dispose();
    // _countryFocusNode.dispose();
    // _bankAddressFocusNode.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.endingGreyColor,
      appBar: DefaultCommonAppBar(
        activityName: "Add Customer",
        backgroundColor: AppColors.primary,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 0.0, vertical: 20.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  color: AppColors.whiteColor,
                  child: Padding(
                    padding: ResponsiveHelper.paddingSymmetric(
                      context,
                      horizontal: 16,
                      vertical: 10.0,
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.person,
                              color: AppColors.primary,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              "Basic Information",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 10),
                        CustomTextField(
                          controller: customerNameController,
                          // focusNode: _bankNameFocusNode,
                          prefixIcon: Icons.person_pin,
                          hintText: "Customer Name",
                          title: "Customer Name",
                          keyboardType: TextInputType.text,
                        ),
                        CustomTextField(
                          controller: customerPhoneController,
                          // focusNode: _accountNumberFocusNode,
                          prefixIcon: Icons.phone_android,
                          hintText: "Phone Number",
                          title: "Phone Number",
                          maxLength: 10,
                          keyboardType: TextInputType.phone,
                        ),
                        CustomTextField(
                          controller: customerEmailController,
                          // focusNode: _branchFocusNode,
                          prefixIcon: Icons.email,
                          hintText: "Email",
                          title: "Email",
                          keyboardType: TextInputType.emailAddress,
                          validator: FormValidatorUtils.validateEmail,
                        ),
                      ],
                    ),
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 10),
                Container(
                  color: AppColors.whiteColor,
                  child: Padding(
                    padding: ResponsiveHelper.paddingSymmetric(
                      context,
                      horizontal: 16,
                      vertical: 10.0,
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.person,
                              color: AppColors.primary,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              "Company Information",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 10),
                        CustomTextField(
                          controller: comapanyNameController,
                          prefixIcon: Icons.person,
                          hintText: "Company Name",
                          title: "Company Name",
                          keyboardType: TextInputType.text,
                        ),
                        CustomTextField(
                          controller: companyGSTNumberController,
                          prefixIcon: Icons.compare,
                          hintText: "GST Number",
                          title: "GST Number",
                          keyboardType: TextInputType.text,
                        ),
                      ],
                    ),
                  ),
                ),

                ResponsiveHelper.sizedBoxHeight(context, 10),
                Container(
                  color: AppColors.whiteColor,
                  child: Padding(
                    padding: ResponsiveHelper.paddingSymmetric(
                      context,
                      horizontal: 16,
                      vertical: 10.0,
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.person,
                              color: AppColors.primary,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              "Billing Information",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 10),

                        CustomTextField(
                          controller: address1Controller,
                          // focusNode: _bankAddressFocusNode,
                          prefixIcon: Icons.location_on_sharp,
                          hintText: "Address 1",
                          title: "Address 1",
                        ),
                        CustomTextField(
                          controller: address2Controller,
                          // focusNode: _bankAddressFocusNode,
                          prefixIcon: Icons.location_on_sharp,
                          hintText: "Address 2",
                          title: "Address 2",
                        ),
                        CustomTextField(
                          controller: cityController,
                          // focusNode: _countryFocusNode,
                          prefixIcon: Icons.location_city,
                          hintText: "City",
                          title: "City",
                          keyboardType: TextInputType.text,
                        ),
                        CustomTextField(
                          controller: pincodeController,
                          // focusNode: _countryFocusNode,
                          prefixIcon: Icons.pin_drop,
                          hintText: "Pin Code",
                          title: "Pin Code",
                          keyboardType: TextInputType.number,
                        ),
                        CustomTextField(
                          controller: stateController,
                          // focusNode: _countryFocusNode,
                          prefixIcon: Icons.location_pin,
                          hintText: "State",
                          title: "State",
                          keyboardType: TextInputType.text,
                        ),
                        CustomTextField(
                          controller: countryController,
                          // focusNode: _countryFocusNode,
                          prefixIcon: Icons.location_pin,
                          hintText: "Country",
                          title: "Country",
                          readOnly: true,
                          keyboardType: TextInputType.text,
                        ),
                      ],
                    ),
                  ),
                ),

                ResponsiveHelper.sizedBoxHeight(context, 10),

                Consumer<VendorModuleApiProvider>(
                  builder: (context, loginProvider, child) {
                    print("✅ Consumer call ho rha hai ");
                    return loginProvider.isLoading
                        ? LoadingIndicatorUtils() // Show loader
                        : Padding(
                            padding: ResponsiveHelper.paddingSymmetric(
                              context,
                              horizontal: 10.0,
                            ),
                            child: CustomButton(
                              color: AppColors.primary,
                              onPressed: () {
                                if (_formKey.currentState!.validate()) {
                                  handleSubmit();
                                }
                              },
                              text: 'Add Customer',
                            ),
                          );
                  },
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
