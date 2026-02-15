import 'package:dio/dio.dart';
import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_add_client_briefing_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_assigned_lead_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_client_briefing_list_model.dart';
import 'package:dss_crm/sales_module/common/screen/base_dashboard_screen.dart';
import 'package:dss_crm/sales_module/utils/get_roles_names.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:flutter/material.dart';
import '../../../../network_manager/api_response.dart';
import '../../../../auth/model/login_model.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../../../sales_hod/lead/model/sales_hod_lead_list_model.dart';

class SalesEmpClientBriefingApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;


  ApiResponse<GetAllSalesEmpAssignedLeadsListModelResponse>? _getSalesEmpAssignedLeadListModelResponse;
  ApiResponse<GetAllSalesEmpAssignedLeadsListModelResponse>? get getListLeadModelResponse => _getSalesEmpAssignedLeadListModelResponse;

  ApiResponse<SalesEmpAddClientBriefingModel>? _addSalesEmpClietnBriefingModelResponse;
  ApiResponse<SalesEmpAddClientBriefingModel>? get addSalesEmpClientBriefingModel => _addSalesEmpClietnBriefingModelResponse;

  ApiResponse<GetAllSalesEmpClientBriefingListModelResponse>? _getSalesEmpClientBreifingListLeadModelResponse;
  ApiResponse<GetAllSalesEmpClientBriefingListModelResponse>? get getSalesEmpClientBreifingListLeadModelResponse => _getSalesEmpClientBreifingListLeadModelResponse;


  Future<void> getAllSalesEmpLeadList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final salesEmployeeId = await StorageHelper().getLoginUserId();
      final response = await _repository.getAllSalesEmpAssignedLeads(salesEmployeeId);
      _getSalesEmpAssignedLeadListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSalesEmpAssignedLeadListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addSalesEmpClientBriefing(BuildContext context,FormData  formDataBody) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addSalesEmpClientBriefing(formDataBody);
      _addSalesEmpClietnBriefingModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Sales Client Briefing Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        final roles = await StorageHelper().getLoginRole();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: roles)),
          // MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: UserRoles.SaleEmployee)),
        );

      } else {
        debugPrint("Sales Client Briefing Created Failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Sales Client Briefing Created Failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Sales Client Briefing Created Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> getAllSalesClientBriefingList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllSalesEmpClientBriefingList();
      _getSalesEmpClientBreifingListLeadModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load Sale Client Briefing!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSalesEmpClientBreifingListLeadModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

}
