import 'package:dss_crm/sales_module/common/model/sales_emp_client_briefing_form_list_model.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:dss_crm/utils/string_utils.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';

class SalesFormLeadAction {
  final IconData? icon; // For Material icons
  final String? assetIconPath; // For asset icons
  final String tooltip;
  final Color? iconColor;
  final void Function(Result lead) onTap;

  SalesFormLeadAction({
    this.icon,
    this.assetIconPath,
    required this.tooltip,
    required this.onTap,
    this.iconColor = Colors.black,
  }) : assert(
         icon != null || assetIconPath != null,
         'Either icon or assetIconPath must be provided',
       );
}

class SalesFormListDataTable extends StatefulWidget {
  final List<Result> leads;

  // final List<Result> leads;
  final String? actionBtnText;
  final void Function(Result lead)? onActionTap;
  final List<SalesFormLeadAction>? leadActions;
  final bool showActionTextButton;
  final bool showActionButtons; //   Add this flag
  final bool showActionIcons; //   Add this flag

  const SalesFormListDataTable({
    super.key,
    required this.leads,
    this.onActionTap,
    this.actionBtnText = "Action",
    this.showActionButtons = false,
    this.showActionIcons = false,
    this.leadActions,
    this.showActionTextButton = false,
  });

  @override
  State<SalesFormListDataTable> createState() => _SalesFormListDataTableState();
}

