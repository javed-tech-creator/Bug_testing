import 'package:dss_crm/sales_module/common/model/common_add_lead_model.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/controller/sales_hod_lead_controller.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/model/shared_common_lead_result_list_model.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/form_validations_utils.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
import '../../../../utils/responsive_loader_utils.dart';

class AddSalesHODLeadScreen extends StatefulWidget {
  // const AddSalesHODLeadScreen({super.key});

  // Use the new model in the constructor.
  final CommonAddLeadModelLeadModel? leadData; // <-- Corrected model type and made it nullable

  const AddSalesHODLeadScreen({Key? key, this.leadData}) : super(key: key); // <-- Corrected constructor


  @override
  State<AddSalesHODLeadScreen> createState() => _AddSalesHODLeadScreenState();
}

class _AddSalesHODLeadScreenState extends State<AddSalesHODLeadScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _queryDateController = TextEditingController();
  final TextEditingController _senderNameController = TextEditingController();
  final TextEditingController _concernPersonNameController = TextEditingController();
  final TextEditingController _mobileNumberController = TextEditingController();
  final TextEditingController _altWhatsappNumberController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _companyNameController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _pinCodeController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _stateController = TextEditingController();
  final TextEditingController _requirementController = TextEditingController();

  String? _selectedLeadSource;
  String? _selectedLeadType;
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    // Check if leadData was passed to the screen
    if (widget.leadData != null) {
      // Pre-populate the form fields
      _queryDateController.text = widget.leadData?.updatedAt ?? '';
      _senderNameController.text = widget.leadData?.concernPersonName ?? '';
      _concernPersonNameController.text = widget.leadData?.concernPersonName ?? '';
      _mobileNumberController.text = widget.leadData?.phone ?? '';
      _altWhatsappNumberController.text = widget.leadData?.altPhone ?? '';
      _emailController.text = widget.leadData?.email ?? '';
      // _companyNameController.text = widget.leadData?.company ?? '';
      _addressController.text = widget.leadData?.address ?? '';
      _pinCodeController.text = widget.leadData?.pincode ?? '';
      _cityController.text = widget.leadData?.city ?? '';
      // State is not in your CommonAddLeadModel, so we'll leave it out or handle it separately
      // _stateController.text = widget.leadData?.state ?? '';
      _requirementController.text = widget.leadData?.requirement ?? '';

      // Pre-populate the dropdowns
      _selectedLeadSource = widget.leadData?.leadSource;
      _selectedLeadType = widget.leadData?.leadType;
    }
  }

  @override
  void dispose() {
    _queryDateController.dispose();
    _senderNameController.dispose();
    _concernPersonNameController.dispose();
    _mobileNumberController.dispose();
    _altWhatsappNumberController.dispose();
    _emailController.dispose();
    _companyNameController.dispose();
    _addressController.dispose();
    _pinCodeController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _requirementController.dispose();
    super.dispose();
  }

  // handle the login api here
  void handleSubmit() async {
    final userId = await StorageHelper().getLoginUserId();
    final leadProvider = context.read<SalesHODLeadApiProvider>();
    final addLeadBody = {
      "userId": userId,
      "leadSource": _selectedLeadSource,
      "leadType": _selectedLeadType,
      // "senderName": _senderNameController.text.trim(),
      "concernPersonName": _concernPersonNameController.text.trim(),
      "phone":  _mobileNumberController.text.trim(),
      "altPhone":  _altWhatsappNumberController.text.trim(),
      "email":  _emailController.text.trim(),
      "city":  _cityController.text.trim(),
      "address": _addressController.text.trim(),
      "pincode": _pinCodeController.text.trim(),
      "requirement": _requirementController.text.trim(),
    };
    leadProvider.addLead(
      context,
      addLeadBody,
    );
  }

  @override
  Widget build(BuildContext context) {
    final String appBarTitle = widget.leadData != null ? "Update Lead" : "Add Lead";

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: appBarTitle,
        backgroundColor: AppColors.primary,
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                ResponsiveDropdown<String>(
                  label: 'Lead Source',
                  hint: 'Select Lead Source',
                  value: _selectedLeadSource,
                  itemList: ['Website', 'Phone','Email','Justdial','Facebook','Instagram', 'Indiamart',"Other"],
                  onChanged: (value) =>
                      setState(() => _selectedLeadSource = value),
                ),
                ResponsiveDropdown<String>(
                  label: 'Lead Type',
                  hint: 'Select Lead Type',
                  value: _selectedLeadType,
                  itemList: ['Fresh', 'Repeat'],
                  onChanged: (value) =>
                      setState(() => _selectedLeadType = value),
                ),
                // const SizedBox(height: 5),
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
                  hintText: "Enter concern person name",
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
                ),   // const SizedBox(height: 8),
                CustomTextField(
                  title: "Alternate/Whatsapp No",
                  hintText: "Enter mobile number",
                  controller: _altWhatsappNumberController,
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
                  title: "City",
                  hintText: "Enter City",
                  controller: _cityController,
                  prefixIcon: Icons.location_on,
                ),
                // const SizedBox(height: 8),
                CustomTextField(
                  title: "Address",
                  hintText: "Enter address",
                  controller: _addressController,
                  isMultiLine: true,
                  maxLines: 3,
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
                  maxLines: 3,
                ),
                const SizedBox(height: 8),
                context.watch<SalesHODLeadApiProvider>().isLoading
                    ? LoadingIndicatorUtils()
                    : CustomButton(
                  color: AppColors.primary,
                  // text: "Submit",
                  text: widget.leadData != null ? "Update" : "Submit",
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
      ),
    );
  }
}
