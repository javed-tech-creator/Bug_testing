import 'package:dss_crm/hr_module/controller/hr_employee_api_provider.dart';
import 'package:dss_crm/hr_module/screen/employee/model/hr_employee_list_detail_model.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/string_utils.dart';
import '../../../controller/hr_emp_doc_api_provider.dart';

class ViewEmpDocumentsListWidget extends StatefulWidget {
  final String empId;

  const ViewEmpDocumentsListWidget({super.key, required this.empId});

  @override
  State<ViewEmpDocumentsListWidget> createState() => _ViewEmpDocumentsListWidgetState();
}

class _ViewEmpDocumentsListWidgetState extends State<ViewEmpDocumentsListWidget> {
  @override
  void initState() {
    super.initState();
    // Profile API is already called in HREmployeeDetailScreen → no extra call needed
  }

  // --------------------------------------------------------------
  //  Map API type → readable title (same as before)
  // --------------------------------------------------------------
  String _getDocumentTitle(String? apiType) {
    if (apiType == null) return 'Unknown';
    final lower = apiType.toLowerCase();
    if (lower.contains('pan')) return 'PAN Card';
    if (lower.contains('aadhaar') || lower.contains('adhar')) return 'Aadhaar Card';
    if (lower.contains('passbook') || lower.contains('bank')) return 'Bank Passbook';
    if (lower.contains('high') && lower.contains('school')) return 'High School Certificate';
    if (lower.contains('graduation') || lower.contains('degree')) return 'Graduation Certificate';
    if (lower.contains('salary')) return 'Salary Slip';
    return StringUtils.capitalizeEachWord(apiType);
  }

  // --------------------------------------------------------------
  //  Open URL
  // --------------------------------------------------------------
  Future<void> _launchURL(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open document. Please try again.')),
        );
      }
    }
  }

  // --------------------------------------------------------------
  //  Delete confirmation dialog
  // --------------------------------------------------------------
  Future<void> _confirmDeleteDocument(String docKey, String title, String fileName) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        title: Text('Confirm Deletion', style: AppTextStyles.body1(context).copyWith(color: Colors.red)),
        content: Text('Are you sure you want to delete the $title? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text('Cancel', style: TextStyle(color: AppColors.primary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true && mounted) {
      Provider.of<HREmpDocumentUploadProvider>(context, listen: false).delteEmpSingleDocument(
        documentType: docKey,
        fileName: fileName,
        empId: widget.empId,
        context: context,
      );
    }
  }

  // --------------------------------------------------------------
  //  Build UI – uses profile data only
  // --------------------------------------------------------------
  @override
  Widget build(BuildContext context) {
    return Consumer<HREmployeeApiProvider>(
      builder: (context, profileProvider, child) {
        // -----------------------------------------------------------------
        //  Loading / error / empty states
        // -----------------------------------------------------------------
        if (profileProvider.isLoading) {
          return const Center(child: LoadingIndicatorUtils());
        }

        if (profileProvider.errorMessage.isNotEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Error: ${profileProvider.errorMessage}',
                style: AppTextStyles.body1(context).copyWith(color: Colors.red),
                textAlign: TextAlign.center,
              ),
            ),
          );
        }

        final List<Documents>? docs = profileProvider.employeeListDetailModel?.data?.documents;

        if (docs == null || docs.isEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'No documents uploaded for this employee yet.',
                style: AppTextStyles.body1(context).copyWith(color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            ),
          );
        }

        // -----------------------------------------------------------------
        //  Filter only documents that have a public URL
        // -----------------------------------------------------------------
        final List<Documents> validDocs = docs.where((d) => d.publicUrl?.isNotEmpty == true).toList();

        if (validDocs.isEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'No documents uploaded for this employee yet.',
                style: AppTextStyles.body1(context).copyWith(color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            ),
          );
        }

        // -----------------------------------------------------------------
        //  UI – same as your original design
        // -----------------------------------------------------------------
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Employee Documents", style: AppTextStyles.heading2(context)),
              const SizedBox(height: 16),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: validDocs.length,
                itemBuilder: (context, index) {
                  final doc = validDocs[index];
                  final title = _getDocumentTitle(doc.type);
                  final fileName = doc.publicUrl?.split('/').last ?? 'document';
                  final docKey = doc.type?.toLowerCase() ?? '';

                  return Card(
                    color: Colors.white,
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    elevation: 2,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          Icon(Icons.insert_drive_file, color: AppColors.primary, size: 30),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  title,
                                  style: AppTextStyles.heading2(context, overrideStyle: const TextStyle(fontSize: 15)),
                                  overflow: TextOverflow.ellipsis,
                                ),
                                if (fileName.isNotEmpty)
                                  Text(
                                    fileName,
                                    style: AppTextStyles.body1(context),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                              ],
                            ),
                          ),
                          // View button
                          IconButton(
                            icon: const Icon(Icons.visibility),
                            color: AppColors.primary,
                            tooltip: 'View Document',
                            onPressed: () => _launchURL(doc.publicUrl!),
                          ),
                          // Delete button
                          IconButton(
                            icon: const Icon(Icons.delete_outline),
                            color: Colors.red,
                            tooltip: 'Delete Document',
                            onPressed: () => _confirmDeleteDocument(docKey, title, fileName),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}