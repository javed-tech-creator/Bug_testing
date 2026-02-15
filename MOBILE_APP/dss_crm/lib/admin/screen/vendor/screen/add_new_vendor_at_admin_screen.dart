import 'dart:io';

import 'package:dss_crm/admin/controller/admin_main_api_provider.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/vendor_module/controller/vendor_api_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/file_picker_utils.dart';
import '../../../../utils/permission_manager_utils.dart';

class AddNewVendorAtAdminScreen extends StatefulWidget {
  const AddNewVendorAtAdminScreen({Key? key}) : super(key: key);

  @override
  State<AddNewVendorAtAdminScreen> createState() => _AddNewVendorAtAdminScreenState();
}

class _AddNewVendorAtAdminScreenState extends State<AddNewVendorAtAdminScreen> {
  // Personal Information Controllers
  final TextEditingController contactPersonNameController = TextEditingController();
  final TextEditingController contactNumberController = TextEditingController();
  final TextEditingController alternateNumberController = TextEditingController();
  final TextEditingController emailAddressController = TextEditingController();
  final TextEditingController businessNameController = TextEditingController();

  // Address Information Controllers
  final TextEditingController addressController = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController stateController = TextEditingController();
  final TextEditingController pincodeController = TextEditingController();

  // KYC & Banking Details Controllers
  final TextEditingController gstNumberController = TextEditingController();
  final TextEditingController panNumberController = TextEditingController();
  final TextEditingController aadharNumberController = TextEditingController();
  final TextEditingController bankNameController = TextEditingController();
  final TextEditingController accountNumberController = TextEditingController();
  final TextEditingController ifscCodeController = TextEditingController();

  // Upload Documents
  File? profileImage;
  File? contractForm;

  // Additional Documents
  List<AdditionalDocument> additionalDocuments = [];

  final _formKey = GlobalKey<FormState>();

  // ==================== FILE PICKER METHODS WITH PERMISSION ====================

