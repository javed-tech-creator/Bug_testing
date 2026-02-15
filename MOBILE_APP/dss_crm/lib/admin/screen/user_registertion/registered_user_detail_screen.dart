import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:dss_crm/admin/model/user_register/get_admin_single_registered_user_details_model.dart' as UserModel;
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../controller/admin_main_api_provider.dart';

class UserDetailsBottomSheet extends StatefulWidget {
  final String userId;

  const UserDetailsBottomSheet({Key? key, required this.userId}) : super(key: key);

  @override
  State<UserDetailsBottomSheet> createState() => _UserDetailsBottomSheetState();
}

class _UserDetailsBottomSheetState extends State<UserDetailsBottomSheet> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadUserDetails();
    });
  }

  Future<void> _loadUserDetails() async {
    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    await provider.getAdminSingleRegisteredUserDetail(context, widget.userId);
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return '-';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd MMM yyyy, hh:mm a').format(date);
    } catch (e) {
      return '-';
    }
  }

  String _formatSimpleDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return '-';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd MMM yyyy').format(date);
    } catch (e) {
      return '-';
    }
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'active':
        return Colors.green;
      case 'inactive':
        return Colors.orange;
      case 'suspended':
        return Colors.red;
      case 'pending':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  String _getBoolText(bool? value) {
    if (value == null) return '-';
    return value ? 'Yes' : 'No';
  }

  String _getValueOrDash(dynamic value) {
    if (value == null) return '-';
    if (value is String && value.isEmpty) return '-';
    return value.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            spreadRadius: 0,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Handle Bar
          Container(
            margin: EdgeInsets.only(top: 12, bottom: 8),
            width: 50,
            height: 5,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(10),
            ),
          ),

          // Header
          Container(
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                bottom: BorderSide(color: Colors.grey.shade200, width: 1),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    'User Details',
                    style: AppTextStyles.heading1(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 20),
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1a1a1a),
                      ),
                    ),
                  ),
                ),
                Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.grey.shade50,
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: IconButton(
                    icon: Icon(Icons.close_rounded, size: 22),
                    onPressed: () => Navigator.pop(context),
                    color: Colors.grey.shade700,
                    padding: EdgeInsets.all(8),
                  ),
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: Consumer<AdminMainApiProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return Center(child: LoadingIndicatorUtils());
                }

                final response = provider.getAdminSingleRegisteredUserDetailModelResponse;

                if (response == null || !response.success) {
                  return _buildErrorState(response?.message ?? 'Unknown error occurred');
                }

                final user = response.data?.data?.user;

                if (user == null) {
                  return _buildEmptyState();
                }

                return SingleChildScrollView(
                  padding: EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Profile Header
                      _buildProfileHeader(user),
                      SizedBox(height: 20),

                      // Status Badge
                      // if (user.status != null) _buildStatusBadge(user.status!),
                      if (user.status != null) SizedBox(height: 24),

                      // Basic Information
                      _buildSection(
                        'Basic Information',
                        Icons.person_outline_rounded,
                        Color(0xFF3B82F6),
                        [
                          _buildDetailRow(Icons.email_outlined, 'Email', _getValueOrDash(user.email)),
                          _buildDetailRow(Icons.phone_outlined, 'Phone', _getValueOrDash(user.phone)),
                          _buildDetailRow(Icons.chat_outlined, 'WhatsApp', _getValueOrDash(user.whatsapp)),
                          _buildDetailRow(Icons.phone_android_outlined, 'Alternate No', _getValueOrDash(user.altPhone)),
                          _buildDetailRow(Icons.badge_outlined, 'User ID', _getValueOrDash(user.userId)),
                          _buildDetailRow(Icons.category_outlined, 'Type', _getValueOrDash(user.type)),
                        ],
                      ),

                      // Work Information
                      _buildSection(
                        'Work Information',
                        Icons.business_center_outlined,
                        Color(0xFFF59E0B),
                        [
                          _buildDetailRow(Icons.business_outlined, 'Branch', _getValueOrDash(user.branch?.title)),
                          _buildDetailRow(Icons.location_on_outlined, 'Branch Address', _getValueOrDash(user.branch?.address)),
                          _buildDetailRow(Icons.apartment_outlined, 'Department', _getValueOrDash(user.department?.title)),
                          _buildDetailRow(Icons.badge_outlined, 'Department ID', _getValueOrDash(user.department?.departmentId)),
                          _buildDetailRow(Icons.work_outline_rounded, 'Designation', _getValueOrDash(user.designation?.title)),
                          _buildDetailRow(Icons.badge_outlined, 'Designation ID', _getValueOrDash(user.designation?.designationId)),
                        ],
                      ),

                      // Location Information
                      _buildSection(
                        'Location Information',
                        Icons.location_on_outlined,
                        Color(0xFF10B981),
                        [
                          _buildDetailRow(Icons.public_outlined, 'Zone', _getValueOrDash(user.zone?.title)),
                          _buildDetailRow(Icons.location_city_outlined, 'State', _getValueOrDash(user.state?.title)),
                          _buildDetailRow(Icons.location_on_outlined, 'City', _getValueOrDash(user.city?.title)),
                        ],
                      ),

                      // Profile Information (Vendor/Partner Profile)
                      if (user.profile != null) _buildProfileSection(user.profile!),

                      // Manager Information
                      if (user.manageBy != null) _buildManagerSection(user.manageBy!),

                      // Preferences
                      // if (user.preferences != null) _buildPreferencesSection(user.preferences!),

                      // Action Groups
                      if (user.actionGroups != null && user.actionGroups!.isNotEmpty)
                        _buildActionGroupsSection(user.actionGroups!),

                      // Login History
                      if (user.loginHistory != null && user.loginHistory!.isNotEmpty)
                        _buildLoginHistorySection(user.loginHistory!),

                      // Account Information
                      _buildSection(
                        'Account Information',
                        Icons.account_circle_outlined,
                        Color(0xFF6366F1),
                        [
                          _buildDetailRow(Icons.verified_user_outlined, 'Email Verified', _getBoolText(user.emailVerified)),
                          _buildDetailRow(Icons.phone_android_outlined, 'Phone Verified', _getBoolText(user.phoneVerified)),
                          _buildDetailRow(Icons.chat_bubble_outline, 'WhatsApp Consent', _getBoolText(user.whatsappConsent)),
                          _buildDetailRow(Icons.verified_outlined, 'Account Verified', _getBoolText(user.isVerified)),
                          _buildDetailRow(Icons.login_outlined, 'Currently Logged In', _getBoolText(user.isLogin)),
                          _buildDetailRow(Icons.access_time_outlined, 'Last Login', _formatDate(user.lastLogin)),
                          _buildDetailRow(Icons.lock_outline, 'Failed Login Attempts', _getValueOrDash(user.failedLoginAttempts)),
                          _buildDetailRow(Icons.lock_clock_outlined, 'Lock Until', _getValueOrDash(user.lockUntil)),
                          _buildDetailRow(Icons.calendar_today_outlined, 'Created At', _formatDate(user.createdAt)),
                          _buildDetailRow(Icons.update_outlined, 'Updated At', _formatDate(user.updatedAt)),
                          if (user.deletedAt != null)
                            _buildDetailRow(Icons.delete_outline, 'Deleted At', _formatDate(user.deletedAt)),
                        ],
                      ),

                      SizedBox(height: 20),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileHeader(UserModel.User user) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF667eea), Color(0xFF764ba2)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF667eea).withOpacity(0.3),
            blurRadius: 15,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          // Profile Image
          Container(
            width: ResponsiveHelper.containerWidth(context, 70),
            height: ResponsiveHelper.containerHeight(context, 70),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 4),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 10,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: ClipOval(
              child: _buildFallbackAvatar(user.name, 34),
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _getValueOrDash(user.name),
                  style: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 20),
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 0.5,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 6),
                Row(
                  children: [
                    Icon(Icons.badge_outlined, color: Colors.white70, size: 14),
                    SizedBox(width: 4),
                    Text(
                      _getValueOrDash(user.userId),
                      style: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 13),
                        color: Colors.white70,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.email_outlined, color: Colors.white70, size: 14),
                    SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        _getValueOrDash(user.email),
                        style: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 12),
                          color: Colors.white70,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.phone_outlined, color: Colors.white70, size: 14),
                    SizedBox(width: 4),
                    Text(
                      _getValueOrDash(user.phone),
                      style: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 12),
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: _getStatusColor(status).withOpacity(0.1),
        borderRadius: BorderRadius.circular(25),
        border: Border.all(color: _getStatusColor(status), width: 2),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              color: _getStatusColor(status),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: _getStatusColor(status).withOpacity(0.5),
                  blurRadius: 4,
                  spreadRadius: 1,
                ),
              ],
            ),
          ),
          SizedBox(width: 10),
          Text(
            status.toUpperCase(),
            style: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 13),
              fontWeight: FontWeight.w700,
              color: _getStatusColor(status),
              letterSpacing: 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection(UserModel.Profile profile) {
    return _buildSection(
      'Profile Information',
      Icons.store_outlined,
      Color(0xFF8B5CF6),
      [
        _buildDetailRow(Icons.badge_outlined, 'Profile ID', _getValueOrDash(profile.profileId)),
        _buildDetailRow(Icons.person_outline, 'Contact Person', _getValueOrDash(profile.contactPersonName)),
        _buildDetailRow(Icons.phone_outlined, 'Contact Number', _getValueOrDash(profile.contactNumber)),
        _buildDetailRow(Icons.phone_android_outlined, 'Alternate Contact', _getValueOrDash(profile.alternateContact)),
        _buildDetailRow(Icons.email_outlined, 'Email', _getValueOrDash(profile.email)),
        _buildDetailRow(Icons.business_outlined, 'Business Name', _getValueOrDash(profile.businessName)),
        _buildDetailRow(Icons.location_on_outlined, 'Address', _getValueOrDash(profile.address)),
        _buildDetailRow(Icons.location_city_outlined, 'City', _getValueOrDash(profile.city)),
        _buildDetailRow(Icons.map_outlined, 'State', _getValueOrDash(profile.state)),
        _buildDetailRow(Icons.pin_drop_outlined, 'Pincode', _getValueOrDash(profile.pincode)),
        _buildDetailRow(Icons.receipt_long_outlined, 'GST Number', _getValueOrDash(profile.gstNumber)),
        _buildDetailRow(Icons.credit_card_outlined, 'PAN Number', _getValueOrDash(profile.panNumber)),
        _buildDetailRow(Icons.badge_outlined, 'Aadhar Number', _getValueOrDash(profile.aadharNumber)),
        _buildDetailRow(Icons.account_balance_outlined, 'Bank Name', _getValueOrDash(profile.bankName)),
        _buildDetailRow(Icons.numbers_outlined, 'Account Number', _getValueOrDash(profile.accountNumber)),
        _buildDetailRow(Icons.code_outlined, 'IFSC Code', _getValueOrDash(profile.ifscCode)),
        _buildDetailRow(Icons.toggle_on_outlined, 'Is Active', _getBoolText(profile.isActive)),
      ],
    );
  }

  Widget _buildManagerSection(UserModel.ManageBy manager) {
    return _buildSection(
      'Manager Information',
      Icons.supervisor_account_outlined,
      Color(0xFFEC4899),
      [
        _buildDetailRow(Icons.person_outline, 'Name', _getValueOrDash(manager.name)),
        _buildDetailRow(Icons.email_outlined, 'Email', _getValueOrDash(manager.email)),
        _buildDetailRow(Icons.phone_outlined, 'Phone', _getValueOrDash(manager.phone)),
        _buildDetailRow(Icons.badge_outlined, 'User ID', _getValueOrDash(manager.userId)),
        _buildDetailRow(Icons.work_outline, 'Designation', _getValueOrDash(manager.designation?.title)),
      ],
    );
  }

  Widget _buildPreferencesSection(UserModel.Preferences preferences) {
    return _buildSection(
      'Notification Preferences',
      Icons.notifications_outlined,
      Color(0xFFFBBF24),
      [
        _buildPreferenceRow('Email Notifications', preferences.email),
        _buildPreferenceRow('SMS Notifications', preferences.sms),
        _buildPreferenceRow('Push Notifications', preferences.push),
        _buildPreferenceRow('In-App Notifications', preferences.inApp),
        _buildPreferenceRow('WhatsApp Notifications', preferences.whatsapp),
      ],
    );
  }

  Widget _buildPreferenceRow(String label, bool? value) {
    final isEnabled = value == true;
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isEnabled ? Colors.green.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isEnabled ? Icons.check_circle_rounded : Icons.cancel_rounded,
              size: 18,
              color: isEnabled ? Colors.green : Colors.grey,
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: AppTextStyles.body1(
                context,
                overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 10),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: isEnabled ? Colors.green.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isEnabled ? Colors.green : Colors.grey,
                width: 1.5,
              ),
            ),
            child: Text(
              isEnabled ? 'Enabled' : 'Disabled',
              style: TextStyle(
                fontSize: ResponsiveHelper.fontSize(context, 11),
                fontWeight: FontWeight.w600,
                color: isEnabled ? Colors.green : Colors.grey,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionGroupsSection(List<UserModel.ActionGroups> actionGroups) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.only(bottom: 12),
          child: Row(
            children: [
              Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Color(0xFF8B5CF6).withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.security_outlined,
                  size: 20,
                  color: Color(0xFF8B5CF6),
                ),
              ),
              SizedBox(width: 12),
              Text(
                'Action Groups & Permissions',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 14),
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1a1a1a),
                  ),
                ),
              ),
            ],
          ),
        ),
        ...actionGroups.map((group) => _buildActionGroupCard(group)).toList(),
      ],
    );
  }

  Widget _buildActionGroupCard(UserModel.ActionGroups group) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.shade100,
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.group_work_outlined,
                size: 20,
                color: Color(0xFF8B5CF6),
              ),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  _getValueOrDash(group.title),
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF1a1a1a),
                      fontSize: ResponsiveHelper.fontSize(context, 14),
                    ),
                  ),
                ),
              ),
            ],
          ),
          if (group.description != null && group.description!.isNotEmpty) ...[
            SizedBox(height: 8),
            Text(
              group.description!,
              style: AppTextStyles.caption(
                context,
                overrideStyle: TextStyle(
                  color: Colors.grey.shade600,
                  fontSize: ResponsiveHelper.fontSize(context, 12),
                ),
              ),
            ),
          ],
          if (group.permissions != null) ...[
            SizedBox(height: 16),
            if (group.permissions!.crud != null && group.permissions!.crud!.isNotEmpty)
              _buildPermissionSection('CRUD', group.permissions!.crud!, Color(0xFF3B82F6)),
            if (group.permissions!.workflow != null && group.permissions!.workflow!.isNotEmpty)
              _buildPermissionSection('Workflow', group.permissions!.workflow!, Color(0xFF10B981)),
            if (group.permissions!.data != null && group.permissions!.data!.isNotEmpty)
              _buildPermissionSection('Data', group.permissions!.data!, Color(0xFFF59E0B)),
            if (group.permissions!.system != null && group.permissions!.system!.isNotEmpty)
              _buildPermissionSection('System', group.permissions!.system!, Color(0xFF8B5CF6)),
          ],
        ],
      ),
    );
  }

  Widget _buildPermissionSection(String title, List<String> permissions, Color color) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            // style: TextStyle(
            //   fontSize: ResponsiveHelper.fontSize(context, 13),
            //   fontWeight: FontWeight.w600,
            //   color: color,
            // ),
            style: AppTextStyles.heading2(
              context,
              overrideStyle: TextStyle(
                fontSize: ResponsiveHelper.fontSize(context, 14),
                color: color,
              ),
            ),
          ),
          SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: permissions.map((perm) => _buildPermissionChip(perm, color)).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildPermissionChip(String permission, Color color) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Text(
        permission,
        style: AppTextStyles.heading2(
          context,
          overrideStyle: TextStyle(
            fontSize: ResponsiveHelper.fontSize(context, 10),
            color: color,
          ),
        ),
      ),
    );
  }

  Widget _buildLoginHistorySection(List<UserModel.LoginHistory> loginHistory) {
    return _buildSection(
      'Recent Login History',
      Icons.history_outlined,
      Color(0xFF78350F),
      loginHistory.take(5).map((history) {
        return Container(
          margin: EdgeInsets.only(bottom: 12),
          padding: EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Row(
            children: [
              Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.devices_outlined,
                  size: 18,
                  color: Colors.blue,
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _getValueOrDash(history.device),
                      style: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 13),
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF1a1a1a),
                      ),
                    ),
                    SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.language, size: 12, color: Colors.grey.shade600),
                        SizedBox(width: 4),
                        Text(
                          _getValueOrDash(history.ip),
                          style: TextStyle(
                            fontSize: ResponsiveHelper.fontSize(context, 11),
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.access_time, size: 12, color: Colors.grey.shade600),
                        SizedBox(width: 4),
                        Text(
                          _formatDate(history.timestamp),
                          style: TextStyle(
                            fontSize: ResponsiveHelper.fontSize(context, 11),
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSection(String title, IconData icon, Color color, List<Widget> children) {
    return Container(
      margin: EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.shade100,
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withOpacity(0.05),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 20, color: color),
                ),
                SizedBox(width: 12),
                Text(
                  title,
                  style: AppTextStyles.heading2(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 14),
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1a1a1a),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(children: children),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              size: ResponsiveHelper.iconSize(context, 16),
              color: Colors.blue.shade700,
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 10),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  value,
                  style: AppTextStyles.heading2(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 10),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFallbackAvatar(String? name, double fontSize) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF667eea), Color(0xFF764ba2)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          name != null && name.isNotEmpty ? name.substring(0, 1).toUpperCase() : 'U',
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildErrorState(String message) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.error_outline_rounded,
                size: 64,
                color: Colors.red.shade400,
              ),
            ),
            SizedBox(height: 24),
            Text(
              'Failed to Load User Details',
              style: AppTextStyles.heading2(
                context,
                overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 18),
                  fontWeight: FontWeight.w700,
                ),
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 12),
            Text(
              message,
              style: AppTextStyles.body2(
                context,
                overrideStyle: TextStyle(
                  color: Colors.grey.shade600,
                ),
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 28),
            ElevatedButton.icon(
              onPressed: _loadUserDetails,
              icon: Icon(Icons.refresh_rounded, size: 20),
              label: Text(
                'Retry',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF3B82F6),
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.person_off_outlined,
                size: 64,
                color: Colors.grey.shade400,
              ),
            ),
            SizedBox(height: 24),
            Text(
              'User Data Not Found',
              style: AppTextStyles.heading2(
                context,
                overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 18),
                  fontWeight: FontWeight.w700,
                ),
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 12),
            Text(
              'The user information could not be retrieved',
              style: AppTextStyles.body2(
                context,
                overrideStyle: TextStyle(
                  color: Colors.grey.shade600,
                ),
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 28),
            ElevatedButton.icon(
              onPressed: _loadUserDetails,
              icon: Icon(Icons.refresh_rounded, size: 20),
              label: Text(
                'Try Again',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF3B82F6),
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}