import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/controller/sales_tl_reporting_controller.dart';
import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/screen/sales_reports_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_text_field_utils.dart';

class EveningShiftForm extends StatefulWidget {
  const EveningShiftForm({super.key});

  @override
  _EveningShiftFormState createState() => _EveningShiftFormState();
}

class _EveningShiftFormState extends State<EveningShiftForm> {
  final _targetController = TextEditingController();

  String? _selectedClosingLeads;
  String? _coldLeads;
  String? _hotLeads;
  String? _warmLeads;
  String? _winLeads;
  String? _lossLeads;

  // State for the status selection in evening shift
  List<String?> _coldLeadStatuses = [];
  List<String?> _hotLeadStatuses = [];
  List<String?> _warmLeadStatuses = [];

  // Simple text data instead of controllers
  List<String> _coldNameTexts = [];
  List<String> _coldAmountTexts = [];
  List<String> _hotNameTexts = [];
  List<String> _hotAmountTexts = [];
  List<String> _warmNameTexts = [];
  List<String> _warmAmountTexts = [];
  List<String> _winTexts = [];
  List<String> _lossTexts = [];

  int get closingLeadLimit => int.tryParse(_selectedClosingLeads ?? '0') ?? 0;

  int parseLeads(String? value) => int.tryParse(value ?? '0') ?? 0;

  int get totalAllocatedLeads =>
      parseLeads(_coldLeads) +
          parseLeads(_hotLeads) +
          parseLeads(_warmLeads) +
          parseLeads(_winLeads) +
          parseLeads(_lossLeads);

  void _updateTargetAmount() {
    int total = 0;

    // Calculate from text data instead of controllers
    List<String> allAmountTexts = [
      ..._coldAmountTexts,
      ..._hotAmountTexts,
      ..._warmAmountTexts,
    ];

    for (var amountText in allAmountTexts) {
      if (amountText.isNotEmpty) {
        total += int.tryParse(amountText) ?? 0;
      }
    }

    _targetController.text = total.toString();
  }

  void _syncTextLists(List<String> nameTexts, List<String> amountTexts, int count, {List<String?>? statusList}) {
    // Sync name texts
    if (nameTexts.length > count) {
      nameTexts.removeRange(count, nameTexts.length);
    } else {
      for (int i = nameTexts.length; i < count; i++) {
        nameTexts.add("Client Name ${i + 1}"); // Default client name
      }
    }

    // Sync amount texts
    if (amountTexts.length > count) {
      amountTexts.removeRange(count, amountTexts.length);
    } else {
      for (int i = amountTexts.length; i < count; i++) {
        amountTexts.add("₹ 0"); // Default amount
      }
    }

    // Sync status list
    if (statusList != null) {
      if (statusList.length > count) {
        statusList.removeRange(count, statusList.length);
      } else {
        for (int i = statusList.length; i < count; i++) {
          statusList.add(null);
        }
      }
    }

    _updateTargetAmount();
  }

