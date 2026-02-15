import 'package:flutter/material.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
class InitialPaymentFormWidget extends StatelessWidget {
  final TextEditingController totalAmountController;
  final TextEditingController discountController;
  final TextEditingController totalPaidController;
  final TextEditingController paymentRemarksController;
  final String? selectedPaymentMethodLabel;
  final Map<String, String> paymentMethodMap;
  final ValueChanged<String?> onPaymentMethodChanged;
  final bool? isReadOnly; // ✅ Add this new parameter

  const InitialPaymentFormWidget({
    Key? key,
    required this.totalAmountController,
    required this.discountController,
    required this.totalPaidController,
    required this.paymentRemarksController,
    required this.selectedPaymentMethodLabel,
    required this.paymentMethodMap,
    required this.onPaymentMethodChanged,
    this.isReadOnly = false, //    Give it a default value
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CustomTextField(
          controller: totalAmountController,
          title: "Total Amount",
          hintText: "Enter total amount",
          keyboardType: TextInputType.number,
          readOnly: isReadOnly!,
        ),
        CustomTextField(
          controller: discountController,
          title: "Discount",
          hintText: "Enter discount amount",
          keyboardType: TextInputType.number,
          readOnly: isReadOnly!,
        ),
        CustomTextField(
          controller: totalPaidController,
          title: "Total Paid",
          hintText: "Enter total paid amount",
          keyboardType: TextInputType.number,
          readOnly: isReadOnly!,
        ),
        ResponsiveDropdown<String>(
          value: selectedPaymentMethodLabel,
          itemList: paymentMethodMap.keys.toList(),
          onChanged: isReadOnly! ? null : onPaymentMethodChanged,
          hint: "Select Payment Method",
          label: "Method",
        ),
        CustomTextField(
          controller: paymentRemarksController,
          title: "Payment Remarks",
          hintText: "Enter remarks for payment",
          maxLines: 3,
          readOnly: isReadOnly!,
        ),
      ],
    );
  }
}