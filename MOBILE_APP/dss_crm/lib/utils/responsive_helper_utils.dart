import 'package:flutter/material.dart';

class ResponsiveHelper {
  static const double _baseWidth = 375.0;  // iPhone X width
  static const double _baseHeight = 812.0; // iPhone X height
  static const String _fontFamily = 'Poppins';

  static double screenWidth(BuildContext context) => MediaQuery.of(context).size.width;
  static double screenHeight(BuildContext context) => MediaQuery.of(context).size.height;

  static bool isMobile(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return screenWidth < 600; // 600 se kam ko mobile manenge
  }

  /// Tablet breakpoint
  static bool isTablet(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return screenWidth >= 600 && screenWidth < 1024;
    // 600 se 1024 ke beech ko tablet manenge
  }

  /// (Optional) Desktop breakpoint
  static bool isDesktop(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return screenWidth >= 1024; // 1024 ya usse zyada desktop
  }

  /// Responsive font size
  static double fontSize(BuildContext context, double size) {
    final width = screenWidth(context);
    final scaleFactor = (width / _baseWidth).clamp(0.85, 1.25);
    final textScale = MediaQuery.of(context).textScaleFactor;
    return size * scaleFactor * textScale;
  }

  /// Responsive icon size
  static double iconSize(BuildContext context, double size) {
    final width = screenWidth(context);
    return (size * (width / _baseWidth)).clamp(size * 0.85, size * 1.25);
  }

  /// Responsive spacing (padding/margin)
  static double spacing(BuildContext context, double value) {
    final width = screenWidth(context);
    return (value * (width / _baseWidth)).clamp(value * 0.85, value * 1.25);
  }

  /// Responsive width
  static double containerWidth(BuildContext context, double designWidth) {
    return screenWidth(context) * (designWidth / _baseWidth);
  }

  /// Responsive height
  static double containerHeight(BuildContext context, double designHeight) {
    return screenHeight(context) * (designHeight / _baseHeight);
  }
  ///  Responsive Padding Utilities

  static EdgeInsets paddingAll(BuildContext context, double value) {
    final spacingValue = spacing(context, value);
    return EdgeInsets.all(spacingValue);
  }

  static EdgeInsets paddingSymmetric(
      BuildContext context, {
        double horizontal = 0,
        double vertical = 0,
      }) {
    return EdgeInsets.symmetric(
      horizontal: spacing(context, horizontal),
      vertical: spacing(context, vertical),
    );
  }

  static EdgeInsets paddingOnly(
      BuildContext context, {
        double left = 0,
        double top = 0,
        double right = 0,
        double bottom = 0,
      }) {
    return EdgeInsets.only(
      left: spacing(context, left),
      top: spacing(context, top),
      right: spacing(context, right),
      bottom: spacing(context, bottom),
    );
  }

  ///  RESPONSIVE BORDER RADIUS
  static BorderRadius borderRadiusAll(BuildContext context, double radius) {
    return BorderRadius.circular(spacing(context, radius));
  }
  /// ✅ Responsive Circle Radius
  static double circleRadius(BuildContext context, double radius) {
    return spacing(context, radius);
  }


  static BorderRadius borderRadiusOnly(
      BuildContext context, {
        double topLeft = 0,
        double topRight = 0,
        double bottomLeft = 0,
        double bottomRight = 0,
      }) {
    return BorderRadius.only(
      topLeft: Radius.circular(spacing(context, topLeft)),
      topRight: Radius.circular(spacing(context, topRight)),
      bottomLeft: Radius.circular(spacing(context, bottomLeft)),
      bottomRight: Radius.circular(spacing(context, bottomRight)),
    );
  }

  /// ✅ Responsive SizedBox helpers
  static SizedBox sizedBoxHeight(BuildContext context, double height) {
    return SizedBox(height: containerHeight(context, height));
  }

  static SizedBox sizedBoxWidth(BuildContext context, double width) {
    return SizedBox(width: containerWidth(context, width));
  }


  /// ✅ RESPONSIVE BUTTON DIMENSIONS
  static Size buttonSize(BuildContext context,
      {double width = 300, double height = 50}) {
    return Size(
      containerWidth(context, width),
      containerHeight(context, height),
    );
  }

  /// ✅ ELEVATION SCALING
  static double elevation(BuildContext context, double value) {
    return spacing(context, value); // Optional: can scale elevation
  }
}
