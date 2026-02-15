import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ui_helper/app_colors.dart';
import '../../ui_helper/app_text_styles.dart';
import '../../utils/responsive_helper_utils.dart';
import '../controller/vendor_api_provider.dart';
import '../model/product_managemtn/vendor_product_management_list_model.dart';

class SearchProductScreen extends StatefulWidget {
  const SearchProductScreen({super.key});

  @override
  State<SearchProductScreen> createState() => _SearchProductScreenState();
}

class _SearchProductScreenState extends State<SearchProductScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Data> _filteredList = [];

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<VendorModuleApiProvider>(context, listen: false)
          .getAllVendorProductList(context);
    });
  }

  void _filterList(String query, List<Data> productList) {
    if (query.isEmpty) {
      setState(() => _filteredList = productList);
    } else {
      setState(() {
        _filteredList = productList
            .where((prod) =>
        (prod.productName ?? "")
            .toLowerCase()
            .contains(query.toLowerCase()) ||
            (prod.productCode ?? "")
                .toLowerCase()
                .contains(query.toLowerCase()))
            .toList();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<VendorModuleApiProvider>(
      builder: (context, provider, child) {
        final response = provider.getAllVenodorProductListModelResponse;
        final productList = response?.data?.data ?? [];

        if (_filteredList.isEmpty && productList.isNotEmpty) {
          _filteredList = productList;
        }

        return Scaffold(
          backgroundColor: AppColors.whiteColor,
          appBar: AppBar(
            backgroundColor: AppColors.primary,
            iconTheme: const IconThemeData( // 👈 Back button color
              color: Colors.white,
            ),
            automaticallyImplyLeading: true,
            titleSpacing: 0,
            title: Container(
              margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: "Search product",
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide.none,
                  ),
                  prefixIcon: const Icon(Icons.search),
                ),
                onChanged: (value) => _filterList(value, productList),
              ),
            ),
          ),
          body: provider.isLoading
              ? const Center(child: LoadingIndicatorUtils())
              : _filteredList.isEmpty
              ? const Center(child: Text("No products found"))
              : ListView.builder(
            itemCount: _filteredList.length,
            itemBuilder: (context, index) {
              final item = _filteredList[index];
              return Card(
                color: AppColors.whiteColor,
                margin: const EdgeInsets.symmetric(
                    horizontal: 10, vertical: 6),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    child: Text(
                      (item.productName ?? "P")[0].toUpperCase(),
                      style: AppTextStyles.heading1(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 14),
                        ),
                      ),
                    ),
                  ),
                  title: Text(item.productName ?? "", style: AppTextStyles.heading2(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 14),
                    ),
                  )),
                  subtitle: Text(item.productCode ?? ""),
                  trailing:
                  const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {
                    // ✅ FIX: Return proper product object with correct field names
                    final productData = {
                      'id': item.size ?? 0,
                      'name': item.productName ?? '',          // This field name matches your _addToBill() method
                      'productName': item.productName ?? '',   // For display in textfield
                      // 'price': item.price ?? 0.0,
                      'taxRate': item.rateUnit ?? 18.0,
                      'productCode': item.productCode ?? '',
                    };
                    Navigator.pop(context, item);
                  },
                ),
              );
            },
          ),
        );
      },
    );
  }
}
