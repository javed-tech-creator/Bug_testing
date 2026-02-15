import 'dart:io';
import 'package:dss_crm/hr_module/controller/hr_employee_api_provider.dart';
import 'package:dss_crm/hr_module/screen/employee/model/hr_employee_list_detail_model.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../../../../utils/permission_manager_utils.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../../controller/hr_emp_doc_api_provider.dart';

class AddEmpDocumentUploadWidget extends StatefulWidget {
  final String empId;

  const AddEmpDocumentUploadWidget({super.key, required this.empId});

  @override
  State<AddEmpDocumentUploadWidget> createState() =>
      _AddEmpDocumentUploadWidgetState();
}

class _AddEmpDocumentUploadWidgetState extends State<AddEmpDocumentUploadWidget> {
  // ----------  local state  ----------
  final Map<String, dynamic> _uploadedDocuments = {
    'pan': null,
    'aadhaar': null,
    'passbook': null,
    'highSchool': null,
    'graduation': null,
  };
  final Map<String, String> _titles = {
    'pan': 'PAN Card',
    'aadhaar': 'Aadhaar Card',
    'passbook': 'Bank Passbook',
    'highSchool': 'High School Certificate',
    'graduation': 'Graduation Certificate',
  };

  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadExistingDocsFromProfile();
  }

  /* ---------------------------------------------------------------------- */
  /*   Pull the `documents` list that already lives inside the profile API   */
  /* ---------------------------------------------------------------------- */
  Future<void> _loadExistingDocsFromProfile() async {
    setState(() => _isLoading = true);
    try {
      final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
      final List<Documents>? docs = provider.employeeListDetailModel?.data?.documents;

      if (docs != null && docs.isNotEmpty) {
        for (final doc in docs) {
          final key = _mapDocTypeToKey(doc.type);
          if (key != null && doc.publicUrl?.isNotEmpty == true) {
            _uploadedDocuments[key] = doc;
          }
        }
      }
    } catch (e) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message: "Error loading existing docs: $e",
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  String? _mapDocTypeToKey(String? apiType) {
    if (apiType == null) return null;
    final lower = apiType.toLowerCase();
    if (lower.contains('pan')) return 'pan';
    if (lower.contains('aadhaar') || lower.contains('adhar')) return 'aadhaar';
    if (lower.contains('passbook') || lower.contains('bank')) return 'passbook';
    if (lower.contains('high') && lower.contains('school')) return 'highSchool';
    if (lower.contains('graduation') || lower.contains('degree')) return 'graduation';
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /*                               FILE PICKER                               */
  /* ---------------------------------------------------------------------- */
  Future<void> _pickFile(String docKey) async {
    final granted = await PermissionManager.requestPhotos(context);
    if (!granted) return;

    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    );

    if (result?.files.single.path != null) {
      setState(() {
        _uploadedDocuments[docKey] = File(result!.files.single.path!);
      });
    } else {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.orange,
        message: "No file selected",
      );
    }
  }

  void _clearFile(String docKey) => setState(() => _uploadedDocuments[docKey] = null);

  bool _isImage(String? name) {
    if (name == null) return false;
    final l = name.toLowerCase();
    return l.endsWith('.jpg') || l.endsWith('.jpeg') || l.endsWith('.png');
  }

  /* ---------------------------------------------------------------------- */
  /*                            OPEN URL (VIEW)                              */
  /* ---------------------------------------------------------------------- */
  Future<void> _launchURL(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.red,
          message: 'Could not open document. Please try again.',
        );
      }
    }
  }

  /* ---------------------------------------------------------------------- */
  /*                               SUBMIT LOGIC                               */
  /* ---------------------------------------------------------------------- */
  void _submit(bool isUpdate) async {
    final Map<String, File> files = {};
    _uploadedDocuments.forEach((key, value) {
      if (value is File) files[key] = value;
    });

    if (files.isEmpty) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message: "Select at least one document to ${isUpdate ? 'update' : 'save'}.",
      );
      return;
    }

    final uploadProvider = Provider.of<HREmpDocumentUploadProvider>(context, listen: false);
    if (isUpdate) {
      await uploadProvider.updateEmployeeDocuments(
        documents: files,
        empId: widget.empId,
        context: context,
      );
    } else {
      await uploadProvider.uploadEmployeeDocuments(
        documents: files,
        empId: widget.empId,
        context: context,
      );
    }

    // after success → refresh profile
    Provider.of<HREmployeeApiProvider>(context, listen: false)
        .getHREmployeeDetail(widget.empId);
  }

  /* ---------------------------------------------------------------------- */
  /*                                   UI                                   */
  /* ---------------------------------------------------------------------- */
  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return SingleChildScrollView(
      padding: ResponsiveHelper.paddingAll(context,14),
      child: Column(
        children: [
          ..._uploadedDocuments.keys.map((docKey) {
            final dynamic doc = _uploadedDocuments[docKey];
            String? fileName;
            String? fileUrl;
            bool isLocal = false;
            bool hasRemoteUrl = false;

            if (doc is File) {
              isLocal = true;
              fileName = doc.path.split('/').last;
            } else if (doc is Documents) {
              fileName = doc.publicUrl?.split('/').last;
              fileUrl = doc.publicUrl;
              hasRemoteUrl = fileUrl?.isNotEmpty == true;
            }

            return Card(
              margin: const EdgeInsets.symmetric(vertical: 10),
              elevation: 0,
              color: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Heading with View button on right (if remote URL available)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _titles[docKey]!,
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: ResponsiveHelper.fontSize(context, 16),
                            ),
                          ),
                        ),
                        if (hasRemoteUrl)
                          GestureDetector(
                            onTap: () => _launchURL(fileUrl!),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.visibility, size: 16, color: Colors.white),
                                  const SizedBox(width: 4),
                                  Text(
                                    'View',
                                    style: AppTextStyles.body2(context)?.copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 15),
                    Container(
                      width: double.infinity,
                      height: doc == null ? 100 : 200,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: doc == null
                          ? _buildEmptyPlaceholder()
                          : isLocal
                          ? _buildLocalFile(doc as File, fileName!)
                          : _buildRemoteFile(fileUrl!, fileName!),
                    ),
                    const SizedBox(height: 15),
                    Row(
                      children: [
                        Expanded(
                          child: _buildOutlinedButton(
                            'Select File',
                                () async => _pickFile(docKey),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildFilledButton(
                            'Clear',
                            doc == null ? null : () => _clearFile(docKey),
                            doc == null ? Colors.grey : Colors.red,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: CustomButton(
                  onPressed: _uploadedDocuments.values.any((e) => e != null)
                      ? () => _submit(false)
                      : null,
                  text: 'Save',
                  textColor: Colors.white,
                  color: _uploadedDocuments.values.any((e) => e != null)
                      ? AppColors.primary
                      : Colors.grey,
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: CustomButton(
                  onPressed: _uploadedDocuments.values.any((e) => e != null)
                      ? () => _submit(true)
                      : null,
                  text: 'Update',
                  textColor: Colors.white,
                  color: _uploadedDocuments.values.any((e) => e != null)
                      ? Colors.amber
                      : Colors.grey,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /* -------------------------- UI HELPERS -------------------------- */
  Widget _buildEmptyPlaceholder() => Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(Icons.cloud_upload, size: 40, color: Colors.grey[600]),
      const SizedBox(height: 8),
      Text('No file selected', style: AppTextStyles.body2(context)),
    ],
  );

  Widget _buildLocalFile(File file, String name) => _isImage(name)
      ? ClipRRect(
    borderRadius: BorderRadius.circular(10),
    child: Image.file(file, fit: BoxFit.contain, width: double.infinity, height: double.infinity),
  )
      : _buildFileIcon(name);

  Widget _buildRemoteFile(String url, String name) => _isImage(name)
      ? ClipRRect(
    borderRadius: BorderRadius.circular(10),
    child: Image.network(
      url,
      fit: BoxFit.cover,
      width: double.infinity,
      height: double.infinity,
      loadingBuilder: (c, child, progress) =>
      progress == null ? child : const Center(child: CircularProgressIndicator()),
      errorBuilder: (_, __, ___) => const Center(child: Icon(Icons.broken_image, size: 40, color: Colors.red)),
    ),
  )
      : _buildFileIcon(name, subtitle: '(Previously uploaded)');

  Widget _buildFileIcon(String name, {String? subtitle}) => Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(Icons.description, size: 40, color: Colors.grey[600]),
      const SizedBox(height: 8),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Text(
          name,
          textAlign: TextAlign.center,
          style: AppTextStyles.body1(context, overrideStyle: const TextStyle(fontWeight: FontWeight.bold)),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
      ),
      if (subtitle != null)
        Text(
          subtitle,
          style: AppTextStyles.body2(context).copyWith(fontStyle: FontStyle.italic, color: Colors.grey[700]),
        ),
    ],
  );

  Widget _buildOutlinedButton(String text, VoidCallback onTap) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.primary),
      ),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: AppTextStyles.body2(context).copyWith(
          color: AppColors.primary,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    ),
  );

  Widget _buildFilledButton(String text, VoidCallback? onTap, Color bg) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(8), color: bg),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: AppTextStyles.body2(context)?.copyWith(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    ),
  );
}