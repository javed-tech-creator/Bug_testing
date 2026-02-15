import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../../ui_helper/app_colors.dart';
import '../../../../../utils/custom_text_field_utils.dart';
import '../../../../../utils/responsive_dropdown_utils.dart';

class SalesReportWidgets {

  /// Build dropdown for lead selection
  static Widget buildLeadDropdown({
    required String label,
    required String? selectedValue,
    required int max,
    required Function(String?) onChanged,
  }) {
    return ResponsiveDropdown<String>(
      label: label,
      hint: 'Select count',
      value: selectedValue,
      itemList: List.generate(max, (index) => '${index + 1}'),
      onChanged: onChanged,
    );
  }

  /// Build basic dynamic fields for Morning shift (without status selection)
  static Widget buildBasicDynamicFields({
    required List<TextEditingController> nameControllers,
    required List<TextEditingController> amountControllers,
    required String label,
  }) {
    return Container(
      color: AppColors.txtGreyColor.withAlpha(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(nameControllers.length, (index) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    title: "$label Lead ${index + 1}",
                    hintText: "Client Name",
                    controller: nameControllers[index],
                    prefixIcon: Icons.person_outline,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: CustomTextField(
                    title: "Amount",
                    hintText: "Enter Amount",
                    controller: amountControllers[index],
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    prefixIcon: Icons.currency_rupee,
                  ),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }

  /// Build dynamic fields for Evening shift (with status selection)
  static Widget buildEveningDynamicFields({
    required List<TextEditingController> nameControllers,
    required List<TextEditingController> amountControllers,
    required List<String?> statusList,
    required String label,
    required Function(int index, String? status) onStatusChanged,
  }) {
    return Container(
      color: AppColors.txtGreyColor.withAlpha(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(nameControllers.length, (index) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: CustomTextField(
                        title: "$label Lead ${index + 1}",
                        hintText: "Client Name",
                        controller: nameControllers[index],
                        prefixIcon: Icons.person_outline,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: CustomTextField(
                        title: "Amount",
                        hintText: "Enter Amount",
                        controller: amountControllers[index],
                        keyboardType: TextInputType.number,
                        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                        prefixIcon: Icons.currency_rupee,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Container(
                  color: AppColors.lightBlueColor,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatusSelectionChip(
                          label: 'Hot',
                          selectedValue: statusList[index],
                          value: 'Hot',
                          onChanged: (newValue) => onStatusChanged(index, newValue),
                        ),
                        _buildStatusSelectionChip(
                          label: 'Cold',
                          selectedValue: statusList[index],
                          value: 'Cold',
                          onChanged: (newValue) => onStatusChanged(index, newValue),
                        ),
                        _buildStatusSelectionChip(
                          label: 'Warm',
                          selectedValue: statusList[index],
                          value: 'Warm',
                          onChanged: (newValue) => onStatusChanged(index, newValue),
                        ),
                        _buildStatusSelectionChip(
                          label: 'Win',
                          selectedValue: statusList[index],
                          value: 'Win',
                          onChanged: (newValue) => onStatusChanged(index, newValue),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }

  /// Build status selection chip for Evening shift
  static Widget _buildStatusSelectionChip({
    required String label,
    required String? selectedValue,
    required String value,
    required ValueChanged<String?> onChanged,
  }) {
    final bool isSelected = selectedValue == value;

    return GestureDetector(
      onTap: () {
        if (!isSelected) {
          onChanged(value);
        }
      },
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 20.0,
            height: 20.0,
            decoration: BoxDecoration(
              color: isSelected ? AppColors.orangeColor : Colors.transparent,
              border: Border.all(
                color: isSelected ? AppColors.orangeColor : AppColors.txtGreyColor,
                width: 2.0,
              ),
              borderRadius: BorderRadius.circular(4.0),
            ),
            child: isSelected
                ? const Icon(
              Icons.check,
              size: 16.0,
              color: Colors.white,
            )
                : null,
          ),
          const SizedBox(width: 8.0),
          Text(
            label,
            style: TextStyle(
              color: AppColors.txtGreyColor,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  /// Build summary section (if needed in future)
  static Widget buildSummarySection({
    required String? selectedClosingLeads,
    required String? coldLeads,
    required String? hotLeads,
    required String? warmLeads,
    required String? winLeads,
    required String? lossLeads,
  }) {
    int parseLeads(String? value) => int.tryParse(value ?? '0') ?? 0;
    int closingLeadLimit = int.tryParse(selectedClosingLeads ?? '0') ?? 0;
    int totalAllocatedLeads = parseLeads(coldLeads) +
        parseLeads(hotLeads) +
        parseLeads(warmLeads) +
        parseLeads(winLeads) +
        parseLeads(lossLeads);

    final summaryItems = [
      {
        'label': 'Total Leads',
        'value': totalAllocatedLeads.toString(),
        'textColor': const Color(0xFF2D3748),
        'bgColor': const Color(0xFFF7FAFC),
        'borderColor': const Color(0xFFE2E8F0),
        'iconColor': const Color(0xFF4A5568),
        'icon': Icons.assessment_outlined,
      },
      {
        'label': 'Cold',
        'value': coldLeads ?? '0',
        'textColor': Colors.white,
        'bgColor': const Color(0xFF3182CE),
        'borderColor': const Color(0xFF2C5282),
        'iconColor': Colors.white,
        'icon': Icons.ac_unit_outlined,
      },
      {
        'label': 'Hot',
        'value': hotLeads ?? '0',
        'textColor': Colors.white,
        'bgColor': const Color(0xFFE53E3E),
        'borderColor': const Color(0xFFC53030),
        'iconColor': Colors.white,
        'icon': Icons.local_fire_department_outlined,
      },
      {
        'label': 'Warm',
        'value': warmLeads ?? '0',
        'textColor': Colors.white,
        'bgColor': const Color(0xFFDD6B20),
        'borderColor': const Color(0xFFC05621),
        'iconColor': Colors.white,
        'icon': Icons.wb_sunny_outlined,
      },
      {
        'label': 'Win',
        'value': winLeads ?? '0',
        'textColor': Colors.white,
        'bgColor': const Color(0xFF38A169),
        'borderColor': const Color(0xFF2F855A),
        'iconColor': Colors.white,
        'icon': Icons.emoji_events_outlined,
      },
      {
        'label': 'Loss',
        'value': lossLeads ?? '0',
        'textColor': Colors.white,
        'bgColor': const Color(0xFFE53E3E),
        'borderColor': const Color(0xFFC53030),
        'iconColor': Colors.white,
        'icon': Icons.trending_down_outlined,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.analytics_outlined, color: AppColors.primary, size: 24),
            const SizedBox(width: 8),
            const Text(
              'Summary',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Color(0xFF2D3748),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Center(
          child: Wrap(
            spacing: 16,
            runSpacing: 16,
            children: summaryItems.map((item) {
              return Container(
                width: 160,
                decoration: BoxDecoration(
                  color: item['bgColor'] as Color,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: item['borderColor'] as Color,
                    width: 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: (item['bgColor'] as Color).withOpacity(0.3),
                      spreadRadius: 0,
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      spreadRadius: 0,
                      blurRadius: 12,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(20),
                    onTap: () {
                      // Optional: Add tap functionality
                    },
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: (item['textColor'] as Color).withOpacity(
                                  0.1),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              item['icon'] as IconData,
                              color: item['iconColor'] as Color,
                              size: 24,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            item['label'] as String,
                            style: TextStyle(
                              color: (item['textColor'] as Color).withOpacity(
                                  0.85),
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                              letterSpacing: 0.5,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            item['value'] as String,
                            style: TextStyle(
                              color: item['textColor'] as Color,
                              fontWeight: FontWeight.bold,
                              fontSize: 28,
                              height: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 20),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFF7FAFC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE2E8F0), width: 1),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.pie_chart_outline,
                  color: AppColors.primary,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Lead Allocation Status',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                        color: Color(0xFF2D3748),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Allocated: $totalAllocatedLeads / ${selectedClosingLeads ??
                          '-'}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 13,
                        color: Color(0xFF4A5568),
                      ),
                    ),
                  ],
                ),
              ),
              if (selectedClosingLeads != null && closingLeadLimit > 0)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: totalAllocatedLeads == closingLeadLimit
                        ? const Color(0xFF38A169)
                        : totalAllocatedLeads > closingLeadLimit
                        ? const Color(0xFFE53E3E)
                        : const Color(0xFFDD6B20),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '${((totalAllocatedLeads / closingLeadLimit) * 100)
                        .toInt()}%',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }}