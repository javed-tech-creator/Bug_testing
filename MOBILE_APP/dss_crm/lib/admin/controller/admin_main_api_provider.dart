import 'dart:io';

import 'package:dss_crm/admin/model/employee_profile/get_all_admin_employee_list_model.dart';
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
import 'package:dss_crm/admin/model/user_register/update_user_register_model.dart';
 import 'package:dss_crm/admin/model/user_register/user_register_model.dart';
import 'package:dss_crm/admin/screen/vendor/model/all_vendor_list_model.dart';
import 'package:dss_crm/admin/screen/vendor/model/single_vendor_detail_at_admin_model.dart';
import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/vendor_module/model/bank_details/single_message_model.dart';
import 'package:flutter/material.dart';
import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';


class AdminMainApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;
  // NAYA: Sirf UPDATE operations ke liye alag flag
  bool _isUpdating = false;
  bool get isUpdating => _isUpdating;

  ApiResponse<GetAllAdminEmployeeListModelResponse>? _getAllAdminEmployeeLIstListModelResponse;
  ApiResponse<GetAllAdminEmployeeListModelResponse>? get getAllAdminEmployeeListListModelResponse => _getAllAdminEmployeeLIstListModelResponse;

  ApiResponse<GetAllAdminRegisteredUserListModelResponse>? _getAllAdminRegisteredUserListModelResponse;
  ApiResponse<GetAllAdminRegisteredUserListModelResponse>? get getAllAdminRegisteredUserListModelResponse => _getAllAdminRegisteredUserListModelResponse;

  ApiResponse<GetAdminSingleRegisteredUserDetailsModelResponse>? _getAdminSingleRegisteredUserDetailModelResponse;
  ApiResponse<GetAdminSingleRegisteredUserDetailsModelResponse>? get getAdminSingleRegisteredUserDetailModelResponse => _getAdminSingleRegisteredUserDetailModelResponse;

  ApiResponse<CreateAdminUserRegisterModelResponse>? _createAdminUserRegisterModelResponse;
  ApiResponse<CreateAdminUserRegisterModelResponse>? get createAdminUserRegisterModelResponse => _createAdminUserRegisterModelResponse;

  ApiResponse<UpdateAdminRegisteredUserDetailsModelResponse>? _updateAdminUserRegisterDetailsModelResponse;
  ApiResponse<UpdateAdminRegisteredUserDetailsModelResponse>? get updateAdminUserRegisterDetailsModelResponse => _updateAdminUserRegisterDetailsModelResponse;

  ApiResponse<GetAdminProductListModelResponse>? _getAllAdminProductListModelResponse;
  ApiResponse<GetAdminProductListModelResponse>? get getAllAdminProductListModelResponse => _getAllAdminProductListModelResponse;

  ApiResponse<AddAdminProductModelResponse>? _createAdminProductModelResponse;
  ApiResponse<AddAdminProductModelResponse>? get createAdminProductModelResponse => _createAdminProductModelResponse;

  ApiResponse<UpdateAdminProductModelResponse>? _updateAdminProductModelResponse;
  ApiResponse<UpdateAdminProductModelResponse>? get updateAdminProductModelResponse => _updateAdminProductModelResponse;

  ApiResponse<DeleteAdminProductModelResponse>? _deleteAdminProductModelResponse;
  ApiResponse<DeleteAdminProductModelResponse>? get deleteAdminProductModelResponse => _deleteAdminProductModelResponse;

  ApiResponse<GetAdminProductDetailsModelResponse>? _getAdminProductSingleDetailModelResponse;
  ApiResponse<GetAdminProductDetailsModelResponse>? get getAdminProductSingleDetailModelResponse => _getAdminProductSingleDetailModelResponse;

  ApiResponse<GetAdminProductSingleWorkDetailsModelResponse>? _getAdminProductSingleWorksDetailModelResponse;
  ApiResponse<GetAdminProductSingleWorkDetailsModelResponse>? get getAdminProductSingleWorksDetailModelResponse => _getAdminProductSingleWorksDetailModelResponse;

  ApiResponse<AddAdminProductWorksModelResponse>? _addAdminProductWorksModelResponse;
  ApiResponse<AddAdminProductWorksModelResponse>? get addAdminProductWorksModelResponse => _addAdminProductWorksModelResponse;

  ApiResponse<UpdateAdminProductWorksModelResponse>? _updateAdminProductWorksModelResponse;
  ApiResponse<UpdateAdminProductWorksModelResponse>? get updateAdminProductWorksModelResponse => _updateAdminProductWorksModelResponse;

  ApiResponse<AllVendorListAtAdminModelResponse>? _getAllVendorListAtAdminModelResponse;
  ApiResponse<AllVendorListAtAdminModelResponse>? get getAllVendorListAtAdminModelResponse => _getAllVendorListAtAdminModelResponse;

  ApiResponse<SingleMessageModelResponse>? _addVendorResponse;
  ApiResponse<SingleMessageModelResponse>? get addVendorResponse => _addVendorResponse;


  ApiResponse<VendorDetailAtAdminModelResponse>? _getSingleVendorDetailsAtAdminModeResponse;
  ApiResponse<VendorDetailAtAdminModelResponse>? get getSingleVendorDetailsAtAdminModeResponse => _getSingleVendorDetailsAtAdminModeResponse;


  ApiResponse<SingleMessageModelResponse>? _changeAdminUserRegisterStatusModelResponse;
  ApiResponse<SingleMessageModelResponse>? get changeAdminUserRegisterStatusModelResponse => _changeAdminUserRegisterStatusModelResponse;


  ///&&&&&&&&&&&&&&&&&&&&&&& EMPLOYEE PROFILE (ONBOARD BY HR)  &&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllAdminEmployeeList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllAdminEmployeeList();
      _getAllAdminEmployeeLIstListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load list!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllAdminEmployeeLIstListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


