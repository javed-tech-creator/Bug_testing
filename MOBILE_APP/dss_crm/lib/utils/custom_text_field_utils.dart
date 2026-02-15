import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/services.dart';
import '../ui_helper/app_text_styles.dart' show AppTextStyles;

// ===== VALIDATION TYPE ENUM =====
enum ValidationType {
  none,
  required,
  email,
  phone,
  name,
  password,
  number,
  alphanumeric,
  noSpecialChars,
  noLeadingSpace,
  minLength,
  maxLength,
  minWords,
  custom,

  // ===== OPTIONAL VALIDATIONS (New) =====
  optionalEmail,        // Optional but valid email if filled
  optionalPhone,        // Optional but valid 10-digit if filled
  optionalGST,          // Optional but valid GST format if filled
  optionalPAN,          // Optional but valid PAN format if filled
  optionalAadhar,       // Optional but valid 12-digit if filled
  optionalIFSC,         // Optional but valid IFSC format if filled
  optionalNumber,       // Optional but numbers only if filled
  optionalAlphanumeric, // Optional but alphanumeric if filled
  optionalMinLength,    // Optional but minimum length if filled
}

class CustomTextField extends StatefulWidget {
  final String hintText;
  final String? label;
  final String? title;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final bool obscureText;
  final IconData? prefixIcon;
  final Widget? suffixIcon;
  final VoidCallback? onClear;
  final ValidationType validationType;
  final ValueChanged<String>? onChanged;
  final int? minLength;
  final int? maxLength;
  final String? Function(String?)? validator;
  final FocusNode? focusNode;
  final bool readOnly;
  final List<TextInputFormatter>? inputFormatters;
  final VoidCallback? onTap;
  final bool? isMultiLine;
  final int? maxLines;
  final int? minLines;
  final bool isPassword;

  const CustomTextField({
    Key? key,
    required this.hintText,
    this.label,
    this.title,
    required this.controller,
    this.keyboardType = TextInputType.text,
    this.obscureText = false,
    this.prefixIcon,
    this.suffixIcon,
    this.onClear,
    this.validationType = ValidationType.none,
    this.onChanged,
    this.minLength,
    this.maxLength,
    this.validator,
    this.focusNode,
    this.readOnly = false,
    this.inputFormatters,
    this.onTap,
    this.isMultiLine = false,
    this.maxLines,
    this.minLines,
    this.isPassword = false,
  }) : super(key: key);

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  late FocusNode _focusNode;
  bool _obscureText = false;

  @override
  void initState() {
    super.initState();
    _focusNode = widget.focusNode ?? FocusNode();
    _focusNode.addListener(_onFocusChange);
    _obscureText = widget.isPassword;
  }

  void _onFocusChange() => setState(() {});
  void _toggleVisibility() => setState(() => _obscureText = !_obscureText);

  @override
  void dispose() {
    if (widget.focusNode == null) _focusNode.dispose();
    super.dispose();
  }

