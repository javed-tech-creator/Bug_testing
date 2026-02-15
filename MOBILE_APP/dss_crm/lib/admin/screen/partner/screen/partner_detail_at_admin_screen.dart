import 'package:cached_network_image/cached_network_image.dart';
import 'package:dss_crm/admin/controller/admin_main_api_provider.dart';
import 'package:dss_crm/admin/screen/vendor/model/single_vendor_detail_at_admin_model.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/ui_helper/app_text_styles.dart';
import 'package:dss_crm/utils/image_loader_util.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

class PartnerDetailsBottomSheet extends StatefulWidget {
  final String vendorId;

  const PartnerDetailsBottomSheet({Key? key, required this.vendorId})
    : super(key: key);

  @override
  State<PartnerDetailsBottomSheet> createState() =>
      _PartnerDetailsBottomSheetState();

  static void show(BuildContext context, String vendorId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => PartnerDetailsBottomSheet(vendorId: vendorId),
    );
  }
}

class _PartnerDetailsBottomSheetState extends State<PartnerDetailsBottomSheet> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = context.read<AdminMainApiProvider>();

      // Now safe — frame is already built
      provider.clearSingleVendorDetail();
      provider.getPartnerSingleDraftDetail(context, widget.vendorId);
    });


  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: AppColors.whiteColor,
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(ResponsiveHelper.circleRadius(context, 20)),
            ),
          ),
          child: Column(
            children: [
              // Handle Bar
              Container(
                margin: ResponsiveHelper.paddingOnly(context, top: 8),
                width: ResponsiveHelper.containerWidth(context, 10) * 0.12,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

              // Header
              Container(
                padding: ResponsiveHelper.paddingSymmetric(
                  context,
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(color: Colors.grey[200]!, width: 1),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.business_center,
                      color: AppColors.primary,
                      size: ResponsiveHelper.iconSize(context, 24),
                    ),
                    ResponsiveHelper.sizedBoxWidth(context, 10),
                    Expanded(
                      child: Text(
                        'Vendor Details',
                        style: AppTextStyles.heading1(context).copyWith(
                          fontSize: ResponsiveHelper.fontSize(context, 18),
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(
                        Icons.close,
                        size: ResponsiveHelper.iconSize(context, 24),
                      ),
                      onPressed: () => Navigator.pop(context),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
              ),

              // Main Content
              Expanded(
                child: Consumer<AdminMainApiProvider>(
                  builder: (context, provider, child) {
                    if (provider.isLoading) {
                      return LoadingIndicatorUtils();
                    }

                    final response =
                        provider.getSingleVendorDetailsAtAdminModeResponse;
                    if (response?.data?.data == null) {
                      return Center(
                        child: Text(
                          'No vendor details found',
                          style: AppTextStyles.body1(
                            context,
                          ).copyWith(color: Colors.grey[600]),
                        ),
                      );
                    }

                    final vendor = response!.data!.data!;

                    return ListView(
                      controller: scrollController,
                      padding: ResponsiveHelper.paddingSymmetric(
                        context,
                        horizontal: 16,
                        vertical: 12,
                      ),
                      children: [
                        // Profile Image - Perfect Circle
                        Center(
                          child: Container(
                            width: ResponsiveHelper.containerWidth(context, 100),
                            height: ResponsiveHelper.containerHeight(context, 100),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.primary,
                                width: 3,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.15),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ClipOval(
                              child:
                                  vendor.profileImage?.publicUrl?.isNotEmpty ==
                                      true
                                  ? ImageLoaderUtil.cacheNetworkImage(
                                      vendor.profileImage!.publicUrl!,
                                      width: ResponsiveHelper.containerWidth(context, 100),
                                      height: ResponsiveHelper.containerHeight(context, 100),
                                      fit: BoxFit.cover,
                                    )
                                  : Container(
                                      color: Colors.grey[200],
                                      child: Icon(
                                        Icons.person,
                                        size: ResponsiveHelper.iconSize(context, 50,),
                                        color: Colors.grey[600],
                                      ),
                                    ),
                            ),
                          ),
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 20),

                        // Personal Information
                        _buildSection(
                          context,
                          title: 'Personal Information',
                          icon: Icons.person,
                          children: [
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.person_outline,
                              label: 'Contact Person',
                              value:
                                  vendor.contactPersonName?.isNotEmpty == true
                                  ? vendor.contactPersonName!
                                  : '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.business,
                              label: 'Business Name',
                              value: vendor.businessName?.isNotEmpty == true
                                  ? vendor.businessName!
                                  : '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.phone,
                              label: 'Contact Number',
                              value: vendor.contactNumber?.isNotEmpty == true
                                  ? vendor.contactNumber!
                                  : '-',
                              trailing: vendor.contactNumber?.isNotEmpty == true
                                  ? _callButton(
                                      () => _launchPhone(vendor.contactNumber!),
                                    )
                                  : null,
                            ),
                            if (vendor.alternateContact?.isNotEmpty ==
                                true) ...[
                              ResponsiveHelper.sizedBoxHeight(context, 10),
                              _buildImprovedInfoCard(
                                context,
                                icon: Icons.phone_android,
                                label: 'Alternate Contact',
                                value: vendor.alternateContact!,
                                trailing: _callButton(
                                  () => _launchPhone(vendor.alternateContact!),
                                ),
                              ),
                            ],
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.email,
                              label: 'Email',
                              value: vendor.email?.isNotEmpty == true
                                  ? vendor.email!
                                  : '-',
                              trailing: vendor.email?.isNotEmpty == true
                                  ? _emailButton(
                                      () => _launchEmail(vendor.email!),
                                    )
                                  : null,
                            ),
                          ],
                        ),

                        ResponsiveHelper.sizedBoxHeight(context, 12),

                        // Address Information
                        _buildSection(
                          context,
                          title: 'Address Information',
                          icon: Icons.location_on,
                          children: [
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.home,
                              label: 'Address',
                              value: vendor.address?.isNotEmpty == true
                                  ? vendor.address!
                                  : '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.location_city,
                              label: 'City',
                              value: vendor.city?.isNotEmpty == true
                                  ? vendor.city!
                                  : '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.map,
                              label: 'State',
                              value: vendor.state?.isNotEmpty == true
                                  ? vendor.state!
                                  : '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.pin_drop,
                              label: 'Pincode',
                              value: vendor.pincode?.isNotEmpty == true
                                  ? vendor.pincode!
                                  : '-',
                            ),
                          ],
                        ),

                        ResponsiveHelper.sizedBoxHeight(context, 12),

                        // KYC Details (Always Visible)
                        _buildSection(
                          context,
                          title: 'KYC Details',
                          icon: Icons.verified_user,
                          children: [
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.receipt_long,
                              label: 'GST Number',
                              value: vendor.gstNumber?.isNotEmpty == true
                                  ? vendor.gstNumber!
                                  : '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.credit_card,
                              label: 'PAN Number',
                              value: vendor.panNumber?.isNotEmpty == true
                                  ? vendor.panNumber!
                                  : '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.badge,
                              label: 'Aadhar Number',
                              value: vendor.aadharNumber?.isNotEmpty == true
                                  ? _maskAadhar(vendor.aadharNumber!)
                                  : '-',
                            ),
                          ],
                        ),

                        ResponsiveHelper.sizedBoxHeight(context, 12),

                        // Banking Details (Always Visible)
                        _buildSection(
                          context,
                          title: 'Banking Details',
                          icon: Icons.account_balance,
                          children: [
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.account_balance,
                              label: 'Bank Name',
                              value: vendor.bankName?.isNotEmpty == true
                                  ? vendor.bankName!
                                  : '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.numbers,
                              label: 'Account Number',
                              value: vendor.accountNumber?.isNotEmpty == true
                                  ? _maskAccount(vendor.accountNumber!)
                                  : '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.code,
                              label: 'IFSC Code',
                              value: vendor.ifscCode?.isNotEmpty == true
                                  ? vendor.ifscCode!
                                  : '-',
                            ),
                          ],
                        ),

                        ResponsiveHelper.sizedBoxHeight(context, 12),

                        // Contract Form
                        if (vendor.contractForm?.publicUrl?.isNotEmpty == true)
                          _buildSection(
                            context,
                            title: 'Contract Form',
                            icon: Icons.description,
                            children: [
                              InkWell(
                                onTap: () =>
                                    _launchURL(vendor.contractForm!.publicUrl!),
                                child: Container(
                                  padding: ResponsiveHelper.paddingAll(
                                    context,
                                    12,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.blue[50],
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: Colors.blue[200]!,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.picture_as_pdf,
                                        color: Colors.red,
                                        size: ResponsiveHelper.iconSize(context, 20),
                                      ),
                                      ResponsiveHelper.sizedBoxWidth(
                                        context,
                                        12,
                                      ),
                                      Expanded(
                                        child: Text(
                                          vendor.contractForm!.fileName ??
                                              'Contract.pdf',
                                          style: AppTextStyles.heading1(context).copyWith(
                                            fontSize: ResponsiveHelper.fontSize(context, 12),
                                            color: AppColors.blueColor
                                          ),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      Icon(
                                        Icons.open_in_new,
                                        color: Colors.blue[700],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),

                        if (vendor.contractForm?.publicUrl?.isNotEmpty == true)
                          ResponsiveHelper.sizedBoxHeight(context, 12),

                        // Additional Documents
                        if (vendor.additionalDocs != null &&
                            vendor.additionalDocs!.isNotEmpty)
                          _buildSection(
                            context,
                            title: 'Additional Documents',
                            icon: Icons.folder_open,
                            children: [
                              ...vendor.additionalDocs!.map(
                                (doc) => Padding(
                                  padding: ResponsiveHelper.paddingOnly(
                                    context,
                                    bottom: 8,
                                  ),
                                  child: InkWell(
                                    onTap: () =>
                                        _launchURL(doc.publicUrl ?? ''),
                                    child: Container(
                                      padding: ResponsiveHelper.paddingAll(
                                        context,
                                        12,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.grey[50],
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(
                                          color: Colors.grey[300]!,
                                        ),
                                      ),
                                      child: Row(
                                        children: [
                                          Icon(
                                            _getFileIcon(doc.fileType),
                                            color: AppColors.primary,
                                            size: ResponsiveHelper.iconSize(context, 20),
                                          ),
                                          ResponsiveHelper.sizedBoxWidth(
                                            context,
                                            12,
                                          ),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  doc.docTitle ?? 'Document',
                                                  style: AppTextStyles.heading1(context).copyWith(
                                                      fontSize: ResponsiveHelper.fontSize(context, 12),
                                                  ),
                                                ),
                                                if (doc.fileName != null)
                                                  Text(
                                                    doc.fileName!,
                                                    style: AppTextStyles.body1(context).copyWith(
                                                        fontSize: ResponsiveHelper.fontSize(context, 10),
                                                    ),
                                                    overflow:
                                                        TextOverflow.ellipsis,
                                                  ),
                                              ],
                                            ),
                                          ),
                                          Icon(
                                            Icons.open_in_new,
                                            color: Colors.grey[600],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),

                        if (vendor.additionalDocs != null &&
                            vendor.additionalDocs!.isNotEmpty)
                          ResponsiveHelper.sizedBoxHeight(context, 12),

                        // Status
                        _buildSection(
                          context,
                          title: 'Status',
                          icon: Icons.info_outline,
                          children: [
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.fingerprint,
                              label: 'Profile ID',
                              value: vendor.profileId ?? '-',
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 10),
                            _buildImprovedInfoCard(
                              context,
                              icon: Icons.circle,
                              label: 'Status',
                              value: vendor.isActive == true
                                  ? 'Active'
                                  : 'Inactive',
                              valueColor: vendor.isActive == true
                                  ? Colors.green
                                  : Colors.red,
                            ),
                          ],
                        ),

                        ResponsiveHelper.sizedBoxHeight(context, 30),
                      ],
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // Reusable Section
  Widget _buildSection(
    BuildContext context, {
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 12),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppColors.primary, size: ResponsiveHelper.iconSize(context, 20),),
              ResponsiveHelper.sizedBoxWidth(context, 8),
              Text(
                title,
                style: AppTextStyles.heading1(context).copyWith(
                  fontSize: ResponsiveHelper.fontSize(context, 12),
                ),
              ),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 12),
          ...children,
        ],
      ),
    );
  }

  // Improved Info Card
  Widget _buildImprovedInfoCard(
    BuildContext context, {
    required IconData icon,
    required String label,
    required String value,
    Widget? trailing,
    Color? valueColor,
  }) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: ResponsiveHelper.paddingAll(context, 8),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: AppColors.primary, size: ResponsiveHelper.iconSize(context, 18),),
          ),
          ResponsiveHelper.sizedBoxWidth(context, 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTextStyles.heading1(context).copyWith(
                    fontSize: ResponsiveHelper.fontSize(context, 10),
                    fontWeight: FontWeight.bold,
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 4),
                // Text(value, style: TextStyle(fontSize: 13, color: AppColors.primary ?? AppColors.primary)),
                Text(
                  value,
                  style: AppTextStyles.body1(
                    context,
                  ).copyWith(fontSize: ResponsiveHelper.fontSize(context, 12)),
                ),
              ],
            ),
          ),
          if (trailing != null) ...[
            ResponsiveHelper.sizedBoxWidth(context, 8),
            trailing,
          ],
        ],
      ),
    );
  }

  // Helper Buttons
  Widget _callButton(VoidCallback onTap) => InkWell(
    onTap: onTap,
    child: Container(
      padding: ResponsiveHelper.paddingAll(context, 8),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Icon(Icons.phone, color: AppColors.primary, size: ResponsiveHelper.iconSize(context, 16),),
    ),
  );

  Widget _emailButton(VoidCallback onTap) => InkWell(
    onTap: onTap,
    child: Container(
      padding: ResponsiveHelper.paddingAll(context, 8),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Icon(Icons.email, color: AppColors.primary, size: ResponsiveHelper.iconSize(context, 16),),
    ),
  );

  // Utilities
  String _maskAadhar(String aadhar) => aadhar.length < 4
      ? aadhar
      : 'XXXX-XXXX-${aadhar.substring(aadhar.length - 4)}';

  String _maskAccount(String account) => account.length < 4
      ? account
      : 'XXXXXXXX${account.substring(account.length - 4)}';

  IconData _getFileIcon(String? fileType) {
    if (fileType == null) return Icons.insert_drive_file;
    if (fileType.contains('pdf')) return Icons.picture_as_pdf;
    if (fileType.contains('image')) return Icons.image;
    return Icons.insert_drive_file;
  }

  Future<void> _launchPhone(String phone) async =>
      await canLaunchUrl(Uri.parse('tel:$phone'))
      ? await launchUrl(Uri.parse('tel:$phone'))
      : null;

  Future<void> _launchEmail(String email) async =>
      await canLaunchUrl(Uri.parse('mailto:$email'))
      ? await launchUrl(Uri.parse('mailto:$email'))
      : null;

  Future<void> _launchURL(String url) async =>
      await canLaunchUrl(Uri.parse(url))
      ? await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication)
      : null;
}