  bool validateFields() {
    bool isAnyLeadFilled(List<String> names, List<String> amounts) {
      for (int i = 0; i < names.length; i++) {
        final name = names[i].trim();
        final amount = i < amounts.length ? amounts[i].trim() : '';
        if (name.isNotEmpty && name != "Client Name ${i + 1}" ||
            (amount.isNotEmpty && amount != "₹ 0")) return true;
      }
      return false;
    }

    bool isValid = isAnyLeadFilled(_hotNameTexts, _hotAmountTexts) ||
        isAnyLeadFilled(_warmNameTexts, _warmAmountTexts) ||
        isAnyLeadFilled(_coldNameTexts, _coldAmountTexts) ||
        _winTexts.any((c) => c.trim().isNotEmpty && c.trim() != "Client Name") ||
        _lossTexts.any((c) => c.trim().isNotEmpty && c.trim() != "Client Name");

    if (!isValid) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please modify at least one lead field.'),
          backgroundColor: Colors.red,
        ),
      );
    }

    return isValid;
  }

  void _prepareAndSendApiBody() {
    List<Map<String, dynamic>> hotLeadsData = [];
    for (int i = 0; i < _hotNameTexts.length; i++) {
      if (_hotNameTexts[i].trim().isNotEmpty &&
          _hotNameTexts[i] != "Client Name ${i + 1}" &&
          i < _hotAmountTexts.length &&
          _hotAmountTexts[i].trim().isNotEmpty &&
          _hotAmountTexts[i] != "₹ 0") {
        hotLeadsData.add({
          'companyName': _hotNameTexts[i].trim(),
          'amount': _hotAmountTexts[i].replaceAll('₹', '').trim(),
          'status': _hotLeadStatuses[i],
        });
      }
    }

    List<Map<String, dynamic>> warmLeadsData = [];
    for (int i = 0; i < _warmNameTexts.length; i++) {
      if (_warmNameTexts[i].trim().isNotEmpty &&
          _warmNameTexts[i] != "Client Name ${i + 1}" &&
          i < _warmAmountTexts.length &&
          _warmAmountTexts[i].trim().isNotEmpty &&
          _warmAmountTexts[i] != "₹ 0") {
        warmLeadsData.add({
          'companyName': _warmNameTexts[i].trim(),
          'amount': _warmAmountTexts[i].replaceAll('₹', '').trim(),
          'status': _warmLeadStatuses[i],
        });
      }
    }

    List<Map<String, dynamic>> coldLeadsData = [];
    for (int i = 0; i < _coldNameTexts.length; i++) {
      if (_coldNameTexts[i].trim().isNotEmpty &&
          _coldNameTexts[i] != "Client Name ${i + 1}" &&
          i < _coldAmountTexts.length &&
          _coldAmountTexts[i].trim().isNotEmpty &&
          _coldAmountTexts[i] != "₹ 0") {
        coldLeadsData.add({
          'companyName': _coldNameTexts[i].trim(),
          'amount': _coldAmountTexts[i].replaceAll('₹', '').trim(),
          'status': _coldLeadStatuses[i],
        });
      }
    }

    List<Map<String, dynamic>> winLeadsData = [];
    for (int i = 0; i < _winTexts.length; i++) {
      if (_winTexts[i].trim().isNotEmpty && _winTexts[i] != "Client Name") {
        winLeadsData.add({
          'companyName': _winTexts[i].trim(),
          'amount': "0"
        });
      }
    }

    List<Map<String, dynamic>> lossLeadsData = [];
    for (int i = 0; i < _lossTexts.length; i++) {
      if (_lossTexts[i].trim().isNotEmpty && _lossTexts[i] != "Client Name") {
        lossLeadsData.add({
          'companyName': _lossTexts[i].trim(),
          'amount': "0"
        });
      }
    }

    final Map<String, dynamic> addLeadBody = {
      'shift': 'Evening',
      'hot': hotLeadsData,
      'warm': warmLeadsData,
      'cold': coldLeadsData,
      'Loss': lossLeadsData,
      'win': winLeadsData,
    };

    final reportingProvider = context.read<SalesTLReportingApiProvider>();
    reportingProvider.addSalesTLReporting(
      context,
      addLeadBody,
    );
  }

  @override
  void initState() {
    super.initState();
    print('DEBUG: EveningShiftForm initState called');

    // Initialize default values for evening shift
    _hotLeads = '1';
    _coldLeads = '1';
    _warmLeads = '1';

    // Initialize text lists for the pre-selected values
    _syncTextLists(_hotNameTexts, _hotAmountTexts, parseLeads(_hotLeads), statusList: _hotLeadStatuses);
    _syncTextLists(_coldNameTexts, _coldAmountTexts, parseLeads(_coldLeads), statusList: _coldLeadStatuses);
    _syncTextLists(_warmNameTexts, _warmAmountTexts, parseLeads(_warmLeads), statusList: _warmLeadStatuses);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        setState(() {
          // Trigger rebuild after initialization
        });
      }
    });
  }

  @override
  void dispose() {
    _targetController.dispose();
    super.dispose();
  }

  Widget _buildDynamicFields(
      List<String> nameTexts,
      List<String> amountTexts,
      List<String?> statusList,
      String label,
      ) {
    return Container(
      color: AppColors.txtGreyColor.withAlpha(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(nameTexts.length, (index) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Column(
              children: [
                Row(
                  children: [
                    // Client Name Text
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(10.0),
                        decoration: BoxDecoration(
                          // color: Colors.white,
                          // border: Border.all(color: AppColors.txtGreyColor.withOpacity(0.5)),
                          // borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "$label Lead ${index + 1}",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: AppColors.txtGreyColor,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  Icons.person_outline,
                                  size: 16,
                                  color: AppColors.txtGreyColor,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    nameTexts[index],
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Amount Text
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(10.0),
                        decoration: BoxDecoration(
                          // color: Colors.white,
                          // border: Border.all(color: AppColors.txtGreyColor.withOpacity(0.5)),
                          // borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Amount",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: AppColors.txtGreyColor,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  Icons.currency_rupee,
                                  size: 16,
                                  color: AppColors.txtGreyColor,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    amountTexts[index],
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                // Status Selection Container
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
                          label: 'Warm',
                          selectedValue: statusList[index],
                          value: 'Warm',
                          onChanged: (newValue) {
                            setState(() {
                              statusList[index] = newValue;
                            });
                          },
                        ),
                        _buildStatusSelectionChip(
                          label: 'Win',
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
          SalesReportWidgets.buildLeadDropdown(
            label: 'Hot Leads',
            selectedValue: _hotLeads,
            max: 5,
            onChanged: (val) {
              setState(() {
                _hotLeads = val;
                int count = parseLeads(val);
                _syncTextLists(_hotNameTexts, _hotAmountTexts, count, statusList: _hotLeadStatuses);
                _winLeads = null;
                _lossLeads = null;
              });
            },
          ),
          _buildDynamicFields(
            _hotNameTexts,
            _hotAmountTexts,
            _hotLeadStatuses,
            "Hot",
          ),
          SalesReportWidgets.buildLeadDropdown(
            label: 'Cold Leads',
            selectedValue: _coldLeads,
            max: 5,
            onChanged: (val) {
              setState(() {
                _coldLeads = val;
                int count = parseLeads(val);
                _syncTextLists(_coldNameTexts, _coldAmountTexts, count, statusList: _coldLeadStatuses);
                _winLeads = null;
                _lossLeads = null;
              });
            },
          ),
          _buildDynamicFields(
            _coldNameTexts,
            _coldAmountTexts,
            _coldLeadStatuses,
            "Cold",
          ),
          SalesReportWidgets.buildLeadDropdown(
            label: 'Warm Leads',
            selectedValue: _warmLeads,
            max: 5,
            onChanged: (val) {
              setState(() {
                _warmLeads = val;
                int count = parseLeads(val);
                _syncTextLists(_warmNameTexts, _warmAmountTexts, count, statusList: _warmLeadStatuses);
                _winLeads = null;
                _lossLeads = null;
              });
            },
          ),
          _buildDynamicFields(
            _warmNameTexts,
            _warmAmountTexts,
            _warmLeadStatuses,
            "Warm",
          ),
          const SizedBox(height: 16),
          Consumer<SalesTLReportingApiProvider>(
            builder: (context, salesTlReportingProvider, child) {
              return CustomButton(
                color: Colors.black,
                text: salesTlReportingProvider.isLoading ? 'Submitting...' : "Submit Report",
                onPressed: salesTlReportingProvider.isLoading
                    ? null
                    : () {
                  if (validateFields()) {
                    _prepareAndSendApiBody();
                  }
                },
              );
            },
          ),
        ],
      ),
    );
  }
}