// responsive_card.dart
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';

class ResponsiveCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final Color? color;
  final double? elevation;
  final BorderRadius? borderRadius;

  const ResponsiveCard({
    Key? key,
    required this.child,
    this.padding,
    this.color,
    this.elevation,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      color: color ?? theme.cardColor,
      elevation: elevation ?? 3,
      shape: RoundedRectangleBorder(borderRadius: borderRadius ?? BorderRadius.circular(16)),
      child: Padding(
        padding: padding ?? ResponsiveHelper.paddingAll(context, 16),
        child: child,
      ),
    );
  }
}
