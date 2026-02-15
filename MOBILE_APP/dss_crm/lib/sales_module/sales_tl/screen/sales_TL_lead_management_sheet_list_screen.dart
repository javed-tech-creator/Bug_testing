import 'package:dss_crm/sales_module/sales_tl/screen/sales_TL_assign_lead_screen.dart';
import 'package:dss_crm/sales_module/sales_tl/screen/sales_TL_lead_management_form_screen.dart';
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

class SalesTLLeadManagementSheetListScreen extends StatefulWidget {
  const SalesTLLeadManagementSheetListScreen({super.key});

  @override
  State<SalesTLLeadManagementSheetListScreen> createState() =>
      _SalesTLLeadManagementSheetListScreenState();
}

class _SalesTLLeadManagementSheetListScreenState
    extends State<SalesTLLeadManagementSheetListScreen> {
  @override
  void initState() {
    super.initState();
    Provider.of<SalesHODLeadApiProvider>(
      context,
      listen: false,
    ).getAllLeads(context);
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
        activityName: "Lead Management Sheet",
        backgroundColor: AppColors.primary,
      ),
      body: response == null || provider.isLoading
          ? const LoadingIndicatorUtils()
          : response.data == null || response.data!.data!.result!.isEmpty
          ? const Center(child: Text("No Leads Found"))
          :




      LeadDataTable(
              leads: allLeads,
              actionBtnText: "Edit",
              showActionIcons: true,
              // ✅ Toggle this to show/hide
              showActionTextButton: true,
              onActionTap: (lead) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) =>
                        SalesTLLeadManagementFormScreen(leadData: lead),
                  ),
                );
              },
            ),



    );
  }
}
