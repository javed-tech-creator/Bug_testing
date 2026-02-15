import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/controller/sales_tl_reporting_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/responsive_dropdown_utils.dart';
import 'evening_shirft_screen.dart';
import 'morning_shirft_screen.dart';

class SalesTLReportScreen extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          iconTheme: const IconThemeData(color: Colors.white),
          title: Text(
            'Sales Report Details',
            style: AppTextStyles.caption(context).copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.whiteColor,
            ),
          ),
          backgroundColor: AppColors.primary,
          bottom: const TabBar(
            indicatorColor: Colors.white,
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white70,
            tabs: [
              Tab(text: 'Morning Shift'),
              Tab(text: 'Evening Shift'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            MorningShiftForm(),
            EveningShiftForm(),
            // SalesReportForm(shift: 'Morning'),
            // SalesReportForm(shift: 'Evening'),
          ],
        ),
      ),
    );
  }
}

class SalesReportForm extends StatefulWidget {
  final String shift;

  const SalesReportForm({super.key, required this.shift});

  @override
  _SalesReportFormState createState() => _SalesReportFormState();
}

class _SalesReportFormState extends State<SalesReportForm> {
  final _targetController = TextEditingController();

  String? _selectedClosingLeads;
  String? _coldLeads;
  String? _hotLeads;
  String? _warmLeads;
  String? _winLeads;
  String? _lossLeads;
  // State for the new checkboxes
  List<String?> _coldLeadStatuses = [];
  List<String?> _hotLeadStatuses = [];
  List<String?> _warmLeadStatuses = [];


  List<TextEditingController> _coldNameControllers = [];
  List<TextEditingController> _coldAmountControllers = [];
  List<TextEditingController> _hotNameControllers = [];
  List<TextEditingController> _hotAmountControllers = [];
  List<TextEditingController> _warmNameControllers = [];
  List<TextEditingController> _warmAmountControllers = [];
  List<TextEditingController> _winControllers = [];
  List<TextEditingController> _lossControllers = [];

  int get closingLeadLimit => int.tryParse(_selectedClosingLeads ?? '0') ?? 0;

  int parseLeads(String? value) => int.tryParse(value ?? '0') ?? 0;

  int get totalAllocatedLeads =>
      parseLeads(_coldLeads) +
      parseLeads(_hotLeads) +
      parseLeads(_warmLeads) +
      parseLeads(_winLeads) +
      parseLeads(_lossLeads);


  int remainingAfter(List<String?> list) {
    int total = closingLeadLimit;
    for (var item in list) {
      total -= parseLeads(item);
    }
    return total < 0 ? 0 : total;
  }

  void _updateTargetAmount() {
    int total = 0;

    List<TextEditingController> allAmountControllers = [
      ..._coldAmountControllers,
      ..._hotAmountControllers,
      ..._warmAmountControllers,
    ];

    for (var controller in allAmountControllers) {
      final text = controller.text.trim();
      if (text.isNotEmpty) {
        total += int.tryParse(text) ?? 0;
      }
    }

    _targetController.text = total.toString();
  }

  // List<TextEditingController> _updateControllers(
  //     int count,
  //     List<TextEditingController> controllers,
  //     ) {
  //   if (controllers.length > count) {
  //     controllers = controllers.sublist(0, count);
  //   } else {
  //     for (int i = controllers.length; i < count; i++) {
  //       controllers.add(TextEditingController());
  //     }
  //   }
  //   return controllers;
  // }
  // void _syncControllers(List<TextEditingController> controllers, int count) {
  //   if (controllers.length > count) {
  //     controllers.removeRange(count, controllers.length);
  //   } else {
  //     for (int i = controllers.length; i < count; i++) {
  //       controllers.add(TextEditingController());
  //     }
  //   }
  // }

