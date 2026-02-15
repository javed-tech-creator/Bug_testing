// utils/form_validator_utils.dart
class FormValidatorUtils {
  /// Checks if the field is empty
  static String? validateRequired(String? value, {String fieldName = 'Field'}) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }
    return null;
  }

  /// Checks if the input is a valid email address
  static String? validateEmail(String? value, {String fieldName = 'Email'}) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }

    const emailRegex = r'^[^@]+@[^@]+\.[^@]+$';
    final isValid = RegExp(emailRegex).hasMatch(value.trim());

    if (!isValid) {
      return 'Please enter a valid $fieldName';
    }
    return null;
  }

  /// Checks if the input is a valid 10-digit phone number
  static String? validatePhone(String? value, {String fieldName = 'Phone number'}) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }

    const phoneRegex = r'^[0-9]{10}$';
    final isValid = RegExp(phoneRegex).hasMatch(value.trim());

    if (!isValid) {
      return '$fieldName must be exactly 10 digits';
    }
    return null;
  }

  /// Custom min-length validator
  static String? validateMinLength(String? value, int minLength, {String fieldName = 'Field'}) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }

    if (value.trim().length < minLength) {
      return '$fieldName must be at least $minLength characters';
    }

    return null;
  }
}