///&&&&&&&&&&&&&&&&&&&&&&& USER  PROFILE (WHO ARE GOING TO USE THIS CRM) &&&&&&&&&&&&&&&&&&&&&&&&&&&


  Future<void> getAllAdminRegisteredUserList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllAdminRegisteredUserList();
      _getAllAdminRegisteredUserListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load list!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllAdminRegisteredUserListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> changeAdminUserRegisterStatus(BuildContext context,String registeredUserId, Map<String , dynamic> requestBody) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.changeAdminUserRegisterStatus(registeredUserId,requestBody);
      _changeAdminUserRegisterStatusModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load list!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _changeAdminUserRegisterStatusModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAdminSingleRegisteredUserDetail(BuildContext context, String registeredUserId) async {
    _isLoading = true;
    _getAdminSingleRegisteredUserDetailModelResponse = null; // Reset previous data
    notifyListeners();

    try {
      final response = await _repository.getAdminRegisteredUserDetail(registeredUserId);
      _getAdminSingleRegisteredUserDetailModelResponse = response;

      // Debug print to check response
      debugPrint("API Response Success: ${response.success}");
      debugPrint("API Response Data: ${response.data}");
      debugPrint("User Data: ${response.data?.data?.user}");

      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load user details!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Error loading user details: $e");
      debugPrint("Stack trace: $stackTrace");
      _getAdminSingleRegisteredUserDetailModelResponse = ApiResponse.error("Something went wrong: $e");

      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Failed to load user details",
        backgroundColor: Colors.red,
      );
    } finally {
      _isLoading = false;
      notifyListeners(); // This is critical - make sure UI rebuilds
    }
  }

  Future<void> createAdminUserRegisteration(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createAdminUserRegistration(body);
      _createAdminUserRegisterModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "User Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.of(context).pop(true);
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
      debugPrint("User Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateAdminUserRegisteredDetails(BuildContext context,Map<String, dynamic> body,String registeredUserId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateAdminUserRegisterDetails(body,registeredUserId);
      _updateAdminUserRegisterDetailsModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "User Details Updated Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("Details Updated failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Details Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Details Updated Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  ///&&&&&&&&&&&&&&&&&&&&&&& ADMIN PRODUCT MANAGEMENT &&&&&&&&&&&&&&&&&&&&&&&&&&&


  Future<void> getAllAdminRProductList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.getAllAdminProductList();
      _getAllAdminProductListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load list!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllAdminProductListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAdminRProductSingleDetails(BuildContext context, String productId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getAdminProductSingleDetails(productId);
      _getAdminProductSingleDetailModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load product!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAdminProductSingleDetailModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getAdminRProductSingleWorksDetails(BuildContext context, String productId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.getAdminProductSingleWorkDetails(productId);
      _getAdminProductSingleWorksDetailModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load product!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAdminProductSingleWorksDetailModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addAdminProduct(BuildContext context,Map<String, dynamic> body, {File? imageFile}) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addAdminProduct(body, imageFile: imageFile);
      _createAdminProductModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Product Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        return true;
        // Navigator.of(context).pop(true);
      } else {
        debugPrint("Product Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Product Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
        return false;
      }
    } catch (e, stackTrace) {
      debugPrint("Product Added Exception: $e");
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateAdminProduct(BuildContext context,Map<String, dynamic> body,String productId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateAdminProduct(body,productId);
      _updateAdminProductModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Product Details Updated Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        return true;
      } else {
        debugPrint("Details Updated failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Details Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
        return false;
      }
    } catch (e, stackTrace) {
      debugPrint("Product Details Updated Exception: $e");
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> deleteSoftAdminProduct(BuildContext context,Map<String, dynamic> body,String productId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.deleteSoftAdminProduct(productId);
      _deleteAdminProductModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Product Deleted Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("Product Deleted failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Product Deleted failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Product Deleted Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addAdminProductWorks(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addAdminProductWorlks(body);
      _addAdminProductWorksModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Works Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("Works Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Works Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Works Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateAdminProductWorks(BuildContext context,Map<String, dynamic> body,String productId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateAdminProductWorks(body,productId);
      _updateAdminProductWorksModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty) ? apiMessage : "Works Updated Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context,true);
      } else {
        debugPrint("Works Updated failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Works Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Works Updated Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  ///&&&&&&&&&&&&&&&&&&&&&&& ADMIN VENDOR MANAGEMENT &&&&&&&&&&&&&&&&&&&&&&&&&&&


  Future<void> getAllVendorListAtAdmin(BuildContext context,{int? page , int? limit,bool? isActive}) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {};
      if (page != null) queryParameters['page'] = page;
      if (limit != null) queryParameters['limit'] = limit;
      if (isActive != null) queryParameters['isActive'] = isActive;

      final response = await _repository.getAllVendorListAtAdmin(queryParameters);
      _getAllVendorListAtAdminModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load vendor!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllVendorListAtAdminModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addNewVendorAtAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.addNewVendorAtAdmin(
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
      );

      _addVendorResponse = response;

      // LOG RESPONSE IN CONSOLE
      debugPrint("ADD VENDOR API RESPONSE:");
      debugPrint("Success: ${response.success}");
      debugPrint("Message: ${response.message}");
      debugPrint("Status Code: ${response.statusCode}");
      debugPrint("Data: ${response.data?.toJson()}");

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Vendor added successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true); // Go back on success
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Failed to add vendor",
          backgroundColor: Colors.red,
        );
      }
    } catch (e, stack) {
      debugPrint("ADD VENDOR EXCEPTION: $e");
      debugPrint(stack.toString());
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Network error occurred",
        backgroundColor: Colors.red,
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateVendorAtAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    _isUpdating = true;
    notifyListeners();

    try {
      final response = await _repository.updateVendorAtAdmin(
        vendorId: vendorId,
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
        deleteAdditionalDocIds: deleteAdditionalDocIds,
      );

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Vendor updated successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true);
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Update failed",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      CustomSnackbarHelper.customShowSnackbar(context: context, message: "Error occurred", backgroundColor: Colors.red);
    } finally {
      _isUpdating = false;
      notifyListeners();
    }
  }

  Future<void> getVendorSingleDraftDetail(BuildContext context , String draftId) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getVendorSingleDetailsAtAdmin(draftId);
      _getSingleVendorDetailsAtAdminModeResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? 'Failed to load categories!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSingleVendorDetailsAtAdminModeResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearSingleVendorDetail() {
    _getSingleVendorDetailsAtAdminModeResponse = null;
    notifyListeners();
  }


////// &&&&&&&&&&&&&&&&& CONTRACTOR &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllContractorListAtAdmin(BuildContext context,{int? page , int? limit,bool? isActive}) async {
    _isLoading = true;
    notifyListeners();

    try {
      // final Map<String, dynamic> queryParameters = {
      //   'page': page,
      //   'limit': limit,
      //   'isActive': isActive,
      // };
      final Map<String, dynamic> queryParameters = {};
      if (page != null) queryParameters['page'] = page;
      if (limit != null) queryParameters['limit'] = limit;
      if (isActive != null) queryParameters['isActive'] = isActive;
      final response = await _repository.getAllContractorListAtAdmin(queryParameters);
      _getAllVendorListAtAdminModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load vendor!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllVendorListAtAdminModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addNewContractorAtAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.addNewContractorAtAdmin(
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
      );

      _addVendorResponse = response;

      // LOG RESPONSE IN CONSOLE
      debugPrint("ADD Contractor API RESPONSE:");
      debugPrint("Success: ${response.success}");
      debugPrint("Message: ${response.message}");
      debugPrint("Status Code: ${response.statusCode}");
      debugPrint("Data: ${response.data?.toJson()}");

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Contractor added successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true); // Go back on success
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Failed to add Contractor",
          backgroundColor: Colors.red,
        );
      }
    } catch (e, stack) {
      debugPrint("ADD Contractor EXCEPTION: $e");
      debugPrint(stack.toString());
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Network error occurred",
        backgroundColor: Colors.red,
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateContractorAtAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    _isUpdating = true;
    notifyListeners();

    try {
      final response = await _repository.updateContractorAtAdmin(
        contractorId: contractorId,
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
        deleteAdditionalDocIds: deleteAdditionalDocIds,
      );

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Contractor updated successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true);
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Update failed",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      CustomSnackbarHelper.customShowSnackbar(context: context, message: "Error occurred", backgroundColor: Colors.red);
    } finally {
      _isUpdating = false;
      notifyListeners();
    }
  }

  Future<void> getContractorSingleDraftDetail(BuildContext context , String draftId) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getContractorSingleDetailsAtAdmin(draftId);
      _getSingleVendorDetailsAtAdminModeResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? 'Failed to load categories!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSingleVendorDetailsAtAdminModeResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

