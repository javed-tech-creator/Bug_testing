import 'package:dss_crm/admin/screen/user_registertion/edit_registered_user_detail_screen.dart';
import 'package:dss_crm/admin/screen/user_registertion/registered_user_detail_screen.dart';
import 'package:dss_crm/admin/screen/user_registertion/create_user_registration_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dss_crm/admin/model/user_register/get_all_admin_registered_user_list_model.dart';
import 'package:intl/intl.dart';

import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../controller/admin_main_api_provider.dart';

class AdminRegisteredUserListScreen extends StatefulWidget {
  const AdminRegisteredUserListScreen({Key? key}) : super(key: key);

  @override
  State<AdminRegisteredUserListScreen> createState() =>
      _AdminRegisteredUserListScreenState();
}

class _AdminRegisteredUserListScreenState
    extends State<AdminRegisteredUserListScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadUserList();
    });
  }

  Future<void> _loadUserList() async {
    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    await provider.getAllAdminRegisteredUserList(context);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Users> _filterUsers(List<Users> users) {
    if (_searchQuery.isEmpty) return users;

    return users.where((user) {
      final searchLower = _searchQuery.toLowerCase();
      return (user.name?.toLowerCase().contains(searchLower) ?? false) ||
          (user.email?.toLowerCase().contains(searchLower) ?? false) ||
          (user.phone?.contains(searchLower) ?? false) ||
          (user.userId?.toLowerCase().contains(searchLower) ?? false) ||
          (user.department?.toLowerCase().contains(searchLower) ?? false);
    }).toList();
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'active':
        return Colors.green;
      case 'inactive':
        return Colors.orange;
      case 'suspended':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd MMM yyyy').format(date);
    } catch (e) {
      return 'N/A';
    }
  }

  void _navigateToEditUser(Users user) async {
    final result = await Navigator.push<bool>(
      context,
      MaterialPageRoute(builder: (_) => EditAdminUserScreen(userId: user.sId ?? '')),
    );

    // Only refresh if API returned true
    if (result == true) {
      _loadUserList();
    }
  }

  Future<void> _toggleUserStatus(Users user) async {
    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);

    // Determine new status based on current status
    final currentStatus = user.status ?? 'Inactive';
    final newStatus = currentStatus == 'Active' ? 'Inactive' : 'Active';

    final requestBody = {
      'status': newStatus,
    };

    await provider.changeAdminUserRegisterStatus(
      context,
      user.sId ?? '',
      requestBody,
    );

    // Reload the list after status change
    if (provider.changeAdminUserRegisterStatusModelResponse?.success == true) {
      _loadUserList();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        iconTheme: const IconThemeData(color: Colors.white),
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: Text(
          'Registered Users',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              color: AppColors.whiteColor,
              fontSize: ResponsiveHelper.fontSize(context, 14),
            ),
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            height: 1,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.grey[200]!, Colors.grey[100]!],
              ),
            ),
          ),
        ),
        actions: [
          IconButton(
            onPressed: _loadUserList,
            icon: const Icon(Icons.refresh_rounded),
          ),
          const SizedBox(width: 8),
          IconButton(
            onPressed: () async {
              final result = await Navigator.push<bool>(
                context,
                MaterialPageRoute(builder: (_) => const AddNewUserFormScreen()),
              );

              if (result == true) {
                _loadUserList();
              }
            },
            icon: const Icon(Icons.add_rounded),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Consumer<AdminMainApiProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return LoadingIndicatorUtils();
          }

          final response = provider.getAllAdminRegisteredUserListModelResponse;
          if (response == null || response.data?.data?.users == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.person_off_outlined,
                    size: ResponsiveHelper.iconSize(context, 80),
                    color: Colors.grey.shade400,
                  ),
                  ResponsiveHelper.sizedBoxHeight(context, 16),
                  Text(
                    'No users found',
                    style: AppTextStyles.body1(
                      context,
                      overrideStyle: TextStyle(color: Colors.grey.shade600),
                    ),
                  ),
                ],
              ),
            );
          }

          final allUsers = response.data?.data?.users ?? [];
          final filteredUsers = _filterUsers(allUsers);

          return Column(
            children: [
              // Search Bar
              Container(
                color: Colors.white,
                padding: ResponsiveHelper.paddingAll(context, 16),
                child: CustomTextField(
                  controller: _searchController,
                  hintText: 'Search by name, email, phone, or employee ID...',
                  prefixIcon: Icons.search,
                  onChanged: (value) {
                    setState(() {
                      _searchQuery = value;
                    });
                  },
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                    icon: Icon(
                      Icons.clear,
                      color: Colors.grey.shade600,
                      size: ResponsiveHelper.iconSize(context, 20),
                    ),
                    onPressed: () {
                      setState(() {
                        _searchController.clear();
                        _searchQuery = '';
                      });
                    },
                  )
                      : null,
                  onClear: () {
                    setState(() {
                      _searchQuery = '';
                    });
                  },
                  validationType: ValidationType.none,
                  keyboardType: TextInputType.text,
                ),
              ),

              // User List
              Expanded(
                child: filteredUsers.isEmpty
                    ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.search_off,
                        size: ResponsiveHelper.iconSize(context, 80),
                        color: Colors.grey.shade400,
                      ),
                      ResponsiveHelper.sizedBoxHeight(context, 16),
                      Text(
                        'No users match your search',
                        style: AppTextStyles.body1(
                          context,
                          overrideStyle:
                          TextStyle(color: Colors.grey.shade600),
                        ),
                      ),
                    ],
                  ),
                )
                    : RefreshIndicator(
                  onRefresh: _loadUserList,
                  color: const Color(0xFF3498DB),
                  child: ListView.builder(
                    padding: ResponsiveHelper.paddingAll(context, 16),
                    itemCount: filteredUsers.length,
                    itemBuilder: (context, index) {
                      final user = filteredUsers[index];
                      return _buildUserCard(user);
                    },
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showUserDetailsBottomSheet(Users user) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => UserDetailsBottomSheet(userId: user.sId ?? ''),
    );
  }

  Widget _buildUserCard(Users user) {
    final isActive = user.status?.toLowerCase() == 'active';

    return Container(
      margin: ResponsiveHelper.paddingOnly(context, bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: ResponsiveHelper.elevation(context, 15),
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: ResponsiveHelper.borderRadiusAll(context, 20),
          onTap: () => _showUserDetailsBottomSheet(user),
          child: Padding(
            padding: ResponsiveHelper.paddingAll(context, 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Row with Avatar, Name, Status Switch
                Row(
                  children: [
                    // Avatar
                    Container(
                      width: ResponsiveHelper.containerWidth(context, 40),
                      height: ResponsiveHelper.containerWidth(context, 40),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFF667eea), Color(0xFF764ba2)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: ResponsiveHelper.borderRadiusAll(context, 8),
                        boxShadow: [
                          BoxShadow(
                            color: Color(0xFF667eea).withOpacity(0.3),
                            blurRadius: 8,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          user.name?.substring(0, 1).toUpperCase() ?? 'U',
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.white,
                              fontSize:
                              ResponsiveHelper.fontSize(context, 16),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                    ResponsiveHelper.sizedBoxWidth(context, 14),

                    // Name and ID
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user.name ?? 'N/A',
                            style: AppTextStyles.heading1(
                              context,
                              overrideStyle: TextStyle(
                                fontSize:
                                ResponsiveHelper.fontSize(context, 14),
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF1a1a1a),
                              ),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          ResponsiveHelper.sizedBoxHeight(context, 2),
                          if (user.userId != null)
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.badge_outlined,
                                  size: ResponsiveHelper.iconSize(context, 12),
                                  color: Colors.grey.shade600,
                                ),
                                SizedBox(width: 4),
                                Text(
                                  user.userId!,
                                  style: AppTextStyles.body1(
                                    context,
                                    overrideStyle: TextStyle(
                                      fontSize: ResponsiveHelper.fontSize(
                                          context, 12),
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                        ],
                      ),
                    ),

                    // Status Switch
                    Transform.scale(
                      scale: 0.85,
                      child: Switch(
                        value: isActive,
                        onChanged: (value) {
                          _toggleUserStatus(user);
                        },
                        activeColor: Colors.white,
                        activeTrackColor: Colors.green,
                        inactiveThumbColor: Colors.white,
                        inactiveTrackColor: Colors.grey.shade400,
                      ),
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 14),

                // Divider
                Divider(
                  color: Colors.grey.shade200,
                  thickness: 1,
                  height: 1,
                ),

                ResponsiveHelper.sizedBoxHeight(context, 14),

                // Contact Information
                _buildInfoRow(
                  Icons.email_outlined,
                  'Email',
                  user.email ?? 'N/A',
                ),
                ResponsiveHelper.sizedBoxHeight(context, 12),
                _buildInfoRow(
                  Icons.phone_outlined,
                  'Phone',
                  user.phone ?? 'N/A',
                ),

                // Work Information
                if (user.designation != null || user.department != null) ...[
                  ResponsiveHelper.sizedBoxHeight(context, 14),
                  Divider(
                    color: Colors.grey.shade200,
                    thickness: 1,
                    height: 1,
                  ),
                  ResponsiveHelper.sizedBoxHeight(context, 14),
                  _buildInfoRow(
                    Icons.work_outline_rounded,
                    'Role',
                    '${user.designation ?? 'N/A'} ${user.department != null ? '• ${user.department}' : ''}',
                  ),
                ],

                if (user.branch != null) ...[
                  ResponsiveHelper.sizedBoxHeight(context, 12),
                  _buildInfoRow(
                    Icons.business_outlined,
                    'Branch',
                    user.branch!,
                  ),
                ],

                // Location Information
                if (user.zone != null ||
                    user.state != null ||
                    user.city != null) ...[
                  ResponsiveHelper.sizedBoxHeight(context, 12),
                  _buildInfoRow(
                    Icons.location_on_outlined,
                    'Location',
                    [user.city, user.state, user.zone]
                        .where((e) => e != null)
                        .join(', '),
                  ),
                ],

                // Footer with Created Date and Edit Button
                ResponsiveHelper.sizedBoxHeight(context, 14),
                Divider(
                  color: Colors.grey.shade200,
                  thickness: 1,
                  height: 1,
                ),
                ResponsiveHelper.sizedBoxHeight(context, 14),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Created Date
                    Row(
                      children: [
                        Icon(
                          Icons.calendar_today_outlined,
                          size: ResponsiveHelper.iconSize(context, 16),
                          color: Colors.grey.shade600,
                        ),
                        SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Created At',
                              style: AppTextStyles.body1(
                                context,
                                overrideStyle: TextStyle(
                                  fontSize:
                                  ResponsiveHelper.fontSize(context, 8),
                                ),
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              _formatDate(user.createdAt),
                              style: AppTextStyles.heading2(
                                context,
                                overrideStyle: TextStyle(
                                  fontSize:
                                  ResponsiveHelper.fontSize(context, 10),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Edit Button
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF3B82F6).withOpacity(0.1),
                        borderRadius:
                        ResponsiveHelper.borderRadiusAll(context, 12),
                      ),
                      child: IconButton(
                        icon: Icon(
                          Icons.edit_outlined,
                          color: const Color(0xFF3B82F6),
                          size: ResponsiveHelper.iconSize(context, 20),
                        ),
                        onPressed: () => _navigateToEditUser(user),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: Color(0xFF3B82F6).withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            size: ResponsiveHelper.iconSize(context, 14),
            color: Color(0xFF3B82F6),
          ),
        ),
        ResponsiveHelper.sizedBoxWidth(context, 10),
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
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              ResponsiveHelper.sizedBoxHeight(context, 3),
              Text(
                value,
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 10),
                  ),
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }
}