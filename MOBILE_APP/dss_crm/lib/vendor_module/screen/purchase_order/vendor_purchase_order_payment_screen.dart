import 'package:dss_crm/vendor_module/model/purchsae_order/vendor_purchase_order_list_model.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import 'package:dss_crm/utils/custom_text_field_utils.dart';
import 'package:dss_crm/utils/custom_buttons_utils.dart';
import 'package:dss_crm/utils/default_common_app_bar.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';

import '../../controller/vendor_api_provider.dart';

class VendorPurchaseOrderPaymentUpdateScreen extends StatefulWidget {
  final Data productData; // existing product data

  const VendorPurchaseOrderPaymentUpdateScreen({Key? key, required this.productData})
      : super(key: key);

  @override
  State<VendorPurchaseOrderPaymentUpdateScreen> createState() =>
      _VendorPurchaseOrderPaymentUpdateScreenState();
}

class _VendorPurchaseOrderPaymentUpdateScreenState
    extends State<VendorPurchaseOrderPaymentUpdateScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  String? _selectedPaymentType = "Cash";
  DateTime _selectedDate = DateTime.now();
  bool _sendSms = false;

  @override
  void initState() {
    super.initState();

    final pendingAmount = (widget.productData.grandTotal ?? 0) - (widget.productData.amountPaid ?? 0);

    _amountController.text = pendingAmount.toString() ?? "";
  }

  void _pickDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _handleUpdatePayment() async {
    if (!_formKey.currentState!.validate()) return;

    // final updateBody = {
    //   "orderId": widget.orderId,
    //   "paymentAmount": double.tryParse(_amountController.text.trim()) ?? 0.0,
    //   "paymentDate": DateFormat("dd-MM-yyyy").format(_selectedDate),
    //   "paymentType": _selectedPaymentType,
    //   "notes": _notesController.text.trim(),
    //   "sendSms": _sendSms,
    // };
    final updateBody = {
      "paymentAmount": double.tryParse(_amountController.text.trim()) ?? 0.0,
      "paymentMode": _selectedPaymentType, // 🔥 changed key
      "paymentDate": DateFormat("yyyy-MM-dd").format(_selectedDate), // 🔥 correct format
      "notes": _notesController.text.trim(),
      "sendSMS": _sendSms, // 🔥 correct key
      "customer": widget.productData.customerName ?? "", // 🔥 from productData
      "phone": widget.productData.customerPhone ?? "", // 🔥 from productData
    };

    debugPrint("Payment Update Body => $updateBody");
    final invoiceId = widget.productData.invoiceId.toString();

    await Provider.of<VendorModuleApiProvider>(context, listen: false)
        .updateVendorInvoicePayment(context, updateBody,invoiceId);

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {

    final pendingAmount = (widget.productData.grandTotal ?? 0) - (widget.productData.amountPaid ?? 0);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "Update Payment",
        backgroundColor: AppColors.primary,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Payment Info Header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Customer: ${widget.productData.customerName ?? ""}",
                          style: const TextStyle(
                              fontWeight: FontWeight.w600, fontSize: 16)),
                      Text("Customer: ${widget.productData.customerPhone ?? ""}",
                          style: const TextStyle(
                              fontWeight: FontWeight.w600, fontSize: 16)),
                      Text("Balance: ₹ ${pendingAmount.toStringAsFixed(0)}",
                          style: const TextStyle(
                              color: Colors.red, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Amount
                CustomTextField(
                  title: "Amount to be Recorded",
                  hintText: "Enter Amount",
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Please enter amount";
                    }
                    return null;
                  },
                ),
                // Text(
                //   "Total Amount ₹ ${widget.productData.amountPaid ?? ""}   "
                //       "Amount Pending ₹ ${widget.productData. ?? "".toStringAsFixed(0)}",
                //   style: const TextStyle(color: Colors.grey),
                // ),
                const SizedBox(height: 16),

                // Payment Date
                GestureDetector(
                  onTap: _pickDate,
                  child: AbsorbPointer(
                    child: CustomTextField(
                      title: "Payment Date",
                      controller: TextEditingController(
                        text: DateFormat("dd-MM-yyyy").format(_selectedDate),
                      ),
                      prefixIcon: Icons.calendar_today, hintText: 'Payment Date',
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Payment Type
                const Text("Payment Type",
                    style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: ["UPI", "Cash", "Card", "Net Banking", "Cheque"]
                      .map((type) => ChoiceChip(
                    label: Text(type),
                    selected: _selectedPaymentType == type,
                    onSelected: (_) {
                      setState(() {
                        _selectedPaymentType = type;
                      });
                    },
                  ))
                      .toList(),
                ),
                const SizedBox(height: 16),

                // Notes
                CustomTextField(
                  title: "Notes",
                  hintText: "Enter payment notes",
                  controller: _notesController,
                  maxLines: 3,
                ),
                const SizedBox(height: 16),

                // SMS toggle
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("SMS to Customer",
                        style: TextStyle(fontWeight: FontWeight.w600)),
                    Switch(
                      value: _sendSms,
                      onChanged: (value) {
                        setState(() {
                          _sendSms = value;
                        });
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Update Button
                Consumer<VendorModuleApiProvider>(
                  builder: (context, provider, child) {
                    return CustomButton(
                      text: provider.isLoading
                          ? "Updating..."
                          : "Update Payment",
                      color: AppColors.primary,
                      onPressed:
                      provider.isLoading ? null : _handleUpdatePayment,
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
