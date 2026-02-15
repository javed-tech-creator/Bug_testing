import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/vendor_module/model/product_managemtn/vendor_product_management_list_model.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_add_product_screen.dart';
import 'package:dss_crm/vendor_module/screen/product_management/vendor_update_product_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../controller/vendor_api_provider.dart';

class VendorProductManagementListScreen extends StatefulWidget {
  const VendorProductManagementListScreen({super.key});

  @override
  State<VendorProductManagementListScreen> createState() => _VendorProductManagementListScreenState();
}

class _VendorProductManagementListScreenState extends State<VendorProductManagementListScreen> {

  final TextEditingController _searchController = TextEditingController();
  String searchQuery = '';
  List<Data> filteredProductList = [];
  List<Data> allProductList = [];

  @override
  void initState() {
    super.initState();
    getVendorProductList();
    _searchController.addListener(_onSearchChanged);
    // Future.microtask(() {
    //   Provider.of<VendorModuleApiProvider>(context, listen: false).getAllVendorProductList(context);
    // });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
  void _onSearchChanged() {
    setState(() {
      searchQuery = _searchController.text.toLowerCase();
      _filterPrductsList();
    });
  }

  void _filterPrductsList() {
    if (searchQuery.isEmpty) {
      filteredProductList = List.from(allProductList);
    } else {
      filteredProductList = allProductList.where((products) {
        return (products.productName?.toLowerCase().contains(searchQuery) ?? false) ||
            (products.productCode?.toLowerCase().contains(searchQuery) ?? false) ;
      }).toList();
    }
  }
  Future<void> getVendorProductList()async {
    Future.microtask(() {
      Provider.of<VendorModuleApiProvider>(context, listen: false).getAllVendorProductList(context);
    });
  }

  void _showProductBottomSheet(Data productData) {
    final productMap = {
      'id': productData.sId?.toString() ?? '',
      'productCode': productData.productCode ?? '',
      'productName': productData.productName ?? '',
      'brand': productData.brand ?? '',
      'unitType': productData.unitType ?? '',
      'size': productData.size ?? '',
      'totalStock': (productData.totalStock ?? 0).toString(),
      'usedStock': (productData.usedStock ?? 0).toString(),
      'inStock': (productData.inStock ?? 0).toString(),
      'rate': (productData.rateUnit is int || productData.rateUnit is double)
          ? productData.rateUnit.toString()
          : '0',
      'gst': (productData.gstPercent is int || productData.gstPercent is double)
          ? productData.gstPercent.toString()
          : '0',
      'category': productData.category ?? '',
      'createdAt': DateFormatterUtils.formatUtcToReadable(productData.createdAt ?? ''),
      'description': productData.description ?? '',
    };

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: ResponsiveHelper.screenHeight(context) * 0.85,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: ResponsiveHelper.borderRadiusOnly(
            context,
            topLeft: 24,
            topRight: 24,
          ),
        ),
        child: Column(
          children: [
            // Handle bar
            Container(
              margin: ResponsiveHelper.paddingOnly(context, top: 12),
              height: ResponsiveHelper.spacing(context, 4),
              width: ResponsiveHelper.spacing(context, 40),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: ResponsiveHelper.borderRadiusAll(context, 2),
              ),
            ),

            // Header
            Padding(
              padding: ResponsiveHelper.paddingAll(context, 20),
              child: Row(
                children: [
                  Container(
                    padding: ResponsiveHelper.paddingAll(context, 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1A73E8),
                      borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF1A73E8).withOpacity(0.2),
                          blurRadius: ResponsiveHelper.elevation(context, 8),
                          offset: Offset(0, ResponsiveHelper.spacing(context, 4)),
                        ),
                      ],
                    ),
                    child: Icon(
                      Icons.inventory_2_outlined,
                      color: Colors.white,
                      size: ResponsiveHelper.iconSize(context, 26),
                    ),
                  ),
                  ResponsiveHelper.sizedBoxWidth(context, 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          productData.productName ?? 'Unknown Product',
                          style: AppTextStyles.custom(
                            context,
                            size: 14,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF1A1A1A),
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 4),
                        Text(
                          productData.productCode ?? '',
                          style: AppTextStyles.custom(
                            context,
                            size: 12,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF666666),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(
                      Icons.close,
                      color: const Color(0xFF666666),
                      size: ResponsiveHelper.iconSize(context, 20),
                    ),
                    style: IconButton.styleFrom(
                      backgroundColor: const Color(0xFFF5F5F5),
                      shape: RoundedRectangleBorder(
                        borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Expanded(
              child: SingleChildScrollView(
                padding: ResponsiveHelper.paddingSymmetric(context, horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Basic Info Section
                    _buildInfoSection(
                      title: 'Basic Information',
                      icon: Icons.info_outline,
                      children: [
                        _buildInfoRow('Brand', productData.brand ?? 'N/A', Icons.branding_watermark_outlined),
                        _buildInfoRow('Category', productData.category ?? 'N/A', Icons.category_outlined),
                        _buildInfoRow('Unit Type', productData.unitType ?? 'N/A', Icons.straighten),
                        _buildInfoRow('Size', productData.size ?? 'N/A', Icons.photo_size_select_large_outlined),
                      ],
                    ),

                    ResponsiveHelper.sizedBoxHeight(context, 24),

                    // Stock Information
                    _buildInfoSection(
                      title: 'Stock Information',
                      icon: Icons.inventory_outlined,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: _buildStockCard(
                                'Total Stock',
                                productData.totalStock.toString() ?? '0',
                                Icons.inventory_2_outlined,
                                const Color(0xFF1A73E8),
                              ),
                            ),
                            ResponsiveHelper.sizedBoxWidth(context, 12),
                            Expanded(
                              child: _buildStockCard(
                                'Used Stock',
                                productData.usedStock.toString() ?? '0',
                                Icons.remove_circle_outline,
                                const Color(0xFF666666),
                              ),
                            ),
                          ],
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 12),
                        _buildStockCard(
                          'In Stock',
                          productData.inStock.toString() ?? '0',
                          Icons.check_circle_outline,
                          const Color(0xFF34A853),
                          fullWidth: true,
                        ),
                      ],
                    ),

                    ResponsiveHelper.sizedBoxHeight(context, 24),

                    // Pricing Information
                    _buildInfoSection(
                      title: 'Pricing Information',
                      icon: Icons.currency_rupee,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: ResponsiveHelper.paddingAll(context, 16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF8F9FA),
                                  borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                                  border: Border.all(color: const Color(0xFFE8EAED)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        // Icon(
                                        //   Icons.currency_rupee,
                                        //   color: const Color(0xFF1A73E8),
                                        //   size: ResponsiveHelper.iconSize(context, 18),
                                        // ),
                                        // ResponsiveHelper.sizedBoxWidth(context, 8),
                                        Text(
                                          'Rate/Unit',
                                          style: AppTextStyles.custom(
                                            context,
                                            size: 12,
                                            fontWeight: FontWeight.w500,
                                            color: const Color(0xFF666666),
                                          ),
                                        ),
                                      ],
                                    ),
                                    ResponsiveHelper.sizedBoxHeight(context, 8),
                                    Text(
                                      '₹${productData.rateUnit ?? '0'}',
                                      style: AppTextStyles.custom(
                                        context,
                                        size: 14,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF1A1A1A),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            ResponsiveHelper.sizedBoxWidth(context, 12),
                            Expanded(
                              child: Container(
                                padding: ResponsiveHelper.paddingAll(context, 16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF8F9FA),
                                  borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                                  border: Border.all(color: const Color(0xFFE8EAED)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        // Icon(
                                        //   Icons.percent,
                                        //   color: const Color(0xFF1A73E8),
                                        //   size: ResponsiveHelper.iconSize(context, 18),
                                        // ),
                                        // ResponsiveHelper.sizedBoxWidth(context, 8),
                                        Text(
                                          'GST',
                                          style: AppTextStyles.custom(
                                            context,
                                            size: 12,
                                            fontWeight: FontWeight.w500,
                                            color: const Color(0xFF666666),
                                          ),
                                        ),
                                      ],
                                    ),
                                    ResponsiveHelper.sizedBoxHeight(context, 8),
                                    Text(
                                      '${productData.gstPercent?? '0'}%',
                                      style: AppTextStyles.custom(
                                        context,
                                        size: 14,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF1A1A1A),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    ResponsiveHelper.sizedBoxHeight(context, 24),

                    // Description & Date
                    if (productData.description?.isNotEmpty == true) ...[
                      _buildInfoSection(
                        title: 'Description',
                        icon: Icons.description_outlined,
                        children: [
                          Container(
                            width: double.infinity,
                            padding: ResponsiveHelper.paddingAll(context, 16),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8F9FA),
                              borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                              border: Border.all(color: const Color(0xFFE8EAED)),
                            ),
                            child: Text(
                              productData.description ?? '',
                              style: AppTextStyles.custom(
                                context,
                                size: 12,
                                color: const Color(0xFF666666),
                              ),
                            ),
                          ),
                        ],
                      ),
                      ResponsiveHelper.sizedBoxHeight(context, 24),
                    ],

                    // Created Date
                    _buildInfoSection(
                      title: 'Created Date',
                      icon: Icons.calendar_month,
                      children: [
                        Container(
                          width: double.infinity,
                          padding: ResponsiveHelper.paddingAll(context, 16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8F9FA),
                            borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                            border: Border.all(color: const Color(0xFFE8EAED)),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.schedule_outlined,
                                color: const Color(0xFF1A73E8),
                                size: ResponsiveHelper.iconSize(context, 18),
                              ),
                              ResponsiveHelper.sizedBoxWidth(context, 12),
                              Text(
                                DateFormatterUtils.formatUtcToReadable(productData.createdAt?? 'N/A'),
                                style: AppTextStyles.custom(
                                  context,
                                  size: 12,
                                  fontWeight: FontWeight.w500,
                                  color: const Color(0xFF1A1A1A),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    ResponsiveHelper.sizedBoxHeight(context, 20),
                  ],
                ),
              ),
            ),

            // Action Button
            Padding(
              padding: ResponsiveHelper.paddingAll(context, 20),
              child: CustomButton(
                text: 'Edit Product',
                color: AppColors.primary,
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => VendorUpdateProductScreen(productData: productData),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoSection({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: ResponsiveHelper.paddingAll(context, 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF8F9FA),
                borderRadius: ResponsiveHelper.borderRadiusAll(context, 8),
              ),
              child: Icon(
                icon,
                color: const Color(0xFF1A73E8),
                size: ResponsiveHelper.iconSize(context, 18),
              ),
            ),
            ResponsiveHelper.sizedBoxWidth(context, 12),
            Text(
              title,
              style: AppTextStyles.custom(
                context,
                size: 12,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1A1A1A),
              ),
            ),
          ],
        ),
        ResponsiveHelper.sizedBoxHeight(context, 16),
        ...children,
      ],
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Padding(
      padding: ResponsiveHelper.paddingOnly(context, bottom: 12),
      child: Row(
        children: [
          Container(
            padding: ResponsiveHelper.paddingAll(context, 8),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F9FA),
              borderRadius: ResponsiveHelper.borderRadiusAll(context, 8),
            ),
            child: Icon(
              icon,
              color: const Color(0xFF666666),
              size: ResponsiveHelper.iconSize(context, 16),
            ),
          ),
          ResponsiveHelper.sizedBoxWidth(context, 12),
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: AppTextStyles.custom(
                context,
                size: 12,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF666666),
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: AppTextStyles.custom(
                context,
                size: 12,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1A1A1A),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStockCard(
      String label,
      String value,
      IconData icon,
      Color color, {
        bool fullWidth = false,
      }) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
        border: Border.all(color: const Color(0xFFE8EAED)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: ResponsiveHelper.elevation(context, 4),
            offset: Offset(0, ResponsiveHelper.spacing(context, 2)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color: color,
                size: ResponsiveHelper.iconSize(context, 18),
              ),
              ResponsiveHelper.sizedBoxWidth(context, 8),
              Expanded(
                child: Text(
                  label,
                  style: AppTextStyles.custom(
                    context,
                    size: 12,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF666666),
                  ),
                ),
              ),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 8),
          Text(
            value,
            style: AppTextStyles.custom(
              context,
              size: fullWidth ? 18 : 18,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductCard(Data productData) {
    final inStock = int.tryParse(productData.inStock.toString() ?? '0') ?? 0;
    final isLowStock = inStock < 10;

    return Container(
      margin: ResponsiveHelper.paddingAll(context,  12),
      child: Material(
        color: Colors.white,
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
        elevation: 0,
        child: InkWell(
          borderRadius: ResponsiveHelper.borderRadiusAll(context, 16),
          // onTap: () => _showProductBottomSheet(productData),
          child: Container(
            padding: ResponsiveHelper.paddingAll(context, 10),
            decoration: BoxDecoration(
              borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
              color: Colors.white,
              border: Border.all(
                color: isLowStock ? const Color(0xFFE57373) : const Color(0xFFE8EAED),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: ResponsiveHelper.elevation(context, 8),
                  offset: Offset(0, ResponsiveHelper.spacing(context, 2)),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Row
                Row(
                  children: [
                    Container(
                      padding: ResponsiveHelper.paddingAll(context, 10),
                      decoration: BoxDecoration(
                        color: AppColors.blueColor,
                        borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.blueColor.withAlpha(50),
                            blurRadius: ResponsiveHelper.elevation(context, 6),
                            offset: Offset(0, ResponsiveHelper.spacing(context, 3)),
                          ),
                        ],
                      ),
                      child: Icon(
                        Icons.inventory_2_outlined,
                        color: Colors.white,
                        size: ResponsiveHelper.iconSize(context, 22),
                      ),
                    ),
                    ResponsiveHelper.sizedBoxWidth(context, 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            productData.productName ?? 'Unknown Product',
                            style: AppTextStyles.heading1(
                              context,
                              overrideStyle: TextStyle(
                                fontSize: ResponsiveHelper.fontSize(context, 14),
                              ),
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          ResponsiveHelper.sizedBoxHeight(context, 2),
                          Container(
                            padding: ResponsiveHelper.paddingSymmetric(
                              context,
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8F9FA),
                              borderRadius: ResponsiveHelper.borderRadiusAll(context, 6),
                              border: Border.all(color: const Color(0xFFE8EAED)),
                            ),
                            child: Text(
                              productData.productCode ?? '',
                              style: AppTextStyles.custom(
                                context,
                                size: 12,
                                fontWeight: FontWeight.w500,
                                color: const Color(0xFF666666),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (isLowStock)
                      Container(
                        padding: ResponsiveHelper.paddingAll(context, 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFEBEE),
                          borderRadius: ResponsiveHelper.borderRadiusAll(context, 8),
                        ),
                        child: Icon(
                          Icons.warning_amber_rounded,
                          color: const Color(0xFFE57373),
                          size: ResponsiveHelper.iconSize(context, 18),
                        ),
                      ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 16),

                // Brand and Category Row
                Row(
                  children: [
                    Expanded(
                      child: _buildInfoChip(
                        Icons.branding_watermark_outlined,
                        'Brand',
                        productData.brand ?? 'N/A',
                      ),
                    ),
                    ResponsiveHelper.sizedBoxWidth(context, 12),
                    Expanded(
                      child: _buildInfoChip(
                        Icons.category_outlined,
                        'Category',
                        productData.category ?? 'N/A',
                      ),
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 12),

                // Stock and Price Row
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: ResponsiveHelper.paddingAll(context, 12),
                        decoration: BoxDecoration(
                          // color: isLowStock
                          //     ? const Color(0xFFFFEBEE)
                          //     : const Color(0xFFE8F5E8),
                          color: const Color(0xFFF8F9FA),
                          borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
                          border: Border.all(
                            color: const Color(0xFFF8F9FA),
                            // color: isLowStock
                            //     ? const Color(0xFFE57373)
                            //     : const Color(0xFF34A853),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  Icons.inventory_outlined,
                                  color: isLowStock ? const Color(0xFFE57373) : const Color(0xFF34A853),
                                  size: ResponsiveHelper.iconSize(context, 16),
                                ),
                                ResponsiveHelper.sizedBoxWidth(context, 6),
                                Text(
                                  'In Stock',
                                  style: AppTextStyles.custom(
                                    context,
                                    size: 10,
                                    fontWeight: FontWeight.w500,
                                    color: isLowStock ? const Color(0xFFE57373) : const Color(0xFF34A853),
                                  ),
                                ),
                              ],
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 4),
                            Text(
                              productData.inStock.toString() ?? '0',
                              style: AppTextStyles.custom(
                                context,
                                size: 12,
                                fontWeight: FontWeight.w600,
                                color: isLowStock ? const Color(0xFFE57373) : const Color(0xFF34A853),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    ResponsiveHelper.sizedBoxWidth(context, 12),
                    Expanded(
                      child: Container(
                        padding: ResponsiveHelper.paddingAll(context, 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8F9FA),
                          borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
                          border: Border.all(color: const Color(0xFFE8EAED)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  Icons.currency_rupee,
                                  color: const Color(0xFF1A73E8),
                                  size: ResponsiveHelper.iconSize(context, 16),
                                ),
                                ResponsiveHelper.sizedBoxWidth(context, 6),
                                Text(
                                  'Rate/Unit',
                                  style: AppTextStyles.custom(
                                    context,
                                    size: 10,
                                    fontWeight: FontWeight.w500,
                                    color: const Color(0xFF666666),
                                  ),
                                ),
                              ],
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 4),
                            Text(
                              '₹${productData.rateUnit ?? '0'}',
                              style: AppTextStyles.custom(
                                context,
                                size: 12,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF1A1A1A),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                ResponsiveHelper.sizedBoxHeight(context, 12),

                // Tap to view more
                InkWell(
                  onTap: (){
                    _showProductBottomSheet(productData);
                  },
                  child: Container(
                    width: double.infinity,
                    padding: ResponsiveHelper.paddingSymmetric(context, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F9FA),
                      borderRadius: ResponsiveHelper.borderRadiusAll(context, 8),
                      border: Border.all(color: const Color(0xFFE8EAED)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.touch_app_outlined,
                          color: const Color(0xFF666666),
                          size: ResponsiveHelper.iconSize(context, 16),
                        ),
                        ResponsiveHelper.sizedBoxWidth(context, 8),
                        Text(
                          'Tap to view details',
                          style: AppTextStyles.custom(
                            context,
                            size: 12,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF666666),
                          ),
                        ),
                        ResponsiveHelper.sizedBoxWidth(context, 4),
                        Icon(
                          Icons.keyboard_arrow_up,
                          color: const Color(0xFF666666),
                          size: ResponsiveHelper.iconSize(context, 16),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label, String value) {
    return Container(
      padding: ResponsiveHelper.paddingAll(context, 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F9FA),
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
        border: Border.all(color: const Color(0xFFE8EAED)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color: const Color(0xFF666666),
                size: ResponsiveHelper.iconSize(context, 14),
              ),
              ResponsiveHelper.sizedBoxWidth(context, 6),
              Expanded(
                child: Text(
                  label,
                  style: AppTextStyles.custom(
                    context,
                    size: 10,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF666666),
                  ),
                ),
              ),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 4),
          Text(
            value,
            style: AppTextStyles.custom(
              context,
              size: 12,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF1A1A1A),
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }


  List<Data> _getFilteredProductsList(List<Data> produtcs) {
    if (searchQuery.isEmpty) return produtcs;
    return produtcs
        .where(
          (singleProduct) =>
      (singleProduct.productName?.toLowerCase().contains(searchQuery) ??
          false),
    )
        .toList();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          'Product Management',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              color: Colors.white,
              fontSize: ResponsiveHelper.fontSize(context, 16),
            ),
          ),
        ),
        actions: [
          Container(
            margin: ResponsiveHelper.paddingOnly(
              context,
              right: 16,
              top: 8,
              bottom: 8,
            ),
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => VendorAddProductScreen(),
                  ),
                );
              },
              icon:  Icon(Icons.add, size:ResponsiveHelper.iconSize(context, 18) , color: Colors.orange),
              label: Text(
                'Add Product',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    color: AppColors.orangeColor,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.white,
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: ResponsiveHelper.paddingSymmetric(
                  context,
                  horizontal: 16,
                  vertical: 8,
                ),
              ),
            ),
          ),
        ],
      ),
      body: Consumer<VendorModuleApiProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return LoadingIndicatorUtils();
          }

          final response = provider.getAllVenodorProductListModelResponse;
          if (response == null || !response.success || response.data == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: ResponsiveHelper.paddingAll(context, 24),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F9FA),
                      borderRadius: ResponsiveHelper.borderRadiusAll(context, 20),
                    ),
                    child: Icon(
                      Icons.inventory_2_outlined,
                      size: ResponsiveHelper.iconSize(context, 64),
                      color: const Color(0xFF9E9E9E),
                    ),
                  ),
                  ResponsiveHelper.sizedBoxHeight(context, 16),
                  Text(
                    "No products found!",
                    style: AppTextStyles.custom(
                      context,
                      size: 18,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF666666),
                    ),
                  ),
                  ResponsiveHelper.sizedBoxHeight(context, 8),
                  Text(
                    "Add some products to get started",
                    style: AppTextStyles.custom(
                      context,
                      size: 14,
                      color: const Color(0xFF9E9E9E),
                    ),
                  ),
                ],
              ),
            );
          }
          final products = response.data!.data ?? [];

          final filteredProductsList = _getFilteredProductsList(products);

          // final List<Map<String, dynamic>> productData = products.map((item) {
          //   return {
          //     'productCode': item.productCode ?? '',
          //     'productName': "${item.productName ?? ''}",
          //     'brand': item.brand ?? '',
          //     'unitType': item.unitType ?? '',
          //     'size': item.size ?? '',
          //     'totalStock': (item.totalStock ?? 0).toString(),
          //     'usedStock': (item.usedStock ?? 0).toString(),
          //     'inStock': (item.inStock ?? 0).toString(),
          //     'rate': (item.rateUnit is int || item.rateUnit is double)
          //         ? item.rateUnit.toString()
          //         : '0',
          //     'gst': (item.gstPercent is int || item.gstPercent is double)
          //         ? item.gstPercent.toString()
          //         : '0',
          //     'category': item.category ?? '',
          //     'createdAt': DateFormatterUtils.formatUtcToReadable(item.createdAt ?? ''),
          //     'description': item.description ?? '',
          //   };
          // }).toList();

          return Column(
            children: [
              // Header with product count
              Container(
                padding: ResponsiveHelper.paddingAll(context, 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: ResponsiveHelper.elevation(context, 4),
                      offset: Offset(0, ResponsiveHelper.spacing(context, 2)),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.inventory_2_outlined,
                      color: const Color(0xFF1A73E8),
                      size: ResponsiveHelper.iconSize(context, 24),
                    ),
                    ResponsiveHelper.sizedBoxWidth(context, 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Product Inventory',
                          style: AppTextStyles.heading2(
                            context,overrideStyle: TextStyle(fontSize: 16)
                          ),
                        ),
                        Text(
                          '${products.length} products available',
                          style: AppTextStyles.body2(
                              context,overrideStyle: TextStyle(fontSize: 12)
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                color: AppColors.whiteColor,
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search by product name..',
                      hintStyle: TextStyle(color: Colors.grey[500]),
                      prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
                      suffixIcon: searchQuery.isNotEmpty
                          ? IconButton(
                        onPressed: () {
                          _searchController.clear();
                        },
                        icon: Icon(Icons.clear, color: Colors.grey[600]),
                      )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                ),
              ),

              // Product List
              Expanded(
                child: Consumer<VendorModuleApiProvider>(
                  builder: (context, provider, child) {
                    if (provider.isLoading) {
                      return LoadingIndicatorUtils(); // full screen loader
                    }

                    final response = provider.getAllVenodorProductListModelResponse;
                    if (response == null || !response.success) {
                      return Center(child: Text("No products found!"));
                    }

                    final products = response.data?.data ?? [];
                    return RefreshIndicator(
                      onRefresh: getVendorProductList,
                      child: filteredProductsList.isEmpty
                          ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.search_off,
                              size: ResponsiveHelper.iconSize(context, 60),
                              color: Colors.grey.shade400,
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 16),
                            Text(
                              'No product found',
                              style: AppTextStyles.body1(
                                context,
                                overrideStyle: TextStyle(
                                  color:AppColors.txtGreyColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    12,
                                  ),
                                ),
                              ),
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 8),
                            Text(
                              'Try adjusting your search terms',
                              style: AppTextStyles.body1(
                                context,
                                overrideStyle: TextStyle(
                                  color:AppColors.txtGreyColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    12,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      )
                      : ListView.builder(
                        // itemCount: products.length,
                        itemCount: filteredProductsList.length ,
                        itemBuilder: (context, index) {
                          return  _buildProductCard(filteredProductsList[index]);
                        },
                      ),
                    );
                  },
                ),
              ),



            ],
          );
        },
      ),
    );
  }
}