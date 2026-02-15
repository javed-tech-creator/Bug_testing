import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/controller/sales_emp_client_briefing_controller.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_assigned_lead_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/screen/sales_emp_assigned_lead_list_accepted_data_table_widget.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/screen/sales_emp_assigned_lead_list_data_table_widget.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/screen/sales_emp_client_briefing_from_screen.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/controller/sales_hod_lead_controller.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../../utils/storage_util.dart';

class SalesEmployeeLeadListScreen extends StatefulWidget {
  const SalesEmployeeLeadListScreen({super.key});

  @override
  State<SalesEmployeeLeadListScreen> createState() =>
      _SalesEmployeeLeadListScreenState();
}

class _SalesEmployeeLeadListScreenState
    extends State<SalesEmployeeLeadListScreen> {
  @override
  void initState() {
    super.initState();
    // WidgetsBinding.instance.addPostFrameCallback((_) {
    //   Provider.of<SalesEmpClientBriefingApiProvider>(
    //     context,
    //     listen: false,
    //   ).getAllSalesEmpLeadList(context);
    // });
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

  // Track loading states for each lead
  Map<String, bool> _loadingStates = {};

  // Track accepted states for each lead
  Map<String, bool> _acceptedStates = {};

  // Handle accept lead functionality
  Future<void> _handleAcceptLead(Result lead) async {
    final leadId = lead.sId ?? lead.sId; // Adjust based on your model structure

    if (leadId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Lead ID not found")));
      return;
    }

    // Set loading state for this specific lead
    setState(() {
      _loadingStates[leadId] = true;
    });

    try {
      final salesEmployeeId = await StorageHelper().getLoginUserId();

      final acceptLeadBody = {
        "leadAccept": true, // or "accepted" based on your API requirement
      };

      // Replace this with your actual API call
      final leadProvider = context.read<SalesHODLeadApiProvider>();

      // Assuming you have a method like this in your provider
      // You'll need to add this method to your provider
      final isAccepted = await leadProvider.leadAssignToSalesEmpAccepted(
        context,
        acceptLeadBody,
        leadId,
        false,
      );

      if (isAccepted) await _fetchLeadList();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Lead accepted successfully!"),
          backgroundColor: Colors.green,
        ),
      );
      // On success, update the accepted state
      // setState(() {
      //   _acceptedStates[leadId] = true;
      //   _loadingStates[leadId] = false;
      // });

      // Navigate to client briefing form
      // Navigator.push(
      //   context,
      //   MaterialPageRoute(
      //     builder: (_) => SalesEmpClientBriefingFormScreen(leadData: lead),
      //   ),
      // );
    } catch (error) {
      // Handle error
      setState(() {
        _loadingStates[leadId] = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Failed to accept lead: $error"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _handleActionButtonTap(dynamic lead) {
    // Handle any other action button functionality if needed
    print("Other action button tapped for lead: ${lead.sId}");
  }

  Future<bool> shouldHideAcceptButton(Result lead) async {
    final currentEmpId = await StorageHelper().getLoginUserId();

    final emp1 = lead.saleEmployeeId;
    final emp2 = lead.saleEmployeeId2;
    final acceptList = lead.employeeleadsAccept;

    // Hide if this employee already accepted the lead
    if ((emp1 == currentEmpId || emp2 == currentEmpId) &&
        acceptList != null &&
        acceptList.any((e) => e.status == true)) {
      return true;
    }

    return false;
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<SalesEmpClientBriefingApiProvider>(context);
    final response = provider.getListLeadModelResponse;
    final allLeads = response?.data?.data?.result ?? [];

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
          :  SalesEmpAssignedLeadListAcceptedDataTable(
        leads: allLeads,
        showActionButton: false,
        onActionTap: (lead) async {
          // 🔽 Trigger API call here

          _handleAcceptLead(lead);
          // try {
          //   final success = await acceptLeadApiCall(lead.id); // your API function
          //   if (success) {
          //     ScaffoldMessenger.of(context).showSnackBar(
          //       SnackBar(content: Text('Lead accepted successfully')),
          //     );
          //     // Optionally refresh list
          //   } else {
          //     ScaffoldMessenger.of(context).showSnackBar(
          //       SnackBar(content: Text('Failed to accept lead')),
          //     );
          //   }
          // } catch (e) {
          //   ScaffoldMessenger.of(context).showSnackBar(
          //     SnackBar(content: Text('Error: $e')),
          //   );
          // }
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
              print("✅✅✅✅✅Sales Employee Accept Lead button clicked");
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                      SalesEmpClientBriefingFormScreen(leadData: lead),
                ),
              );
            },
          ),
        ],
      )



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
