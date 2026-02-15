import 'package:dss_crm/sales_module/common/model/sales_emp_client_briefing_form_list_model.dart'
as salesMangementSheetListResult;
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_4_pending_payment_model.dart';
import 'package:dss_crm/sales_module/common/screen/widgets/custom_steper_widget.dart';
import 'package:dss_crm/sales_module/common/screen/widgets/initial_payment_widget.dart';
import 'package:dss_crm/sales_module/common/screen/widgets/payment_tracking_widget.dart';
import 'package:dss_crm/sales_module/common/screen/widgets/pre_sale_form_widget.dart';
import 'package:dss_crm/sales_module/common/screen/widgets/step_completion_widget.dart';
import 'package:flutter/material.dart';
import 'package:dss_crm/sales_module/common/controller/sales_module_common_controller.dart';
import 'package:dss_crm/utils/default_common_app_bar.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../model/sales_management_sheet_form_1_model.dart' as form1_model;
import '../model/sales_management_sheet_form_2_model.dart' as form2_model;

import 'widgets/step_header_widget.dart';
import 'widgets/lead_management_form_widget.dart';

class SalesTLHODSalesManagenentSheetFormScreen extends StatefulWidget {
  final salesMangementSheetListResult.Result? initialLeadData;

  const SalesTLHODSalesManagenentSheetFormScreen({
    Key? key,
    this.initialLeadData,
  }) : super(key: key);

  @override
  State<SalesTLHODSalesManagenentSheetFormScreen> createState() =>
      _SalesTLHODSalesManagenentSheetFormScreenState();
}

