import 'package:dss_crm/tech_module/tech_employee/controller/tech_engineer_api_provider.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/ui_helper/app_text_styles.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineerr_software_licence_list_model.dart';

class TechEngineerLicenceSoftwareDetailBottomSheet extends StatelessWidget {
  final Data license; // Changed from asset to license
  final VoidCallback? onLicenseDeleted; // Changed callback name

  const TechEngineerLicenceSoftwareDetailBottomSheet({
    Key? key,
    required this.license,
    this.onLicenseDeleted,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              // Handle bar
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),

              // Header
              Padding(
                padding: const EdgeInsets.all(24),
                child: _buildHeader(context),
              ),

              // Content
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: _buildContent(),
                ),
              ),

              // Actions (uncomment if needed)
              // _buildActions(context, license),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Colors.blue.shade100,
                Colors.blue.shade50,
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.blue.shade200,
            ),
          ),
          child: Icon(
            Icons.computer,
            color: Colors.blue.shade600,
            size: 32,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                license.softwareName ?? 'Unknown Software',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'License ID: ${license.licenseId ?? 'N/A'}',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
        Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    _getExpiryStatusColor(),
                    _getExpiryStatusColor().withOpacity(0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                license.expireIn ?? 'N/A',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSection(
          'License Information',
          Icons.info_outline_rounded,
          Colors.blue,
          [
            _buildDetailCard('Software Name', license.softwareName ?? 'N/A', Icons.computer),
            _buildDetailCard('License ID', license.licenseId ?? 'N/A', Icons.key),
            _buildDetailCard('Version Type', license.versionType ?? 'N/A', Icons.category_outlined),
            _buildDetailCard('Validity End', _formatDate(license.validityEnd), Icons.event_outlined),
            _buildDetailCard('Expires In', license.expireIn ?? 'N/A', Icons.timer_outlined),
          ],
        ),

        const SizedBox(height: 24),

        if (license.assignedTo != null) ...[
          _buildSection(
            'Assignment Details',
            Icons.people_outline_rounded,
            Colors.purple,
            [
              _buildDetailCard(
                'Assigned To',
                license.assignedTo?.name ?? 'N/A',
                Icons.person_outline,
              ),
              _buildDetailCard(
                'Department',
                license.assignedTo?.department ?? 'N/A',
                Icons.business_outlined,
              ),
              _buildDetailCard(
                'Role',
                license.assignedTo?.role ?? 'N/A',
                Icons.work_outline,
              ),
              _buildDetailCard(
                'Employee ID',
                license.assignedTo?.employeeId ?? 'N/A',
                Icons.badge_outlined,
              ),
              if (license.assignedTo?.date != null && license.assignedTo!.date!.isNotEmpty)
                _buildDetailCard(
                  'Assignment Date',
                  _formatDate(license.assignedTo!.date!),
                  Icons.calendar_today_outlined,
                ),
            ],
          ),
          const SizedBox(height: 24),
        ],

        const SizedBox(height: 100), // Extra space for bottom actions
      ],
    );
  }

  Color _getExpiryStatusColor() {
    final expireText = license.expireIn?.toLowerCase() ?? '';
    if (expireText.contains('expired')) {
      return Colors.red.shade600;
    } else if (expireText.contains('day') && expireText.contains('30')) {
      return Colors.orange.shade600;
    } else {
      return Colors.green.shade600;
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    try {
      return DateFormatterUtils.formatToShortMonth(dateString);
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  }

  Widget _buildSection(
      String title,
      IconData icon,
      Color color,
      List<Widget> children,
      ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 12),
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: color.withOpacity(0.02),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: color.withOpacity(0.1)),
          ),
          child: Column(
            children: children
                .expand((child) => [child, const SizedBox(height: 12)])
                .take(children.length * 2 - 1)
                .toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildDetailCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 18, color: Colors.grey[600]),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handleDeleteLicense(
      BuildContext bottomSheetContext,
      Data license,
      ) async {
    try {
      // Show confirmation dialog
      final shouldDelete = await showDialog<bool>(
        context: bottomSheetContext,
        barrierDismissible: false,
        builder: (BuildContext dialogContext) => AlertDialog(
          title: const Text('Delete License'),
          content: Text(
            'Are you sure you want to delete ${license.softwareName ?? 'this license'}?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(false),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              child: const Text('Delete'),
            ),
          ],
        ),
      );

      if (shouldDelete == true) {
        // Show loading dialog
        showDialog(
          context: bottomSheetContext,
          barrierDismissible: false,
          builder: (BuildContext loadingContext) => const AlertDialog(
            content: Row(
              children: [
                CircularProgressIndicator(),
                SizedBox(width: 20),
                Text('Deleting license...'),
              ],
            ),
          ),
        );

        // Call delete API (you'll need to implement this method)
        final provider = Provider.of<TechEngineerApiProvider>(
          bottomSheetContext,
          listen: false,
        );
        // await provider.deleteTechLicenseWithoutNavigation(
        //   bottomSheetContext,
        //   license.sId!,
        // );

        // Close loading dialog
        if (Navigator.canPop(bottomSheetContext)) {
          Navigator.of(bottomSheetContext).pop();
        }

        // Close bottom sheet
        if (Navigator.canPop(bottomSheetContext)) {
          Navigator.of(bottomSheetContext).pop();
        }

        // Check if deletion was successful (adjust based on your API response)
        // if (provider.deleteTechLicenseModelResponse?.success == true) {
        // Call the refresh callback
        if (onLicenseDeleted != null) {
          onLicenseDeleted!();
        }

        // Show success message
        if (bottomSheetContext.mounted) {
          ScaffoldMessenger.of(bottomSheetContext).showSnackBar(
            SnackBar(
              content: Text('${license.softwareName} deleted successfully'),
              backgroundColor: Colors.green,
              duration: const Duration(seconds: 2),
            ),
          );
        }
        // } else {
        //   // Show error message
        //   if (bottomSheetContext.mounted) {
        //     ScaffoldMessenger.of(bottomSheetContext).showSnackBar(
        //       SnackBar(
        //         content: Text(
        //           provider.deleteTechLicenseModelResponse?.message ??
        //               'Failed to delete license',
        //         ),
        //         backgroundColor: Colors.red,
        //         duration: const Duration(seconds: 2),
        //       ),
        //     );
        //   }
        // }
      }
    } catch (e) {
      debugPrint('Delete error: $e');
    }
  }

  Widget _buildActions(BuildContext context, Data license) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
      ),
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () => _handleDeleteLicense(context, license),
              icon: const Icon(Icons.delete, color: Colors.red),
              label: Text(
                'Delete',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    color: Colors.red,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                side: const BorderSide(color: Colors.red),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () {
                debugPrint("edit license button clicked here");
                // Close bottom sheet first
                Navigator.pop(context);
                // Navigate to update screen with proper callback
                // Navigator.push(
                //   context,
                //   MaterialPageRoute(
                //     builder: (context) => UpdateLicenseScreen(licenseData: license),
                //   ),
                // ).then((result) {
                //   // Check if update was successful
                //   if (result == true && onLicenseDeleted != null) {
                //     onLicenseDeleted!(); // Refresh the license list
                //   }
                // });
              },
              icon: const Icon(Icons.edit_outlined),
              label: Text(
                'Edit License',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    color: AppColors.whiteColor,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}