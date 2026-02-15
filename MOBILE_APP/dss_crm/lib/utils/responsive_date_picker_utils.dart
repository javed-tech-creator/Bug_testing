// responsive_date_picker.dart
import 'package:flutter/material.dart';

import 'custom_text_field_utils.dart';

class ResponsiveDatePicker extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String hint;
  final void Function(DateTime)? onDateSelected;

  const ResponsiveDatePicker({
    Key? key,
    required this.controller,
    required this.label,
    required this.hint,
    this.onDateSelected,
  }) : super(key: key);

  Future<void> _pickDate(BuildContext context) async {
    DateTime now = DateTime.now();
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: DateTime(now.year - 50),
      lastDate: DateTime(now.year + 10),
      builder: (context, child) {
        final theme = Theme.of(context);
        return Theme(data: theme, child: child!);
      },
    );
    if (picked != null) {
      controller.text = "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
      if (onDateSelected != null) {
        onDateSelected!(picked);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _pickDate(context),
      child: AbsorbPointer(
        child: CustomTextField(
          title: label,
          controller: controller,
          label: label,
          hintText: hint,
          keyboardType: TextInputType.datetime,
        ),
      ),
    );
  }
}