////// &&&&&&&&&&&&&&&&& CONTRACTOR &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllFreelancerListAtAdmin(BuildContext context,{int? page , int? limit,bool? isActive}) async {
    _isLoading = true;
    notifyListeners();

    try {
      // final Map<String, dynamic> queryParameters = {
      //   'page': page,
      //   'limit': limit,
      //   'isActive': isActive,
      // };
      final Map<String, dynamic> queryParameters = {};
      if (page != null) queryParameters['page'] = page;
      if (limit != null) queryParameters['limit'] = limit;
      if (isActive != null) queryParameters['isActive'] = isActive;
      final response = await _repository.getAllFreelancerListAtAdmin(queryParameters);
      _getAllVendorListAtAdminModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load freelancer!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllVendorListAtAdminModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addNewFreelancertAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.addNewFreelancerAtAdmin(
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
      );

      _addVendorResponse = response;

      // LOG RESPONSE IN CONSOLE
      debugPrint("ADD Freelancer API RESPONSE:");
      debugPrint("Success: ${response.success}");
      debugPrint("Message: ${response.message}");
      debugPrint("Status Code: ${response.statusCode}");
      debugPrint("Data: ${response.data?.toJson()}");

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Freelancer added successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true); // Go back on success
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Failed to add Freelancer",
          backgroundColor: Colors.red,
        );
      }
    } catch (e, stack) {
      debugPrint("ADD Freelancer EXCEPTION: $e");
      debugPrint(stack.toString());
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Network error occurred",
        backgroundColor: Colors.red,
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateFreelancerAtAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    _isUpdating = true;
    notifyListeners();

    try {
      final response = await _repository.updateFreelancerAtAdmin(
        freelancerId: freelancerId,
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
        deleteAdditionalDocIds: deleteAdditionalDocIds,
      );

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Freelancer updated successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true);
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Update failed",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      CustomSnackbarHelper.customShowSnackbar(context: context, message: "Error occurred", backgroundColor: Colors.red);
    } finally {
      _isUpdating = false;
      notifyListeners();
    }
  }

  Future<void> getFreelancerSingleDraftDetail(BuildContext context , String draftId) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getFreelancerSingleDetailsAtAdmin(draftId);
      _getSingleVendorDetailsAtAdminModeResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? 'Failed to load freelancers!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSingleVendorDetailsAtAdminModeResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


