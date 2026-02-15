import 'package:dss_crm/sales_module/common/controller/sales_module_common_controller.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/controller/sales_emp_client_briefing_controller.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/screen/sales_emp_client_briefing_from_screen.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../../sales_employee/sales_client_breifing/screen/sales_form_list_data_table_widget.dart';


class SalesTLHODLeadListScreen extends StatefulWidget {
  const SalesTLHODLeadListScreen({super.key});

  @override
  State<SalesTLHODLeadListScreen> createState() => _SalesTLHODLeadListScreenState();
}

class _SalesTLHODLeadListScreenState extends State<SalesTLHODLeadListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<SalesModuleCommonApiProvider>(context, listen: false).getAllSalesInFormLeadList(context);
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
    final response = provider.getListLeadModelResponse;
    final allLeads = response?.data?.data?.result ?? [];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "All Leads",
        backgroundColor: AppColors.primary,
      ),
      body:

      Consumer<SalesModuleCommonApiProvider>(
        builder: (context, provider, _) {
          final response = provider.getListLeadModelResponse;
          final allLeads = response?.data?.data?.result ?? [];

          if (response == null || provider.isLoading) {
            return const LoadingIndicatorUtils();
          } else if (response.data == null || allLeads.isEmpty) {
            return const Center(child: Text("No Leads Found"));
          }

          return SalesFormListDataTable(
            leads: allLeads,
            showActionButtons: false,
            leadActions: [
              SalesFormLeadAction(
                icon: Icons.refresh,
                tooltip: 'Accept',
                iconColor: Colors.green,
                onTap: (lead) {
                  // Navigation logic here
                },
              ),
            ],
          );
        },
      ),


    );
  }
}
