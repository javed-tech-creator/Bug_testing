import 'package:dss_crm/ui_helper/app_text_styles.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';

enum ButtonType { solid, outlined }

class CustomButton extends StatelessWidget {
  final String text;
  final Color color;
  final Color textColor;
  final double borderRadius;
  final double height;
  final double width;
  final VoidCallback? onPressed;
  final TextStyle? textStyle;
  final IconData? iconData;
  final double? iconSize;
  final Color? iconColor;
  final ButtonType type;
  final Color? borderColor;
  final Color? disabledColor;
  final bool isLoading; // NEW

  const CustomButton({
    Key? key,
    this.text = '',
    this.color = const Color(0xFF000000),
    this.textColor = Colors.white,
    this.borderRadius = 12.0,
    this.height = 15.0,
    this.width = double.infinity,
    required this.onPressed,
    this.textStyle,
    this.iconData,
    this.iconSize,
    this.iconColor,
    this.type = ButtonType.solid,
    this.borderColor,
    this.disabledColor,
    this.isLoading = false, // NEW
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final double btnHeight = ResponsiveHelper.containerHeight(context, height);
    final double btnWidth = width == double.infinity
        ? double.infinity
        : ResponsiveHelper.containerWidth(context, width);

    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(borderRadius),
      side: type == ButtonType.outlined
          ? BorderSide(color: borderColor ?? color, width: 1)
          : BorderSide.none,
    );

    final ButtonStyle style = ButtonStyle(
      backgroundColor: WidgetStateProperty.resolveWith<Color>(
            (states) {
          if (states.contains(WidgetState.disabled)) {
            return disabledColor ?? color;
          }
          return type == ButtonType.solid ? color : Colors.transparent;
        },
      ),
      foregroundColor: WidgetStateProperty.resolveWith<Color>(
            (states) {
          if (states.contains(WidgetState.disabled)) {
            return textColor.withAlpha(60);
          }
          return textColor;
        },
      ),
      elevation: WidgetStateProperty.all<double>(type == ButtonType.solid ? 2 : 0),
      shape: WidgetStateProperty.all<RoundedRectangleBorder>(shape),
      minimumSize: WidgetStateProperty.all<Size>(Size(btnWidth, btnHeight)),
      padding: WidgetStateProperty.all<EdgeInsets>(
        EdgeInsets.symmetric(
          horizontal: ResponsiveHelper.spacing(context, 16),
          vertical: ResponsiveHelper.spacing(context, 8),
        ),
      ),
    );

    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: style,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (isLoading)
            Padding(
              padding: const EdgeInsets.only(right: 10),
              child: SizedBox(
                height: 18,
                width: 18,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(textColor),
                ),
              ),
            ),

          if (!isLoading && iconData != null)
            Icon(
              iconData,
              size: ResponsiveHelper.iconSize(context, iconSize ?? 18),
              color: type == ButtonType.outlined
                  ? (iconColor ?? borderColor ?? color)
                  : textColor,
            ),

          if (text.isNotEmpty) ...[
            if (!isLoading && iconData != null) const SizedBox(width: 8),
            Text(
              text,
              style: textStyle ??
                  AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(fontSize: 14),
                  ).copyWith(
                    color: textColor,
                    fontWeight: FontWeight.w600,
                  ),
            ),
          ],
        ],
      ),
    );
  }
}
