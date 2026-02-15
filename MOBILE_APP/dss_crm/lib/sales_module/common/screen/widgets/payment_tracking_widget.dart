import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dss_crm/sales_module/common/model/sales_emp_client_briefing_form_list_model.dart'
as salesMangementSheetListResult;
import 'package:dss_crm/sales_module/common/controller/sales_module_common_controller.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../model/sales_management_sheet_form_4_pending_payment_model.dart';

class PaymentTrackingFormWidget extends StatelessWidget {
  final salesMangementSheetListResult.Result? initialLeadData;

  const PaymentTrackingFormWidget({
    Key? key,
    required this.initialLeadData,
  }) : super(key: key);

  // Mapping of display name to API key for all payment methods
  final Map<String, String> _paymentMethodMap = const {
    'Cash': 'cash',
    'Bank Transfer': 'bank',
    'Cheque': 'cheque',
    'UPI': 'upi',
    'Online Payment': 'online',
    'Credit Card': 'credit_card',
    'Debit Card': 'debit_card',
    'Other': 'other',
  };

  void handleSubmit(BuildContext context, double remainingAmount) {
    // Controller for the amount text field and remarks
    final amountController = TextEditingController(
      text: remainingAmount.toStringAsFixed(2),
    );
    final remarksController = TextEditingController();

    // Dropdown value state
    String? selectedPaymentMethodLabel;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white, // Set bottom sheet background to white
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              child: Container(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Add Payment',
                          style: AppTextStyles.heading2(context,
                              overrideStyle:
                              const TextStyle(fontWeight: FontWeight.bold)),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    ResponsiveHelper.sizedBoxHeight(context, 10),
                    // Amount Field using CustomTextField
                    CustomTextField(
                      controller: amountController,
                      title: 'Amount',
                      hintText: 'Max: ₹${remainingAmount.toStringAsFixed(2)}',
                      keyboardType: TextInputType.number,
                    ),

                    // Payment Method Dropdown using ResponsiveDropdown
                    ResponsiveDropdown<String>(
                      value: selectedPaymentMethodLabel,
                      itemList: _paymentMethodMap.keys.toList(),
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedPaymentMethodLabel = newValue;
                        });
                      },
                      hint: 'Select Payment Method',
                      label: 'Payment Method *',
                    ),

                    // Remarks Field using CustomTextField
                    CustomTextField(
                      controller: remarksController,
                      title: 'Remarks *',
                      hintText: 'Enter payment remarks',
                      maxLines: 3,
                    ),

                    // Buttons using CustomButton
                    ResponsiveHelper.sizedBoxHeight(context, 10),
                    Row(
                      children: [
                        Expanded(
                          child: CustomButton(
                            color: Colors.grey[600]!, // Use a grey color for 'Cancel' button
                            text: 'Cancel',
                            onPressed: () => Navigator.pop(context),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: CustomButton(
                            color: AppColors.primary, // Use your primary color for 'Add Payment'
                            text: 'Add Payment',
                            onPressed: () async {
                              // Get the API-ready payment method value
                              // final apiMethod = selectedPaymentMethodLabel != null
                              //     ? _paymentMethodMap[selectedPaymentMethodLabel]
                              //     : null;
                              //
                              // // Your submission logic here...
                              // Navigator.pop(context);

                              final provider = Provider.of<SalesModuleCommonApiProvider>(context, listen: false);

                              final String? projectId = this.initialLeadData?.sId;

                              if (projectId == null) {
                                // Handle error: Project ID is not available
                                // Show a snackbar or an alert dialog
                                return;
                              }

                              // Create the API body using the data from the text controllers and dropdown
                              // Map<String, dynamic> body = {
                              //   "projectId": projectId,
                              //   "amount": amountController.text,
                              //   "method": selectedPaymentMethodLabel != null
                              //       ? _paymentMethodMap[selectedPaymentMethodLabel]
                              //       : null,
                              //   "remarks": remarksController.text,
                              // };
                              Map<String, dynamic> body = {
                                "projectId": projectId,
                                "amount": amountController.text,
                                // "discount": _discountController.text,
                                // "totalPaid": amountController.text,
                                "method": selectedPaymentMethodLabel != null
                                    ? _paymentMethodMap[selectedPaymentMethodLabel]
                                    : null,
                                "remarks": remarksController.text,
                              };

                              // Call the new API function for adding a subsequent payment
                              await provider.updateSalesManagementSheetForm3Payment(context, body);

                              // if (provider.addSalesManagementSheetForm3Payment.success ?? false) {
                                // On success, close the bottom sheet
                                Navigator.pop(context);
                                // You might want to refresh the payment tracking data
                                provider.getPendingPaymentForm4Data(context, projectId);
                              // }

                            },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }


  @override
  Widget build(BuildContext context) {
    return Consumer<SalesModuleCommonApiProvider>(
      builder: (context, provider, child) {
        final response = provider.getPendingPaymentForm4ModelResponse;

        if (provider.isLoading) {
          return const Center(child: LoadingIndicatorUtils());
        }

        if (response == null || response.data?.data?.result == null) {
          return _buildNoDataState(context, provider);
        }

        final result = response.data!.data!.result!;
        final totalAmount = (result.totalAmount ?? 0).toDouble();
        final discount = (result.discount ?? 0).toDouble();
        final totalPaid = (result.totalPaid ?? 0).toDouble();
        final remainingAmount = (result.remainingAmount ?? 0).toDouble();
        final paidPayments = result.paidPayments ?? [];

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildPaymentSummaryCards(context, totalAmount, discount, totalPaid, remainingAmount),
            ResponsiveHelper.sizedBoxHeight(context, 24),
            _buildPaymentHistorySection(context, paidPayments),
          ],
        );
      },
    );
  }

  Widget _buildNoDataState(BuildContext context, SalesModuleCommonApiProvider provider) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.payment_outlined,
            size: ResponsiveHelper.iconSize(context, 80),
            color: Colors.grey[400],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 20),
          Text(
            "No Payment Data Available",
            style: AppTextStyles.body2(
              context,
              overrideStyle: TextStyle(color: Colors.grey[600]),
            ),
          ),
          ResponsiveHelper.sizedBoxHeight(context, 16),
          ElevatedButton(
            onPressed: () {
              // final projectId =  '6889d96ca2aec8676b6f3d9b';
              final projectId = initialLeadData?.sId ?? '';
              if (projectId.isNotEmpty) {
                provider.getPendingPaymentForm4Data(context, projectId);
              }
            },
            child: const Text("Retry"),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentSummaryCards(BuildContext context, double totalAmount, double discount, double totalPaid, double remainingAmount) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.orangeColor.withAlpha(10),
            Colors.white,
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Payment Summary",
            style: AppTextStyles.heading2(
              context,
              overrideStyle: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ),
          ResponsiveHelper.sizedBoxHeight(context, 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            childAspectRatio: 1.5,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            children: [
              _buildSummaryCard(context, "Total Amount", "₹${totalAmount.toStringAsFixed(2)}", Icons.account_balance_wallet, Colors.blue),
              _buildSummaryCard(context, "Discount", "₹${discount.toStringAsFixed(2)}", Icons.discount, Colors.green),
              _buildSummaryCard(context, "Total Paid", "₹${totalPaid.toStringAsFixed(2)}", Icons.payment, Colors.orange),
              _buildSummaryCard(context, "Remaining", "₹${remainingAmount.toStringAsFixed(2)}", Icons.pending_actions, remainingAmount > 0 ? Colors.red : Colors.green),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 20),
          _buildPaymentProgressBar(context, totalPaid, totalAmount - discount),
          ResponsiveHelper.sizedBoxHeight(context, 20),
          CustomButton(
            color: AppColors.primary,
            text: 'Add Payment',
            // text: isLoading ? 'Submitting...' : 'Submit',
            onPressed:() => handleSubmit(context, remainingAmount),
          ),
        ],
      ),
    );
  }


  Widget _buildSummaryCard(BuildContext context, String title, String amount, IconData icon, Color color) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.2), width: 1),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 20),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTextStyles.caption(
                  context,
                  overrideStyle: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 11,
                  ),
                ),
              ),
              Text(
                amount,
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentProgressBar(BuildContext context, double paid, double total) {
    double progress = total > 0 ? (paid / total).clamp(0.0, 1.0) : 0.0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "Payment Progress",
              style: AppTextStyles.body2(
                context,
                overrideStyle: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
            Text(
              "${(progress * 100).toStringAsFixed(1)}%",
              style: AppTextStyles.body2(
                context,
                overrideStyle: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: progress == 1.0 ? Colors.green : AppColors.primary,
                ),
              ),
            ),
          ],
        ),
        ResponsiveHelper.sizedBoxHeight(context, 8),
        Container(
          height: 8,
          decoration: BoxDecoration(
            color: Colors.grey[200],
            borderRadius: BorderRadius.circular(4),
          ),
          child: FractionallySizedBox(
            alignment: Alignment.centerLeft,
            widthFactor: progress,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: progress == 1.0
                      ? [Colors.green, Colors.green[700]!]
                      : [AppColors.primary, AppColors.primary.withOpacity(0.7)],
                ),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPaymentHistorySection(BuildContext context, List<PaidPayments> paidPayments) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!, width: 0),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 0,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.history, color: AppColors.primary, size: 20),
              ResponsiveHelper.sizedBoxWidth(context, 8),
              Text(
                "Payment History",
                style: AppTextStyles.body2(
                  context,
                  overrideStyle: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  "${paidPayments.length} payments",
                  style: AppTextStyles.caption(
                    context,
                    overrideStyle: TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 16),
          if (paidPayments.isEmpty)
            _buildEmptyPaymentState(context)
          else
            _buildPaymentHistoryTable(context, paidPayments),
        ],
      ),
    );
  }

  Widget _buildEmptyPaymentState(BuildContext context) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 40),
      child: Column(
        children: [
          Icon(
            Icons.payment_outlined,
            size: ResponsiveHelper.iconSize(context, 60),
            color: Colors.grey[400],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 16),
          Text(
            "No Payments Made Yet",
            style: AppTextStyles.body1(
              context,
              overrideStyle: TextStyle(
                color: Colors.grey[600],
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          ResponsiveHelper.sizedBoxHeight(context, 8),
          Text(
            "Payment history will appear here once payments are made",
            style: AppTextStyles.caption(
              context,
              overrideStyle: TextStyle(color: Colors.grey[500]),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentHistoryTable(BuildContext context, List<PaidPayments> paidPayments) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        columnSpacing: 24,
        headingRowColor: MaterialStateProperty.all(Colors.grey[200]),
        dataRowColor: MaterialStateProperty.resolveWith<Color?>(
              (Set<MaterialState> states) => Colors.white,
        ),
        columns: [
          DataColumn(
            label: Text(
              'Date',
              style: AppTextStyles.body2(
                context,
                overrideStyle: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
          DataColumn(
            label: Text(
              'Amount',
              style: AppTextStyles.body2(
                context,
                overrideStyle: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
          DataColumn(
            label: Text(
              'Method',
              style: AppTextStyles.body2(
                context,
                overrideStyle: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
          DataColumn(
            label: Text(
              'Remarks',
              style: AppTextStyles.body2(
                context,
                overrideStyle: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
        rows: paidPayments.map((payment) {
          String formattedDate = DateFormatterUtils.formatUtcToReadable(payment.paidAt ?? "");
          String amount = "₹${payment.amount ?? ""}";
          String method = _formatPaymentMethod(payment.method ?? "");
          String remarks = payment.remarks ?? '';
          Color methodColor = _getMethodColor(payment.method ?? "");

          return DataRow(
            cells: [
              DataCell(Text(
                formattedDate,
                style: AppTextStyles.body2(context),
              )),
              DataCell(Text(
                amount,
                style: AppTextStyles.body2(
                  context,
                  overrideStyle: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.green[700],
                  ),
                ),
              )),
              DataCell(Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: methodColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: methodColor.withOpacity(0.3)),
                ),
                child: Text(
                  method,
                  style: AppTextStyles.caption(
                    context,
                    overrideStyle: TextStyle(
                      color: methodColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              )),
              DataCell(SizedBox(
                width: 200,
                child: Text(
                  remarks,
                  style: AppTextStyles.body2(
                    context,
                    overrideStyle: const TextStyle(color: Colors.grey),
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              )),
            ],
          );
        }).toList(),
      ),
    );
  }


  Widget _fixedHeaderCell(BuildContext context, String text, double width) {
    return SizedBox(
      width: width,
      child: Text(
        text,
        style: AppTextStyles.body2(
          context,
          overrideStyle: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
      ),
    );
  }

  Widget _fixedCell(BuildContext context, String text, double width,
      {Color? color, bool isBold = false}) {
    return SizedBox(
      width: width,
      child: Text(
        text,
        style: AppTextStyles.body2(
          context,
          overrideStyle: TextStyle(
            color: color ?? Colors.black87,
            fontWeight: isBold ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        overflow: TextOverflow.ellipsis,
      ),
    );
  }


  Widget _tableCell(BuildContext context, String text, {int flex = 1, Color? color, bool isBold = false}) {
    return Expanded(
      flex: flex,
      child: Text(
        text,
        style: AppTextStyles.body2(
          context,
          overrideStyle: TextStyle(
            color: color ?? Colors.black87,
            fontWeight: isBold ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        overflow: TextOverflow.ellipsis,
      ),
    );
  }


  String _formatPaymentMethod(String method) {
    switch (method.toLowerCase()) {
      case 'cash':
        return 'Cash';
      case 'bank':
        return 'Bank Transfer';
      case 'cheque':
        return 'Cheque';
      case 'upi':
        return 'UPI';
      case 'online':
        return 'Online';
      case 'credit_card':
        return 'Credit Card';
      case 'debit_card':
        return 'Debit Card';
      default:
        return method.toUpperCase();
    }
  }

  Color _getMethodColor(String method) {
    switch (method.toLowerCase()) {
      case 'cash':
        return Colors.green;
      case 'bank':
        return Colors.blue;
      case 'cheque':
        return Colors.orange;
      case 'upi':
        return Colors.purple;
      case 'online':
        return Colors.indigo;
      case 'credit_card':
      case 'debit_card':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}