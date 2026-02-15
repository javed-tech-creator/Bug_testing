import 'package:dss_crm/tech_module/tech_employee/model/tech_engineerr_software_licence_list_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/date_formate_util.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../../tech_manager/model/asset_list_model.dart';
import '../../../tech_manager/widget/assign_bottom_sheet_widget.dart';

class TechEngineerLicenceSoftwareCard extends StatelessWidget {
  final Data license;
  final VoidCallback? onTap;
  final VoidCallback? onAssignmentCompleted;

  const TechEngineerLicenceSoftwareCard({
    Key? key,
    required this.license,
    this.onTap,
    this.onAssignmentCompleted,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: ResponsiveHelper.paddingOnly(context, bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Background pattern
          Positioned.fill(
            child: Opacity(
              opacity: 0.04,
              child: CustomPaint(
                painter: DiagonalLinesPainter(),
              ),
            ),
          ),

          // Main content
          InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(context),
                  const SizedBox(height: 16),
                  _buildLicenseDetails(context),
                  const SizedBox(height: 16),
                  _buildFooter(context),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: Colors.blue.shade50,
            borderRadius: BorderRadius.circular(10),
            boxShadow: [
              BoxShadow(
                color: Colors.blue.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Icon(
            Icons.computer_rounded,
            color: AppColors.blueColor,
            size: 28,
          ),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                license.softwareName ?? 'Unknown Software',
                style: AppTextStyles.heading2(context).copyWith(
                  fontWeight: FontWeight.w600,
                  color: Colors.grey.shade900,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Text(
                      'ID: ${license.licenseId ?? 'N/A'}',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: _getExpiryColor().withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: _getExpiryColor().withOpacity(0.2)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                _getExpiryIcon(),
                size: 14,
                color: _getExpiryColor(),
              ),
              const SizedBox(width: 4),
              Text(
                license.expireIn ?? 'N/A',
                style: TextStyle(
                  fontSize: 11,
                  color: _getExpiryColor(),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildLicenseDetails(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        children: [
          if (license.assignedTo?.name != null)
            _buildDetailRow(
              Icons.person_outline,
              'Assigned To',
              license.assignedTo!.name!,
              AppColors.blueColor,
            ),
          if (license.assignedTo?.name != null) const SizedBox(height: 12),
          Row(
            children: [
              if (license.assignedTo?.department != null)
                Expanded(
                  child: _buildDetailRow(
                    Icons.business,
                    'Department',
                    license.assignedTo!.department!,
                    Colors.purple.shade600,
                    isCompact: true,
                  ),
                ),
              if (license.assignedTo?.department != null && license.assignedTo?.role != null)
                const SizedBox(width: 12),
              if (license.assignedTo?.role != null)
                Expanded(
                  child: _buildDetailRow(
                    Icons.work_outline,
                    'Role',
                    license.assignedTo!.role!,
                    Colors.green.shade600,
                    isCompact: true,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value, Color color, {bool isCompact = false}) {
    return Row(
      children: [
        Container(
          width: isCompact ? 32 : 36,
          height: isCompact ? 32 : 36,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: Icon(
            icon,
            size: isCompact ? 16 : 18,
            color: color,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: isCompact ? 11 : 12,
                  color: Colors.grey.shade600,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  fontSize: isCompact ? 13 : 14,
                  color: Colors.grey.shade900,
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

  Widget _buildFooter(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildDateChip(
            'Valid Till',
            _formatDate(license.validityEnd),
            Icons.event_available,
            Colors.teal.shade600,
          ),
        ),
        if (license.assignedTo?.date != null) ...[
          const SizedBox(width: 12),
          Expanded(
            child: _buildDateChip(
              'Assigned',
              _formatDate(license.assignedTo!.date),
              Icons.calendar_today,
              Colors.indigo.shade600,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildDateChip(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.15)),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(icon, size: 16, color: color),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 10,
                    color: color,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade900,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getExpiryColor() {
    final expireText = license.expireIn?.toLowerCase() ?? '';
    if (expireText.contains('expired')) {
      return Colors.red.shade600;
    } else if (expireText.contains('days') && expireText.contains('30')) {
      return Colors.orange.shade600;
    } else {
      return Colors.green.shade600;
    }
  }

  IconData _getExpiryIcon() {
    final expireText = license.expireIn?.toLowerCase() ?? '';
    if (expireText.contains('expired')) {
      return Icons.error_outline;
    } else if (expireText.contains('days') && expireText.contains('30')) {
      return Icons.warning_amber;
    } else {
      return Icons.check_circle_outline;
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    try {
      return DateFormatterUtils.formatToShortMonth(dateString);
    } catch (e) {
      return dateString;
    }
  }

  Widget _buildAssignButton(BuildContext context, String licenseID) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 16),
      child: CustomButton(
        type: ButtonType.outlined,
        borderRadius: 8,
        textColor: AppColors.blueColor,
        borderColor: AppColors.blueColor,
        text: "Assign To",
        onPressed: () async {
          final result = await showModalBottomSheet<bool>(
            context: context,
            isScrollControlled: true,
            backgroundColor: Colors.transparent,
            builder: (modalContext) => ReassignBottomSheet(
              assetId: licenseID,
              onAssignmentSuccess: () {
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
                // Handle reassignment
              },
            ),
          );

          if (result == true) {
            // Assignment was successful
          }
        },
      ),
    );
  }
}

// Custom painter for diagonal lines pattern
class DiagonalLinesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    const spacing = 20.0;
    final offset = size.width / 2;

    // Draw diagonal lines
    for (double i = -size.height; i < size.width; i += spacing) {
      canvas.drawLine(
        Offset(i - offset, 0),
        Offset(i + size.height - offset, size.height),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}