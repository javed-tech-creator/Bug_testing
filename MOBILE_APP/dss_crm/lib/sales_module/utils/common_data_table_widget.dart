import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:dss_crm/utils/string_utils.dart';
import 'package:flutter/material.dart';
import '../../ui_helper/app_colors.dart';
import '../../ui_helper/app_text_styles.dart';
import '../sales_hod/lead/model/sales_hod_lead_list_model.dart' show Result;

class LeadAction {
  final IconData? icon; // For Material icons
  final String? assetIconPath; // For asset icons
  final String tooltip;
  final Color? iconColor;
  final void Function(Result lead) onTap;

  LeadAction({
    this.icon,
    this.assetIconPath,
    required this.tooltip,
    required this.onTap,
    this.iconColor = Colors.black,
  }) : assert(icon != null || assetIconPath != null, 'Either icon or assetIconPath must be provided');
}


class LeadDataTable extends StatefulWidget {
  final List<Result> leads;

  // final List<Result> leads;
  final String? actionBtnText;
  final void Function(Result lead)? onActionTap;
  final List<LeadAction>? leadActions;
  final bool showActionTextButton;
  final bool showActionIcons; //   Add this flag
  const LeadDataTable({
    super.key,
    required this.leads,
    this.onActionTap,
    this.actionBtnText = "Action",
    this.showActionIcons = false,
    this.leadActions,
  this.showActionTextButton = false,
  });

  @override
  State<LeadDataTable> createState() => _LeadDataTableState();
}

class _LeadDataTableState extends State<LeadDataTable> {
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
      final aDate = DateTime.tryParse(a.createdAt ?? '');
      final bDate = DateTime.tryParse(b.createdAt ?? '');
      if (aDate == null || bDate == null) return 0;
      return _isDescending ? bDate.compareTo(aDate) : aDate.compareTo(bDate);
    });

    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
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
                  // const DataColumn(label: Text("Action")),
                  if (widget.showActionIcons) const DataColumn(label: Text("Action")),
                  //   conditional
                  const DataColumn(label: Text("Status")),
                  const DataColumn(label: Text("Lead Source")),
                  const DataColumn(label: Text("Lead Type")),
                  const DataColumn(label: Text("Concern Person Name")),
                  const DataColumn(label: Text("Email")),
                  const DataColumn(label: Text("Phone")),
                  const DataColumn(label: Text("City")),
                  const DataColumn(label: Text("Address")),
                  const DataColumn(label: Text("Pin Code")),
                  const DataColumn(label: Text("Requirement")),

                  // 🔄 Sortable Query Date Column Header
                  DataColumn(
                    label: InkWell(
                      onTap: () {
                        setState(() {
                          _isDescending = !_isDescending;
                        });
                      },
                      child: Row(
                        children: [
                          const Text("Query Date"),
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
                ],
                rows: List.generate(sortedLeads.length, (index) {
                  final lead = sortedLeads[index];
                  final status = lead.leadStatus ?? "unknown";
                  print("leadStatsu ==${status}");

                  return DataRow(
                    color: WidgetStateProperty.all(
                      index % 2 == 0 ? Colors.white : Colors.grey.shade100,
                    ),
                    cells: [
                      DataCell(Text('${index + 1}')),
                      if (widget.showActionIcons)
                        DataCell(
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // Existing IconButtons
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

                              // Optional Custom Text Button
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

                        // DataCell(
                        //   Row(
                        //     mainAxisSize: MainAxisSize.min,
                        //     children: [
                        //       ...?widget.leadActions?.map((action) {
                        //         return LeadActionButton(
                        //           label: action.tooltip,
                        //           color: action.iconColor ?? Colors.blue,
                        //           onTap: () => action.onTap(lead),
                        //         );
                        //       }),
                        //       if (widget.showActionTextButton)
                        //         LeadActionButton(
                        //           label: widget.actionBtnText ?? "Action",
                        //           color: Colors.green,
                        //           onTap: () {
                        //             if (widget.onActionTap != null) {
                        //               widget.onActionTap!(lead);
                        //             }
                        //           },
                        //         ),
                        //     ],
                        //   ),
                        // ),



                      DataCell(
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          // decoration: BoxDecoration(
                          //   borderRadius: BorderRadius.circular(6),
                          //   border: Border.all(color: getStatusTextColor(status)),
                          // ),
                          child: Text(
                            StringUtils.capitalizeFirstLetter(status),
                            style: TextStyle(
                              fontSize: 14,
                              color: getStatusTextColor(status),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          lead.leadSource ?? "-",
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          lead.leadType ?? "-",
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          lead.concernPersonName ?? "-",
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          lead.email ?? "-",
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          lead.phone ?? "-",
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          lead.city ?? "-",
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          lead.address ?? "-",
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          lead.pincode ?? "-",
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          lead.requirement ?? "-",
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          DateFormatterUtils.formatUtcToReadable(lead.createdAt ?? "-"),
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ),
                    ],
                  );
                }),
              ),
            ),
          ),
        ),
      ],
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

