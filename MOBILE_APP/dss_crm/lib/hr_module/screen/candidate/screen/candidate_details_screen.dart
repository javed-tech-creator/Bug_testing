import 'dart:io';

import 'package:dss_crm/hr_module/screen/candidate/model/candidate_detail_model.dart';
import 'package:dss_crm/hr_module/screen/job_opening/schedule_job_interview_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart' show DateFormat;
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:file_picker/file_picker.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
import '../../../controller/hr_employee_api_provider.dart';

class CandidateDetailScreen extends StatefulWidget {
  final String candidateId;

  const CandidateDetailScreen({
    Key? key,
    required this.candidateId,
  }) : super(key: key);

  @override
  State<CandidateDetailScreen> createState() => _CandidateDetailScreenState();
}

class _CandidateDetailScreenState extends State<CandidateDetailScreen> {
  bool _dataUpdated = false; // Track if any data was updated
// ADD THESE TWO LINES
  String? _selectedFileName;
  File? _selectedFile;

  @override
  void initState() {
    super.initState();
    _fetchCandidateDetails();
  }

  Future<void> _fetchCandidateDetails() async {
    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    await provider.getCandidateDetails(context, widget.candidateId);
  }

  void _showStatusUpdateBottomSheet(
      BuildContext context,
      HREmployeeApiProvider provider,
      String candidateId,
      String candidateStatus) {
    String? selectedStatus = candidateStatus;
    final reasonCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.whiteColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 10,
          right: 10,
          top: 4,
        ),
        child: SingleChildScrollView(
          child: Container(
            decoration: const BoxDecoration(
              color: Color(0xFFFAFAFA),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: StatefulBuilder(
              builder: (statefulContext, setState) => Padding(
                padding: const EdgeInsets.only(
                  left: 20,
                  right: 20,
                  top: 16,
                  bottom: 16,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Drag handle
                    Container(
                      width: 36,
                      height: 4,
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),

                    const Text(
                      "Update Candidate Status",
                      style: TextStyle(fontSize: 19, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 24),

                    // Status Dropdown
                    ResponsiveDropdown<String>(
                      label: 'Status',
                      hint: 'Choose status',
                      value: selectedStatus,
                      itemList: const [
                        'Applied',
                        'Shortlisted',
                        'Interviewed',
                        'Selected',
                        'Rejected',
                        'Offered',
                        'Hired',
                      ],
                      onChanged: (v) {
                        setState(() {
                          selectedStatus = v;
                        });
                      },
                    ),
                    const SizedBox(height: 16),

                    // Reason Field
                    CustomTextField(
                      title: "Reason",
                      hintText: "Enter reason for this change",
                      controller: reasonCtrl,
                      maxLines: 3,
                    ),
                    const SizedBox(height: 24),

                    // Update Button
                    Consumer<HREmployeeApiProvider>(
                      builder: (_, providerWatch, __) => SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          onPressed: providerWatch.isLoading
                              ? null
                              : () async {
                            if (selectedStatus == null) return;

                            final Map<String, dynamic> requestBody = {
                              "status": selectedStatus,
                              "remarks": reasonCtrl.text.trim(),
                            };

                            await provider.changeCandidateHiredStatus(context, candidateId, requestBody);
                            if (provider.changeCandidateHiredStatusModelResponse?.success == true) {
                              _dataUpdated = true;
                              await _fetchCandidateDetails();

                              // Bottom sheet band
                              Navigator.pop(context);

                              // Detail screen se list ko signal
                              WidgetsBinding.instance.addPostFrameCallback((_) {
                                if (context.mounted) {
                                  Navigator.of(context).pop(true);
                                }
                              });
                            }
                          },
                          child: providerWatch.isLoading
                              ? Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              SizedBox(
                                width: 18,
                                height: 18,
                                child: LoadingIndicatorUtils(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              ),
                              SizedBox(width: 10),
                              Text(
                                "Updating...",
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          )
                              : const Text(
                            "Update Status",
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _showFileUploadBottomSheet(BuildContext context, String documentType) {
    // Reset previous selection
    _selectedFileName = null;
    _selectedFile = null;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.whiteColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 16,
          right: 16,
          top: 16,
        ),
        child: StatefulBuilder(
          builder: (BuildContext ctx, StateSetter setModalState) {
            return Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Color(0xFFFAFAFA),
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Drag Handle
                  Container(width: 40, height: 4, color: Colors.grey[300]),
                  const SizedBox(height: 16),
                  Text(
                    "Upload $documentType",
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 24),

                  // File Picker Box
                  InkWell(
                    onTap: () async {
                      FilePickerResult? result = await FilePicker.platform.pickFiles(
                        type: FileType.custom,
                        allowedExtensions: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
                      );

                      if (result != null && result.files.single.path != null) {
                        final file = File(result.files.single.path!);
                        final fileSizeInBytes = file.lengthSync();
                        final fileSizeInMB = fileSizeInBytes / (1024 * 1024);

                        if (fileSizeInMB > 1.0) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Row(
                                children: const [
                                  Icon(Icons.warning, color: Colors.white),
                                  SizedBox(width: 8),
                                  Text("File size must be less than 1 MB"),
                                ],
                              ),
                              backgroundColor: Colors.red,
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                          return;
                        }

                        setModalState(() {
                          _selectedFile = file;
                          _selectedFileName = result.files.single.name;
                        });
                      }
                    },
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: _selectedFileName != null ? AppColors.primary : Colors.grey.shade300,
                          width: 2,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            _selectedFileName != null ? Icons.check_circle : Icons.cloud_upload_outlined,
                            size: 56,
                            color: _selectedFileName != null ? AppColors.primary : Colors.grey.shade400,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            _selectedFileName ?? "Tap to select $documentType",
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: _selectedFileName != null ? AppColors.primary : Colors.grey.shade600,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          if (_selectedFileName == null)
                            const Text(
                              "PDF, DOC, DOCX, JPG • Max 1 MB",
                              style: TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // File Preview
                  if (_selectedFileName != null)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.green.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.green.shade300),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.description, color: Colors.green.shade700),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              _selectedFileName!,
                              style: TextStyle(color: Colors.green.shade800, fontWeight: FontWeight.w600),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Text(
                            "${(_selectedFile!.lengthSync() / 1024).toStringAsFixed(1)} KB",
                            style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                          ),
                        ],
                      ),
                    ),

                  const SizedBox(height: 24),

                  // Upload Button
                  Consumer<HREmployeeApiProvider>(
                    builder: (context, provider, child) {
                      return SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: provider.isLoading || _selectedFile == null
                              ? null
                              : () async {
                            // final String type = documentType == "Resume" ? "resume" : "offerLetter";

                            final String urlType = documentType == "Resume" ? "resume" : "offer-letter";
                            final String fieldName = documentType == "Resume" ? "resume" : "offerLatter";

                            await provider.uploadCandidateDocument(
                              context: context,
                              documentFile: _selectedFile!,
                              documentType: urlType,
                              fieldName: fieldName,
                              candidateId: widget.candidateId,
                            );

                            if (context.mounted) {
                              Navigator.pop(context);
                              _dataUpdated = true;
                              await _fetchCandidateDetails();
                            }
                          },
                          child: provider.isLoading
                              ? const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)),
                              SizedBox(width: 12),
                              Text("Uploading...", style: TextStyle(color: Colors.white)),
                            ],
                          )
                              : const Text("Upload File", style: TextStyle(fontSize: 16, color: Colors.white, fontWeight: FontWeight.bold)),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) async {
        print("POP INVOKED: $didPop | DATA UPDATED: $_dataUpdated");
        if (!didPop) {
          Navigator.of(context).pop(_dataUpdated);
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFFAFAFA),
        appBar: DefaultCommonAppBar(
          activityName: "Candidate Details",
          backgroundColor: AppColors.primary,
          actionIcons: [Icons.refresh],
          onActionTap: [
                () => _fetchCandidateDetails(),
          ],
        ),
        body: Consumer<HREmployeeApiProvider>(
          builder: (context, provider, child) {
            if (provider.isLoading) {
              return const Center(
                child: CircularProgressIndicator(strokeWidth: 2.5),
              );
            }

            final candidateData = provider.getCandidateDetailModelResponse?.data?.data;

            if (candidateData == null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.error_outline, size: 48, color: Colors.grey[400]),
                    const SizedBox(height: 12),
                    Text(
                      "Unable to load details",
                      style: TextStyle(color: Colors.grey[600], fontSize: 15),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton.icon(
                      onPressed: _fetchCandidateDetails,
                      icon: const Icon(Icons.refresh),
                      label: const Text("Retry"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                    ),
                  ],
                ),
              );
            }

            return SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Profile Section
                  _buildProfileSection(candidateData),
                  const SizedBox(height: 16),

                  // Action Buttons Section
                  _buildActionButtonsSection(context, provider, candidateData),
                  const SizedBox(height: 16),

                  // Status & Source
                  _buildStatusSection(candidateData),
                  const SizedBox(height: 20),

                  // Contact Information
                  _buildSectionHeader("Contact"),
                  const SizedBox(height: 10),
                  _buildContactInfo(candidateData),
                  const SizedBox(height: 20),

                  // Professional Details
                  _buildSectionHeader("Professional"),
                  const SizedBox(height: 10),
                  _buildProfessionalDetails(candidateData),
                  const SizedBox(height: 20),

                  // Skills
                  _buildSectionHeader("Skills"),
                  const SizedBox(height: 10),
                  _buildSkillsSection(candidateData.skills),
                  const SizedBox(height: 20),

                  // Interview Details
                  if (candidateData.interviewer != null || candidateData.inerviewDate != null) ...[
                    _buildSectionHeader("Interview"),
                    const SizedBox(height: 10),
                    _buildInterviewDetails(candidateData),
                    const SizedBox(height: 20),
                  ],

                  // Feedback
                  if (candidateData.feedback != null && candidateData.feedback!.isNotEmpty) ...[
                    _buildSectionHeader("Feedback"),
                    const SizedBox(height: 10),
                    _buildTextSection(candidateData.feedback!),
                    const SizedBox(height: 20),
                  ],

                  // Remarks
                  if (candidateData.remarks != null && candidateData.remarks!.isNotEmpty) ...[
                    _buildSectionHeader("Remarks"),
                    const SizedBox(height: 10),
                    _buildTextSection(candidateData.remarks!),
                    const SizedBox(height: 20),
                  ],

                  // Documents
                  _buildSectionHeader("Documents"),
                  const SizedBox(height: 10),
                  _buildDocumentsSection(candidateData),
                  const SizedBox(height: 20),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildActionButtonsSection(BuildContext context, HREmployeeApiProvider provider, Data candidateData) {
    return Column(
      children: [
        // Update Status Button
        InkWell(
          onTap: () => _showStatusUpdateBottomSheet(
              context, provider, widget.candidateId, candidateData.status ?? 'Applied'),
          borderRadius: BorderRadius.circular(10),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.primary, width: 1.5),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.sync, size: 16, color: AppColors.primary),
                SizedBox(width: 6),
                Text(
                  "Update Status",
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),

        // Schedule Interview Button (if shortlisted)
        if (candidateData.status?.toLowerCase() == "shortlisted") ...[
          const SizedBox(height: 10),
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ScheduleInterviewScreen(
                      candidateName: candidateData.name ?? 'Candidate'),
                ),
              );
            },
            borderRadius: BorderRadius.circular(10),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF1A1A1A),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.calendar_today, color: Colors.white, size: 16),
                  SizedBox(width: 8),
                  Text(
                    "Schedule Interview",
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],

        const SizedBox(height: 10),

        Row(
          children: [
            Expanded(
              child: InkWell(
                onTap: () => _showFileUploadBottomSheet(context, "Resume"),
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFF10B981), width: 1.5),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.upload_file, size: 16, color: Color(0xFF10B981)),
                      SizedBox(width: 6),
                      Text(
                        "Resume",
                        style: TextStyle(
                          fontSize: 13,
                          color: Color(0xFF10B981),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: InkWell(
                onTap: () => _showFileUploadBottomSheet(context, "Offer Letter"),
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFF8B5CF6), width: 1.5),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.upload_file, size: 16, color: Color(0xFF8B5CF6)),
                      SizedBox(width: 6),
                      Text(
                        "Offer Letter",
                        style: TextStyle(
                          fontSize: 13,
                          color: Color(0xFF8B5CF6),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),


// Schedule Interview Button (always visible, not just for shortlisted)
        const SizedBox(height: 10),
        InkWell(
          onTap: () => _showScheduleInterviewBottomSheet(
            context,
            provider,
            widget.candidateId,
          ),
          borderRadius: BorderRadius.circular(10),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.calendar_today, color: Colors.white, size: 16),
                SizedBox(width: 8),
                Text(
                  "Schedule Interview",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),


      ],
    );
  }

  void _showScheduleInterviewBottomSheet(
      BuildContext context,
      HREmployeeApiProvider provider,
      String candidateId,
      ) {
    final interviewerCtrl = TextEditingController();
    final feedbackCtrl = TextEditingController();
    DateTime? selectedDateTime;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.whiteColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 10,
          right: 10,
          top: 4,
        ),
        child: SingleChildScrollView(
          child: Container(
            decoration: const BoxDecoration(
              color: Color(0xFFFAFAFA),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: StatefulBuilder(
              builder: (statefulContext, setState) => Padding(
                padding: const EdgeInsets.only(
                  left: 20,
                  right: 20,
                  top: 16,
                  bottom: 16,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Drag handle
                    Container(
                      width: 36,
                      height: 4,
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),

                    const Text(
                      "Schedule Interview",
                      style: TextStyle(fontSize: 19, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 24),

                    // Date & Time Field
                    InkWell(
                      onTap: () async {
                        // Pick Date
                        final DateTime? pickedDate = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now(),
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 365)),
                        );

                        if (pickedDate != null) {
                          // Pick Time
                          final TimeOfDay? pickedTime = await showTimePicker(
                            context: context,
                            initialTime: TimeOfDay.now(),
                          );

                          if (pickedTime != null) {
                            setState(() {
                              selectedDateTime = DateTime(
                                pickedDate.year,
                                pickedDate.month,
                                pickedDate.day,
                                pickedTime.hour,
                                pickedTime.minute,
                              );
                            });
                          }
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey[300]!, width: 1),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.calendar_today,
                                size: 20,
                                color: Colors.grey[600]
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Date & Time",
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey[600],
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    selectedDateTime != null
                                        ? "${selectedDateTime!.day.toString().padLeft(2, '0')}-${selectedDateTime!.month.toString().padLeft(2, '0')}-${selectedDateTime!.year} ${selectedDateTime!.hour.toString().padLeft(2, '0')}:${selectedDateTime!.minute.toString().padLeft(2, '0')}"
                                        : "Select Date & Time",
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: selectedDateTime != null
                                          ? const Color(0xFF1A1A1A)
                                          : Colors.grey[400],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Icon(Icons.arrow_forward_ios,
                                size: 16,
                                color: Colors.grey[400]
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Interviewer Field
                    CustomTextField(
                      title: "Interviewer",
                      hintText: "Enter interviewer name",
                      controller: interviewerCtrl,
                    ),
                    const SizedBox(height: 16),

                    // Interview Feedback Field
                    CustomTextField(
                      title: "Interview Feedback",
                      hintText: "Enter interview feedback",
                      controller: feedbackCtrl,
                      maxLines: 3,
                    ),
                    const SizedBox(height: 24),

                    // Save Button
                    Consumer<HREmployeeApiProvider>(
                      builder: (_, providerWatch, __) => Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                side: BorderSide(color: Colors.grey[300]!),
                              ),
                              onPressed: () => Navigator.pop(context),
                              child: const Text(
                                "Cancel",
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF1A1A1A),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              onPressed: providerWatch.isLoading ||
                                  selectedDateTime == null ||
                                  interviewerCtrl.text.trim().isEmpty
                                  ? null
                                  : () async {
                                // Convert to ISO 8601 format
                                final String formattedDate =
                                selectedDateTime!.toUtc().toIso8601String();

                                final Map<String, dynamic> requestBody = {
                                  "interviewDate": formattedDate,
                                  "interviewer": interviewerCtrl.text.trim(),
                                  "feedback": feedbackCtrl.text.trim(),
                                };

                                await provider.candidateScheduleInterview(
                                  context,
                                  candidateId,
                                  requestBody,
                                );

                                if (provider.candidateScheduleInterviewModelResponse
                                    ?.success ==
                                    true) {
                                  _dataUpdated = true;
                                  await _fetchCandidateDetails();

                                  // Close bottom sheet
                                  Navigator.pop(context);

                                  // Optionally close detail screen
                                  // WidgetsBinding.instance.addPostFrameCallback((_) {
                                  //   if (context.mounted) {
                                  //     Navigator.of(context).pop(true);
                                  //   }
                                  // });
                                }
                              },
                              child: providerWatch.isLoading
                                  ? Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: const [
                                  SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: LoadingIndicatorUtils(
                                      color: Colors.white,
                                      strokeWidth: 2,
                                    ),
                                  ),
                                  SizedBox(width: 10),
                                  Text(
                                    "Scheduling...",
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              )
                                  : const Text(
                                "Save",
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProfileSection(Data candidateData) {
    final initials = _getInitials(candidateData.name);
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Row(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                initials,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  candidateData.name ?? 'No Name',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1A1A1A),
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  candidateData.jobId?.title ?? 'No Job Title',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusSection(Data candidateData) {
    return Row(
      children: [
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[200]!, width: 1),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Status",
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: _getStatusColor(candidateData.status ?? 'Pending'),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      candidateData.status ?? 'Pending',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF1A1A1A),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[200]!, width: 1),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Source",
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  candidateData.source ?? 'N/A',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContactInfo(Data candidateData) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Column(
        children: [
          _buildDetailRow(Icons.email_outlined, "Email", candidateData.email ?? 'N/A'),
          Divider(height: 1, color: Colors.grey[200]),
          _buildDetailRow(Icons.phone_outlined, "Phone", candidateData.phone ?? 'N/A'),
        ],
      ),
    );
  }

  Widget _buildProfessionalDetails(Data candidateData) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Column(
        children: [
          _buildDetailRow(Icons.work_outline, "Experience", candidateData.experience ?? 'Not specified'),
          Divider(height: 1, color: Colors.grey[200]),
          _buildDetailRow(Icons.calendar_today_outlined, "Applied", _formatDate(candidateData.appliedDate)),
        ],
      ),
    );
  }

  Widget _buildSkillsSection(List<String>? skills) {
    if (skills == null || skills.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[200]!, width: 1),
        ),
        child: Text(
          "No skills listed",
          style: TextStyle(color: Colors.grey[600], fontSize: 14),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: skills.map((skill) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFFF5F5F5),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[300]!, width: 1),
          ),
          child: Text(
            skill,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Color(0xFF1A1A1A),
            ),
          ),
        )).toList(),
      ),
    );
  }

  Widget _buildInterviewDetails(Data candidateData) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Column(
        children: [
          if (candidateData.interviewer != null)
            _buildDetailRow(Icons.person_outline, "Interviewer", candidateData.interviewer!),
          if (candidateData.interviewer != null && candidateData.inerviewDate != null)
            Divider(height: 1, color: Colors.grey[200]),
          if (candidateData.inerviewDate != null)
            _buildDetailRow(Icons.event_outlined, "Date", _formatDate(candidateData.inerviewDate)),
        ],
      ),
    );
  }

  Widget _buildTextSection(String text) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 14,
          color: Colors.grey[800],
          height: 1.6,
        ),
      ),
    );
  }

  Widget _buildDocumentsSection(Data candidateData) {
    return Column(
      children: [
        if (candidateData.resume?.url != null || candidateData.resume?.publicUrl != null)
          _buildDocumentCard(
            "Resume",
            Icons.description_outlined,
                () => _openResume(candidateData.resume?.publicUrl ?? "N/A"),
          ),
        if ((candidateData.resume?.url != null || candidateData.resume?.publicUrl != null) &&
            (candidateData.offerLetter?.url != null || candidateData.offerLetter?.publicUrl != null))
          const SizedBox(height: 10),
        if (candidateData.offerLetter?.url != null || candidateData.offerLetter?.publicUrl != null)
          _buildDocumentCard(
            "Offer Letter (${candidateData.offerLetterStatus ?? 'N/A'})",
            Icons.assignment_outlined,
                () => _openResume(candidateData.offerLetter?.publicUrl ?? "N/A"),
          ),
      ],
    );
  }

  Widget _buildDocumentCard(String title, IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[300]!, width: 1),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFF5F5F5),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: const Color(0xFF1A1A1A), size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF1A1A1A),
                ),
              ),
            ),
            Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey[600]),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineSection(Data candidateData) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Column(
        children: [
          _buildDetailRow(Icons.add_circle_outline, "Created", _formatDate(candidateData.createdAt)),
          Divider(height: 1, color: Colors.grey[200]),
          _buildDetailRow(Icons.update_outlined, "Updated", _formatDate(candidateData.updatedAt)),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: Color(0xFF1A1A1A),
        letterSpacing: -0.3,
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case "shortlisted":
        return const Color(0xFF10B981);
      case "rejected":
        return const Color(0xFFEF4444);
      case "interview scheduled":
        return const Color(0xFF3B82F6);
      case "pending":
      case "applied":
        return const Color(0xFFF59E0B);
      case "offered":
        return const Color(0xFF8B5CF6);
      case "hired":
        return const Color(0xFF14B8A6);
      default:
        return const Color(0xFF6B7280);
    }
  }


  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';

    try {
      final date = DateTime.parse(dateString).toLocal();
      final now = DateTime.now();

      final difference = now.difference(date);
      final days = difference.inDays;

      final formatted = DateFormat('dd MMM yyyy, h:mm a').format(date);

      // ---- FUTURE DATES ----
      if (days < 0) {
        final futureDays = days.abs();

        if (futureDays == 1) return 'Tomorrow ($formatted)';
        if (futureDays < 7) return 'In $futureDays days ($formatted)';

        if (futureDays < 30) {
          final weeks = (futureDays / 7).floor();
          return 'In $weeks ${weeks == 1 ? 'week' : 'weeks'} ($formatted)';
        }

        if (futureDays < 365) {
          final months = (futureDays / 30).floor();
          return 'In $months ${months == 1 ? 'month' : 'months'} ($formatted)';
        }

        final years = (futureDays / 365).floor();
        return 'In $years ${years == 1 ? 'year' : 'years'} ($formatted)';
      }

      // ---- PAST DATES ----
      if (days == 0) return 'Today ($formatted)';
      if (days == 1) return '1 day ago ($formatted)';
      if (days < 7) return '$days days ago ($formatted)';

      if (days < 30) {
        final weeks = (days / 7).floor();
        return '$weeks ${weeks == 1 ? 'week' : 'weeks'} ago ($formatted)';
      }

      if (days < 365) {
        final months = (days / 30).floor();
        return '$months ${months == 1 ? 'month' : 'months'} ago ($formatted)';
      }

      final years = (days / 365).floor();
      return '$years ${years == 1 ? 'year' : 'years'} ago ($formatted)';
    } catch (e) {
      return dateString ?? 'N/A';
    }
  }




  String _getInitials(String? name) {
    if (name == null || name.isEmpty) return 'NA';
    final words = name.trim().split(' ');
    if (words.length >= 2) {
      return '${words[0][0]}${words[1][0]}'.toUpperCase();
    }
    return name.length >= 2
        ? name.substring(0, 2).toUpperCase()
        : name[0].toUpperCase();
  }

  Future<void> _openResume(String? url) async {
    if (url == null || url.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.error_outline, color: Colors.white, size: 18),
              SizedBox(width: 8),
              Text("Document URL not available"),
            ],
          ),
          backgroundColor: const Color(0xFFEF4444),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          margin: const EdgeInsets.all(16),
        ),
      );
      return;
    }

    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        throw 'Could not launch $url';
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.error_outline, color: Colors.white, size: 18),
              const SizedBox(width: 8),
              Expanded(child: Text("Failed to open: $e")),
            ],
          ),
          backgroundColor: const Color(0xFFEF4444),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
  }
}