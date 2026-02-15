import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DateFormatterUtils {
  /// Parses ISO 8601 and ensures null-safety
  /// Output: `DateTime` object from a valid ISO string, or `null` if invalid
  /// Parses ISO 8601 and ensures IST conversion
  /// Always converts UTC → IST (+5:30)
  static DateTime? _parseDate(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return null;
    try {
      // Parse as UTC, then shift to IST
      // Parse as UTC first
      return DateTime.parse(dateStr).toLocal();
      final utcDate = DateTime.parse(dateStr).toUtc();
      // Convert to IST (+5:30)
      return utcDate.add(const Duration(hours: 5, minutes: 30));
      // return DateTime.parse(dateStr).toUtc().add(const Duration(hours: 5, minutes: 30));

    } catch (e) {
      return null;
    }
  }

  /// Format: dd-MM-yyyy
  /// Output: e.g., "21-07-2025" or "Invalid Date" if input is invalid
  static String formatToDdMmYyyy(String? dateStr) {
    final date = _parseDate(dateStr);
    return date != null ? DateFormat('dd-MM-yyyy').format(date) : 'Invalid Date';
  }

  /// Format: MM/dd/yyyy
  /// Output: e.g., "07/21/2025" or "Invalid Date" if input is invalid
  static String formatToMmDdYyyy(String? dateStr) {
    final date = _parseDate(dateStr);
    return date != null ? DateFormat('MM/dd/yyyy').format(date) : 'Invalid Date';
  }

  /// Format: 17 Apr 2025
  /// Output: e.g., "21 Jul 2025" or "Invalid Date" if input is invalid
  static String formatToShortMonth(String? dateStr) {
    final date = _parseDate(dateStr);
    return date != null ? DateFormat('dd MMM yyyy').format(date) : 'Invalid Date';
  }

  /// Format: April 17, 2025
  /// Output: e.g., "July 21, 2025" or "Invalid Date" if input is invalid
  static String formatToLongDate(String? dateStr) {
    final date = _parseDate(dateStr);
    return date != null ? DateFormat('MMMM d, yyyy').format(date) : 'Invalid Date';
  }

  /// Format: yyyy-MM-dd
  /// Output: e.g., "2025-07-21" or "Invalid Date" if input is invalid
  static String formatToIso(String? dateStr) {
    final date = _parseDate(dateStr);
    return date != null ? DateFormat('yyyy-MM-dd').format(date) : 'Invalid Date';
  }

  /// Format: dd MMM yyyy
  /// Output: e.g., "21 Jul 2025" or "Invalid Date" if input is invalid
  static String formatToyyyyddMM(String? dateStr) {
    final date = _parseDate(dateStr);
    return date != null ? DateFormat('dd MMM yyyy').format(date) : 'Invalid Date';
  }

  /// Format: dd MMM yyyy, hh:mm a
  /// Output: e.g., "21 Jul 2025, 02:15 PM" or "Invalid Date" if input is invalid
  static String formatUtcToReadable(String? dateStr) {
    final date = _parseDate(dateStr);
    return date != null ? DateFormat('dd MMM yyyy, hh:mm a').format(date) : 'Invalid Date';
  }

  /// Extracts time portion (e.g., "12:24 PM") from a readable datetime string
  /// Output: e.g., "12:24 PM" or "Invalid Format" if format is incorrect
  static String extractTimeFromReadable(String? readableDateTime) {
    if (readableDateTime == null || readableDateTime.isEmpty) return 'N/A';
    final parts = readableDateTime.split(',');
    return parts.length >= 2 ? parts.last.trim() : 'Invalid Format';
  }

  /// Converts "yyyy-MM-dd" to "dd MMM yyyy"
  /// Output: e.g., "2025-07-21" → "21 Jul 2025" or "Invalid Date" if format is incorrect
  static String formatCustomDdMmYyyy(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return 'N/A';
    try {
      final date = DateFormat('yyyy-MM-dd').parseStrict(dateStr);
      return DateFormat('dd MMM yyyy').format(date);
    } catch (e) {
      return 'Invalid Date';
    }
  }
}