class _SalesFormListDataTableState extends State<SalesFormListDataTable> {
  bool _isDescending = true;
  late final String userRole;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    loadUserData();
  }

  void loadUserData() async {
    userRole = await StorageHelper().getLoginRole();
    print("userrole==${userRole}");
  }

  /// Get status color based on lead status
  Color getStatusTextColor(String? status) {
    switch (status?.toLowerCase().trim()) {
      case 'pending':
        return Colors.yellow.shade700;
      case 'in progress':
        return AppColors.blueColor;
      case 'close':
        return Colors.red.shade700;
      case 'success':
        return Colors.green.shade700;
      default:
        return Colors.grey.shade800;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Sort leads based on _isDescending flag
    List<Result> sortedLeads = List.from(widget.leads);
    sortedLeads.sort((a, b) {
      final aDate = DateTime.tryParse(a.timestamp ?? '');
      final bDate = DateTime.tryParse(b.timestamp ?? '');
      if (aDate == null || bDate == null) return 0;
      return _isDescending ? bDate.compareTo(aDate) : aDate.compareTo(bDate);
    });

    return SingleChildScrollView(
      scrollDirection: Axis.vertical, //   Enables vertical scrolling
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          columnSpacing: 40,
          headingRowHeight: 50,
          headingRowColor: MaterialStateProperty.all(AppColors.primary),
          headingTextStyle: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 14,
          ),
          columns: [
            const DataColumn(label: Text("Sr. No.")),
            if (widget.showActionButtons) const DataColumn(label: Text("Action")),
            DataColumn(
              label: InkWell(
                onTap: () {
                  setState(() {
                    _isDescending = !_isDescending;
                  });
                },
                child: Row(
                  children: [
                    const Text("Client Briefing Time"),
                    const SizedBox(width: 4),
                    Icon(
                      _isDescending ? Icons.arrow_downward : Icons.arrow_upward,
                      size: 16,
                      color: Colors.white,
                    ),
                  ],
                ),
              ),
            ),
            const DataColumn(label: Text("Impanelled By")),
            const DataColumn(label: Text("Sales Person")),
            const DataColumn(label: Text("Project Code")),
            const DataColumn(label: Text("Project Name")),
            const DataColumn(label: Text("Sales Type")),
            const DataColumn(label: Text("Project Detail")),
            const DataColumn(label: Text("Concern Person Name")),
            const DataColumn(label: Text("Concern Person Designation")),
            const DataColumn(label: Text("Company/Individual Name")),
            const DataColumn(label: Text("Contact Number")),
            const DataColumn(label: Text("Alternate Number")),
            const DataColumn(label: Text("Full Address")),
            const DataColumn(label: Text("Location Link")),
          ],
          rows: List.generate(sortedLeads.length, (index) {
            final lead = sortedLeads[index];

            // Build base cells
            List<DataCell> cells = [DataCell(Text('${index + 1}'))];

            // Correctly add the action DataCell to the cells list if the condition is true
            // Use the same single flag to conditionally add the action cell
            if (widget.showActionButtons) {
              cells.add(
                DataCell(
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Existing IconButtons logic remains the same
                      ...?widget.leadActions?.map((action) {
                        return IconButton(
                          icon: action.assetIconPath != null
                              ? Image.asset(
                            action.assetIconPath!,
                            width: 20,
                            height: 20,
                            color: action.iconColor,
                          )
                              : Icon(
                            action.icon,
                            size: 20,
                            color: action.iconColor,
                          ),
                          tooltip: action.tooltip,
                          onPressed: () => action.onTap(lead),
                        );
                      }),
                      // Optional Custom Text Button logic remains the same
                      if (widget.showActionTextButton)
                        GestureDetector(
                          onTap: () {
                            if (widget.onActionTap != null) {
                              widget.onActionTap!(lead);
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            margin: const EdgeInsets.only(left: 4),
                            decoration: BoxDecoration(
                              color: Colors.green,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              widget.actionBtnText ?? "Action",
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            }


            // Remaining cells
            cells.addAll([
              DataCell(
                Text(
                  DateFormatterUtils.formatUtcToReadable(lead.timestamp ?? "-"),
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: const TextStyle(fontSize: 14),
                  ),
                ),
              ),
              DataCell(
                Text(
                  StringUtils.capitalizeFirstLetter(lead.impanelledBy ?? "-"),
                ),
              ),
              DataCell(Text(lead.salesAssistant ?? "-")),
              DataCell(Text(lead.projectCode ?? "-")),
              DataCell(Text(lead.projectName ?? "-")),
              DataCell(Text(lead.salesType ?? "-")),
              DataCell(Text(lead.projectDetail ?? "-")),
              DataCell(Text(lead.clientName ?? "-")),
              DataCell(Text(lead.concernPersonDesignation ?? "-")),
              DataCell(Text(lead.companyName ?? "-")),
              DataCell(
                Text(
                  lead.phone ?? "-",
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: const TextStyle(fontSize: 12),
                  ),
                ),
              ),
              DataCell(
                Text(
                  lead.altPhone ?? "-",
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: const TextStyle(fontSize: 12),
                  ),
                ),
              ),
              DataCell(
                Text(
                  lead.fullAddress ?? "-",
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: const TextStyle(fontSize: 12),
                  ),
                ),
              ),
              // DataCell(Text(lead.locationLink ?? "-",
              //   style: AppTextStyles.body1(
              //     context,
              //     overrideStyle: const TextStyle(
              //       fontSize: 12,
              //     ),
              //   ),)),
              DataCell(
                InkWell(
                  onTap: () async {
                    final url = lead.locationLink ?? '';
                    if (url.isNotEmpty && await canLaunchUrl(Uri.parse(url))) {
                      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Could not open location link')),
                      );
                    }
                  },
                  child: Text(
                    (lead.locationLink?.length ?? 0) > 35
                        ? '${lead.locationLink!.substring(0, 35)}...'
                        : (lead.locationLink ?? "-"),
                    style: AppTextStyles.body1(
                      context,
                      overrideStyle: const TextStyle(
                        fontSize: 12,
                      ),
                    ).copyWith(
                      decoration: TextDecoration.underline,
                      color: AppColors.blueColor,
                      decorationColor: AppColors.blueColor,
                    ),
                  ),
                ),
              ),

            ]);

            return DataRow(
              color: WidgetStateProperty.all(
                index % 2 == 0 ? Colors.white : Colors.grey.shade100,
              ),
              cells: cells,
            );
          }),
        ),
      ),
    );
  }
}

class LeadActionButton extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onTap;
  final EdgeInsets? margin;

  const LeadActionButton({
    Key? key,
    required this.label,
    required this.color,
    required this.onTap,
    this.margin,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        margin: margin ?? const EdgeInsets.only(left: 4),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
