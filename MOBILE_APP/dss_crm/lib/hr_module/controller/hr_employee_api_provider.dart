import 'dart:io';

import 'package:dio/dio.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/candidate_detail_model.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/candidate_list_model.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/candidate_schedule_interview_model.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/chnage_candidate_hired_status_model.dart';
import 'package:dss_crm/hr_module/screen/employee/employee_attendance/model/hr_emp_attendance_calender_view_model.dart';
import 'package:dss_crm/hr_module/screen/employee/employee_attendance/model/hr_emp_attendance_list_model.dart';
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
import 'package:dss_crm/sales_module/sales_tl/employee/employee_list_model.dart';
import 'package:flutter/material.dart';
import '../../network_manager/api_response.dart';
import '../../network_manager/repository.dart';
import '../../utils/custom_snack_bar.dart';
import '../../utils/full_screen_loader_utiil.dart';

class HREmployeeApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  String _errorMessage = "";
  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;
  String? _createdEmployeeId;
  String? get createdEmployeeId => _createdEmployeeId;

  ApiResponse<HREmployeeListModelResponse>? _getAllEmployeeListModel;
  ApiResponse<HREmployeeListModelResponse>? get getAllEmployeeListModel => _getAllEmployeeListModel;
  HREmployeeListDetailModelResponse? _employeeListDetailModel;
  HREmployeeListDetailModelResponse? get employeeListDetailModel =>_employeeListDetailModel;
  ApiResponse<UpdateEmployeeModelResponse>? _updateEmployeeModelResponse;
  ApiResponse<UpdateEmployeeModelResponse>? get updateEmployeeModelResponse =>_updateEmployeeModelResponse;

  ApiResponse<HrCandidatesListModelResponse>? _getAllCandidateListModel;
  ApiResponse<HrCandidatesListModelResponse>? get getAllCandidateListModel => _getAllCandidateListModel;
  ApiResponse<CandidateDetailsModelResponse>? _getCandidateDetailModelResponse;
  ApiResponse<CandidateDetailsModelResponse>?get getCandidateDetailModelResponse => _getCandidateDetailModelResponse;
  ApiResponse<CandidateHiredStatusChangedModelResponse>? _changeCandidateHiredStatusModelResponse;
  ApiResponse<CandidateHiredStatusChangedModelResponse>? get changeCandidateHiredStatusModelResponse => _changeCandidateHiredStatusModelResponse;
  ApiResponse<GetAllJobPostingListModelResponse>? _getAllJobPostingListModel;
  ApiResponse<GetAllJobPostingListModelResponse>? get getAllJobPostingListModel => _getAllJobPostingListModel;
  ApiResponse<SingleobPostingModelResponse>? _getSingleJobPostingListModel;
  ApiResponse<SingleobPostingModelResponse>? get getSingleJobPostingListModel =>_getSingleJobPostingListModel;
  ApiResponse<CreateJobPostingModelResponse>? _createHrJobPostingListModel;
  ApiResponse<CreateJobPostingModelResponse>? get createHrJobPostingListModel => _createHrJobPostingListModel;
  ApiResponse<UpdateJobPostingModelResponse>? _updateHrJobPostingListModel;
  ApiResponse<UpdateJobPostingModelResponse>? get updateHrJobPostingListModel => _updateHrJobPostingListModel;
  ApiResponse<CloseJobPostingModelResponse>? _closeHrJobPostingListModel;

  ApiResponse<CloseJobPostingModelResponse>? get closeHrJobPostingListModel => _closeHrJobPostingListModel;

  ApiResponse<DeleteJobPostingModelResponse>? _deleteHrJobPostingListModel;

  ApiResponse<DeleteJobPostingModelResponse>? get deleteHrJobPostingListModel =>_deleteHrJobPostingListModel;

  ApiResponse<HrAllEmployeeAttendanceListModelResponse>?_getHrAllEmployeeAttendanceListModel;

  ApiResponse<HrAllEmployeeAttendanceListModelResponse>?get getHrAllEmployeeAttendanceListModel =>_getHrAllEmployeeAttendanceListModel;

  ApiResponse<HrEmployeeAttendanceCalenderViewModelResponse>? _getHrAllEmployeeAttendanceCalenderViewModel;

  ApiResponse<HrEmployeeAttendanceCalenderViewModelResponse>? get getHrAllEmployeeAttendanceCalenderViewModel =>_getHrAllEmployeeAttendanceCalenderViewModel;

  ApiResponse<HrPayrollManagementListModelResponse>? _getHrPayrollManagementListModel;
  ApiResponse<HrPayrollManagementListModelResponse>?get getHrPayrollManagementListModel => _getHrPayrollManagementListModel;

  ApiResponse<SalaryApprovedPayrollModelResponse>? _hrPayrollSalaryApprovedModelResponse;
  ApiResponse<SalaryApprovedPayrollModelResponse>?get hrPayrollSalaryApprovedModelResponse => _hrPayrollSalaryApprovedModelResponse;

  ApiResponse<CandidateScheduleInterviewModelResponse>? _candidateScheduleInterviewModelResponse;
  ApiResponse<CandidateScheduleInterviewModelResponse>?get candidateScheduleInterviewModelResponse => _candidateScheduleInterviewModelResponse;

  /// Set Loading State
  void _setLoadingState(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Set Error State
  void _setErrorState(String message) {
    _errorMessage = message;
    _setLoadingState(false);
  }

  Future<void> getAllHREmpList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getHREmployeeList();
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

  Future<bool> getHREmployeeDetail(String employeeId) async {
    _setLoadingState(true);
    _errorMessage = "";
    _employeeListDetailModel = null;

    try {
      final response = await _repository.getHREmployeeDetails(employeeId);

      if (response.data != null) {
        print("   Employee detail fetched successfully");
        _employeeListDetailModel = response.data;
        _setLoadingState(false);
        return true;
      } else {
        _setErrorState(response.message ?? "Failed to fetch employee detail");
      }
    } catch (error) {
      _setErrorState("⚠️ API Error: $error");
    }

    return false;
  }

  Future<void> createEmployee({
    required BuildContext context,
    required Map<String, dynamic> requestBody,
    required File? photoFile,
  }) async {
    FullScreenLoader.show(context);
    notifyListeners();

    try {
      final response = await _repository.createEmployee(
        requestBody: requestBody,
        photoFile: photoFile,
      );

      if (response.success == true && response.data != null) {
        // Extract employeeId from response
        final employeeId =
            response.data['data']?['sId'] ?? response.data['data']?['_id'];
        _createdEmployeeId = employeeId;

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.green,
          message: response.message ?? "Employee created!",
        );
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.red,
          message: response.message ?? "Failed to create.",
        );
      }
    } catch (e) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message: "Error: $e",
      );
    } finally {
      FullScreenLoader.hide(context);
      notifyListeners();
    }
  }

  Future<void> updateEmployee({
    required String employeId,
    required Map<String, dynamic> requestBody,
    File? photoFile,
    required BuildContext context,
  }) async {
    FullScreenLoader.show(context);
    notifyListeners();

    try {
      final response = await _repository.updateEmployee(
        employeeId: employeId,
        requestBody: requestBody,
        photoFile: photoFile,
      );
      _updateEmployeeModelResponse = response;
      print("🟢 Final API Response: ${response.data}");

      if (response.success == true) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.green,
          message: response.message ?? "Employee created successfully!",
        );
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.red,
          message: response.message ?? "Failed to create employee.",
        );
      }
    } catch (e) {
      print("❌ Error in Provider: $e");
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message: "Error: ${e.toString()}",
      );
    } finally {
      FullScreenLoader.hide(context);
      notifyListeners();
    }
  }

  Future<void> getAllHRHiredCandidatesList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getHRHiredCandidateList();
      _getAllCandidateListModel = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load candidate!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllCandidateListModel = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getCandidateDetails(
    BuildContext context,
    String candidateId,
  ) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getHRCandidateDetail(candidateId);
      _getCandidateDetailModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load candidate!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getCandidateDetailModelResponse = ApiResponse.error(
        "Something went wrong: $e",
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> changeCandidateHiredStatus(
    BuildContext context,
    String candidateId,
    Map<String, dynamic> requestBody,
  ) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.changeCandidateHiredStatus(
        candidateId,
        requestBody,
      );
      _changeCandidateHiredStatusModelResponse = response;
      if (response.success && response.data != null) {
        // Success Snackbar
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Status updated successfully!",
          backgroundColor: Colors.green,
        );
        // Navigator.pop(context,true);
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Failed to update status",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _changeCandidateHiredStatusModelResponse = ApiResponse.error(
        "Something went wrong: $e",
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  Future<void> candidateScheduleInterview(
    BuildContext context,
    String candidateId,
    Map<String, dynamic> requestBody,
  ) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.candidateInterviewSchedule(
        candidateId,
        requestBody,
      );
      _candidateScheduleInterviewModelResponse = response;
      if (response.success && response.data != null) {
        // Success Snackbar
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Status updated successfully!",
          backgroundColor: Colors.green,
        );
        // Navigator.pop(context,true);
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Failed to update status",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _candidateScheduleInterviewModelResponse = ApiResponse.error(
        "Something went wrong: $e",
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }















  Future<void> uploadCandidateDocument({
    required BuildContext context,
    required File documentFile,
    required String documentType, // For URL: "resume" or "offer-letter"
    required String fieldName,    // For form field: "resume" or "offerLatter"
    required String candidateId,
  }) async {
    FullScreenLoader.show(context);
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.uploadCandidateDocument(
        documentFile: documentFile,
        documentType: documentType,
        fieldName: fieldName,
        candidateId: candidateId,
      );

      if (response.success && response.data != null) {
        // ✅ Show success message
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.green,
          message:
              response.data?.message ??
              "${documentType == "resume" ? "Resume" : "Offer Letter"} uploaded successfully!",
        );

        // ✅ Optionally refresh candidate details after upload
        await getCandidateDetails(context, candidateId);
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.red,
          message:
              response.message ??
              "Failed to upload ${documentType == "resume" ? "resume" : "offer letter"}",
        );
      }
    } catch (e) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message: "Upload failed: ${e.toString()}",
      );
    } finally {
      FullScreenLoader.hide(context);
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAllHRJobPostingList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getHRJobOpeningList();
      _getAllJobPostingListModel = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load candidate!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllJobPostingListModel = ApiResponse.error(
        "Something went wrong: $e",
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createHrJobPosting(
    BuildContext context,
    Map<String, dynamic> body,
  ) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createHrJobPosting(body);
      _createHrJobPostingListModel = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Job Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true);
      } else {
        debugPrint("Job Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Job Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Job Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateHrJobPost(
    BuildContext context,
    String jobPostId,
    Map<String, dynamic> body,
  ) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateHrJobPosting(jobPostId, body);
      _updateHrJobPostingListModel = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Job Post Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        // Navigator.pop(context, true); // Pass true as result
        Navigator.pop(context, true);
        // Refresh job list after update
        await getAllHRJobPostingList(context);
      } else {
        debugPrint("Job Post failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Job Post failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Job Post Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> closeHrJobPost(BuildContext context, String jobPostId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.closeHrJobPosting(jobPostId);
      _closeHrJobPostingListModel = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Job Post Closed Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        // REFRESH LIST AFTER DELETING
        await getAllHRJobPostingList(context);
      } else {
        debugPrint("Job Post Closed failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Job Post Closed failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Job Post Closed Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteHrJobPost(BuildContext context, String jobPostId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.deleteHrJobPosting(jobPostId);
      _deleteHrJobPostingListModel = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Job Post Delete Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        // REFRESH LIST AFTER DELETING
        await getAllHRJobPostingList(context);
      } else {
        debugPrint("Job Post Delete failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Job Post Delete failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Job Post Delete Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> singleHrJobPostDetail(
    BuildContext context,
    String jobPostId,
  ) async {
    _setLoadingState(true);
    try {
      final response = await _repository.singleHrJobPosting(jobPostId);
      _getSingleJobPostingListModel = response;

      if (response.success && response.data?.data != null) {
        return true;
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load job details!',
          backgroundColor: Colors.red,
        );
        return false;
      }
    } catch (e) {
      debugPrint("Single Job Exception: $e");
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Error: $e",
        backgroundColor: Colors.red,
      );
      return false;
    } finally {
      _setLoadingState(false);
    }
  }

  // HR ALL EMPLOYEE ATTENDANCE LIST API

  Future<void> getHRAllEmpAttendanceList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getHRAllEmployeeAttendanceList();
      _getHrAllEmployeeAttendanceListModel = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load Data!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getHrAllEmployeeAttendanceListModel = ApiResponse.error(
        "Something went wrong: $e",
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add this method in your HREmployeeApiProvider class:
  Future<void> getHRAllEmployeeAttendanceCalenderView(
    BuildContext context, {
    required int month,
    required int year,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Prepare query parameters dynamically
      final Map<String, dynamic> queryParams = {
        'month': month.toString().padLeft(2, '0'), // ensure 2 digits
        'year': year.toString(),
      };

      final response = await _repository.getHRAllEmployeeAttendanceCalenderView(
        queryParameters: queryParams,
      );

      _getHrAllEmployeeAttendanceCalenderViewModel = response;

      if (response.success == false) {
        if (context.mounted) {
          CustomSnackbarHelper.customShowSnackbar(
            context: context,
            message: response.message ?? 'Failed to load calendar data!',
            backgroundColor: Colors.red,
          );
        }
      }
    } catch (e) {
      _getHrAllEmployeeAttendanceCalenderViewModel = ApiResponse.error(
        "Something went wrong: $e",
      );

      if (context.mounted) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: 'Error loading calendar data',
          backgroundColor: Colors.red,
        );
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getHrPayrollManagementList(
    BuildContext context, {
    required int month,
    required int year,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Prepare query parameters dynamically
      final Map<String, dynamic> queryParams = {
        'year': year.toString(),
        'month': month.toString().padLeft(2, '0'), // ensure 2 digits

      };

      final response = await _repository.getHrPayrollManagementList(
        queryParameters: queryParams,
      );

      _getHrPayrollManagementListModel = response;

      if (response.success == false) {
        if (context.mounted) {
          CustomSnackbarHelper.customShowSnackbar(
            context: context,
            message: response.message ?? 'Failed to load payroll data!',
            backgroundColor: Colors.red,
          );
        }
      }
    } catch (e) {
      _getHrPayrollManagementListModel = ApiResponse.error(
        "Something went wrong: $e",
      );

      if (context.mounted) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: 'Error loading payroll data',
          backgroundColor: Colors.red,
        );
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }



  Future<void> hrPayrollSalaryAction(
      BuildContext context, {
        required String employeeId,
        required int month,
        required int year,
        required String action
      }) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Prepare query parameters dynamically
      final Map<String, dynamic> queryParams = {
        'employeeId': employeeId,
        'year': year.toString(),
        'month': month.toString().padLeft(2, '0'), // ensure 2 digits

      };

      final response = await _repository.hrPayrollSalaryAction(
        queryParameters: queryParams,
        action: action,
      );

      _hrPayrollSalaryApprovedModelResponse = response;

      if (response.success == false) {
        if (context.mounted) {
          CustomSnackbarHelper.customShowSnackbar(
            context: context,
            message: response.message ?? 'Failed to load payroll data!',
            backgroundColor: Colors.red,
          );
        }
      }
    } catch (e) {
      _hrPayrollSalaryApprovedModelResponse = ApiResponse.error(
        "Something went wrong: $e",
      );

      if (context.mounted) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: 'Error loading payroll data',
          backgroundColor: Colors.red,
        );
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


}
