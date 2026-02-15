import 'dart:io';

import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/vendor_module/controller/vendor_api_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../ui_helper/app_colors.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/form_validations_utils.dart';


class AddBankDetailScreen extends StatefulWidget {
  const AddBankDetailScreen({Key? key}) : super(key: key);

  @override
  State<AddBankDetailScreen> createState() => _AddBankDetailScreenState();
}

class _AddBankDetailScreenState extends State<AddBankDetailScreen> {
  final TextEditingController bankNameController = TextEditingController();
  final TextEditingController accountNumberController = TextEditingController();
  final TextEditingController branchController = TextEditingController();
  final TextEditingController ifscCodeController = TextEditingController();
  final TextEditingController accountHolderNameController = TextEditingController();
  final TextEditingController upiIdController = TextEditingController();
  final TextEditingController countryController = TextEditingController();

  final FocusNode _accountHolderNameFocusNode = FocusNode();
  final FocusNode _bankNameFocusNode = FocusNode();
  final FocusNode _accountNumberFocusNode = FocusNode();
  final FocusNode _branchFocusNode = FocusNode();
  final FocusNode _ifscCodeFocusNode = FocusNode();
  final FocusNode _bankCodeFocusNode = FocusNode();
  final FocusNode _upiIdFocusNode = FocusNode();
  final FocusNode _countryFocusNode = FocusNode();
  final _formKey = GlobalKey<FormState>();

  // handle the login api here
  Future<void> handleSubmit() async {
    final bankDetailProvider = context.read<VendorModuleApiProvider>();
    if (accountNumberController.text.isEmpty || branchController.text.isEmpty) {
      print("🔴 Validation Failed: Fields are empty");
      return;
    }


    Map<String, dynamic> requestBodyAddEmployee ={
      "accountHolderName":accountHolderNameController.text.trim(),
      "accountNumber": accountNumberController.text.trim(),
      "ifscCode": ifscCodeController.text.trim(),
      "bankName": bankNameController.text.trim(),
      "branchName": branchController.text.trim(),
      "upiId": countryController.text.trim(),
    };
    bankDetailProvider.addBankDetails(context, requestBodyAddEmployee);
  }

  @override
  void initState() {
    super.initState();

    List<FocusNode> focusNodes = [
      _bankNameFocusNode,
      _accountNumberFocusNode,
      _branchFocusNode,
      _ifscCodeFocusNode,
      _bankCodeFocusNode,
      _countryFocusNode,
      _upiIdFocusNode,
    ];

    for (var node in focusNodes) {
      node.addListener(() => setState(() {}));
    }
  }

  @override
  void dispose() {
    bankNameController.dispose();
    accountNumberController.dispose();
    branchController.dispose();
    ifscCodeController.dispose();
    accountHolderNameController.dispose();
    countryController.dispose();
    upiIdController.dispose();
    _bankNameFocusNode.dispose();
    _accountNumberFocusNode.dispose();
    _branchFocusNode.dispose();
    _ifscCodeFocusNode.dispose();
    _bankCodeFocusNode.dispose();
    _countryFocusNode.dispose();
    _upiIdFocusNode.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "Add Bank",
        backgroundColor: AppColors.primary,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 20.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CustomTextField(
                  controller: accountHolderNameController,
                  focusNode: _accountHolderNameFocusNode,
                  prefixIcon: Icons.person_pin,
                  hintText: "Account Holder Name",
                  title: "Account Holder Name",
                  keyboardType: TextInputType.text,
                  validator: (val) =>FormValidatorUtils.validateRequired(  val, fieldName: 'Account Holder Name', ),
                ),
                CustomTextField(
                  controller: accountNumberController,
                  focusNode: _accountNumberFocusNode,
                  prefixIcon: Icons.food_bank_outlined,
                  hintText: "Account Number",
                  title: "Account Number",
                  keyboardType: TextInputType.number,
                  validator: (val) =>FormValidatorUtils.validateRequired(  val, fieldName: 'Account Number', ),
                ),
                CustomTextField(
                  controller: ifscCodeController,
                  focusNode: _ifscCodeFocusNode,
                  prefixIcon: Icons.email_outlined,
                  hintText: "IFSC Code",
                  title: "IFSC Code",
                  keyboardType: TextInputType.text,
                  validator: (val) =>FormValidatorUtils.validateRequired(  val, fieldName: 'IFSC Code', ),

                ),
                CustomTextField(
                  controller: bankNameController,
                  focusNode: _bankNameFocusNode,
                  prefixIcon: Icons.person_pin,
                  hintText: "Bank Name",
                  title: "Bank Name",
                  keyboardType: TextInputType.text,
                ),
                CustomTextField(
                  controller: branchController,
                  focusNode: _branchFocusNode,
                  prefixIcon: Icons.person_pin,
                  hintText: "Branch Name",
                  title: "Branch Name",
                  keyboardType: TextInputType.text,
                ),
                CustomTextField(
                  controller: upiIdController,
                  focusNode: _upiIdFocusNode,
                  prefixIcon: Icons.location_on_sharp,
                  hintText: "7526074042@ybl",
                  title: "UPI ID",
                ),
                const SizedBox(height: 20),
                Consumer<VendorModuleApiProvider>(
                  builder: (context, loginProvider, child) {
                    print("✅ Consumer call ho rha hai ");
                    return loginProvider.isLoading
                        ? LoadingIndicatorUtils() // Show loader
                        : CustomButton(
                      color: AppColors.primary,
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          handleSubmit();
                        }
                      },
                      text: 'Add Bank Details',
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
