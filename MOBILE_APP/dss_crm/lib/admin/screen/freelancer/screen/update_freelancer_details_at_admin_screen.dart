import 'dart:io';

import 'package:dss_crm/admin/controller/admin_main_api_provider.dart';
import 'package:dss_crm/admin/screen/vendor/model/single_vendor_detail_at_admin_model.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/ui_helper/app_text_styles.dart';
import 'package:dss_crm/utils/custom_buttons_utils.dart';
import 'package:dss_crm/utils/custom_text_field_utils.dart';
import 'package:dss_crm/utils/default_common_app_bar.dart';
import 'package:dss_crm/utils/file_picker_utils.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class UpdateFreelancerAtAdminScreen extends StatefulWidget {
  final String vendorId;

  const UpdateFreelancerAtAdminScreen({Key? key, required this.vendorId})
    : super(key: key);

  @override
  State<UpdateFreelancerAtAdminScreen> createState() =>
      _UpdateFreelancerAtAdminScreenState();
}

class _UpdateFreelancerAtAdminScreenState
    extends State<UpdateFreelancerAtAdminScreen> {
  late final AdminMainApiProvider provider;

  // Controllers
  final TextEditingController contactPersonNameController =
      TextEditingController();
  final TextEditingController contactNumberController = TextEditingController();
  final TextEditingController alternateNumberController =
      TextEditingController();
  final TextEditingController emailAddressController = TextEditingController();
  final TextEditingController businessNameController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController stateController = TextEditingController();
  final TextEditingController pincodeController = TextEditingController();
  final TextEditingController gstNumberController = TextEditingController();
  final TextEditingController panNumberController = TextEditingController();
  final TextEditingController aadharNumberController = TextEditingController();
  final TextEditingController bankNameController = TextEditingController();
  final TextEditingController accountNumberController = TextEditingController();
  final TextEditingController ifscCodeController = TextEditingController();

  // New files
  File? newProfileImage;
  File? newContractForm;

  // Additional Docs: {id, titleController, newFile, existingFileName}
  List<Map<String, dynamic>> additionalDocuments = [];

  final _formKey = GlobalKey<FormState>();
  bool _isDataLoaded = false;

  @override
  void initState() {
    super.initState();
    provider = context.read<AdminMainApiProvider>();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      provider.clearSingleVendorDetail(); // ← Now safe
      provider.getFreelancerSingleDraftDetail(context, widget.vendorId);
    });

    provider.addListener(_onProviderChange);
  }

  void _onProviderChange() {
    if (!mounted || _isDataLoaded) return;
    final response = provider.getSingleVendorDetailsAtAdminModeResponse;
    if (response?.success == true && response?.data?.data != null) {
      _fillFormWithData(response!.data!.data!);
      _isDataLoaded = true;
      if (mounted) setState(() {});
    }
  }

  void _fillFormWithData(Data vendor) {
    contactPersonNameController.text = vendor.contactPersonName ?? '';
    contactNumberController.text = vendor.contactNumber ?? '';
    alternateNumberController.text = vendor.alternateContact ?? '';
    emailAddressController.text = vendor.email ?? '';
    businessNameController.text = vendor.businessName ?? '';
    addressController.text = vendor.address ?? '';
    cityController.text = vendor.city ?? '';
    stateController.text = vendor.state ?? '';
    pincodeController.text = vendor.pincode ?? '';
    gstNumberController.text = vendor.gstNumber ?? '';
    panNumberController.text = vendor.panNumber ?? '';
    aadharNumberController.text = vendor.aadharNumber ?? '';
    bankNameController.text = vendor.bankName ?? '';
    accountNumberController.text = vendor.accountNumber ?? '';
    ifscCodeController.text = vendor.ifscCode ?? '';

    // Load existing additional documents
    additionalDocuments = (vendor.additionalDocs ?? []).map((doc) {
      return {
        'id': doc.sId,
        'titleController': TextEditingController(text: doc.docTitle ?? ''),
        'newFile': null as File?,
        'existingFileName': doc.fileName,
      };
    }).toList();
  }

  Future<void> _handleUpdate() async {
    if (!_formKey.currentState!.validate()) return;

    List<Map<String, dynamic>> docsToSend = [];
    List<String> docsToDelete = [];

    for (var doc in additionalDocuments) {
      final titleCtrl = doc['titleController'] as TextEditingController;
      final newFile = doc['newFile'] as File?;
      final id = doc['id'] as String?;

      if (titleCtrl.text.trim().isEmpty && id != null) {
        docsToDelete.add(id);
      } else if (newFile != null || titleCtrl.text.trim().isNotEmpty) {
        docsToSend.add({
          'id': id,
          'title': titleCtrl.text.trim(),
          'file': newFile,
        });
      }
    }

    await provider.updateFreelancerAtAdmin(
      context: context,
      freelancerId: widget.vendorId,
      contactPersonName: contactPersonNameController.text.trim(),
      contactNumber: contactNumberController.text.trim(),
      alternateContact: alternateNumberController.text.trim().isEmpty
          ? null
          : alternateNumberController.text.trim(),
      email: emailAddressController.text.trim(),
      businessName: businessNameController.text.trim(),
      address: addressController.text.trim(),
      city: cityController.text.trim(),
      state: stateController.text.trim(),
      pincode: pincodeController.text.trim(),
      gstNumber: gstNumberController.text.trim().isEmpty
          ? null
          : gstNumberController.text.trim(),
      panNumber: panNumberController.text.trim().isEmpty
          ? null
          : panNumberController.text.trim(),
      aadharNumber: aadharNumberController.text.trim().isEmpty
          ? null
          : aadharNumberController.text.trim(),
      bankName: bankNameController.text.trim().isEmpty
          ? null
          : bankNameController.text.trim(),
      accountNumber: accountNumberController.text.trim().isEmpty
          ? null
          : accountNumberController.text.trim(),
      ifscCode: ifscCodeController.text.trim().isEmpty
          ? null
          : ifscCodeController.text.trim(),
      profileImage: newProfileImage,
      contractForm: newContractForm,
      additionalDocuments: docsToSend,
      deleteAdditionalDocIds: docsToDelete,
    );
  }

  @override
  void dispose() {
    provider.removeListener(_onProviderChange);
    for (var c in [
      contactPersonNameController,
      contactNumberController,
      alternateNumberController,
      emailAddressController,
      businessNameController,
      addressController,
      cityController,
      stateController,
      pincodeController,
      gstNumberController,
      panNumberController,
      aadharNumberController,
      bankNameController,
      accountNumberController,
      ifscCodeController,
    ])
      c.dispose();
    for (var doc in additionalDocuments) {
      (doc['titleController'] as TextEditingController).dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = provider.isLoading;
    final vendor =
        provider.getSingleVendorDetailsAtAdminModeResponse?.data?.data;

    if (isLoading || vendor == null) {
      return Scaffold(
        appBar: DefaultCommonAppBar(
          activityName: "Update Freelancer",
          backgroundColor: AppColors.primary,
        ),
        body: Center(child: LoadingIndicatorUtils()),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.endingGreyColor,
      appBar: DefaultCommonAppBar(
        activityName: "Update Freelancer",
        backgroundColor: AppColors.primary,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(vertical: 20),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                // Personal, Address, KYC - same as Add screen
                _buildSectionContainer(
                  context,
                  title: "Personal Information",
                  icon: Icons.person,
                  children: [
                    CustomTextField(
                      controller: contactPersonNameController,
                      prefixIcon: Icons.person_pin,
                      hintText: "Contact Person Name",
                      title: "Contact Person Name",
                      validationType: ValidationType.name,
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: CustomTextField(
                            controller: contactNumberController,
                            prefixIcon: Icons.phone,
                            hintText: "Contact Number",
                            title: "Contact Number",
                            maxLength: 10,
                            keyboardType: TextInputType.phone,
                            validationType: ValidationType.phone,
                          ),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: CustomTextField(
                            controller: alternateNumberController,
                            prefixIcon: Icons.phone_android,
                            hintText: "Alternate Number (Optional)",
                            title: "Alternate Number",
                            maxLength: 10,
                            keyboardType: TextInputType.phone,
                          ),
                        ),
                      ],
                    ),
                    CustomTextField(
                      controller: emailAddressController,
                      prefixIcon: Icons.email,
                      hintText: "Email Address",
                      title: "Email Address",
                      keyboardType: TextInputType.emailAddress,
                      validationType: ValidationType.email,
                    ),
                    CustomTextField(
                      controller: businessNameController,
                      prefixIcon: Icons.business,
                      hintText: "Business Name",
                      title: "Business Name",
                      validationType: ValidationType.required,
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 10),
                _buildSectionContainer(
                  context,
                  title: "Address Information",
                  icon: Icons.location_on,
                  children: [
                    CustomTextField(
                      controller: addressController,
                      hintText: "Address",
                      title: "Address",
                      maxLines: 4,
                      validationType: ValidationType.required,
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: CustomTextField(
                            controller: cityController,
                            prefixIcon: Icons.location_city,
                            hintText: "City",
                            title: "City",
                          ),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: CustomTextField(
                            controller: stateController,
                            prefixIcon: Icons.map,
                            hintText: "State",
                            title: "State",
                          ),
                        ),
                      ],
                    ),
                    CustomTextField(
                      controller: pincodeController,
                      prefixIcon: Icons.pin_drop,
                      hintText: "Pincode",
                      title: "Pincode",
                      maxLength: 6,
                      keyboardType: TextInputType.number,
                      validationType: ValidationType.number,
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 10),
                _buildSectionContainer(
                  context,
                  title: "KYC & Banking Details (Optional)",
                  icon: Icons.account_balance,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: CustomTextField(
                            controller: gstNumberController,
                            prefixIcon: Icons.document_scanner,
                            hintText: "GST Number (Optional)",
                            title: "GST Number",
                          ),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: CustomTextField(
                            controller: panNumberController,
                            prefixIcon: Icons.credit_card,
                            hintText: "PAN Number (Optional)",
                            title: "PAN Number",
                          ),
                        ),
                      ],
                    ),
                    CustomTextField(
                      controller: aadharNumberController,
                      prefixIcon: Icons.badge,
                      hintText: "Aadhar Number (Optional)",
                      title: "Aadhar Number",
                      maxLength: 12,
                      keyboardType: TextInputType.number,
                    ),
                    CustomTextField(
                      controller: bankNameController,
                      prefixIcon: Icons.account_balance,
                      hintText: "Bank Name (Optional)",
                      title: "Bank Name",
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: CustomTextField(
                            controller: accountNumberController,
                            prefixIcon: Icons.account_box,
                            hintText: "Account Number (Optional)",
                            title: "Account Number",
                            keyboardType: TextInputType.number,
                          ),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: CustomTextField(
                            controller: ifscCodeController,
                            prefixIcon: Icons.qr_code,
                            hintText: "IFSC Code (Optional)",
                            title: "IFSC Code",
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 10),

                // Upload Documents (Profile + Contract)
                _buildSectionContainer(
                  context,
                  title: "Upload Documents (Optional)",
                  icon: Icons.upload_file,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: _buildFileUploadButton(
                            title: "Profile Image",
                            file: newProfileImage,
                            existingFileName: vendor.profileImage?.fileName,
                            onTap: () async {
                              final f = await FilePickerUtil.pickImage();
                              if (f != null)
                                setState(() => newProfileImage = f);
                            },
                            icon: Icons.image,
                          ),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: _buildFileUploadButton(
                            title: "Contract Form (PDF)",
                            file: newContractForm,
                            existingFileName: vendor.contractForm?.fileName,
                            onTap: () async {
                              final f = await FilePickerUtil.pickPDF();
                              if (f != null)
                                setState(() => newContractForm = f);
                            },
                            icon: Icons.picture_as_pdf,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 10),

                // Additional Documents - EXACT SAME DESIGN AS ADD SCREEN
                _buildSectionContainer(
                  context,
                  title: "Additional Documents (Optional)",
                  icon: Icons.description,
                  children: [
                    ...additionalDocuments.asMap().entries.map((entry) {
                      final index = entry.key;
                      final doc = entry.value;
                      final titleCtrl =
                          doc['titleController'] as TextEditingController;
                      final newFile = doc['newFile'] as File?;
                      final existingFileName =
                          doc['existingFileName'] as String?;

                      return Padding(
                        padding: EdgeInsets.only(bottom: 12),
                        child: Row(
                          children: [
                            Expanded(
                              flex: 2,
                              child: CustomTextField(
                                controller: titleCtrl,
                                hintText: "e.g. GST Certificate",
                                title: "Document Title",
                                validationType: ValidationType.none,
                              ),
                            ),
                            SizedBox(width: 10),
                            Expanded(
                              flex: 2,
                              child: _buildFileUploadButton(
                                title: "Upload File",
                                file: newFile,
                                existingFileName: existingFileName,
                                onTap: () async {
                                  final f = await FilePickerUtil.pickDocument();
                                  if (f != null) {
                                    setState(
                                      () =>
                                          additionalDocuments[index]['newFile'] =
                                              f,
                                    );
                                  }
                                },
                                icon: Icons.attach_file,
                              ),
                            ),
                            IconButton(
                              onPressed: () => setState(
                                () => additionalDocuments.removeAt(index),
                              ),
                              icon: Icon(Icons.delete, color: Colors.red),
                            ),
                          ],
                        ),
                      );
                    }),

                    if (additionalDocuments.isEmpty)
                      Center(
                        child: Column(
                          children: [
                            Icon(
                              Icons.description,
                              size: 50,
                              color: Colors.grey[400],
                            ),
                            SizedBox(height: 10),
                            Text(
                              "No documents added yet",
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Text(
                              "Add your first document using the button below",
                              style: TextStyle(
                                color: Colors.grey[500],
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),

                    SizedBox(height: 10),

                    CustomButton(
                      text: "Add Document",
                      color: Colors.grey[300]!,
                      textColor: Colors.black,
                      type: ButtonType.outlined,
                      onPressed: () {
                        setState(() {
                          additionalDocuments.add({
                            'id': null,
                            'titleController': TextEditingController(),
                            'newFile': null,
                            'existingFileName': null,
                          });
                        });
                      },
                    )

                    // ElevatedButton.icon(
                    //   onPressed: () {
                    //     setState(() {
                    //       additionalDocuments.add({
                    //         'id': null,
                    //         'titleController': TextEditingController(),
                    //         'newFile': null,
                    //         'existingFileName': null,
                    //       });
                    //     });
                    //   },
                    //   icon: Icon(Icons.add),
                    //   label: Text("Add Document"),
                    //   style: ElevatedButton.styleFrom(
                    //     backgroundColor: Colors.grey[300],
                    //     foregroundColor: Colors.black,
                    //     minimumSize: Size(double.infinity, 45),
                    //   ),
                    // ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 20),

                // Update Button
                Consumer<AdminMainApiProvider>(
                  builder: (context, p, _) => Padding(
                    padding: ResponsiveHelper.paddingSymmetric(context,horizontal: 10.0),
                    child: CustomButton(
                      text: p.isUpdating ? "Updating.." : "Update",
                      isLoading: p.isUpdating, // NEW
                      color: AppColors.primary,
                      onPressed: _handleUpdate,
                    ),
                  ),
                ),
                SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionContainer(
    BuildContext context, {
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Container(
      color: AppColors.whiteColor,
      child: Padding(
        padding: ResponsiveHelper.paddingSymmetric(
          context,
          horizontal: 16,
          vertical: 10,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: AppColors.primary, size: 20),
                SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            ResponsiveHelper.sizedBoxHeight(context, 10),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildFileUploadButton({
    required String title,
    File? file,
    String? existingFileName,
    required VoidCallback onTap,
    required IconData icon,
  }) {
    final displayName = file != null
        ? file.path.split('/').last
        : (existingFileName ?? "Choose file");
    final isUploaded = file != null || existingFileName != null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 10),
            ),
          ),
        ),
        SizedBox(height: 4),
        InkWell(
          onTap: onTap,
          child: Container(
            padding: ResponsiveHelper.paddingAll(context, 11),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey, width: 1),
              borderRadius: BorderRadius.circular(8),
              color: isUploaded ? Colors.green[50] : Colors.grey[50],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  isUploaded ? Icons.check_circle : icon,
                  color: isUploaded ? Colors.green : AppColors.primary,
                  size: ResponsiveHelper.iconSize(context, 18),
                ),
                ResponsiveHelper.sizedBoxWidth(context, 8),
                Expanded(
                  child: Text(
                    displayName,
                    style: TextStyle(
                      color: isUploaded ? Colors.green : Colors.grey[600],
                      fontSize: ResponsiveHelper.fontSize(context, 12),
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
