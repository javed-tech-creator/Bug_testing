import 'package:dss_crm/tech_module/tech_manager/controller/tech_manager_api_provider.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/date_formate_util.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../model/asset_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_assets_list_model.dart'
    hide AssetFilter;

import 'assign_bottom_sheet_widget.dart';

class FilterSheet extends StatefulWidget {
  final AssetFilter? currentFilter;
  final Function(AssetFilter?) onFilterChanged;

  const FilterSheet({
    Key? key,
    this.currentFilter,
    required this.onFilterChanged,
  }) : super(key: key);

  @override
  State<FilterSheet> createState() => _FilterSheetState();
}

class _FilterSheetState extends State<FilterSheet> {
  late AssetFilter _tempFilter;

  // Predefined dropdown options
  final List<String> assetTypes = [
    'Laptop',
    'Server',
    'LED Display Controller',
    'Printer',
    'Camera',
    'Router',
    'Other'
  ];

  final List<String> locations = [
    'Head Office-Mumbai',
    'Manufacturing Hub',
    'Client Site',
  ];

  final List<String> statusOptions = [
    'In Use',
    'Repair',
    'Spare',
    'Scrap'
  ];

  // You can add more predefined lists based on your API data
  final List<String> brands = [
    'Dell',
    'HP',
    'Lenovo',
    'Canon',
    'Cisco',
    'Apple',
    'Samsung',
    'Other'
  ];

  final List<String> departments = [
    'IT',
    'HR',
    'Finance',
    'Admin',
    'Operations',
    'Marketing',
    'Sales'
  ];

  @override
  void initState() {
    super.initState();
    _tempFilter = widget.currentFilter ?? AssetFilter();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle bar
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.filter_list,
                    color: Colors.blue,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                const Text(
                  'Filter Assets',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.grey[100],
                  ),
                ),
              ],
            ),
          ),

          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  _buildDropdownFilter(
                    'Type',
                    _tempFilter.type,
                    assetTypes, // Using predefined list
                    Icons.category_outlined,
                        (value) => setState(() => _tempFilter = _tempFilter.copyWith(type: value)),
                  ),
                  const SizedBox(height: 20),
                  _buildDropdownFilter(
                    'Brand',
                    _tempFilter.brand,
                    brands, // Using predefined list
                    Icons.business_outlined,
                        (value) => setState(() => _tempFilter = _tempFilter.copyWith(brand: value)),
                  ),
                  const SizedBox(height: 20),
                  _buildDropdownFilter(
                    'Status',
                    _tempFilter.status,
                    statusOptions, // Using predefined list
                    Icons.info_outline,
                        (value) => setState(() => _tempFilter = _tempFilter.copyWith(status: value)),
                  ),
                  const SizedBox(height: 20),
                  _buildDropdownFilter(
                    'Department',
                    _tempFilter.department,
                    departments, // Using predefined list
                    Icons.people_outline,
                        (value) => setState(() => _tempFilter = _tempFilter.copyWith(department: value)),
                  ),
                  const SizedBox(height: 20),
                  _buildDropdownFilter(
                    'Location',
                    _tempFilter.location,
                    locations, // Using predefined list
                    Icons.location_on_outlined,
                        (value) => setState(() => _tempFilter = _tempFilter.copyWith(location: value)),
                  ),
                  const SizedBox(height: 20),

                  // AMC Contract Filter
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.grey[50],
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey[200]!),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.verified_outlined,
                                size: 20, color: Colors.green[600]),
                            const SizedBox(width: 8),
                            const Text(
                              'AMC Contract',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Wrap(
                          spacing: 12,
                          children: [
                            _buildChoiceChip(
                              'All',
                              _tempFilter.hasAMCContract == null,
                                  () => setState(() => _tempFilter = _tempFilter.copyWith(hasAMCContract: null)),
                              Colors.grey,
                            ),
                            _buildChoiceChip(
                              'Yes',
                              _tempFilter.hasAMCContract == true,
                                  () => setState(() => _tempFilter = _tempFilter.copyWith(hasAMCContract: true)),
                              Colors.green,
                            ),
                            _buildChoiceChip(
                              'No',
                              _tempFilter.hasAMCContract == false,
                                  () => setState(() => _tempFilter = _tempFilter.copyWith(hasAMCContract: false)),
                              Colors.red,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Action Buttons
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      setState(() => _tempFilter = AssetFilter());
                      widget.onFilterChanged(null);
                      Navigator.pop(context);
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Clear All'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      widget.onFilterChanged(_tempFilter.isEmpty ? null : _tempFilter);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Apply Filters'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDropdownFilter(
      String label,
      String? currentValue,
      List<String> options,
      IconData icon,
      Function(String?) onChanged,
      ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 20, color: Colors.grey[600]),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey[300]!),
          ),
          child: DropdownButtonFormField<String>(
            value: currentValue,
            decoration: const InputDecoration(
              fillColor: AppColors.whiteColor,
              filled: true,
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
            hint: Text('Select $label',style: AppTextStyles.heading1(
              context,
              overrideStyle: TextStyle(
                  fontSize: ResponsiveHelper.fontSize(context, 12),
                  // color: isDark ? AppColors.primary : AppColors.whiteColor, // Name text always white
                  // color:  AppColors.textPrimary(context) // Name text always white
              ),
            ),),
            items: [
              DropdownMenuItem<String>(
                value: null,
                child: Text('All',style: AppTextStyles.heading1(
                  context,
                  overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 12),
                      // color: isDark ? AppColors.primary : AppColors.whiteColor, // Name text always white
                      // color:  AppColors.textPrimary(context) // Name text always white
                  ),
                )),
              ),
              ...options.map((option) => DropdownMenuItem<String>(
                value: option,
                child: Text(option),
              )),
            ],
            onChanged: onChanged,
          ),
        ),
      ],
    );
  }

  Widget _buildChoiceChip(String label, bool selected, VoidCallback onTap, Color color) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? color : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? color : Colors.grey[300]!,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? Colors.white : Colors.grey[700],
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}