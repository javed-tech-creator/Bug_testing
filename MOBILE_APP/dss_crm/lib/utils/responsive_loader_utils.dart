import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';

class LoadingIndicatorUtils extends StatelessWidget {
  final double size;
  final Color? color;
  final double strokeWidth;

  const LoadingIndicatorUtils({
    Key? key,
    this.size = 25.0,
    this.color,
    this.strokeWidth = 2.5,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final responsiveSize = ResponsiveHelper.iconSize(context, size);
    final theme = Theme.of(context);
    final effectiveColor = color ?? theme.colorScheme.secondary;

    return Center(
      child: SizedBox(
        height: responsiveSize,
        width: responsiveSize,
        child: CircularProgressIndicator(
          strokeWidth: strokeWidth,
          valueColor: AlwaysStoppedAnimation<Color>(effectiveColor),
          backgroundColor: theme.brightness == Brightness.dark
              ? Colors.grey[800]
              : Colors.grey[300],
        ),
      ),
    );
  }

}
