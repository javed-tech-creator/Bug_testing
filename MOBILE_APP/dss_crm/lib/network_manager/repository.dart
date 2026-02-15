import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:dss_crm/admin/model/action_groups/create_action_group_model.dart';
import 'package:dss_crm/admin/model/action_groups/delete_action_group_mode.dart';
import 'package:dss_crm/admin/model/action_groups/get_all_action_groups_by_department_id_model.dart';
import 'package:dss_crm/admin/model/action_groups/get_all_action_groups_list_model.dart';
import 'package:dss_crm/admin/model/action_groups/update_action_group_model.dart';
import 'package:dss_crm/admin/model/department/create_branch_department_model.dart';
import 'package:dss_crm/admin/model/department/delete_branch_department_model.dart';
import 'package:dss_crm/admin/model/department/designation/create_designation_model.dart';
import 'package:dss_crm/admin/model/department/designation/delete_designation_model.dart';
import 'package:dss_crm/admin/model/department/designation/get_all_designation_by_departmetn_id_model.dart';
import 'package:dss_crm/admin/model/department/designation/get_all_designation_list_model.dart';
import 'package:dss_crm/admin/model/department/designation/update_designation_model.dart';
import 'package:dss_crm/admin/model/department/get_all_branch_by_city_id_model.dart';
import 'package:dss_crm/admin/model/department/get_all_branch_department_list_model.dart';
import 'package:dss_crm/admin/model/department/get_all_department_by_branch_id_model.dart';
import 'package:dss_crm/admin/model/department/update_branch_department_model.dart';
import 'package:dss_crm/admin/model/employee_profile/get_all_admin_employee_list_model.dart';
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
import 'package:dss_crm/admin/model/product_management/admin_add_product_model.dart';
import 'package:dss_crm/admin/model/product_management/admin_add_product_works_model.dart';
import 'package:dss_crm/admin/model/product_management/admin_delete_product_model.dart';
import 'package:dss_crm/admin/model/product_management/admin_product_list_model.dart';
import 'package:dss_crm/admin/model/product_management/admin_product_single_details_model.dart';
import 'package:dss_crm/admin/model/product_management/admin_product_single_works_details_model.dart';
import 'package:dss_crm/admin/model/product_management/admin_update_product_model.dart';
import 'package:dss_crm/admin/model/product_management/admin_update_product_works_model.dart';
import 'package:dss_crm/admin/model/user_register/get_admin_single_registered_user_details_model.dart';
import 'package:dss_crm/admin/model/user_register/get_all_admin_registered_user_list_model.dart';
import 'package:dss_crm/admin/model/user_register/get_managed_list_by_designation_model.dart';
import 'package:dss_crm/admin/model/user_register/update_user_register_model.dart';
import 'package:dss_crm/admin/model/user_register/user_register_model.dart';
import 'package:dss_crm/admin/screen/vendor/model/all_vendor_list_model.dart';
import 'package:dss_crm/admin/screen/vendor/model/single_vendor_detail_at_admin_model.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/candidate_detail_model.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/candidate_list_model.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/candidate_schedule_interview_model.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/chnage_candidate_hired_status_model.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/upload_candidate_offerletter_resume_model.dart';
import 'package:dss_crm/hr_module/screen/employee/employee_attendance/model/hr_emp_attendance_calender_view_model.dart';
import 'package:dss_crm/hr_module/screen/employee/employee_attendance/model/hr_emp_attendance_list_model.dart';
import 'package:dss_crm/hr_module/screen/employee/leave_module/model/all_emp_leave_requests_model.dart';
import 'package:dss_crm/hr_module/screen/employee/leave_module/model/emp_leave_approved_model.dart';
import 'package:dss_crm/hr_module/screen/employee/leave_module/model/emp_leave_rejected_model.dart';
import 'package:dss_crm/hr_module/screen/employee/model/hr_employee_list_detail_model.dart';
import 'package:dss_crm/hr_module/screen/employee/model/hr_employee_list_model.dart';
import 'package:dss_crm/hr_module/screen/employee/model/update_employee_model.dart';
import 'package:dss_crm/hr_module/screen/employee/payroll/model/hr_payroll_approved_salary_model.dart';
import 'package:dss_crm/hr_module/screen/employee/payroll/model/hr_payroll_management_list_model.dart';
import 'package:dss_crm/hr_module/screen/job_opening/model/close_job_opening_model.dart';
import 'package:dss_crm/hr_module/screen/job_opening/model/create_job_opening_model.dart';
import 'package:dss_crm/hr_module/screen/job_opening/model/delete_job_opening_model.dart';
import 'package:dss_crm/hr_module/screen/job_opening/model/job_opening_list_model.dart';
import 'package:dss_crm/hr_module/screen/job_opening/model/single_job_opening_details_model.dart';
import 'package:dss_crm/hr_module/screen/job_opening/model/update_job_opening_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/marketing_get_all_compaign_list_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/model/create_new_marketing_compaign_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/model/delete_marketing_compaign_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/model/update_marketing_campaign_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/model/update_marketing_compaign_status_model.dart';
import 'package:dss_crm/sales_module/common/model/lead_assign_to_sales_emp_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_emp_client_briefing_form_list_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_1_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_2_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_3_payment_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_4_pending_payment_model.dart';
import 'package:dss_crm/sales_module/sales_employee/model/sales_employee_dashboard_data_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_add_client_briefing_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_assigned_lead_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_client_briefing_list_model.dart';
import 'package:dss_crm/sales_module/sales_tl/employee/employee_list_model.dart';
import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/model/sales_tl_add_morning_evening_reporting_model.dart';
import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/model/sales_tl_morning_evening_reporting_list_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_asset_list_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_assigned_ticket_list_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_assigned_ticket_update_status_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_dashbaord_top_card_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineerr_software_licence_list_model.dart';
import 'package:dss_crm/tech_module/tech_employee/model/ticket_raised_by_tech_engineer_model.dart';
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
import 'package:dss_crm/vendor_module/model/bank_details/bank_details_list_model.dart';
import 'package:dss_crm/vendor_module/model/bank_details/create_invoice_model.dart';
import 'package:dss_crm/vendor_module/model/bank_details/single_message_model.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_add_categories_model.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_categories_list_model.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_update_categories_model.dart';
import 'package:dss_crm/vendor_module/model/customer/vendor_add_customer_model.dart';
import 'package:dss_crm/vendor_module/model/dashboard/recent_order_list_model.dart';
import 'package:dss_crm/vendor_module/model/dashboard/top_card_model.dart';
import 'package:dss_crm/vendor_module/model/dashboard/vendor_dashboard_chart_model.dart';
import 'package:dss_crm/vendor_module/model/drafts/create_draft_model.dart';
import 'package:dss_crm/vendor_module/model/drafts/darft_list_model.dart';
import 'package:dss_crm/vendor_module/model/drafts/single_darft_details_model.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_add_product_model.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_product_management_list_model.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_single_product_model.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_update_product_model.dart';
import 'package:dss_crm/vendor_module/model/purchsae_order/vendor_purchase_order_list_model.dart';
import 'package:dss_crm/vendor_module/model/purchsae_order/vendor_purchase_order_payement_update_model.dart';
import 'package:dss_crm/vendor_module/model/vendor_customer/vendor_customer_list_model.dart';
import 'package:dss_crm/vendor_module/model/vendor_profile/vendor_profile_model.dart';
import 'package:dss_crm/vendor_module/screen/draft/vendor_create_draft_screen.dart';
import '../auth/model/login_model.dart';
import '../hr_module/screen/employee/model/emp_document_module/add_emp_document_model.dart';
import '../hr_module/screen/employee/model/emp_document_module/get_emp_document_list_model.dart';
import '../sales_module/common/model/sales_person_list_model.dart';
import '../sales_module/sales_hod/lead/model/sales_hod_add_lead_model.dart';
import '../sales_module/sales_hod/lead/model/sales_hod_lead_list_model.dart';
import 'api_response.dart';
import 'dio_helper.dart';
import 'package:http_parser/http_parser.dart';
import 'dart:typed_data';

class Repository {
  final DioHelper _dioHelper = DioHelper();

  static const String baseUrl = "https://dss-backend-qnvh.onrender.com/api/v1";
  static const String vendorbaseUrl =  'https://dss-backend-qnvh.onrender.com/api/v1';
  static const String technologybaseUrl =  'https://dss-backend-qnvh.onrender.com/api/v1';

  // SUHEL PORT URL

  // static const String baseUrl = "https://dfmr0pxf-3000.inc1.devtunnels.ms/api/v1";
  // static const String vendorbaseUrl ='https://dfmr0pxf-3000.inc1.devtunnels.ms/api/v1';
  // static const String technologybaseUrl = 'https://dfmr0pxf-3000.inc1.devtunnels.ms/api/v1';


  // JAVED PORT  URL

  // static const String baseUrl = "https://55vfm9n3-3000.inc1.devtunnels.ms/api/v1";
  // static const String vendorbaseUrl = 'https://55vfm9n3-3000.inc1.devtunnels.ms/api/v1';
  // static const String technologybaseUrl = 'https://55vfm9n3-3000.inc1.devtunnels.ms/api/v1';

