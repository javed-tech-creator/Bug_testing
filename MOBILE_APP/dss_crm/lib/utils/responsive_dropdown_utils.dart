import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import '../ui_helper/app_text_styles.dart';
import 'responsive_helper_utils.dart';

class ResponsiveDropdown<T> extends StatelessWidget {
  final T? value;
  final List<T> itemList;
  final void Function(T?)? onChanged;
  final String hint;
  final String label;
  final bool isReadOnly;
  final String? Function(T?)? validator;
  final AutovalidateMode? autovalidateMode;
  /// Custom display builder - useful when T is ID but you want to show name
  final String Function(T)? itemDisplayBuilder;

  const ResponsiveDropdown({
    Key? key,
    required this.value,
    required this.itemList,
    required this.onChanged,
    required this.hint,
    required this.label,
    this.isReadOnly = false,
    this.validator,
    this.autovalidateMode,
    this.itemDisplayBuilder,
  }) : super(key: key);

  String _getDisplayText(T? item) {
    if (item == null) return hint;
    if (itemDisplayBuilder != null) {
      return itemDisplayBuilder!(item);
    }
    return item.toString();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Padding(
      padding: ResponsiveHelper.paddingSymmetric(context, vertical: 4, horizontal: 0),
      child: FormField<T>(
        initialValue: value,
        validator: validator ?? (value) => value == null ? 'This field is required' : null,
        autovalidateMode: autovalidateMode ?? AutovalidateMode.disabled,
        builder: (FormFieldState<T> field) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Enhanced Label
              Padding(
                padding: ResponsiveHelper.paddingSymmetric(context, horizontal: 4, vertical: 4),
                child: Row(
                  children: [
                    Text(
                      label,
                      style: AppTextStyles.heading2(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 10),
                        ),
                      ),
                    ),
                    if (validator != null)
                      Text(
                        ' *',
                        style: AppTextStyles.heading2(
                          context,
                          overrideStyle: TextStyle(
                            color: Colors.red.shade600,
                            fontSize: ResponsiveHelper.fontSize(context, 10),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              // SizedBox(height: ResponsiveHelper.containerHeight(context, 4)),
              DropdownButtonHideUnderline(
                child: DropdownButton2<T>(
                  isExpanded: true,
                  value: field.value,
                  onChanged: isReadOnly
                      ? null
                      : (T? newValue) {
                    field.didChange(newValue);
                    onChanged?.call(newValue);
                  },
                  customButton: AnimatedContainer(
                    duration: Duration(milliseconds: 250),
                    padding: ResponsiveHelper.paddingOnly(
                      context,
                      left: 14,
                      right: 10,
                      top: 10,
                      bottom: 10,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        width: 1,
                        color: field.hasError
                            ? Colors.red.shade400
                            : isReadOnly
                            ? (isDark ? Colors.grey.shade700 : Colors.grey.shade300)
                            : (isDark ? Colors.grey.shade600 : Colors.black.withAlpha(100)),
                      ),
                      gradient: isReadOnly
                          ? null
                          : LinearGradient(
                        colors: isDark
                            ? [Colors.grey[850]!, Colors.grey[900]!]
                            : [Colors.white, Colors.grey.shade50],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      color: isReadOnly
                          ? (isDark ? Colors.grey[800] : AppColors.endingGreyColor.withAlpha(80))
                          : (isDark ? Colors.grey[850] : Colors.white),
                      // boxShadow: field.hasError
                      //     ? [
                      //   BoxShadow(
                      //     color: Colors.red.withOpacity(0.2),
                      //     blurRadius: 8,
                      //     offset: Offset(0, 3),
                      //   ),
                      // ]
                      //     : [
                      //   BoxShadow(
                      //     color: isDark
                      //         ? Colors.black.withOpacity(0.4)
                      //         : Colors.black.withOpacity(0.08),
                      //     blurRadius: 8,
                      //     offset: Offset(0, 2),
                      //   ),
                      // ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            _getDisplayText(field.value),
                            // style: TextStyle(
                            //   color: field.value != null
                            //       ? (isDark ? Colors.white : Colors.black87)
                            //       : (isDark ? Colors.grey.shade400 : Colors.grey.shade500),
                            //   fontSize: ResponsiveHelper.fontSize(context, 13),
                            //   fontWeight: field.value != null ? FontWeight.w500 : FontWeight.w400,
                            //   letterSpacing: 0.2,
                            // ),

                            style: AppTextStyles.body1(
                              context,
                              overrideStyle: TextStyle(
                                letterSpacing: 0.2,
                                color: field.value != null
                                    ? (isDark ? Colors.white : Colors.black87)
                                    : (isDark ? Colors.grey.shade400 : Colors.grey.shade500),
                                fontSize: ResponsiveHelper.fontSize(context, 12),
                              ),
                            ),

                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(
                          Icons.keyboard_arrow_down_rounded,
                          color: isReadOnly
                              ? (isDark ? Colors.grey.shade600 : Colors.grey)
                              : (isDark ? Colors.grey.shade300 : AppColors.primary),
                          size: ResponsiveHelper.fontSize(context, 16),
                        ),
                      ],
                    ),
                  ),

                  // Enhanced Dropdown Items
                  items: itemList.map((item) {
                    final isSelected = item == field.value;
                    return DropdownMenuItem<T>(
                      value: item,
                      enabled: !isReadOnly,
                      child: Container(
                        padding: ResponsiveHelper.paddingSymmetric(
                          context,
                          horizontal: 10,
                          vertical: 10,
                        ),
                        decoration: isSelected
                            ? BoxDecoration(
                          gradient: LinearGradient(
                            colors: isDark
                                ? [
                              AppColors.primary.withAlpha(25),
                              AppColors.primary.withAlpha(18),
                            ]
                                : [
                              AppColors.primary.withAlpha(15),
                              AppColors.primary.withAlpha(1),
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: ResponsiveHelper.borderRadiusAll(context, 4),
                          border: Border.all(
                            color: AppColors.primary.withOpacity(0.4),
                            width: 0.5,
                          ),
                        )
                            : null,
                        child: Row(
                          children: [
                            if (isSelected)
                              Padding(
                                padding: const EdgeInsets.only(right: 10),
                                child: Icon(
                                  Icons.check_circle_rounded,
                                  color: AppColors.primary,
                                  size: ResponsiveHelper.fontSize(context, 14),
                                ),
                              ),
                            Expanded(
                              child: Text(
                                _getDisplayText(item),
                                // style: TextStyle(
                                //   fontSize: ResponsiveHelper.fontSize(context, 13),
                                //   fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                                //   color: isSelected
                                //       ? AppColors.primary
                                //       : (isDark ? Colors.grey : Colors.black87),
                                //   letterSpacing: 0.2,
                                //   height: 1.3,
                                // ),

                                style: AppTextStyles.body1(
                                  context,
                                  overrideStyle: TextStyle(
                                    letterSpacing: 0.2,
                                    color: isSelected
                                        ? AppColors.primary
                                        : (isDark ? Colors.grey : Colors.black87),
                                    fontSize: ResponsiveHelper.fontSize(context, 10),
                                  ),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),

                  // Enhanced Dropdown Menu Style
                  dropdownStyleData: DropdownStyleData(
                    maxHeight: ResponsiveHelper.containerHeight(context, 300),
                    width: MediaQuery.of(context).size.width * 0.9,
                    padding: ResponsiveHelper.paddingAll(context, 0),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: isDark
                              ? Colors.black.withAlpha(7)
                              : Colors.black.withAlpha(15),
                          blurRadius: 20,
                          spreadRadius: 2,
                          offset: Offset(0, 4),
                        ),
                      ],
                      color: isDark ? theme.cardColor : Colors.white,
                      border: Border.all(
                        color: isDark
                            ? Colors.grey.shade700
                            : Colors.grey.shade200,
                        width: 1,
                      ),
                    ),
                    offset: const Offset(0, -5),
                  ),
                  menuItemStyleData: MenuItemStyleData(
                    height: ResponsiveHelper.containerHeight(context, 40),
                    padding: ResponsiveHelper.paddingSymmetric(
                      context,
                      horizontal: 8,
                      vertical: 0,
                    ),
                  ),
                ),
              ),

              // Enhanced Error Message
              if (field.hasError)
                Padding(
                  padding: ResponsiveHelper.paddingOnly(
                    context,
                    left: 10,
                    top: 8,
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.error_outline_rounded,
                        color: Colors.red.shade600,
                        size: ResponsiveHelper.fontSize(context, 12),
                      ),
                      SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          field.errorText!,
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.red,
                              fontSize: ResponsiveHelper.fontSize(context, 10),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}