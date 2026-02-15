import 'dart:io';
import 'package:dio/dio.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_assigned_lead_model.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:mime/mime.dart';
import 'package:provider/provider.dart';

import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/controller/sales_emp_client_briefing_controller.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';

import '../../../../../ui_helper/app_colors.dart';
import '../../../../../utils/custom_buttons_utils.dart';
import '../../../../../utils/custom_text_field_utils.dart';
import '../../../../../utils/default_common_app_bar.dart';
import '../../../../../utils/form_validations_utils.dart';
// import 'package:dss_crm/sales_module/sales_hod/lead/model/sales_hod_lead_list_model.dart'
//     as leadModel;

import '../../../../ui_helper/app_text_styles.dart';
import 'camera_utils.dart';

class SalesEmpClientBriefingFormScreen extends StatefulWidget {
  final Result leadData;
  final bool isReassign;

  const SalesEmpClientBriefingFormScreen({
    super.key,
    required this.leadData,
    this.isReassign = false,
  });

  @override
  State<SalesEmpClientBriefingFormScreen> createState() =>
      _SalesEmpClientBriefingFormScreenState();
}

class _SalesEmpClientBriefingFormScreenState
    extends State<SalesEmpClientBriefingFormScreen> {
  // GlobalKeys for form validation for each step
  final _step1FormKey = GlobalKey<FormState>();
  final _step2FormKey = GlobalKey<FormState>();

  // Harmonized Text Controllers based on UI fields and leadModel mapping
  final TextEditingController _clientNameController = TextEditingController();
  final TextEditingController _clientAddressController =
      TextEditingController();
  final TextEditingController _concernPersonPhoneController =
      TextEditingController();
  final TextEditingController _concernPersonAltPhoneController =
      TextEditingController();
  final TextEditingController _concernPersonNameController =
      TextEditingController();
  final TextEditingController _concernPersonDesignationController =
      TextEditingController();
  final TextEditingController _companyNameController = TextEditingController();
  final TextEditingController _projectNameController = TextEditingController();
  final TextEditingController _productNameController = TextEditingController();
  final TextEditingController _clientProfileController =
      TextEditingController(); // Maps to remark
  final TextEditingController _clientRequirementController =
      TextEditingController(); // Maps to remark
  final TextEditingController _clientBehaviourController =
      TextEditingController();
  final TextEditingController _discussionDoneController =
      TextEditingController();
  final TextEditingController _instructionRecceController =
      TextEditingController();
  final TextEditingController _instructionDesignController =
      TextEditingController();
  final TextEditingController _instructionInstallationController =
      TextEditingController();
  final TextEditingController _instructionOtherController =
      TextEditingController();

  List<File> _pickedFiles = [];
  final int _maxFiles = 10; // Define the maximum number of files

  String leadId = ""; // Will be populated dynamically from leadData

  int _currentStep = 0; // 0 for Step 1, 1 for Step 2

  @override
  void initState() {
    super.initState();
    // Populate text controllers with data from widget.leadData
    _clientNameController.text = widget.leadData.concernPersonName ?? widget.leadData.contactPerson ?? '';
    _clientAddressController.text = widget.leadData.address ?? '';
    _concernPersonPhoneController.text = widget.leadData.phone ?? '';
    _concernPersonAltPhoneController.text = widget.leadData.altPhone ?? '';
    _concernPersonNameController.text = widget.leadData.concernPersonName ?? '';
    _companyNameController.text = widget.leadData.companyName ?? '';
    _clientRequirementController.text =
        widget.leadData.requirement ??
        ''; // Using 'requirement' for Product Name
    _clientBehaviourController.text =
        widget.leadData.clientRatingInBusiness ??
        ''; // Using 'clientRatingInBusiness' for Client Behaviour
    // _discussionDoneController.text = widget.leadData.notes ?? ''; // Using 'notes' for Discussion Done

    // Set leadId from leadData
    leadId = widget.leadData.sId ?? '';
  }

  @override
  void dispose() {
    _clientNameController.dispose();
    _clientAddressController.dispose();
    _concernPersonPhoneController.dispose();
    _concernPersonAltPhoneController.dispose();
    _concernPersonDesignationController.dispose();
    _companyNameController.dispose();
    _projectNameController.dispose();
    _productNameController.dispose();
    _clientProfileController.dispose();
    _clientBehaviourController.dispose();
    _discussionDoneController.dispose();
    _instructionRecceController.dispose();
    _instructionDesignController.dispose();
    _instructionInstallationController.dispose();
    _instructionOtherController.dispose();
    super.dispose();
  }

  Future<void> _pickDocuments() async {
    try {
      // Calculate how many more files can be added
      final int remainingSlots = _maxFiles - _pickedFiles.length;

      if (remainingSlots <= 0) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('You can select a maximum of $_maxFiles documents.'),
          ),
        );
        return;
      }

      final result = await FilePicker.platform.pickFiles(
        allowMultiple: true,
        type: FileType.custom,
        // allowedExtensions: ['pdf', 'jpg', 'png', 'jpeg'],
        allowedExtensions: [
          // 'pdf',
          'jpg',
          'png',
          'jpeg',
          'mp4', // Video
          'mp3', // Audio
          'doc', // Document
          'docx', // Document
          'txt', // Document
        ],
      );
      if (result != null && result.files.isNotEmpty) {
        setState(() {
          // _pickedFiles.clear(); // Clear previous selections
          for (var platformFile in result.files) {
            if (platformFile.path != null) {
              _pickedFiles.add(File(platformFile.path!));
            }
          }
        });
      }
    } catch (e) {
      debugPrint("Error picking documents: $e");
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Failed to pick documents')));
    }
  }

  // New method to show bottom sheet for file source selection
  void _showFileSourceSelectionSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      backgroundColor: Colors.white,
      builder: (BuildContext bc) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              // Top grey drag handle
              Container(
                width: ResponsiveHelper.containerWidth(context, 30),
                height: 5,
                margin: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

              // const Divider(height: 1),
              ListTile(
                leading: Icon(Icons.upload_file, color: AppColors.blueColor),
                title: Text(
                  'Upload from Device',
                  style: AppTextStyles.body1(context).copyWith(fontSize: 12),
                ),
                onTap: () {
                  Navigator.pop(bc);
                  _pickDocuments();
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt, color: Colors.orange),
                title: Text(
                  'Capture (Photo/Video)',
                  style: AppTextStyles.body1(context).copyWith(fontSize: 12),
                ),
                onTap: () {
                  Navigator.pop(bc);
                  _showCameraOptionsSheet();
                  debugPrint(
                    "Capture from Camera selected. Camera functionality not implemented.",
                  );
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Camera functionality not yet implemented'),
                    ),
                  );
                },
              ),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  // New method to show camera options (photo/video)
  void _showCameraOptionsSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      backgroundColor: Colors.white,
      builder: (BuildContext bc) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Container(
                width: ResponsiveHelper.containerWidth(context, 30),
                height: 5,
                margin: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

              ListTile(
                leading: Icon(Icons.photo_camera, color: AppColors.blueColor),
                title: Text(
                  'Take Photo',
                  style: AppTextStyles.body1(context).copyWith(fontSize: 12),
                ),
                onTap: () async {
                  Navigator.pop(bc); // Dismiss the bottom sheet
                  // Check if adding another file would exceed the limit
                  if (_pickedFiles.length >= _maxFiles) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'You can select a maximum of $_maxFiles documents.',
                        ),
                      ),
                    );
                    return;
                  }
                  final File? capturedFile =
                      await CameraCaptureUtils.captureImage();
                  if (capturedFile != null) {
                    setState(() {
                      _pickedFiles.add(capturedFile);
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Photo captured and added!'),
                      ),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Failed to capture photo.')),
                    );
                  }
                },
              ),
              ListTile(
                leading: Icon(Icons.videocam, color: AppColors.orangeColor),
                title: Text(
                  'Record Video (Max 15s)',
                  style: AppTextStyles.body1(context).copyWith(fontSize: 12),
                ),

                onTap: () async {
                  Navigator.pop(bc); // Dismiss the bottom sheet
                  // Check if adding another file would exceed the limit
                  if (_pickedFiles.length >= _maxFiles) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'You can select a maximum of $_maxFiles documents.',
                        ),
                      ),
                    );
                    return;
                  }
                  final File? capturedFile =
                      await CameraCaptureUtils.captureVideo();
                  if (capturedFile != null) {
                    setState(() {
                      _pickedFiles.add(capturedFile);
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Video captured and added!'),
                      ),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Failed to capture video.')),
                    );
                  }
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFilePreview(File file) {
    final fileName = file.path.split('/').last;
    final fileExtension = fileName.split('.').last.toLowerCase();

    final isImage = ['jpg', 'jpeg', 'png'].contains(fileExtension);
    // final isPdf = fileExtension == 'pdf';
    final isVideo = ['mp4', 'mov', 'avi'].contains(fileExtension);
    final isAudio = ['mp3', 'wav'].contains(fileExtension);

    // Use FutureBuilder to asynchronously get the file size
    return FutureBuilder<int>(
      future: file.length(),
      builder: (BuildContext context, AsyncSnapshot<int> snapshot) {
        String fileSizeText = '...'; // Placeholder while loading
        if (snapshot.connectionState == ConnectionState.done &&
            snapshot.hasData) {
          final double fileSizeInMB = snapshot.data! / (1024 * 1024);
          fileSizeText = '${fileSizeInMB.toStringAsFixed(2)} MB';
        } else if (snapshot.hasError) {
          fileSizeText = 'Error';
        }

        return SizedBox(
          // Fixed width for each preview item in the horizontal list
          // width: ResponsiveHelper.containerWidth(context, 200), // Adjusted width for better horizontal layout
          child: Card(
            elevation: 0,
            color: Colors.white,
            margin: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 4.0),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8.0),
            ),
            child:
            // Stack(
            //   // Use Stack to position the close button
            //   children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    // Changed from Column to Row for horizontal layout within the card
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Fixed size container for icon/image
                      Container(
                        height: ResponsiveHelper.containerWidth(context, 50),
                        // Smaller icon size for horizontal row
                        width: ResponsiveHelper.containerWidth(context, 50),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8.0),
                          border: Border.all(
                            color: AppColors.txtGreyColor,
                            width: 0.5,
                          ),
                        ),
                        clipBehavior: Clip.hardEdge,
                        child: isImage
                            ? Padding(
                                padding: ResponsiveHelper.paddingAll(
                                  context,
                                  2,
                                ),
                                child: ClipRRect(
                                  // Clip image to rounded corners
                                  borderRadius: BorderRadius.circular(4.0),
                                  child: Image.file(file, fit: BoxFit.cover),
                                ),
                              )
                            : Icon(
                                // isPdf ? Icons.picture_as_pdf :
                                isVideo
                                    ? Icons.videocam
                                    : isAudio
                                    ? Icons.audiotrack
                                    : Icons.insert_drive_file,
                                size: ResponsiveHelper.containerWidth(
                                  context,
                                  30,
                                ),
                                // Adjusted icon size
                                color: AppColors.orangeColor,
                                // color: isPdf ? AppColors.orangeColor : isVideo ? AppColors.orangeColor : AppColors.primary,
                              ),
                      ),
                      const SizedBox(width: 8), // Space between icon and text
                      Expanded(
                        // Expanded to take remaining horizontal space for text
                        child: Column(
                          // Column for file name and size, stacked vertically
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "${fileName}",
                              // style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                              style: AppTextStyles.caption(context).copyWith(
                                fontWeight: FontWeight.w600,
                                fontSize: 12,
                              ),
                              overflow: TextOverflow.ellipsis,
                              maxLines:
                                  2, // Ensure filename doesn't wrap too much
                            ),
                            Text(
                              fileSizeText,
                              style: AppTextStyles.caption(
                                context,
                              ).copyWith(fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      // Move IconButton directly into the Row
                      IconButton(
                        icon: const Icon(Icons.close, size: 18,color: Colors.red,),
                        onPressed: () {
                          setState(() {
                            _pickedFiles.remove(file);
                          });
                        },
                        padding: EdgeInsets.zero, // Remove default padding
                        constraints: const BoxConstraints(), // Remove default constraints
                      ),
                    ],
                  ),
                ),
                // Positioned(
                //   // Position the close button
                //   top: 0,
                //   right: 0,
                //   child: IconButton(
                //     icon: const Icon(Icons.close, size: 18),
                //     onPressed: () {
                //       setState(() {
                //         _pickedFiles.remove(file);
                //       });
                //     },
                //     padding: EdgeInsets.zero, // Remove default padding
                //     constraints:
                //         const BoxConstraints(), // Remove default constraints
                //   ),
                // ),
            //   ],
            // ),
          ),
        );
      },
    );

    // return Padding(
    //   padding: const EdgeInsets.symmetric(vertical: 4.0),
    //   child: Row(
    //     children: [
    //       if (isImage)
    //         Container(
    //           width: ResponsiveHelper.containerWidth(context, 50),
    //           height: ResponsiveHelper.containerWidth(context, 50),
    //           decoration: BoxDecoration(
    //             borderRadius: BorderRadius.circular(8.0),
    //             border: Border.all(color: AppColors.primary),
    //           ),
    //           padding: const EdgeInsets.all(4.0),
    //           child: ClipRRect(
    //             borderRadius: BorderRadius.circular(4.0),
    //             child: Image.file(
    //               file,
    //               fit: BoxFit.cover,
    //             ),
    //           ),
    //         )
    //       else if (isPdf)
    //         Container(
    //           width: ResponsiveHelper.containerWidth(context, 50),
    //           height: ResponsiveHelper.containerWidth(context, 50),
    //           decoration: BoxDecoration(
    //             borderRadius: BorderRadius.circular(8.0),
    //             border: Border.all(color: AppColors.primary),
    //           ),
    //           padding: const EdgeInsets.all(4.0),
    //           child: Center(
    //             child: Icon(
    //               Icons.picture_as_pdf,
    //               size: 30,
    //               color: AppColors.orangeColor,
    //             ),
    //           ),
    //         )
    //       else
    //         Container(
    //           width: ResponsiveHelper.containerWidth(context, 50),
    //           height: ResponsiveHelper.containerWidth(context, 50),
    //           decoration: BoxDecoration(
    //             borderRadius: BorderRadius.circular(8.0),
    //             border: Border.all(color: AppColors.primary),
    //           ),
    //           padding: const EdgeInsets.all(4.0),
    //           child: const Center(
    //             child: Icon(
    //               Icons.insert_drive_file,
    //               size: 30,
    //               color: AppColors.primary,
    //             ),
    //           ),
    //         ),
    //       const SizedBox(width: 8),
    //       Expanded(
    //         child: Text(
    //           fileName,
    //           style: const TextStyle(fontSize: 14),
    //           overflow: TextOverflow.ellipsis,
    //         ),
    //       ),
    //       IconButton(
    //         icon: const Icon(Icons.close, size: 18),
    //         onPressed: () {
    //           setState(() {
    //             _pickedFiles.remove(file);
    //           });
    //         },
    //       ),
    //     ],
    //   ),
    // );
  }

  Future<void> _handleSubmit() async {
    // Validate the final step before submitting
    if (!_step2FormKey.currentState!.validate()) {
      return;
    }

    final provider = context.read<SalesEmpClientBriefingApiProvider>();
    try {
      final documentList = <MultipartFile>[];
      for (final file in _pickedFiles) {
        // Use lookupMimeType to get the correct MIME type
        final String? mimeType = lookupMimeType(file.path);
        documentList.add(
          await MultipartFile.fromFile(
            file.path,
            filename: file.path.split('/').last,
            contentType: mimeType != null
                ? DioMediaType.parse(mimeType)
                : null, // Provide content type
          ),
        );
        // documentList.add(await MultipartFile.fromFile(file.path, filename: file.path.split('/').last));
      }
      final userid = await StorageHelper().getLoginUserId();

      final formData = FormData.fromMap({
        "leadId": leadId,
        "userId": userid,
        "clientName": _clientNameController.text.trim(),
        "companyName": _companyNameController.text.trim(),
        "address": _clientAddressController.text.trim(),
        "projectName": _projectNameController.text.trim(),
        "productName": _productNameController.text.trim(),
        "requirement": _clientRequirementController.text.trim(),
        "clientProfile": _clientProfileController.text.trim(),
        "clientBehaviour": _clientBehaviourController.text.trim(),
        "discussionDone": _discussionDoneController.text.trim(),
        "instructionRecce": _instructionRecceController.text.trim(),
        "instructionDesign": _instructionDesignController.text.trim(),
        "instructionInstallation": _instructionInstallationController.text.trim(),
        "instructionOther": _instructionOtherController.text.trim(),
        "documentUpload": documentList,
      });

      // --- Start: Print form data to log ---
      debugPrint("--- Form Data for Submission ---");
      debugPrint("Lead ID: $leadId");
      debugPrint("Client Name: ${_clientNameController.text.trim()}");
      debugPrint("Company Name: ${_companyNameController.text.trim()}");
      debugPrint("Project Name: ${_projectNameController.text.trim()}");
      debugPrint("Product Name: ${_productNameController.text.trim()}");
      debugPrint("Client Profile: ${_clientProfileController.text.trim()}");
      debugPrint("Client Behaviour: ${_clientBehaviourController.text.trim()}");
      debugPrint("Discussion Done: ${_discussionDoneController.text.trim()}");
      debugPrint(
        "Instruction (Recce): ${_instructionRecceController.text.trim()}",
      );
      debugPrint(
        "Instruction (Design): ${_instructionDesignController.text.trim()}",
      );
      debugPrint(
        "Instruction (Installation): ${_instructionInstallationController.text.trim()}",
      );
      debugPrint(
        "Instruction (Other): ${_instructionOtherController.text.trim()}",
      );
      debugPrint("Instruction (Other): ${documentList.toString()}");

      if (_pickedFiles.isNotEmpty) {
        debugPrint("--- Picked Documents ---");
        for (var file in _pickedFiles) {
          debugPrint("File: ${file.path.split('/').last} (Path: ${file.path})");
        }
      } else {
        debugPrint("No documents picked.");
      }
      debugPrint("----------------------------");
      // --- End: Print form data to log ---

      await provider.addSalesEmpClientBriefing(context, formData);
    } catch (e) {
      debugPrint("Submit Error: $e");
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Failed to submit form')));
    }
  }

  void _nextStep() {
    if (_currentStep == 0) {
      if (_step1FormKey.currentState!.validate()) {
        setState(() {
          _currentStep = 1;
        });
      }
    }
    // No else block here, as _handleSubmit will be called directly from Step 2
  }

  void _previousStep() {
    setState(() {
      _currentStep = 0;
    });
  }

  Widget _buildStep1Form() {
    return Form(
      key: _step1FormKey,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildTextField(
              "Client Name",
              _clientNameController,
              isRequired: true,
            ),
            // _buildTextField(
            //   "Concern Person Number",
            //   _concernPersonPhoneController,
            //   readOnly: true,
            // ),
            // _buildTextField(
            //   "Concern Person Alt/Whatsapp Number",
            //   _concernPersonAltPhoneController,
            //   readOnly: true,
            // ),
            // _buildTextField(
            //   "Concern Person Name",
            //   _concernPersonNameController,
            //   readOnly: true,
            // ),
            // _buildTextField(
            //   "Concern Person Designation",
            //   _concernPersonDesignationController,
            //   isRequired: true,
            // ),
            _buildTextField("Company Name", _companyNameController),
            _buildTextField(
              "Client Full Address",
              _clientAddressController,
              isRequired: true,
              lines: 2,
            ),
            _buildTextField(
              "Project Name",
              _projectNameController,
              isRequired: true,
            ),
            _buildTextField("Product Name", _productNameController),
            _buildTextField("Client Profile", _clientProfileController),
            _buildTextField(
              "Client Behaviour",
              _clientBehaviourController,
              lines: 2,
              isRequired: true,
            ),
            _buildTextField(
              "Client Requirement",
              _clientRequirementController,
              lines: 2,
              isRequired: true,
            ),
            const SizedBox(height: 20),
            CustomButton(
              color: AppColors.primary,
              text: "Next",
              onPressed: _nextStep,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStep2Form() {
    final isLoading = context
        .watch<SalesEmpClientBriefingApiProvider>()
        .isLoading;

    return Form(
      key: _step2FormKey,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildTextField(
              "Discussion Done",
              _discussionDoneController,
              lines: 2,
              isRequired: true,
            ),
            _buildTextField("Instruction (Recce)", _instructionRecceController),
            _buildTextField(
              "Instruction (Design)",
              _instructionDesignController,
            ),
            _buildTextField(
              "Instruction (Installation)",
              _instructionInstallationController,
            ),
            _buildTextField("Instruction (Other)", _instructionOtherController),

            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8.0),
              ),
              padding: const EdgeInsets.symmetric(
                horizontal: 12.0,
                vertical: 8.0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _pickedFiles.isEmpty
                        ? "No documents selected"
                        : "${_pickedFiles.length} document(s) selected",
                    style: AppTextStyles.caption(
                      context,
                    ).copyWith(fontSize: 12),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    onPressed: _showFileSourceSelectionSheet,
                    // onPressed: _pickDocuments,
                    icon: const Icon(Icons.upload_file),
                    label: const Text("Browse"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.orangeColor,
                      // Changed to primary for consistency
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4.0),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 4),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                "  Max file size: Image - 2MB, Video - 5MB",
                style: AppTextStyles.caption(
                  context,
                ).copyWith(color: Colors.red, fontSize: 12),
              ),
            ),
            if (_pickedFiles.isNotEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: _pickedFiles
                      .map((f) => _buildFilePreview(f))
                      .toList(),
                ),
              ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: CustomButton(
                    color: Colors.grey, // Back button color
                    text: "Back",
                    onPressed: _previousStep,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: CustomButton(
                    color: AppColors.primary,
                    text: isLoading ? 'Submitting...' : 'Submit',
                    onPressed: _handleSubmit,
                  ),
                ),

                // CustomButton(
                //   color: Colors.black,
                //   disabledColor: Colors.black,
                //   text: authProvider.isLoading ? 'Logging in...' : 'Login',
                //   onPressed: _handleSubmit
                // ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "Client Briefing (Step ${_currentStep + 1} of 2)",
        backgroundColor: AppColors.primary,
      ),
      body: IndexedStack(
        index: _currentStep,
        children: [_buildStep1Form(), _buildStep2Form()],
      ),
    );
  }

  Widget _buildTextField(
    String title,
    TextEditingController controller, {
    int? lines,
    bool? readOnly,
    bool isRequired = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 0),
      child: CustomTextField(
        title: title,
        hintText: "Enter $title",
        controller: controller,
        maxLines: lines ?? 1,
        readOnly: readOnly ?? false,
        validator: isRequired
            ? (value) => FormValidatorUtils.validateRequired(
                value?.trim(),
                fieldName: title,
              )
            : null,
      ),
    );
  }
}
