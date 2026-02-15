import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/controller/sales_tl_reporting_controller.dart';
import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/screen/sales_reports_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/custom_buttons_utils.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/responsive_dropdown_utils.dart';

class MorningShiftForm extends StatefulWidget {
  const MorningShiftForm({super.key});

  @override
  _MorningShiftFormState createState() => _MorningShiftFormState();
}

class _MorningShiftFormState extends State<MorningShiftForm> {
  final _targetController = TextEditingController();

  String? _selectedClosingLeads;
  String? _coldLeads;
  String? _hotLeads;
  String? _warmLeads;
  String? _winLeads;
  String? _lossLeads;

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

  void _syncControllers(List<TextEditingController> controllers, int count) {
    if (controllers.length > count) {
      // Remove extra and their listeners
      for (int i = count; i < controllers.length; i++) {
        controllers[i].removeListener(_updateTargetAmount);
      }
      controllers.removeRange(count, controllers.length);
    } else {
      for (int i = controllers.length; i < count; i++) {
        final controller = TextEditingController();
        controller.addListener(_updateTargetAmount);
        controllers.add(controller);
      }
    }

    // Ensure all existing controllers have listeners attached
    for (var controller in controllers) {
      controller.removeListener(_updateTargetAmount); // avoid duplicates
      controller.addListener(_updateTargetAmount);
    }

    _updateTargetAmount(); // Recalculate immediately after sync
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

  void _prepareAndSendApiBody() {
    List<Map<String, dynamic>> hotLeadsData = [];
    for (int i = 0; i < _hotNameControllers.length; i++) {
      if (_hotNameControllers[i].text.trim().isNotEmpty &&
          i < _hotAmountControllers.length &&
          _hotAmountControllers[i].text.trim().isNotEmpty) {
        hotLeadsData.add({
          'companyName': _hotNameControllers[i].text.trim(),
          'amount': _hotAmountControllers[i].text.trim(),
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
        });
      }
    }

    List<Map<String, dynamic>> winLeadsData = [];
    for (int i = 0; i < _winControllers.length; i++) {
      if (_winControllers[i].text.trim().isNotEmpty) {
        winLeadsData.add({
          'companyName': _winControllers[i].text.trim(),
          'amount': "0"
        });
      }
    }

    List<Map<String, dynamic>> lossLeadsData = [];
    for (int i = 0; i < _lossControllers.length; i++) {
      if (_lossControllers[i].text.trim().isNotEmpty) {
        lossLeadsData.add({
          'companyName': _lossControllers[i].text.trim(),
          'amount': "0"
        });
      }
    }

    final Map<String, dynamic> addLeadBody = {
      'shift': 'Morning',
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
      String label,
      ) {
    return SalesReportWidgets.buildBasicDynamicFields(
      nameControllers: nameControllers,
      amountControllers: amountControllers,
      label: label,
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
                _syncControllers(_hotNameControllers, count);
                _syncControllers(_hotAmountControllers, count);
                _winLeads = null;
                _lossLeads = null;
              });
            },
          ),
          _buildDynamicFields(
            _hotNameControllers,
            _hotAmountControllers,
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
                _syncControllers(_coldNameControllers, count);
                _syncControllers(_coldAmountControllers, count);
                _winLeads = null;
                _lossLeads = null;
              });
            },
          ),
          _buildDynamicFields(
            _coldNameControllers,
            _coldAmountControllers,
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
                _syncControllers(_warmNameControllers, count);
                _syncControllers(_warmAmountControllers, count);
                _winLeads = null;
                _lossLeads = null;
              });
            },
          ),
          _buildDynamicFields(
            _warmNameControllers,
            _warmAmountControllers,
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