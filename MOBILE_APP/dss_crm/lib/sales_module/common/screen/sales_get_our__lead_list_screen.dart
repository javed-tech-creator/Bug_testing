import 'package:dss_crm/sales_module/common/controller/sales_module_common_controller.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/controller/sales_emp_client_briefing_controller.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/screen/sales_emp_assigned_lead_list_data_table_widget.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/screen/sales_emp_client_briefing_from_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../sales_hod/lead/screen/sales_hod_add_lead_screen.dart';
import '../model/common_add_lead_model.dart';

class SalesGetOurLeadListScreen extends StatefulWidget {
  const SalesGetOurLeadListScreen({super.key});

  @override
  State<SalesGetOurLeadListScreen> createState() =>
      _SalesGetOurLeadListScreenState();
}

class _SalesGetOurLeadListScreenState
    extends State<SalesGetOurLeadListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<SalesModuleCommonApiProvider>(
        context,
        listen: false,
      ).getOurLeadList(context);
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
    final provider = Provider.of<SalesModuleCommonApiProvider>(context);
    final response = provider.getOurLeadListModelResponse;
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
            SalesEmpAssignedLeadListDataTable(
              leads: allLeads,
              showActionIcons: true,
              leadActions: [
                SalesEmpAssignedLeadLeadAction(
                  assetIconPath: 'assets/images/img_edit.png',
                  iconColor: Colors.red,
                  tooltip: 'Edit',
                  onTap: (lead) {
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
              ],
            ),
    );
  }
}
