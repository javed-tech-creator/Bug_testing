import 'package:flutter/material.dart';

class AppConstants {
  // Base URLs
  static const String codeCrafterSiteUrl = 'https://codecrafter.co.in/';

  // Placeholder Image
  static const String defaultAvatarUrl = 'https://randomuser.me/api/portraits/men/5.jpg';

  // Default Messages
  static const String noInternetMessage = 'No Internet Connection';
  static const String unknownError = 'Something went wrong. Please try again later.';

  // SharedPreferences Keys
  static const String userTokenKey = 'USER_TOKEN';
  static const String isLoggedInKey = 'IS_LOGGED_IN';

  // API Endpoints
  static const String addEmployeeEndpoint = '/api/v1/employee/add';

  // Common Strings
  static const String appName = 'HRMS Management';

  // Padding and Spacing
  static const double defaultPadding = 16.0;
  static const double mainHeadingSize_14 = 14.0;
}