  void _syncControllers(List<TextEditingController> controllers, int count, {List<String?>? statusList}) {
    print('_syncControllers called for ${widget.shift} with count $count');

    if (controllers.length > count) {
      // Remove extra and their listeners
      for (int i = count; i < controllers.length; i++) {
        controllers[i].removeListener(_updateTargetAmount);
      }
      controllers.removeRange(count, controllers.length);
      statusList?.removeRange(count, statusList.length); // Sync status list

    } else {
      for (int i = controllers.length; i < count; i++) {
        final controller = TextEditingController();
        controller.addListener(_updateTargetAmount);
        controllers.add(controller);
        statusList?.add(null); // Add null for new status

      }
    }

    // Ensure all existing controllers have listeners attached
    for (var controller in controllers) {
      controller.removeListener(_updateTargetAmount); // avoid duplicates
      controller.addListener(_updateTargetAmount);
    }

    _updateTargetAmount(); // Recalculate immediately after sync
  }

  // Function to print lead data
  void _printLeadData() {
    print('--- ${widget.shift} Shift Sales Report ---');
    print('Target Amount: ${_targetController.text}');

    _printLeadCategoryData('Hot Leads', _hotNameControllers, _hotAmountControllers);
    _printLeadCategoryData('Cold Leads', _coldNameControllers, _coldAmountControllers);
    _printLeadCategoryData('Warm Leads', _warmNameControllers, _warmAmountControllers);
    // Add other lead types if they have dynamic fields in the future
    // _printLeadCategoryData('Win Leads', _winControllers, []); // Assuming win/loss might only have names
    // _printLeadCategoryData('Loss Leads', _lossControllers, []);
    print('-------------------------------------');
  }

