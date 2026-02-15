import 'package:html/parser.dart' show parse;
import 'package:html/dom.dart' as dom;

class StringUtils {

  /// Capitalizes the first letter of every word in a string.
  static String capitalizeEachWord(String text) {
    if (text.trim().isEmpty) return "";
    return text
        .split(' ')
        .map((word) => word.isNotEmpty
        ? '${word[0].toUpperCase()}${word.substring(1).toLowerCase()}'
        : '')
        .join(' ');
  }

  /// Capitalizes only the first letter of the string.
  static String capitalizeFirstLetter(String text) =>
      text.isNotEmpty ? '${text[0].toUpperCase()}${text.substring(1)}' : "";

  /// Converts a string to lowercase.
  static String toLowerCase(String text) => text.toLowerCase();

  /// Converts a string to uppercase.
  static String toUpperCase(String text) => text.toUpperCase();

  /// Trims leading and trailing spaces from a string.
  static String trimSpaces(String text) => text.trim();
  /// Checks if a string is null or empty (after trimming).
  static bool isNullOrEmpty(String? text) => text?.trim().isEmpty ?? true;

  static String extractPlainText(String? html) {
    // 1. Guard – null / empty
    if (html == null || html.trim().isEmpty) {
      return 'No description available.';
    }

    // 2. Parse → body text (fast & safe)
    final plain = parse(html).body?.text ?? '';

    // 3. Collapse whitespace & trim
    final cleaned = plain
        .replaceAll(RegExp(r'\s+'), ' ')   // multiple spaces → one
        .trim();

    // 4. Fallback if still empty
    return cleaned.isEmpty ? 'No description available.' : cleaned;
  }

}

// Helper extension for fallback
extension on String {
  T let<T>(T Function(String) block) => block(this);
}