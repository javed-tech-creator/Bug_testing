import 'package:dss_crm/vendor_module/controller/vendor_dashboard_api_provider.dart';
import 'package:dss_crm/vendor_module/screen/bank/add_bank_detail_screen.dart';
import 'package:dss_crm/vendor_module/screen/customer/add_new_customer_screen.dart';
import 'package:flutter/material.dart';
import 'package:dss_crm/utils/custom_text_field_utils.dart';
import 'package:dss_crm/utils/custom_buttons_utils.dart';
import 'package:dss_crm/utils/custom_snack_bar.dart';
import 'package:dss_crm/utils/default_common_app_bar.dart';
import 'package:dss_crm/utils/form_validations_utils.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import '../../controller/vendor_api_provider.dart';

/// ---------------------- MODEL ----------------------
class InvoiceItem {
  final String id;
  final String productName;
  final String productCode;
  int quantity;
  final double unitPrice;
  final double taxRate;
  double discount;

  InvoiceItem({
    required this.id,
    required this.productName,
    required this.productCode,
    required this.quantity,
    required this.unitPrice,
    this.taxRate = 28.0,
    this.discount = 0.0,
  });

  // double get netAmount => quantity * unitPrice;
  //
  // double get taxAmount => (netAmount * taxRate) / 100;
  //
  // double get discountAmount => (netAmount * discount) / 100;
  //
  // double get totalAmount => netAmount + taxAmount - discountAmount;

  // Calculate net amount (Qty * Unit Price)
  double get netAmount => quantity * unitPrice;

  // Calculate discount amount based on net amount
  double get discountAmount => (netAmount * discount) / 100;

  // Calculate the amount after discount but before tax
  double get netAmountAfterDiscount => netAmount - discountAmount;

  // Calculate tax amount on the discounted price
  double get taxAmount => netAmountAfterDiscount * (taxRate / 100);

  // The final total amount is the discounted price plus tax
  double get totalAmount => netAmountAfterDiscount + taxAmount;
}

class VendorCreateInvoiceDraftScreen extends StatefulWidget {
  // final bool isDraft = false;
  // // const VendorCreateInvoiceScreen({super.key});
  // const VendorCreateInvoiceScreen({Key? key, required this.isDraft}) : super(key: key);

  @override
  State<VendorCreateInvoiceDraftScreen> createState() =>
      _VendorCreateInvoiceDraftScreenState();
}

class _VendorCreateInvoiceDraftScreenState
    extends State<VendorCreateInvoiceDraftScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _invoiceDateController = TextEditingController();
  final TextEditingController _dueDateController = TextEditingController();
  final TextEditingController _qtyController = TextEditingController();
  final TextEditingController _unitPriceController = TextEditingController();

  String? _selectedCategory;
  String? _selectedBank;
  List<String> _categoryList = [];
  List<String> _bankList = [];

  // Dropdown selections - using unique IDs instead of names
  String? _selectedCustomerId;
  String? _selectedCustomerName;
  String? _selectedProductId;
  String? _selectedProductName; // ID की जगह name store करें
  // String? _selectedProductId;

  // Customer and Product lists
  List<Map<String, dynamic>> _customerList = [];
  List<Map<String, dynamic>> _productList = [];

  List<InvoiceItem> _invoiceItems = [];
  Map<String, dynamic>? _selectedProductData;

  bool _isLoadingCategories = true;
  bool _isLoadingBanks = true;
  bool _isLoadingCustomers = true;
  bool _isLoadingProducts = true;
  bool _isCreatingInvoice = false;

  @override
  void initState() {
    super.initState();
    _invoiceDateController.text = DateTime.now().toString().split(' ')[0];
    _fetchAllData();
  }

  @override
  void dispose() {
    _invoiceDateController.dispose();
    _dueDateController.dispose();
    _qtyController.dispose();
    _unitPriceController.dispose();
    super.dispose();
  }

  Future<void> _fetchAllData() async {
    await Future.wait([
      _fetchCategories(),
      _fetchCustomers(),
      _fetchProducts(),
      _fetchBankList(),
    ]);
  }

  Future<void> _fetchCategories() async {
    final apiProvider = Provider.of<VendorModuleApiProvider>(
      context,
      listen: false,
    );

    setState(() => _isLoadingCategories = true);

    try {
      await apiProvider.getAllVendorCategoryList(context);
      final response = apiProvider.getVendorCategoryListModelResponse;

      if (response != null && response.success && response.data != null) {
        final List<String> fetched = response.data!.data!
            .map((item) => item.categoryName ?? '')
            .where((name) => name.isNotEmpty)
            .toSet() // Remove duplicates
            .toList();

        setState(() {
          _categoryList = ['All Categories', ...fetched];
          if (_categoryList.isNotEmpty) {
            _selectedCategory = _categoryList.first;
          }
        });
      } else {
        setState(() {
          _categoryList = ['All Categories'];
          _selectedCategory = 'All Categories';
        });
      }
    } catch (e) {
      debugPrint("Error fetching categories: $e");
      setState(() {
        _categoryList = ['All Categories'];
        _selectedCategory = 'All Categories';
      });
    } finally {
      setState(() => _isLoadingCategories = false);
    }
  }

  Future<void> _fetchBankList() async {
    final apiProvider = Provider.of<VendorDashboardApiProvider>(
      context,
      listen: false,
    );

    setState(() => _isLoadingBanks = true);

    try {
      await apiProvider.getVendorBankDetailList(context);
      final response = apiProvider.getVendorBankDetailListModelResponse;

      if (response != null && response.success && response.data != null) {
        final List<String> fetched = response.data!.data!
            // .map((item) => item.bankName ?? '')
            .map(
              (item) => "${item.bankName ?? ''} (${item.accountNumber ?? ''})",
            )
            .where((name) => name.isNotEmpty)
            .toSet() // Remove duplicates
            .toList();

        setState(() {
          _bankList = ['All Banks', ...fetched];
          if (_bankList.isNotEmpty) {
            _selectedBank = _bankList.first;
          }
        });
      } else {
        setState(() {
          _bankList = ['All Banks'];
          _selectedBank = 'All Banks';
        });
      }
    } catch (e) {
      debugPrint("Error fetching Banks: $e");
      setState(() {
        _bankList = ['All Banks'];
        _selectedBank = 'All Banks';
      });
    } finally {
      setState(() => _isLoadingBanks = false);
    }
  }

  Widget _buildLoadingDropdown({required String label}) {
    return Container(
      height: 56,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade400),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey.shade700)),
          const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
        ],
      ),
    );
  }

  Future<void> _fetchCustomers() async {
    final apiProvider = Provider.of<VendorModuleApiProvider>(
      context,
      listen: false,
    );

    setState(() => _isLoadingCustomers = true);

    try {
      await apiProvider.getAllVendorCustomerList(context);
      final response = apiProvider.getAllVenodorCustomerListModelResponse;

      if (response != null &&
          response.data != null &&
          response.data!.data != null) {
        // Create a map to track unique customers by ID
        final Map<String, Map<String, dynamic>> uniqueCustomers = {};

        for (var customer in response.data!.data!) {
          final id = customer.sId ?? '';
          final fullName = customer.fullName ?? '';

          if (id.isNotEmpty && fullName.isNotEmpty) {
            uniqueCustomers[id] = {
              '_id': id,
              'fullName': fullName,
              'phone': customer.phone ?? '',
              'email': customer.email ?? '',
            };
          }
        }

        setState(() {
          _customerList = uniqueCustomers.values.toList();
        });
      } else {
        setState(() {
          _customerList = [];
        });
      }
    } catch (e) {
      debugPrint("Error fetching customers: $e");
      setState(() {
        _customerList = [];
      });
    } finally {
      setState(() => _isLoadingCustomers = false);
    }
  }

  Future<void> _fetchProducts() async {
    final apiProvider = Provider.of<VendorModuleApiProvider>(
      context,
      listen: false,
    );

    setState(() => _isLoadingProducts = true);

    try {
      await apiProvider.getAllVendorProductList(context);
      final response = apiProvider.getAllVenodorProductListModelResponse;

      if (response != null &&
          response.data != null &&
          response.data!.data != null) {
        // Create a map to track unique products by ID
        final Map<String, Map<String, dynamic>> uniqueProducts = {};

        for (var product in response.data!.data!) {
          final id = product.sId ?? '';
          final productName = product.productName ?? '';

          if (id.isNotEmpty && productName.isNotEmpty) {
            // Create display name with code for uniqueness
            final displayName =
                product.productCode != null && product.productCode!.isNotEmpty
                ? "${product.productName} (${product.productCode})"
                : product.productName!;

            uniqueProducts[id] = {
              'id': id,
              'productName': product.productName,
              'displayName': displayName,
              'productCode': product.productCode ?? '',
              'price': (product.rateUnit as num?)?.toDouble() ?? 0.0,
              'taxRate': (product.gstPercent as num?)?.toDouble() ?? 18.0,
              'inStock': (product.inStock as num?)?.toInt() ?? 0,
              'category': product.category ?? '',
              'brand': product.brand ?? '',
              'unitType': product.unitType ?? '',
              'size': product.size ?? '',
            };
          }
        }

        setState(() {
          _productList = uniqueProducts.values.toList();
        });
      } else {
        setState(() {
          _productList = [];
        });
      }
    } catch (e) {
      debugPrint("Error fetching products: $e");
      setState(() {
        _productList = [];
      });
    } finally {
      setState(() => _isLoadingProducts = false);
    }
  }

  Future<void> _selectDate(TextEditingController controller) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      controller.text = picked.toString().split(' ')[0];
    }
  }

  void _onProductSelected(String? productIdentifier) {
    if (productIdentifier != null && productIdentifier.isNotEmpty) {
      Map<String, dynamic> productData;

      // अगर आप option 1 use कर रहे हैं (product name)
      productData = _productList.firstWhere(
        (product) => product['productName'] == productIdentifier,
        orElse: () => {},
      );

      // अगर आप option 2 use कर रहे हैं (product ID)
      // productData = _productList.firstWhere(
      //   (product) => product['id'] == productIdentifier,
      //   orElse: () => {},
      // );

      if (productData.isNotEmpty) {
        setState(() {
          _selectedProductName = productData['productName']; // यदि option 1
          _selectedProductId = productData['id'];
          _selectedProductData = productData;
          _unitPriceController.text = productData['price'].toString();
        });
      }
    } else {
      setState(() {
        _selectedProductName = null; // यदि option 1
        _selectedProductId = null;
        _selectedProductData = null;
        _unitPriceController.clear();
      });
    }
  }

  void _onCustomerSelected(String? customerName) {
    // setState(() {
    //   _selectedCustomerId = customerId;
    // });
    if (customerName != null) {
      setState(() {
        _selectedCustomerName = customerName;
        // Find the customer's map using the selected name
        final selectedCustomerData = _customerList.firstWhere(
          (customer) => customer['fullName'] == customerName,
          orElse: () =>
              <String, dynamic>{}, // Handle case where customer is not found
        );
        // Store the customer's ID
        _selectedCustomerId = selectedCustomerData['_id'] as String?;
      });
    } else {
      setState(() {
        _selectedCustomerName = null;
        _selectedCustomerId = null;
      });
    }
  }

  // NEW METHOD: Get available stock for a product
  int _getAvailableStockForProduct(String productId) {
    final productData = _productList.firstWhere(
      (product) => product['id'] == productId,
      orElse: () => {'inStock': 0},
    );
    return productData['inStock'] as int? ?? 0;
  }

  // NEW METHOD: Update quantity with stock validation
  void _updateQuantity(int index, int newQuantity) {
    if (newQuantity <= 0) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Quantity must be at least 1',
        backgroundColor: Colors.red,
      );
      return;
    }

    final item = _invoiceItems[index];
    final availableStock = _getAvailableStockForProduct(item.id);

    if (newQuantity > availableStock) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Not enough stock! Available: $availableStock',
        backgroundColor: Colors.red,
      );
      return;
    }

    setState(() {
      _invoiceItems[index].quantity = newQuantity;
    });

    // CustomSnackbarHelper.customShowSnackbar(
    //   context: context,
    //   message: 'Quantity updated to $newQuantity',
    //   backgroundColor: Colors.blue,
    // );
  }

  // NEW METHOD: Increment quantity
  void _incrementQuantity(int index) {
    final currentQuantity = _invoiceItems[index].quantity;
    _updateQuantity(index, currentQuantity + 1);
  }

  // NEW METHOD: Decrement quantity
  void _decrementQuantity(int index) {
    final currentQuantity = _invoiceItems[index].quantity;
    if (currentQuantity > 1) {
      _updateQuantity(index, currentQuantity - 1);
    } else {
      // If quantity would become 0, ask user to remove item instead
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Use remove button to delete item',
        backgroundColor: Colors.orange,
      );
    }
  }

  void _addToBill() {
    if (_selectedProductData == null || _selectedProductData!.isEmpty) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Please select a product.',
        backgroundColor: Colors.red,
      );
      return;
    }

    final qty = int.tryParse(_qtyController.text.trim()) ?? 0;
    if (qty <= 0) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Please enter valid quantity.',
        backgroundColor: Colors.red,
      );
      return;
    }

    final unitPrice = double.tryParse(_unitPriceController.text.trim()) ?? 0.0;
    if (unitPrice <= 0) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Please enter valid unit price.',
        backgroundColor: Colors.red,
      );
      return;
    }

    // Check stock availability
    final availableStock = _selectedProductData!['inStock'] as int? ?? 0;
    if (qty > availableStock) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Not enough stock! Available: $availableStock',
        backgroundColor: Colors.red,
      );
      return;
    }

    // Check if product already exists in invoice
    final existingIndex = _invoiceItems.indexWhere(
      (item) => item.id == _selectedProductData!['id'].toString(),
    );

    if (existingIndex != -1) {
      // Update existing item quantity
      final newQty = _invoiceItems[existingIndex].quantity + qty;
      if (newQty > availableStock) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: 'Total quantity exceeds stock! Available: $availableStock',
          backgroundColor: Colors.red,
        );
        return;
      }

      setState(() {
        _invoiceItems[existingIndex] = InvoiceItem(
          id: _invoiceItems[existingIndex].id,
          productName: _invoiceItems[existingIndex].productName,
          productCode: _invoiceItems[existingIndex].productCode,
          quantity: newQty,
          unitPrice: unitPrice,
          taxRate:
              (_selectedProductData!['taxRate'] as num?)?.toDouble() ?? 18.0,
          discount: _invoiceItems[existingIndex].discount,
        );
      });
    } else {
      // Add new item
      final newItem = InvoiceItem(
        id: _selectedProductData!['id'].toString(),
        productName: _selectedProductData!['productName'] ?? '',
        productCode: _selectedProductData!['productCode'] ?? '',
        quantity: qty,
        unitPrice: unitPrice,
        taxRate: (_selectedProductData!['taxRate'] as num?)?.toDouble() ?? 18.0,
      );

      setState(() {
        _invoiceItems.add(newItem);
      });
    }

    // Clear form fields
    // setState(() {
    //   _qtyController.clear();
    //   _unitPriceController.clear();
    //   _selectedProductId = null;
    //   _selectedProductData = null;
    //   _selectedProductName = null;
    // });

    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      message: 'Product added to bill!',
      backgroundColor: Colors.green,
    );
  }

  void _removeItem(int index) {
    setState(() => _invoiceItems.removeAt(index));

    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      message: 'Item removed from bill!',
      backgroundColor: Colors.orange,
    );
  }

  void _updateDiscount(int index, double discount) {
    setState(() => _invoiceItems[index].discount = discount);
  }

  double get _totalAmount =>
      _invoiceItems.fold(0.0, (sum, item) => sum + item.totalAmount);

  double get _totalNetAmount =>
      _invoiceItems.fold(0.0, (sum, item) => sum + item.netAmount);

  double get _totalTaxAmount =>
      _invoiceItems.fold(0.0, (sum, item) => sum + item.taxAmount);

  double get _totalDiscountAmount =>
      _invoiceItems.fold(0.0, (sum, item) => sum + item.discountAmount);

  int get _totalQuantity =>
      _invoiceItems.fold(0, (sum, item) => sum + item.quantity);

  Future<void> _handleCreateInvoice() async {
    if (!_formKey.currentState!.validate()) return;

    // if (_selectedCustomerId == null || _selectedCustomerId!.isEmpty) {
    //   CustomSnackbarHelper.customShowSnackbar(
    //     context: context,
    //     message: 'Please select a customer.',
    //     backgroundColor: Colors.red,
    //   );
    //   return;
    // }

    if (_invoiceItems.isEmpty) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: 'Please add at least one product.',
        backgroundColor: Colors.red,
      );
      return;
    }

    setState(() {
      _isCreatingInvoice = true;
    });

    // final selectedCustomerData = _customerList.firstWhere(
    //   (customer) => customer['id'] == _selectedCustomerId,
    //   orElse: () => {},
    // );

    // final invoiceBody = {
    //   "customerId": selectedCustomerData['id'],
    //   "customerName": selectedCustomerData['fullName'],
    //   "invoiceDate": _invoiceDateController.text.trim(),
    //   "dueDate": _dueDateController.text.trim(),
    //   "category": _selectedCategory,
    //   "items": _invoiceItems.map((e) {
    //     return {
    //       "productId": e.id,
    //       "productName": e.productName,
    //       "productCode": e.productCode,
    //       "quantity": e.quantity,
    //       "unitPrice": e.unitPrice,
    //       "taxRate": e.taxRate,
    //       "discount": e.discount,
    //       "netAmount": e.netAmount,
    //       "taxAmount": e.taxAmount,
    //       "discountAmount": e.discountAmount,
    //       "totalAmount": e.totalAmount,
    //     };
    //   }).toList(),
    //   "totalQuantity": _totalQuantity,
    //   "totalNetAmount": _totalNetAmount,
    //   "totalTaxAmount": _totalTaxAmount,
    //   "totalDiscountAmount": _totalDiscountAmount,
    //   "totalAmount": _totalAmount,
    // };

    final invoiceBody = {
      "items": _invoiceItems.map((e) {
        return {
          "productId": e.id,
          "productName": e.productName,
          "quantity": e.quantity,
          "rateUnit": e.unitPrice, // पहले unitPrice था, अब rateUnit
          "netAmount": e.netAmount,
          "netAmountAfterDiscount": e.netAmount - e.discountAmount,
          "taxPrice": e.taxAmount,
          "discount": e.discountAmount,
          "gstPercent": e.taxRate, // पहले taxRate, अब gstPercent
          "priceWithTax": e.totalAmount,
        };
      }).toList(),

      // Invoice Totals
      "totalNetAmount": _totalNetAmount,
      "totalNetAmountAfterDiscount": _totalNetAmount - _totalDiscountAmount,
      "totalDiscount": _totalDiscountAmount,
      "totalTaxAmount": _totalTaxAmount,
      "roundOff": true,
      "roundOffAmount": (_totalAmount - _totalAmount.roundToDouble()),
      "grandTotal": _totalAmount.round(),
      "invoiceDate": _invoiceDateController.text.trim(),
      "dueDate": _dueDateController.text.trim(),
      // Customer
      "customerId": _selectedCustomerId,
      // "bankDetailId": ,
    };

    debugPrint("Invoice Body => $invoiceBody");

    // TODO: Implement your API call here
    final apiProvider = Provider.of<VendorModuleApiProvider>(
      context,
      listen: false,
    );
    final result = await apiProvider.createInvoiceDraft(context, invoiceBody);

    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      message: 'Draft created successfully!',
      backgroundColor: Colors.green,
    );
  }

  /// ---------------------- CARD-BASED INVOICE ITEMS ----------------------
  Widget _buildInvoiceCards() {
    if (_invoiceItems.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        margin: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.grey.shade200, width: 1),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.shopping_cart_outlined,
              size: 64,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 16),
            Text(
              "Your cart is empty",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              "Add items to get started",
              style: TextStyle(fontSize: 14, color: Colors.grey.shade500),
            ),
          ],
        ),
      );
    }

    return Column(
      children: [
        // Items List (E-commerce Style)
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey.shade200, width: 1),
          ),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _invoiceItems.length,
            separatorBuilder: (context, index) => Divider(
              height: 1,
              thickness: 1,
              color: Colors.grey.shade200,
              indent: 16,
              endIndent: 16,
            ),
            itemBuilder: (context, index) {
              final item = _invoiceItems[index];

              return Container(
                padding: ResponsiveHelper.paddingAll(context,16),
                child: Column(
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Product Details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Product Name
                              Text(
                                item.productName,
                                style: AppTextStyles.heading1(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      12,
                                    ),
                                  ),
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),

                              ResponsiveHelper.sizedBoxHeight(context, 4),

                              // Product Code (like SKU)
                              if (item.productCode.isNotEmpty)
                                Text(
                                  "Code: ${item.productCode}",
                                  style: AppTextStyles.body1(
                                    context,
                                    overrideStyle: TextStyle(
                                      fontSize: ResponsiveHelper.fontSize(
                                        context,
                                        10,
                                      ),
                                    ),
                                  ),
                                ),

                              ResponsiveHelper.sizedBoxHeight(context, 8),
                              // Price Section (E-commerce style)
                              Row(
                                children: [
                                  Text(
                                    "₹${item.totalAmount.toStringAsFixed(2)}",
                                    style: AppTextStyles.heading1(
                                      context,
                                      overrideStyle: TextStyle(
                                        fontSize: ResponsiveHelper.fontSize(
                                          context,
                                          14,
                                        ),
                                        color: AppColors.blueColor,
                                      ),
                                    ),
                                  ),
                                  ResponsiveHelper.sizedBoxWidth(context, 8),
                                  if (item.discount > 0) ...[
                                    Text(
                                      "₹${item.netAmount.toStringAsFixed(2)}",
                                      style: AppTextStyles.body1(
                                        context,
                                        overrideStyle: TextStyle(
                                          fontSize: ResponsiveHelper.fontSize(
                                            context,
                                            12,
                                          ),
                                          color: Colors.red,
                                          decoration:
                                              TextDecoration.lineThrough,
                                        ),
                                      ),
                                    ),
                                    ResponsiveHelper.sizedBoxWidth(context, 8),
                                    Container(
                                      padding: ResponsiveHelper.paddingSymmetric(
                                        context,
                                        horizontal: 6,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.green.shade600,
                                        borderRadius: ResponsiveHelper.borderRadiusAll(context,4),
                                      ),
                                      child: Text(
                                        "${item.discount.toStringAsFixed(0)}% off",
                                        style: AppTextStyles.heading1(
                                          context,
                                          overrideStyle: TextStyle(
                                            fontSize: ResponsiveHelper.fontSize(
                                              context,
                                              8,
                                            ),
                                            color: AppColors.whiteColor,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                  // Remove Button moved here at the end of price row
                                  const Spacer(),
                                  TextButton.icon(
                                    onPressed: () => _removeItem(index),
                                    icon: Icon(
                                      Icons.delete_outline,
                                      size: ResponsiveHelper.iconSize(context, 14),
                                      color: Colors.red.shade600,
                                    ),
                                    label: Text(
                                      "Remove",
                                      style: AppTextStyles.heading1(
                                        context,
                                        overrideStyle: TextStyle(
                                          fontSize: ResponsiveHelper.fontSize(
                                            context,
                                            10,
                                          ),
                                          color: Colors.red,
                                        ),
                                      ),
                                    ),
                                    style: TextButton.styleFrom(
                                      padding: EdgeInsets.zero,
                                      minimumSize: Size.zero,
                                      tapTargetSize:
                                          MaterialTapTargetSize.shrinkWrap,
                                    ),
                                  ),
                                ],
                              ),

                              ResponsiveHelper.sizedBoxHeight(context, 8),

                              // Tax Info
                              Text(
                                "Inclusive of all taxes (${item.taxRate}%)",
                                style: AppTextStyles.caption(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      8
                                    ),
                                  ),
                                ),
                              ),
                              ResponsiveHelper.sizedBoxHeight(context, 12),

                              // Quantity Controls with Discount Field (E-commerce style)
                              Row(
                                children: [
                                  Container(
                                    decoration: BoxDecoration(
                                      border: Border.all(
                                        color: Colors.grey.shade300,
                                      ),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        InkWell(
                                          onTap: () {
                                            if (item.quantity > 1) {
                                              _decrementQuantity(index);
                                            }
                                          },
                                          child: Container(
                                            padding: const EdgeInsets.all(8),
                                            child: Icon(
                                              Icons.remove,
                                              size: ResponsiveHelper.iconSize(context,14),
                                              color: Colors.grey.shade600,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: ResponsiveHelper.paddingSymmetric(
                                            context,
                                            horizontal: 16,
                                            vertical: 8,
                                          ),
                                          decoration: BoxDecoration(
                                            border: Border.symmetric(
                                              vertical: BorderSide(
                                                color: Colors.grey.shade300,
                                              ),
                                            ),
                                          ),
                                          child: Text(
                                            "${item.quantity}",
                                            style: AppTextStyles.heading1(
                                              context,
                                              overrideStyle: TextStyle(
                                                fontSize: ResponsiveHelper.fontSize(
                                                  context,
                                                  10,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                        InkWell(
                                          onTap: () {
                                            _incrementQuantity(index);
                                          },
                                          child: Container(
                                            padding: const EdgeInsets.all(8),
                                            child: Icon(
                                              Icons.add,
                                              size: ResponsiveHelper.iconSize(context,14),
                                              color: Colors.grey.shade600,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  const Spacer(),

                                  // Discount Input - moved to right side of quantity row
                                  Container(
                                    // height: 40,
                                    // Same as quantity container height
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(4),
                                      border: Border.all(
                                        color: Colors.grey.shade300,
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.only(
                                            left: 6,
                                          ),
                                          child: Icon(
                                            Icons.local_offer_outlined,
                                            size: ResponsiveHelper.iconSize(context, 10),
                                            color: Colors.grey.shade600,
                                          ),
                                        ),
                                        SizedBox(
                                          width: 40,
                                          child: TextFormField(
                                            initialValue: item.discount
                                                .toString(),
                                            keyboardType: TextInputType.number,
                                            textAlign: TextAlign.center,
                                            decoration: InputDecoration(
                                              hintText: "0",
                                              border: InputBorder.none,
                                              contentPadding:
                                                ResponsiveHelper.paddingSymmetric(
                                                    context,
                                                    vertical: 0,
                                                  ),
                                              hintStyle: TextStyle(
                                                fontSize: 10,
                                                color: Colors.grey.shade500,
                                              ),
                                              suffixText: '%',
                                              suffixStyle: TextStyle(
                                                fontSize: 10,
                                                color: Colors.grey.shade600,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                            style: const TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w500,
                                            ),
                                            onChanged: (val) => _updateDiscount(
                                              index,
                                              double.tryParse(val) ?? 0,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),

                        ResponsiveHelper.sizedBoxWidth(context, 8),

                        // Price Column (Right side like e-commerce)
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              "₹${item.unitPrice.toStringAsFixed(2)}",
                              style: AppTextStyles.body2(
                                context,
                                overrideStyle: TextStyle(
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    8,
                                  ),
                                  color: Colors.black
                                ),
                              ),
                            ),
                            Text(
                              "per unit",
                              style: AppTextStyles.heading1(
                                context,
                                overrideStyle: TextStyle(
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    10,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),

        ResponsiveHelper.sizedBoxHeight(context,20),

        // Price Summary Card (E-commerce Style)
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: ResponsiveHelper.borderRadiusAll(context,8),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Column(
            children: [
              // Header
              Container(
                padding: ResponsiveHelper.paddingAll(context,14),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(8),
                    topRight: Radius.circular(8),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.receipt_long_outlined,
                      color: Colors.grey.shade700,
                      size: ResponsiveHelper.iconSize(context, 18),
                    ),
                    ResponsiveHelper.sizedBoxWidth(context,8),
                    Text(
                      "PRICE DETAILS (${_invoiceItems.length} Items)",
                      style: AppTextStyles.heading1(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(
                            context,
                            10,
                          ),
                          letterSpacing: 0.1
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Price Breakdown
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildEcommerceSummaryRow(
                      "Total MRP",
                      "₹${(_totalNetAmount).toStringAsFixed(0)}",
                      false,
                    ),

                    const SizedBox(height: 12),

                    _buildEcommerceSummaryRow(
                      "Discount on MRP",
                      "- ₹${_totalDiscountAmount.toStringAsFixed(2)}",
                      false,
                      isGreen: true,
                    ),

                    const SizedBox(height: 12),

                    _buildEcommerceSummaryRow(
                      "Convenience Fee",
                      "₹${_totalTaxAmount.toStringAsFixed(2)}",
                      false,
                    ),

                    ResponsiveHelper.sizedBoxHeight(context,14),

                    // Divider
                    Container(
                      height: 1,
                      width: double.infinity,
                      color: Colors.grey.shade300,
                    ),

                    ResponsiveHelper.sizedBoxHeight(context,14),

                    _buildEcommerceSummaryRow(
                      "Total Amount",
                      "₹${_totalAmount.toStringAsFixed(0)}",
                      true,
                    ),

                    ResponsiveHelper.sizedBoxHeight(context,14),

                    // Savings Banner
                    if (_totalDiscountAmount > 0)
                      Container(
                        width: double.infinity,
                        padding: ResponsiveHelper.paddingAll(context,12),
                        decoration: BoxDecoration(
                          color: Colors.green.shade50,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: Colors.green.shade200),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.savings_outlined,
                              color: Colors.green.shade700,
                              size: ResponsiveHelper.iconSize(context, 14),
                            ),
                            ResponsiveHelper.sizedBoxWidth(context,8),

                            Text(
                              "You will save ₹${_totalDiscountAmount.toStringAsFixed(0)} on this order",
                              style: AppTextStyles.heading1(
                                context,
                                overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      10,
                                    ),
                                  color: Colors.green.shade700,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // E-commerce style summary row
  Widget _buildEcommerceSummaryRow(
    String label,
    String value,
    bool isBold, {
    bool isGreen = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          // style: TextStyle(
          //   fontSize: isBold ? 16 : 14,
          //   fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
          //   color: isBold ? Colors.black87 : Colors.grey.shade700,
          // ),
          style: AppTextStyles.heading1(
            context,
            overrideStyle: TextStyle(
              fontSize: ResponsiveHelper.fontSize(
                context,
                10,
              ),
              color: isBold ? Colors.black87 : Colors.grey.shade700,
            ),

          ),
        ),
        Text(
          value,
          // style: TextStyle(
          //   fontSize: isBold ? 16 : 14,
          //   fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
          //   color: isBold
          //       ? Colors.black87
          //       : isGreen
          //       ? Colors.green.shade700
          //       : Colors.black87,
          // ),
          style: AppTextStyles.heading1(
            context,
            overrideStyle: TextStyle(
              fontSize: ResponsiveHelper.fontSize(
                context,
                10,
              ),
              color: isBold
                  ? Colors.black87
                  : isGreen
                  ? Colors.green.shade700
                  : Colors.black87,
            ),
          ),
        ),
      ],
    );
  }

  /// ---------------------- BUILD ----------------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: DefaultCommonAppBar(
        activityName: "Create Draft",
        backgroundColor: AppColors.primary,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: ResponsiveHelper.paddingSymmetric(
            context,
            horizontal: 0.0,
            vertical: 0.0,
          ),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  padding: ResponsiveHelper.paddingAll(context,20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        spreadRadius: 0,
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.person,
                            color: AppColors.primary,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            "Customer Information",
                            style: AppTextStyles.heading1(
                              context,
                              overrideStyle: TextStyle(
                                fontSize: ResponsiveHelper.fontSize(
                                  context,
                                  12,
                                ),
                              ),

                            ),
                          ),
                        ],
                      ),
                      ResponsiveHelper.sizedBoxHeight(context, 5),
                      Container(
                        padding: const EdgeInsets.all(0),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(0),
                          // boxShadow: [
                          //   BoxShadow(
                          //     color: Colors.black.withOpacity(0.04),
                          //     spreadRadius: 0,
                          //     blurRadius: 8,
                          //     offset: const Offset(0, 2),
                          //   ),
                          // ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Date Fields
                            Row(
                              children: [
                                Expanded(
                                  child: CustomTextField(
                                    title: 'Invoice Date *',
                                    hintText: "dd-mm-yyyy",
                                    controller: _invoiceDateController,
                                    prefixIcon: Icons.calendar_month,
                                    readOnly: true,
                                    onTap: () =>
                                        _selectDate(_invoiceDateController),
                                    validator: (val) =>
                                        FormValidatorUtils.validateRequired(
                                          val,
                                          fieldName: 'Invoice Date',
                                        ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: CustomTextField(
                                    title: 'Due Date *',
                                    hintText: "dd-mm-yyyy",
                                    controller: _dueDateController,
                                    prefixIcon: Icons.calendar_month,
                                    readOnly: true,
                                    onTap: () =>
                                        _selectDate(_dueDateController),
                                    // validator: (val) =>
                                    //     FormValidatorUtils.validateRequired(
                                    //       val,
                                    //       fieldName: 'Due Date',
                                    //     ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      // Customer Dropdown
                      _isLoadingCustomers
                          ? _buildLoadingDropdown(label: 'Loading Customers...')
                          : _customerList.isEmpty
                          ? Container(
                              height: 56,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                              ),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.red.shade300),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Center(
                                child: Text(
                                  'No customers found',
                                  style: TextStyle(color: Colors.red),
                                ),
                              ),
                            )
                          : ResponsiveDropdown<String>(
                              value: _selectedCustomerName,
                              itemList: _customerList
                                  .map(
                                    (customer) =>
                                        customer['fullName'] as String,
                                  )
                                  .toList(),
                              // onChanged: _onCustomerSelected,
                              onChanged: (String? newName) {
                                // Call the handler to manage both name and ID
                                _onCustomerSelected(newName);
                              },
                              hint: 'Select Customer',
                              label: 'Select Customer *',
                            ),

                      InkWell(
                        onTap: () {
                          /// Navigate to Add Bank Screen
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  const AddNewCustomerlScreen(),
                            ),
                          );
                        },
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.add,
                              color: AppColors.orangeColor,
                              size: ResponsiveHelper.iconSize(context,20),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Add New Customer',
                              style: AppTextStyles.heading1(
                                context,
                                overrideStyle: TextStyle(
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    10,
                                  ),
                                  color: AppColors.orangeColor
                                ),

                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context,16),

                // Category Selection Card
                Container(
                  padding: ResponsiveHelper.paddingAll(context,20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        spreadRadius: 0,
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.category,
                            color: AppColors.primary,
                            size: ResponsiveHelper.iconSize(context, 18),
                          ),
                          ResponsiveHelper.sizedBoxWidth(context,8),
                          Text(
                            "Products & Services",
                            style: AppTextStyles.heading1(
                              context,
                              overrideStyle: TextStyle(
                                fontSize: ResponsiveHelper.fontSize(
                                  context,
                                  12,
                                ),
                              ),

                            ),
                          ),
                        ],
                      ),
                      ResponsiveHelper.sizedBoxHeight(context, 10),
                      _isLoadingCategories
                          ? _buildLoadingDropdown(
                              label: 'Loading Categories...',
                            )
                          : _categoryList.isEmpty
                          ? Container(
                              height: 56,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                              ),
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: Colors.orange.shade300,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Center(
                                child: Text(
                                  'No categories found',
                                  style: TextStyle(color: Colors.orange),
                                ),
                              ),
                            )
                          : ResponsiveDropdown<String>(
                              value: _selectedCategory,
                              itemList: _categoryList,
                              onChanged: (val) =>
                                  setState(() => _selectedCategory = val),
                              hint: 'Select Category',
                              label: 'Category',
                            ),

                      // Product Dropdown
                      _isLoadingProducts
                          ? _buildLoadingDropdown(label: 'Loading Products...')
                          : _productList.isEmpty
                          ? Container(
                              height: 56,
                              padding: ResponsiveHelper.paddingSymmetric(
                                context,
                                horizontal: 16,
                              ),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.red.shade300),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Center(
                                child: Text(
                                  'No products found',
                                  style: TextStyle(color: Colors.red),
                                ),
                              ),
                            )
                          : ResponsiveDropdown<String>(
                              value: _selectedProductName,
                              itemList: _productList
                                  .map(
                                    (product) =>
                                        product['productName'] as String,
                                  )
                                  .toList(),
                              onChanged: (String? productName) {
                                if (productName != null &&
                                    productName.isNotEmpty) {
                                  final productData = _productList.firstWhere(
                                    (product) =>
                                        product['productName'] == productName,
                                    orElse: () => {},
                                  );

                                  if (productData.isNotEmpty) {
                                    setState(() {
                                      _selectedProductName = productName;
                                      _selectedProductId = productData['id'];
                                      _selectedProductData = productData;
                                      _unitPriceController.text =
                                          productData['price'].toString();
                                    });
                                  }
                                } else {
                                  setState(() {
                                    _selectedProductName = null;
                                    _selectedProductId = null;
                                    _selectedProductData = null;
                                    _unitPriceController.clear();
                                  });
                                }
                              },
                              hint: 'Select Product',
                              label: 'Select Product',
                            ),

                      // Product Details Card (shows when product is selected)
                      if (_selectedProductData != null &&
                          _selectedProductData!.isNotEmpty)
                        Container(
                          padding: ResponsiveHelper.paddingAll(
                              context,16),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Colors.blue.shade50,
                                Colors.blue.shade100.withOpacity(0.3),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.blue.shade200),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    Icons.info_outline,
                                    color: Colors.blue.shade600,
                                    size: ResponsiveHelper.iconSize(context,16),
                                  ),
                                  ResponsiveHelper.sizedBoxWidth(context, 8),
                                  Text(
                                    'Selected Product Details',
                                    style: AppTextStyles.heading1(
                                      context,
                                      overrideStyle: TextStyle(
                                        fontSize: ResponsiveHelper.fontSize(
                                          context,
                                          12,
                                        ),
                                        color: AppColors.blueColor
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              ResponsiveHelper.sizedBoxHeight(context, 12),
                              Row(
                                children: [
                                  Expanded(
                                    child: Row(
                                      children: [
                                        Icon(
                                          Icons.inventory,
                                          size: ResponsiveHelper.iconSize(context, 14),
                                          color: Colors.blue.shade600,
                                        ),
                                        ResponsiveHelper.sizedBoxWidth(context, 4),
                                        Text(
                                          'Stock: ${_selectedProductData!['inStock']} ${_selectedProductData!['unitType'] ?? 'units'}',
                                          style: AppTextStyles.heading1(
                                            context,
                                            overrideStyle: TextStyle(
                                                fontSize: ResponsiveHelper.fontSize(
                                                  context,
                                                  10,
                                                ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Expanded(
                                    child: Row(
                                      children: [
                                        Icon(
                                          Icons.local_offer,
                                          size: ResponsiveHelper.iconSize(context, 14),
                                          color: Colors.blue.shade600,
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          'GST: ${_selectedProductData!['taxRate']}%',
                                          style: AppTextStyles.heading1(
                                            context,
                                            overrideStyle: TextStyle(
                                              fontSize: ResponsiveHelper.fontSize(
                                                context,
                                                10,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              if (_selectedProductData!['brand']?.isNotEmpty ==
                                  true)
                                Padding(
                                  padding: const EdgeInsets.only(top: 8),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.branding_watermark,
                                        size: ResponsiveHelper.iconSize(context, 14),
                                        color: Colors.blue.shade600,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Brand: ${_selectedProductData!['brand']}',
                                        style: AppTextStyles.heading1(
                                          context,
                                          overrideStyle: TextStyle(
                                            fontSize: ResponsiveHelper.fontSize(
                                              context,
                                              10,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                        ),

                      // Quantity and Unit Price Row
                      // Quantity and Unit Price Row
                      // Quantity and Unit Price Row
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        // Align children to the bottom
                        children: [
                          Expanded(
                            child: CustomTextField(
                              title: 'Quantity',
                              hintText: "Enter Quantity",
                              controller: _qtyController,
                              keyboardType: TextInputType.number,
                              validator: (val) {
                                if (val == null || val.trim().isEmpty) {
                                  return 'Quantity is required';
                                }
                                final qty = int.tryParse(val.trim()) ?? 0;
                                if (qty <= 0) {
                                  return 'Enter valid quantity';
                                }
                                if (_selectedProductData != null) {
                                  final availableStock =
                                      _selectedProductData!['inStock']
                                          as int? ??
                                      0;
                                  if (qty > availableStock) {
                                    return 'Exceeds stock ($availableStock)';
                                  }
                                }
                                return null;
                              },
                            ),
                          ),
                          ResponsiveHelper.sizedBoxWidth(context, 12),
                          Expanded(
                            child: Padding(
                              padding: ResponsiveHelper.paddingOnly(context,bottom: 8.0),
                              // Add padding to align with the text field's bottom
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      Colors.orange.shade400,
                                      Colors.orange.shade600,
                                    ],
                                    begin: Alignment.centerLeft,
                                    end: Alignment.centerRight,
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.orange.withOpacity(0.3),
                                      spreadRadius: 0,
                                      blurRadius: 8,
                                      offset: const Offset(0, 3),
                                    ),
                                  ],
                                ),
                                child: ElevatedButton.icon(
                                  onPressed: _addToBill,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.transparent,
                                    shadowColor: Colors.transparent,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  icon:  Icon(
                                    Icons.add_shopping_cart,
                                    size: ResponsiveHelper.iconSize(context,18),
                                  ),
                                  label:  Text(
                                    "Add to Bill",
                                    style: AppTextStyles.heading1(
                                      context,
                                      overrideStyle: TextStyle(
                                        fontSize: ResponsiveHelper.fontSize(
                                          context,
                                          12,
                                        ),
                                        color: AppColors.whiteColor
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 20),

                Container(
                  padding:ResponsiveHelper.paddingAll(  context,20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        spreadRadius: 0,
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.food_bank,
                            color: AppColors.primary,
                            size: ResponsiveHelper.iconSize(context, 16),
                          ),
                          ResponsiveHelper.sizedBoxWidth(context, 8),
                          Text(
                            "Bank Selection",
                            style: AppTextStyles.heading1(
                              context,
                              overrideStyle: TextStyle(
                                fontSize: ResponsiveHelper.fontSize(
                                  context,
                                  12,
                                ),
                              ),

                            ),
                          ),
                        ],
                      ),
                      // Category Dropdown
                      _isLoadingBanks
                          ? _buildLoadingDropdown(label: 'Fetching banks...')
                          : _bankList.isEmpty
                          ? Container(
                              height: 56,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                              ),
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: Colors.orange.shade300,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Center(
                                child: Text(
                                  'No Bank found',
                                  style: TextStyle(color: Colors.orange),
                                ),
                              ),
                            )
                          : ResponsiveDropdown<String>(
                              value: _selectedBank,
                              itemList: _bankList,
                              onChanged: (val) =>
                                  setState(() => _selectedBank = val),
                              hint: 'Select Bank',
                              label: 'Bank',
                            ),

                      InkWell(
                        onTap: () {
                          /// Navigate to Add Bank Screen
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const AddBankDetailScreen(),
                            ),
                          );
                        },
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.account_balance,
                              color: AppColors.orangeColor,
                              size: ResponsiveHelper.iconSize(context, 14),
                            ),
                            ResponsiveHelper.sizedBoxWidth(context, 4),
                            Text(
                              'Add Bank',
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.orangeColor,
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 14),

                if (_invoiceItems.isNotEmpty)
                  Padding(
                    padding: ResponsiveHelper.paddingSymmetric(
                      context,
                      horizontal: 16.0,
                      vertical: 2,
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.receipt_long,
                          color: AppColors.primary,
                          size: ResponsiveHelper.iconSize(context, 12),
                        ),

                        ResponsiveHelper.sizedBoxWidth(context, 8),

                        Text(
                          'Invoice Items',
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                              fontSize: ResponsiveHelper.fontSize(
                                context,
                                12,
                              ),
                            ),

                          ),
                        ),

                        const Spacer(),

                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,

                            vertical: 6,
                          ),

                          decoration: BoxDecoration(
                            color: Colors.green.shade100,

                            borderRadius: BorderRadius.circular(20),

                            border: Border.all(color: Colors.green.shade300),
                          ),

                          child: Text(
                            '${_invoiceItems.length} items',

                            style: TextStyle(
                              fontSize: 13,

                              fontWeight: FontWeight.w600,

                              color: Colors.green.shade700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                // Invoice Cards
                _buildInvoiceCards(),

                // Create Invoice Button
                Consumer<VendorModuleApiProvider>(
                  builder: (context, provider, _) {
                    return Padding(
                      padding: ResponsiveHelper.paddingSymmetric(
                        context,
                        horizontal: 12.0,
                      ),
                      child: Container(
                        height: 55,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: provider.isLoading
                                ? [Colors.grey.shade400, Colors.grey.shade500]
                                : [
                                    AppColors.primary,
                                    AppColors.primary.withOpacity(0.8),
                                  ],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          ),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color:
                                  (provider.isLoading
                                          ? Colors.grey
                                          : AppColors.primary)
                                      .withOpacity(0.3),
                              spreadRadius: 0,
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: ElevatedButton.icon(
                          onPressed: provider.isLoading
                              ? null
                              : _handleCreateInvoice,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          icon: provider.isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Icon(Icons.receipt, size: 20),
                          label: Text(
                            provider.isLoading
                                ? "Creating Draft..."
                                : "Create Draft",
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
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
}
