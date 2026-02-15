import 'package:flutter/material.dart';

class AppTextStyles {

  static const double _baseWidth = 375.0;  // iPhone X width
  static const String _fontFamily = 'Poppins';

  static double screenWidth(BuildContext context) => MediaQuery.of(context).size.width;
  static double screenHeight(BuildContext context) => MediaQuery.of(context).size.height;

  /// Responsive font size
  static double fontSize(BuildContext context, double size) {
    final width = screenWidth(context);
    final scaleFactor = (width / _baseWidth).clamp(0.85, 1.25);
    final textScale = MediaQuery.of(context).textScaleFactor;
    return size * scaleFactor * textScale;
  }

  /// Font presets
  static double heading1Size(BuildContext context) => fontSize(context, 20);
  static double heading2Size(BuildContext context) => fontSize(context, 18);
  static double body1Size(BuildContext context) => fontSize(context, 16);
  static double body2Size(BuildContext context) => fontSize(context, 14);
  static double captionSize(BuildContext context) => fontSize(context, 12);

  /// Predefined text styles
  /// Predefined text styles
  static TextStyle heading1(BuildContext context, {TextStyle? overrideStyle}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return TextStyle(
      fontSize: heading1Size(context),
      fontWeight: FontWeight.bold,
      fontFamily: _fontFamily,
      color: isDark ? Colors.white : Colors.black,
    ).merge(overrideStyle);
  }

  static TextStyle heading2(BuildContext context, {TextStyle? overrideStyle}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return TextStyle(
      fontSize: heading2Size(context),
      fontWeight: FontWeight.w600,
      fontFamily: _fontFamily,
      color: isDark ? Colors.white : Colors.black87,
    ).merge(overrideStyle);
  }

  static TextStyle body1(BuildContext context, {TextStyle? overrideStyle}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return TextStyle(
      fontSize: body1Size(context),
      fontWeight: FontWeight.normal,
      fontFamily: _fontFamily,
      color: isDark ? Colors.white70 : Colors.black87,
    ).merge(overrideStyle);
  }

  static TextStyle body2(BuildContext context, {TextStyle? overrideStyle}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return TextStyle(
      fontSize: body2Size(context),
      fontWeight: FontWeight.normal,
      fontFamily: _fontFamily,
      color: isDark ? Colors.white60 : Colors.black54,
    ).merge(overrideStyle);
  }

  static TextStyle caption(BuildContext context, {TextStyle? overrideStyle}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return TextStyle(
      fontSize: captionSize(context),
      fontWeight: FontWeight.w400,
      fontFamily: _fontFamily,
      color: isDark ? Colors.grey[400] : Colors.grey[800],
    ).merge(overrideStyle);
  }
  /// Custom text style
  static TextStyle custom(
      BuildContext context, {
        required double size,
        FontWeight fontWeight = FontWeight.normal,
        Color? color,
        TextStyle? overrideStyle,
      }) {
    return TextStyle(
      fontSize: fontSize(context, size),
      fontWeight: fontWeight,
      fontFamily: _fontFamily,
      color: color,
    ).merge(overrideStyle);
  }
}
