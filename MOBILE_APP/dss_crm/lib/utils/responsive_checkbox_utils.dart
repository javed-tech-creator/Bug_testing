// responsive_checkbox.dart
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';

import '../ui_helper/app_text_styles.dart';

class ResponsiveCheckbox extends StatelessWidget {
  final bool value;
  final String label;
  final ValueChanged<bool?> onChanged;

  const ResponsiveCheckbox({
    Key? key,
    required this.value,
    required this.label,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: ResponsiveHelper.paddingSymmetric(context, vertical: 4, horizontal: 16),
      child: Row(
        children: [
          Checkbox(
            value: value,
            onChanged: onChanged,
            activeColor: theme.primaryColor,
          ),
          Expanded(
            child: Text(
              label,
              style: AppTextStyles.body1(context),
            ),
          ),
        ],
      ),
    );
  }
}