  /// Pick Profile Image with Permission Handling
  Future<void> pickProfileImage() async {
    // Request permission first
    final hasPermission = await PermissionManager.requestPhotos(context);

    if (!hasPermission) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Photos permission is required to select profile image'),
            backgroundColor: Colors.red,
          ),
        );
      }
      return;
    }

    // Pick image using FilePickerUtil
    final file = await FilePickerUtil.pickImage();

    if (file != null) {
      setState(() {
        profileImage = file;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile image selected successfully'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );
      }
    }
  }

  /// Pick Contract Form (PDF) with Permission Handling
  Future<void> pickContractForm() async {
    // Request storage permission for documents
    final hasPermission = await PermissionManager.requestStorage(context);

    if (!hasPermission) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Storage permission is required to select PDF files'),
            backgroundColor: Colors.red,
          ),
        );
      }
      return;
    }

    // Pick PDF using FilePickerUtil
    final file = await FilePickerUtil.pickPDF();

    if (file != null) {
      setState(() {
        contractForm = file;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Contract form selected successfully'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );
      }
    }
  }

  /// Pick Additional Document with Permission Handling
  Future<File?> pickAdditionalDocument() async {
    // Request storage permission for documents
    final hasPermission = await PermissionManager.requestStorage(context);

    if (!hasPermission) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Storage permission is required to select documents'),
            backgroundColor: Colors.red,
          ),
        );
      }
      return null;
    }

    // Pick document using FilePickerUtil (supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)
    final file = await FilePickerUtil.pickDocument();

    if (file != null) {
      // Get file details for logging/display
      final fileDetails = await FilePickerUtil.getFileDetails(file);
      if (fileDetails != null) {
        print('📄 File Selected: ${fileDetails['name']}');
        print('📦 File Size: ${fileDetails['sizeInKB']} KB');
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Document selected successfully'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );
      }
    }

    return file;
  }

  // ==================== DOCUMENT MANAGEMENT ====================

  void addAdditionalDocument() {
    setState(() {
      additionalDocuments.add(AdditionalDocument(
        titleController: TextEditingController(),
        file: null,
      ));
    });
  }

  void removeAdditionalDocument(int index) {
    setState(() {
      additionalDocuments[index].titleController.dispose();
      additionalDocuments.removeAt(index);
    });
  }

  // ==================== FORM SUBMISSION ====================

  // Future<void> handleSubmit() async {
  //   final vendorProvider = context.read<VendorModuleApiProvider>();
  //
  //   // Basic validation check
  //   if (contactNumberController.text.isEmpty || emailAddressController.text.isEmpty) {
  //     print("🔴 Validation Failed: Required fields are empty");
  //     return;
  //   }
  //
  //   // Prepare request body
  //   Map<String, dynamic> requestBody = {
  //     "contactPersonName": contactPersonNameController.text.trim(),
  //     "contactNumber": contactNumberController.text.trim(),
  //     "alternateNumber": alternateNumberController.text.trim(),
  //     "email": emailAddressController.text.trim(),
  //     "businessName": businessNameController.text.trim(),
  //     "address": addressController.text.trim(),
  //     "city": cityController.text.trim(),
  //     "state": stateController.text.trim(),
  //     "pincode": pincodeController.text.trim(),
  //     "gstin": gstNumberController.text.trim(),
  //     "pan": panNumberController.text.trim(),
  //     "aadhar": aadharNumberController.text.trim(),
  //     "bankName": bankNameController.text.trim(),
  //     "accountNumber": accountNumberController.text.trim(),
  //     "ifscCode": ifscCodeController.text.trim(),
  //   };
  //
  //   // TODO: Add file uploads to request
  //   // You can convert files to base64 or multipart here based on your API requirements
  //   if (profileImage != null) {
  //     print("✅ Profile Image: ${profileImage!.path}");
  //   }
  //   if (contractForm != null) {
  //     print("✅ Contract Form: ${contractForm!.path}");
  //   }
  //
  //   // Additional documents
  //   for (var i = 0; i < additionalDocuments.length; i++) {
  //     if (additionalDocuments[i].file != null) {
  //       print("✅ Additional Document ${i + 1}: ${additionalDocuments[i].titleController.text}");
  //     }
  //   }
  //
  //   vendorProvider.addVendorCustomer(context, requestBody);
  // }


  Future<void> handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    final vendorProvider = context.read<AdminMainApiProvider>();

    // Prepare additional documents list
    List<Map<String, dynamic>> docs = [];
    for (var doc in additionalDocuments) {
      if (doc.file != null && doc.titleController.text.trim().isNotEmpty) {
        docs.add({
          "title": doc.titleController.text.trim(),
          "file": doc.file!,
        });
      }
    }

    // Call API via Provider
    await vendorProvider.addNewVendorAtAdmin(
      context: context,
      contactPersonName: contactPersonNameController.text.trim(),
      contactNumber: contactNumberController.text.trim(),
      alternateContact: alternateNumberController.text.trim().isEmpty ? null : alternateNumberController.text.trim(),
      email: emailAddressController.text.trim(),
      businessName: businessNameController.text.trim(),
      address: addressController.text.trim(),
      city: cityController.text.trim(),
      state: stateController.text.trim(),
      pincode: pincodeController.text.trim(),
      gstNumber: gstNumberController.text.trim().isEmpty ? null : gstNumberController.text.trim(),
      panNumber: panNumberController.text.trim().isEmpty ? null : panNumberController.text.trim(),
      aadharNumber: aadharNumberController.text.trim().isEmpty ? null : aadharNumberController.text.trim(),
      bankName: bankNameController.text.trim().isEmpty ? null : bankNameController.text.trim(),
      accountNumber: accountNumberController.text.trim().isEmpty ? null : accountNumberController.text.trim(),
      ifscCode: ifscCodeController.text.trim().isEmpty ? null : ifscCodeController.text.trim(),

      profileImage: profileImage,
      contractForm: contractForm,
      additionalDocuments: docs,
    );
  }

  // ==================== LIFECYCLE METHODS ====================

  @override
  void dispose() {
    contactPersonNameController.dispose();
    contactNumberController.dispose();
    alternateNumberController.dispose();
    emailAddressController.dispose();
    businessNameController.dispose();
    addressController.dispose();
    cityController.dispose();
    stateController.dispose();
    pincodeController.dispose();
    gstNumberController.dispose();
    panNumberController.dispose();
    aadharNumberController.dispose();
    bankNameController.dispose();
    accountNumberController.dispose();
    ifscCodeController.dispose();

    for (var doc in additionalDocuments) {
      doc.titleController.dispose();
    }

    super.dispose();
  }

  // ==================== BUILD METHOD ====================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.endingGreyColor,
      appBar: DefaultCommonAppBar(
        activityName: "Add Vendor",
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
                // Personal Information Section
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
                      keyboardType: TextInputType.text,
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
                        const SizedBox(width: 10),
                        Expanded(
                          child: CustomTextField(
                            controller: alternateNumberController,
                            prefixIcon: Icons.phone_android,
                            hintText: "Alternate Number (Optional)",
                            title: "Alternate Number (Optional)",
                            maxLength: 10,
                            keyboardType: TextInputType.phone,
                            validationType: ValidationType.phone,
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
                      keyboardType: TextInputType.text,
                      validationType: ValidationType.required,
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 10),

                // Address Information Section
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
                            keyboardType: TextInputType.text,
                            validationType: ValidationType.noSpecialChars,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: CustomTextField(
                            controller: stateController,
                            prefixIcon: Icons.map,
                            hintText: "State",
                            title: "State",
                            keyboardType: TextInputType.text,
                            validationType: ValidationType.noSpecialChars,
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

                // KYC & Banking Details Section
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
                            title: "GST Number (Optional)",
                            keyboardType: TextInputType.text,
                            validationType: ValidationType.optionalGST,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: CustomTextField(
                            controller: panNumberController,
                            prefixIcon: Icons.credit_card,
                            hintText: "PAN Number (Optional)",
                            title: "PAN Number (Optional)",
                            keyboardType: TextInputType.text,
                            validationType: ValidationType.optionalPAN,
                          ),
                        ),
                      ],
                    ),
                    CustomTextField(
                      controller: aadharNumberController,
                      prefixIcon: Icons.badge,
                      hintText: "Aadhar Number (Optional)",
                      title: "Aadhar Number (Optional)",
                      maxLength: 12,
                      keyboardType: TextInputType.number,
                      validationType: ValidationType.optionalAadhar,
                    ),
                    CustomTextField(
                      controller: bankNameController,
                      prefixIcon: Icons.account_balance,
                      hintText: "Bank Name (Optional)",
                      title: "Bank Name (Optional)",
                      keyboardType: TextInputType.text,
                      validationType: ValidationType.optionalMinLength,
                      minLength: 3,
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: CustomTextField(
                            controller: accountNumberController,
                            prefixIcon: Icons.account_box,
                            hintText: "Account Number (Optional)",
                            title: "Account Number (Optional)",
                            keyboardType: TextInputType.number,
                            validationType: ValidationType.optionalNumber,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: CustomTextField(
                            controller: ifscCodeController,
                            prefixIcon: Icons.qr_code,
                            hintText: "IFSC Code (Optional)",
                            title: "IFSC Code (Optional)",
                            keyboardType: TextInputType.text,
                            validationType: ValidationType.optionalIFSC,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 10),

                // Upload Documents Section
                _buildSectionContainer(
                  context,
                  title: "Upload Documents (Optional)",
                  icon: Icons.upload_file,
                  children: [
                    ResponsiveHelper.sizedBoxHeight(context, 10),
                    Row(
                      children: [
                        Expanded(
                          child: _buildFileUploadButton(
                            title: "Profile Image",
                            file: profileImage,
                            onTap: pickProfileImage,
                            icon: Icons.image,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildFileUploadButton(
                            title: "Contract Form (PDF)",
                            file: contractForm,
                            onTap: pickContractForm,
                            icon: Icons.picture_as_pdf,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 10),

                // Additional Documents Section
                _buildSectionContainer(
                  context,
                  title: "Additional Documents (Optional)",
                  icon: Icons.description,
                  children: [
                    // List of additional documents
                    ...List.generate(additionalDocuments.length, (index) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          children: [
                            Expanded(
                              flex: 2,
                              child: CustomTextField(
                                controller: additionalDocuments[index].titleController,
                                hintText: "e.g. GST Certificate",
                                title: "Document Title",
                                keyboardType: TextInputType.text,
                                validationType: ValidationType.none,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              flex: 2,
                              child: _buildFileUploadButton(
                                title: "Upload File",
                                file: additionalDocuments[index].file,
                                onTap: () async {
                                  File? file = await pickAdditionalDocument();
                                  if (file != null) {
                                    setState(() {
                                      additionalDocuments[index].file = file;
                                    });
                                  }
                                },
                                icon: Icons.attach_file,
                              ),
                            ),
                            IconButton(alignment: Alignment.bottomCenter,
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () => removeAdditionalDocument(index),
                            ),
                          ],
                        ),
                      );
                    }),

                    // Empty state
                    if (additionalDocuments.isEmpty)
                      Center(
                        child: Column(
                          children: [
                            Icon(Icons.description, size: 50, color: Colors.grey[400]),
                            const SizedBox(height: 10),
                            Text(
                              "No documents added yet",
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 5),
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

                    const SizedBox(height: 10),

                    // Add Document Button
                    ElevatedButton.icon(
                      onPressed: addAdditionalDocument,
                      icon: const Icon(Icons.add),
                      label: const Text("Add Document"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey[300],
                        foregroundColor: Colors.black,
                        minimumSize: const Size(double.infinity, 45),
                      ),
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 20),

                // Submit Button
                Consumer<VendorModuleApiProvider>(
                  builder: (context, vendorProvider, child) {
                    return Padding(
                      padding: ResponsiveHelper.paddingSymmetric(
                        context,
                        horizontal: 10.0,
                      ),
                      child: CustomButton(
                        color: AppColors.primary,
                        text: 'Add Vendor',
                        isLoading: vendorProvider.isLoading, // NEW
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            handleSubmit();
                          }
                        },
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

  // ==================== UI HELPER METHODS ====================

  /// Build Section Container
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
          vertical: 10.0,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  color: AppColors.primary,
                  size: 20,
                ),
                const SizedBox(width: 8),
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

  /// Build File Upload Button
  Widget _buildFileUploadButton({
    required String title,
    required File? file,
    required VoidCallback onTap,
    IconData icon = Icons.upload_file,
  }) {
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
        const SizedBox(height: 4),
        InkWell(
          onTap: onTap,
          child: Container(
            padding: ResponsiveHelper.paddingAll(context,11),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey,width: 1),
              borderRadius: BorderRadius.circular(8),
              color: file != null ? Colors.green[50] : Colors.grey[50],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  file != null ? Icons.check_circle : icon,
                  color: file != null ? Colors.green : AppColors.primary,
                  size: ResponsiveHelper.iconSize(context, 18),
                ),
                ResponsiveHelper.sizedBoxWidth(context,  8),
                Expanded(
                  child: Text(
                    file != null ? file.path.split('/').last : "Choose file",
                    style: AppTextStyles.heading2(
                      context,
                      overrideStyle: TextStyle(
                        color: file != null ? Colors.green : Colors.grey[600],
                        fontSize: ResponsiveHelper.fontSize(context, 12)
                      ),
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

// ==================== ADDITIONAL DOCUMENT MODEL ====================

class AdditionalDocument {
  TextEditingController titleController;
  File? file;

  AdditionalDocument({
    required this.titleController,
    this.file,
  });
}