import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../utils/custom_buttons_utils.dart';
import '../../utils/custom_text_field_utils.dart';
import '../../utils/form_validations_utils.dart';
import '../../utils/responsive_dropdown_utils.dart';
import '../../utils/responsive_helper_utils.dart';

class OtpLoginForm extends StatefulWidget {
  final String? selectedDepartment;
  final List<String> departments;
  final ValueChanged<String?> onDepartmentChanged;

  const OtpLoginForm({
    super.key,
    required this.selectedDepartment,
    required this.departments,
    required this.onDepartmentChanged,
  });

  @override
  State<OtpLoginForm> createState() => _OtpLoginFormState();
}

class _OtpLoginFormState extends State<OtpLoginForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController otpController = TextEditingController();

  bool showOtpField = false;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding:  ResponsiveHelper.paddingSymmetric(context, vertical: 8, horizontal: 16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ResponsiveDropdown<String>(
              label: 'Department',
              hint: 'Select department',
              value: widget.selectedDepartment,
              itemList: widget.departments,
              onChanged: widget.onDepartmentChanged,
            ),
            const SizedBox(height: 5),
            CustomTextField(
              title: "Phone Number",
              hintText: "Enter your phone number",
              controller: phoneController,
              keyboardType: TextInputType.phone,
              prefixIcon: Icons.phone,
              validator: FormValidatorUtils.validatePhone,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(10),
              ],
            ),
            if (showOtpField) ...[
              const SizedBox(height: 5),
              CustomTextField(
                title: "OTP",
                hintText: "Enter OTP",
                controller: otpController,
                prefixIcon: Icons.lock_clock,
                validator: (value) => FormValidatorUtils.validateRequired(
                  value,
                  fieldName: "OTP",
                ),
              ),
            ],
            const SizedBox(height: 10),
            CustomButton(
              text: showOtpField ? "Verify OTP" : "Send OTP",
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  if (!showOtpField) {
                    setState(() => showOtpField = true);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("OTP sent to phone")),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("OTP Verified")),
                    );
                  }
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
