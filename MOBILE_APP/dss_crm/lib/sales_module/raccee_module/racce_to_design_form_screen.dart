import 'dart:io';

import 'package:dio/dio.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:easy_stepper/easy_stepper.dart';
import 'package:mime/mime.dart';
import '../../ui_helper/app_colors.dart';
import '../../ui_helper/app_text_styles.dart';
import '../../utils/custom_buttons_utils.dart';
import '../../utils/custom_text_field_utils.dart';
import '../../utils/default_common_app_bar.dart';
import '../../utils/responsive_dropdown_utils.dart';
import '../sales_employee/sales_client_breifing/screen/camera_utils.dart';

class RecceToDesignFormScreen extends StatefulWidget {
  @override
  _RecceToDesignFormScreenState createState() =>
      _RecceToDesignFormScreenState();
}

class _RecceToDesignFormScreenState extends State<RecceToDesignFormScreen> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();

  // New state variable to hold the selected unit
  String _selectedUnit = 'Inch';

  // bool _isLoading = false; // Add a loading state

  final Map<String, TextEditingController> _controllers = {
    "clientName": TextEditingController(),
    "clientCode": TextEditingController(),
    "projectName": TextEditingController(),
    "projectCode": TextEditingController(),
    "productName": TextEditingController(),
    "productCode": TextEditingController(),
    "height": TextEditingController(),
    "width": TextEditingController(),
    "thickness": TextEditingController(),
    "unit": TextEditingController(),
    "imagesFile": TextEditingController(),
    "quantity": TextEditingController(),
    "connectionPoint": TextEditingController(),
    "mounting": TextEditingController(),
    "fabricationWork": TextEditingController(),
    "scaffolding": TextEditingController(),
    "civilWork": TextEditingController(),
    "clientInstruction": TextEditingController(),
    "clientInstructionData": TextEditingController(),
    "recceInstruction": TextEditingController(),
    "recceInstructionData": TextEditingController(),
    "layer": TextEditingController(),
    "heightFromRoad": TextEditingController(),
    "distanceOfView": TextEditingController(),
    "color": TextEditingController(),
    "shape": TextEditingController(),
  };

  bool isLit = false;
  bool isNonLit = false;
  bool oneSide = false;
  bool twoSide = false;

  List<File> _pickedFiles = [];
  final int _maxFiles = 10; // Define the maximum number of files

  @override
  void dispose() {
    _controllers.forEach((key, controller) => controller.dispose());
    super.dispose();
  }

  // Define the content for each step separately
  List<Widget> getStepContent() {
    return [
      Column(
        children: [
          _buildTextField("Client Name", "clientName"),
          _buildTextField("Client Code", "clientCode"),
          _buildTextField("Project Name", "projectName"),
          _buildTextField("Project Code", "projectCode"),
          _buildTextField("Product Name", "productName"),
          _buildTextField("Product Code", "productCode"),
          Row(
            children: [
              Expanded(child: _buildTextField("Size [Height]", "height")),
              SizedBox(width: 10),
              _buildUnitDropdown(),
            ],
          ),
          SizedBox(height: 10),
          Row(
            children: [
              Expanded(child: _buildTextField("Size [Width]", "width")),
              SizedBox(width: 10),
              _buildUnitDropdown(),
            ],
          ),
          SizedBox(height: 10),
          Row(
            children: [
              Expanded(child: _buildTextField("Size [Thickness]", "thickness")),
              SizedBox(width: 10),
              _buildUnitDropdown(),
            ],
          ),
        ],
      ),
      Column(
        children: [
          _buildTextField("Quantity", "quantity"),
          SizedBox(height: 12),
          Text("Lit / Non-Lit", style: AppTextStyles.body1(context)),
          CheckboxListTile(
            title: Text("Lit"),
            value: isLit,
            activeColor: AppColors.orangeColor,
            checkColor: AppColors.whiteColor,
            onChanged: (val) {
              if (val != null) {
                setState(() {
                  isLit = val;
                  if (val) isNonLit = false;
                });
              }
            },
          ),
          CheckboxListTile(
            title: Text("Non-Lit"),
            value: isNonLit,
            activeColor: AppColors.orangeColor,
            checkColor: AppColors.whiteColor,
            onChanged: (val) {
              if (val != null) {
                setState(() {
                  isNonLit = val;
                  if (val) isLit = false;
                });
              }
            },
          ),
          if (isLit) _buildTextField("Connection Point", "connectionPoint"),

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

        ],
      ),
      Column(
        children: [
          _buildTextField("Mounting/Hanging with Description", "mounting"),
          Text("Visibility Needs", style: AppTextStyles.body1(context)),
          CheckboxListTile(
            title: Text("One Side"),
            value: oneSide,
            activeColor: AppColors.orangeColor,
            checkColor: AppColors.whiteColor,
            onChanged: (val) => setState(() => oneSide = val ?? false),
          ),
          CheckboxListTile(
            title: Text("Two Side"),
            value: twoSide,
            activeColor: AppColors.orangeColor,
            checkColor: AppColors.whiteColor,
            onChanged: (val) => setState(() => twoSide = val ?? false),
          ),
          _buildTextField("Fabrication Work", "fabricationWork"),
          _buildTextField("Scaffolding", "scaffolding"),
          _buildTextField("Civil Work", "civilWork"),
        ],
      ),
      Column(
        children: [
          _buildTextField("Client Instruction", "clientInstruction"),
          _buildTextField(
            "Client Instruction with Data Upload",
            "clientInstructionData",
          ),
          _buildTextField("Recce Person Instruction", "recceInstruction"),
          _buildTextField(
            "Recce Instruction with Data Upload",
            "recceInstructionData",
          ),
        ],
      ),
      Column(
        children: [
          _buildTextField("Layer (2D/3D)", "layer"),
          _buildTextField("Height from Road", "heightFromRoad"),
          _buildTextField("Distance of View", "distanceOfView"),
          _buildTextField("Color", "color"),
          _buildTextField("Shape", "shape"),
        ],
      ),
    ];
  }

  void _onStepContinue() {
    if (_currentStep < getStepContent().length - 1) {
      if (_formKey.currentState!.validate()) {
        setState(() {
          _currentStep += 1; // Move to the next step immediately
        });
      }
    } else {
      _submitForm();
    }
  }

  void _onStepCancel() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep -= 1;
      });
    }
  }

  Widget _buildUnitDropdown() {
    return Expanded(
      child: Container(
        // height: 100,
        // width: 100,
        child: ResponsiveDropdown<String>(
          label: 'Unit',
          hint: 'Select Unit',
          value: _selectedUnit,
          itemList: ['Inch', 'Meter', 'Cm', 'Feet'],
          onChanged: (String? newValue) {
            if (newValue != null) {
              setState(() {
                _selectedUnit = newValue;
              });
            }
          },
        ),
      ),
    );
  }

  Widget _buildTextField(String label, String key) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2.0),
      child: CustomTextField(
        title: label,
        hintText: label,
        controller: _controllers[key]!,
        keyboardType: TextInputType.text,
      ),
    );
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
                        icon: const Icon(
                          Icons.close,
                          size: 18,
                          color: Colors.red,
                        ),
                        onPressed: () {
                          setState(() {
                            _pickedFiles.remove(file);
                          });
                        },
                        padding: EdgeInsets.zero, // Remove default padding
                        constraints:
                            const BoxConstraints(), // Remove default constraints
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

  void _submitForm() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please fill all required fields.")),
      );
      return;
    }
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
    } catch (e) {}

    // No longer need to set _isLoading = true or use Future.delayed
    for (var entry in _controllers.entries) {
      debugPrint('${entry.key}: ${entry.value.text}');
    }
    debugPrint('Lit: $isLit, Non-Lit: $isNonLit');
    debugPrint('Visibility: One Side: $oneSide, Two Side: $twoSide');

    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text("Form Submitted Successfully")));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "Recce to Design Checklist",
        backgroundColor: AppColors.primary,
      ),
      body: Form(
        key: _formKey,
        child: Column(
          children: [
            SizedBox(
              height: ResponsiveHelper.containerHeight(context, 100),
              child: EasyStepper(
                activeStep: _currentStep,
                finishedStepBackgroundColor: Colors.transparent,
                finishedStepBorderColor: Colors.transparent,
                onStepReached: (index) => setState(() => _currentStep = index),
                steps: [
                  EasyStep(
                    customStep: _buildCustomStep(0, Icons.info),
                    title: 'Basic',
                  ),
                  EasyStep(
                    customStep: _buildCustomStep(1, Icons.add_box),
                    title: 'Additional',
                  ),
                  EasyStep(
                    customStep: _buildCustomStep(2, Icons.fence),
                    title: 'Mounting',
                  ),
                  EasyStep(
                    customStep: _buildCustomStep(3, Icons.edit_note),
                    title: 'Instructions',
                  ),
                  EasyStep(
                    customStep: _buildCustomStep(4, Icons.check_circle),
                    title: 'Final',
                  ),
                ],
                // Remove conflicting styling to allow customStep to work correctly
                // finishedStepBackgroundColor: Colors.transparent,
                // finishedStepBorderColor: Colors.transparent,
                showLoadingAnimation: false,
                // Disables built-in loader
                unreachedStepBorderColor: Colors.grey,
                unreachedStepBackgroundColor: Colors.white,
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: ResponsiveHelper.paddingSymmetric(
                  context,
                  horizontal: 15,
                ),
                child: getStepContent()[_currentStep],
              ),
            ),
            Padding(
              // padding: const EdgeInsets.all(16.0),
              padding: ResponsiveHelper.paddingAll(context, 15),
              child: Row(
                children: [
                  if (_currentStep > 0)
                    Expanded(
                      child: CustomButton(
                        text: "Back",
                        color: Colors.grey.shade600,
                        onPressed: _onStepCancel,
                      ),
                    ),
                  SizedBox(width: _currentStep > 0 ? 10 : 0),
                  Expanded(
                    child: CustomButton(
                      text: _currentStep == getStepContent().length - 1
                          ? "Finish"
                          : "Next",
                      color: Colors.black,
                      onPressed: _onStepContinue,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomStep(int stepIndex, IconData iconData) {
    bool isActive = stepIndex == _currentStep;
    bool isFinished = stepIndex < _currentStep;

    return CircleAvatar(
      backgroundColor: isFinished
          ? Colors.green
          : isActive
          ? AppColors.orangeColor
          : Colors.grey,
      child: Icon(iconData, color: Colors.white),
    );
  }
}
