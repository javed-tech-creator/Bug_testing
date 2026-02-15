import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_asset_list_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/date_formate_util.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../../tech_manager/model/asset_list_model.dart';
import '../../../tech_manager/widget/assign_bottom_sheet_widget.dart';

class TechEngineerAssetCard extends StatelessWidget {
  final Data asset; // Using Data from your API model
  final VoidCallback? onTap;
  final VoidCallback? onAssignmentCompleted; // नया callback

  const TechEngineerAssetCard({
    Key? key,
    required this.asset,
    this.onTap,
    this.onAssignmentCompleted, // नया parameter
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: ResponsiveHelper.paddingOnly(context, bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              children: [
                _buildCompactHeader(context),
                const SizedBox(height: 12),
                _buildContentGrid(context),
                const SizedBox(height: 10),
                _buildFooterRow(context),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCompactHeader(BuildContext context) {
    return Row(
      children: [
        // Icon
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: AssetUtils.getTypeColor(asset.type ?? '').withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: AssetUtils.getTypeColor(asset.type ?? '').withOpacity(0.3),
            ),
          ),
          child: Icon(
            AssetUtils.getTypeIcon(asset.type ?? ''),
            color: AssetUtils.getTypeColor(asset.type ?? ''),
            size: 20,
          ),
        ),
        const SizedBox(width: 10),

        // Asset Info
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                asset.tag ?? 'N/A',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey.shade800,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                '${asset.brand ?? ''} ${asset.model ?? ''}',
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey.shade600,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),

        // Status
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: AssetUtils.getStatusColor(asset.status ?? ''),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(
            (asset.status ?? 'Unknown').toUpperCase(),
            style: const TextStyle(
              fontSize: 8,
              color: Colors.white,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContentGrid(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        children: [
          // Assigned To - Full width
          _buildInfoRow(
            Icons.person,
            'Assigned To',
            asset.assignedTo?.name ?? 'N/A',
            Colors.blue.shade600,
          ),
          const SizedBox(height: 8),

          // Department & Location - Side by side
          Row(
            children: [
              Expanded(
                child: _buildInfoRow(
                  Icons.business,
                  'Dept',
                  asset.assignedTo?.department ?? 'N/A',
                  Colors.purple.shade600,
                  isCompact: true,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildInfoRow(
                  Icons.location_on,
                  'Location',
                  asset.location ?? 'N/A',
                  Colors.orange.shade600,
                  isCompact: true,
                ),
              ),
            ],
          ),

          // Role - if available
          if (asset.assignedTo?.role != null && asset.assignedTo!.role!.isNotEmpty) ...[
            const SizedBox(height: 8),
            _buildInfoRow(
              Icons.work,
              'Role',
              asset.assignedTo!.role!,
              Colors.green.shade600,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value, Color color, {bool isCompact = false}) {
    return Row(
      children: [
        Container(
          width: isCompact ? 24 : 28,
          height: isCompact ? 24 : 28,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Icon(
            icon,
            size: isCompact ? 12 : 14,
            color: color,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: isCompact ? 9 : 10,
                  color: Colors.grey.shade600,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                value,
                style: TextStyle(
                  fontSize: isCompact ? 11 : 12,
                  color: Colors.grey.shade800,
                  fontWeight: FontWeight.w600,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFooterRow(BuildContext context) {
    int? warrantyDaysLeft;
    String? warrantyEndDate = asset.warrantyEnd; // API field: warranty_end
    String? assignedDate = asset.assignedTo?.date; // API field: assignedTo.date

    // Calculate warranty days remaining from assigned date to warranty end date
    if (warrantyEndDate != null && warrantyEndDate.isNotEmpty &&
        assignedDate != null && assignedDate.isNotEmpty) {
      try {
        DateTime warrantyDate = DateTime.parse(warrantyEndDate);
        DateTime assignedDateTime = DateTime.parse(assignedDate);
        DateTime today = DateTime.now();
        int totalWarrantyDays = warrantyDate.difference(assignedDateTime).inDays;
        int usedDays = today.difference(assignedDateTime).inDays;
        warrantyDaysLeft = totalWarrantyDays - usedDays;
        if (warrantyDaysLeft < 0) warrantyDaysLeft = 0;
        print('Asset: ${asset.tag}');
        print('Assigned Date: $assignedDate');
        print('Warranty End: $warrantyEndDate');
        print('Total warranty days: $totalWarrantyDays');
        print('Used days: $usedDays');
        print('Remaining days: $warrantyDaysLeft');

      } catch (e) {
        print('Date parsing error: $e');
        warrantyDaysLeft = null;
      }
    }


    return Row(
      children: [
        // Warranty End Date
        Expanded(
          child: _buildDateChip(
            'Warranty',
            _formatDate(warrantyEndDate),
            Icons.shield,
            Colors.teal.shade600,
          ),
        ),
        const SizedBox(width: 6),

        // Assigned Date
        if (assignedDate != null && assignedDate.isNotEmpty)
          Expanded(
            child: _buildDateChip(
              'Assigned',
              _formatDate(assignedDate),
              Icons.calendar_today,
              Colors.indigo.shade600,
            ),
          ),

        // Warranty Days Remaining
        if (warrantyDaysLeft != null) ...[
          const SizedBox(width: 6),
          Expanded(
            child: _buildDateChip(
              'Expires',
              '${asset.expireIn}',
              // '$warrantyDaysLeft days',
              Icons.timer,
              warrantyDaysLeft <= 30 ? Colors.red.shade600 :
              warrantyDaysLeft <= 90 ? Colors.orange.shade600 : Colors.green.shade600,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildDateChip(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 12, color: color),
              const SizedBox(width: 4),
              Flexible(
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 9,
                    color: color,
                    fontWeight: FontWeight.w500,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(
              fontSize: 10,
              color: Colors.grey.shade800,
              fontWeight: FontWeight.w600,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    try {
      return DateFormatterUtils.formatToShortMonth(dateString);
    } catch (e) {
      return dateString;
    }
  }

  Widget _buildAssignButton(BuildContext context, String assetID) {
    return Container(
      width: double.infinity,
      padding: ResponsiveHelper.paddingSymmetric(context, horizontal: 4),
      child: CustomButton(
        type: ButtonType.outlined,
        borderRadius: 5,
        textColor: AppColors.blueColor,
        borderColor: AppColors.blueColor,
        color: Colors.black,
        text: "Assign To",
        onPressed: () async {
          print('Opening assignment modal for asset: $assetID');

          final result = await showModalBottomSheet<bool>(
            context: context,
            isScrollControlled: true,
            backgroundColor: Colors.transparent,
            builder: (modalContext) => ReassignBottomSheet(
              assetId: assetID,
              onAssignmentSuccess: () {
                print('Assignment success callback - refresh already done in bottom sheet');
                if (onAssignmentCompleted != null) {
                  onAssignmentCompleted!();
                }
              },
              onReassign: ({
                required String departmentId,
                required String departmentName,
                required String roleId,
                required String roleName,
                required String employeeId,
                required String employeeName,
              }) async {
                print('Legacy callback - Asset: $assetID assigned to $employeeName');
              },
            ),
          );

          print('Modal closed with result: $result');

          if (result == true) {
            print('Assignment was successful and list is already refreshed');
          } else if (result == false) {
            print('Assignment failed');
          } else {
            print('Modal was dismissed without assignment');
          }
        },
      ),
    );
  }
}