////// &&&&&&&&&&&&&&&&& PARTNER &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  Future<void> getAllPartnerListAtAdmin(BuildContext context,{int? page , int? limit,bool? isActive}) async {
    _isLoading = true;
    notifyListeners();

    try {
      // final Map<String, dynamic> queryParameters = {
      //   'page': page,
      //   'limit': limit,
      //   'isActive': isActive,
      // };
      final Map<String, dynamic> queryParameters = {};
      if (page != null) queryParameters['page'] = page;
      if (limit != null) queryParameters['limit'] = limit;
      if (isActive != null) queryParameters['isActive'] = isActive;
      final response = await _repository.getAllPartnerListAtAdmin(queryParameters);
      _getAllVendorListAtAdminModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load partner!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllVendorListAtAdminModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addNewPartnerAtAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.addNewPartnerAtAdmin(
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
      );

      _addVendorResponse = response;

      // LOG RESPONSE IN CONSOLE
      debugPrint("ADD Partner API RESPONSE:");
      debugPrint("Success: ${response.success}");
      debugPrint("Message: ${response.message}");
      debugPrint("Status Code: ${response.statusCode}");
      debugPrint("Data: ${response.data?.toJson()}");

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Partner added successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true); // Go back on success
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Failed to add Partner",
          backgroundColor: Colors.red,
        );
      }
    } catch (e, stack) {
      debugPrint("ADD Partner EXCEPTION: $e");
      debugPrint(stack.toString());
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Network error occurred",
        backgroundColor: Colors.red,
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updatePartnerAtAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    _isUpdating = true;
    notifyListeners();

    try {
      final response = await _repository.updatePartnerAtAdmin(
        partnerId: partnerId,
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
        deleteAdditionalDocIds: deleteAdditionalDocIds,
      );

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Partner updated successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true);
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Update failed",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      CustomSnackbarHelper.customShowSnackbar(context: context, message: "Error occurred", backgroundColor: Colors.red);
    } finally {
      _isUpdating = false;
      notifyListeners();
    }
  }

  Future<void> getPartnerSingleDraftDetail(BuildContext context , String draftId) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getPartnerSingleDetailsAtAdmin(draftId);
      _getSingleVendorDetailsAtAdminModeResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? 'Failed to load partner!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSingleVendorDetailsAtAdminModeResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