  bool validateFields() {
    bool isAnyLeadFilled(List<TextEditingController> names, List<TextEditingController> amounts) {
      for (int i = 0; i < names.length; i++) {
        final name = names[i].text.trim();
        final amount = i < amounts.length ? amounts[i].text.trim() : '';
        if (name.isNotEmpty || amount.isNotEmpty) return true;
      }
      return false;
    }

    bool isValid = isAnyLeadFilled(_hotNameControllers, _hotAmountControllers) ||
        isAnyLeadFilled(_warmNameControllers, _warmAmountControllers) ||
        isAnyLeadFilled(_coldNameControllers, _coldAmountControllers) ||
        _winControllers.any((c) => c.text.trim().isNotEmpty) ||
        _lossControllers.any((c) => c.text.trim().isNotEmpty);

    if (!isValid) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill at least one lead field.'),
          backgroundColor: Colors.red,
        ),
      );
    }

    return isValid;
  }

  // Method to prepare data AND call API
  void _prepareAndSendApiBody() { // Changed return type to void and name to reflect new responsibility
    List<Map<String, dynamic>> hotLeadsData = [];
    for (int i = 0; i < _hotNameControllers.length; i++) {
      if (_hotNameControllers[i].text.trim().isNotEmpty &&
          i < _hotAmountControllers.length &&
          _hotAmountControllers[i].text.trim().isNotEmpty) {
        hotLeadsData.add({
          'companyName': _hotNameControllers[i].text.trim(),
          'amount': _hotAmountControllers[i].text.trim(), // Keep as string as per your JSON example
          'status': _hotLeadStatuses[i], // Include the selected status
        });
      }
    }

    List<Map<String, dynamic>> warmLeadsData = [];
    for (int i = 0; i < _warmNameControllers.length; i++) {
      if (_warmNameControllers[i].text.trim().isNotEmpty &&
          i < _warmAmountControllers.length &&
          _warmAmountControllers[i].text.trim().isNotEmpty) {
        warmLeadsData.add({
          'companyName': _warmNameControllers[i].text.trim(),
          'amount': _warmAmountControllers[i].text.trim(),
          'status': _warmLeadStatuses[i], // Include the selected status
        });
      }
    }

    List<Map<String, dynamic>> coldLeadsData = [];
    for (int i = 0; i < _coldNameControllers.length; i++) {
      if (_coldNameControllers[i].text.trim().isNotEmpty &&
          i < _coldAmountControllers.length &&
          _coldAmountControllers[i].text.trim().isNotEmpty) {
        coldLeadsData.add({
          'companyName': _coldNameControllers[i].text.trim(),
          'amount': _coldAmountControllers[i].text.trim(),
          'status': _coldLeadStatuses[i], // Include the selected status
        });
      }
    }

    List<Map<String, dynamic>> winLeadsData = [];
    for (int i = 0; i < _winControllers.length; i++) {
      if (_winControllers[i].text.trim().isNotEmpty) {
        winLeadsData.add({
          'companyName': _winControllers[i].text.trim(),
          'amount': "0" // Default or handle if you have an amount controller for win
        });
      }
    }

    List<Map<String, dynamic>> lossLeadsData = [];
    for (int i = 0; i < _lossControllers.length; i++) {
      if (_lossControllers[i].text.trim().isNotEmpty) {
        lossLeadsData.add({
          'companyName': _lossControllers[i].text.trim(),
          'amount': "0" // Default or handle if you have an amount controller for loss
        });
      }
    }

    // This is the map that will be sent as the request body
    final Map<String, dynamic> addLeadBody = {
      'shift': widget.shift, // Changed 'shift' to 'sift'
      // 'target_amount': int.tryParse(_targetController.text) ?? 0, // Removed based on your example JSON, uncomment if needed
      'hot': hotLeadsData,
      'warm': warmLeadsData,
      'cold': coldLeadsData,
      'Loss': lossLeadsData, // Capitalized 'Loss'
      'win': winLeadsData,
    };

    // Access the provider and make the API call
    final reportingProvider = context.read<SalesTLReportingApiProvider>();
    reportingProvider.addSalesTLReporting(
      context,
      addLeadBody,
    );
  }


  void _printLeadCategoryData(String category, List<TextEditingController> nameControllers, List<TextEditingController> amountControllers) {
    if (nameControllers.isNotEmpty) {
      print('\n$category:');
      for (int i = 0; i < nameControllers.length; i++) {
        final name = nameControllers[i].text.trim();
        final amount = i < amountControllers.length ? amountControllers[i].text.trim() : 'N/A';

        if (name.isNotEmpty || amount.isNotEmpty) {
          print('  Lead ${i + 1}: Name = ${name.isEmpty ? 'N/A' : name}, Amount = ${amount.isEmpty ? 'N/A' : amount}');
        }
      }
    } else {
      print('\n$category: No leads entered.');
    }
  }


  @override
  void dispose() {
    _targetController.dispose();
    for (var controller in _coldNameControllers) controller.dispose();
    for (var controller in _coldAmountControllers) controller.dispose();
    for (var controller in _hotNameControllers) controller.dispose();
    for (var controller in _hotAmountControllers) controller.dispose();
    for (var controller in _warmNameControllers) controller.dispose();
    for (var controller in _warmAmountControllers) controller.dispose();
    for (var controller in _winControllers) controller.dispose();
    for (var controller in _lossControllers) controller.dispose();
    super.dispose();
  }

  Widget _buildDynamicFields(
    List<TextEditingController> nameControllers,
    List<TextEditingController> amountControllers,
      List<String?> statusList, // Pass the status list
    String label,
  ) {
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
                // ADD THIS SizedBox: This is the missing part!
                if(widget.shift =="Evening")
                const SizedBox(height: 8), // Add vertical spacing here
                if(widget.shift =="Evening")
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
                          onChanged: (newValue) {
                            setState(() {
                              statusList[index] = newValue;
                            });
                          },
                        ),
                        _buildStatusSelectionChip(
                          label: 'Cold',
                          selectedValue: statusList[index],
                          value: 'Cold',
                          onChanged: (newValue) {
                            setState(() {
                              statusList[index] = newValue;
                            });
                          },
                        ),
                        _buildStatusSelectionChip(
                          label: 'Warm', // Example for a third option
                          selectedValue: statusList[index],
                          value: 'Warm',
                          onChanged: (newValue) {
                            setState(() {
                              statusList[index] = newValue;
                            });
                          },
                        ),

                        _buildStatusSelectionChip(
                          label: 'Win', // Example for a third option
                          selectedValue: statusList[index],
                          value: 'Win',
                          onChanged: (newValue) {
                            setState(() {
                              statusList[index] = newValue;
                            });
                          },
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


  Widget _buildStatusSelectionChip({
    required String label,
    required String? selectedValue, // The value currently selected in the group
    required String value, // The value this specific "checkbox" represents
    required ValueChanged<String?> onChanged,
  }) {
    final bool isSelected = selectedValue == value;

    return GestureDetector(
      onTap: () {
        // Only trigger onChanged if this item is not already selected,
        // or if you want to allow de-selection by tapping the same item again.
        // For a radio-like behavior, typically tapping the selected item does nothing.
        if (!isSelected) {
          onChanged(value);
        }
        // If you want to allow deselecting a selected item:
        // onChanged(isSelected ? null : value);
      },
      child: Row(
        mainAxisSize: MainAxisSize.min, // Keep the row compact
        children: [
          Container(
            width: 20.0, // Standard checkbox size
            height: 20.0,
            decoration: BoxDecoration(
              color: isSelected ? AppColors.orangeColor : Colors.transparent,
              border: Border.all(
                color: isSelected ? AppColors.orangeColor : AppColors.txtGreyColor,
                width: 2.0,
              ),
              borderRadius: BorderRadius.circular(4.0), // Slightly rounded corners like checkboxes
            ),
            child: isSelected
                ? const Icon(
              Icons.check,
              size: 16.0,
              color: Colors.white,
            )
                : null, // No icon when not selected
          ),
          const SizedBox(width: 8.0), // Space between checkbox and text
          Text(
            label,
            style: TextStyle(
              color: AppColors.txtGreyColor, // Standard text color
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }


  @override
  void initState() {
    super.initState();
    print('DEBUG: SalesReportForm initState called for shift: ${widget.shift}');

    if (widget.shift == 'Evening') {
      _hotLeads = '1';
      _coldLeads = '1';
      _warmLeads = '1';

      // Initialize controllers for the pre-selected values
      _syncControllers(_hotNameControllers, parseLeads(_hotLeads), statusList: _hotLeadStatuses);
      _syncControllers(_hotAmountControllers, parseLeads(_hotLeads));
      _syncControllers(_coldNameControllers, parseLeads(_coldLeads), statusList: _coldLeadStatuses);
      _syncControllers(_coldAmountControllers, parseLeads(_coldLeads));
      _syncControllers(_warmNameControllers, parseLeads(_warmLeads), statusList: _warmLeadStatuses);
      _syncControllers(_warmAmountControllers, parseLeads(_warmLeads));
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) { // Always check if the widget is still mounted before calling setState
          setState(() {
            // This empty setState() is enough to trigger a rebuild
            // print('DEBUG: setState triggered after postFrameCallback for ${widget.shift} shift');
          });
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomTextField(
            title: "Today's Target Amount *",
            hintText: "Enter amount",
            readOnly: true,
            controller: _targetController,
            prefixIcon: Icons.currency_rupee_sharp,
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          ),
          const SizedBox(height: 10),
          const Text(
            'Lead Status Distribution',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 5),
          buildLeadDropdown(
            label: 'Hot Leads',
            selectedValue: _hotLeads,
            max: 5,
            onChanged: (val) {
              setState(() {
                _hotLeads = val;
                int count = parseLeads(val);
                _syncControllers(_hotNameControllers, count, statusList: _hotLeadStatuses);
                _syncControllers(_hotAmountControllers, count);
                _winLeads = null;
                _lossLeads = null;
              });
            },
          ),
          _buildDynamicFields(
            _hotNameControllers,
            _hotAmountControllers,
            _hotLeadStatuses, // Pass the hot lead statuses
            "Hot",
          ),

          /// Cold + Hot
          buildLeadDropdown(
            label: 'Cold Leads',
            selectedValue: _coldLeads,
            max: 5,
            onChanged: (val) {
              setState(() {
                _coldLeads = val;
                int count = parseLeads(val);
                _syncControllers(_coldNameControllers, count, statusList: _coldLeadStatuses);
                _syncControllers(_coldAmountControllers, count);

                // Reset subsequent fields
                // _coldLeads = null;
                _winLeads = null;
                _lossLeads = null;
              });
            },
          ),
          _buildDynamicFields(
            _coldNameControllers,
            _coldAmountControllers,
            _coldLeadStatuses, // Pass the cold lead statuses
            "Cold",
          ),

          buildLeadDropdown(
            label: 'Warm Leads',
            selectedValue: _warmLeads,
            max: 5,
            onChanged: (val) {
              setState(() {
                _warmLeads = val;
                int count = parseLeads(val);
                _syncControllers(_warmNameControllers, count, statusList: _warmLeadStatuses);
                _syncControllers(_warmAmountControllers, count);

                // Reset subsequent fields
                // _warmLeads = null;
                _winLeads = null;
                _lossLeads = null;
              });
            },
          ),
          _buildDynamicFields(
            _warmNameControllers,
            _warmAmountControllers,
            _warmLeadStatuses, // Pass the warm lead statuses
            "Warm",
          ),
          const SizedBox(width: 12),
          // buildSummarySection(),
          const SizedBox(height: 16),
          Consumer<SalesTLReportingApiProvider>(
            builder: (context, salesTlReportingProvider, child) {
              return CustomButton(
                color: Colors.black,
                text: salesTlReportingProvider.isLoading ? 'Submitting...' : "Submit Report",
                onPressed: salesTlReportingProvider.isLoading
                    ? null // Disable button while loading
                    : () {
                  // Call the method that now prepares the body AND sends the API request
                  if (validateFields()) {
                    _prepareAndSendApiBody();
                  }
                  // _prepareAndSendApiBody();
                },
              );
            },
          ),
        ],
      ),
    );
  }

  Widget buildLeadDropdown({
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

  Widget buildSummarySection() {
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
        'value': _coldLeads ?? '0',
        'textColor': Colors.white,
        'bgColor': const Color(0xFF3182CE),
        'borderColor': const Color(0xFF2C5282),
        'iconColor': Colors.white,
        'icon': Icons.ac_unit_outlined,
      },
      {
        'label': 'Hot',
        'value': _hotLeads ?? '0',
        'textColor': Colors.white,
        'bgColor': const Color(0xFFE53E3E),
        'borderColor': const Color(0xFFC53030),
        'iconColor': Colors.white,
        'icon': Icons.local_fire_department_outlined,
      },
      {
        'label': 'Warm',
        'value': _warmLeads ?? '0',
        'textColor': Colors.white,
        'bgColor': const Color(0xFFDD6B20),
        'borderColor': const Color(0xFFC05621),
        'iconColor': Colors.white,
        'icon': Icons.wb_sunny_outlined,
      },
      {
        'label': 'Win',
        'value': _winLeads ?? '0',
        'textColor': Colors.white,
        'bgColor': const Color(0xFF38A169),
        'borderColor': const Color(0xFF2F855A),
        'iconColor': Colors.white,
        'icon': Icons.emoji_events_outlined,
      },
      {
        'label': 'Loss',
        'value': _lossLeads ?? '0',
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
                          // Icon with circular background
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: (item['textColor'] as Color).withOpacity(
                                0.1,
                              ),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              item['icon'] as IconData,
                              color: item['iconColor'] as Color,
                              size: 24,
                            ),
                          ),
                          const SizedBox(height: 12),
                          // Label
                          Text(
                            item['label'] as String,
                            style: TextStyle(
                              color: (item['textColor'] as Color).withOpacity(
                                0.85,
                              ),
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                              letterSpacing: 0.5,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          // Value
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
        // Enhanced Allocation Status
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
                      'Allocated: $totalAllocatedLeads / ${_selectedClosingLeads ?? '-'}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 13,
                        color: Color(0xFF4A5568),
                      ),
                    ),
                  ],
                ),
              ),
              // Progress indicator
              if (_selectedClosingLeads != null && closingLeadLimit > 0)
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
                    '${((totalAllocatedLeads / closingLeadLimit) * 100).toInt()}%',
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
  }
}
