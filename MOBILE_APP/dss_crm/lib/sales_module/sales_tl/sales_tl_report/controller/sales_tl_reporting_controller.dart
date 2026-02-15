import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/model/sales_tl_add_morning_evening_reporting_model.dart';
import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/model/sales_tl_morning_evening_reporting_list_model.dart';
import 'package:dss_crm/sales_module/common/screen/base_dashboard_screen.dart';
import 'package:dss_crm/sales_module/utils/get_roles_names.dart';
import 'package:flutter/material.dart';

import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../../../../utils/storage_util.dart';

class SalesTLReportingApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  ApiResponse<SalesTLAddMorningEveningReportingModelResponse>? _addSalesTlReportingModelResponse;
  ApiResponse<SalesTLAddMorningEveningReportingModelResponse>? get addSalesTlReportingModelResponse => _addSalesTlReportingModelResponse;

  ApiResponse<SalesTLMorningEveningReportingListModelResponse>? _salesTlReportingListModelResponse;
  ApiResponse<SalesTLMorningEveningReportingListModelResponse>? get salesTlReportingListModelResponse => _salesTlReportingListModelResponse;


  Future<void> addSalesTLReporting(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final salesTlId = await StorageHelper().getLoginUserId();
      final response = await _repository.addSalesTlReporting(body,salesTlId);
      _addSalesTlReportingModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Add Sales TL Successful!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        final role = await StorageHelper().getLoginRole();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole:role)),
          // MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: UserRoles.salesTL)),
        );

      } else {
        debugPrint("Add Sales TL Report  failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Add Sales TL failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Add Sales TL Report Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }

  }

  Future<void> getAllSalesTlReportingList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final userId = await StorageHelper().getLoginUserId();
      final response = await _repository.getAllSalesTLReportingList(userId);
      _salesTlReportingListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load Sales TL Reporting!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _salesTlReportingListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

}
