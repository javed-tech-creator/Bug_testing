import 'dart:math';

import 'package:dss_crm/admin/common/admin_sidebar_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../../utils/storage_util.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  String selectedMenu = 'Vendor Dashboard';
  bool isDrawerOpen = true;
  String? userName = '';
  String? userRole = '';

  @override
  void initState() {
    super.initState();
    loadUserData();
  }

  void loadUserData() async {
    userName = await StorageHelper().getLoginUserName() ?? "Ashish Kumar";
    userRole = await StorageHelper().getLoginRole() ?? "";
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    bool isTablet = ResponsiveHelper.isTablet(context);

    return Scaffold(
      backgroundColor: AppColors.lightBgColor,
      drawer: Drawer(
        backgroundColor: AppColors.primary,
        child: Column(
          children: [
            Expanded(
              child: AdminSidebarMenu(
                userName: userName ?? "Gueste",
                onItemSelected: (selected) {},
              ),
            ),
          ],
        ),
      ),
      body: SalesFunnelPipeline(),

      // SafeArea(
      //   child: SingleChildScrollView(
      //     padding: const EdgeInsets.all(0),
      //     child: Column(
      //       children: [_buildMobileLayout()],
      //     ),
      //   ),
      // ),
    );
  }
}

class SalesFunnelPipeline extends StatefulWidget {
  const SalesFunnelPipeline({Key? key}) : super(key: key);

  @override
  State<SalesFunnelPipeline> createState() => _SalesFunnelPipelineState();
}

class _SalesFunnelPipelineState extends State<SalesFunnelPipeline> {
  String? selectedStageId;

