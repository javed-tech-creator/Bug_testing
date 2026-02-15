import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_assigned_lead_model.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:dss_crm/utils/string_utils.dart';
import 'package:flutter/material.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';

class SalesEmpAssignedLeadAcceptedAction {
  final IconData icon;
  final String? assetIconPath;
  final String tooltip;
  final Color iconColor;
  final void Function(Result lead) onTap;

  SalesEmpAssignedLeadAcceptedAction({
    required this.icon,
    required this.tooltip,
    required this.onTap,
    this.assetIconPath,
    this.iconColor = Colors.black,
  });
}

class SalesEmpAssignedLeadListAcceptedDataTable extends StatefulWidget {
  final List<Result> leads;
  final List<SalesEmpAssignedLeadAcceptedAction> leadActions;
  final void Function(Result lead) onActionTap;
  final String actionBtnText;
  final bool showActionButton;

  const SalesEmpAssignedLeadListAcceptedDataTable({
    super.key,
    required this.leads,
    required this.leadActions,
    required this.onActionTap,
    this.actionBtnText = "Action",
    this.showActionButton = true,
  });

  @override
  State<SalesEmpAssignedLeadListAcceptedDataTable> createState() =>
      _SalesEmpAssignedLeadListAcceptedDataTableState();
}

class _SalesEmpAssignedLeadListAcceptedDataTableState
    extends State<SalesEmpAssignedLeadListAcceptedDataTable> {
  bool _isDescending = true;
  late String userRole;

  @override
  void initState() {
    super.initState();
    loadUserData();
  }

  void loadUserData() async {
    userRole = await StorageHelper().getLoginRole();
    setState(() {});
  }

  Color getStatusTextColor(String? status) {
    switch (status?.trim()) {
      case 'Pending':
        return Colors.yellow.shade700;
      case 'In Progress':
        return AppColors.blueColor;
      case 'Close':
        return Colors.red.shade700;
      case 'Success':
        return Colors.green.shade700;
      default:
        return Colors.grey.shade800;
    }
  }

  // bool shouldHideAcceptButton(Result lead) {
  //   // final acceptList = lead.employeeleadsAccept;
  //   //
  //   // if (lead.saleEmployeeId != null && lead.saleEmployeeId!.isNotEmpty) {
  //   //   if (acceptList != null && acceptList.length >= 1) {
  //   //     if (acceptList[0].status == true) {
  //   //       return true;
  //   //     }
  //   //   }
  //   // }
  //   //
  //   // if (lead.saleEmployeeId2 != null && lead.saleEmployeeId2!.isNotEmpty) {
  //   //   if (acceptList != null && acceptList.length >= 2) {
  //   //     if (acceptList[1].status == true) {
  //   //       return true;
  //   //     }
  //   //   }
  //   // }
  //
  //   return lead.saleEmployeeId != null &&
  //       lead.employeeleadsAccept != null &&
  //       lead.employeeleadsAccept!.isNotEmpty &&
  //       lead.employeeleadsAccept!.first.status == true;
  //
  //   return false;
  // }

  bool shouldHideAcceptButton(Result lead) {
    final acceptList = lead.employeeleadsAccept;

    if (acceptList == null || acceptList.isEmpty) return false;

    // saleEmployeeId2 is null → check first object
    if (lead.saleEmployeeId2 == null || lead.saleEmployeeId2!.isEmpty) {
      return acceptList.length >= 1 && acceptList[0].status == true;
    }

    // saleEmployeeId2 is not null → check second object
    if (lead.saleEmployeeId2 != null && lead.saleEmployeeId2!.isNotEmpty) {
      return acceptList.length >= 2 && acceptList[1].status == true;
    }

    return false;
  }


  @override
  Widget build(BuildContext context) {
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
            scrollDirection: Axis.vertical,
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
                columns: const [
                  DataColumn(label: Text("Sr. No.")),
                  DataColumn(label: Text("Action")),
                  DataColumn(label: Text("Status")),
                  DataColumn(label: Text("Query Date")),
                  DataColumn(label: Text("Concern Person Name")),
                  DataColumn(label: Text("Lead Source")),
                  DataColumn(label: Text("Lead Type")),
                  DataColumn(label: Text("Email")),
                  DataColumn(label: Text("Phone")),
                  DataColumn(label: Text("City")),
                  DataColumn(label: Text("Address")),
                  DataColumn(label: Text("Pin Code")),
                  DataColumn(label: Text("Requirement")),
                ],
                rows: List.generate(sortedLeads.length, (index) {
                  final lead = sortedLeads[index];
                  final status = lead.leadStatus ?? "unknown";

                  return DataRow(
                    color: WidgetStateProperty.all(
                      index % 2 == 0 ? Colors.white : Colors.grey.shade100,
                    ),
                    cells: [
                      DataCell(Text('${index + 1}')),
                      DataCell(
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Show ALL icon actions
                            ...widget.leadActions.map((action) {
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
                            }).toList(),

                            // Always show Accept button (unless already accepted)
                            // if (!shouldHideAcceptButton(lead))
                            //   GestureDetector(
                            //     onTap: () => widget.onActionTap(lead),
                            //     child: Container(
                            //       padding: const EdgeInsets.symmetric(
                            //         horizontal: 8,
                            //         vertical: 4,
                            //       ),
                            //       margin: const EdgeInsets.only(left: 4),
                            //       decoration: BoxDecoration(
                            //         color: Colors.blue,
                            //         borderRadius: BorderRadius.circular(6),
                            //       ),
                            //       child: const Text(
                            //         "Accept",
                            //         style: TextStyle(
                            //           fontSize: 12,
                            //           color: Colors.white,
                            //           fontWeight: FontWeight.w600,
                            //         ),
                            //       ),
                            //     ),
                            //   ),

                            // Always show Action text button
                            if (widget.showActionButton && !shouldHideAcceptButton(lead))
                              // if (!shouldHideAcceptButton(lead))
                              GestureDetector(
                                onTap: () => widget.onActionTap(lead),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  margin: const EdgeInsets.only(left: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.green,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    widget.actionBtnText,
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
                      DataCell(
                        Text(
                          StringUtils.capitalizeFirstLetter(status),
                          style: TextStyle(
                            fontSize: 14,
                            color: getStatusTextColor(status),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      DataCell(
                        Text(
                          DateFormatterUtils.formatUtcToReadable(
                            lead.updatedAt ?? "-",
                          ),
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
