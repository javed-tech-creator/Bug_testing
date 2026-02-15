import 'package:dss_crm/utils/image_loader_util.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/utils/string_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../../sales_tl/screen/sales_TL_assign_lead_screen.dart';
import '../../../utils/common_data_table_widget.dart';
import '../controller/sales_hod_lead_controller.dart';

class SalesHODLeadListScreen extends StatefulWidget {
  const SalesHODLeadListScreen({super.key});

  @override
  State<SalesHODLeadListScreen> createState() => _SalesHODLeadListScreenState();
}

class _SalesHODLeadListScreenState extends State<SalesHODLeadListScreen> {
  @override
  void initState() {
    super.initState();
    // Provider.of<SalesHODLeadApiProvider>(context, listen: false).getAllLeads(context);
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
    return Scaffold(
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
      //   leads: allLeads,
      //   showActionButton: true,
      //   onActionTap: (lead) {
      //     Navigator.push(
      //       context,
      //       MaterialPageRoute(
      //         builder: (_) => SalesTLAssignedLeadScreen(leadData: lead),
      //       ),
      //     );
      //   },
      // ),

      LeadDataTable(
        leads: allLeads,
        showActionIcons: true, // ✅ Toggle this to show/hide
        showActionTextButton: true,
        onActionTap: (lead) {
          // Navigator.push(
          //   context,
          //   MaterialPageRoute(
          //     builder: (_) => SalesTLAssignedLeadScreen(leadData: lead),
          //   ),
          // );
        },
      )

    );
  }
}