////// &&&&&&&&&&&&&&&&& FRANCHISE &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


  Future<void> getAllFranchiseListAtAdmin(BuildContext context,{int? page , int? limit,bool? isActive}) async {
    _isLoading = true;
    notifyListeners();

    try {
      // final Map<String, dynamic> queryParameters = {
      //   'page': page,
      //   'limit': limit,
      //   'isActive': isActive,
      // };
      final Map<String, dynamic> queryParameters = {};
      if (page != null) queryParameters['page'] = page;
      if (limit != null) queryParameters['limit'] = limit;
      if (isActive != null) queryParameters['isActive'] = isActive;
      final response = await _repository.getAllFranchiseListAtAdmin(queryParameters);
      _getAllVendorListAtAdminModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load franchise!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllVendorListAtAdminModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addNewFranchiseAtAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.addNewFranchiseAtAdmin(
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
      );

      _addVendorResponse = response;

      // LOG RESPONSE IN CONSOLE
      debugPrint("ADD Franchise API RESPONSE:");
      debugPrint("Success: ${response.success}");
      debugPrint("Message: ${response.message}");
      debugPrint("Status Code: ${response.statusCode}");
      debugPrint("Data: ${response.data?.toJson()}");

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Franchise added successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true); // Go back on success
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Failed to add Franchise",
          backgroundColor: Colors.red,
        );
      }
    } catch (e, stack) {
      debugPrint("ADD Franchise EXCEPTION: $e");
      debugPrint(stack.toString());
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Network error occurred",
        backgroundColor: Colors.red,
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateFranchiseAtAdmin({
    required BuildContext context,
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

    File? profileImage,
    File? contractForm,
    List<Map<String, dynamic>> additionalDocuments = const [],
    List<String> deleteAdditionalDocIds = const [],
  }) async {
    _isUpdating = true;
    notifyListeners();

    try {
      final response = await _repository.updateFranchiseAtAdmin(
        franchiseId: franchiseId,
        contactPersonName: contactPersonName,
        contactNumber: contactNumber,
        alternateContact: alternateContact,
        email: email,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        gstNumber: gstNumber,
        panNumber: panNumber,
        aadharNumber: aadharNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        profileImage: profileImage,
        contractForm: contractForm,
        additionalDocuments: additionalDocuments,
        deleteAdditionalDocIds: deleteAdditionalDocIds,
      );

      if (response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? "Franchise updated successfully!",
          backgroundColor: Colors.green,
        );
        Navigator.pop(context, true);
      } else {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? "Update failed",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      CustomSnackbarHelper.customShowSnackbar(context: context, message: "Error occurred", backgroundColor: Colors.red);
    } finally {
      _isUpdating = false;
      notifyListeners();
    }
  }

  Future<void> getFranchiseSingleDraftDetail(BuildContext context , String draftId) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getFranchiseSingleDetailsAtAdmin(draftId);
      _getSingleVendorDetailsAtAdminModeResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? 'Failed to load franchise!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getSingleVendorDetailsAtAdminModeResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }





}