  final List<FunnelStageModel> stages = [
    FunnelStageModel(
      id: 'indirect',
      title: 'INDIRECT\nLEAD\nMANAGEMENT',
      color: const Color(0xFFE3F2FD),
      borderColor: const Color(0xFF1976D2),
      total: 1200,
      buckets: ['Not Interested\nLeads Bucket'],
    ),
    FunnelStageModel(
      id: 'personal',
      title: 'PERSONAL\nFOLLOWUP',
      color: const Color(0xFFF3E5F5),
      borderColor: const Color(0xFF9C27B0),
      total: 700,
      buckets: ['Lost Leads\nBucket', '30-60 Loss'],
    ),
    FunnelStageModel(
      id: 'visit',
      title: 'SITE\nVISIT',
      color: const Color(0xFFE8F5E9),
      borderColor: const Color(0xFF2E7D32),
      total: 350,
      buckets: ['Rejected\nDeals'],
    ),
    FunnelStageModel(
      id: 'deal',
      title: 'DEAL\nCLOSE',
      color: const Color(0xFFFFF3E0),
      borderColor: const Color(0xFFF57C00),
      total: 150,
      buckets: [],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final stageWidth = (width - 40) / (stages.length + 0.4);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sales Funnel Pipeline'),
        backgroundColor: const Color(0xFF1B3A2F),
      ),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 12),
            // Left incoming arrows
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12.0),
              child: Row(
                children: [
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (i) {
                      return const Padding(
                        padding: EdgeInsets.symmetric(vertical: 4.0),
                        child: Icon(
                          Icons.arrow_forward,
                          size: 18,
                          color: Colors.grey,
                        ),
                      );
                    }),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: stages.asMap().entries.map((entry) {
                          final idx = entry.key;
                          final stage = entry.value;
                          final isSelected = selectedStageId == stage.id;
                          final shrinkFactor = 1.0 - (idx * 0.12);
                          final height = (220 * shrinkFactor).clamp(120.0, 220.0);

                          return Padding(
                            padding: EdgeInsets.symmetric(horizontal: idx == 0 ? 0 : 12.0, vertical: 8),
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  selectedStageId = isSelected ? null : stage.id;
                                });
                              },
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  // Funnel with arrow connector on right (except last)
                                  Stack(
                                    clipBehavior: Clip.none,
                                    children: [
                                      AnimatedContainer(
                                        duration: const Duration(milliseconds: 300),
                                        width: isSelected ? stageWidth + 60 : stageWidth + 20,
                                        height: isSelected ? height + 40 : height,
                                        decoration: BoxDecoration(
                                          borderRadius: BorderRadius.circular(14),
                                          color: stage.color,
                                          border: Border.all(
                                            color: stage.borderColor,
                                            width: isSelected ? 3 : 2,
                                          ),
                                          boxShadow: [
                                            BoxShadow(
                                              color: stage.borderColor.withOpacity(0.18),
                                              blurRadius: isSelected ? 12 : 6,
                                              offset: const Offset(0, 6),
                                            ),
                                          ],
                                        ),
                                        child: CustomPaint(
                                          painter: FunnelPainter(
                                            color: stage.color,
                                            border: stage.borderColor,
                                          ),
                                          child: Padding(
                                            padding: const EdgeInsets.all(12.0),
                                            child: Column(
                                              children: [
                                                // Phase circle mimic (small)
                                                Container(
                                                  width: 36,
                                                  height: 36,
                                                  decoration: BoxDecoration(
                                                    color: Colors.white,
                                                    shape: BoxShape.circle,
                                                    border: Border.all(
                                                      color: stage.borderColor,
                                                      width: 2,
                                                    ),
                                                  ),
                                                  child: Center(
                                                    child: Text(
                                                      '${idx + 1}',
                                                      style: TextStyle(
                                                        color: stage.borderColor,
                                                        fontWeight: FontWeight.bold,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(height: 8),
                                                Text(
                                                  stage.title,
                                                  style: TextStyle(
                                                    color: stage.borderColor,
                                                    fontWeight: FontWeight.bold,
                                                    height: 1.1,
                                                    fontSize: isSelected ? 13 : 11,
                                                  ),
                                                  textAlign: TextAlign.center,
                                                ),
                                                const SizedBox(height: 8),
                                                Container(
                                                  padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
                                                  decoration: BoxDecoration(
                                                    color: Colors.white.withOpacity(0.9),
                                                    borderRadius: BorderRadius.circular(8),
                                                  ),
                                                  child: Column(
                                                    children: [
                                                      Text(
                                                        '${stage.total}',
                                                        style: TextStyle(
                                                          color: stage.borderColor,
                                                          fontWeight: FontWeight.bold,
                                                          fontSize: isSelected ? 18 : 14,
                                                        ),
                                                      ),
                                                      const Text(
                                                        'Leads',
                                                        style: TextStyle(fontSize: 10, color: Colors.black54),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),

                                      // Small right arrow connector
                                      if (idx != stages.length - 1)
                                        Positioned(
                                          right: -28,
                                          top: 0,
                                          bottom: 0,
                                          child: Column(
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              Transform.rotate(
                                                angle: 0,
                                                child: Icon(
                                                  Icons.arrow_forward_ios,
                                                  size: isSelected ? 34 : 26,
                                                  color: Colors.grey[600],
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                    ],
                                  ),

                                  // Bucket area shown only if has buckets
                                  if (stage.buckets.isNotEmpty)
                                    AnimatedContainer(
                                      duration: const Duration(milliseconds: 300),
                                      margin: const EdgeInsets.only(top: 10),
                                      width: isSelected ? stageWidth + 60 : stageWidth + 20,
                                      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
                                      decoration: BoxDecoration(
                                        color: Colors.red.shade50,
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(
                                          color: Colors.red.shade300,
                                          width: 1.6,
                                        ),
                                      ),
                                      child: Column(
                                        children: [
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              Icon(Icons.delete_outline, size: 14, color: Colors.red.shade700),
                                              const SizedBox(width: 6),
                                              Text(
                                                'BUCKET',
                                                style: TextStyle(
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.red.shade700,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 6),
                                          ...stage.buckets.map((b) => Text(
                                            b,
                                            textAlign: TextAlign.center,
                                            style: const TextStyle(fontSize: 10),
                                          )),
                                        ],
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Legend / Stats row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12.0),
              child: Row(
                children: const [
                  StatChip(label: 'Total', value: '1200+'),
                  SizedBox(width: 8),
                  StatChip(label: 'Active', value: '280'),
                  SizedBox(width: 8),
                  StatChip(label: 'Conversion', value: '28%'),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // A bottom miniature pipeline preview (optional)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12.0),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: const Text(
                        'Tap any stage to expand and see buckets / details.',
                        style: TextStyle(fontSize: 13),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}

class FunnelPainter extends CustomPainter {
  final Color color;
  final Color border;

  FunnelPainter({required this.color, required this.border});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final borderPaint = Paint()
      ..color = border
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    final path = Path();

    // Draw a trapezoid-like funnel (wide left, narrower right)
    final leftTop = Offset(0, 12);
    final leftBottom = Offset(0, size.height - 12);
    final rightTop = Offset(size.width * 0.78, size.height * 0.22);
    final rightBottom = Offset(size.width * 0.78, size.height * 0.78);

    path.moveTo(leftTop.dx, leftTop.dy);
    path.lineTo(rightTop.dx, rightTop.dy);
    path.lineTo(rightBottom.dx, rightBottom.dy);
    path.lineTo(leftBottom.dx, leftBottom.dy);
    path.close();

    // fill
    canvas.drawPath(path, paint);
    // border
    canvas.drawPath(path, borderPaint);

    // inner dashed lines (flow lines)
    final dashPaint = Paint()
      ..color = border.withOpacity(0.5)
      ..strokeWidth = 1.1;

    final centerY = size.height / 2;
    final startX = 8.0;
    final endX = rightTop.dx - 6;
    double x = startX;
    while (x < endX) {
      canvas.drawLine(Offset(x, centerY - 10), Offset(min(x + 16, endX), centerY - 10), dashPaint);
      canvas.drawLine(Offset(x, centerY), Offset(min(x + 24, endX), centerY), dashPaint);
      canvas.drawLine(Offset(x, centerY + 10), Offset(min(x + 16, endX), centerY + 10), dashPaint);
      x += 36;
    }
  }

  @override
  bool shouldRepaint(covariant FunnelPainter oldDelegate) {
    return oldDelegate.color != color || oldDelegate.border != border;
  }
}

class FunnelStageModel {
  final String id;
  final String title;
  final Color color;
  final Color borderColor;
  final int total;
  final List<String> buckets;

  FunnelStageModel({
    required this.id,
    required this.title,
    required this.color,
    required this.borderColor,
    required this.total,
    required this.buckets,
  });
}

class StatChip extends StatelessWidget {
  final String label;
  final String value;

  const StatChip({Key? key, required this.label, required this.value}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minWidth: 80),
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade300),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 6)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text(label, style: const TextStyle(fontSize: 11, color: Colors.black54)),
        ],
      ),
    );
  }
}

