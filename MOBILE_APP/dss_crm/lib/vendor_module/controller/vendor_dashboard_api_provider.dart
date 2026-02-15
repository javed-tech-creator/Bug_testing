import 'package:dio/dio.dart';
import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/vendor_module/model/bank_details/bank_details_list_model.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_categories_list_model.dart';
import 'package:dss_crm/vendor_module/model/dashboard/recent_order_list_model.dart';
import 'package:dss_crm/vendor_module/model/dashboard/top_card_model.dart';
import 'package:dss_crm/vendor_module/model/dashboard/vendor_dashboard_chart_model.dart';
import 'package:dss_crm/vendor_module/model/drafts/darft_list_model.dart';
import 'package:dss_crm/vendor_module/model/drafts/single_darft_details_model.dart';
import 'package:flutter/material.dart';
import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';


class VendorDashboardApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  ApiResponse<VendorDashboardTopCardDataModelResponse>? _getVendorDashboardTopCardDataModelResponse;
  ApiResponse<VendorDashboardTopCardDataModelResponse>? get getVendorDashboardTopCardDataModelResponse => _getVendorDashboardTopCardDataModelResponse;

  ApiResponse<VendorDashboardChartDataModelResponse>? _getVendorDashboardChartDataModelResponse;
  ApiResponse<VendorDashboardChartDataModelResponse>? get getVendorDashboardChartDataModelResponse => _getVendorDashboardChartDataModelResponse;

  ApiResponse<VendorRecentOrderModelResponse>? _getVendorDashboardRecentOrderModelResponse;
  ApiResponse<VendorRecentOrderModelResponse>? get getVendorDashboardRecentOrderModelResponse => _getVendorDashboardRecentOrderModelResponse;

  ApiResponse<VendorBankDetailListModelResponse>? _getVendorBankDetailListModelResponse;
  ApiResponse<VendorBankDetailListModelResponse>? get getVendorBankDetailListModelResponse => _getVendorBankDetailListModelResponse;

  ApiResponse<VendorInvoiceDraftListModelResponse>? _getVendorDraftListModelResponse;
  ApiResponse<VendorInvoiceDraftListModelResponse>? get getVendorDraftListModelResponse => _getVendorDraftListModelResponse;

  ApiResponse<VendorSingleInvoiceDraftModelResponse>? _getVendorSingleDraftDetailModelResponse;
  ApiResponse<VendorSingleInvoiceDraftModelResponse>? get getVendorSingleDraftDetailModelResponse => _getVendorSingleDraftDetailModelResponse;


  Future<void> getVendorDashboardData(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getVendorDashboardData();
      _getVendorDashboardTopCardDataModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load categories!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getVendorDashboardTopCardDataModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getVendorDashboardChartData(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getVendorDashboardChartData();
      _getVendorDashboardChartDataModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load categories!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getVendorDashboardChartDataModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllVendorRecentOrderList(BuildContext context , page , limit) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getAllVendorRecentOrderList(page, limit);
      _getVendorDashboardRecentOrderModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load recent orders!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getVendorDashboardRecentOrderModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getVendorBankDetailList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getVendorBankDetailList();
      _getVendorBankDetailListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load categories!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getVendorBankDetailListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// DRAFT API

  Future<void> getVendorDraftList(BuildContext context ,   int page ,   int limit, String? startDate, String? endDate) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getAllVendorInvoiceDraftList(page, limit ,startDate ?? "" ,endDate ??"" );
      _getVendorDraftListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load recent orders!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getVendorDraftListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getVendorSingleDraftDetail(BuildContext context , String draftId) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getSingleInvoiceDraftDetail(draftId);
      _getVendorSingleDraftDetailModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load categories!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getVendorSingleDraftDetailModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }



}
