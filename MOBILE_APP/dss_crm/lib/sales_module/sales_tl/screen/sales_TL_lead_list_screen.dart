import 'package:dss_crm/sales_module/sales_tl/screen/sales_TL_assign_lead_screen.dart';
import 'package:dss_crm/utils/image_loader_util.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/utils/string_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../sales_hod/lead/controller/sales_hod_lead_controller.dart';
import '../../utils/common_data_table_widget.dart';

class SalesTLLeadListScreen extends StatefulWidget {
  const SalesTLLeadListScreen({super.key});

  @override
  State<SalesTLLeadListScreen> createState() => _SalesTLLeadListScreenState();
}

class _SalesTLLeadListScreenState extends State<SalesTLLeadListScreen> {
  @override
  void initState() {
    super.initState();
    // Provider.of<SalesHODLeadApiProvider>(
    //   context,
    //   listen: false,
    // ).getAllLeads(context);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<SalesHODLeadApiProvider>(context, listen: false).getAllLeads(context);
    });
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
    final provider = Provider.of<SalesHODLeadApiProvider>(context);
    final response = provider.getListLeadModelResponse;
    final allLeads = response?.data?.data?.result ?? [];
    final pendingLeads = allLeads
        .where((lead) => lead.status?.toLowerCase() == 'pending')
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
          :
      // LeadDataTable(
      //         leads: allLeads,
      //         onActionTap: (lead) {
      //           Navigator.push(
      //             context,
      //             MaterialPageRoute(
      //               builder: (_) => SalesTLAssignedLeadScreen(leadData: lead),
      //             ),
      //           );
      //         },
      //       ),

        LeadDataTable(
          leads: allLeads,
          showActionIcons: true,
          leadActions: [
            LeadAction(
              // icon: Icons.edit,
              assetIconPath: 'assets/images/img_edit.png',
              iconColor: Colors.red,
              tooltip: 'Edit',
              onTap: (lead) {
                // Handle edit logic
              },
            ),
            LeadAction(
              icon: Icons.assignment_ind,
              tooltip: 'Assign',
              iconColor: AppColors.orangeColor,
              onTap: (lead) {
                // Handle assign logic
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => SalesTLAssignedLeadScreen(leadData: lead,),
                  ),
                );
              },
            ),
            LeadAction(
              icon: Icons.refresh,
              tooltip: 'Reassign',
              iconColor: AppColors.blueColor,
              onTap: (lead) {
                // Handle reassign logic
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => SalesTLAssignedLeadScreen(leadData: lead,isReassign: true,),
                  ),
                );
              },
            ),
          ],
        )

    );
  }
}