  // ===== BUILT-IN VALIDATOR LOGIC =====
  String? _builtInValidator(String? value) {
    final specialCharRegex = RegExp(r'[!@#\$%\^&\*\(\)_\+\-=\[\]\{\};:"\\|,.<>\/?0-9]');

    // ===== OPTIONAL VALIDATIONS (Allow empty but validate if filled) =====
    if (_isOptionalValidation(widget.validationType)) {
      // If empty, allow it
      if (value == null || value.trim().isEmpty) {
        return null;
      }

      final trimmed = value.trim();

      switch (widget.validationType) {
        case ValidationType.optionalEmail:
          final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
          return !emailRegex.hasMatch(trimmed) ? 'Enter a valid email' : null;

        case ValidationType.optionalPhone:
          final clean = trimmed.replaceAll(RegExp(r'\D'), '');
          return clean.length != 10 ? 'Enter a valid 10-digit phone number' : null;

        case ValidationType.optionalGST:
        // GST format: 22AAAAA0000A1Z5 (15 characters)
          final gstRegex = RegExp(r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
          return !gstRegex.hasMatch(trimmed.toUpperCase())
              ? 'Enter valid GST number (15 characters)'
              : null;

        case ValidationType.optionalPAN:
        // PAN format: ABCDE1234F (10 characters)
          final panRegex = RegExp(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$');
          return !panRegex.hasMatch(trimmed.toUpperCase())
              ? 'Enter valid PAN number (e.g., ABCDE1234F)'
              : null;

        case ValidationType.optionalAadhar:
          final clean = trimmed.replaceAll(RegExp(r'\D'), '');
          return clean.length != 12 ? 'Aadhar must be exactly 12 digits' : null;

        case ValidationType.optionalIFSC:
        // IFSC format: ABCD0123456 (11 characters)
          final ifscRegex = RegExp(r'^[A-Z]{4}0[A-Z0-9]{6}$');
          return !ifscRegex.hasMatch(trimmed.toUpperCase())
              ? 'Enter valid IFSC code (e.g., SBIN0001234)'
              : null;

        case ValidationType.optionalNumber:
          return !RegExp(r'^\d+$').hasMatch(trimmed) ? 'Enter numbers only' : null;

        case ValidationType.optionalAlphanumeric:
          return !RegExp(r'^[a-zA-Z0-9]+$').hasMatch(trimmed)
              ? 'Only letters and numbers allowed'
              : null;

        case ValidationType.optionalMinLength:
          final min = widget.minLength ?? 3;
          return trimmed.length < min ? 'Minimum $min characters required' : null;

        default:
          return null;
      }
    }

    // ===== REQUIRED VALIDATIONS =====
    if (value == null || value.isEmpty) {
      if (widget.validationType != ValidationType.none) {
        return 'This field is required';
      }
      return null;
    }

    final trimmed = value.trim();
    if (trimmed.isEmpty && widget.validationType != ValidationType.none) {
      return 'Cannot be just spaces';
    }

    switch (widget.validationType) {
      case ValidationType.required:
        return trimmed.isEmpty ? 'This field is required' : null;

      case ValidationType.email:
        final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
        return !emailRegex.hasMatch(trimmed) ? 'Enter a valid email' : null;

      case ValidationType.phone:
        final clean = trimmed.replaceAll(RegExp(r'\D'), '');
        return clean.length != 10 ? 'Enter a valid 10-digit phone number' : null;

      case ValidationType.name:
        if (value.startsWith(' ')) {
          return 'Name cannot start with space';
        }
        if (specialCharRegex.hasMatch(value)) {
          return 'Name should contain only letters and spaces';
        }
        if (RegExp(r'\d').hasMatch(value)) {
          return 'Name cannot contain numbers';
        }
        return null;

      case ValidationType.password:
        if (trimmed.length < 6) return 'Password must be at least 6 characters';
        return null;

      case ValidationType.number:
        return !RegExp(r'^\d+$').hasMatch(trimmed) ? 'Enter numbers only' : null;

      case ValidationType.alphanumeric:
        return !RegExp(r'^[a-zA-Z0-9]+$').hasMatch(trimmed)
            ? 'Only letters and numbers allowed'
            : null;

      case ValidationType.noSpecialChars:
        return specialCharRegex.hasMatch(trimmed)
            ? 'Special characters and numbers not allowed'
            : null;

      case ValidationType.noLeadingSpace:
        return value.startsWith(' ') ? 'Cannot start with space' : null;

      case ValidationType.minLength:
        final min = widget.minLength ?? 1;
        return trimmed.length < min ? 'Minimum $min characters required' : null;

      case ValidationType.maxLength:
        final max = widget.maxLength ?? 100;
        return trimmed.length > max ? 'Maximum $max characters allowed' : null;

      case ValidationType.minWords:
        final wordCount = trimmed.split(RegExp(r'\s+')).where((w) => w.isNotEmpty).length;
        final minWords = widget.minLength ?? 2;
        return wordCount < minWords ? 'Enter at least $minWords words' : null;

      case ValidationType.custom:
        return widget.validator?.call(value);

      case ValidationType.none:
      default:
        return null;
    }
  }

  // Helper method to check if validation is optional
  bool _isOptionalValidation(ValidationType type) {
    return type == ValidationType.optionalEmail ||
        type == ValidationType.optionalPhone ||
        type == ValidationType.optionalGST ||
        type == ValidationType.optionalPAN ||
        type == ValidationType.optionalAadhar ||
        type == ValidationType.optionalIFSC ||
        type == ValidationType.optionalNumber ||
        type == ValidationType.optionalAlphanumeric ||
        type == ValidationType.optionalMinLength;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final isFocused = _focusNode.hasFocus;

    Color getBorderColor() {
      if (isFocused) {
        return isDark ? theme.colorScheme.primary : AppColors.primary;
      } else {
        return isDark ? Colors.grey[700]! : Colors.grey;
      }
    }

    Color getIconColor() {
      if (isFocused) {
        return isDark ? theme.colorScheme.primary : AppColors.primary;
      } else {
        return theme.iconTheme.color ?? Colors.grey;
      }
    }

    return Padding(
      padding: ResponsiveHelper.paddingSymmetric(context, vertical: 5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (widget.title != null)
            Padding(
              padding: ResponsiveHelper.paddingSymmetric(context, horizontal: 2, vertical: 2.5),
              child: Text(
                widget.title!,
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 10),
                  ),
                ),
              ),
            ),
          TextFormField(
            controller: widget.controller,
            focusNode: _focusNode,
            keyboardType: widget.keyboardType,
            obscureText: widget.isPassword ? _obscureText : widget.obscureText,
            validator: widget.validator ?? _builtInValidator,
            inputFormatters: widget.inputFormatters,
            readOnly: widget.readOnly,
            maxLength: widget.maxLength,
            maxLines: (widget.isMultiLine ?? false) ? widget.maxLines ?? 5 : widget.maxLines ?? 1,
            minLines: (widget.isMultiLine ?? false) ? widget.minLines ?? 3 : null,
            onTap: widget.onTap,
            onChanged: widget.onChanged,
            style: AppTextStyles.body1(
              context,
              overrideStyle: TextStyle(
                fontSize: ResponsiveHelper.fontSize(context, 12),
              ),
            ),
            decoration: InputDecoration(
              hintText: widget.hintText,
              hintStyle: AppTextStyles.caption(
                context,
                overrideStyle: TextStyle(color: theme.hintColor, fontSize: 12),
              ),
              prefixIcon: widget.prefixIcon != null
                  ? (widget.isMultiLine ?? false)
                  ? Padding(
                padding: ResponsiveHelper.paddingOnly(context, left: 4, right: 4),
                child: Padding(
                  padding: ResponsiveHelper.paddingOnly(context, left: 50.0),
                  child: Icon(widget.prefixIcon, color: getIconColor(), size: ResponsiveHelper.iconSize(context, 18)),
                ),
              )
                  : Padding(
                padding: const EdgeInsets.only(left: 10.0),
                child: Icon(widget.prefixIcon, color: getIconColor(), size: ResponsiveHelper.iconSize(context, 18)),
              )
                  : null,
              prefixIconConstraints: const BoxConstraints(minWidth: 30, maxWidth: 36, minHeight: 0, maxHeight: 36),
              suffixIcon: widget.isPassword
                  ? IconButton(
                icon: Icon(_obscureText ? Icons.visibility_off : Icons.visibility, color: AppColors.txtGreyColor),
                onPressed: _toggleVisibility,
              )
                  : (widget.suffixIcon ??
                  (widget.controller.text.isNotEmpty
                      ? IconButton(
                    icon: Icon(Icons.clear, color: Colors.grey.shade600, size: ResponsiveHelper.iconSize(context, 20)),
                    onPressed: () {
                      widget.controller.clear();
                      widget.onClear?.call();
                      _focusNode.unfocus();
                      setState(() {});
                    },
                  )
                      : null)),
              filled: true,
              fillColor: widget.readOnly
                  ? (isDark ? Colors.grey[800] : AppColors.endingGreyColor.withAlpha(100))
                  : (isDark ? Colors.grey[850] : Colors.white),
              errorStyle: AppTextStyles.body1(
                context,
                overrideStyle: TextStyle(
                  color: Colors.red,
                  fontSize: ResponsiveHelper.fontSize(context, 9),
                ),
              ),
              errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Colors.redAccent, width: 1)),
              focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Colors.redAccent, width: 1)),
              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: getBorderColor(), width: 1)),
              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: getBorderColor(), width: 1)),
              contentPadding: (widget.isMultiLine ?? false)
                  ? const EdgeInsets.symmetric(vertical: 5, horizontal: 8)
                  : const EdgeInsets.all(8),
              counterText: "",
            ),
          ),
        ],
      ),
    );
  }
}