import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/tech_module/common/tech_base_dashboard_screen.dart';
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
import '../../../utils/storage_util.dart';


class TechManagerApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  ApiResponse<TechMangerAssetsListModelResponse>? _getAllTechAssetsListModelResponse;
  ApiResponse<TechMangerAssetsListModelResponse>? get getAllTechAssetsListModelResponse => _getAllTechAssetsListModelResponse;

  ApiResponse<TechMangerAddAssetModelResponse>? _addTechAssetsModelResponse;
  ApiResponse<TechMangerAddAssetModelResponse>? get addTechAssetsModelResponse => _addTechAssetsModelResponse;

  ApiResponse<TechMangerUpdateAssetModelResponse>? _updateTechAssetsModelResponse;
  ApiResponse<TechMangerUpdateAssetModelResponse>? get updateTechAssetsModelResponse => _updateTechAssetsModelResponse;

  ApiResponse<SingleMessageModelResponse>? _deleteTechAssetsModelResponse;
  ApiResponse<SingleMessageModelResponse>? get deleteTechAssetsModelResponse => _deleteTechAssetsModelResponse;

  ApiResponse<TechMangerAssetAssignedModelResponse>? _assignTechAssetsModelResponse;
  ApiResponse<TechMangerAssetAssignedModelResponse>? get assignTechAssetsModelResponse => _assignTechAssetsModelResponse;

  ApiResponse<TechLicenceListModelResponse>? _getAllTechLicenceSoftwareListModelResponse;
  ApiResponse<TechLicenceListModelResponse>? get getAllTechLicenceSoftwareListModelResponse => _getAllTechLicenceSoftwareListModelResponse;

  ApiResponse<TechMangerAddLicenceSoftwareModelResponse>? _addTechLicenceSoftwareModelResponse;
  ApiResponse<TechMangerAddLicenceSoftwareModelResponse>? get addTechLicenceSoftwareModelResponse => _addTechLicenceSoftwareModelResponse;

  ApiResponse<TechMangerUpdateLicenceSoftwareModelResponse>? _updateTechLicenseModelResponse;
  ApiResponse<TechMangerUpdateLicenceSoftwareModelResponse>? get updateTechLicenseModelResponse => _updateTechLicenseModelResponse;

  ApiResponse<SingleMessageModelResponse>? _deleteTechLicenseModelResponse;
  ApiResponse<SingleMessageModelResponse>? get deleteTechLicenseModelResponse => _deleteTechLicenseModelResponse;

  ApiResponse<TechMangerAssignLicenceSoftwareModelResponse>? _assignTechLicenseModelResponse;
  ApiResponse<TechMangerAssignLicenceSoftwareModelResponse>? get assignTechLicenseModelResponse => _assignTechLicenseModelResponse;

  ApiResponse<TechAllDevicesListModelResponse>? _getAllTechDeviceListModelResponse;
  ApiResponse<TechAllDevicesListModelResponse>? get getAllTechDeviceListModelResponse => _getAllTechDeviceListModelResponse;

  ApiResponse<TechAddNewDeviceModelResponse>? _addTechNewDeviceModelResponse;
  ApiResponse<TechAddNewDeviceModelResponse>? get addTechNewDeviceModelResponse => _addTechNewDeviceModelResponse;

  ApiResponse<TechUpdateDeviceModelResponse>? _updateTechDeviceModelResponse;
  ApiResponse<TechUpdateDeviceModelResponse>? get updateTechDeviceModelResponse => _updateTechDeviceModelResponse;

  ApiResponse<SingleMessageModelResponse>? _deleteTechDeviceModelResponse;
  ApiResponse<SingleMessageModelResponse>? get deleteTechDeviceModelResponse => _deleteTechDeviceModelResponse;

  ApiResponse<TechVendorAMCListModelResponse>? _getAllTechVendorAMCListModelResponse;
  ApiResponse<TechVendorAMCListModelResponse>? get getAllTechVendorAMCListModelResponse => _getAllTechVendorAMCListModelResponse;

  ApiResponse<AddNewTechVendorAMCModelResponse>? _addTechNewVendorAMCModelResponse;
  ApiResponse<AddNewTechVendorAMCModelResponse>? get addTechNewVendorAMCModelResponse => _addTechNewVendorAMCModelResponse;

  ApiResponse<UpdateTechVendorAMCModelResponse>? _updateTechVendorAMCModelResponse;
  ApiResponse<UpdateTechVendorAMCModelResponse>? get updateTechVendorAMCModelResponse => _updateTechVendorAMCModelResponse;

  ApiResponse<SingleMessageModelResponse>? _deleteTechVendorAMCModelResponse;
  ApiResponse<SingleMessageModelResponse>? get deleteTechVendorAMCModelResponse => _deleteTechVendorAMCModelResponse;

  ApiResponse<TechDataSecurityAccessListModelResponse>? _getAllTechAccessControlListModelResponse;
  ApiResponse<TechDataSecurityAccessListModelResponse>? get getAllTechAccessControlListModelResponse => _getAllTechAccessControlListModelResponse;

  ApiResponse<TechAddAccessCotrolModelResponse>? _addTechNewAccessControlModelResponse;
  ApiResponse<TechAddAccessCotrolModelResponse>? get addTechNewAccessControlModelResponse => _addTechNewAccessControlModelResponse;

  ApiResponse<TechUpdateAccessControlModelResponse>? _updateTechAccessControlModelResponse;
  ApiResponse<TechUpdateAccessControlModelResponse>? get updateTechAccessControlModelResponse => _updateTechAccessControlModelResponse;

  ApiResponse<SingleMessageModelResponse>? _deleteTechAccessControlModelResponse;
  ApiResponse<SingleMessageModelResponse>? get deleteTechAccessControlModelResponse => _deleteTechAccessControlModelResponse;

  ApiResponse<TechRecokedAccessControlModelResponse>? _revokedTechAccessControlModelResponse;
  ApiResponse<TechRecokedAccessControlModelResponse>? get revokedTechAccessControlModelResponse => _revokedTechAccessControlModelResponse;

  ApiResponse<TechIHelpDeskAndTicketingModelResponse>? _getAllTechMangerTicketListModelResponse;
  ApiResponse<TechIHelpDeskAndTicketingModelResponse>? get getAllTechMangerTicketListModelResponse => _getAllTechMangerTicketListModelResponse;

  ApiResponse<UpdateAssignTicketMOdelResonse>? _updateAssignTicketModelResponse;
  ApiResponse<UpdateAssignTicketMOdelResonse>? get updateAssignTicketModelResponse => _updateAssignTicketModelResponse;

  ApiResponse<UpdateTicketStatusModelResponse>? _updateAssignStatusModelResponse;
  ApiResponse<UpdateTicketStatusModelResponse>? get updateAssignStatusModelResponse => _updateAssignStatusModelResponse;

  ApiResponse<TechMangerDashboardTopCardDataModelResponse>? _getTechManagerDashboardTopCardDataModelResponse;
  ApiResponse<TechMangerDashboardTopCardDataModelResponse>? get getTechManagerDashboardTopCardDataModelResponse => _getTechManagerDashboardTopCardDataModelResponse;

  ApiResponse<TechMangerDashboardPicChartDataModelResponse>? _getTechManagerDashboardChartDataModelResponse;
  ApiResponse<TechMangerDashboardPicChartDataModelResponse>? get getTechManagerDashboardChartDataModelResponse => _getTechManagerDashboardChartDataModelResponse;

  ApiResponse<TechMangerDashboardBarChartDataModelResponse>? _getTechManagerDashboardBarGraphDataModelResponse;
  ApiResponse<TechMangerDashboardBarChartDataModelResponse>? get getTechManagerDashboardBarGraphDataModelResponse => _getTechManagerDashboardBarGraphDataModelResponse;


  Future<void> getAllTechAssetsList(BuildContext context,int page , int limit) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllTechAssetsList(queryParameters);
      _getAllTechAssetsListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load assets!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllTechAssetsListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addTechAssets(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addTechAssets(body);
      _addTechAssetsModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Assets Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        final roles = await StorageHelper().getLoginRole();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => TechBaseDashboardScreen(userRole: roles)),
          // MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: UserRoles.SaleEmployee)),
        );

      } else {
        debugPrint("Assets Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Assets Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Assets Added Exception: $e");
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

  Future<void> deleteTechAssets(BuildContext context,String assetId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.deleteTechAssets(assetId);
      _deleteTechAssetsModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Assets Deleted Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        // final roles = await StorageHelper().getLoginRole();
        // Navigator.pushReplacement(
        //   context,
        //   MaterialPageRoute(builder: (context) => TechBaseDashboardScreen(userRole: roles)),
        //   // MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: UserRoles.SaleEmployee)),
        // );

      } else {
        debugPrint("Assets Deleted failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Assets Deleted failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Assets Deleted Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> assetAssign(BuildContext context,Map<String, dynamic> body , String assignId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.assigAsset(assignId , body);
      _assignTechAssetsModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Asset Assigned Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Asset Assigned failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Asset Assigned failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Assets Assigned Exception: $e");
    } finally {
      Navigator.pop(context, false);
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

  Future<void> getAllTechLicenceSoftwareList(BuildContext context,int page , int limit) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllTechLicenceSoftwareList(queryParameters);
      _getAllTechLicenceSoftwareListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load assets!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllTechLicenceSoftwareListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addTechLicenceSoftware(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addTechLicenceSoftware(body);
      _addTechLicenceSoftwareModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Assets Added Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "License Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        final roles = await StorageHelper().getLoginRole();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => TechBaseDashboardScreen(userRole: roles)),
          // MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: UserRoles.SaleEmployee)),
        );

      } else {
        debugPrint("Assets Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Assets Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Assets Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateTechLicenseSoftware(BuildContext context,Map<String, dynamic> body,String licenseId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateTechLicenceSoftware(body,licenseId);
      _updateTechLicenseModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "License Updated Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "License Updated Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("License Updated failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'License Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("License Updated Exception: $e");
      Navigator.pop(context, false);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteTechLicensesWithoutNavigation(BuildContext context, String licenseId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteLicenseSoftware(licenseId);
      _deleteTechLicenseModelResponse = response;

      if (!response.success) {
        debugPrint("License Delete failed: ${response.message}");
      }
    } catch (e, stackTrace) {
      debugPrint("License Delete Exception: $e");
      _deleteTechLicenseModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> assignTechLicenseSoftware(BuildContext context,Map<String, dynamic> body , String licenseId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.assigLicenseSoftware(licenseId , body);
      _assignTechLicenseModelResponse = response;

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
        // Navigator.pop(context, false);
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
      // Navigator.pop(context, false);
      _isLoading = false;
      notifyListeners();
    }
  }


/////////////////////////// NETWORK AND INFRASTRUCTURE /////////////////////////

  Future<void> getAllTechDeviceList(BuildContext context,int page , int limit) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllTechDevicesList(queryParameters);
      _getAllTechDeviceListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load device!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllTechDeviceListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addTechNewDevice(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addNewTechDevice(body);
      _addTechNewDeviceModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Assets Added Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Device Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        final roles = await StorageHelper().getLoginRole();
        Navigator.pop(context);
        // Navigator.pushReplacement(
        //   context,
        //   MaterialPageRoute(builder: (context) => TechBaseDashboardScreen(userRole: roles)),
        //   // MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: UserRoles.SaleEmployee)),
        // );

      } else {
        debugPrint("Device Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Device Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Device Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateTechDevice(BuildContext context,Map<String, dynamic> body,String licenceSoftwareId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateTechDevice(body,licenceSoftwareId);
      _updateTechDeviceModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "License Updated Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Device Updated Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Device Updated failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Device Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Device Updated Exception: $e");
      Navigator.pop(context, false);
    } finally {
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



/////////////////////////// VENDOR AND AMC MANAGEMENT /////////////////////////

  Future<void> getAllTechAMCList(BuildContext context,int page , int limit) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllVendorAMCList(queryParameters);
      _getAllTechVendorAMCListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load list!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllTechVendorAMCListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addTechNewVendorAMC(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addNewTechAMC(body);
      _addTechNewVendorAMCModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Assets Added Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "AMC Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context);
        // Navigator.pushReplacement(
        //   context,
        //   MaterialPageRoute(builder: (context) => TechBaseDashboardScreen(userRole: roles)),
        //   // MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: UserRoles.SaleEmployee)),
        // );

      } else {
        debugPrint("AMC Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'AMC Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("AMC Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateTechVendorAMC(BuildContext context,Map<String, dynamic> body,String licenceSoftwareId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateTechAMC(body,licenceSoftwareId);
      _updateTechVendorAMCModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "License Updated Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "AMC Updated Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("AMC Updated failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'AMC Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("AMC Updated Exception: $e");
      Navigator.pop(context, false);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteTechVendorAMCWithoutNavigation(BuildContext context, String lilcenceId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteTechAMC(lilcenceId);
      _deleteTechVendorAMCModelResponse = response;

      if (!response.success) {
        debugPrint("AMC Delete failed: ${response.message}");
      }
    } catch (e, stackTrace) {
      debugPrint("AMC Delete Exception: $e");
      _deleteTechVendorAMCModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

/////////////////////////// ACCESS CONTROL AND DATA SECURITY MANAGEMENT /////////////////////////

  Future<void> getAllTechAccessControlList(BuildContext context,int page , int limit) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllAccessControlList(queryParameters);
      _getAllTechAccessControlListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load list!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllTechAccessControlListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addTechNewAccessControl(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addNewTechAccessControl(body);
      _addTechNewAccessControlModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Assets Added Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Access Control Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context);
        // Navigator.pushReplacement(
        //   context,
        //   MaterialPageRoute(builder: (context) => TechBaseDashboardScreen(userRole: roles)),
        //   // MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: UserRoles.SaleEmployee)),
        // );

      } else {
        debugPrint("Access Control Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Access Control Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Access Control Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateTechAccessControl(BuildContext context,Map<String, dynamic> body,String accessControlId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateTechAccessControl(body,accessControlId);
      _updateTechAccessControlModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "License Updated Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Access Control Updated Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Access Control Updated failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Access Control Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Access Control Updated Exception: $e");
      Navigator.pop(context, false);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteTechAccessControlWithoutNavigation(BuildContext context, String accesscontrolId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteTechAccessControl(accesscontrolId);
      _deleteTechAccessControlModelResponse = response;

      if (!response.success) {
        debugPrint("Access Control Delete failed: ${response.message}");
      }
    } catch (e, stackTrace) {
      debugPrint("Access Control Delete Exception: $e");
      _deleteTechAccessControlModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> revokedTechAccessControl(BuildContext context,Map<String, dynamic> body,String accessControlId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.revokedAccessControl(accessControlId,body);
      _revokedTechAccessControlModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "License Updated Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Revoked Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        // Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Revoked failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Revoked failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Revoked Exception: $e");
      Navigator.pop(context, false);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


///////////////////////////  TICKETING SYSTEM  MANAGEMENT /////////////////////////

  Future<void> getAllTechMangerHelpDeskTicketList(BuildContext context,int page , int limit) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllMangerHelpDeskTicketList(queryParameters);
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

  Future<void> updateTicketStatus(BuildContext context,Map<String, dynamic> body , String ticketId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateTechTicketStatus(ticketId , body);
      _updateAssignStatusModelResponse = response;

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

  Future<void> getTechManagerDashboardTopCardData(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getTechManagerDashboardTopCardData();
      _getTechManagerDashboardTopCardDataModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load Data!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getTechManagerDashboardTopCardDataModelResponse = ApiResponse.error("Something went wrong: $e");
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
