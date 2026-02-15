import 'dart:io';

import 'package:dss_crm/tech_module/tech_employee/controller/tech_engineer_api_provider.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/permission_manager_utils.dart';

class SupportTicketScreen extends StatefulWidget {
  const SupportTicketScreen({Key? key}) : super(key: key);

  @override
  State<SupportTicketScreen> createState() => _SupportTicketScreenState();
}

class _SupportTicketScreenState extends State<SupportTicketScreen> {
  final TextEditingController descriptionController = TextEditingController();
  String selectedPriority = 'Select priority';
  File? selectedFile;
  String? fileName;
  bool isVideo = false;


  void _showCreateTicketBottomSheet(BuildContext context, String ticketType) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        String? errorMessage;
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              child: SingleChildScrollView(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Create Support Ticket',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Category: $ticketType',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        'Priority',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey[300]!),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            dropdownColor: AppColors.whiteColor,
                            value: selectedPriority,
                            isExpanded: true,
                            items: [
                              'Select priority',
                              'Low',
                              'Medium',
                              'High'
                            ].map((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(value),
                              );
                            }).toList(),
                            onChanged: (String? newValue) {
                              setModalState(() {
                                selectedPriority = newValue!;

                                print("selected priority ${selectedPriority}");
                              });
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'Description',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: descriptionController,
                        maxLines: 5,
                        decoration: InputDecoration(
                          hintText: 'Enter issue description...',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Colors.grey[300]!),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Colors.grey[300]!),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(color: Colors.blue),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'Attachment (Image/Video)',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      InkWell(
                        onTap: () async{
                          final hasPermission = await PermissionManager.requestPhotosAndVideos(context);

                          if (!hasPermission) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Permission denied!')),
                            );
                            return;
                          }

                          // Step 2: File picker se photo/video choose karein
                          FilePickerResult? result = await FilePicker.platform.pickFiles(
                            type: FileType.media, // This allows BOTH photos and videos
                            allowMultiple: false,
                          );

                          if (result != null && result.files.single.path != null) {
                            setModalState(() {
                              selectedFile = File(result.files.single.path!);
                              fileName = result.files.single.name;

                              // Check if file is video
                              String extension = fileName!.toLowerCase();
                              isVideo = extension.endsWith('.mp4') ||
                                  extension.endsWith('.mov') ||
                                  extension.endsWith('.avi') ||
                                  extension.endsWith('.mkv') ||
                                  extension.endsWith('.3gp');
                            });
                            print('Selected file: ${selectedFile!.path}');
                          }

                        },
                        child: Container(
                          width: double.infinity,
                          height: 100,
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: Colors.grey[300]!,
                              style: BorderStyle.solid,
                              width: 2,
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.folder, size: 40, color: Colors.grey),
                              SizedBox(height: 8),
                              Text(
                                'Click or drag file here',
                                style: TextStyle(color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      // File Preview Section
                      if (selectedFile != null) ...[
                        const SizedBox(height: 16),
                        InkWell(
                          onTap: () async {
                            // URL Launcher se file open karein
                            final Uri fileUri = Uri.file(selectedFile!.path);
                            if (await canLaunchUrl(fileUri)) {
                              await launchUrl(fileUri, mode: LaunchMode.externalApplication);
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Could not open file'),
                                ),
                              );
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.grey[100],
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.grey[300]!),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: isVideo ? Colors.red[50] : Colors.blue[50],
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Icon(
                                    isVideo ? Icons.videocam : Icons.image,
                                    color: isVideo ? Colors.red : Colors.blue,
                                    size: 28,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        fileName ?? 'Unknown file',
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'Tap to preview',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.close, size: 20),
                                  onPressed: () {
                                    setModalState(() {
                                      selectedFile = null;
                                      fileName = null;
                                      isVideo = false;
                                    });
                                  },
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],

                      const SizedBox(height: 24),
                      // 🔴 Error Message
                      if (errorMessage != null) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                          decoration: BoxDecoration(
                            color: Colors.red[50],
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.redAccent),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.error_outline, color: Colors.redAccent),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  errorMessage!,
                                  style: const TextStyle(
                                    color: Colors.redAccent,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            child: const Text(
                              'Cancel',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          ElevatedButton(
                            onPressed: () async {
                              // Validate fields
                              if (selectedPriority == 'Select priority') {
                                setModalState(() {
                                  errorMessage = 'Please select a priority';
                                });
                                return;
                              }

                              if (descriptionController.text.isEmpty) {
                                setModalState(() {
                                  errorMessage = 'Please enter a description';
                                });
                                return;
                              }

                              if (selectedFile == null) {
                                setModalState(() {
                                  errorMessage = 'Please attach an image';
                                });
                                return;
                              }

                              // Clear error if all is good
                              setModalState(() {
                                errorMessage = null;
                              });

                              try {
                                await Provider.of<TechEngineerApiProvider>(context, listen: false)
                                    .ticketRaisedByTechEngineer(
                                  documents:{'attachment': selectedFile!},
                                  context: context, ticketType: ticketType, priority:selectedPriority, description: descriptionController.text.toString(),
                                );

                                Navigator.pop(context); // close bottom sheet on success
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Ticket created for $ticketType successfully!')),
                                );
                              } catch (e) {
                                setModalState(() {
                                  errorMessage = 'Something went wrong: $e';
                                });
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.orange,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 32,
                                vertical: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text(
                              'Submit',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteColor,
      appBar: DefaultCommonAppBar(
        activityName: "Create Support Ticket",
        backgroundColor: AppColors.primary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const SizedBox(height: 10),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.1,
                children: [
                  _buildCategoryCard(
                    context,
                    icon: Icons.memory,
                    title: 'Hardware',
                    color: Colors.blue,
                  ),
                  _buildCategoryCard(
                    context,
                    icon: Icons.code,
                    title: 'Software',
                    color: Colors.green,
                  ),
                  _buildCategoryCard(
                    context,
                    icon: Icons.wifi,
                    title: 'Internet',
                    color: Colors.purple,
                  ),
                  _buildCategoryCard(
                    context,
                    icon: Icons.email,
                    title: 'Email',
                    color: Colors.red,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryCard(
      BuildContext context, {
        required IconData icon,
        required String title,
        required Color color,
      }) {
    return InkWell(
      onTap: () => _showCreateTicketBottomSheet(context, title),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey[300]!, width: 1.5),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: 36,
                color: color,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    descriptionController.dispose();
    super.dispose();
  }
}

extension ColorExtension on Color {
  Color darken([double amount = 0.1]) {
    assert(amount >= 0 && amount <= 1);
    final hsl = HSLColor.fromColor(this);
    final hslDark = hsl.withLightness((hsl.lightness - amount).clamp(0.0, 1.0));
    return hslDark.toColor();
  }
}