  Future<ApiResponse<LoginResponseModel>> loginUser(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/user/login";
    // final String url = "$baseUrl/login/email/password";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(LoginResponseModel.fromJson(response.data!));
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Login failed: ${e.toString()}");
    }
  }

  //////// 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉 PHASE 1  👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉

  /// &&&&&&&&&&&&&&&&&&&✅✅✅✅✅✅✅ ADMIN OR HR MODULE   ✅✅✅✅✅✅✅ &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  /// &&&&&&&&&&&&&&&&&& ZONE &&&&&&&&&&&&&&&&&

  Future<ApiResponse<GetAllZoneModelResponse>> getAllZoneList() async {
    final String url = "$baseUrl/hr/zone";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllZoneModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CreateZoneModelResponse>> addNewZone(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/zone";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateZoneModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateZoneModelResponse>> updateZone(
    String zoneId,
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/zone/${zoneId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateZoneModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<DeleteZoneModelResponse>> deleteZone(String zoneId) async {
    final String url = "$baseUrl/hr/zone/${zoneId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          DeleteZoneModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  /// &&&&&&&&&&&&&&&&&& STATES &&&&&&&&&&&&&&&&&

  Future<ApiResponse<GetAllStatesModelResponse>> getAllStateList() async {
    final String url = "$baseUrl/hr/state";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllStatesModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetStateByZoneIdModelResponse>> getStateByZoneId(
    String zoneId,
  ) async {
    final String url = "$baseUrl/hr/state/zone/${zoneId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetStateByZoneIdModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CreateStateModelResponse>> createState(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/state";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateStateModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateStateModelResponse>> updateState(
    String stateId,
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/state/${stateId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateStateModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<DeleteStateModelResponse>> deleteState(
    String stateId,
  ) async {
    final String url = "$baseUrl/hr/state/${stateId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          DeleteStateModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  /// &&&&&&&&&&&&&&&&&& CITY &&&&&&&&&&&&&&&&&

  Future<ApiResponse<GetAllCityListModelResponse>> getAllCityList() async {
    final String url = "$baseUrl/hr/city";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllCityListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetCityByStateIdModelResponse>> getCityByStateId(
    String stateId,
  ) async {
    final String url = "$baseUrl/hr/city/state/${stateId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetCityByStateIdModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CreateCityModelResponse>> createCity(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/city";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateCityModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateCityModelResponse>> updateCity(
    String cityId,
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/city/${cityId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateCityModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<DeleteCityModelResponse>> deleteCity(String cityId) async {
    final String url = "$baseUrl/hr/city/${cityId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          DeleteCityModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  ///// &&&&&&&&&&&&&&&&&& BRANCH &&&&&&&&&&&&&&&&&

  Future<ApiResponse<GetAllBranchListModelResponse>> getAllBranchList() async {
    final String url = "$baseUrl/hr/branch";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllBranchListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllBranchByCityIdModelResponse>> getAllBranchByCityId(
    String cityId,
  ) async {
    final String url = "$baseUrl/hr/branch/city/${cityId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllBranchByCityIdModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CreateBranchModelResponse>> createBranch(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/branch";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateBranchModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateBranchModelResponse>> updateBranch(
    String branchId,
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/branch/${branchId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateBranchModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<DeleteBranchModelResponse>> deleteBranch(
    String branchid,
  ) async {
    final String url = "$baseUrl/hr/branch/${branchid}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          DeleteBranchModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  ///// &&&&&&&&&&&&&&&&&& DEPARTMENT CREATION &&&&&&&&&&&&&&&&&

  Future<ApiResponse<CreateBranchDepartmentModelResponse>> createDepartment(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/department";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateBranchDepartmentModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllBranchDepartmentListModelResponse>> getAllDepartmentList() async {
    final String url = "$baseUrl/hr/department";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllBranchDepartmentListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllDepartmentByBranchIdModelResponse>>getAllDepartmentByBranchId(String branchId) async {
    final String url = "$baseUrl/hr/department/branch/${branchId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllDepartmentByBranchIdModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateBranchDepartmentModelResponse>> updateDepartment(
    String departmentId,
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/department/${departmentId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateBranchDepartmentModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<DeleteBranchDepartmentModelResponse>> deleteDepartment(
    String departmentId,
  ) async {
    final String url = "$baseUrl/hr/department/${departmentId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          DeleteBranchDepartmentModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  ///// &&&&&&&&&&&&&&&&&& DESIGNATION CREATION &&&&&&&&&&&&&&&&&

  Future<ApiResponse<CreateDesignationModelResponse>> createDesignation(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/designation";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateDesignationModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllDesignationListModelResponse>> getAllDesignationList() async {
    final String url = "$baseUrl/hr/designation";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllDesignationListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllDesignationByDepartmetIdModelResponse>> getAllDesignationByDepartmentId(String deptId) async {
    final String url = "$baseUrl/hr/designation/department/${deptId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllDesignationByDepartmetIdModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateDesignationModelResponse>> updateDesignation(
    String designationId,
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/designation/${designationId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateDesignationModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<DeleteDesignationModelResponse>> deleteDesignation(
    String designationId,
  ) async {
    final String url = "$baseUrl/hr/designation/${designationId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          DeleteDesignationModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  ///// &&&&&&&&&&&&&&&&&& ACTION GROUPS CREATION &&&&&&&&&&&&&&&&&

  Future<ApiResponse<GetAllActionGroupsListModelResponse>> getAlLActionGroupsList() async {
    final String url = "$baseUrl/hr/action-group";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllActionGroupsListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllActionGroupByDepartmentIdModelResponse>>getAllActionGroupByDepartmentId(String deptId) async {
    final String url = "$baseUrl/hr/action-group/department/${deptId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllActionGroupByDepartmentIdModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CreateActionGroupModelResponse>> createActionGroup(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/action-group";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateActionGroupModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateActionGroupModelResponse>> updateActionGroup(
    String actionGroupId,
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/hr/action-group/${actionGroupId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateActionGroupModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  ///// &&&&&&&&&&&&&&&&&& ADMIN EMPLOYEE PROFILE &&&&&&&&&&&&&&&&&

  Future<ApiResponse<GetAllAdminEmployeeListModelResponse>> getAllAdminEmployeeList() async {
    final String url = "$baseUrl/hr/employee-profile";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllAdminEmployeeListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  ///// &&&&&&&&&&&&&&&&&& ADMIN USER REGISTRATION &&&&&&&&&&&&&&&&&

  Future<ApiResponse<GetAllAdminRegisteredUserListModelResponse>> getAllAdminRegisteredUserList() async {
    final String url = "$baseUrl/hr/user";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllAdminRegisteredUserListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllManagedByListByDesignationModelResponse>> getAllManagedListByDesignationIdListAtAdmin(Map<String, dynamic> queryParams,) async {
    final String url = "$baseUrl/hr/user/query";
    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams:queryParams
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllManagedByListByDesignationModelResponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>>changeAdminUserRegisterStatus(String registeredUserId ,Map<String, dynamic> requestBody) async {
    final String url = "$baseUrl/hr/user/${registeredUserId}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(url: url,requestBody: requestBody);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SingleMessageModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAdminSingleRegisteredUserDetailsModelResponse>> getAdminRegisteredUserDetail(String registeredUserId) async {
    final String url = "$baseUrl/hr/user/${registeredUserId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAdminSingleRegisteredUserDetailsModelResponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CreateAdminUserRegisterModelResponse>> createAdminUserRegistration(Map<String, dynamic> requestBody) async {
    final String url = "$baseUrl/hr/user/register";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateAdminUserRegisterModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateAdminRegisteredUserDetailsModelResponse>> updateAdminUserRegisterDetails(Map<String, dynamic> requestBody, String registeredUserId,) async {
    final String url = "$baseUrl/hr/user/${registeredUserId}";
    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateAdminRegisteredUserDetailsModelResponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  ///// &&&&&&&&&&&&&&&&&& ADMIN PRODUCT MANAGEMENT &&&&&&&&&&&&&&&&&

  Future<ApiResponse<GetAdminProductListModelResponse>> getAllAdminProductList() async {
    final String url = "$baseUrl/admin/product";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAdminProductListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAdminProductDetailsModelResponse>> getAdminProductSingleDetails(String productId) async {
    final String url = "$baseUrl/admin/product/${productId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAdminProductDetailsModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAdminProductSingleWorkDetailsModelResponse>> getAdminProductSingleWorkDetails(String productId) async {
    final String url = "$baseUrl/admin/product-works/${productId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAdminProductSingleWorkDetailsModelResponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<AddAdminProductModelResponse>> addAdminProduct(
    Map<String, dynamic> requestBody, {
    File? imageFile,
  }) async {
    final String url = "$baseUrl/admin/product";

    try {
      ApiResponse<Map<String, dynamic>> response;

      if (imageFile != null) {
        // Multipart request for image upload
        FormData formData = FormData.fromMap({
          ...requestBody,
          'productImage': await MultipartFile.fromFile(
            imageFile.path,
            filename: imageFile.path.split('/').last,
            contentType: MediaType(
              'image',
              'jpeg',
            ), // or detect from file extension
          ),
        });

        response = await _dioHelper.post<Map<String, dynamic>>(
          url: url,
          requestBody: formData,
        );
      } else {
        // Normal JSON request without image
        response = await _dioHelper.post<Map<String, dynamic>>(
          url: url,
          requestBody: requestBody,
        );
      }
      if (response.success && response.data != null) {
        return ApiResponse.success(
          AddAdminProductModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Product Failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateAdminProductModelResponse>> updateAdminProduct(
    Map<String, dynamic> requestBody,
    String productId,
  ) async {
    final String url = "$baseUrl/admin/product/${productId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateAdminProductModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Product Failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<DeleteAdminProductModelResponse>> deleteSoftAdminProduct(
    String productId,
  ) async {
    final String url = "$baseUrl/admin/product/${productId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          DeleteAdminProductModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Product Failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<AddAdminProductWorksModelResponse>> addAdminProductWorlks(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/admin/product-works";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          AddAdminProductWorksModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateAdminProductWorksModelResponse>> updateAdminProductWorks(
    Map<String, dynamic> requestBody,
    String productId,
  ) async {
    final String url = "$baseUrl/admin/product-works/${productId}";
    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateAdminProductWorksModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }


  ///// &&&&&&&&&&&&&&&&&& ADMIN EMPANELMENT MANAGEMENT &&&&&&&&&&&&&&&&&

  Future<ApiResponse<AllVendorListAtAdminModelResponse>> getAllVendorListAtAdmin(
      Map<String, dynamic> queryParameters,
      ) async {
    final String url = "$baseUrl/admin/vendor";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success( AllVendorListAtAdminModelResponse.fromJson(response.data!),  );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> addNewVendorAtAdmin({
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    // Files
    File? profileImage,
    File? contractForm,

    // Additional Docs: List of {title, file}
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    const String url = "$baseUrl/admin/vendor";

    try {
      final formData = FormData();

      // ====== TEXT FIELDS ======
      formData.fields.addAll([
         MapEntry('contactPersonName', contactPersonName),
         MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty)
          MapEntry('alternateContact', alternateContact),
         MapEntry('email', email),
         MapEntry('businessName', businessName),
         MapEntry('address', address),
         MapEntry('city', city),
         MapEntry('state', state),
         MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // ====== PROFILE IMAGE ======
      if (profileImage != null) {
        formData.files.add(MapEntry(
          'profileImage',
          await MultipartFile.fromFile(
            profileImage.path,
            filename: profileImage.path.split('/').last,
          ),
        ));
      }

      // ====== CONTRACT FORM ======
      if (contractForm != null) {
        formData.files.add(MapEntry(
          'contractForm',
          await MultipartFile.fromFile(
            contractForm.path,
            filename: contractForm.path.split('/').last,
          ),
        ));
      }

      // ====== ADDITIONAL DOCUMENTS – Files + Titles in Parallel Arrays ======
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;

        if (file != null && file.path.isNotEmpty) {
          // File → additionalDocs[] array
          formData.files.add(MapEntry(
            'additionalDocs', // same key multiple times = array
            await MultipartFile.fromFile(
              file.path,
              filename: file.path.split('/').last,
            ),
          ));

          // Title → docTitles[] array (same index order)
          formData.fields.add(MapEntry('docTitles[]', title));
        }
      }

      // ====== SEND REQUEST ======
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: formData,
      );

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(
          response.message ?? "Failed to add vendor",
          statusCode: response.statusCode,
        );
      }
    } catch (e, stack) {
      print("❌ Add Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> updateVendorAtAdmin({
    required String vendorId,
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    File? profileImage,           // null = no change, File = replace
    File? contractForm,           // null = no change, File = replace

    // For additional docs: title + file (file null = keep existing, File = replace)
    List<Map<String, dynamic>> additionalDocuments = const [],

    // To delete existing additional docs by their _id
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    final String url = "$baseUrl/admin/vendor/$vendorId";

    try {
      final formData = FormData();

      // Text fields (same as add)
      formData.fields.addAll([
        MapEntry('contactPersonName', contactPersonName),
        MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty) MapEntry('alternateContact', alternateContact),
        MapEntry('email', email),
        MapEntry('businessName', businessName),
        MapEntry('address', address),
        MapEntry('city', city),
        MapEntry('state', state),
        MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // Profile Image - only if new file selected
      if (profileImage != null) {
        formData.files.add(MapEntry('profileImage', await MultipartFile.fromFile(profileImage.path, filename: profileImage.path.split('/').last)));
      }

      // Contract Form
      if (contractForm != null) {
        formData.files.add(MapEntry('contractForm', await MultipartFile.fromFile(contractForm.path, filename: contractForm.path.split('/').last)));
      }

      // Additional Documents - replace or add new
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;
        final String? existingId = doc['id'] as String?; // if updating existing

        if (file != null) {
          formData.files.add(MapEntry('additionalDocs', await MultipartFile.fromFile(file.path, filename: file.path.split('/').last)));
          formData.fields.add(MapEntry('docTitles[]', title));
          if (existingId != null) {
            formData.fields.add(MapEntry('docIds[]', existingId)); // tell backend which one to replace
          }
        }
      }

      // Delete specific additional docs
      for (var id in deleteAdditionalDocIds) {
        formData.fields.add(MapEntry('deleteAdditionalDocs[]', id));
      }

      final response = await _dioHelper.put<Map<String, dynamic>>(url: url, requestBody: formData);

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(response.message ?? "Failed to update vendor");
      }
    } catch (e, stack) {
      print("Update Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorDetailAtAdminModelResponse>> getVendorSingleDetailsAtAdmin(String vendorId) async {
    final String url = "$baseUrl/admin/vendor/${vendorId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(  VendorDetailAtAdminModelResponse.fromJson( response.data!,  ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  ////// &&&&&&&&&&&&&&&&& CONTRACTOR  &&&&&&&&&&&&&&&&&

  Future<ApiResponse<AllVendorListAtAdminModelResponse>> getAllContractorListAtAdmin(
      Map<String, dynamic> queryParameters,
      ) async {
    final String url = "$baseUrl/admin/contractor";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success( AllVendorListAtAdminModelResponse.fromJson(response.data!),  );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> addNewContractorAtAdmin({
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    // Files
    File? profileImage,
    File? contractForm,

    // Additional Docs: List of {title, file}
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    const String url = "$baseUrl/admin/contractor";

    try {
      final formData = FormData();

      // ====== TEXT FIELDS ======
      formData.fields.addAll([
        MapEntry('contactPersonName', contactPersonName),
        MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty)
          MapEntry('alternateContact', alternateContact),
        MapEntry('email', email),
        MapEntry('businessName', businessName),
        MapEntry('address', address),
        MapEntry('city', city),
        MapEntry('state', state),
        MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // ====== PROFILE IMAGE ======
      if (profileImage != null) {
        formData.files.add(MapEntry(
          'profileImage',
          await MultipartFile.fromFile(
            profileImage.path,
            filename: profileImage.path.split('/').last,
          ),
        ));
      }

      // ====== CONTRACT FORM ======
      if (contractForm != null) {
        formData.files.add(MapEntry(
          'contractForm',
          await MultipartFile.fromFile(
            contractForm.path,
            filename: contractForm.path.split('/').last,
          ),
        ));
      }

      // ====== ADDITIONAL DOCUMENTS – Files + Titles in Parallel Arrays ======
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;

        if (file != null && file.path.isNotEmpty) {
          // File → additionalDocs[] array
          formData.files.add(MapEntry(
            'additionalDocs', // same key multiple times = array
            await MultipartFile.fromFile(
              file.path,
              filename: file.path.split('/').last,
            ),
          ));

          // Title → docTitles[] array (same index order)
          formData.fields.add(MapEntry('docTitles[]', title));
        }
      }

      // ====== SEND REQUEST ======
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: formData,
      );

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(
          response.message ?? "Failed to add vendor",
          statusCode: response.statusCode,
        );
      }
    } catch (e, stack) {
      print("❌ Add Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> updateContractorAtAdmin({
    required String contractorId,
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    File? profileImage,           // null = no change, File = replace
    File? contractForm,           // null = no change, File = replace

    // For additional docs: title + file (file null = keep existing, File = replace)
    List<Map<String, dynamic>> additionalDocuments = const [],

    // To delete existing additional docs by their _id
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    final String url = "$baseUrl/admin/contractor/$contractorId";

    try {
      final formData = FormData();

      // Text fields (same as add)
      formData.fields.addAll([
        MapEntry('contactPersonName', contactPersonName),
        MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty) MapEntry('alternateContact', alternateContact),
        MapEntry('email', email),
        MapEntry('businessName', businessName),
        MapEntry('address', address),
        MapEntry('city', city),
        MapEntry('state', state),
        MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // Profile Image - only if new file selected
      if (profileImage != null) {
        formData.files.add(MapEntry('profileImage', await MultipartFile.fromFile(profileImage.path, filename: profileImage.path.split('/').last)));
      }

      // Contract Form
      if (contractForm != null) {
        formData.files.add(MapEntry('contractForm', await MultipartFile.fromFile(contractForm.path, filename: contractForm.path.split('/').last)));
      }

      // Additional Documents - replace or add new
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;
        final String? existingId = doc['id'] as String?; // if updating existing

        if (file != null) {
          formData.files.add(MapEntry('additionalDocs', await MultipartFile.fromFile(file.path, filename: file.path.split('/').last)));
          formData.fields.add(MapEntry('docTitles[]', title));
          if (existingId != null) {
            formData.fields.add(MapEntry('docIds[]', existingId)); // tell backend which one to replace
          }
        }
      }

      // Delete specific additional docs
      for (var id in deleteAdditionalDocIds) {
        formData.fields.add(MapEntry('deleteAdditionalDocs[]', id));
      }

      final response = await _dioHelper.put<Map<String, dynamic>>(url: url, requestBody: formData);

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(response.message ?? "Failed to update vendor");
      }
    } catch (e, stack) {
      print("Update Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorDetailAtAdminModelResponse>> getContractorSingleDetailsAtAdmin(String contractorId) async {
    final String url = "$baseUrl/admin/contractor/${contractorId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(  VendorDetailAtAdminModelResponse.fromJson( response.data!,  ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }


  ////// &&&&&&&&&&&&&&&&& FREELANCER  &&&&&&&&&&&&&&&&&

  Future<ApiResponse<AllVendorListAtAdminModelResponse>> getAllFreelancerListAtAdmin(  Map<String, dynamic> queryParameters, ) async {
    final String url = "$baseUrl/admin/freelancer";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success( AllVendorListAtAdminModelResponse.fromJson(response.data!),  );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> addNewFreelancerAtAdmin({
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    // Files
    File? profileImage,
    File? contractForm,

    // Additional Docs: List of {title, file}
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    const String url = "$baseUrl/admin/freelancer";

    try {
      final formData = FormData();

      // ====== TEXT FIELDS ======
      formData.fields.addAll([
        MapEntry('contactPersonName', contactPersonName),
        MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty)
          MapEntry('alternateContact', alternateContact),
        MapEntry('email', email),
        MapEntry('businessName', businessName),
        MapEntry('address', address),
        MapEntry('city', city),
        MapEntry('state', state),
        MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // ====== PROFILE IMAGE ======
      if (profileImage != null) {
        formData.files.add(MapEntry(
          'profileImage',
          await MultipartFile.fromFile(
            profileImage.path,
            filename: profileImage.path.split('/').last,
          ),
        ));
      }

      // ====== CONTRACT FORM ======
      if (contractForm != null) {
        formData.files.add(MapEntry(
          'contractForm',
          await MultipartFile.fromFile(
            contractForm.path,
            filename: contractForm.path.split('/').last,
          ),
        ));
      }

      // ====== ADDITIONAL DOCUMENTS – Files + Titles in Parallel Arrays ======
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;

        if (file != null && file.path.isNotEmpty) {
          // File → additionalDocs[] array
          formData.files.add(MapEntry(
            'additionalDocs', // same key multiple times = array
            await MultipartFile.fromFile(
              file.path,
              filename: file.path.split('/').last,
            ),
          ));

          // Title → docTitles[] array (same index order)
          formData.fields.add(MapEntry('docTitles[]', title));
        }
      }

      // ====== SEND REQUEST ======
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: formData,
      );

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(
          response.message ?? "Failed to add vendor",
          statusCode: response.statusCode,
        );
      }
    } catch (e, stack) {
      print("❌ Add Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> updateFreelancerAtAdmin({
    required String freelancerId,
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    File? profileImage,           // null = no change, File = replace
    File? contractForm,           // null = no change, File = replace

    // For additional docs: title + file (file null = keep existing, File = replace)
    List<Map<String, dynamic>> additionalDocuments = const [],

    // To delete existing additional docs by their _id
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    final String url = "$baseUrl/admin/freelancer/$freelancerId";

    try {
      final formData = FormData();

      // Text fields (same as add)
      formData.fields.addAll([
        MapEntry('contactPersonName', contactPersonName),
        MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty) MapEntry('alternateContact', alternateContact),
        MapEntry('email', email),
        MapEntry('businessName', businessName),
        MapEntry('address', address),
        MapEntry('city', city),
        MapEntry('state', state),
        MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // Profile Image - only if new file selected
      if (profileImage != null) {
        formData.files.add(MapEntry('profileImage', await MultipartFile.fromFile(profileImage.path, filename: profileImage.path.split('/').last)));
      }

      // Contract Form
      if (contractForm != null) {
        formData.files.add(MapEntry('contractForm', await MultipartFile.fromFile(contractForm.path, filename: contractForm.path.split('/').last)));
      }

      // Additional Documents - replace or add new
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;
        final String? existingId = doc['id'] as String?; // if updating existing

        if (file != null) {
          formData.files.add(MapEntry('additionalDocs', await MultipartFile.fromFile(file.path, filename: file.path.split('/').last)));
          formData.fields.add(MapEntry('docTitles[]', title));
          if (existingId != null) {
            formData.fields.add(MapEntry('docIds[]', existingId)); // tell backend which one to replace
          }
        }
      }

      // Delete specific additional docs
      for (var id in deleteAdditionalDocIds) {
        formData.fields.add(MapEntry('deleteAdditionalDocs[]', id));
      }

      final response = await _dioHelper.put<Map<String, dynamic>>(url: url, requestBody: formData);

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(response.message ?? "Failed to update vendor");
      }
    } catch (e, stack) {
      print("Update Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorDetailAtAdminModelResponse>> getFreelancerSingleDetailsAtAdmin(String freelancerId) async {
    final String url = "$baseUrl/admin/freelancer/${freelancerId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(  VendorDetailAtAdminModelResponse.fromJson( response.data!,  ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }


  ////// &&&&&&&&&&&&&&&&& PARTNER  &&&&&&&&&&&&&&&&&

  Future<ApiResponse<AllVendorListAtAdminModelResponse>> getAllPartnerListAtAdmin(  Map<String, dynamic> queryParameters, ) async {
    final String url = "$baseUrl/admin/partner";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success( AllVendorListAtAdminModelResponse.fromJson(response.data!),  );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> addNewPartnerAtAdmin({
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    // Files
    File? profileImage,
    File? contractForm,

    // Additional Docs: List of {title, file}
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    const String url = "$baseUrl/admin/partner";

    try {
      final formData = FormData();

      // ====== TEXT FIELDS ======
      formData.fields.addAll([
        MapEntry('contactPersonName', contactPersonName),
        MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty)
          MapEntry('alternateContact', alternateContact),
        MapEntry('email', email),
        MapEntry('businessName', businessName),
        MapEntry('address', address),
        MapEntry('city', city),
        MapEntry('state', state),
        MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // ====== PROFILE IMAGE ======
      if (profileImage != null) {
        formData.files.add(MapEntry(
          'profileImage',
          await MultipartFile.fromFile(
            profileImage.path,
            filename: profileImage.path.split('/').last,
          ),
        ));
      }

      // ====== CONTRACT FORM ======
      if (contractForm != null) {
        formData.files.add(MapEntry(
          'contractForm',
          await MultipartFile.fromFile(
            contractForm.path,
            filename: contractForm.path.split('/').last,
          ),
        ));
      }

      // ====== ADDITIONAL DOCUMENTS – Files + Titles in Parallel Arrays ======
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;

        if (file != null && file.path.isNotEmpty) {
          // File → additionalDocs[] array
          formData.files.add(MapEntry(
            'additionalDocs', // same key multiple times = array
            await MultipartFile.fromFile(
              file.path,
              filename: file.path.split('/').last,
            ),
          ));

          // Title → docTitles[] array (same index order)
          formData.fields.add(MapEntry('docTitles[]', title));
        }
      }

      // ====== SEND REQUEST ======
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: formData,
      );

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(
          response.message ?? "Failed to add vendor",
          statusCode: response.statusCode,
        );
      }
    } catch (e, stack) {
      print("❌ Add Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> updatePartnerAtAdmin({
    required String partnerId,
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    File? profileImage,           // null = no change, File = replace
    File? contractForm,           // null = no change, File = replace

    // For additional docs: title + file (file null = keep existing, File = replace)
    List<Map<String, dynamic>> additionalDocuments = const [],

    // To delete existing additional docs by their _id
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    final String url = "$baseUrl/admin/partner/$partnerId";

    try {
      final formData = FormData();

      // Text fields (same as add)
      formData.fields.addAll([
        MapEntry('contactPersonName', contactPersonName),
        MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty) MapEntry('alternateContact', alternateContact),
        MapEntry('email', email),
        MapEntry('businessName', businessName),
        MapEntry('address', address),
        MapEntry('city', city),
        MapEntry('state', state),
        MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // Profile Image - only if new file selected
      if (profileImage != null) {
        formData.files.add(MapEntry('profileImage', await MultipartFile.fromFile(profileImage.path, filename: profileImage.path.split('/').last)));
      }

      // Contract Form
      if (contractForm != null) {
        formData.files.add(MapEntry('contractForm', await MultipartFile.fromFile(contractForm.path, filename: contractForm.path.split('/').last)));
      }

      // Additional Documents - replace or add new
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;
        final String? existingId = doc['id'] as String?; // if updating existing

        if (file != null) {
          formData.files.add(MapEntry('additionalDocs', await MultipartFile.fromFile(file.path, filename: file.path.split('/').last)));
          formData.fields.add(MapEntry('docTitles[]', title));
          if (existingId != null) {
            formData.fields.add(MapEntry('docIds[]', existingId)); // tell backend which one to replace
          }
        }
      }

      // Delete specific additional docs
      for (var id in deleteAdditionalDocIds) {
        formData.fields.add(MapEntry('deleteAdditionalDocs[]', id));
      }

      final response = await _dioHelper.put<Map<String, dynamic>>(url: url, requestBody: formData);

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(response.message ?? "Failed to update vendor");
      }
    } catch (e, stack) {
      print("Update Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorDetailAtAdminModelResponse>> getPartnerSingleDetailsAtAdmin(String partnerId) async {
    final String url = "$baseUrl/admin/partner/${partnerId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(  VendorDetailAtAdminModelResponse.fromJson( response.data!,  ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }

  ////// &&&&&&&&&&&&&&&&& FRANCHISE  &&&&&&&&&&&&&&&&&

  Future<ApiResponse<AllVendorListAtAdminModelResponse>> getAllFranchiseListAtAdmin(  Map<String, dynamic> queryParameters, ) async {
    final String url = "$baseUrl/admin/franchise";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success( AllVendorListAtAdminModelResponse.fromJson(response.data!),  );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> addNewFranchiseAtAdmin({
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    // Files
    File? profileImage,
    File? contractForm,

    // Additional Docs: List of {title, file}
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    const String url = "$baseUrl/admin/franchise";

    try {
      final formData = FormData();

      // ====== TEXT FIELDS ======
      formData.fields.addAll([
        MapEntry('contactPersonName', contactPersonName),
        MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty)
          MapEntry('alternateContact', alternateContact),
        MapEntry('email', email),
        MapEntry('businessName', businessName),
        MapEntry('address', address),
        MapEntry('city', city),
        MapEntry('state', state),
        MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // ====== PROFILE IMAGE ======
      if (profileImage != null) {
        formData.files.add(MapEntry(
          'profileImage',
          await MultipartFile.fromFile(
            profileImage.path,
            filename: profileImage.path.split('/').last,
          ),
        ));
      }

      // ====== CONTRACT FORM ======
      if (contractForm != null) {
        formData.files.add(MapEntry(
          'contractForm',
          await MultipartFile.fromFile(
            contractForm.path,
            filename: contractForm.path.split('/').last,
          ),
        ));
      }

      // ====== ADDITIONAL DOCUMENTS – Files + Titles in Parallel Arrays ======
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;

        if (file != null && file.path.isNotEmpty) {
          // File → additionalDocs[] array
          formData.files.add(MapEntry(
            'additionalDocs', // same key multiple times = array
            await MultipartFile.fromFile(
              file.path,
              filename: file.path.split('/').last,
            ),
          ));

          // Title → docTitles[] array (same index order)
          formData.fields.add(MapEntry('docTitles[]', title));
        }
      }

      // ====== SEND REQUEST ======
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: formData,
      );

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(
          response.message ?? "Failed to add vendor",
          statusCode: response.statusCode,
        );
      }
    } catch (e, stack) {
      print("❌ Add Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> updateFranchiseAtAdmin({
    required String franchiseId,
    required String contactPersonName,
    required String contactNumber,
    String? alternateContact,
    required String email,
    required String businessName,
    required String address,
    required String city,
    required String state,
    required String pincode,
    String? gstNumber,
    String? panNumber,
    String? aadharNumber,
    String? bankName,
    String? accountNumber,
    String? ifscCode,

    File? profileImage,           // null = no change, File = replace
    File? contractForm,           // null = no change, File = replace

    // For additional docs: title + file (file null = keep existing, File = replace)
    List<Map<String, dynamic>> additionalDocuments = const [],

    // To delete existing additional docs by their _id
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    final String url = "$baseUrl/admin/franchise/$franchiseId";

    try {
      final formData = FormData();

      // Text fields (same as add)
      formData.fields.addAll([
        MapEntry('contactPersonName', contactPersonName),
        MapEntry('contactNumber', contactNumber),
        if (alternateContact != null && alternateContact.isNotEmpty) MapEntry('alternateContact', alternateContact),
        MapEntry('email', email),
        MapEntry('businessName', businessName),
        MapEntry('address', address),
        MapEntry('city', city),
        MapEntry('state', state),
        MapEntry('pincode', pincode),
        if (gstNumber != null && gstNumber.isNotEmpty) MapEntry('gstin', gstNumber),
        if (panNumber != null && panNumber.isNotEmpty) MapEntry('pan', panNumber),
        if (aadharNumber != null && aadharNumber.isNotEmpty) MapEntry('aadhar', aadharNumber),
        if (bankName != null && bankName.isNotEmpty) MapEntry('bankName', bankName),
        if (accountNumber != null && accountNumber.isNotEmpty) MapEntry('accountNumber', accountNumber),
        if (ifscCode != null && ifscCode.isNotEmpty) MapEntry('ifscCode', ifscCode),
      ]);

      // Profile Image - only if new file selected
      if (profileImage != null) {
        formData.files.add(MapEntry('profileImage', await MultipartFile.fromFile(profileImage.path, filename: profileImage.path.split('/').last)));
      }

      // Contract Form
      if (contractForm != null) {
        formData.files.add(MapEntry('contractForm', await MultipartFile.fromFile(contractForm.path, filename: contractForm.path.split('/').last)));
      }

      // Additional Documents - replace or add new
      for (var doc in additionalDocuments) {
        final File? file = doc['file'] as File?;
        final String title = doc['title'] as String;
        final String? existingId = doc['id'] as String?; // if updating existing

        if (file != null) {
          formData.files.add(MapEntry('additionalDocs', await MultipartFile.fromFile(file.path, filename: file.path.split('/').last)));
          formData.fields.add(MapEntry('docTitles[]', title));
          if (existingId != null) {
            formData.fields.add(MapEntry('docIds[]', existingId)); // tell backend which one to replace
          }
        }
      }

      // Delete specific additional docs
      for (var id in deleteAdditionalDocIds) {
        formData.fields.add(MapEntry('deleteAdditionalDocs[]', id));
      }

      final response = await _dioHelper.put<Map<String, dynamic>>(url: url, requestBody: formData);

      if (response.success && response.data != null) {
        return ApiResponse.success(SingleMessageModelResponse.fromJson(response.data!));
      } else {
        return ApiResponse.error(response.message ?? "Failed to update vendor");
      }
    } catch (e, stack) {
      print("Update Vendor Error: $e\n$stack");
      return ApiResponse.error("Error: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorDetailAtAdminModelResponse>> getFranchiseSingleDetailsAtAdmin(String franchiseId) async {
    final String url = "$baseUrl/admin/franchise/${franchiseId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(  VendorDetailAtAdminModelResponse.fromJson( response.data!,  ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Branch failed: ${e.toString()}");
    }
  }


  ///&&&&&&&&&&&&&&&&&&&✅✅✅✅✅✅✅ SALES MODULE   ✅✅✅✅✅✅✅ &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  ///&&&&&&&&&&&&    LEAD  MANAGEMENT      &&&&&&&&&&&&
  Future<ApiResponse<AddLeadSalesHODModelResponse>> addLead(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/api/v1/lead/add";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          AddLeadSalesHODModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllSalesHODLeadsListModelResponse>> getAllLeads() async {
    final String url = "$baseUrl/api/v1/lead/get/all";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllSalesHODLeadsListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllSalesEmpAssignedLeadsListModelResponse>> getAllSalesEmpAssignedLeads(String employeeId) async {
    final String url = "$baseUrl/api/v1/lead/get/all/assion-lead/${employeeId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllSalesEmpAssignedLeadsListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllSalesEmpAssignedLeadsListModelResponse>> getOurLeadList(String employeeId) async {
    final String url = "$baseUrl/api/v1/lead/get/our/${employeeId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllSalesEmpAssignedLeadsListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllSalesHODLeadsListModelResponse>> getAllPendingLeadList() async {
    final String url = "$baseUrl/api/v1/lead/pending-list";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllSalesHODLeadsListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Pending Leads failed: ${e.toString()}");
    }
  }

  /// **************** this is the api that show aal the client brefing project location link wali

  // Future<ApiResponse<SalesEmpClientBriefingFormListModelResponse>> getAllSalesInFormList() async {
  //   final String url = "$baseUrl/api/v1/sales/client-briefing/get/sales/form";
  //
  //   try {
  //     final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
  //     if (response.success && response.data != null) {
  //       return ApiResponse.success(
  //         SalesEmpClientBriefingFormListModelResponse.fromJson(response.data!),
  //       );
  //     } else {
  //       return ApiResponse.error(
  //         response.message ?? "Unknown error",
  //         statusCode: response.statusCode,
  //         data: null,
  //       );
  //     }
  //   } catch (e) {
  //     return ApiResponse.error("Get All Leads failed: ${e.toString()}");
  //   }
  // }

  /// **************** this is the api that show aal the client brefing project location link wali

  Future<ApiResponse<SalesEmpClientBriefingFormListModelResponse>> getAllSalesInFormList(String userId) async {
    final String url =
        "$baseUrl/api/v1/sales/client-briefing/get/our/project/${userId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SalesEmpClientBriefingFormListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  /// Sales Person list
  Future<ApiResponse<SalesEmpListModel>> getAllSalesPersonList(
    String city,
    String zone,
  ) async {
    final String url = "$baseUrl/api/v1/sales/all/employee-zone-wise";
    // final String url = "$baseUrl/api/v1/lead/get/sales/employee-zone-wise";

    try {
      // final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: {'city': city, 'zone': zone},
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(SalesEmpListModel.fromJson(response.data!));
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  /// Sales Update Lead
  Future<ApiResponse<SalesLeadAssignToSalesEmpModel>> assignLeadtoSalesEmp(
    Map<String, dynamic> requestBody,
    String leadId,
  ) async {
    final String url = "$baseUrl/api/v1/lead/update/${leadId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SalesLeadAssignToSalesEmpModel.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Failed to assign lead : ${e.toString()}");
    }
  }

  ///&&&&&&&&&&&&   Sales Tl REPORTING  MANAGEMENT      &&&&&&&&&&&&
  Future<ApiResponse<SalesTLAddMorningEveningReportingModelResponse>> addSalesTlReporting(
    Map<String, dynamic> requestBody,
    String salesTlId,
  ) async {
    final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SalesTLAddMorningEveningReportingModelResponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  // this api tl reporting will showin in HOD SIDE TO show all reporting
  // Future<ApiResponse<SalesTLMorningEveningReportingListModelResponse>> getAllSalesTLReportingList() async {
  //   final String url = "$baseUrl/api/v1/sales/tl/report/all";
  //
  //   try {
  //     final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
  //     if (response.success && response.data != null) {
  //       return ApiResponse.success(
  //         SalesTLMorningEveningReportingListModelResponse.fromJson(response.data!),
  //       );
  //     } else {
  //       return ApiResponse.error(
  //         response.message ?? "Unknown error",
  //         statusCode: response.statusCode,
  //         data: null,
  //       );
  //     }
  //   } catch (e) {
  //     return ApiResponse.error("Get All Sales TL Reporting failed: ${e.toString()}");
  //   }
  // }
  Future<ApiResponse<SalesTLMorningEveningReportingListModelResponse>>  getAllSalesTLReportingList(String userId) async {
    final String url =
        "$baseUrl/api/v1/sales/employee-report/get/today/${userId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SalesTLMorningEveningReportingListModelResponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error(
        "Get All Sales TL Reporting failed: ${e.toString()}",
      );
    }
  }

  ///&&&&&&&&&&&&   Sales Tl REPORTING  MANAGEMENT      &&&&&&&&&&&&
  // Future<ApiResponse<SalesEmpAddMorningEveningReportingModelResponse>> addSalesEmployeeMorningEveningReporting(
  //     Map<String, dynamic> requestBody,
  //     String salesEmployeeId
  //     ) async {
  //   final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesEmployeeId}";
  //
  //   try {
  //     final response = await _dioHelper.post<Map<String, dynamic>>(
  //       url: url,
  //       requestBody: requestBody,
  //       // isAuthRequired: false,
  //     );
  //     if (response.success && response.data != null) {
  //       return ApiResponse.success(
  //         SalesEmpAddMorningEveningReportingModelResponse.fromJson(response.data!),
  //       );
  //     } else {
  //       return ApiResponse.error(
  //         response.message ?? "Unknown error",
  //         statusCode: response.statusCode,
  //         data: null,
  //       );
  //     }
  //   } catch (e) {
  //     return ApiResponse.error("Add Lead failed: ${e.toString()}");
  //   }
  // }
  //
  // Future<ApiResponse<SalesEmpMorningEveningReportingListModelResponse>> getAllSaleeEmployeeReportingList() async {
  //   final String url = "$baseUrl/api/v1/sales/tl/report/all";
  //
  //   try {
  //     final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
  //     if (response.success && response.data != null) {
  //       return ApiResponse.success(
  //         SalesEmpMorningEveningReportingListModelResponse.fromJson(response.data!),
  //       );
  //     } else {
  //       return ApiResponse.error(
  //         response.message ?? "Unknown error",
  //         statusCode: response.statusCode,
  //         data: null,
  //       );
  //     }
  //   } catch (e) {
  //     return ApiResponse.error("Get All Sales TL Reporting failed: ${e.toString()}");
  //   }
  // }

  Future<ApiResponse<SalesEmpAddClientBriefingModel>> addSalesEmpClientBriefing(
    FormData requestBody,
  ) async {
    final String url = "$baseUrl/api/v1/sales/client-briefing/create";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SalesEmpAddClientBriefingModel.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllSalesEmpClientBriefingListModelResponse>> getAllSalesEmpClientBriefingList() async {
    final String url = "$baseUrl/api/v1/sales/client-briefing/get/all";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllSalesEmpClientBriefingListModelResponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  ///// STEPS 4 FOR SALES MANAGEMENT SHEET
  Future<ApiResponse<SalesManagementSheetShowForm1DetailsModelReponse>> getSalesManagementSheetForm1Data(String leadID) async {
    final String url = "$baseUrl/api/v1/lead/get/${leadID}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SalesManagementSheetShowForm1DetailsModelReponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SalesManagementSheetShowForm2DetailsModelReponse>> getSalesManagementSheetForm2Data(String leadID) async {
    final String url =
        "$baseUrl/api/v1/sales/client-briefing/get/project/${leadID}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SalesManagementSheetShowForm2DetailsModelReponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<AddPaymentForm3ModelReponse>> addSalesManagementSheetform3Payment(Map<String, dynamic> requestBody) async {
    final String url = "$baseUrl/api/v1/project/payment/add";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          AddPaymentForm3ModelReponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<AddPaymentForm3ModelReponse>> updateSalesManagementSheetform3Payment(
    Map<String, dynamic> requestBody,
  ) async {
    final String url = "$baseUrl/api/v1/project/payment/update";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          AddPaymentForm3ModelReponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<PendingPaymentForm4ModelReponse>> getPendingPaymentForm4Data(String projectId) async {
    final String url =
        "$baseUrl/api/v1/project/payment/get/single/${projectId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          PendingPaymentForm4ModelReponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  // &&&&&&&&&&&&&&&&&&&&&&&&&& RACCE API &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<ApiResponse<SalesEmpClientBriefingFormListModelResponse>>sendProjectToRacce(String projectID) async {
    final String url =
        "$baseUrl/api/v1/sales/client-briefing/send/to-recce/${projectID}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SalesEmpClientBriefingFormListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }


  ////// 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉  HR MODULE 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉

                                // ✅✅✅✅✅✅✅✅  EMPLOYEE MANAGEMENT ✅✅✅✅✅✅✅
  Future<ApiResponse<HREmployeeListModelResponse>> getHREmployeeList() async {
    final String url = "$baseUrl/hr/employee-profile";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        // isAuthRequired: true,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          HREmployeeListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All employee list failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<HREmployeeListDetailModelResponse>> getHREmployeeDetails(
    String empID,
  ) async {
    final String url = "$baseUrl/hr/employee-profile/${empID}";
    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        isAuthRequired: true,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          HREmployeeListDetailModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }


  Future<ApiResponse<dynamic>> createEmployee({
    required Map<String, dynamic> requestBody,
    required File? photoFile,
  }) async {
    try {
      // FormData banate hain
      final formData = FormData.fromMap(requestBody);
      // Agar photo hai to add karo
      if (photoFile != null && photoFile.existsSync()) {
        formData.files.add(MapEntry(
          'photo', // ← Yeh field name API ke hisaab se hona chahiye (photo ya profilePhoto?)
          await MultipartFile.fromFile(
            photoFile.path,
            filename: photoFile.path.split('/').last,
            contentType: MediaType('image', 'jpeg'), // ya png
          ),
        ));
      }

      final response = await _dioHelper.post(
        url: "$baseUrl/hr/employee-profile",
        requestBody: formData,
      );

      if (response.success && response.data != null) {
        return ApiResponse.success(response.data);
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
        );
      }
    } catch (e, st) {
      print("Upload Error: $e\n$st");
      return ApiResponse.error("Upload failed: $e");
    }
  }

  Future<ApiResponse<UpdateEmployeeModelResponse>> updateEmployee({
    required String employeeId,
    required Map<String, dynamic> requestBody,
     File? photoFile,
  }) async {
    try {
      final formData = FormData.fromMap(requestBody);

      if (photoFile != null && photoFile.existsSync()) {
        formData.files.add(MapEntry(
          'photo', // ← API field name (check backend, agar alag hai to change karna)
          await MultipartFile.fromFile(
            photoFile.path,
            filename: photoFile.path.split('/').last,
          ),
        ));
      }

      final response = await _dioHelper.put(
        url: "$baseUrl/hr/employee-profile/${employeeId}",
        requestBody: formData,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success( UpdateEmployeeModelResponse.fromJson(response.data!),  );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e, st) {
      print("Upload Error: $e\n$st");
      return ApiResponse.error("Upload failed: $e");
    }
  }

  Future<ApiResponse<AllEmpLeaveRequestsListModel>> getAllEmpLeaveRequest() async {

    // url: "$baseUrl/hr/employee-profile/${employeeId}",
    final String url ="$baseUrl/hr/leave/all";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        isAuthRequired: true,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          AllEmpLeaveRequestsListModel.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<LeaveApprovedModel>> leaveApproveApi(
    Object requestBody,
    String leaveId,
  ) async {
    // final String url = "https://hr-management-codecrafter-1.onrender.com/api/v1/leave/aproved/${leaveId}";
    final String url ="$baseUrl/hr/leave/approve/${leaveId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        isAuthRequired: true,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(LeaveApprovedModel.fromJson(response.data!));
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<LeaveRejectedModel>> leaveRejectedApi(
    Object requestBody,
    String leaveId,
  ) async {
    final String url ="$baseUrl/hr/leave/reject/${leaveId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        isAuthRequired: true,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(LeaveRejectedModel.fromJson(response.data!));
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  /// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&& CANDIDATE API  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<ApiResponse<HrCandidatesListModelResponse>>  getHRHiredCandidateList() async {
    final String url = "$baseUrl/hr/candidate";
    // final String url = "$baseUrl/hr/candidate/hired";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        // isAuthRequired: true,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          HrCandidatesListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All employee list failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CandidateDetailsModelResponse>> getHRCandidateDetail(String candidateId) async {
    final String url = "$baseUrl/hr/candidate/${candidateId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(   CandidateDetailsModelResponse.fromJson(response.data!),   );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CandidateHiredStatusChangedModelResponse>> changeCandidateHiredStatus(String candidateId,Map<String, dynamic> requestBody) async {
    final String url = "$baseUrl/hr/candidate/status/${candidateId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(url: url,requestBody: requestBody);
      if (response.success && response.data != null) {
        return ApiResponse.success(CandidateHiredStatusChangedModelResponse.fromJson(response.data!),   );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CandidateScheduleInterviewModelResponse>> candidateInterviewSchedule(String candidateId,Map<String, dynamic> requestBody) async {
    final String url = "$baseUrl/hr/candidate/interview/${candidateId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(url: url,requestBody: requestBody);
      if (response.success && response.data != null) {
        return ApiResponse.success(CandidateScheduleInterviewModelResponse.fromJson(response.data!),   );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UploadCandidateOfferLetterResumeModelResponse>> uploadCandidateDocument({
    required File documentFile,
    required String documentType, // For URL: "resume" or "offer-letter"
    required String fieldName,    // For form field: "resume" or "offerLatter"
    required String candidateId,
  }) async {
    try {
      // Build form data with the correct key name expected by backend
      final formData = FormData.fromMap({
        fieldName: await MultipartFile.fromFile(
          documentFile.path,
          filename: documentFile.path.split('/').last,
        ),
      });

      print("📤 Uploading Candidate Document...");
      print("➡️ URL Type: $documentType");
      print("➡️ Field Name: $fieldName");
      print("➡️ Candidate ID: $candidateId");
      print("➡️ File Path: ${documentFile.path}");

      final response = await _dioHelper.put(
        url: "$baseUrl/hr/candidate/$documentType/$candidateId",
        requestBody: formData,
        isAuthRequired: true,
      );

      print("✅ Upload Response: $response");

      if (response.success && response.data != null) {
        return ApiResponse.success( UploadCandidateOfferLetterResumeModelResponse.fromJson(response.data!), );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error occurred",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      print("❌ Upload failed: $e");
      return ApiResponse.error("Upload failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<AddEmpDocumentModelResponse>> uploadDocuments({
    required Map<String, File> documents,
    required String empId,
  }) async {
    try {
      final formData = FormData();

      // documentTypes array
      final List<String> documentTypes = [];
      final List<MapEntry<String, MultipartFile>> fileEntries = [];

      // Define default labels to match types
      const defaultDocs = [
        {"label": "Aadhaar Card", "name": "Aadhaar"},
        {"label": "PAN Card", "name": "PAN"},
        {"label": "Bank Passbook", "name": "Passbook"},
        {"label": "High School Marksheet", "name": "High School"},
        {"label": "Graduation Marksheet", "name": "Graduation"},
        {"label": "Salary Slips", "name": "Salary Slip"},
      ];

      // Add each document + type
      documents.forEach((label, file) {
        final match = defaultDocs.firstWhere(
          (doc) => doc['label'] == label,
          orElse: () => {"name": label},
        );

        documentTypes.add(match['name']!);

        fileEntries.add(
          MapEntry(
            "documents", // must match backend field
            MultipartFile.fromFileSync(
              file.path,
              filename: file.path.split('/').last,
            ),
          ),
        );
      });

      // Add files and documentTypes[] into form data
      formData.files.addAll(fileEntries);
      for (final type in documentTypes) {
        formData.fields.add(MapEntry("documentTypes[]", type));
      }

      print("✅ FormData fields:");
      for (var f in formData.fields) {
        print("${f.key}: ${f.value}");
      }

      print("✅ employeeId: $empId");

      final response = await _dioHelper.put(
        url: "$baseUrl/hr/employee-profile/$empId/documents",
        requestBody: formData,
        isAuthRequired: true,
      );

      print("✅ Upload Documents Response: $response");
      if (response.success && response.data != null) {
        return ApiResponse.success(
          AddEmpDocumentModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Upload failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<AddEmpDocumentModelResponse>> UpdateEmpDocuments({
    required Map<String, File> documents,
    required String empId,
  }) async {
    try {
      final formData = FormData();

      // Define mapping between UI labels and document names
      const defaultDocs = [
        {"label": "Aadhaar Card", "name": "Aadhaar"},
        {"label": "PAN Card", "name": "PAN"},
        {"label": "Bank Passbook", "name": "Passbook"},
        {"label": "High School Marksheet", "name": "High School"},
        {"label": "Graduation Marksheet", "name": "Graduation"},
        {"label": "Salary Slips", "name": "Salary Slip"},
      ];

      // Lists to hold data
      final List<MapEntry<String, MultipartFile>> fileEntries = [];
      final List<String> documentTypes = [];

      // Add each selected document + corresponding document type
      documents.forEach((label, file) {
        final match = defaultDocs.firstWhere(
          (doc) => doc['label'] == label,
          orElse: () => {"name": label},
        );

        documentTypes.add(match['name']!);

        fileEntries.add(
          MapEntry(
            "documents", // same key for all files
            MultipartFile.fromFileSync(
              file.path,
              filename: file.path.split('/').last,
            ),
          ),
        );
      });

      // Add all files
      formData.files.addAll(fileEntries);

      // Add corresponding documentTypes[] fields
      for (final type in documentTypes) {
        formData.fields.add(MapEntry("documentTypes[]", type));
      }

      print("✅ FormData fields before sending:");
      for (var field in formData.fields) {
        print("${field.key}: ${field.value}");
      }

      print("✅ Employee ID: $empId");

      final response = await _dioHelper.put(
        url: "$baseUrl/hr/employee-profile/$empId/documents",
        requestBody: formData,
        isAuthRequired: true,
      );

      print("✅ Upload Documents Response: $response");
      if (response.success && response.data != null) {
        return ApiResponse.success(
          AddEmpDocumentModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error(
        "Update Employee Documents failed: ${e.toString()}",
      );
    }
  }

  Future<ApiResponse<GetAllEmpDocuemtsListModel>> getEmpDocumentsList(
    String empId,
  ) async {
    // Map<String, dynamic> response = await _dioHelper.get(
    //     url: 'https://hr-management-codecrafter-1.onrender.com/api/v1/employee/document/get/$empId');

    final String url =
        "https://hr-management-codecrafter-1.onrender.com/api/v1/employee/document/get/${empId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        isAuthRequired: true,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllEmpDocuemtsListModel.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
    // return GetAllEmpDocuemtsListModel.fromJson(response);
  }

  Future<ApiResponse<GetAllEmpDocuemtsListModel>> deleteSingleEmpDocument({
    required String documentType, // Now accepting String for document type
    required String fileName, // Now accepting String for document type
    required String empId,
  }) async {
    try {
      final formData = FormData();
      // Add the documentType as a field in the form data
      // This key 'documentType' should match what your backend expects
      formData.files.add(
        MapEntry(
          documentType,
          MultipartFile.fromBytes(
            Uint8List(0), // An empty byte array
            filename: fileName, // Crucially, provide the original filename
            contentType: MediaType(
              'application',
              'octet-stream',
            ), // Generic binary type
          ),
        ),
      );

      print("✅ employeeId for delete : $empId");
      print("✅ documentType for delete : $documentType");

      final response = await _dioHelper.put(
        url:
            "https://hr-management-codecrafter-1.onrender.com/api/v1/employee/document/delete-one/${empId}",
        // Your delete endpoint
        requestBody: formData,
        // Send form data containing documentType
        // options: Options(headers: {"Content-Type": "multipart/form-data"}),
        isAuthRequired: true,
      );

      print("✅ Delete Documents Response: $response");

      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllEmpDocuemtsListModel.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }


  // ✅✅✅✅✅✅✅✅  JOB MANAGEMENT ✅✅✅✅✅✅✅

  Future<ApiResponse<GetAllJobPostingListModelResponse>>  getHRJobOpeningList() async {
    final String url = "$baseUrl/hr/job-post";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        // isAuthRequired: true,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(  GetAllJobPostingListModelResponse.fromJson(response.data!), );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All employee list failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CreateJobPostingModelResponse>> createHrJobPosting(
      Map<String, dynamic> requestBody,
      ) async {
    final String url = "$baseUrl/hr/job-post";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateJobPostingModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateJobPostingModelResponse>> updateHrJobPosting(
      String jobPostId,
      Map<String, dynamic> requestBody,
      ) async {
    final String url = "$baseUrl/hr/job-post/${jobPostId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateJobPostingModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CloseJobPostingModelResponse>> closeHrJobPosting(
      String jobPostId,
      ) async {
    final String url = "$baseUrl/hr/job-post/close/${jobPostId}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(
        url: url,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CloseJobPostingModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<DeleteJobPostingModelResponse>> deleteHrJobPosting(
      String jobPostId,
      ) async {
    final String url = "$baseUrl/hr/job-post/permanent/${jobPostId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(
        url: url,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          DeleteJobPostingModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleobPostingModelResponse>> singleHrJobPosting(
      String jobPostId,
      ) async {
    final String url = "$baseUrl/hr/job-post/${jobPostId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SingleobPostingModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }


  // ✅✅✅✅✅✅✅✅  HR ATTENDANCE MANAGEMENT ✅✅✅✅✅✅✅

  Future<ApiResponse<HrAllEmployeeAttendanceListModelResponse>>  getHRAllEmployeeAttendanceList() async {
    final String url = "$baseUrl/hr/attendance/all";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        // isAuthRequired: true,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(HrAllEmployeeAttendanceListModelResponse.fromJson(response.data!), );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All employee list failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<HrEmployeeAttendanceCalenderViewModelResponse>>  getHRAllEmployeeAttendanceCalenderView({
    required Map<String, dynamic> queryParameters,
  }) async {
    final String url = "$baseUrl/hr/attendance/calendar";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters, // ✅ from provider
        // isAuthRequired: true,
      );

      if (response.success && response.data != null) {
        return ApiResponse.success(
          HrEmployeeAttendanceCalenderViewModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error(
        "Get All employee attendance calendar failed: ${e.toString()}",
      );
    }
  }

  // ✅✅✅✅✅✅✅✅  HR PAYROLL MANAGEMENT ✅✅✅✅✅✅✅

  Future<ApiResponse<HrPayrollManagementListModelResponse>>  getHrPayrollManagementList({  required Map<String, dynamic> queryParameters,}) async {
    final String url = "$baseUrl/hr/payroll/viewAll";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters, // ✅ from provider
        // isAuthRequired: true,
      );

      if (response.success && response.data != null) {
        return ApiResponse.success( HrPayrollManagementListModelResponse.fromJson(response.data!), );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error(
        "Get All employee attendance calendar failed: ${e.toString()}",
      );
    }
  }

  Future<ApiResponse<SalaryApprovedPayrollModelResponse>>  hrPayrollSalaryAction({  required Map<String, dynamic> queryParameters, required String action,}) async {
    // final String url = "$baseUrl/hr/payroll/approve";
    final String endpoint = action == 'approve' ? 'approve' : 'reject';
    final String url = "$baseUrl/hr/payroll/$endpoint";
    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: queryParameters, // ✅ from provider
        // isAuthRequired: true,
      );

      if (response.success && response.data != null) {
        return ApiResponse.success( SalaryApprovedPayrollModelResponse.fromJson(response.data!), );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error(
        "Get All employee attendance calendar failed: ${e.toString()}",
      );
    }
  }







  /// 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉 SALES DASHBOARD SCREEN 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉

  Future<ApiResponse<SalesEmployeeDashboardDataModelResposne>> salesEmpDashboardData(String userId) async {
    final String url = "$baseUrl/api/v1/sales/dashboard/get/${userId}";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SalesEmployeeDashboardDataModelResposne.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<GetAllEmployeeListModelResponse>>getAllEmployeeList() async {
    final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllEmployeeListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }



  /// 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉 VENDOR MODULE 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉

  Future<ApiResponse<VendorAddCategoryModelResponse>> addVendorCategory(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    // final String url = "https://55vfm9n3-3000.inc1.devtunnels.ms/api/v1/vendor/add-category";
    final String url = "$vendorbaseUrl/vendor/add-category";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorAddCategoryModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorUpdateCategoryModelResponse>> updateVendorCategory(
    Map<String, dynamic> requestBody,
    String categoryId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$vendorbaseUrl/vendor/update-category/${categoryId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorUpdateCategoryModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update Category failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorCategoryListModelResponse>>  getAllVendorCategoryList() async {
    final String url = "$vendorbaseUrl/vendor/get-categories";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorCategoryListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorUpdateCategoryModelResponse>> deleteVendorCategory(
    // Map<String, dynamic> requestBody,
    String categoryId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$vendorbaseUrl/vendor/delete-category/${categoryId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(
        url: url,
        // requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorUpdateCategoryModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update Category failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorAddProductModelResponse>> addVendorProducts(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$vendorbaseUrl/vendor/product/add";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorAddProductModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorUpdateProductModelResponse>> updateVendorProduct(
    Map<String, dynamic> requestBody,
    String productId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$vendorbaseUrl/vendor/product/update/${productId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorUpdateProductModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update Category failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorProductManagemetnListModelResponse>>  getAllVendorProductList() async {
    final String url = "$vendorbaseUrl/vendor/product/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorProductManagemetnListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorSingleProductModelResponse>> getVendorSingleProduct(
    String productId,
  ) async {
    final String url = "$vendorbaseUrl/vendor/single-product/${productId}";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorSingleProductModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  ////////////////// PURCHASE ORDER MANAGEMENT //////////////////////////

  Future<ApiResponse<VendorPurchaseOrderLIstModelResponse>>  getAllVendorPurchaseOrderList(int? page, int? limit) async {
    final String url =
        "$vendorbaseUrl/vendor/get-invoices?page=$page&limit=$limit";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorPurchaseOrderLIstModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorPurchaseOrderPaymentUpdateModelResponse>> updateVendorInvoicePayment(
    Map<String, dynamic> requestBody,
    String invoiceId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$vendorbaseUrl/vendor/update-invoice-payment/${invoiceId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorPurchaseOrderPaymentUpdateModelResponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update Payment failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorAddCustomerModelResponse>> addVendorCustoemr(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$vendorbaseUrl/vendor/create-customers";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorAddCustomerModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Customer failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorCustomerListModelResponse>>  getAllVendorCustomerList() async {
    final String url = "$vendorbaseUrl/vendor/get-customers";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorCustomerListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorProfileModelResponse>> getVendorProfileData() async {
    final String url = "$vendorbaseUrl/vendor/profile/get";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorProfileModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  //&&&&&&&&&&&&&&&&&&&&&&&&&&& VENDOR DASHBOARD API &&&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<ApiResponse<VendorDashboardTopCardDataModelResponse>> getVendorDashboardData() async {
    final String url = "$vendorbaseUrl/vendor/dashboard-top/data";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorDashboardTopCardDataModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorDashboardChartDataModelResponse>>  getVendorDashboardChartData() async {
    final String url = "$vendorbaseUrl/vendor/dashboard-chart/data";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorDashboardChartDataModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorRecentOrderModelResponse>> getAllVendorRecentOrderList(int? page, int? limit) async {
    final String url =
        "$vendorbaseUrl/vendor/dashboard-invoices/data?page=$page&limit=$limit";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorRecentOrderModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorBankDetailListModelResponse>>  getVendorBankDetailList() async {
    final String url = "$vendorbaseUrl/vendor/get-bankdetails";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorBankDetailListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorCreateInvoiceModelResponse>> createInvoice(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$vendorbaseUrl/vendor/create-invoices";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorCreateInvoiceModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorCreateDraftModelResponse>> createInvoiceDraft(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$vendorbaseUrl/vendor/create-invoicedraft";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorCreateDraftModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> deleteVendorDraft(
    String draftId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";

    final String url = "$vendorbaseUrl/vendor/delete-invoicedraft/${draftId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(
        url: url,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SingleMessageModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update Payment failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> addBankDetails(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$vendorbaseUrl/vendor/add-bankdetails";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SingleMessageModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add Lead failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorInvoiceDraftListModelResponse>>  getAllVendorInvoiceDraftList(
    int? page,
    int? limit,
    String startDate,
    String endDate,
  ) async {
    final Map<String, dynamic> queryParameters = {'page': page, 'limit': limit};

    if (startDate != null && startDate.isNotEmpty) {
      queryParameters['startDate'] = startDate;
    }
    if (endDate != null && endDate.isNotEmpty) {
      queryParameters['endDate'] = endDate;
    }

    final String url = "$vendorbaseUrl/vendor/get-invoicedraft";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorInvoiceDraftListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<VendorSingleInvoiceDraftModelResponse>> getSingleInvoiceDraftDetail(String draftId) async {
    final String url =
        "$vendorbaseUrl/vendor/get-single-invoicedraft/${draftId}";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          VendorSingleInvoiceDraftModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  /// 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉 TECHNOLOGY MODULE 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉

  Future<ApiResponse<TechMangerAssetsListModelResponse>> getAllTechAssetsList(
    Map<String, dynamic> queryParameters,
  ) async {
    final String url = "$technologybaseUrl/tech/asset/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerAssetsListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechMangerAddAssetModelResponse>> addTechAssets(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/tech/asset/add";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerAddAssetModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechMangerUpdateAssetModelResponse>> updateTechAssets(
    Map<String, dynamic> requestBody,
    String assetId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/tech/asset/update/${assetId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerUpdateAssetModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> deleteTechAssets(
    String assetId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/tech/asset/delete/${assetId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SingleMessageModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Delete assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechMangerAssetAssignedModelResponse>> assigAsset(
    String assetId,
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/tech/asset/patch-assign/${assetId}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerAssetAssignedModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Assign assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechEngineerAssetsListModelResponse>>  getAllTechEngineerAssetsList(Map<String, dynamic> queryParameters) async {
    final String url = "$technologybaseUrl/tech/asset/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechEngineerAssetsListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechEngineerLicenseSoftwareListModelResponse>> getAllTechEngineerLicenceSoftwareList(
    Map<String, dynamic> queryParameters,
  ) async {
    final String url = "$technologybaseUrl/tech/license-software/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechEngineerLicenseSoftwareListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechEngineerAssignedTicketListModelResponse>>  getAllTechEngineerAssignedList(Map<String, dynamic> queryParameters) async {
    final String url = "$technologybaseUrl/tech/helpdesk/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechEngineerAssignedTicketListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechEngineerAssignedTicketUpdateStatusModelResponse>>  updateTechEngineerAssignedTicketStatus(
    String ticketId,
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/helpdesk/ticket-status/${ticketId}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechEngineerAssignedTicketUpdateStatusModelResponse.fromJson(
            response.data!,
          ),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Assign assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TicketRaisedByTechEngineerModelResponse>> ticketRaisedByTechEngineer({
    required Map<String, File> documents,
    required String ticketType,
    required String priority,
    required String description,
    required String empId,
  }) async {
    try {
      final formData = FormData();
      // 👉 Add text fields (simple strings)
      formData.fields.addAll([
        MapEntry('ticketType', ticketType),
        MapEntry('priority', priority),
        MapEntry('description', description),
      ]);
      // Backend expected field keys
      final fieldKeyMapping = {'attachment': 'attachment'};
      // Add files dynamically
      documents.forEach((label, file) {
        final fieldKey = fieldKeyMapping[label] ?? label.replaceAll(' ', '_');
        formData.files.add(
          MapEntry(
            fieldKey, // This must match the backend's Multer config
            /// docType.replaceAll(" ", "_").toLowerCase(), // e.g., pan_card
            MultipartFile.fromFileSync(
              file.path,
              filename: file.path.split('/').last,
            ),
          ),
        );
      });

      Map<String, dynamic>? headers;
      if (empId != null) {
        headers = {'userId': empId};
      }

      print("✅ employeeiddd : $empId");
      final response = await _dioHelper.post(
        url: "$technologybaseUrl/tech/helpdesk/add",
        // Replace with actual URL
        requestBody: formData,
        isAuthRequired: true,
        customHeaders: headers,
      );

      print("✅ Upload Documents Response: $response");
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TicketRaisedByTechEngineerModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Leads failed: ${e.toString()}");
    }
  }

  /////////////////////////// LICENCE AND SOFTWARE /////////////////////////

  Future<ApiResponse<TechLicenceListModelResponse>>  getAllTechLicenceSoftwareList(Map<String, dynamic> queryParameters) async {
    final String url = "$technologybaseUrl/tech/license-software/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechLicenceListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechMangerAddLicenceSoftwareModelResponse>>  addTechLicenceSoftware(Map<String, dynamic> requestBody) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/tech/license-software/add";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerAddLicenceSoftwareModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechMangerUpdateLicenceSoftwareModelResponse>> updateTechLicenceSoftware(
    Map<String, dynamic> requestBody,
    String licenceSoftwareId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/license-software/update/${licenceSoftwareId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerUpdateLicenceSoftwareModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> deleteLicenseSoftware(
    String licenseId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/license-software/delete/${licenseId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SingleMessageModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Delete assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechMangerAssignLicenceSoftwareModelResponse>> assigLicenseSoftware(
    String licenseId,
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/license-software/assign/${licenseId}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerAssignLicenceSoftwareModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Assign assets failed: ${e.toString()}");
    }
  }

  /////////////////////////// NETWORK AND INFRASTRUCTURE /////////////////////////

  Future<ApiResponse<TechAllDevicesListModelResponse>> getAllTechDevicesList(
    Map<String, dynamic> queryParameters,
  ) async {
    final String url = "$technologybaseUrl/tech/network-infrastructure/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechAllDevicesListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechAddNewDeviceModelResponse>> addNewTechDevice(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/tech/network-infrastructure/add";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechAddNewDeviceModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechUpdateDeviceModelResponse>> updateTechDevice(
    Map<String, dynamic> requestBody,
    String networkDevicesID,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/network-infrastructure/update/${networkDevicesID}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechUpdateDeviceModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> deleteTechDevice(
    String networkDevicesID,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/network-infrastructure/delete/${networkDevicesID}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SingleMessageModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Delete assets failed: ${e.toString()}");
    }
  }

  /////////////////////////// VENDOR AMC MANAGEMENT /////////////////////////

  Future<ApiResponse<TechVendorAMCListModelResponse>> getAllVendorAMCList(
    Map<String, dynamic> queryParameters,
  ) async {
    final String url = "$technologybaseUrl/tech/vendor-management/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechVendorAMCListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<AddNewTechVendorAMCModelResponse>> addNewTechAMC(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/tech/vendor-management/add";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          AddNewTechVendorAMCModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateTechVendorAMCModelResponse>> updateTechAMC(
    Map<String, dynamic> requestBody,
    String networkDevicesID,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/vendor-management/update/${networkDevicesID}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateTechVendorAMCModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> deleteTechAMC(
    String networkDevicesID,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/vendor-management/delete/${networkDevicesID}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SingleMessageModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Delete assets failed: ${e.toString()}");
    }
  }

  /////////////////////////// DATA AND SECURITY AND ACCESS CONTROL /////////////////////////

  Future<ApiResponse<TechDataSecurityAccessListModelResponse>> getAllAccessControlList(Map<String, dynamic> queryParameters) async {
    final String url = "$technologybaseUrl/tech/access-control/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechDataSecurityAccessListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechAddAccessCotrolModelResponse>> addNewTechAccessControl(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/tech/access-control/add";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechAddAccessCotrolModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechUpdateAccessControlModelResponse>> updateTechAccessControl(
    Map<String, dynamic> requestBody,
    String accessControlId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/access-control/update/${accessControlId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechUpdateAccessControlModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Update assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<SingleMessageModelResponse>> deleteTechAccessControl(
    String accessControlId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/access-control/delete/${accessControlId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          SingleMessageModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Delete assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechRecokedAccessControlModelResponse>> revokedAccessControl(
    String accessControlId,
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/access-control/revoke/${accessControlId}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechRecokedAccessControlModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Assign assets failed: ${e.toString()}");
    }
  }

  ///////////////////////////  TICKETING SYSTEM  MANAGEMENT /////////////////////////

  Future<ApiResponse<TechIHelpDeskAndTicketingModelResponse>> getAllMangerHelpDeskTicketList(Map<String, dynamic> queryParameters) async {
    final String url = "$technologybaseUrl/tech/helpdesk/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechIHelpDeskAndTicketingModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateAssignTicketMOdelResonse>> updateTechAssignTicket(
    String ticketId,
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/tech/helpdesk/assign/${ticketId}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateAssignTicketMOdelResonse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Assign assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateTicketStatusModelResponse>> updateTechTicketStatus(
    String ticketId,
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/tech/helpdesk/ticket-status/${ticketId}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateTicketStatusModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Assign assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechMangerDashboardTopCardDataModelResponse>> getTechManagerDashboardTopCardData() async {
    final String url = "$vendorbaseUrl/tech/dashboard/summary";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerDashboardTopCardDataModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechEngineerDashboardTopCardModelResponse>> getTechEngineerDashboardTopCardData(String? userId) async {
    final String url = "$vendorbaseUrl/tech/dashboard/summary";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      Map<String, dynamic>? headers;
      if (userId != null) {
        headers = {'userId': userId};
      }

      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        isAuthRequired: true,
        customHeaders: headers,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechEngineerDashboardTopCardModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechMangerDashboardPicChartDataModelResponse>>  getTechManagerDashboardChartData() async {
    final String url = "$vendorbaseUrl/tech/dashboard/assets-distribution";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerDashboardPicChartDataModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<TechMangerDashboardBarChartDataModelResponse>> getTechManagerDashboardBarGraphData() async {
    final String url = "$vendorbaseUrl/tech/dashboard/tickets-by-department";

    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          TechMangerDashboardBarChartDataModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All Customer List failed: ${e.toString()}");
    }
  }

  /// 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉 MARKETING MODULE 👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉👉

  Future<ApiResponse<GetAllCompaignListModelResponse>> getAllMarketingCompaignList(Map<String, dynamic> queryParameters) async {
    final String url = "$technologybaseUrl/marketing/campaign/get";
    // final String url = "$baseUrl/api/v1/sales/all/employee";

    try {
      final response = await _dioHelper.get<Map<String, dynamic>>(
        url: url,
        queryParams: queryParameters,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          GetAllCompaignListModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Get All compaign failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateCompaignStatusModelResponse>> updateMarketingCompaignStatus(
    String compaignId,
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/marketing/campaign/status/${compaignId}";

    try {
      final response = await _dioHelper.patch<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateCompaignStatusModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Assign assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<DeleteCompaignModelResponse>> deleteCampaign(
    String campaignId,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url =
        "$technologybaseUrl/marketing/campaign/delete/${campaignId}";

    try {
      final response = await _dioHelper.delete<Map<String, dynamic>>(url: url);
      if (response.success && response.data != null) {
        return ApiResponse.success(
          DeleteCompaignModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Delete assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<CreateCampaignModelResponse>> createNewCampaign(
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "$baseUrl/api/v1/sales/tl-report/create/${salesTlId}";
    final String url = "$technologybaseUrl/marketing/campaign/create";

    try {
      final response = await _dioHelper.post<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
        // isAuthRequired: false,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          CreateCampaignModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Add assets failed: ${e.toString()}");
    }
  }

  Future<ApiResponse<UpdateCampaignModelResponse>> updateCampaign(
    String campaignId,
    Map<String, dynamic> requestBody,
  ) async {
    // final String url = "https://55vfm9n3-3000.inc1.devtunnels.ms/api/v1/marketing/campaign/update/${campaignId}";
    final String url =
        "$technologybaseUrl/marketing/campaign/update/${campaignId}";

    try {
      final response = await _dioHelper.put<Map<String, dynamic>>(
        url: url,
        requestBody: requestBody,
      );
      if (response.success && response.data != null) {
        return ApiResponse.success(
          UpdateCampaignModelResponse.fromJson(response.data!),
        );
      } else {
        return ApiResponse.error(
          response.message ?? "Unknown error",
          statusCode: response.statusCode,
          data: null,
        );
      }
    } catch (e) {
      return ApiResponse.error("Assign assets failed: ${e.toString()}");
    }
  }
}
