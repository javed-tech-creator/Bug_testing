import 'dart:io';
import 'package:dss_crm/network_manager/api_response.dart';
import 'package:flutter/material.dart';

import '../../network_manager/repository.dart';
import '../../utils/custom_snack_bar.dart';
import '../../utils/full_screen_loader_utiil.dart';
import '../screen/employee/model/emp_document_module/get_emp_document_list_model.dart';


class HREmpDocumentUploadProvider extends ChangeNotifier {
  final Repository _repository = Repository();

  bool _isUploading = false;
  bool get isUploading => _isUploading;

  String? _error;
  String? get error => _error;
  bool _isLoading = false;
  String _errorMessage = "";
  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;

  GetAllEmpDocuemtsListModel? _getAllEmpDocuemtsListModel;
  GetAllEmpDocuemtsListModel? get getAllEmpDocuemtsListModel => _getAllEmpDocuemtsListModel;

  void _setLoadingState(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Set Error State
  void _setErrorState(String message) {
    _errorMessage = message;
    _setLoadingState(false);
  }


  Future<void> uploadEmployeeDocuments({
    required Map<String, File> documents,
    required String empId,
    required BuildContext context,
  }) async {
    // _isUploading = true;
    FullScreenLoader.show(context);
    _error = null;
    notifyListeners();

    try {
      final response = await _repository.uploadDocuments(
        documents: documents,
        empId: empId,
      );

      if (response.success == true) {
        // ScaffoldMessenger.of(context).showSnackBar(
        //   SnackBar(content: Text("Documents uploaded successfully")),
        // );

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.green,
          message:response.message ?? "Please select all documents before submitting.",
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
          message:response.message ?? "Please select all documents before submitting.",
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
        message:_error ?? "Please select all documents before submitting.",
      );
    } finally {
      FullScreenLoader.hide(context);
      _isUploading = false;
      notifyListeners();
    }
  }


  Future<void> updateEmployeeDocuments({
    required Map<String, File> documents,
    required String empId,
    required BuildContext context,
  }) async {
    // _isUploading = true;
    FullScreenLoader.show(context);
    _error = null;
    notifyListeners();

    try {
      final response = await _repository.UpdateEmpDocuments(
        documents: documents,
        empId: empId,
      );

      if (response.success == true) {
        // ScaffoldMessenger.of(context).showSnackBar(
        //   SnackBar(content: Text("Documents uploaded successfully")),
        // );

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.green,
          message:response.message ?? "Please select documents before update.",
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
          message:response.message ?? "Please select documents before update.",
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
      _isUploading = false;
      notifyListeners();
    }
  }

  Future<bool> getEmployeeDocumentsList(String empId) async {
    _setLoadingState(true);
    _errorMessage = "";
    _getAllEmpDocuemtsListModel = null;

    try {
      final response = await _repository.getEmpDocumentsList(empId);

      _getAllEmpDocuemtsListModel = response.data;
      if (response.success == true ) {
        print("Employee Documents Fetched Successfully");
        _setLoadingState(false);
        return true;
      } else {
        _setErrorState("Failed to Fetch Employee Documents List");
      }
    } catch (error) {
      _setErrorState("⚠️ API Error: $error");
    }

    return false;
  }


  Future<void> delteEmpSingleDocument({
    required String documentType, // Now accepting string for document type
    required String fileName, // Now accepting string for document type
    required String empId,
    required BuildContext context,
  }) async {
    FullScreenLoader.show(context);
    _error = null;
    notifyListeners();

    try {
      // Pass the documentType and empId directly to the repository method
      final response = await _repository.deleteSingleEmpDocument(
        documentType: documentType, // Send the specific document type string
        fileName: fileName, // Send the specific document type string
        empId: empId,
      );

      if (response.success == true) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.green,
          message:response.message ?? "$documentType deleted successfully.",
        );
        FullScreenLoader.hide(context);
        // Refresh the list after successful deletion
        await getEmployeeDocumentsList(empId);
      } else {
        _error = "Failed to delete $documentType: ${response.message ?? 'Unknown error'}";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          backgroundColor: Colors.red,
          message:_error ?? "Failed to delete document.",
        );
      }
    } catch (e) {
      _error = "Delete failed: ${e.toString()}";
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message:_error ?? "Failed to delete document.",
      );
    } finally {
      FullScreenLoader.hide(context);
      _isUploading = false;
      notifyListeners();
    }
  }
}
