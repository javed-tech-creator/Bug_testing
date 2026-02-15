import 'package:dss_crm/admin/model/action_groups/create_action_group_model.dart';
import 'package:dss_crm/admin/model/action_groups/get_all_action_groups_by_department_id_model.dart';
import 'package:dss_crm/admin/model/action_groups/get_all_action_groups_list_model.dart';
import 'package:dss_crm/admin/model/action_groups/update_action_group_model.dart';
import 'package:dss_crm/admin/model/department/designation/get_all_designation_by_departmetn_id_model.dart';
import 'package:dss_crm/admin/model/department/get_all_branch_by_city_id_model.dart';
import 'package:dss_crm/admin/model/department/get_all_department_by_branch_id_model.dart';
import 'package:dss_crm/admin/model/location_model/branch/create_branch_model.dart';
import 'package:dss_crm/admin/model/location_model/branch/delete_branch_model.dart';
import 'package:dss_crm/admin/model/location_model/branch/get_all_branches_list_model.dart';
import 'package:dss_crm/admin/model/location_model/branch/update_branch_model.dart';
import 'package:dss_crm/admin/model/location_model/city/create_city_model.dart';
import 'package:dss_crm/admin/model/location_model/city/delete_city_model.dart';
import 'package:dss_crm/admin/model/location_model/city/get_all_city_list_model.dart';
import 'package:dss_crm/admin/model/location_model/city/get_city_by_state_model.dart';
import 'package:dss_crm/admin/model/location_model/city/update_city_model.dart';
import 'package:dss_crm/admin/model/location_model/state/create_state_model.dart';
import 'package:dss_crm/admin/model/location_model/state/delete_state_model.dart';
import 'package:dss_crm/admin/model/location_model/state/get_all_states_model.dart';
import 'package:dss_crm/admin/model/location_model/state/get_states_by_zone_model.dart';
import 'package:dss_crm/admin/model/location_model/state/update_state_model.dart';
import 'package:dss_crm/admin/model/location_model/zone/create_zone_model.dart';
import 'package:dss_crm/admin/model/location_model/zone/delete_zone_model.dart';
import 'package:dss_crm/admin/model/location_model/zone/get_all_zone_model.dart';
import 'package:dss_crm/admin/model/location_model/zone/update_zone_model.dart';
import 'package:dss_crm/admin/model/user_register/get_managed_list_by_designation_model.dart';
import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/tech_module/tech_manager/model/tech_manager_assets_list_model.dart';
import 'package:flutter/material.dart';
import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../model/department/create_branch_department_model.dart';
import '../model/department/delete_branch_department_model.dart';
import '../model/department/designation/create_designation_model.dart';
import '../model/department/designation/delete_designation_model.dart';
import '../model/department/designation/get_all_designation_list_model.dart';
import '../model/department/designation/update_designation_model.dart';
import '../model/department/get_all_branch_department_list_model.dart';
import '../model/department/update_branch_department_model.dart';


class AdminLocationApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  bool _isDeprtLoading = false;
  bool get isDeprtLoading => _isDeprtLoading;

  ApiResponse<GetAllZoneModelResponse>? _getAllZoneListModelResponse;
  ApiResponse<GetAllZoneModelResponse>? get getAllZoneListModelResponse => _getAllZoneListModelResponse;

  ApiResponse<CreateZoneModelResponse>? _createZoneModelResponse;
  ApiResponse<CreateZoneModelResponse>? get createZoneModelResponse => _createZoneModelResponse;

  ApiResponse<UpdateZoneModelResponse>? _updateZoneModelResponse;
  ApiResponse<UpdateZoneModelResponse>? get updateZoneModelResponse => _updateZoneModelResponse;

  ApiResponse<DeleteZoneModelResponse>? _deleteZoneModelResponse;
  ApiResponse<DeleteZoneModelResponse>? get deleteZoneModelResponse => _deleteZoneModelResponse;

  ApiResponse<GetAllStatesModelResponse>? _getAllStateListModelResponse;
  ApiResponse<GetAllStatesModelResponse>? get getAllStateListModelResponse => _getAllStateListModelResponse;

  ApiResponse<GetStateByZoneIdModelResponse>? _getAllStateByZoneIdModelResponse;
  ApiResponse<GetStateByZoneIdModelResponse>? get getAllStateByZoneIdModelResponse => _getAllStateByZoneIdModelResponse;

  ApiResponse<CreateStateModelResponse>? _createStateModelResponse;
  ApiResponse<CreateStateModelResponse>? get createStateModelResponse => _createStateModelResponse;

  ApiResponse<UpdateStateModelResponse>? _updateStateModelResponse;
  ApiResponse<UpdateStateModelResponse>? get updateStateModelResponse => _updateStateModelResponse;

  ApiResponse<DeleteStateModelResponse>? _deleteStateModelResponse;
  ApiResponse<DeleteStateModelResponse>? get deleteStateModelResponse => _deleteStateModelResponse;

  ApiResponse<GetAllCityListModelResponse>? _getAllCityListModelResponse;
  ApiResponse<GetAllCityListModelResponse>? get getAllCityListModelResponse => _getAllCityListModelResponse;

  ApiResponse<GetCityByStateIdModelResponse>? _getAllCityByStateIdModelResponse;
  ApiResponse<GetCityByStateIdModelResponse>? get getAllCityByStateIdModelResponse => _getAllCityByStateIdModelResponse;

  ApiResponse<CreateCityModelResponse>? _createCityModelResponse;
  ApiResponse<CreateCityModelResponse>? get createCityModelResponse => _createCityModelResponse;

  ApiResponse<UpdateCityModelResponse>? _updateCityModelResponse;
  ApiResponse<UpdateCityModelResponse>? get updateCityModelResponse => _updateCityModelResponse;

  ApiResponse<DeleteCityModelResponse>? _deleteCityModelResponse;
  ApiResponse<DeleteCityModelResponse>? get deleteCityModelResponse => _deleteCityModelResponse;

  ApiResponse<GetAllBranchListModelResponse>? _getAllBranchListModelResponse;
  ApiResponse<GetAllBranchListModelResponse>? get getAllBranchListModelResponse => _getAllBranchListModelResponse;

  ApiResponse<GetAllBranchByCityIdModelResponse>? _getAllBranchByCityIdModelResponse;
  ApiResponse<GetAllBranchByCityIdModelResponse>? get getAllBranchByCityIdModelResponse => _getAllBranchByCityIdModelResponse;

  ApiResponse<CreateBranchModelResponse>? _createBranchModelResponse;
  ApiResponse<CreateBranchModelResponse>? get createBranchModelResponse => _createBranchModelResponse;

  ApiResponse<UpdateBranchModelResponse>? _updateBranchModelResponse;
  ApiResponse<UpdateBranchModelResponse>? get updateBranchModelResponse => _updateBranchModelResponse;

  ApiResponse<DeleteBranchModelResponse>? _deleteBranchModelResponse;
  ApiResponse<DeleteBranchModelResponse>? get deleteBranchModelResponse => _deleteBranchModelResponse;

  ApiResponse<GetAllBranchDepartmentListModelResponse>? _getAllBranchDepartmentListModelResponse;
  ApiResponse<GetAllBranchDepartmentListModelResponse>? get getAllBranchDepartmentListModelResponse => _getAllBranchDepartmentListModelResponse;

  ApiResponse<GetAllDepartmentByBranchIdModelResponse>? _getAllDepartmentByBranchIdModelResponse;
  ApiResponse<GetAllDepartmentByBranchIdModelResponse>? get getAllDepartmentByBranchIdModelResponse => _getAllDepartmentByBranchIdModelResponse;

  ApiResponse<CreateBranchDepartmentModelResponse>? _createBranchDepartmentModelResponse;
  ApiResponse<CreateBranchDepartmentModelResponse>? get createBranchDepartmentModelResponse => _createBranchDepartmentModelResponse;

  ApiResponse<UpdateBranchDepartmentModelResponse>? _updateBranchDepartmentModelResponse;
  ApiResponse<UpdateBranchDepartmentModelResponse>? get updateBranchDepartmentModelResponse => _updateBranchDepartmentModelResponse;

  ApiResponse<DeleteBranchDepartmentModelResponse>? _deleteBranchDepartmentModelResponse;
  ApiResponse<DeleteBranchDepartmentModelResponse>? get deleteBranchDepartmentModelResponse => _deleteBranchDepartmentModelResponse;

  ApiResponse<GetAllDesignationListModelResponse>? _getAllDesignationListModelResponse;
  ApiResponse<GetAllDesignationListModelResponse>? get getAllDesignationListModelResponse => _getAllDesignationListModelResponse;

  ApiResponse<GetAllDesignationByDepartmetIdModelResponse>? _getAllDesignationByDepartmentIdModelResponse;
  ApiResponse<GetAllDesignationByDepartmetIdModelResponse>? get getAllDesignationByDepartmentIdModelResponse => _getAllDesignationByDepartmentIdModelResponse;

  ApiResponse<GetAllManagedByListByDesignationModelResponse>? _getAllManagedByListByDesignationModelResponse;
  ApiResponse<GetAllManagedByListByDesignationModelResponse>? get getAllManagedByListByDesignationModelResponse => _getAllManagedByListByDesignationModelResponse;

  ApiResponse<CreateDesignationModelResponse>? _createDesignationModelResponse;
  ApiResponse<CreateDesignationModelResponse>? get createDesignationModelResponse => _createDesignationModelResponse;

  ApiResponse<UpdateDesignationModelResponse>? _updateDesignationModelResponse;
  ApiResponse<UpdateDesignationModelResponse>? get updateDesignationModelResponse => _updateDesignationModelResponse;

  ApiResponse<DeleteDesignationModelResponse>? _deleteDesignationModelResponse;
  ApiResponse<DeleteDesignationModelResponse>? get deleteDesignationModelResponse => _deleteDesignationModelResponse;

  ApiResponse<GetAllActionGroupsListModelResponse>? _getAllActionGroupListModelResponse;
  ApiResponse<GetAllActionGroupsListModelResponse>? get getAllActionGroupListModelResponse => _getAllActionGroupListModelResponse;

  ApiResponse<GetAllActionGroupByDepartmentIdModelResponse>? _getAllActionGroupByDepartmentIdModelResponse;
  ApiResponse<GetAllActionGroupByDepartmentIdModelResponse>? get getAllActionGroupByDepartmentIdModelResponse => _getAllActionGroupByDepartmentIdModelResponse;

  ApiResponse<CreateActionGroupModelResponse>? _createActionGroupModelResponse;
  ApiResponse<CreateActionGroupModelResponse>? get createActionGroupModelResponse => _createActionGroupModelResponse;

  ApiResponse<UpdateActionGroupModelResponse>? _updateActionGroupModelResponse;
  ApiResponse<UpdateActionGroupModelResponse>? get updateActionGroupModelResponse => _updateActionGroupModelResponse;



  ///&&&&&&&&&&&&&&&&&&&&&&& ZONE &&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllZoneList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllZoneList();
      _getAllZoneListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load zone!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllZoneListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createZone(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addNewZone(body);
      _createZoneModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Zone Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("Zone Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Zone Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Zone Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateZone(BuildContext context, String zoneId, Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateZone(zoneId , body);
      _updateZoneModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Zone Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Zone failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Zone failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Zone Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteZone(BuildContext context, String zoneId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteZone(zoneId);
      _deleteZoneModelResponse = response;

      if (!response.success) {
        debugPrint("Zone Delete failed: ${response.message}");
      }
      // Navigator.pop(context, true); // Pass true as result
    } catch (e, stackTrace) {
      debugPrint("Zone Delete Exception: $e");
      _deleteZoneModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  ///&&&&&&&&&&&&&&&&&&&&&&& STATE &&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllStateList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getAllStateList();
      _getAllStateListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load states!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllStateListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllStateByZoneId(BuildContext context,String zoneId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getStateByZoneId(zoneId);
      _getAllStateByZoneIdModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load states!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllStateByZoneIdModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createState(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createState(body);
      _createStateModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "State Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("State Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'State Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("State Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateState(BuildContext context, String stateId, Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateState(stateId , body);
      _updateStateModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "State Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("State failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'State failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("State Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteState(BuildContext context, String stateId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteState(stateId);
      _deleteStateModelResponse = response;

      if (!response.success) {
        debugPrint("State Delete failed: ${response.message}");
      }
      // Navigator.pop(context, true); // Pass true as result
    } catch (e, stackTrace) {
      debugPrint("State Delete Exception: $e");
      _deleteStateModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  ///&&&&&&&&&&&&&&&&&&&&&&& CITY &&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllCityList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getAllCityList();
      _getAllCityListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load states!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllCityListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllCityByStateId(BuildContext context,String stateId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getCityByStateId(stateId);
      _getAllCityByStateIdModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load states!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllCityByStateIdModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createCity(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createCity(body);
      _createCityModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "City Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("City Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'City Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("City Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateCity(BuildContext context, String cityId, Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateCity(cityId , body);
      _updateCityModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "City Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("City failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'City failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("City Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteCity(BuildContext context, String cityId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteCity(cityId);
      _deleteCityModelResponse = response;

      if (!response.success) {
        debugPrint("City Delete failed: ${response.message}");
      }
      // Navigator.pop(context, true); // Pass true as result
    } catch (e, stackTrace) {
      debugPrint("City Delete Exception: $e");
      _deleteCityModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  ///&&&&&&&&&&&&&&&&&&&&&&& BRANCH &&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllBranchList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getAllBranchList();
      _getAllBranchListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load branch!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllBranchListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllBranchByCityId(BuildContext context,String cityId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getAllBranchByCityId(cityId);
      _getAllBranchByCityIdModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load states!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllBranchByCityIdModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createBranch(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createBranch(body);
      _createBranchModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Branch Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("Branch Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Branch Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Branch Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateBranch(BuildContext context, String branchId, Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateBranch(branchId , body);
      _updateBranchModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Branch Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Branch failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Branch failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Branch Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteBranch(BuildContext context, String cityId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteBranch(cityId);
      _deleteBranchModelResponse = response;

      if (!response.success) {
        debugPrint("Branch Delete failed: ${response.message}");
      }
      // Navigator.pop(context, true); // Pass true as result
    } catch (e, stackTrace) {
      debugPrint("Branch Delete Exception: $e");
      _deleteBranchModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  ///&&&&&&&&&&&&&&&&&&&&&&& DEPARTMENT &&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllDepartmentList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllDepartmentList();
      _getAllBranchDepartmentListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load zone!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllBranchDepartmentListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllDepartmentByBranchId(BuildContext context,String branchId) async {
    _isDeprtLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getAllDepartmentByBranchId(branchId);
      _getAllDepartmentByBranchIdModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load states!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllDepartmentByBranchIdModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isDeprtLoading = false;
      notifyListeners();
    }
  }

  Future<void> createDepartment(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createDepartment(body);
      _createBranchDepartmentModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Department Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("Department Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Department Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Department Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateDepartment(BuildContext context, String branchId, Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateDepartment(branchId , body);
      _updateBranchDepartmentModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Department Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Department failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Branch failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Department Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteDepartment(BuildContext context, String cityId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.deleteDepartment(cityId);
      _deleteBranchDepartmentModelResponse = response;

      if (!response.success) {
        debugPrint("Department Delete failed: ${response.message}");
      }
      Navigator.pop(context, true); // Pass true as result
    } catch (e, stackTrace) {
      debugPrint("Department Delete Exception: $e");
      _deleteBranchDepartmentModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  ///&&&&&&&&&&&&&&&&&&&&&&& DESIGNATION &&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllDesignationList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllDesignationList();
      _getAllDesignationListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load designation!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllDesignationListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllDesignationByDepartmetnId(BuildContext context,String deptId) async {
    _isDeprtLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getAllDesignationByDepartmentId(deptId);
      _getAllDesignationByDepartmentIdModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load states!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllDesignationByDepartmentIdModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isDeprtLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllManagedByListByDeDesignationId(BuildContext context,String designationId) async {
    _isDeprtLoading = true;
    notifyListeners();
    try {

      final Map<String, dynamic> queryParameters = {
        'designationId': designationId,
      };
      final response = await _repository.getAllManagedListByDesignationIdListAtAdmin(queryParameters);
      _getAllManagedByListByDesignationModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load states!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllManagedByListByDesignationModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isDeprtLoading = false;
      notifyListeners();
    }
  }

  Future<void> createDesignation(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createDesignation(body);
      _createDesignationModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Designation Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("Designation Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Designaation Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Designation Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateDesignation(BuildContext context, String designationId, Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateDesignation(designationId , body);
      _updateDesignationModelResponse= response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Designation Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Designation failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Branch failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Designation Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteDesignation(BuildContext context, String designationId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.deleteDesignation(designationId);
      _deleteDesignationModelResponse = response;

      if (!response.success) {
        debugPrint("Designation Delete failed: ${response.message}");
      }
      Navigator.pop(context, true); // Pass true as result
    } catch (e, stackTrace) {
      debugPrint("Designation Delete Exception: $e");
      _deleteDesignationModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  ///&&&&&&&&&&&&&&&&&&&&&&& ACTION GROUPS &&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllActionGroupList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAlLActionGroupsList();
      _getAllActionGroupListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load designation!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllActionGroupListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllActionGroupByDepartmentId(BuildContext context,String deptId) async {
    _isDeprtLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getAllActionGroupByDepartmentId(deptId);
      _getAllActionGroupByDepartmentIdModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load action groups!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllActionGroupByDepartmentIdModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isDeprtLoading = false;
      notifyListeners();
    }
  }

  Future<void> createActionGroup(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createActionGroup(body);
      _createActionGroupModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Action Group Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("Action Group Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Action Group Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Action Group Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateActionGroup(BuildContext context, String actionGroupId, Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateActionGroup(actionGroupId , body);
      _updateActionGroupModelResponse= response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Action Group Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Action Group failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Action Group failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Action Group Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }







}
