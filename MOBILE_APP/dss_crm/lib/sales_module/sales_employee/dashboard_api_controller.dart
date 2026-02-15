import 'package:dio/dio.dart';
import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/sales_module/sales_employee/model/sales_employee_dashboard_data_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_add_client_briefing_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_assigned_lead_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_client_briefing_list_model.dart';
import 'package:dss_crm/sales_module/common/screen/base_dashboard_screen.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:flutter/material.dart';
import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';

class SalesEmpDashboardApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;


  ApiResponse<SalesEmployeeDashboardDataModelResposne>? _getSalesEmployeeDashbaordDataModel;
  ApiResponse<SalesEmployeeDashboardDataModelResposne>? get getSalesEmployeeDashbaordDataModel => _getSalesEmployeeDashbaordDataModel;

  Future<void> getSalesEmpDashboardData(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final salesEmployeeId = await StorageHelper().getLoginUserId();
      final response = await _repository.salesEmpDashboardData(salesEmployeeId);
      _getSalesEmployeeDashbaordDataModel = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load leads!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSalesEmployeeDashbaordDataModel = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

}
