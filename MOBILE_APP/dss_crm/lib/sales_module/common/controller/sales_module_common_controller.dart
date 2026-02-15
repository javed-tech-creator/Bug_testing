import 'package:dio/dio.dart';
import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/sales_module/common/model/get_our_lead_list_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_emp_client_briefing_form_list_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_1_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_2_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_3_payment_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_4_pending_payment_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_assigned_lead_model.dart';
import 'package:dss_crm/sales_module/sales_tl/employee/employee_list_model.dart';
import 'package:flutter/material.dart';
import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../../../utils/storage_util.dart';

class SalesModuleCommonApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  ApiResponse<SalesEmpClientBriefingFormListModelResponse>? _getAllTLHODSalesInFormLeadListModelResponse;
  ApiResponse<SalesEmpClientBriefingFormListModelResponse>? get getListLeadModelResponse => _getAllTLHODSalesInFormLeadListModelResponse;

  ApiResponse<SalesManagementSheetShowForm1DetailsModelReponse>? _getSalesManagementSheetForm1ModelResponse;
  ApiResponse<SalesManagementSheetShowForm1DetailsModelReponse>? get getSalesManagementSheetForm1ModelResponse => _getSalesManagementSheetForm1ModelResponse;

  ApiResponse<SalesManagementSheetShowForm2DetailsModelReponse>? _getSalesManagementSheetForm2ModelResponse;
  ApiResponse<SalesManagementSheetShowForm2DetailsModelReponse>? get getSalesManagementSheetForm2ModelResponse => _getSalesManagementSheetForm2ModelResponse;

  ApiResponse<AddPaymentForm3ModelReponse>? _addSalesManagementSheetForm3PaymentModelResponse;
  ApiResponse<AddPaymentForm3ModelReponse>? get addSalesManagementSheetForm3PaymentModelResponse => _addSalesManagementSheetForm3PaymentModelResponse;

  ApiResponse<PendingPaymentForm4ModelReponse>? _getPendingPaymentForm4ModelResponse;
  ApiResponse<PendingPaymentForm4ModelReponse>? get getPendingPaymentForm4ModelResponse => _getPendingPaymentForm4ModelResponse;

  ApiResponse<GetAllSalesEmpAssignedLeadsListModelResponse>? _getOurLeadListModelResponse;
  ApiResponse<GetAllSalesEmpAssignedLeadsListModelResponse>? get getOurLeadListModelResponse => _getOurLeadListModelResponse;


  ApiResponse<GetAllEmployeeListModelResponse>? _getAllEmployeeListModel;
  ApiResponse<GetAllEmployeeListModelResponse>? get getAllEmployeeListModel => _getAllEmployeeListModel;



  /// **************** this is the api that show aal the client brefing project location link wali
  ///
  // Future<void> getAllSalesInFormLeadList(BuildContext context) async {
  //   _isLoading = true;
  //   notifyListeners();
  //
  //   try {
  //     final response = await _repository.getAllSalesInFormList();
  //     _getAllTLHODSalesInFormLeadListModelResponse = response;
  //     if (!response.success) {
  //       CustomSnackbarHelper.customShowSnackbar(
  //         context: context,
  //         message: response.message ?? 'Failed to load leads!',
  //         backgroundColor: Colors.red,
  //       );
  //     }
  //   } catch (e) {
  //     _getAllTLHODSalesInFormLeadListModelResponse = ApiResponse.error("Something went wrong: $e");
  //   } finally {
  //     _isLoading = false;
  //     notifyListeners();
  //   }
  // }

  /// **************** this is the api that show aal the client brefing project location link wali
  Future<void> getAllSalesInFormLeadList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final userId = await StorageHelper().getLoginUserId();

      final response = await _repository.getAllSalesInFormList(userId);
      _getAllTLHODSalesInFormLeadListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllTLHODSalesInFormLeadListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getSalesManagementSheetForm1Data(BuildContext context,leadID) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getSalesManagementSheetForm1Data(leadID);
      _getSalesManagementSheetForm1ModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSalesManagementSheetForm1ModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getSalesManagementSheetForm2Data(BuildContext context,leadID) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getSalesManagementSheetForm2Data(leadID);
      _getSalesManagementSheetForm2ModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSalesManagementSheetForm2ModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addSalesManagementSheetForm3Payment(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addSalesManagementSheetform3Payment(body);
      _addSalesManagementSheetForm3PaymentModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Initial Payment Successful!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );

      } else {
        debugPrint("Initial Payment failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Initial Payment failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Initial Payment Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> updateSalesManagementSheetForm3Payment(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateSalesManagementSheetform3Payment(body);
      _addSalesManagementSheetForm3PaymentModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Initial Payment Successful!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );

      } else {
        debugPrint("Initial Payment failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Initial Payment failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Initial Payment Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> getPendingPaymentForm4Data(BuildContext context,projectId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getPendingPaymentForm4Data(projectId);
      _getPendingPaymentForm4ModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getPendingPaymentForm4ModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  Future<void> getOurLeadList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final salesTlId = await StorageHelper().getLoginUserId();
      final response = await _repository.getOurLeadList(salesTlId);
      _getOurLeadListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getOurLeadListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  Future<void> getAllEmpList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final salesTlId = await StorageHelper().getLoginUserId();
      final response = await _repository.getAllEmployeeList();
      _getAllEmployeeListModel = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load Data!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllEmployeeListModel = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

}
