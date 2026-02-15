import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/controller/sales_tl_reporting_controller.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/default_common_app_bar.dart';
import '../model/sales_tl_morning_evening_reporting_list_model.dart';

class SalesReportingViewScreen extends StatefulWidget {
  const SalesReportingViewScreen({Key? key}) : super(key: key);

  @override
  State<SalesReportingViewScreen> createState() =>
      _SalesReportingViewScreenState();
}

class _SalesReportingViewScreenState extends State<SalesReportingViewScreen> {
  @override
  void initState() {
    super.initState();
    Provider.of<SalesTLReportingApiProvider>(
      context,
      listen: false,
    ).getAllSalesTlReportingList(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightYellowColor,
      appBar: DefaultCommonAppBar(
        activityName: "Sales Tl Reporting Details",
        backgroundColor: AppColors.primary,
      ),
      body: Consumer<SalesTLReportingApiProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) return const LoadingIndicatorUtils();

          final reports =
              provider.salesTlReportingListModelResponse?.data?.data;
          if (reports == null || reports.result!.isEmpty) {
            return const Center(child: Text("No Reports Found"));
          }

          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 10.0),
            itemCount: reports.result!.length,
            itemBuilder: (context, index) {
              final report = reports.result![index];

              return Card(
                color: Colors.white,
                // margin: const EdgeInsets.only(bottom: 10),
                margin: ResponsiveHelper.paddingOnly(context, bottom: 8.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
                child: Padding(
                  padding: ResponsiveHelper.paddingAll(context, 14.0),
                  // padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(report),
                      ResponsiveHelper.sizedBoxHeight(context, 10),
                      _buildLeadSection(
                        "Hot Leads",
                        report.hot,
                        report.hotCount,
                      ),
                      _buildLeadSection(
                        "Warm Leads",
                        report.warm,
                        report.warmCount,
                      ),
                      _buildLeadSection(
                        "Cold Leads",
                        report.cold,
                        report.coldCount,
                      ),
                      _buildLeadSection(
                        "Lost Leads",
                        report.loss,
                        report.lossCount,
                      ),
                      _buildLeadSection(
                        "Won Leads",
                        report.win,
                        report.winCount,
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildHeader(Result report) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Shift: ${report.shift}",
          style: AppTextStyles.heading1(
            context,overrideStyle: TextStyle(fontSize: 14)
          ),
        ),
        ResponsiveHelper.sizedBoxHeight(context, 2),
        Text(
          "Total Leads: ${report.totalLead}  |  Total Amount: ₹${report.totalAmount}",
          style: AppTextStyles.body1(
              context,overrideStyle: TextStyle(fontSize: 12)
          ),
        ),
        ResponsiveHelper.sizedBoxHeight(context, 2),
        Text(
          "Created At: ${DateFormatterUtils.formatUtcToReadable(report.createdAt)}",
          // "Created At: ${report.createdAt?.substring(0, 10)}",
          style: AppTextStyles.body1(
              context,overrideStyle: TextStyle(fontSize: 12)
          ),
        ),
      ],
    );
  }

  Widget _buildLeadSection(String title, List<dynamic>? leads, int? count) {
    if (leads == null || leads.isEmpty) return const SizedBox();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ResponsiveHelper.sizedBoxHeight(context, 5),
        Text(
          "$title ($count)",
          style: AppTextStyles.heading1(
              context,overrideStyle: TextStyle(fontSize: 14)
          ),
        ),
        ResponsiveHelper.sizedBoxHeight(context, 5),
        ...leads.map(
          (lead) => Padding(
            // padding: const EdgeInsets.symmetric(vertical: 4.0),
            padding: ResponsiveHelper.paddingSymmetric(context,vertical: 4.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(child: Text(lead.companyName ?? "--")),
                Text(
                  "₹${lead.amount ?? 0}",
                  style: AppTextStyles.body1(
                      context,overrideStyle: TextStyle(fontSize: 14)
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
