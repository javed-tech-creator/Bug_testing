import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/default_common_app_bar.dart';

// This is a stateful widget that represents the Training & Development screen.
class TrainingDevelopmentScreen extends StatefulWidget {
  const TrainingDevelopmentScreen({super.key});

  @override
  State<TrainingDevelopmentScreen> createState() =>
      _TrainingDevelopmentScreenState();
}

// This handles the state of the screen.
class _TrainingDevelopmentScreenState extends State<TrainingDevelopmentScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  // Enhanced dummy data with complete employee information
  final List<Map<String, dynamic>> trainingRequests = [
    {
      'employeeName': 'Rahul Sharma',
      'employeeId': 'EMP001',
      'department': 'Information Technology',
      'designation': 'Senior Developer',
      'trainingTopic': 'Advanced Data Analytics',
      'trainingDuration': '3 months',
      'requestDate': '15 Aug 2025',
      'status': 'Pending',
      'priority': 'High',
      'email': 'rahul.sharma@company.com',
      'phone': '+91 9876543210',
      'profileImage': null,
    },
    {
      'employeeName': 'Priya Singh',
      'employeeId': 'EMP002',
      'department': 'Project Management',
      'designation': 'Project Manager',
      'trainingTopic': 'Project Management Professional (PMP)',
      'trainingDuration': '4 months',
      'requestDate': '12 Aug 2025',
      'status': 'Approved',
      'priority': 'Medium',
      'email': 'priya.singh@company.com',
      'phone': '+91 9988776655',
      'profileImage': null,
    },
    {
      'employeeName': 'Amit Kumar',
      'employeeId': 'EMP003',
      'department': 'Marketing',
      'designation': 'Marketing Executive',
      'trainingTopic': 'Digital Marketing Mastery',
      'trainingDuration': '2 months',
      'requestDate': '10 Aug 2025',
      'status': 'Pending',
      'priority': 'Low',
      'email': 'amit.kumar@company.com',
      'phone': '+91 9123456789',
      'profileImage': null,
    },
    {
      'employeeName': 'Neha Gupta',
      'employeeId': 'EMP004',
      'department': 'Human Resources',
      'designation': 'HR Executive',
      'trainingTopic': 'Employee Relations & Conflict Resolution',
      'trainingDuration': '6 weeks',
      'requestDate': '08 Aug 2025',
      'status': 'In Progress',
      'priority': 'High',
      'email': 'neha.gupta@company.com',
      'phone': '+91 9876123450',
      'profileImage': null,
    },
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  // Function to make phone calls
  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(scheme: 'tel', path: phoneNumber);
    try {
      if (await canLaunchUrl(launchUri)) {
        await launchUrl(launchUri);
      } else {
        _showSnackBar('Could not launch phone dialer', Colors.red);
      }
    } catch (e) {
      _showSnackBar('Error launching phone dialer', Colors.red);
    }
  }

  // Function to send email
  Future<void> _sendEmail(String email, String subject, String body) async {
    final Uri launchUri = Uri(
      scheme: 'mailto',
      path: email,
      query: 'subject=$subject&body=$body',
    );
    try {
      if (await canLaunchUrl(launchUri)) {
        await launchUrl(launchUri);
      } else {
        _showSnackBar('Could not launch email client', Colors.red);
      }
    } catch (e) {
      _showSnackBar('Error launching email client', Colors.red);
    }
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'approved':
        return Colors.green;
      case 'in progress':
        return Colors.blue;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteColor,
      // Enhanced AppBar with gradient
      // appBar: AppBar(
      //   title: const Text(
      //     'Training & Development',
      //     style: TextStyle(fontWeight: FontWeight.w600, fontSize: 20),
      //   ),
      //   centerTitle: false,
      //   elevation: 0,
      //   flexibleSpace: Container(
      //     decoration: BoxDecoration(
      //       gradient: LinearGradient(
      //         begin: Alignment.topLeft,
      //         end: Alignment.bottomRight,
      //         colors: [Colors.blue[600]!, Colors.blue[700]!],
      //       ),
      //     ),
      //   ),
      //   foregroundColor: Colors.white,
      //   actions: [
      //     IconButton(
      //       icon: const Icon(Icons.add_circle_outline),
      //       onPressed: () {
      //         _showAddTrainingDialog();
      //       },
      //       tooltip: 'Add New Training Request',
      //     ),
      //     IconButton(
      //       icon: const Icon(Icons.filter_list),
      //       onPressed: () {
      //         _showFilterDialog();
      //       },
      //       tooltip: 'Filter Requests',
      //     ),
      //     const SizedBox(width: 8),
      //   ],
      // ),
      appBar: DefaultCommonAppBar(
        activityName: "Training & Development",
        backgroundColor: AppColors.primary,
      ),
      // Enhanced body with animated cards
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: Padding(
          padding: ResponsiveHelper.paddingAll(context, 0.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with statistics
              _buildHeaderStats(),
              // Training Requests Title
              Padding(
                padding: ResponsiveHelper.paddingSymmetric(context , horizontal: 12.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Training Requests',
                      style: AppTextStyles.heading1(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 14),
                        ),
                      ),
                    ),
                    Chip(
                      label: Text('${trainingRequests.length} Total'),
                      backgroundColor: AppColors.blueColor.withAlpha(10),
                      labelStyle: AppTextStyles.heading1(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 10),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              ResponsiveHelper.sizedBoxHeight(context, 2),

              // Enhanced ListView with animation
              Expanded(
                child: ListView.builder(
                  itemCount: trainingRequests.length,
                  itemBuilder: (context, index) {
                    final request = trainingRequests[index];
                    return AnimatedContainer(
                      duration: Duration(milliseconds: 300 + (index * 100)),
                      curve: Curves.easeOutBack,
                      child: _buildEnhancedTrainingCard(request, index),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      // Floating Action Button
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          _showAddTrainingDialog();
        },
        icon: const Icon(Icons.add),
        label: const Text('New Request'),
        backgroundColor: AppColors.orangeColor,
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildHeaderStats() {
    int pendingCount = trainingRequests
        .where((r) => r['status'] == 'Pending')
        .length;
    int approvedCount = trainingRequests
        .where((r) => r['status'] == 'Approved')
        .length;
    int inProgressCount = trainingRequests
        .where((r) => r['status'] == 'In Progress')
        .length;

    return Padding(
      padding: ResponsiveHelper.paddingAll(context , 12.0),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.white, Colors.blue[50]!],
          ),
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Expanded(
              child: _buildStatItem(
                'Pending',
                pendingCount,
                Colors.orange,
                Icons.pending_actions,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                'Approved',
                approvedCount,
                Colors.green,
                Icons.check_circle,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                'In Progress',
                inProgressCount,
                Colors.blue,
                Icons.trending_up,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, int count, Color color, IconData icon) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
        borderRadius: BorderRadius.circular(10),
      ),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start, // Align content to the start
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.all(1),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(icon, color: color, size: 24),
                  ),
                  Text(
                    count.toString(),
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ],
              ),
              ResponsiveHelper.sizedBoxHeight(context, 10),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEnhancedTrainingCard(Map<String, dynamic> request, int index) {
    return Padding(
      padding: ResponsiveHelper.paddingOnly(
        context,
        left: 12,
        right: 12,
        top: index == 0 ? 16.0 : 8.0,   // First item extra top
        bottom: index == request.length - 1 ? 0.0 : 10.0, // Last item extra bottom
      ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.lightBlueColor,
              Colors.grey[50]!,
            ],
          ),
        ),
        child: Padding(
          padding: ResponsiveHelper.paddingAll(context, 6.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Row with Profile and Status
              Row(
                children: [
                  // Profile Avatar
                  Container(
                    width: ResponsiveHelper.containerWidth(context, 40),
                    height: ResponsiveHelper.containerWidth(context, 40),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [Colors.blue[400]!, Colors.blue[600]!],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.blue.withOpacity(0.3),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: CircleAvatar(
                      radius: ResponsiveHelper.circleRadius(context, 20),
                      backgroundColor: Colors.transparent,
                      backgroundImage: request['profileImage'] != null
                          ? NetworkImage(request['profileImage'])
                          : null,
                      child: request['profileImage'] == null
                          ? Text(
                              request['employeeName'][0].toUpperCase(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            )
                          : null,
                    ),
                  ),
                  ResponsiveHelper.sizedBoxWidth(context, 10),

                  // Employee Info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                request['employeeName'],
                                style: AppTextStyles.heading1(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      14,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            // Status Badge
                            Container(
                              padding: ResponsiveHelper.paddingSymmetric(
                                context,
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: _getStatusColor(
                                  request['status'],
                                ).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: _getStatusColor(
                                    request['status'],
                                  ).withOpacity(0.3),
                                ),
                              ),
                              child: Text(
                                request['status'],
                                style: AppTextStyles.heading1(
                                  context,
                                  overrideStyle: TextStyle(
                                    color: _getStatusColor(request['status']),
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      10,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        // ResponsiveHelper.sizedBoxWidth(context, 50),

                        // Employee ID and Department
                        Row(
                          children: [
                            Icon(
                              Icons.badge,
                              size: 16,
                              color: Colors.grey[600],
                            ),
                            ResponsiveHelper.sizedBoxWidth(context, 4),
                            Text(
                              request['employeeId'],
                              style: AppTextStyles.body2(
                                context,
                                overrideStyle: TextStyle(
                                  color: Colors.black,
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    10,
                                  ),
                                ),
                              ),
                            ),
                            ResponsiveHelper.sizedBoxWidth(context, 10),
                            Icon(
                              Icons.business,
                              size: 16,
                              color: Colors.grey[600],
                            ),
                            ResponsiveHelper.sizedBoxWidth(context, 4),
                            Expanded(
                              child: Text(
                                request['department'],
                                style: AppTextStyles.body2(
                                  context,
                                  overrideStyle: TextStyle(
                                    color: Colors.black,
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      10,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),

                        ResponsiveHelper.sizedBoxHeight(context, 4),

                        // Designation
                        Row(
                          children: [
                            Icon(
                              Icons.work,
                              size: 16,
                              color: Colors.grey[600],
                            ),
                            const SizedBox(width: 4),
                            Text(
                              request['designation'],
                              style: AppTextStyles.body2(
                                context,
                                overrideStyle: TextStyle(
                                  color: Colors.black,
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    10,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              ResponsiveHelper.sizedBoxHeight(context, 10),

              // Training Details Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [AppColors.whiteColor, AppColors.whiteColor],
                  ),
                  // color: AppColors.orangeColor.withAlpha(20),
                  borderRadius: BorderRadius.circular(12),
                  // border: Border.all(color: Colors.blue[100]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.school, color: Colors.black, size: 20),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            request['trainingTopic'],
                            style: AppTextStyles.heading1(
                              context,
                              overrideStyle: TextStyle(
                                fontSize: ResponsiveHelper.fontSize(
                                  context,
                                  10,
                                ),
                              ),
                            ),
                          ),
                        ),
                        // Priority Badge
                        Container(
                          padding: ResponsiveHelper.paddingSymmetric(
                            context,
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: _getPriorityColor(
                              request['priority'],
                            ).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            request['priority'],
                            style: AppTextStyles.heading1(
                              context,
                              overrideStyle: TextStyle(
                                color: _getPriorityColor(request['priority']),
                                fontSize: ResponsiveHelper.fontSize(
                                  context,
                                  10,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    ResponsiveHelper.sizedBoxHeight(context, 10),

                    // Training Details Row
                    Row(
                      children: [
                        Expanded(
                          child: _buildDetailChip(
                            Icons.schedule,
                            'Duration: ${request['trainingDuration']}',
                            Colors.purple,
                          ),
                        ),
                        ResponsiveHelper.sizedBoxWidth(context, 8),
                        Expanded(
                          child: _buildDetailChip(
                            Icons.calendar_today,
                            'Requested: ${request['requestDate']}',
                            Colors.indigo,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              ResponsiveHelper.sizedBoxHeight(context, 10),

              // Contact Information
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Icon(
                            Icons.email,
                            size: 16,
                            color: Colors.grey[600],
                          ),
                          ResponsiveHelper.sizedBoxWidth(context, 6),
                          Expanded(
                            child: Text(
                              "${request['email']}",
                              style: AppTextStyles.body2(
                                context,
                                overrideStyle: TextStyle(
                                  // color: _getPriorityColor(request['priority']),
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    10,
                                  ),
                                ),
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                    ResponsiveHelper.sizedBoxWidth(context, 6),
                    Row(
                      children: [
                        Icon(Icons.phone, size: 16, color: Colors.grey[600]),
                        ResponsiveHelper.sizedBoxWidth(context, 6),
                        Text(
                          request['phone'],
                          style: AppTextStyles.body2(
                            context,
                            overrideStyle: TextStyle(
                              // color: _getPriorityColor(request['priority']),
                              fontSize: ResponsiveHelper.fontSize(
                                context,
                                10,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              ResponsiveHelper.sizedBoxHeight(context, 10),

              // Enhanced Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildActionButton(
                    context: context,
                    icon: Icons.email_outlined,
                    label: 'Email',
                    color: Colors.blue,
                    onPressed: () => _handleEmailAction(request),
                  ),
                  _buildActionButton(
                    context: context,
                    icon: Icons.phone,
                    label: 'Call',
                    color: Colors.green,
                    onPressed: () => _makePhoneCall(request['phone']),
                  ),
                  _buildActionButton(
                    icon: Icons.calendar_today,
                    label: 'Meeting',
                    color: Colors.orange,
                    onPressed: () => _handleMeetingAction(request),
                    context: context,
                  ),
                  _buildActionButton(
                    context: context,
                    icon: Icons.more_vert,
                    label: 'More',
                    color: Colors.grey[600]!,
                    onPressed: () => _showMoreOptionsDialog(request),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailChip(IconData icon, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 11,
                color: color,
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton({
    required BuildContext context,
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return Expanded(
      child: Container(
        margin: ResponsiveHelper.paddingSymmetric(context, horizontal: 4),
        child: ElevatedButton.icon(
          onPressed: onPressed,
          icon: Icon(icon, size: ResponsiveHelper.iconSize(context, 16)),
          label: Text(
            label,
            style: AppTextStyles.heading2(
              context,
              overrideStyle: TextStyle(
                color: color,
                // color: _getPriorityColor(request['priority']),
                fontSize: ResponsiveHelper.fontSize(context, 10),
              ),
            ),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: color.withAlpha(20),
            foregroundColor: color,
            elevation: 0,
            padding: ResponsiveHelper.paddingSymmetric(context, vertical: 0),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(color: color.withAlpha(30)),
            ),
          ),
        ),
      ),
    );
  }

  void _handleEmailAction(Map<String, dynamic> request) {
    String subject = 'Training Request: ${request['trainingTopic']}';
    String body =
        '''Dear ${request['employeeName']},

Regarding your training request for "${request['trainingTopic']}", we would like to discuss the details with you.

Employee Details:
- Employee ID: ${request['employeeId']}
- Department: ${request['department']}
- Designation: ${request['designation']}

Please let us know your availability for a discussion.

Best regards,
HR Team''';

    _sendEmail(request['email'], subject, body);
  }

  void _handleMeetingAction(Map<String, dynamic> request) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppColors.whiteColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Row(
            children: [
              Icon(Icons.calendar_month),
              ResponsiveHelper.sizedBoxWidth(context ,  8),
              Text(
                'Schedule Meeting',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 14),
                  ),
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Schedule a meeting with ${request['employeeName']} regarding their training request.',
                style: AppTextStyles.body2(
                  context,
                  overrideStyle: TextStyle(
                    color: Colors.black,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
              ResponsiveHelper.sizedBoxHeight(context ,  12),
              _buildInfoRow(context,'Employee ID:', request['employeeId']),
              _buildInfoRow(context,'Department:', request['department']),
              _buildInfoRow(context,'Training Topic:', request['trainingTopic']),
            ],
          ),
          actions: [
            TextButton(
              child: Text(
                'Cancel',
                style: AppTextStyles.body2(
                  context,
                  overrideStyle: TextStyle(
                    color: Colors.black,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
              onPressed: () => Navigator.of(context).pop(),
            ),
            ElevatedButton.icon(
              icon: const Icon(Icons.calendar_month),
              label: Text(
                'Schedule',
                style: AppTextStyles.heading1(
                  context,
                  overrideStyle: TextStyle(
                    color: AppColors.whiteColor,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange[600],
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              onPressed: () {
                Navigator.of(context).pop();
                _showSnackBar(
                  'Meeting scheduled with ${request['employeeName']}',
                  Colors.orange,
                );
              },
            ),
          ],
        );
      },
    );
  }

  Widget _buildInfoRow(BuildContext context , String label, String value) {
    return Padding(
      padding: ResponsiveHelper.paddingSymmetric(context , vertical: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            // width: ResponsiveHelper.containerWidth(context, 100),
            child: Text(
              label,
              style: AppTextStyles.heading1(
                context,
                overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 12),
                ),
              ),
            ),
          ),
          ResponsiveHelper.sizedBoxWidth(context, 10),
          Expanded(
            child: Text(
              value,
              style: AppTextStyles.body2(
                context,
                overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showMoreOptionsDialog(Map<String, dynamic> request) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Align(
                alignment: Alignment.topCenter,
                child: Container(
                  width: ResponsiveHelper.containerWidth(context, 80),
                  height: ResponsiveHelper.containerHeight(context, 4),
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              ResponsiveHelper.sizedBoxHeight(context, 10),

              Text(
                'Actions for ${request['employeeName']}',
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 14),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              _buildBottomSheetOption(
                Icons.check_circle,
                'Approve Request',
                Colors.green,
                () {
                  Navigator.pop(context);
                  _updateRequestStatus(request, 'Approved');
                },
              ),
              _buildBottomSheetOption(
                Icons.cancel,
                'Reject Request',
                Colors.red,
                () {
                  Navigator.pop(context);
                  _updateRequestStatus(request, 'Rejected');
                },
              ),
              _buildBottomSheetOption(
                Icons.edit,
                'Edit Request',
                Colors.blue,
                () {
                  Navigator.pop(context);
                  _showSnackBar('Edit functionality coming soon', Colors.blue);
                },
              ),
              _buildBottomSheetOption(
                Icons.delete,
                'Delete Request',
                Colors.red,
                () {
                  Navigator.pop(context);
                  _showDeleteConfirmation(request);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBottomSheetOption(
    IconData icon,
    String title,
    Color color,
    VoidCallback onTap,
  ) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: color, size: 20),
      ),
      title: Text(
        title,
        style: AppTextStyles.heading1(
          context,
          overrideStyle: TextStyle(
            fontSize: ResponsiveHelper.fontSize(context, 12),
          ),
        ),
      ),
      onTap: onTap,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    );
  }

  void _updateRequestStatus(Map<String, dynamic> request, String newStatus) {
    setState(() {
      request['status'] = newStatus;
    });
    _showSnackBar(
      'Request ${newStatus.toLowerCase()} for ${request['employeeName']}',
      _getStatusColor(newStatus),
    );
  }

  void _showDeleteConfirmation(Map<String, dynamic> request) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Text('Delete Request'),
          content: Text(
            'Are you sure you want to delete the training request for ${request['employeeName']}?',
          ),
          actions: [
            TextButton(
              child: const Text('Cancel'),
              onPressed: () => Navigator.pop(context),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              child: const Text('Delete'),
              onPressed: () {
                setState(() {
                  trainingRequests.remove(request);
                });
                Navigator.pop(context);
                _showSnackBar('Request deleted successfully', Colors.red);
              },
            ),
          ],
        );
      },
    );
  }

  void _showAddTrainingDialog() {
    _showSnackBar(
      'Add training request functionality coming soon',
      Colors.blue,
    );
  }

  void _showFilterDialog() {
    _showSnackBar('Filter functionality coming soon', Colors.blue);
  }

  Color getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'approved':
        return Colors.green;
      case 'in progress':
        return Colors.blue;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
