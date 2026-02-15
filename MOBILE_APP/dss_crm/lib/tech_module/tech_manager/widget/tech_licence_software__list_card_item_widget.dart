 import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_licence_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/widget/assign_license_bottom_sheet_widget.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/date_formate_util.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../controller/tech_manager_api_provider.dart';
import '../model/asset_list_model.dart';
import 'assign_bottom_sheet_widget.dart';

class LicenceSoftwareItemCard extends StatelessWidget {
  final Data asset; // Using Data from your API model
  final VoidCallback? onTap;
  final VoidCallback? onAssignmentCompleted; // नया callback

  const LicenceSoftwareItemCard({Key? key, required this.asset, this.onTap,
    this.onAssignmentCompleted})
      : super(key: key);

  // const AssetCard({
  //   Key? key,
  //   required this.asset,
  //   this.onTap,
  //   this.onAssignmentCompleted, // नया parameter
  // }) : super(key: key);


  // bool get _hasAMCContract => asset.amcContract?.toLowerCase() == 'yes';

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: ResponsiveHelper.paddingOnly(context, bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(30),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            margin: ResponsiveHelper.paddingAll(context, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(context),
                ResponsiveHelper.sizedBoxHeight(context, 12),
                _buildMainContent(context),
                ResponsiveHelper.sizedBoxHeight(context, 12),
                _buildFooter(context),
                ResponsiveHelper.sizedBoxHeight(context, 6),
                _buildAssignButton(context,asset.sId.toString()), // Add the assign button
                ResponsiveHelper.sizedBoxHeight(context, 6),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        Container(
          margin: ResponsiveHelper.paddingAll(context, 10),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                AssetUtils.getTypeColor(asset.versionType ?? '').withAlpha(20),
                AssetUtils.getTypeColor(asset.versionType ?? '').withAlpha(40),
              ],
            ),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: AssetUtils.getTypeColor(asset.versionType ?? '').withOpacity(0.2),
            ),
          ),
          child: Padding(
            padding: ResponsiveHelper.paddingAll(context, 6),
            child: Icon(
              AssetUtils.getTypeIcon(asset.versionType ?? ''),
              color: AssetUtils.getTypeColor(asset.versionType ?? ''),
              size: ResponsiveHelper.iconSize(context, 20),
            ),
          ),
        ),
        ResponsiveHelper.sizedBoxWidth(context, 2),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                asset.softwareName ?? 'N/A',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 14),
                  ),
                ),
              ),
              ResponsiveHelper.sizedBoxHeight(context, 2),
              Text(
                'ID: ${asset.licenseId ?? ''}',
                style: AppTextStyles.body2(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMainContent(BuildContext context) {
    return Column(
      children: [
        _buildInfoTile(
          context,
          Icons.person_outline,
          'Assigned To',
          (asset.assignedTo == null || asset.assignedTo!.isEmpty)
              ? 'N/A'
              : asset.assignedTo!,
          Colors.blue,
        ),
        ResponsiveHelper.sizedBoxHeight(context, 12),
        Row(
          children: [
            Expanded(
              child: _buildInfoTile(
                context,
                Icons.business_outlined,
                'Department',
                (asset.department == null || asset.department!.isEmpty)
                    ? 'N/A'
                    : asset.department!,
                Colors.purple,
              ),
            ),
            ResponsiveHelper.sizedBoxWidth(context, 12),
            Expanded(
              child: _buildInfoTile(
                context,
                Icons.location_on_outlined,
                'Version Type',
                (asset.versionType == null || asset.versionType!.isEmpty)
                    ? 'N/A'
                    : asset.versionType!,
                Colors.orange,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoTile(
      BuildContext context,
      IconData icon,
      String label,
      String value,
      Color color,
      ) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 10),
      decoration: BoxDecoration(
        color: color.withAlpha(12),
        borderRadius: BorderRadius.circular(
          ResponsiveHelper.circleRadius(context, 12),
        ),
        border: Border.all(color: color.withAlpha(50)),
      ),
      child: Row(
        children: [
          Container(
            padding: ResponsiveHelper.paddingAll(context, 6),
            decoration: BoxDecoration(
              color: color.withAlpha(30),
              borderRadius: BorderRadius.circular(
                ResponsiveHelper.circleRadius(context, 8),
              ),
            ),
            child: Icon(
              icon,
              size: ResponsiveHelper.iconSize(context, 14),
              color: color,
            ),
          ),
          ResponsiveHelper.sizedBoxWidth(context, 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 8),
                    ),
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 2),
                Text(
                  value,
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(
                      color: Colors.black,
                      fontSize: ResponsiveHelper.fontSize(context, 10),
                    ),
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

  Widget _buildFooter(BuildContext context) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.txtGreyColor.withAlpha(30),
            AppColors.txtGreyColor.withAlpha(30),
          ],
        ),
        borderRadius: BorderRadius.circular(
          ResponsiveHelper.circleRadius(context, 12),
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _buildDateCard(
                  context,
                  'Validity',
                  "${DateFormatterUtils.formatToShortMonth(asset.validityStart)} To ${DateFormatterUtils.formatToShortMonth(asset.validityEnd)}",
                  Icons.calendar_month_outlined,
                  Colors.indigo,
                ),
              ),
            ],
          ),

        ],
      ),
    );
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return DateFormatterUtils.formatToShortMonth(dateString);
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  }

// Replace your current _buildAssignButton method in AssetCard with this:

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
            builder: (modalContext) => AssignLicenseBottomSheet(
              assetId: assetID,
              onAssignmentSuccess: () {
                print('Assignment success callback - refresh already done in bottom sheet');
                // Refresh is already handled in bottom sheet, so just log here
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

          // No need to refresh here anymore since it's done in bottom sheet
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

  Widget _buildDateCard(
      BuildContext context,
      String label,
      String value,
      IconData icon,
      Color color,
      ) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 10),
      decoration: BoxDecoration(
        color: AppColors.whiteColor,
        borderRadius: BorderRadius.circular(
          ResponsiveHelper.circleRadius(context, 10),
        ),
        border: Border.all(color: color.withAlpha(30)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                size: ResponsiveHelper.iconSize(context, 14),
                color: color,
              ),
              ResponsiveHelper.sizedBoxWidth(context, 6),
              Text(
                label,
                style: AppTextStyles.body2(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 10),
                  ),
                ),
              ),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 6),
          Text(
            value,
            style: AppTextStyles.body1(
              context,
              overrideStyle: TextStyle(
                color: Colors.black,
                fontSize: ResponsiveHelper.fontSize(context, 10),
              ),
            ),
          ),
        ],
      ),
    );
  }
}