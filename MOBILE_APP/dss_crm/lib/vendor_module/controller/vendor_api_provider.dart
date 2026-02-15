import 'package:dio/dio.dart';
import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/sales_module/common/model/get_our_lead_list_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_emp_client_briefing_form_list_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_1_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_2_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_3_payment_model.dart';
import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_4_pending_payment_model.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/model/sales_emp_assigned_lead_model.dart';
import 'package:dss_crm/sales_module/sales_tl/employee/employee_list_model.dart';
import 'package:dss_crm/vendor_module/model/bank_details/create_invoice_model.dart';
import 'package:dss_crm/vendor_module/model/bank_details/single_message_model.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_add_categories_model.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_categories_list_model.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_update_categories_model.dart';
import 'package:dss_crm/vendor_module/model/customer/vendor_add_customer_model.dart';
import 'package:dss_crm/vendor_module/model/drafts/create_draft_model.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_add_product_model.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_product_management_list_model.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_single_product_model.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_update_product_model.dart';
import 'package:dss_crm/vendor_module/model/purchsae_order/vendor_purchase_order_list_model.dart';
import 'package:dss_crm/vendor_module/model/purchsae_order/vendor_purchase_order_payement_update_model.dart';
import 'package:dss_crm/vendor_module/model/vendor_customer/vendor_customer_list_model.dart';
import 'package:dss_crm/vendor_module/model/vendor_profile/vendor_profile_model.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_product_management_screen.dart';
import 'package:flutter/material.dart';
import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';
import '../../../utils/storage_util.dart';

class VendorModuleApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  ApiResponse<VendorCategoryListModelResponse>? _getAllVenodorCategoryListModelResponse;
  ApiResponse<VendorCategoryListModelResponse>? get getVendorCategoryListModelResponse => _getAllVenodorCategoryListModelResponse;

  ApiResponse<VendorAddCategoryModelResponse>? _addVendorCategoryModelResponse;
  ApiResponse<VendorAddCategoryModelResponse>? get addSalesManagementSheetForm3PaymentModelResponse => _addVendorCategoryModelResponse;

  ApiResponse<VendorUpdateCategoryModelResponse>? _updateVendorCategoryModelResponse;
  ApiResponse<VendorUpdateCategoryModelResponse>? get updateVendorCategoryModelResponse => _updateVendorCategoryModelResponse;

  ApiResponse<VendorProductManagemetnListModelResponse>? _getAllVenodorProductListModelResponse;
  ApiResponse<VendorProductManagemetnListModelResponse>? get getAllVenodorProductListModelResponse => _getAllVenodorProductListModelResponse;

  ApiResponse<VendorSingleProductModelResponse>? _getVenodorSingleProductModelResponse;
  ApiResponse<VendorSingleProductModelResponse>? get getVenodorSingleProductModelResponse => _getVenodorSingleProductModelResponse;

  ApiResponse<VendorAddProductModelResponse>? _addVendorProductModelResponse;
  ApiResponse<VendorAddProductModelResponse>? get addVendorProductModelResponse => _addVendorProductModelResponse;

  ApiResponse<VendorUpdateProductModelResponse>? _updateVendorProductModelResponse;
  ApiResponse<VendorUpdateProductModelResponse>? get updateVendorProductModelResponse => _updateVendorProductModelResponse;

  ApiResponse<VendorPurchaseOrderLIstModelResponse>? _getAllVendorPurchaseOrderListModelResponse;
  ApiResponse<VendorPurchaseOrderLIstModelResponse>? get getAllVendorPurchaseOrderListModelResponse => _getAllVendorPurchaseOrderListModelResponse;


  ApiResponse<VendorPurchaseOrderPaymentUpdateModelResponse>? _updateVendorInvoicePaymentModelResponse;
  ApiResponse<VendorPurchaseOrderPaymentUpdateModelResponse>? get updateVendorInvoicePaymentModelResponse => _updateVendorInvoicePaymentModelResponse;


  ApiResponse<VendorAddCustomerModelResponse>? _addVendorCustomerModelResponse;
  ApiResponse<VendorAddCustomerModelResponse>? get addVendorCustomerModelResponse => _addVendorCustomerModelResponse;

  ApiResponse<VendorCustomerListModelResponse>? _getAllVenodorCustomerListModelResponse;
  ApiResponse<VendorCustomerListModelResponse>? get getAllVenodorCustomerListModelResponse => _getAllVenodorCustomerListModelResponse;

  ApiResponse<VendorProfileModelResponse>? _getVendorProfileModelResponse;
  ApiResponse<VendorProfileModelResponse>? get getVendorProfileModelResponse => _getVendorProfileModelResponse;

  ApiResponse<VendorCreateInvoiceModelResponse>? _createVendorInvoiceModelResponse;
  ApiResponse<VendorCreateInvoiceModelResponse>? get createVendorInvoiceModelResponse => _createVendorInvoiceModelResponse;

  ApiResponse<VendorCreateDraftModelResponse>? _createInvoiceDraftModelResponse;
  ApiResponse<VendorCreateDraftModelResponse>? get createInvoiceDraftModelResponse => _createInvoiceDraftModelResponse;


  ApiResponse<SingleMessageModelResponse>? _addVendorBankModelResponse;
  ApiResponse<SingleMessageModelResponse>? get addVendorBankModelResponse => _addVendorBankModelResponse;


  Future<void> getAllVendorCategoryList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getAllVendorCategoryList();
      _getAllVenodorCategoryListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load categories!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllVenodorCategoryListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addVendorCategory(BuildContext context,Map<String, dynamic> body,String categoryId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addVendorCategory(body);
      _addVendorCategoryModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message! : "Category Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );

      } else {
        debugPrint("Category Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Category Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Category Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> updateVendorCategory(BuildContext context,Map<String, dynamic> body,String categoryId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateVendorCategory(body,categoryId);
      _updateVendorCategoryModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message! : "Category Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );

      } else {
        debugPrint("Category Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Category Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Category Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> deleteVendorCategory(BuildContext context,String categoryId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.deleteVendorCategory(categoryId);
      _updateVendorCategoryModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Category deleted Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );

      } else {
        debugPrint("Category deleted failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Category deleted failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Category deleted Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  ////////////////// PRODUCT MANAGEMENT //////////////////////////

  Future<void> getAllVendorProductList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getAllVendorProductList();
      _getAllVenodorProductListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load products!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllVenodorProductListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getVendorSingleProduct(BuildContext context,String productId) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getVendorSingleProduct(productId);
      _getVenodorSingleProductModelResponse = response;
      if (!response.success && response.data !=null) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? 'Failed to load products!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getVenodorSingleProductModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addVendorProduct(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addVendorProducts(body);
      _addVendorProductModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Product Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );

      } else {
        debugPrint("Product Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Product Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Product Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateVendorProduct(BuildContext context,Map<String, dynamic> body,String productId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateVendorProduct(body,productId);
      _updateVendorProductModelResponse = response;

      if (response.success && response.data != null) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data!.message ?? "Product Update Successfully" ,
          duration: const Duration(seconds: 2),
        );

      } else {
        debugPrint("Product Update failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Product Update failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Product Update Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }


////////////////// PURCHASE ORDER MANAGEMENT //////////////////////////

  Future<void> getAllVendorPurchaseOrderList(BuildContext context , page , limit) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getAllVendorPurchaseOrderList(page, limit);
      _getAllVendorPurchaseOrderListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load products!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllVendorPurchaseOrderListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  Future<void> updateVendorInvoicePayment(BuildContext context,Map<String, dynamic> body,String invoiceId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateVendorInvoicePayment(body,invoiceId);
      _updateVendorInvoicePaymentModelResponse = response;

      if (response.success && response.data != null) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data!.message ?? "Payment Update Successfully" ,
          duration: const Duration(seconds: 2),
        );

      } else {
        debugPrint("Payment Update failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data!.message.toString() ?? 'Payment Update failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Payment Update Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  Future<void> addVendorCustomer(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addVendorCustoemr(body);
      _addVendorCustomerModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message! : "Product Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );

      } else {
        debugPrint("Product Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Product Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Product Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> getAllVendorCustomerList(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getAllVendorCustomerList();
      _getAllVenodorCustomerListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? 'Failed to load customers!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllVenodorCustomerListModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getVendorProfileData(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {

      final response = await _repository.getVendorProfileData();
      _getVendorProfileModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.data?.message ?? 'Failed to load customers!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getVendorProfileModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createInvoice(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createInvoice(body);
      _createVendorInvoiceModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Invoice Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context);

      } else {
        debugPrint("Category Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Category Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Invoice Created Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> addBankDetails(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.addBankDetails(body);
      _addVendorBankModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Bank Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context);

      } else {
        debugPrint("Bank Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Bank Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Bank Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> createInvoiceDraft(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createInvoiceDraft(body);
      _createInvoiceDraftModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Draft Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context);

      } else {
        debugPrint("Draft Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Draft Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Draft Created Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> deleteInvoiceDraft(BuildContext context,String draftId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.deleteVendorDraft(draftId);
      _addVendorBankModelResponse = response;

      if (response.success && response.data != null) {
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Draft Created Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context);

      } else {
        debugPrint("Draft Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Draft Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Draft Created Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }



}
