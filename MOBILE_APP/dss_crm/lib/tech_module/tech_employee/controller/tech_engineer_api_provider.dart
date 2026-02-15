import 'dart:io';

import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/tech_module/common/tech_base_dashboard_screen.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_asset_list_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_assigned_ticket_list_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_assigned_ticket_update_status_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_dashbaord_top_card_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineerr_software_licence_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/dashboard/tech_manager_dashboad_bar_graph_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/dashboard/tech_manager_dashboad_pie_chart_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/dashboard/tech_manager_dashboad_top_card_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/data_security_access_controll/revoked_access_controll_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/data_security_access_controll/tech_add_new_access_control_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/data_security_access_controll/tech_data_access_control_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/data_security_access_controll/tech_update_access_control_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/help_desk_and_ticketing/tech_help_desk_ticketing_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/help_desk_ticket/tech_change_ticket_status_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/help_desk_ticket/update_tech_status_ticket_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/licence/tech_manager_add_licence_software_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/licence/tech_manager_assign_licence_software_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/licence/tech_manager_update_licence_software_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/network_infrastructure/tech_add_new_devices_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/network_infrastructure/tech_all_devices_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/network_infrastructure/tech_update_devices_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_add_assets_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_assets_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_assign_to_assets_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_licence_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_update_assets_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/vendor_amc_management/add_new_vendor_amc_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/vendor_amc_management/tech_vendor_amc_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/model/vendor_amc_management/update_vendor_amc_model.dart';
import 'package:dss_crm/vendor_module/model/bank_details/single_message_model.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_categories_list_model.dart';
import 'package:flutter/material.dart';
import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../../../utils/full_screen_loader_utiil.dart';
import '../../../utils/storage_util.dart';


class TechEngineerApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  ApiResponse<TechEngineerAssetsListModelResponse>? _getAllTechEngineerAssetsListModelResponse;
  ApiResponse<TechEngineerAssetsListModelResponse>? get getAllTechEngineerAssetsListModelResponse => _getAllTechEngineerAssetsListModelResponse;

  ApiResponse<TechMangerUpdateAssetModelResponse>? _updateTechAssetsModelResponse;
  ApiResponse<TechMangerUpdateAssetModelResponse>? get updateTechAssetsModelResponse => _updateTechAssetsModelResponse;

  ApiResponse<SingleMessageModelResponse>? _deleteTechAssetsModelResponse;
  ApiResponse<SingleMessageModelResponse>? get deleteTechAssetsModelResponse => _deleteTechAssetsModelResponse;

  ApiResponse<TechMangerAssetAssignedModelResponse>? _assignTechAssetsModelResponse;
  ApiResponse<TechMangerAssetAssignedModelResponse>? get assignTechAssetsModelResponse => _assignTechAssetsModelResponse;

  ApiResponse<TechEngineerLicenseSoftwareListModelResponse>? _getAllTechEngineerLicenceSoftwareListModelResponse;
  ApiResponse<TechEngineerLicenseSoftwareListModelResponse>? get getAllTechEngineerLicenceSoftwareListModelResponse => _getAllTechEngineerLicenceSoftwareListModelResponse;

  ApiResponse<SingleMessageModelResponse>? _deleteTechLicenseModelResponse;
  ApiResponse<SingleMessageModelResponse>? get deleteTechLicenseModelResponse => _deleteTechLicenseModelResponse;

  ApiResponse<SingleMessageModelResponse>? _deleteTechDeviceModelResponse;
  ApiResponse<SingleMessageModelResponse>? get deleteTechDeviceModelResponse => _deleteTechDeviceModelResponse;

  ApiResponse<TechEngineerAssignedTicketListModelResponse>? _getAllTechMangerTicketListModelResponse;
  ApiResponse<TechEngineerAssignedTicketListModelResponse>? get getAllTechEngineerTicketListModelResponse => _getAllTechMangerTicketListModelResponse;

  ApiResponse<UpdateAssignTicketMOdelResonse>? _updateAssignTicketModelResponse;
  ApiResponse<UpdateAssignTicketMOdelResonse>? get updateAssignTicketModelResponse => _updateAssignTicketModelResponse;

  ApiResponse<TechEngineerAssignedTicketUpdateStatusModelResponse>? _updateTechEngineerAssignStatusModelResponse;
  ApiResponse<TechEngineerAssignedTicketUpdateStatusModelResponse>? get updateTechEngineerAssignStatusModelResponse => _updateTechEngineerAssignStatusModelResponse;

  ApiResponse<TechEngineerDashboardTopCardModelResponse>? _getTechEngineerDashboardTopCardDataModelResponse;
  ApiResponse<TechEngineerDashboardTopCardModelResponse>? get getTechEngineerDashboardTopCardDataModelResponse => _getTechEngineerDashboardTopCardDataModelResponse;

  ApiResponse<TechMangerDashboardPicChartDataModelResponse>? _getTechManagerDashboardChartDataModelResponse;
  ApiResponse<TechMangerDashboardPicChartDataModelResponse>? get getTechManagerDashboardChartDataModelResponse => _getTechManagerDashboardChartDataModelResponse;

  ApiResponse<TechMangerDashboardBarChartDataModelResponse>? _getTechManagerDashboardBarGraphDataModelResponse;
  ApiResponse<TechMangerDashboardBarChartDataModelResponse>? get getTechManagerDashboardBarGraphDataModelResponse => _getTechManagerDashboardBarGraphDataModelResponse;


  Future<void> getAllTechEngineerAssetsList(BuildContext context,int page , int limit) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllTechEngineerAssetsList(queryParameters);
      _getAllTechEngineerAssetsListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load assets!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllTechEngineerAssetsListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateTechAssets(BuildContext context,Map<String, dynamic> body,String assetId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateTechAssets(body,assetId);
      _updateTechAssetsModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Asset Updated Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Asset Updated failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Asset Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Asset Updated Exception: $e");
      Navigator.pop(context, false);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteTechAssetsWithoutNavigation(BuildContext context, String assetId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteTechAssets(assetId);
      _deleteTechAssetsModelResponse = response;

      if (!response.success) {
        debugPrint("Assets Delete failed: ${response.message}");
      }
    } catch (e, stackTrace) {
      debugPrint("Assets Delete Exception: $e");
      _deleteTechAssetsModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> assetAssignWithoutNavigation(BuildContext context, Map<String, dynamic> body, String assignId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.assigAsset(assignId, body);
      _assignTechAssetsModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true
        //     ? response.data!.message!
        //     : "Asset Assigned Successfully!";

        final message = response.message != null && response.message!.isNotEmpty
            ? response.data!.message!
            : "Asset Assigned Successfully!";


        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
      } else {
        debugPrint("Asset Assignment failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Asset Assignment failed!',
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Asset Assignment Exception: $e");
      _assignTechAssetsModelResponse = ApiResponse.error("Something went wrong: $e");
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Something went wrong: $e",
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 2),
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /////////////////////  LICENCE AND SOFTWARE API CALL ////////////////////////////////////////

  Future<void> getAllTechEngineerLicenceSoftwareList(BuildContext context,int page , int limit) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllTechEngineerLicenceSoftwareList(queryParameters);
      _getAllTechEngineerLicenceSoftwareListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load assets!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllTechEngineerLicenceSoftwareListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllTechMangerHelpDeskTicketList(BuildContext context,int page , int limit) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllTechEngineerAssignedList(queryParameters);
      _getAllTechMangerTicketListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load list!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllTechMangerTicketListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateTechEngineerAssignedTicketStatus(BuildContext context,Map<String, dynamic> body , String ticketId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateTechEngineerAssignedTicketStatus(ticketId , body);
      _updateTechEngineerAssignStatusModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        // Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Updated failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Updated Exception: $e");
    } finally {
      Navigator.pop(context, false);
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteTechDeviceWithoutNavigation(BuildContext context, String lilcenceId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteTechDevice(lilcenceId);
      _deleteTechDeviceModelResponse = response;

      if (!response.success) {
        debugPrint("Device Delete failed: ${response.message}");
      }
    } catch (e, stackTrace) {
      debugPrint("Device Delete Exception: $e");
      _deleteTechLicenseModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> ticketRaisedByTechEngineer({
    required Map<String, File> documents,
    required String ticketType ,
    required String priority ,
    required String description ,
    required BuildContext context,
  }) async {
    // _isUploading = true;
    FullScreenLoader.show(context);
    _error = null;
    notifyListeners();

    try {
      var empId =await StorageHelper().getLoginUserId();

      final response = await _repository.ticketRaisedByTechEngineer(
        documents: documents,
        empId: empId, ticketType: ticketType, priority: priority, description: description,
      );

      if (response.success == true) {
        // ScaffoldMessenger.of(context).showSnackBar(
        //   SnackBar(content: Text("Documents uploaded successfully")),
        // );

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.green,
          message:response.data?.message ?? "Ticket Raised Successfully",
        );
        FullScreenLoader.hide(context);
      } else {
        _error = "Failed with status code: ${response.success}";
        // ScaffoldMessenger.of(context).showSnackBar(
        //   SnackBar(content: Text(_error!)),
        // );
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.red,
          message:response.data?.message ?? "Please select documents before update.",
        );
      }
    } catch (e) {
      _error = "Upload failed: ${e.toString()}";
      // ScaffoldMessenger.of(context).showSnackBar(
      //   SnackBar(content: Text(_error!)),
      // );

      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message:_error ?? "Please select documents before update.",
      );
    } finally {
      FullScreenLoader.hide(context);
      notifyListeners();
    }
  }

///////////////////////////  TICKETING SYSTEM  MANAGEMENT /////////////////////////


  Future<void> updateAssignTicket(BuildContext context,Map<String, dynamic> body , String ticketId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateTechAssignTicket(ticketId , body);
      _updateAssignTicketModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "License Assigned Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        // Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("License Assigned failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'License Assigned failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("License Assigned Exception: $e");
    } finally {
      Navigator.pop(context, false);
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getTechEngineerDashboardTopCardData(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final userId = await StorageHelper().getLoginUserId();
      final response = await _repository.getTechEngineerDashboardTopCardData(userId);
      _getTechEngineerDashboardTopCardDataModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load Data!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getTechEngineerDashboardTopCardDataModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getTechManagerDashboardChart(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getTechManagerDashboardChartData();
      _getTechManagerDashboardChartDataModelResponse = response;

      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load Chart!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getTechManagerDashboardChartDataModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getTechManagerDashboardBarGraph(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getTechManagerDashboardBarGraphData();
      _getTechManagerDashboardBarGraphDataModelResponse = response;

      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load Bar Graph!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getTechManagerDashboardBarGraphDataModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

}
