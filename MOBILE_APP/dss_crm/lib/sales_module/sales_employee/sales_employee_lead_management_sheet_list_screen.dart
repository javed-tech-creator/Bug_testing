import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/controller/sales_emp_client_briefing_controller.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/screen/sales_emp_assigned_lead_list_accepted_data_table_widget.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_employee_lead_management_form_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/default_common_app_bar.dart';

class SalesEmpLeadManagementSheetListScreen extends StatefulWidget {
  const SalesEmpLeadManagementSheetListScreen({super.key});

  @override
  State<SalesEmpLeadManagementSheetListScreen> createState() =>
      _SalesEmpLeadManagementSheetListScreenState();
}

class _SalesEmpLeadManagementSheetListScreenState
    extends State<SalesEmpLeadManagementSheetListScreen> {
  @override
  void initState() {
    super.initState();
    // Provider.of<SalesHODLeadApiProvider>(
    //   context,
    //   listen: false,
    // ).getAllLeads(context);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchLeadList();
    });
  }

  /// Fetch all sales employee leads
  Future<void> _fetchLeadList() async {
    await Provider.of<SalesEmpClientBriefingApiProvider>(
      context,
      listen: false,
    ).getAllSalesEmpLeadList(context);
  }

  Color getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'active':
        return Colors.green.shade100;
      case 'discharged':
        return Colors.red.shade100;
      default:
        return Colors.grey.shade200;
    }
  }

  Color getStatusTextColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'pending':
        return Colors.orangeAccent.shade700;
      case 'inprogress':
        return Colors.blueAccent.shade700;
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
    final provider = Provider.of<SalesEmpClientBriefingApiProvider>(context);
    final response = provider.getListLeadModelResponse;
    // final allLeads = response?.data?.data?.result ?? [];
    final allLeads = (response?.data?.data?.result ?? [])
        .where((lead) => lead.employeeleadsAccept != null && lead.employeeleadsAccept!.isNotEmpty)
        .toList();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "All Leads",
        backgroundColor: AppColors.primary,
      ),
      body: response == null || provider.isLoading
          ? const LoadingIndicatorUtils()
          : response.data == null || response.data!.data!.result!.isEmpty
          ? const Center(child: Text("No Leads Found"))
          : SalesEmpAssignedLeadListAcceptedDataTable(
              leads: allLeads,
              onActionTap: (lead) async {

              },
              leadActions: [
                // SalesEmpAssignedLeadAcceptedAction(
                //   icon: Icons.visibility,
                //   tooltip: "View Lead",
                //   onTap: (lead) {
                //     // your logic
                //   },
                // ),
                SalesEmpAssignedLeadAcceptedAction(
                  icon: Icons.edit,
                  tooltip: "Edit Lead",
                  assetIconPath: "assets/images/edit_icon.png",
                  iconColor: Colors.red,
                  onTap: (lead) {
                    // your logic
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) =>
                            SalesEmployeeLeadManagementFormScreen(leadData: lead),
                      ),
                    );
                  },
                ),
              ],
            ),

      // SalesEmpAssignedLeadListAcceptedDataTable(
      //         leads: allLeads,
      //         showActionButtons: true,
      //         showActionIcons: true,
      //         showActionTextButton: true,
      //         actionBtnText: "Accept",
      //         showAcceptButton: true,
      //         onActionTap: (lead) async {
      //           final shouldHide = await shouldHideAcceptButton(lead);
      //           if (!shouldHide) {
      //             await _handleAcceptLead(lead);
      //           } else {
      //             ScaffoldMessenger.of(context).showSnackBar(
      //               const SnackBar(
      //                 content: Text("You already accepted this lead."),
      //               ),
      //             );
      //           }
      //         },
      //         leadActions: [
      //           SalesEmpAssignedLeadAcceptedAction(
      //             icon: Icons.refresh,
      //             tooltip: 'Accept',
      //             iconColor: Colors.green,
      //             onTap: (lead) {
      //               // Handle reassign logic
      //               print("✅✅✅✅✅Sales Employee Accept Lead button clicked");
      //               Navigator.push(
      //                 context,
      //                 MaterialPageRoute(
      //                   builder: (_) =>
      //                       SalesEmpClientBriefingFormScreen(leadData: lead),
      //                 ),
      //               );
      //             },
      //           ),
      //         ],
      //       ),
    );
  }
}
