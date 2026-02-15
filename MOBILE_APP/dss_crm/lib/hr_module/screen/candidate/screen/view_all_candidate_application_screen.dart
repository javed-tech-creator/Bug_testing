import 'package:dss_crm/hr_module/screen/candidate/model/candidate_detail_model.dart';
import 'package:dss_crm/hr_module/screen/job_opening/schedule_job_interview_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
import '../../../controller/hr_employee_api_provider.dart';
import 'candidate_details_screen.dart';

class ViewAllCandidateApplicationListScreen extends StatefulWidget {
  const ViewAllCandidateApplicationListScreen({Key? key}) : super(key: key);

  @override
  State<ViewAllCandidateApplicationListScreen> createState() =>
      _ViewAllCandidateApplicationListScreenState();
}


class _ViewAllCandidateApplicationListScreenState
    extends State<ViewAllCandidateApplicationListScreen> with TickerProviderStateMixin {
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
    WidgetsBinding.instance.addPostFrameCallback((_) {
      refreshData();
    });
  }

  // void _fetchCandidatesList() {
  //   WidgetsBinding.instance.addPostFrameCallback((_) {
  //     final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
  //     provider.getAllHRCandidatesList(context);
  //   });
  // }


  Future<void> refreshData() async {
    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    await Future.wait([
      provider.getAllHRHiredCandidatesList(context),
    ]);
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }



  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case "shortlisted":
        return const Color(0xFF10B981);
      case "rejected":
        return const Color(0xFFEF4444);
      case "interview scheduled":
        return const Color(0xFF3B82F6);
      case "pending":
      case "applied":
        return const Color(0xFFF59E0B);
      case "offered":
        return const Color(0xFF8B5CF6);
      case "hired":
        return const Color(0xFF14B8A6);
      default:
        return const Color(0xFF6B7280);
    }
  }

  Widget _buildStatusChip(String status) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: _getStatusColor(status),
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            status,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF1A1A1A),
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      final now = DateTime.now();
      final difference = now.difference(date);

      if (difference.inDays == 0) {
        return 'Today';
      } else if (difference.inDays == 1) {
        return '1 day ago';
      } else if (difference.inDays < 7) {
        return '${difference.inDays} days ago';
      } else if (difference.inDays < 30) {
        final weeks = (difference.inDays / 7).floor();
        return '$weeks ${weeks == 1 ? 'week' : 'weeks'} ago';
      } else if (difference.inDays < 365) {
        final months = (difference.inDays / 30).floor();
        return '$months ${months == 1 ? 'month' : 'months'} ago';
      } else {
        final years = (difference.inDays / 365).floor();
        return '$years ${years == 1 ? 'year' : 'years'} ago';
      }
    } catch (e) {
      return dateString;
    }
  }

  String _getInitials(String? name) {
    if (name == null || name.isEmpty) return 'NA';
    final words = name.trim().split(' ');
    if (words.length >= 2) {
      return '${words[0][0]}${words[1][0]}'.toUpperCase();
    }
    return name.length >= 2
        ? name.substring(0, 2).toUpperCase()
        : name[0].toUpperCase();
  }

  Future<void> _openResume(String? url) async {
    if (url == null || url.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.error_outline, color: Colors.white, size: 18),
              SizedBox(width: 8),
              Text("Resume URL not available"),
            ],
          ),
          backgroundColor: const Color(0xFFEF4444),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          margin: const EdgeInsets.all(16),
        ),
      );
      return;
    }

    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        throw 'Could not launch $url';
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.error_outline, color: Colors.white, size: 18),
              const SizedBox(width: 8),
              Expanded(child: Text("Failed to open: $e")),
            ],
          ),
          backgroundColor: const Color(0xFFEF4444),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
  }

  void updateStatus(String candidateId, String status) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              status == "Shortlisted" ? Icons.check_circle_outline : Icons.cancel_outlined,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 8),
            Text("Candidate marked as $status"),
          ],
        ),
        backgroundColor: status == "Shortlisted" ? const Color(0xFF10B981) : const Color(0xFFEF4444),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }


  // void _showStatusUpdateBottomSheet(BuildContext ctx, String candidateId, String candidateStatus) {
  //   final provider = Provider.of<HREmployeeApiProvider>(ctx, listen: false);
  //
  //   String? selectedStatus = candidateStatus;
  //   final reasonCtrl = TextEditingController();
  //
  //   showModalBottomSheet(
  //     context: ctx,
  //     isScrollControlled: true,
  //     backgroundColor: AppColors.whiteColor,
  //     shape: const RoundedRectangleBorder(
  //         borderRadius: BorderRadius.vertical(top: Radius.circular(24))
  //     ),
  //     builder: (bottomSheetContext) => Padding(
  //       padding: EdgeInsets.only(
  //           bottom: MediaQuery.of(bottomSheetContext).viewInsets.bottom
  //       ),
  //       child: SingleChildScrollView(
  //         child: Container(
  //           decoration: const BoxDecoration(
  //             color: Color(0xFFFAFAFA),
  //             borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
  //           ),
  //           child: StatefulBuilder(
  //             builder: (statefulContext, setState) => Padding(
  //               padding: const EdgeInsets.only(
  //                 left: 20,
  //                 right: 20,
  //                 top: 16,
  //                 bottom: 16,
  //               ),
  //               child: Column(
  //                 mainAxisSize: MainAxisSize.min,
  //                 children: [
  //                   // Drag handle
  //                   Container(
  //                     width: 36,
  //                     height: 4,
  //                     margin: const EdgeInsets.only(bottom: 12),
  //                     decoration: BoxDecoration(
  //                       color: Colors.grey[300],
  //                       borderRadius: BorderRadius.circular(2),
  //                     ),
  //                   ),
  //
  //                   const Text(
  //                     "Update Candidate Status",
  //                     style: TextStyle(fontSize: 19, fontWeight: FontWeight.w600),
  //                   ),
  //                   const SizedBox(height: 24),
  //
  //                   // Status Dropdown
  //                   ResponsiveDropdown<String>(
  //                     label: 'Status',
  //                     hint: 'Choose status',
  //                     value: selectedStatus,
  //                     itemList: const [
  //                       'Applied',
  //                       'Shortlisted',
  //                       'Interviewed',
  //                       'Selected',
  //                       'Rejected',
  //                       'Offered',
  //                       'Hired',
  //                     ],
  //                     onChanged: (v) {
  //                       setState(() {
  //                         selectedStatus = v;
  //                       });
  //                     },
  //                   ),
  //                   const SizedBox(height: 16),
  //
  //                   // Reason Field
  //                   CustomTextField(
  //                     title: "Reason",
  //                     hintText: "Enter reason for this change",
  //                     controller: reasonCtrl,
  //                     maxLines: 3,
  //                     prefixIcon: Icons.note_outlined,
  //                   ),
  //                   const SizedBox(height: 24),
  //
  //                   // Update Button
  //                   Consumer<HREmployeeApiProvider>(
  //                     builder: (_, providerWatch, __) => SizedBox(
  //                       width: double.infinity,
  //                       child: ElevatedButton(
  //                         style: ElevatedButton.styleFrom(
  //                           backgroundColor: AppColors.primary,
  //                           padding: const EdgeInsets.symmetric(vertical: 16),
  //                           shape: RoundedRectangleBorder(
  //                             borderRadius: BorderRadius.circular(12),
  //                           ),
  //                         ),
  //                         onPressed: providerWatch.isLoading
  //                             ? null
  //                             : () async {
  //                           if (selectedStatus == null) return;
  //
  //                           final Map<String, dynamic> requestBody = {
  //                             "status": selectedStatus,
  //                             "remarks": reasonCtrl.text.trim(),
  //                           };
  //
  //                           // API call
  //                           await provider.changeCandidateHiredStatus(
  //                             ctx,
  //                             candidateId,
  //                             requestBody,
  //                           );
  //
  //                           // Check if API was successful
  //                           if (provider.changeCandidateHiredStatusModelResponse?.success == true) {
  //                             // Close bottom sheet with success result
  //                             if (bottomSheetContext.mounted) {
  //                               Navigator.pop(bottomSheetContext, true);
  //                               await refreshData();
  //                             }
  //                           }
  //                         },
  //                         child: providerWatch.isLoading
  //                             ? Row(
  //                           mainAxisAlignment: MainAxisAlignment.center,
  //                           children: const [
  //                             SizedBox(
  //                               width: 18,
  //                               height: 18,
  //                               child: CircularProgressIndicator(
  //                                 color: Colors.white,
  //                                 strokeWidth: 2,
  //                               ),
  //                             ),
  //                             SizedBox(width: 10),
  //                             Text(
  //                               "Updating...",
  //                               style: TextStyle(
  //                                 fontSize: 15,
  //                                 fontWeight: FontWeight.w600,
  //                                 color: Colors.white,
  //                               ),
  //                             ),
  //                           ],
  //                         )
  //                             : const Text(
  //                           "Update Status",
  //                           style: TextStyle(
  //                             fontSize: 15,
  //                             fontWeight: FontWeight.w600,
  //                             color: Colors.white,
  //                           ),
  //                         ),
  //                       ),
  //                     ),
  //                   ),
  //                   const SizedBox(height: 12),
  //                 ],
  //               ),
  //             ),
  //           ),
  //         ),
  //       ),
  //     ),
  //   );
  // }



  void _showStatusUpdateBottomSheet(
      BuildContext context,
      HREmployeeApiProvider provider,
    String candidateId, String candidateStatus
      ) {
    String? selectedStatus = candidateStatus;
    final reasonCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.whiteColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(

        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 10,
          right: 10,
          top: 4,
        ),
        child: SingleChildScrollView(
          child: Container(
            decoration: const BoxDecoration(
              color: Color(0xFFFAFAFA),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: StatefulBuilder(
              builder: (statefulContext, setState) => Padding(
                padding: const EdgeInsets.only(
                  left: 20,
                  right: 20,
                  top: 16,
                  bottom: 16,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Drag handle
                    Container(
                      width: 36,
                      height: 4,
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),

                    const Text(
                      "Update Candidate Status",
                      style: TextStyle(fontSize: 19, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 24),

                    // Status Dropdown
                    ResponsiveDropdown<String>(
                      label: 'Status',
                      hint: 'Choose status',
                      value: selectedStatus,
                      itemList: const [
                        'Applied',
                        'Shortlisted',
                        'Interviewed',
                        'Selected',
                        'Rejected',
                        'Offered',
                        'Hired',
                      ],
                      onChanged: (v) {
                        setState(() {
                          selectedStatus = v;
                        });
                      },
                    ),
                    const SizedBox(height: 16),

                    // Reason Field
                    CustomTextField(
                      title: "Reason",
                      hintText: "Enter reason for this change",
                      controller: reasonCtrl,
                      maxLines: 3,
                      prefixIcon: Icons.note_outlined,
                    ),
                    const SizedBox(height: 24),

                    // Update Button
                    Consumer<HREmployeeApiProvider>(
                      builder: (_, providerWatch, __) => SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          onPressed: providerWatch.isLoading
                              ? null
                              : () async {
                            if (selectedStatus == null) return;

                            final Map<String, dynamic> requestBody = {
                              "status": selectedStatus,
                              "remarks": reasonCtrl.text.trim(),
                            };

                            // API call
                            await provider.changeCandidateHiredStatus(
                              context,
                              candidateId,
                              requestBody,
                            );

                            // Check if API was successful
                            if (provider.changeCandidateHiredStatusModelResponse?.success == true) {
                              // Close bottom sheet with success result
                              if (context.mounted) {
                                Navigator.pop(context);
                                await refreshData();
                              }
                            }
                          },
                          child: providerWatch.isLoading
                              ? Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              SizedBox(
                                width: 18,
                                height: 18,
                                child: LoadingIndicatorUtils(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              ),
                              SizedBox(width: 10),
                              Text(
                                "Updating...",
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          )
                              : const Text(
                            "Update Status",
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      appBar: DefaultCommonAppBar(
        activityName: "Candidates",
        backgroundColor: AppColors.primary,
        actionIcons: [Icons.refresh],
        onActionTap: [
              () {
            final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
            provider.getAllHRHiredCandidatesList(context);
          },
        ],
      ),
      body: Consumer<HREmployeeApiProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(
              child: CircularProgressIndicator(strokeWidth: 2.5),
            );
          }

          final candidates = provider.getAllCandidateListModel?.data?.data ?? [];

          if (candidates.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.person_search_outlined, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 12),
                  Text(
                    'No candidates found',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[700],
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Candidates will appear here once they apply',
                    style: TextStyle(fontSize: 13, color: Colors.grey[500]),
                  ),
                ],
              ),
            );
          }

          return FadeTransition(
            opacity: _fadeAnimation,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: candidates.length,
              itemBuilder: (context, index) {
                final candidate = candidates[index];
                final name = candidate.name ?? 'No Name';
                final jobTitle = candidate.jobId?.title ?? 'No Job Title';
                final experience = candidate.experience ?? 'Not specified';
                final skills = candidate.skills?.join(', ') ?? 'No skills listed';
                final appliedDate = _formatDate(candidate.appliedDate);
                final avatar = _getInitials(candidate.name);
                final status = candidate.status ?? 'Pending';

                return TweenAnimationBuilder<double>(
                  duration: Duration(milliseconds: 300 + (index * 50)),
                  tween: Tween(begin: 0.0, end: 1.0),
                  builder: (context, value, child) {
                    return Transform.translate(
                      offset: Offset(0, 20 * (1 - value)),
                      child: Opacity(
                        opacity: value,
                        child: InkWell(
                          // onTap: () => _showCandidateDetailBottomSheet(context, candidate.sId ?? ''),
                          onTap: () async {
                            final result = await Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => CandidateDetailScreen(candidateId: candidate.sId!),
                              ),
                            );

                            print("BACK FROM DETAIL: $result"); // ← YEH TRUE AANA CHAHIYE

                            if (result == true) {
                              await refreshData();
                            }
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.grey[200]!, width: 1),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Header Row
                                  Row(
                                    children: [
                                      Container(
                                        width: 48,
                                        height: 48,
                                        decoration: BoxDecoration(
                                          color: const Color(0xFF1A1A1A),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Center(
                                          child: Text(
                                            avatar,
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              name,
                                              style: const TextStyle(
                                                fontSize: 15,
                                                fontWeight: FontWeight.w600,
                                                color: Color(0xFF1A1A1A),
                                                letterSpacing: -0.2,
                                              ),
                                            ),
                                            const SizedBox(height: 3),
                                            Text(
                                              jobTitle,
                                              style: TextStyle(
                                                fontSize: 13,
                                                color: Colors.grey[600],
                                                fontWeight: FontWeight.w400,
                                              ),
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      _buildStatusChip(status),
                                    ],
                                  ),

                                  const SizedBox(height: 16),

                                  // Info Section
                                  Container(
                                    padding: const EdgeInsets.all(14),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF9FAFB),
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(color: Colors.grey[200]!, width: 1),
                                    ),
                                    child: Column(
                                      children: [
                                        _buildListInfoRow(Icons.timeline, "Experience", experience),
                                        const SizedBox(height: 10),
                                        _buildListInfoRow(Icons.code, "Skills", skills),
                                        const SizedBox(height: 10),
                                        _buildListInfoRow(Icons.calendar_today_outlined, "Applied", appliedDate),
                                      ],
                                    ),
                                  ),

                                  const SizedBox(height: 14),

                                  // Action Buttons
                                  // ── ACTION BUTTON (single) ───────────────────────────────────────
                                  Row(
                                    children: [
                                      Expanded(
                                        child: InkWell(
                                          onTap: () => _showStatusUpdateBottomSheet(context,provider, candidate.sId.toString(), candidate.status.toString()),
                                          borderRadius: BorderRadius.circular(10),
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(vertical: 12),
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              borderRadius: BorderRadius.circular(10),
                                              border: Border.all(color: AppColors.primary, width: 1.5),
                                            ),
                                            child: Row(
                                              mainAxisAlignment: MainAxisAlignment.center,
                                              children: const [
                                                Icon(Icons.sync, size: 16, color: AppColors.primary),
                                                SizedBox(width: 6),
                                                Text(
                                                  "Update Status",
                                                  style: TextStyle(
                                                    fontSize: 13,
                                                    color: AppColors.primary,
                                                    fontWeight: FontWeight.w600,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),

                                  if (status.toLowerCase() == "shortlisted") ...[
                                    const SizedBox(height: 10),
                                    InkWell(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) => ScheduleInterviewScreen(candidateName: name),
                                          ),
                                        );
                                      },
                                      borderRadius: BorderRadius.circular(10),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFF1A1A1A),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: const Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Icon(Icons.calendar_today, color: Colors.white, size: 16),
                                            SizedBox(width: 8),
                                            Text(
                                              "Schedule Interview",
                                              style: TextStyle(
                                                fontSize: 13,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildListInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(width: 10),
        Expanded(
          child: Row(
            children: [
              Text(
                "$label: ",
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
              ),
              Expanded(
                child: Text(
                  value,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF1A1A1A),
                    fontWeight: FontWeight.w600,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}