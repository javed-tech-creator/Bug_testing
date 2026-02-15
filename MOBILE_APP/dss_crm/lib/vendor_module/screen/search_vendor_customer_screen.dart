import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/vendor_module/controller/vendor_api_provider.dart';
import 'package:dss_crm/vendor_module/model/vendor_customer/vendor_customer_list_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SearchVendorCustomerScreen extends StatefulWidget {
  const SearchVendorCustomerScreen({super.key});

  @override
  State<SearchVendorCustomerScreen> createState() => _SearchVendorCustomerScreenState();
}

class _SearchVendorCustomerScreenState extends State<SearchVendorCustomerScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Data> _filteredList = [];

  @override
  void initState() {
    super.initState();

    // API call jab screen open ho
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<VendorModuleApiProvider>(context, listen: false)
          .getAllVendorCustomerList(context);
    });
  }

  /// 🔎 Filter Function
  void _filterList(String query, List<Data> customerList) {
    if (query.isEmpty) {
      setState(() => _filteredList = customerList);
    } else {
      setState(() {
        _filteredList = customerList
            .where((cust) =>
        (cust.fullName ?? "")
            .toLowerCase()
            .contains(query.toLowerCase()) ||
            (cust.phone ?? "")
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
        final response = provider.getAllVenodorCustomerListModelResponse;
        final customerList = response?.data?.data ?? [];

        // first time fill _filteredList
        if (_filteredList.isEmpty && customerList.isNotEmpty) {
          _filteredList = customerList;
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
                  hintText: "Search customer...",
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
                onChanged: (value) => _filterList(value, customerList),
              ),
            ),
          ),

          // 📋 Result List
          body: provider.isLoading
              ? const Center(child: LoadingIndicatorUtils())
              : _filteredList.isEmpty
              ? const Center(
            child: Text(
              "No customers found",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          )
              : ListView.builder(
            itemCount: _filteredList.length,
            itemBuilder: (context, index) {
              final item = _filteredList[index];
              return Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 10, vertical: 6),
                child: Card(
                  elevation: 3,
                  color: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 10),
                    leading: CircleAvatar(
                      radius: 24,
                      backgroundColor: Colors.blue.shade100,
                      child: Text(
                        (item.fullName ?? "U")[0].toUpperCase(),
                        style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                    title: Text(
                      item.fullName ?? "",
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (item.phone != null)
                          Text(
                            item.phone!,
                            style: const TextStyle(fontSize: 14),
                          ),
                        if (item.email != null)
                          Text(
                            item.email!,
                            style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey[600]),
                          ),
                      ],
                    ),
                    trailing:
                    const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      Navigator.pop(context, item);
                    },
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
