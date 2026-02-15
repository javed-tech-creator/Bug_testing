import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/sales_module/common/model/lead_assign_to_sales_emp_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_person_list_model.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/model/shared_common_lead_result_list_model.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/model/soles_pending_lead_list_model.dart';
import 'package:dss_crm/sales_module/sales_hod/screen/sales_hod_dashboard_screen.dart';
import 'package:dss_crm/sales_module/sales_tl/screen/sales_TL_lead_list_screen.dart';
import 'package:dss_crm/sales_module/common/screen/base_dashboard_screen.dart';
import 'package:dss_crm/sales_module/utils/get_roles_names.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:flutter/material.dart';

import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../model/sales_hod_add_lead_model.dart';
import '../model/sales_hod_lead_list_model.dart';

class SalesHODLeadApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;


  ApiResponse<AddLeadSalesHODModelResponse>? _addLeadModelResponse;
  ApiResponse<AddLeadSalesHODModelResponse>? get loginResponse => _addLeadModelResponse;
  ApiResponse<GetAllSalesHODLeadsListModelResponse>? _getListLeadModelResponse;
  ApiResponse<GetAllSalesHODLeadsListModelResponse>? get getListLeadModelResponse => _getListLeadModelResponse;
  ApiResponse<SalesEmpListModel>? _getSalesEmpModelResponse;
  ApiResponse<SalesEmpListModel>? get getSalesEmpModelResponse => _getSalesEmpModelResponse;
  ApiResponse<SalesLeadAssignToSalesEmpModel>? _leadAssignToSalesEmpModelResponse;
  ApiResponse<SalesLeadAssignToSalesEmpModel>? get leadAssignToSalesEmpModelResponse => _leadAssignToSalesEmpModelResponse;


  ApiResponse<GetAllSalesHODLeadsListModelResponse>? _pendingLeadListModelResponse;
  ApiResponse<GetAllSalesHODLeadsListModelResponse>? get getPendingLeadListModelResponse => _pendingLeadListModelResponse;

  Future<void> addLead(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addLead(body);
      _addLeadModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Add Lead successful!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        final role = await StorageHelper().getLoginRole();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) =>  BaseDashboardScreen(userRole: role)),
          // MaterialPageRoute(builder: (context) =>  BaseDashboardScreen(userRole: UserRoles.salesHOD)),
          // MaterialPageRoute(builder: (context) => const SalesHODDashboardScreen()),
        );

      } else {
        debugPrint("Add Lead failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Add Lead failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Add Lead Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> getAllLeads(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllLeads();
      _getListLeadModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getListLeadModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllPendingLeadList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllPendingLeadList();
      _pendingLeadListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load Pending leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _pendingLeadListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  /// Sales Person list API
  Future<void> getAllSalesPersonList(BuildContext context, String city, String zone) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllSalesPersonList(city , zone);
      _getSalesEmpModelResponse = response;

      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSalesEmpModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> leadAssignToSalesEmp(BuildContext context , Map<String, dynamic> requestBody,leadId , bool isReassign) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.assignLeadtoSalesEmp(requestBody, leadId);
      _leadAssignToSalesEmpModelResponse = response;

      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message:isReassign ?'Lead Re-Assigned to Sales Person!' :"Lead Assigned to Sales Person!",
        backgroundColor: Colors.green,
      );
      // ✅ Refresh lead list
      Navigator.pop(context);
      await getAllLeads(context);
      //
      // // ✅ Navigate back to SalesTLLeadListScreen
      // Navigator.pushAndRemoveUntil(
      //   context,
      //   MaterialPageRoute(builder: (_) => const SalesTLLeadListScreen()),
      //       (route) => false, // Remove all previous routes
      // );

      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load assign!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _leadAssignToSalesEmpModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  Future<bool> leadAssignToSalesEmpAccepted(BuildContext context , Map<String, dynamic> requestBody,leadId , bool isReassign) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.assignLeadtoSalesEmp(requestBody, leadId);
      _leadAssignToSalesEmpModelResponse = response;

      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message:isReassign ?'Lead Re-Assigned to Sales Person!' :"Lead Assigned to Sales Person!",
        backgroundColor: Colors.green,
      );
      // ✅ Refresh lead list
      // Navigator.pop(context);
      // await getAllLeads(context);
      //
      // // ✅ Navigate back to SalesTLLeadListScreen
      // Navigator.pushAndRemoveUntil(
      //   context,
      //   MaterialPageRoute(builder: (_) => const SalesTLLeadListScreen()),
      //       (route) => false, // Remove all previous routes
      // );

      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load assign!',
          backgroundColor: Colors.red,
        );
        return false;
      }
    } catch (e) {
      _leadAssignToSalesEmpModelResponse = ApiResponse.error("Something went wrong: $e");

      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
      return true;
    }
  }


}