class _SalesTLHODSalesManagenentSheetFormScreenState
    extends State<SalesTLHODSalesManagenentSheetFormScreen> {
  int _currentStep = 0;
  bool _isInitialPaymentDataAvailable = false;

  // Controllers
  final _companyNameController = TextEditingController();
  final _concernPersonNameController = TextEditingController();
  final _concernPersonDesignationController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _remarkController = TextEditingController();
  final _projectDetailController = TextEditingController();
  final _clientRatingController = TextEditingController();
  final _clientProfileCommentController = TextEditingController();
  final _expectedBusinessSizeController = TextEditingController();
  final _briefingAtController = TextEditingController();
  final _clientNameController = TextEditingController();
  final _preSalesCompanyNameController = TextEditingController();
  final _projectNameController = TextEditingController();
  final _productNameController = TextEditingController();
  final _clientRequirementsController = TextEditingController();
  final _clientProfileController = TextEditingController();
  final _clientBehaviourController = TextEditingController();
  final _discussionDoneController = TextEditingController();
  final _instructionsRecceController = TextEditingController();
  final _instructionsDesignController = TextEditingController();
  final _instructionsInstallationController = TextEditingController();
  final _instructionsOtherController = TextEditingController();
  final _totalAmountController = TextEditingController();
  final _discountController = TextEditingController();
  final _totalPaidController = TextEditingController();
  final _paymentRemarksController = TextEditingController();
  final _methodController = TextEditingController();

  bool _isFormDataInitialized = false;
  bool _isForm1DataInitialized = false;
  bool _isForm2DataInitialized = false;
  bool _isForm3DataInitialized = false;

  List<String> _documentUrls = [];


  String? _selectedLeadSource;
  String? _selectedBusinessType;
  String? _selectedLeadStatus;
  String? _selectedContentShared;
  String? _selectedReccaStatus;
  String? _selectedPaymentMethodLabel;

  final Map<String, String> _paymentMethodMap = {
    'Cash': 'cash',
    'Bank Transfer': 'bank',
    'Cheque': 'cheque',
    'UPI': 'upi',
    'Online Payment': 'online',
    'Credit Card': 'credit_card',
    'Debit Card': 'debit_card',
    'Other': 'other',
  };
// ✅ New mapping to convert API value to UI display label
  final Map<String, String> _reversePaymentMethodMap = {
    'cash': 'Cash',
    'bank': 'Bank Transfer',
    'cheque': 'Cheque',
    'upi': 'UPI',
    'online': 'Online Payment',
    'credit_card': 'Credit Card',
    'debit_card': 'Debit Card',
    'other': 'Other',
  };

  String? get selectedPaymentMethodForApi =>
      _selectedPaymentMethodLabel != null
          ? _paymentMethodMap[_selectedPaymentMethodLabel!]
          : null;

  final List<String> stepTitles = [
    "Lead Management",
    "Pre-Sales",
    "Initial Payment",
    "Final Step",
    "Completed",
  ];

  // Define the mapping between API values and dropdown display values
  final Map<String, String> businessTypeMapping = {
    'b2c': 'B2c',
    'b2b': 'B2b',
    // Add other mappings as needed
  };

  final Map<String, String> reverseBusinessTypeMapping = {
    'B2c': 'b2c',
    'B2b': 'b2b',
    // Add reverse mappings for API submission
  };

  @override
  void initState() {
    super.initState();
    // if (widget.initialLeadData?.sId != null) {
    //   WidgetsBinding.instance.addPostFrameCallback((_) {
    //     final provider = Provider.of<SalesModuleCommonApiProvider>(
    //       context,
    //       listen: false,
    //     );
    //     provider.getSalesManagementSheetForm1Data(
    //       context,
    //       widget.initialLeadData!.leadId,
    //     );
    //     provider.getSalesManagementSheetForm2Data(
    //       context,
    //       widget.initialLeadData!.sId,
    //     );
    //
    //     // Call for Form 3/4 data here, if it contains pre-fillable info for Form 3
    //     provider.getPendingPaymentForm4Data(
    //       context,
    //       widget.initialLeadData!.sId!, // Use actual project ID here
    //     );
    //
    //
    //   });
    // }
    _totalAmountController.addListener(_calculateTotalPaid);
    _discountController.addListener(_calculateTotalPaid);

    // Call the data loading function for the first step
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadStepData(_currentStep);
    });
  }
  // ✅ New method to load data for the current step
  Future<void> _loadStepData(int step) async {
    final provider = Provider.of<SalesModuleCommonApiProvider>(context, listen: false);

    if (widget.initialLeadData?.sId == null) return;

    if (step == 0 && !_isForm1DataInitialized) {
      await provider.getSalesManagementSheetForm1Data(
        context,
        widget.initialLeadData!.leadId,
      );
      if (provider.getSalesManagementSheetForm1ModelResponse?.data?.success ?? false) {
        _isForm1DataInitialized = true;
        _populateForm1Data(provider.getSalesManagementSheetForm1ModelResponse?.data);
      }
    } else if (step == 1 && !_isForm2DataInitialized) {
      await provider.getSalesManagementSheetForm2Data(
        context,
        widget.initialLeadData!.sId,
      );
      if (provider.getSalesManagementSheetForm2ModelResponse?.data?.success ?? false) {
        _isForm2DataInitialized = true;
        _populateForm2Data(provider.getSalesManagementSheetForm2ModelResponse?.data);
      }
    } else if (step == 2 && !_isForm3DataInitialized) {
      await provider.getPendingPaymentForm4Data(
        context,
        widget.initialLeadData!.sId!,
      );
      final form4ApiResponse = provider.getPendingPaymentForm4ModelResponse;
      if (form4ApiResponse?.data?.data?.result != null && (form4ApiResponse?.success ?? false)) {
        _isForm3DataInitialized = true;
        _populateForm3Data(form4ApiResponse!.data);
      }
    }
  }


  void _calculateTotalPaid() {
    double totalAmount = double.tryParse(_totalAmountController.text) ?? 0.0;
    double discount = double.tryParse(_discountController.text) ?? 0.0;
    double totalPaid = totalAmount - discount;
    if (totalPaid < 0) totalPaid = 0;

    String newTotalPaidText = totalPaid.toStringAsFixed(2);
    if (_totalPaidController.text != newTotalPaidText) {
      _totalPaidController.text = newTotalPaidText;
    }
  }
  // Helper method to get dropdown value from API value
  String? _getDropdownValueFromApi(String? apiValue, Map<String, String> mapping) {
    if (apiValue == null) return null;
    return mapping[apiValue.toLowerCase()] ?? apiValue;
  }


  void _populateForm1Data(
      form1_model.SalesManagementSheetShowForm1DetailsModelReponse? response,
      ) {
    final data = response?.data?.result;
    if (data != null) {
      _companyNameController.text = data.companyName ?? '';
      _concernPersonNameController.text = data.concernPersonName ?? '';
      _concernPersonDesignationController.text = data.concernPersonDesignation ?? '';
      _addressController.text = data.address ?? '';
      _phoneController.text = data.phone ?? '';
      _remarkController.text = data.remark ?? '';
      _clientRequirementsController.text = data.requirement ?? '';
      _projectDetailController.text = data.projectDetail ?? '';
      _clientRatingController.text = data.clientRatingInBusiness ?? '';
      _clientProfileCommentController.text = data.clientProfileComment ?? '';
      _expectedBusinessSizeController.text = data.expectedBusinessSize ?? '';
      _selectedLeadSource = data.leadSource;
      // _selectedBusinessType = data.businessType;
      _selectedLeadStatus = data.leadStatus;
      _selectedContentShared = data.contentShared;
      _selectedReccaStatus = data.recceStatus;

      // _getDropdownValueFromApi(data.businessType, businessTypeMapping);

      // Fix case sensitivity for businessType
      _selectedBusinessType = data.businessType?.toLowerCase() == 'b2c' ? 'B2c' :
      data.businessType?.toLowerCase() == 'b2b' ? 'B2b' :
      data.businessType;

    }
  }

  // Helper method to get API value from dropdown value
  String? _getApiValueFromDropdown(String? dropdownValue, Map<String, String> reverseMapping) {
    if (dropdownValue == null) return null;
    return reverseMapping[dropdownValue] ?? dropdownValue.toLowerCase();
  }
  // When submitting data back to API, convert dropdown values back to API format
  Map<String, dynamic> _prepareFormDataForApi() {
    return {
      // 'companyName': _companyNameController.text,
      'businessType': _getApiValueFromDropdown(_selectedBusinessType, reverseBusinessTypeMapping),
      // ... other fields
    };
  }

  void _populateForm2Data(
      form2_model.SalesManagementSheetShowForm2DetailsModelReponse? response,
      ) {
    final data = response?.data?.result;
    if (data != null) {
      _clientNameController.text = data.clientName ?? '';
      _preSalesCompanyNameController.text = data.companyName ?? '';
      _projectNameController.text = data.projectName ?? '';
      _productNameController.text = data.productName ?? '';
      _clientProfileController.text = data.clientProfile ?? '';
      _clientBehaviourController.text = data.clientBehaviour ?? '';
      _discussionDoneController.text = data.discussionDone ?? '';
      _instructionsRecceController.text = data.instructionRecce ?? '';
      _instructionsDesignController.text = data.instructionDesign ?? '';
      _instructionsInstallationController.text = data.instructionInstallation ?? '';
      _instructionsOtherController.text = data.instructionOther ?? '';
      _documentUrls = data.documentUpload?.map((doc) => doc.url ?? '').toList() ?? [];

    }
  }

  Future<void> _handleInitialPaymentSubmission() async {
    final provider = Provider.of<SalesModuleCommonApiProvider>(context, listen: false);
    final String projectId = widget.initialLeadData!.sId.toString();
    // final String projectId = '6889d96ca2aec8676b6f4d2b';

    Map<String, dynamic> body = {
      "projectId": projectId,
      "totalAmount": _totalAmountController.text,
      "discount": _discountController.text,
      "totalPaid": _totalPaidController.text,
      "method": selectedPaymentMethodForApi?.toLowerCase() ?? '',
      "remarks": _paymentRemarksController.text,
    };

    await provider.addSalesManagementSheetForm3Payment(context, body);

    if (provider.addSalesManagementSheetForm3PaymentModelResponse?.success ?? false) {
      setState(() => _currentStep++);
    }
  }

  String _getButtonText(SalesModuleCommonApiProvider provider) {
    if (_currentStep == 2 && provider.isLoading) {
      return "Submitting...";
    } else if (_currentStep == 3 && provider.isLoading) {
      return "Loading...";
    } else if (_currentStep == stepTitles.length - 1) {
      return "Submit";
    } else {
      return "Next";
    }
  }

  Future<void> _handleNextButtonPress(SalesModuleCommonApiProvider provider) async {
    if (provider.isLoading) return;

    if (_currentStep == 2) {
      await _handleInitialPaymentSubmission();
    }
    // ✅ Check if we are at the last step. If so, handle final submission.
    if (_currentStep == stepTitles.length - 1) {
      // ScaffoldMessenger.of(context).showSnackBar(
      //   const SnackBar(content: Text("Form Submitted!")),
      // );
      // You can navigate back to the home page or another screen here.
      // For example:
      Navigator.pop(context);
      return; // Exit the function to prevent further increments
    }
    // 🚀 Move to the next step and load its data
    int nextStep = _currentStep + 1;
    setState(() => _currentStep = nextStep);

    // If the next step is valid, load its data
    if (nextStep < stepTitles.length) {
      _loadStepData(nextStep);
    }

    // if (_currentStep == 2) {
    //   await _handleInitialPaymentSubmission();
    // } else if (_currentStep == 3) {
    //   final projectId = widget.initialLeadData?.sId ?? '';
    //   if (projectId.isNotEmpty) {
    //     await provider.getPendingPaymentForm4Data(context, projectId);
    //   }
    //   setState(() => _currentStep++);
    // } else if (_currentStep == stepTitles.length - 1) {
    //   ScaffoldMessenger.of(context).showSnackBar(
    //     const SnackBar(content: Text("Form Submitted!")),
    //   );
    // } else {
    //   setState(() => _currentStep++);
    // }
  }

  Widget _buildCurrentStepContent() {
    switch (_currentStep) {
      case 0:
        return LeadManagementFormWidget(
          companyNameController: _companyNameController,
          concernPersonNameController: _concernPersonNameController,
          concernPersonDesignationController: _concernPersonDesignationController,
          addressController: _addressController,
          phoneController: _phoneController,
          remarkController: _remarkController,
          projectDetailController: _projectDetailController,
          clientRatingController: _clientRatingController,
          clientProfileCommentController: _clientProfileCommentController,
          expectedBusinessSizeController: _expectedBusinessSizeController,
          selectedLeadSource: _selectedLeadSource,
          selectedBusinessType: _selectedBusinessType,
          selectedLeadStatus: _selectedLeadStatus,
          selectedContentShared: _selectedContentShared,
          selectedReccaStatus: _selectedReccaStatus,
          onLeadSourceChanged: (val) => setState(() => _selectedLeadSource = val),
          onBusinessTypeChanged: (val) => setState(() => _selectedBusinessType = val),
          onLeadStatusChanged: (val) => setState(() => _selectedLeadStatus = val),
          onContentSharedChanged: (val) => setState(() => _selectedContentShared = val),
          onReccaStatusChanged: (val) => setState(() => _selectedReccaStatus = val),
        );
      case 1:
        return PreSalesFormWidget(
          briefingAtController: _briefingAtController,
          clientNameController: _clientNameController,
          preSalesCompanyNameController: _preSalesCompanyNameController,
          projectNameController: _projectNameController,
          productNameController: _productNameController,
          clientRequirementsController: _clientRequirementsController,
          clientProfileController: _clientProfileController,
          clientBehaviourController: _clientBehaviourController,
          discussionDoneController: _discussionDoneController,
          instructionsRecceController: _instructionsRecceController,
          instructionsDesignController: _instructionsDesignController,
          instructionsInstallationController: _instructionsInstallationController,
          instructionsOtherController: _instructionsOtherController,
          documentUrls: _documentUrls
        );
      case 2:
        return InitialPaymentFormWidget(
          totalAmountController: _totalAmountController,
          discountController: _discountController,
          totalPaidController: _totalPaidController,
          paymentRemarksController: _paymentRemarksController,
          selectedPaymentMethodLabel: _selectedPaymentMethodLabel,
          paymentMethodMap: _paymentMethodMap,
          onPaymentMethodChanged: (val) => setState(() => _selectedPaymentMethodLabel = val),
          isReadOnly: _isInitialPaymentDataAvailable, // ✅ Pass the new boolean flag here
        );
      case 3:
        return PaymentTrackingFormWidget(
          initialLeadData: widget.initialLeadData,
        );
      case 4:
        return const CompletionScreenWidget();
      default:
        return Container();
    }
  }
  // Changed parameter type to PendingPaymentForm4ModelReponse? to match the data contained within ApiResponse
  void _populateForm3Data( PendingPaymentForm4ModelReponse? responseModel) {
    // Access 'result' from within the 'data' field of the responseModel
    final data = responseModel?.data?.result;
    if (data != null) {
      final hasPaidPayments = data.paidPayments != null && data.paidPayments!.isNotEmpty;
      if (hasPaidPayments) {
        final firstPayment = data.paidPayments!.first;

        // Set controllers and dropdown label
        if (_totalAmountController.text.isEmpty) {
          _totalAmountController.text = (data.totalAmount ?? 0.0).toStringAsFixed(2);
        }
        if (_discountController.text.isEmpty) {
          _discountController.text = (data.discount ?? 0.0).toStringAsFixed(2);
        }
        final apiMethod = firstPayment.method;
        if (apiMethod != null) {
          _selectedPaymentMethodLabel = _reversePaymentMethodMap[apiMethod.toLowerCase()];
        }
        if (_paymentRemarksController.text.isEmpty) {
          _paymentRemarksController.text = firstPayment.remarks ?? '';
        }
      }

      // Update the flag to control the readOnly state of the form fields
      setState(() {
        _isInitialPaymentDataAvailable = hasPaidPayments;
      });

      // if (_totalAmountController.text.isEmpty) {
      //   _totalAmountController.text = (data.totalAmount ?? 0.0).toStringAsFixed(2);
      // }
      // if (_discountController.text.isEmpty) {
      //   _discountController.text = (data.discount ?? 0.0).toStringAsFixed(2);
      // }
      // // ✅ New logic to set the dropdown label from the API's method value
      // if (data.paidPayments != null && data.paidPayments!.isNotEmpty) {
      //   final firstPayment = data.paidPayments!.first;
      //   final apiMethod = firstPayment.method; // This is the lowercase string from the API, e.g., 'upi'
      //   if (apiMethod != null) {
      //     // Use the reverse map to get the display label, e.g., 'UPI'
      //     _selectedPaymentMethodLabel = _reversePaymentMethodMap[apiMethod.toLowerCase()];
      //   }
      // }
      // // You can also add logic for remarks if needed
      // if (_paymentRemarksController.text.isEmpty && data.paidPayments != null && data.paidPayments!.isNotEmpty) {
      //   _paymentRemarksController.text = data.paidPayments!.first.remarks ?? '';
      // }
    }
  }
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final provider = Provider.of<SalesModuleCommonApiProvider>(context);

    if (!_isForm1DataInitialized && (provider.getSalesManagementSheetForm1ModelResponse?.data?.success ?? false)) {
      _isForm1DataInitialized = true;
      _populateForm1Data(provider.getSalesManagementSheetForm1ModelResponse?.data);
    }

    if (!_isForm2DataInitialized && (provider.getSalesManagementSheetForm2ModelResponse?.data?.success ?? false)) {
      _isForm2DataInitialized = true;
      _populateForm2Data(provider.getSalesManagementSheetForm2ModelResponse?.data);
    }

    if (!_isForm3DataInitialized && (provider.getPendingPaymentForm4ModelResponse?.data?.data?.result != null) && (provider.getPendingPaymentForm4ModelResponse?.success ?? false)) {
      _isForm3DataInitialized = true;
      // It's still crucial to use a post-frame callback here because _populateForm3Data
      // calls setState, which is not allowed during the build phase of didChangeDependencies.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _populateForm3Data(provider.getPendingPaymentForm4ModelResponse!.data);
      });
    }
  }

  // @override
  // void didChangeDependencies() {
  //   super.didChangeDependencies();
  //
  //   final provider = Provider.of<SalesModuleCommonApiProvider>(context);
  //
  //   // Check for Form 1 and Form 2 data and populate if not already done
  //   if (!_isForm1DataInitialized && widget.initialLeadData != null && provider.getSalesManagementSheetForm1ModelResponse != null) {
  //     if (provider.getSalesManagementSheetForm1ModelResponse?.data?.success ?? false) {
  //       _isForm1DataInitialized = true;
  //       _populateForm1Data(provider.getSalesManagementSheetForm1ModelResponse?.data);
  //     }
  //   }
  //
  //   if (!_isForm2DataInitialized && widget.initialLeadData != null && provider.getSalesManagementSheetForm2ModelResponse != null) {
  //     if (provider.getSalesManagementSheetForm2ModelResponse?.data?.success ?? false) {
  //       _isForm2DataInitialized = true;
  //       _populateForm2Data(provider.getSalesManagementSheetForm2ModelResponse?.data);
  //     }
  //   }
  //
  //   // Handle Form 3 data population specifically
  //   final form4ApiResponse = provider.getPendingPaymentForm4ModelResponse;
  //   final bool shouldPopulateForm3 = _currentStep == 2 &&
  //       form4ApiResponse != null &&
  //       (form4ApiResponse.data?.data?.result != null) &&
  //       (form4ApiResponse.success ?? false) &&
  //       !_isForm3DataInitialized; // Use a new flag to prevent repeated calls
  //
  //   if (shouldPopulateForm3) {
  //     _isForm3DataInitialized = true;
  //     WidgetsBinding.instance.addPostFrameCallback((_) {
  //       _populateForm3Data(form4ApiResponse.data);
  //     });
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: true,
      appBar: DefaultCommonAppBar(
        activityName: "Sheet Management",
        backgroundColor: AppColors.primary,
      ),
      body: Consumer<SalesModuleCommonApiProvider>(
        builder: (context, provider, child) {
          final form1 = provider.getSalesManagementSheetForm1ModelResponse;
          final form2 = provider.getSalesManagementSheetForm2ModelResponse;
          final form4ApiResponse = provider.getPendingPaymentForm4ModelResponse;

          // if (widget.initialLeadData != null && _companyNameController.text.isEmpty) {
          //   _populateForm1Data(form1?.data);
          //   _populateForm2Data(form2?.data);
          // }

          // if (_currentStep == 2 &&  (form4ApiResponse?.data?.data!.result !=null) &&  (form4ApiResponse?.success ?? false)) {
          //   _populateForm3Data(form4ApiResponse!.data); // Assert non-null for .data as we've checked for status and success
          // }

          if (provider.isLoading ?? true) {
            return const Center(child: LoadingIndicatorUtils());
          }

          return Column(
            children: [
              CustomStepperWidget(
                currentStep: _currentStep,
                stepTitles: stepTitles,
              ),
              StepHeaderWidget(
                currentStep: _currentStep,
                stepTitles: stepTitles,
              ),
              Expanded(
                child: SafeArea(
                  child: SingleChildScrollView(
                    padding: ResponsiveHelper.paddingAll(context, 16),
                    child: _buildCurrentStepContent(),
                  ),
                ),
              ),
              if (!(provider.isLoading ?? true))
                Container(
                  padding: ResponsiveHelper.paddingAll(context, 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border(top: BorderSide(color: Colors.grey[200]!)),
                  ),
                  child: Row(
                    children: [
                      if (_currentStep != 0)
                        Expanded(
                          child: CustomButton(
                            color: Colors.grey[600]!,
                            text: "Back",
                            // onPressed: () => setState(() => _currentStep--),
                            onPressed: () {
                              setState(() {
                                _currentStep--;
                              });
                              // 🔙 Load data for the previous step
                              _loadStepData(_currentStep);
                            },
                          ),
                        ),
                      ResponsiveHelper.sizedBoxWidth(context, 10),
                      Expanded(
                        child: CustomButton(
                          color: Colors.black,
                          text: _getButtonText(provider),
                          onPressed: () => _handleNextButtonPress(provider),
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

  @override
  void dispose() {
    _companyNameController.dispose();
    _concernPersonNameController.dispose();
    _concernPersonDesignationController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _remarkController.dispose();
    _projectDetailController.dispose();
    _clientRatingController.dispose();
    _clientProfileCommentController.dispose();
    _expectedBusinessSizeController.dispose();
    _briefingAtController.dispose();
    _clientNameController.dispose();
    _preSalesCompanyNameController.dispose();
    _projectNameController.dispose();
    _productNameController.dispose();
    _clientRequirementsController.dispose();
    _clientProfileController.dispose();
    _clientBehaviourController.dispose();
    _discussionDoneController.dispose();
    _instructionsRecceController.dispose();
    _instructionsDesignController.dispose();
    _instructionsInstallationController.dispose();
    _instructionsOtherController.dispose();
    _totalAmountController.dispose();
    _discountController.dispose();
    _totalPaidController.dispose();
    _paymentRemarksController.dispose();
    _methodController.dispose();
    super.dispose();
  }
}