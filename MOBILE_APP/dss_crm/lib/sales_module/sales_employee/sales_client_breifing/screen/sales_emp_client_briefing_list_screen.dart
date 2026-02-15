import 'package:dss_crm/utils/image_loader_util.dart';
import 'package:dss_crm/utils/string_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/responsive_loader_utils.dart';
import '../controller/sales_emp_client_briefing_controller.dart';

class SalesEmpClientBriefingListViewScreen extends StatefulWidget {
  const SalesEmpClientBriefingListViewScreen({super.key});

  @override
  State<SalesEmpClientBriefingListViewScreen> createState() =>
      _SalesEmpClientBriefingListViewScreenState();
}

class _SalesEmpClientBriefingListViewScreenState
    extends State<SalesEmpClientBriefingListViewScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<SalesEmpClientBriefingApiProvider>(
        context,
        listen: false,
      ).getAllSalesClientBriefingList(context);
    });
  }

  bool _isImageUrl(String url) {
    final lower = url.toLowerCase();
    return lower.endsWith('.jpg') ||
        lower.endsWith('.jpeg') ||
        lower.endsWith('.png');
  }

  bool _isPdfUrl(String url) => url.toLowerCase().endsWith('.pdf');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightYellowColor,
      appBar: DefaultCommonAppBar(
        activityName: "Client Briefings",
        backgroundColor: AppColors.primary,
      ),
      body: Consumer<SalesEmpClientBriefingApiProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: LoadingIndicatorUtils());
          }

          final response =  provider.getSalesEmpClientBreifingListLeadModelResponse;
          if (response?.success != true || response?.data?.data == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(
                    response?.message ?? "Failed to load data.",
                    style: TextStyle(color: Colors.grey[600], fontSize: 16),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            );
          }

          final briefingList = response!.data!.data!;
          return ListView.separated(
            padding: const EdgeInsets.all(0),
            itemCount: briefingList.length,
            separatorBuilder: (_, __) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final b = briefingList[index];

              return Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  // boxShadow: [
                  //   BoxShadow(
                  //     color: Colors.black.withOpacity(0.08),
                  //     blurRadius: 8,
                  //     offset: const Offset(0, 2),
                  //   ),
                  //   BoxShadow(
                  //     color: Colors.black.withOpacity(0.04),
                  //     blurRadius: 1,
                  //     offset: const Offset(0, 1),
                  //   ),
                  // ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header Section
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            AppColors.primary.withOpacity(0.1),
                            AppColors.primary.withOpacity(0.05),
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(16),
                          topRight: Radius.circular(16),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Icon(
                                  Icons.person_outline,
                                  color: AppColors.primary,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      StringUtils.capitalizeEachWord(
                                            b.clientName.toString(),
                                          ) ??
                                          "N/A",
                                      // style: const TextStyle(
                                      //   fontSize: 18,
                                      //   fontWeight: FontWeight.bold,
                                      //   color: Color(0xFF1A202C),
                                      // ),
                                      style: AppTextStyles.heading1(
                                        context,
                                      ).copyWith(fontSize: 16),
                                    ),
                                    if (b.companyName?.isNotEmpty == true)
                                      Text(
                                        StringUtils.capitalizeEachWord(
                                          b.companyName!,
                                        ),
                                        // style: TextStyle(
                                        //   fontSize: 14,
                                        //   color: Colors.grey[600],
                                        //   fontWeight: FontWeight.w500,
                                        // ),
                                          style: AppTextStyles.body1(context).copyWith(fontSize: 12)
                                      ),
                                  ],
                                ),
                              ),
                              if (b.createdAt != null)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: Colors.grey[200]!,
                                      width: 1,
                                    ),
                                  ),
                                  child: Text(
                                    DateFormat(
                                      'dd MMM',
                                    ).format(DateTime.parse(b.createdAt!)),
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.grey[700],
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          // if (b.leadId?.isNotEmpty == true) ...[
                          //   const SizedBox(height: 12),
                          //   Row(
                          //     children: [
                          //       Icon(
                          //         Icons.tag,
                          //         size: 16,
                          //         color: Colors.grey[600],
                          //       ),
                          //       const SizedBox(width: 6),
                          //       Text(
                          //         "Lead ID: ${b.leadId}",
                          //         style: TextStyle(
                          //           fontSize: 13,
                          //           color: Colors.grey[600],
                          //           fontWeight: FontWeight.w500,
                          //         ),
                          //       ),
                          //     ],
                          //   ),
                          // ],
                        ],
                      ),
                    ),

                    // Content Section
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Project Details Section
                          _buildSection("Project Details", Icons.work_outline, [
                            _buildInfoRow("Project", b.projectName),
                            _buildInfoRow("Product", b.productName),
                          ]),

                          const SizedBox(height: 20),

                          // Client Information Section
                          _buildSection(
                            "Client Information",
                            Icons.person_pin,
                            [
                              _buildInfoRow("Profile", b.clientProfile),
                              _buildInfoRow("Behaviour", b.clientBehaviour),
                            ],
                          ),

                          const SizedBox(height: 20),

                          // Discussion & Instructions Section
                          _buildSection(
                            "Discussion & Instructions",
                            Icons.chat_bubble_outline,
                            [
                              _buildInfoRow(
                                "Discussion Done",
                                b.discussionDone,
                              ),
                              _buildInfoRow(
                                "Recce Instructions",
                                b.instructionRecce,
                              ),
                              _buildInfoRow(
                                "Design Instructions",
                                b.instructionDesign,
                              ),
                              _buildInfoRow(
                                "Installation Instructions",
                                b.instructionInstallation,
                              ),
                              _buildInfoRow(
                                "Other Instructions",
                                b.instructionOther,
                              ),
                            ],
                          ),

                          // Documents Section
                          if (b.documentUpload != null &&
                              b.documentUpload!.isNotEmpty) ...[
                            const SizedBox(height: 24),
                            _buildDocumentsSection(b.documentUpload!),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildSection(String title, IconData icon, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Icon(icon, size: 16, color: AppColors.primary),
            ),
            const SizedBox(width: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2D3748),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            // color: const Color(0xFFF7FAFC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE2E8F0), width: 1),
          ),
          child: Column(children: children),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String title, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              "$title:",
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: Color(0xFF4A5568),
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value?.trim().isNotEmpty == true ? value! : "N/A",
              style: const TextStyle(
                color: Color(0xFF2D3748),
                fontSize: 14,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDocumentsSection(List<dynamic> documents) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Icon(
                Icons.attach_file,
                size: 16,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              "Documents",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2D3748),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                "${documents.length}",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            // color: const Color(0xFFF7FAFC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE2E8F0), width: 1),
          ),
          child: Wrap(
            spacing: 16,
            runSpacing: 16,
            children: documents.map((doc) {
              final url = doc.url!;
              final fileName = Uri.decodeFull(url.split('/').last);

              return GestureDetector(
                onTap: () async {
                  final uri = Uri.parse(url);
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Can't open file")),
                    );
                  }
                },
                child: Container(
                  width: 80,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFFE2E8F0),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 80,
                        height: 70,
                        decoration: const BoxDecoration(
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(12),
                            topRight: Radius.circular(12),
                          ),
                        ),
                        child: _isImageUrl(url)
                            ? ClipRRect(
                                borderRadius: const BorderRadius.only(
                                  topLeft: Radius.circular(12),
                                  topRight: Radius.circular(12),
                                ),
                                child: ImageLoaderUtil.cacheNetworkImage(
                                  url,
                                  fit: BoxFit.cover,
                                ),
                              )
                            : Container(
                                decoration: BoxDecoration(
                                  color: _isPdfUrl(url)
                                      ? const Color(0xFFFED7D7)
                                      : AppColors.primary.withOpacity(0.1),
                                  borderRadius: const BorderRadius.only(
                                    topLeft: Radius.circular(12),
                                    topRight: Radius.circular(12),
                                  ),
                                ),
                                child: Center(
                                  child: Icon(
                                    _isPdfUrl(url)
                                        ? Icons.picture_as_pdf_rounded
                                        : Icons.insert_drive_file_rounded,
                                    color: _isPdfUrl(url)
                                        ? const Color(0xFFE53E3E)
                                        : AppColors.primary,
                                    size: 28,
                                  ),
                                ),
                              ),
                      ),
                      Container(
                        width: 80,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 8,
                        ),
                        child: Text(
                          fileName,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF4A5568),
                            height: 1.2,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
