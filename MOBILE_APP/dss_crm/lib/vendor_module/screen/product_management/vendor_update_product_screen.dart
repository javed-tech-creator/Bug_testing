import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:dss_crm/utils/custom_text_field_utils.dart';
import 'package:dss_crm/utils/custom_buttons_utils.dart';
import 'package:dss_crm/utils/custom_snack_bar.dart';
import 'package:dss_crm/utils/default_common_app_bar.dart';
import 'package:dss_crm/utils/form_validations_utils.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:provider/provider.dart';
// import 'package:dss_crm/vendor_module/model/category_management/vendor_categories_list_model.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_product_management_list_model.dart';

import '../../../utils/responsive_dropdown_utils.dart';
import '../../controller/vendor_api_provider.dart';

class VendorUpdateProductScreen extends StatefulWidget {
  final Data productData; // existing product data

  const VendorUpdateProductScreen({Key? key, required this.productData})
      : super(key: key);

  @override
  State<VendorUpdateProductScreen> createState() => _VendorUpdateProductScreenState();
}

class _VendorUpdateProductScreenState extends State<VendorUpdateProductScreen> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController _productCodeController = TextEditingController();
  final TextEditingController _productNameController = TextEditingController();
  final TextEditingController _brandController = TextEditingController();
  final TextEditingController _unitTypeController = TextEditingController();
  final TextEditingController _sizeController = TextEditingController();
  final TextEditingController _totalStockController = TextEditingController();
  final TextEditingController _rateController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  // Dropdown state variables
  String? _selectedCategory;
  String? _selectedGst;
  List<String> _categoryList = [];
  final List<String> _gstList = ['0', '5','12', '18', '28'];

  // A flag to show a loading indicator for the dropdown
  bool _isLoadingCategories = true;

  @override
  void initState() {
    super.initState();

    // Prefill with existing data
    _productCodeController.text = widget.productData.productCode ?? '';
    _productNameController.text = widget.productData.productName ?? '';
    _brandController.text = widget.productData.brand ?? '';
    _unitTypeController.text = widget.productData.unitType ?? '';
    _sizeController.text = widget.productData.size ?? '';
    // _totalStockController.text = widget.productData.totalStock.toString() ?? '';
    _rateController.text = widget.productData.rateUnit.toString() ?? '';
    _descriptionController.text = widget.productData.description ?? '';

    // Initialize dropdowns with existing GST values, ensuring they are valid
    final String? gstValueFromProduct = widget.productData.gstPercent?.toString();
    if (_gstList.contains(gstValueFromProduct)) {
      _selectedGst = gstValueFromProduct;
    } else {
      _selectedGst = null;
    }

    // Initialize category value and fetch the list
    _selectedCategory = widget.productData.category;
    _fetchCategories();
  }

  Future<void> _fetchCategories() async {
    final apiProvider = Provider.of<VendorModuleApiProvider>(context, listen: false);

    setState(() {
      _isLoadingCategories = true;
    });

    try {
      await apiProvider.getAllVendorCategoryList(context);
      final response = apiProvider.getVendorCategoryListModelResponse;

      if (response != null && response.success && response.data != null) {
        final List<String> fetchedCategoryNames = response.data!.data!
            .map((item) => item.categoryName ?? '')
            .where((name) => name.isNotEmpty)
            .toList();

        setState(() {
          _categoryList = fetchedCategoryNames;
          if (_selectedCategory != null && _categoryList.contains(_selectedCategory)) {
            // No need to reassign, it's already set in initState.
          } else {
            _selectedCategory = _categoryList.isNotEmpty ? _categoryList.first : null;
          }
        });

        debugPrint('Categories fetched successfully: $_categoryList');
      } else {
        debugPrint('Failed to fetch categories.');
        setState(() {
          _categoryList = [];
          _selectedCategory = null;
        });
      }
    } catch (e) {
      debugPrint("Exception during category fetch: $e");
      setState(() {
        _categoryList = [];
        _selectedCategory = null;
      });
    } finally {
      setState(() {
        _isLoadingCategories = false;
      });
    }
  }

  Future<void> _handleUpdateProduct() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategory == null) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Please select a category.',
        backgroundColor: Colors.red,
      );
      return;
    }
    if (_selectedGst == null) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Please select GST percentage.',
        backgroundColor: Colors.red,
      );
      return;
    }

    // FormData updateBody = FormData.fromMap({
    //   "productCode": _productCodeController.text.trim(),
    //   "productName": _productNameController.text.trim(),
    //   "brand": _brandController.text.trim(),
    //   "unitType": _unitTypeController.text.trim(),
    //   "size": _sizeController.text.trim(),
    //   "totalStock": _totalStockController.text.trim(),
    //   "rate": _rateController.text.trim(),
    //   "gst": _selectedGst,
    //   "category": _selectedCategory,
    //   "description": _descriptionController.text.trim(),
    // });

    Map<String, dynamic> updateBody = {
      "productCode": _productCodeController.text.trim(),
      "productName": _productNameController.text.trim(),
      "category": _selectedCategory,
      "brand": _brandController.text.trim(),
      "unitType": _unitTypeController.text.trim(),
      "size": _sizeController.text.trim(),
      "description": _descriptionController.text.trim(),
      "inStock": int.tryParse(_totalStockController.text.trim()) ?? 0,
      "gstPercent": _selectedGst,
      "rateUnit": double.tryParse(_rateController.text.trim()) ?? 0.0,
    };

    debugPrint("Update Body => $updateBody");
    final String productId = widget.productData.sId.toString();
    await Provider.of<VendorModuleApiProvider>(context, listen: false).updateVendorProduct(context, updateBody, productId);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "Update Product",
        backgroundColor: AppColors.primary,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: ResponsiveHelper.paddingSymmetric(
              context, horizontal: 16.0, vertical: 10.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                _buildTextField("Product Code", _productCodeController,
                    isRequired: true, prefixIcon: Icons.qr_code),
                _buildTextField("Product Name", _productNameController,
                    isRequired: true, prefixIcon: Icons.inventory),
                _buildTextField("Brand", _brandController,
                    isRequired: true, prefixIcon: Icons.branding_watermark),
                _buildTextField("Unit Type", _unitTypeController,
                    isRequired: true, prefixIcon: Icons.straighten),
                _buildTextField("Size", _sizeController,
                    isRequired: true, prefixIcon: Icons.photo_size_select_large),
                _buildTextField("Total Stock", _totalStockController,
                    isRequired: true,
                    keyboardType: TextInputType.number,
                    prefixIcon: Icons.inventory_2),
                _buildTextField("Rate/Unit", _rateController,
                    isRequired: true,
                    keyboardType: TextInputType.number,
                    prefixIcon: Icons.currency_rupee),

                ResponsiveDropdown<String>(
                  value: _selectedGst,
                  itemList: _gstList,
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedGst = newValue;
                    });
                  },
                  hint: 'Select GST (%)',
                  label: 'GST (%)',
                ),

                _isLoadingCategories
                    ? CustomTextField(
                  title: 'Category *',
                  hintText: "Loading categories...",
                  controller: TextEditingController(),
                  prefixIcon: Icons.category,
                  readOnly: true,
                )
                    : ResponsiveDropdown<String>(
                  value: _selectedCategory,
                  itemList: _categoryList,
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedCategory = newValue;
                    });
                  },
                  hint: 'Select a Category',
                  label: 'Category *',
                ),

                _buildTextField("Description", _descriptionController,
                    lines: 3, isRequired: false),
                const SizedBox(height: 20),
                // CustomButton(
                //   text: "Update Product",
                //   color: AppColors.primary,
                //   onPressed: _handleUpdateProduct,
                // ),

                Consumer<VendorModuleApiProvider>(
                  builder: (context, provider, child) {
                    return CustomButton(
                      text: provider.isLoading ? "Updating..." : "Update Product",
                      color: AppColors.primary,
                      onPressed: provider.isLoading ? null : _handleUpdateProduct,
                    );
                  },
                ),


                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
      String title,
      TextEditingController controller, {
        int? lines,
        int? maxLength,
        TextInputType? keyboardType,
        IconData? prefixIcon,
        bool isRequired = false,
      }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 0),
      child: CustomTextField(
        title: title,
        hintText: "Enter $title",
        controller: controller,
        prefixIcon: prefixIcon,
        maxLength: maxLength,
        maxLines: lines ?? 1,
        keyboardType: keyboardType ?? TextInputType.text,
        validator: isRequired
            ? (value) =>
            FormValidatorUtils.validateRequired(value?.trim(), fieldName: title)
            : null,
      ),
    );
  }
}