import 'package:dss_crm/sales_module/common/model/common_add_lead_model.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/screen/sales_hod_add_lead_screen.dart';
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
import '../../sales_hod/lead/model/shared_common_lead_result_list_model.dart';
import '../../utils/common_data_table_widget.dart';

class SalesTLPendingLeadListScreen extends StatefulWidget {
  const SalesTLPendingLeadListScreen({super.key});

  @override
  State<SalesTLPendingLeadListScreen> createState() =>
      _SalesTLPendingLeadListScreenState();
}

class _SalesTLPendingLeadListScreenState
    extends State<SalesTLPendingLeadListScreen> {
  @override
  void initState() {
    super.initState();
    Provider.of<SalesHODLeadApiProvider>(
      context,
      listen: false,
    ).getAllPendingLeadList(context);
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
    final response = provider.getPendingLeadListModelResponse;
    final allLeads = response?.data?.data?.result ?? [];
    final pendingLeads = allLeads
        .where((lead) => lead.status?.toLowerCase() == 'pending')
        .toList();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "Pending Leads",
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
      //               builder: (_) => SalesTLAssignedLeadScreen(leadData:lead ,),
      //             ),
      //           );
      //         },
      //       ),
      LeadDataTable(
        leads: allLeads,
        showActionIcons: true,
        showActionTextButton: false,
        leadActions: [
          LeadAction(
            // icon: Icons.edit,
            assetIconPath: 'assets/images/img_edit.png',
            iconColor: Colors.red,
            tooltip: 'Edit',
            onTap: (lead) {
              // Handle edit logic
              // Create an instance of your common model
              CommonAddLeadModelLeadModel commonLead = CommonAddLeadModelLeadModel(
                sId: lead.sId,
                leadSource: lead.leadSource,
                leadType: lead.leadType,
                concernPersonName: lead.concernPersonName,
                phone: lead.phone,
                altPhone: lead.altPhone, // or result.phone if altPhone is not available
                email: lead.email,
                city: lead.city,
                pincode: lead.pincode,
                address: lead.address,
                requirement: lead.requirement,
                status: lead.leadStatus,
                createdAt: lead.createdAt,
                updatedAt: lead.updatedAt,
              );

              Navigator.push(context, MaterialPageRoute(builder: (_)=> AddSalesHODLeadScreen(leadData: commonLead,)));

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
                  builder: (_) => SalesTLAssignedLeadScreen(leadData: lead),
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
            },
          ),
        ],
      )
    );
  }
}
