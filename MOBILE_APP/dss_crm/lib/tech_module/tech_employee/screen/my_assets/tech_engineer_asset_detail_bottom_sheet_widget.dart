import 'package:dss_crm/tech_module/tech_employee/controller/tech_engineer_api_provider.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_asset_list_model.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/ui_helper/app_text_styles.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';

import '../../../tech_manager/model/asset_list_model.dart';

class TechEngineerAssetDetailBottomSheet extends StatelessWidget {
  final Data asset;
  final VoidCallback? onAssetDeleted;

  const TechEngineerAssetDetailBottomSheet({
    Key? key,
    required this.asset,
    this.onAssetDeleted,
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

              // Actions
              // _buildActions(context, asset),
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
                AssetUtils.getTypeColor(asset.type ?? '').withOpacity(0.1),
                AssetUtils.getTypeColor(asset.type ?? '').withOpacity(0.05),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: AssetUtils.getTypeColor(asset.type ?? '').withOpacity(0.2),
            ),
          ),
          child: Icon(
            AssetUtils.getTypeIcon(asset.type ?? ''),
            color: AssetUtils.getTypeColor(asset.type ?? ''),
            size: 32,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                asset.tag ?? 'N/A',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${asset.brand ?? ''} ${asset.model ?? ''}',
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
                    AssetUtils.getStatusColor(asset.status ?? ''),
                    AssetUtils.getStatusColor(
                      asset.status ?? '',
                    ).withOpacity(0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                (asset.status ?? 'Unknown').toUpperCase(),
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
          'Basic Information',
          Icons.info_outline_rounded,
          Colors.blue,
          [
            _buildDetailCard('Asset Tag', asset.tag ?? 'N/A', Icons.tag),
            _buildDetailCard(
              'Type',
              asset.type ?? 'N/A',
              Icons.category_outlined,
            ),
            _buildDetailCard(
              'Brand',
              asset.brand ?? 'N/A',
              Icons.business_outlined,
            ),
            _buildDetailCard(
              'Model',
              asset.model ?? 'N/A',
              Icons.inventory_outlined,
            ),
            _buildDetailCard(
              'Status',
              asset.status ?? 'N/A',
              Icons.info_outline,
            ),
            _buildDetailCard(
              'Location',
              asset.location ?? 'N/A',
              Icons.location_on_outlined,
            ),
          ],
        ),

        const SizedBox(height: 24),

        if (asset.assignedTo != null) ...[
          _buildSection(
            'Assignment Details',
            Icons.people_outline_rounded,
            Colors.purple,
            [
              _buildDetailCard(
                'Assigned To',
                asset.assignedTo?.name ?? 'N/A',
                Icons.person_outline,
              ),
              _buildDetailCard(
                'Department',
                asset.assignedTo?.department ?? 'N/A',
                Icons.business_outlined,
              ),
              _buildDetailCard(
                'Role',
                asset.assignedTo?.role ?? 'N/A',
                Icons.work_outline,
              ),
              _buildDetailCard(
                'Employee ID',
                asset.assignedTo?.employeeId ?? 'N/A',
                Icons.badge_outlined,
              ),
              if (asset.assignedTo?.date != null && asset.assignedTo!.date!.isNotEmpty)
                _buildDetailCard(
                  'Assignment Date',
                  _formatDate(asset.assignedTo!.date!),
                  Icons.calendar_today_outlined,
                ),
            ],
          ),
          const SizedBox(height: 24),
        ],

        _buildSection(
          'Warranty Information',
          Icons.shield_outlined,
          Colors.orange,
          [
            _buildDetailCard(
              'Warranty End',
              _formatDate(asset.warrantyEnd),
              Icons.shield_outlined,
            ),
          ],
        ),

        const SizedBox(height: 100), // Extra space for bottom actions
      ],
    );
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

  Future<void> _handleDeleteAsset(
      BuildContext bottomSheetContext,
      Data asset,
      ) async {
    try {
      // Show confirmation dialog
      final shouldDelete = await showDialog<bool>(
        context: bottomSheetContext,
        barrierDismissible: false,
        builder: (BuildContext dialogContext) => AlertDialog(
          title: const Text('Delete Asset'),
          content: Text(
            'Are you sure you want to delete ${asset.tag ?? 'this asset'}?',
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
                Text('Deleting asset...'),
              ],
            ),
          ),
        );

        // Call delete API
        final provider = Provider.of<TechEngineerApiProvider>(
          bottomSheetContext,
          listen: false,
        );
        await provider.deleteTechAssetsWithoutNavigation(
          bottomSheetContext,
          asset.sId!,
        );

        // Close loading dialog
        if (Navigator.canPop(bottomSheetContext)) {
          Navigator.of(bottomSheetContext).pop();
        }

        // Close bottom sheet
        if (Navigator.canPop(bottomSheetContext)) {
          Navigator.of(bottomSheetContext).pop();
        }

        // Check if deletion was successful
        if (provider.deleteTechAssetsModelResponse?.success == true) {
          // Call the refresh callback
          if (onAssetDeleted != null) {
            onAssetDeleted!();
          }

          // Show success message
          if (bottomSheetContext.mounted) {
            ScaffoldMessenger.of(bottomSheetContext).showSnackBar(
              SnackBar(
                content: Text('${asset.tag} deleted successfully'),
                backgroundColor: Colors.green,
                duration: const Duration(seconds: 2),
              ),
            );
          }
        } else {
          // Show error message
          if (bottomSheetContext.mounted) {
            ScaffoldMessenger.of(bottomSheetContext).showSnackBar(
              SnackBar(
                content: Text(
                  provider.deleteTechAssetsModelResponse?.message ??
                      'Failed to delete asset',
                ),
                backgroundColor: Colors.red,
                duration: const Duration(seconds: 2),
              ),
            );
          }
        }
      }
    } catch (e) {
      debugPrint('Delete error: $e');
    }
  }

  Widget _buildActions(BuildContext context, Data asset) {
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
              onPressed: () => (),
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
                debugPrint("edit asset button clicked here");
                // Close bottom sheet first
                Navigator.pop(context);
                // Navigate to update screen with proper callback
                // Navigator.push(
                //   context,
                //   MaterialPageRoute(
                //     builder: (context) => UpdateAssetScreen(productData: asset),
                //   ),
                // ).then((result) {
                //   // Check if update was successful
                //   if (result == true && onAssetDeleted != null) {
                //     onAssetDeleted!(); // Refresh the asset list
                //   }
                // });
              },
              icon: const Icon(Icons.edit_outlined),
              label: Text(
                'Edit Asset',
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