import 'package:dss_crm/hr_module/screen/job_opening/create_job_opening_screen.dart';
import 'package:dss_crm/hr_module/screen/job_opening/schedule_job_interview_screen.dart';
import 'package:dss_crm/hr_module/screen/job_opening/update_job_opening_screen.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/string_utils.dart';
import '../../controller/hr_employee_api_provider.dart';

class ViewAllJobsManagementScreen extends StatefulWidget {
  const ViewAllJobsManagementScreen({Key? key}) : super(key: key);

  @override
  State<ViewAllJobsManagementScreen> createState() =>
      _ViewAllJobsManagementScreenState();
}

class _ViewAllJobsManagementScreenState extends State<ViewAllJobsManagementScreen> with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

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

    _fetchHRJobPostings();
    // WidgetsBinding.instance.addPostFrameCallback((_) {
    //   final provider =
    //   Provider.of<HREmployeeApiProvider>(context, listen: false);
    //   provider.getAllHRJobPostingList(context);
    // });
  }

  void _fetchHRJobPostings() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
      provider.getAllHRJobPostingList(context);
    });
  }


  Future<void> _deleteJob(String jobId, String jobTitle) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: ResponsiveHelper.borderRadiusAll(ctx, 16),
        ),
        title: Row(
          children: [
            Icon(Icons.warning, color: Colors.red, size: ResponsiveHelper.iconSize(ctx, 24)),
            SizedBox(width: ResponsiveHelper.spacing(ctx, 8)),
            Text("Delete Job?", style: TextStyle(fontSize: ResponsiveHelper.fontSize(ctx, 18))),
          ],
        ),
        content: Text(
          "Are you sure you want to delete \"$jobTitle\"?\nThis action cannot be undone.",
          style: TextStyle(fontSize: ResponsiveHelper.fontSize(ctx, 14)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text("Cancel", style: TextStyle(color: Colors.grey[600])),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text("Delete", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
      await provider.deleteHrJobPost(context, jobId);
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void updateStatus(String jobId, String action) async {
    if (jobId.isEmpty) return;

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    if (action == "Close") {
    await provider.closeHrJobPost(context, jobId);
    } else if (action == "Edit") {
      final result = await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => UpdateJobOpeningScreen(jobId: jobId), // Pass only jobId
        ),
      );

      if (result == true) {
        _fetchHRJobPostings(); // Refresh list
      }

      // ScaffoldMessenger.of(context).showSnackBar(
      //   SnackBar(
      //     content: Row(
      //       children: [
      //         Icon(Icons.edit, color: Colors.white),
      //         SizedBox(width: ResponsiveHelper.spacing(context, 8)),
      //         Text("Edit feature coming soon!"),
      //       ],
      //     ),
      //     backgroundColor: Colors.orange,
      //     behavior: SnackBarBehavior.floating,
      //     shape: RoundedRectangleBorder(
      //         borderRadius: ResponsiveHelper.borderRadiusAll(context, 10)),
      //     margin: EdgeInsets.all(ResponsiveHelper.spacing(context, 16)),
      //   ),
      // );
      // return;
    }

    // Optional: Manual refresh if provider doesn't auto-refresh
    // Already done inside closeHrJobPost → getAllHRJobPostingList(context)
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case "open":
      case "active":
        return Colors.green;
      case "closed":
        return Colors.red;
      case "on hold":
        return Colors.orange;
      case "shortlisted":
        return Colors.green;
      case "rejected":
        return Colors.red;
      case "interview scheduled":
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  /* --------------------------------------------------------------
     UI BUILDING BLOCKS – ALL RESPONSIVE
  -------------------------------------------------------------- */
  Widget _buildStatusChip(String status) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: ResponsiveHelper.circleRadius(context, 6),
          height: ResponsiveHelper.circleRadius(context, 6),
          decoration: BoxDecoration(
            color: _getStatusColor(status),
            shape: BoxShape.circle,
          ),
        ),
        SizedBox(width: ResponsiveHelper.spacing(context, 6)),
        Text(
          status,
          style: TextStyle(
            fontSize: ResponsiveHelper.fontSize(context, 12),
            color: _getStatusColor(status),
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildAvatarCircle(String initials, String status) {
    return Stack(
      children: [
        Container(
          width: ResponsiveHelper.containerWidth(context, 60),
          height: ResponsiveHelper.containerWidth(context, 60),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                AppColors.primary,
                AppColors.primary.withOpacity(0.7)
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withOpacity(0.3),
                blurRadius: ResponsiveHelper.elevation(context, 8),
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: Text(
              initials,
              style: TextStyle(
                color: Colors.white,
                fontSize: ResponsiveHelper.fontSize(context, 18),
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        Positioned(
          bottom: 0,
          right: 0,
          child: Container(
            width: ResponsiveHelper.circleRadius(context, 16),
            height: ResponsiveHelper.circleRadius(context, 16),
            decoration: BoxDecoration(
              color: _getStatusColor(status),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String text,
    required Color color,
    required VoidCallback onTap,
    bool isPrimary = false,
  }) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: ResponsiveHelper.paddingSymmetric(context, horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: isPrimary ? color : color.withOpacity(0.1),
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 4),
            border: Border.all(
              color: color.withOpacity(isPrimary ? 1.0 : 0.3),
              width: 1.5,
            ),
            boxShadow: isPrimary
                ? [
              BoxShadow(
                color: color.withOpacity(0.3),
                blurRadius: ResponsiveHelper.elevation(context, 8),
                offset: const Offset(0, 2),
              ),
            ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: ResponsiveHelper.iconSize(context, 16),
                color: isPrimary ? Colors.white : color,
              ),
              SizedBox(width: ResponsiveHelper.spacing(context, 6)),
              Text(
                text,
                style: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 10),
                  color: isPrimary ? Colors.white : color,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text, {Color? iconColor}) {
    return Row(
      children: [
        Container(
          width: ResponsiveHelper.containerWidth(context, 32),
          height: ResponsiveHelper.containerWidth(context, 32),
          decoration: BoxDecoration(
            color: (iconColor ?? Colors.grey[600])!.withOpacity(0.1),
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 8),
          ),
          child: Icon(
            icon,
            size: ResponsiveHelper.iconSize(context, 16),
            color: iconColor ?? Colors.grey[600],
          ),
        ),
        SizedBox(width: ResponsiveHelper.spacing(context, 10)),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 13),
              color: Colors.grey[700],
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      final now = DateTime.now();
      final diff = now.difference(date);
      if (diff.inDays == 0) return 'Today';
      if (diff.inDays == 1) return '1 day ago';
      if (diff.inDays < 7) return '${diff.inDays} days ago';
      final weeks = (diff.inDays / 7).floor();
      if (diff.inDays < 30) return '$weeks ${weeks == 1 ? 'week' : 'weeks'} ago';
      final months = (diff.inDays / 30).floor();
      return '$months ${months == 1 ? 'month' : 'months'} ago';
    } catch (_) {
      return dateString;
    }
  }

  String _getInitials(String? title) {
    if (title == null || title.isEmpty) return 'JO';
    final words = title.trim().split(' ');
    if (words.length >= 2) {
      return '${words[0][0]}${words[1][0]}'.toUpperCase();
    }
    return title.length >= 2
        ? title.substring(0, 2).toUpperCase()
        : title[0].toUpperCase();
  }

  Widget _buildStatCard(
      IconData icon, String label, String value, Color iconColor) {
    return Column(
      children: [
        Container(
          padding: ResponsiveHelper.paddingAll(context, 12),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.22),
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 16),
          ),
          child: Icon(icon,
              size: ResponsiveHelper.iconSize(context, 28), color: iconColor),
        ),
        SizedBox(height: ResponsiveHelper.spacing(context, 12)),
        Text(
          value,
          style: TextStyle(
            fontSize: ResponsiveHelper.fontSize(context, 22),
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        SizedBox(height: ResponsiveHelper.spacing(context, 4)),
        Text(
          label,
          style: TextStyle(
            fontSize: ResponsiveHelper.fontSize(context, 12),
            color: Colors.white.withOpacity(0.9),
          ),
        ),
      ],
    );
  }

  Widget _buildMetaChip(IconData icon, String text) {
    return Container(
      padding:
      ResponsiveHelper.paddingSymmetric(context, horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.6),
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon,
              size: ResponsiveHelper.iconSize(context, 12),
              color: Colors.grey[600]),
          SizedBox(width: ResponsiveHelper.spacing(context, 4)),
          Text(
            text,
            style: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 11),
              color: Colors.grey[700],
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleInterviewButton(
      BuildContext context, String candidateName) {
    return TweenAnimationBuilder<double>(
      duration: const Duration(milliseconds: 500),
      tween: Tween(begin: 0.0, end: 1.0),
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                      ScheduleInterviewScreen(candidateName: candidateName),
                ),
              );
            },
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
            child: Container(
              width: double.infinity,
              padding: ResponsiveHelper.paddingAll(context, 16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.primary,
                    AppColors.primary.withOpacity(0.8)
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: ResponsiveHelper.elevation(context, 8),
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.calendar_today,
                      color: Colors.white,
                      size: ResponsiveHelper.iconSize(context, 20)),
                  SizedBox(width: ResponsiveHelper.spacing(context, 10)),
                  Text(
                    "Schedule Interview",
                    style: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 15),
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  /* --------------------------------------------------------------
     MAIN BUILD
  -------------------------------------------------------------- */


  Widget _buildStatItem(IconData icon, String title, String value, Color iconColor) {
    return Column(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            color: iconColor,
            size: 24,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          title,
          style: TextStyle(
            fontSize: 12,
          ),
        ),
      ],
    );
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: DefaultCommonAppBar(
        activityName: "Job Post",
        backgroundColor: AppColors.primary,
        actionIcons: const [Icons.refresh, Icons.add],
        onActionTap: [
              () {
                _fetchHRJobPostings();
          },
              () {
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (_) => const CreateJobOpeningScreen()),
            ).then((result) {
              if (result == true) {
                // Optional: extra safety, but already refreshed in provider
                _fetchHRJobPostings();
              }
            });
          },
        ],
      ),
      body: Consumer<HREmployeeApiProvider>(
        builder: (context, provider, child) {
          // ---------- LOADING ----------
          if (provider.isLoading) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    valueColor:
                    AlwaysStoppedAnimation<Color>(AppColors.primary),
                    strokeWidth: ResponsiveHelper.spacing(context, 3),
                  ),
                  SizedBox(height: ResponsiveHelper.spacing(context, 16)),
                  Text(
                    'Loading job postings...',
                    style: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 16),
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            );
          }

          // ---------- DATA ----------
          final jobPostings =
              provider.getAllJobPostingListModel?.data?.data ?? [];

          // ---------- EMPTY ----------
          if (jobPostings.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: ResponsiveHelper.containerWidth(context, 120),
                    height: ResponsiveHelper.containerWidth(context, 120),
                    decoration: const BoxDecoration(
                      color: Colors.grey,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.work_off_outlined,
                      size: ResponsiveHelper.iconSize(context, 60),
                      color: Colors.grey[400],
                    ),
                  ),
                  SizedBox(height: ResponsiveHelper.spacing(context, 24)),
                  Text(
                    'No Job Openings',
                    style: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 20),
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: ResponsiveHelper.spacing(context, 8)),
                  Text(
                    'Create your first job posting to get started',
                    style: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 14),
                      color: Colors.grey[500],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: ResponsiveHelper.spacing(context, 24)),
                  ElevatedButton(
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const CreateJobOpeningScreen()),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: ResponsiveHelper.paddingSymmetric(
                          context, horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius:
                        ResponsiveHelper.borderRadiusAll(context, 12),
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.add,
                            size: ResponsiveHelper.iconSize(context, 20)),
                        SizedBox(width: ResponsiveHelper.spacing(context, 8)),
                        const Text('Create Job Opening'),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }

          // ---------- SUCCESS ----------
          return FadeTransition(
            opacity: _fadeAnimation,
            child: Column(
              children: [
                // NEW STATS HEADER

                // Modern Stats Header - Replace your existing header code with this

                Container(
                  margin: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      // Main Stats Card
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.grey[200]!, width: 1),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 20,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Header Text
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Icon(
                                    Icons.analytics_outlined,
                                    color: AppColors.primary,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                const Text(
                                  'Job Statistics',
                                  style: TextStyle(
                                    fontSize: 17,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF1A1A1A),
                                    letterSpacing: -0.3,
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 20),

                            // Stats Row
                            Row(
                              children: [
                                // Total Jobs - Primary Stat
                                Expanded(
                                  flex: 2,
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: AppColors.primary,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.all(6),
                                              decoration: BoxDecoration(
                                                color: Colors.white.withOpacity(0.2),
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              child: const Icon(
                                                Icons.work_outline,
                                                color: Colors.white,
                                                size: 18,
                                              ),
                                            ),
                                            const Spacer(),
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 4,
                                              ),
                                              decoration: BoxDecoration(
                                                color: Colors.white.withOpacity(0.2),
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                'Total',
                                                style: TextStyle(
                                                  fontSize: 10,
                                                  color: Colors.white.withOpacity(0.9),
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        Text(
                                          jobPostings.length.toString(),
                                          style: const TextStyle(
                                            fontSize: 32,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                            height: 1.0,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          'Job Openings',
                                          style: TextStyle(
                                            fontSize: 13,
                                            color: Colors.white.withOpacity(0.85),
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),

                                const SizedBox(width: 12),

                                // Active & On Hold Stats
                                Expanded(
                                  flex: 2,
                                  child: Column(
                                    children: [
                                      // Active Jobs
                                      Container(
                                        padding: const EdgeInsets.all(14),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF0FDF4),
                                          borderRadius: BorderRadius.circular(14),
                                          border: Border.all(
                                            color: const Color(0xFF10B981).withOpacity(0.2),
                                            width: 1,
                                          ),
                                        ),
                                        child: Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.all(8),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFF10B981).withOpacity(0.15),
                                                borderRadius: BorderRadius.circular(10),
                                              ),
                                              child: const Icon(
                                                Icons.check_circle,
                                                color: Color(0xFF10B981),
                                                size: 20,
                                              ),
                                            ),
                                            const SizedBox(width: 12),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    jobPostings
                                                        .where((job) =>
                                                    job.status?.toLowerCase() == 'active' ||
                                                        job.status?.toLowerCase() == 'open')
                                                        .length
                                                        .toString(),
                                                    style: const TextStyle(
                                                      fontSize: 22,
                                                      fontWeight: FontWeight.bold,
                                                      color: Color(0xFF10B981),
                                                      height: 1.0,
                                                    ),
                                                  ),
                                                  const SizedBox(height: 2),
                                                  const Text(
                                                    'Active',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Color(0xFF059669),
                                                      fontWeight: FontWeight.w600,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),

                                      const SizedBox(height: 10),

                                      // On Hold Jobs
                                      Container(
                                        padding: const EdgeInsets.all(14),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFFFFBEB),
                                          borderRadius: BorderRadius.circular(14),
                                          border: Border.all(
                                            color: const Color(0xFFF59E0B).withOpacity(0.2),
                                            width: 1,
                                          ),
                                        ),
                                        child: Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.all(8),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFFF59E0B).withOpacity(0.15),
                                                borderRadius: BorderRadius.circular(10),
                                              ),
                                              child: const Icon(
                                                Icons.pause_circle,
                                                color: Color(0xFFF59E0B),
                                                size: 20,
                                              ),
                                            ),
                                            const SizedBox(width: 12),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    jobPostings
                                                        .where((job) =>
                                                    job.status?.toLowerCase() == 'on hold')
                                                        .length
                                                        .toString(),
                                                    style: const TextStyle(
                                                      fontSize: 22,
                                                      fontWeight: FontWeight.bold,
                                                      color: Color(0xFFF59E0B),
                                                      height: 1.0,
                                                    ),
                                                  ),
                                                  const SizedBox(height: 2),
                                                  const Text(
                                                    'On Hold',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Color(0xFFD97706),
                                                      fontWeight: FontWeight.w600,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                // LIST
                Expanded(
                  child: ListView.builder(
                    padding: ResponsiveHelper.paddingSymmetric(
                        context, horizontal: 16),
                    itemCount: jobPostings.length,
                    itemBuilder: (context, index) {
                      final job = jobPostings[index];
                      final name = job.title ?? 'No Title';
                      final position =
                          job.designationId?.title ?? 'No Designation';
                      final experience = job.experience ?? 'Not specified';
                      final skills =
                          job.skills?.join(', ') ?? 'No skills listed';
                      final postedDate = _formatDate(job.postedAt);
                      final avatar = _getInitials(job.title);
                      final status = job.status ?? 'Unknown';
                      final openings = job.openings ?? 0;
                      final department = job.departmentId?.title ?? 'N/A';

                      return TweenAnimationBuilder<double>(
                        duration:
                        Duration(milliseconds: 300 + (index * 100)),
                        tween: Tween(begin: 0.0, end: 1.0),
                        builder: (context, value, child) {
                          return Transform.translate(
                            offset: Offset(0, 20 * (1 - value)),
                            child: Opacity(
                              opacity: value,
                              child: Container(
                                margin: EdgeInsets.only(
                                    bottom: ResponsiveHelper.spacing(context, 16)),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius:
                                  ResponsiveHelper.borderRadiusAll(context, 20),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.08),
                                      blurRadius:
                                      ResponsiveHelper.elevation(context, 16),
                                      offset: const Offset(0, 6),
                                    ),
                                  ],
                                ),
                                child: ClipRRect(
                                  borderRadius:
                                  ResponsiveHelper.borderRadiusAll(context, 20),
                                  child: Column(
                                    children: [
                                      // CARD HEADER
                                      Container(
                                        padding:
                                        ResponsiveHelper.paddingAll(context, 16),
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: [
                                              AppColors.primary.withOpacity(0.1),
                                              AppColors.primary.withOpacity(0.05),
                                            ],
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                          ),
                                        ),
                                        child: Row(
                                          children: [
                                            _buildAvatarCircle(avatar, status),
                                            SizedBox(
                                                width:
                                                ResponsiveHelper.spacing(context, 16)),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                                children: [
                                                  Row(
                                                    mainAxisAlignment:
                                                    MainAxisAlignment
                                                        .spaceBetween,
                                                    children: [
                                                      Expanded(
                                                        child: Text(
                                                          name,
                                                          style: TextStyle(
                                                            fontSize:
                                                            ResponsiveHelper.fontSize(
                                                                context, 18),
                                                            fontWeight:
                                                            FontWeight.bold,
                                                            color: Colors.black87,
                                                          ),
                                                          maxLines: 2,
                                                          overflow:
                                                          TextOverflow.ellipsis,
                                                        ),
                                                      ),
                                                      _buildStatusChip(status),
                                                    ],
                                                  ),
                                                  SizedBox(
                                                      height:
                                                      ResponsiveHelper.spacing(
                                                          context, 4)),
                                                  Text(
                                                    position,
                                                    style: TextStyle(
                                                      fontSize:
                                                      ResponsiveHelper.fontSize(
                                                          context, 14),
                                                      color: Colors.grey[600],
                                                      fontWeight:
                                                      FontWeight.w500,
                                                    ),
                                                  ),
                                                  SizedBox(
                                                      height:
                                                      ResponsiveHelper.spacing(
                                                          context, 8)),
                                                  Row(
                                                    children: [
                                                      _buildMetaChip(
                                                          Icons.people_outline,
                                                          '$openings openings'),
                                                      SizedBox(
                                                          width:
                                                          ResponsiveHelper.spacing(
                                                              context, 8)),
                                                      _buildMetaChip(
                                                          Icons.access_time,
                                                          postedDate),
                                                    ],
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      // CARD BODY
                                      Padding(
                                        padding:
                                        ResponsiveHelper.paddingAll(context, 16),
                                        child: Column(
                                          crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                          children: [
                                            // INFO BOX
                                            Container(
                                              padding: ResponsiveHelper.paddingAll(
                                                  context, 12),
                                              decoration: BoxDecoration(
                                                color: Colors.grey[50],
                                                borderRadius:
                                                ResponsiveHelper.borderRadiusAll(
                                                    context, 12),
                                              ),
                                              child: Column(
                                                children: [
                                                  _buildInfoRow(
                                                      Icons.work_outline,
                                                      "Experience: $experience",
                                                      iconColor:
                                                      AppColors.primary),
                                                  SizedBox(
                                                      height:
                                                      ResponsiveHelper.spacing(
                                                          context, 12)),
                                                  _buildInfoRow(Icons.code,
                                                      "Skills: $skills",
                                                      iconColor: Colors.purple),
                                                  SizedBox(
                                                      height:
                                                      ResponsiveHelper.spacing(
                                                          context, 12)),
                                                  _buildInfoRow(
                                                      Icons.business,
                                                      "Department: $department",
                                                      iconColor: Colors.blue),
                                                ],
                                              ),
                                            ),
                                            SizedBox( height: ResponsiveHelper.spacing(  context, 16)),
                                            // ---------- JOB DESCRIPTION (HTML → Plain-text) ----------
                                            // JOB DESCRIPTION – ONE LINE CALL
                                            if (job.description != null) ...[
                                              SizedBox(height: ResponsiveHelper.spacing(context, 16)),
                                              Text(
                                                "Job Description",
                                                style: TextStyle(
                                                  fontSize: ResponsiveHelper.fontSize(context, 14),
                                                  fontWeight: FontWeight.w600,
                                                  color: Colors.grey[700],
                                                ),
                                              ),
                                              SizedBox(height: ResponsiveHelper.spacing(context, 8)),
                                              Text(
                                                StringUtils.extractPlainText(job.description),
                                                style: TextStyle(
                                                  fontSize: ResponsiveHelper.fontSize(context, 13),
                                                  color: Colors.black,
                                                  height: 1.4,
                                                ),
                                                maxLines: 5,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                              SizedBox(height: ResponsiveHelper.spacing(context, 16)),
                                            ],
                                            // ACTION BUTTONS
                                            Row(
                                              children: [
                                                _buildActionButton(
                                                  icon: Icons.check_circle_outline,
                                                  text: "Edit",
                                                  color: Colors.green,
                                                  onTap: () => updateStatus(
                                                      job.sId.toString(), "Edit"),
                                                ),
                                                SizedBox(
                                                    width:
                                                    ResponsiveHelper.spacing(
                                                        context, 12)),
                                                if(job.status == "Open")
                                                  _buildActionButton(
                                                    icon: Icons.close,
                                                    text: "Close",
                                                    color: Colors.red,
                                                    onTap: () => updateStatus(
                                                        job.sId.toString(), "Close"),
                                                  ),
                                                SizedBox(width: ResponsiveHelper.spacing(context, 12)),
                                                _buildActionButton(
                                                  icon: Icons.delete_outline,
                                                  text: "Delete",
                                                  color: Colors.red[700]!,
                                                  onTap: () => _deleteJob(job.sId ?? '', name),
                                                ),
                                              ],
                                            ),
                                            // SCHEDULE INTERVIEW (only when shortlisted)
                                            if (status.toLowerCase() ==
                                                "shortlisted")
                                              Padding(
                                                padding: ResponsiveHelper.paddingOnly(
                                                    context, top: 12),
                                                child: _buildScheduleInterviewButton(
                                                    context, name),
                                              ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}