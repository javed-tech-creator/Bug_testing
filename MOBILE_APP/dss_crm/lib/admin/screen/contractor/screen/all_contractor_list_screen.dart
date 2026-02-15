import 'package:dss_crm/admin/screen/contractor/screen/add_new_contractor_at_admin_screen.dart';
import 'package:dss_crm/admin/screen/contractor/screen/contractor_detail_at_admin_screen.dart';
import 'package:dss_crm/admin/screen/contractor/screen/update_contractor_details_at_admin_screen.dart';
import 'package:dss_crm/admin/screen/vendor/screen/vendor_detail_at_admin_screen.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dss_crm/admin/screen/vendor/model/all_vendor_list_model.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/custom_text_field_utils.dart';
import '../../../controller/admin_main_api_provider.dart';

class AllContractorListAtAdminScreen extends StatefulWidget {
  const AllContractorListAtAdminScreen({Key? key}) : super(key: key);

  @override
  State<AllContractorListAtAdminScreen> createState() =>
      _AllContractorListAtAdminScreenState();
}

class _AllContractorListAtAdminScreenState
    extends State<AllContractorListAtAdminScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  String _searchQuery = '';
  String _selectedFilter = 'All';
  int _currentPage = 1;
  final int _limit = 10;
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_scrollListener);

    // Delay the API call until after the first frame is built
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadVendors();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollListener() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      _loadMoreVendors();
    }
  }

  void _loadVendors() {
    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);

    if (_selectedFilter == 'All') {
      provider.getAllContractorListAtAdmin(context,page:  _currentPage, limit: _limit,isActive:  null);
    } else {
      bool isActive = _selectedFilter == 'Active';
      provider.getAllContractorListAtAdmin(context, page: _currentPage,limit:  _limit,isActive:  isActive);
    }
  }

  void _loadMoreVendors() async {
    if (_isLoadingMore) return;

    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    final response = provider.getAllVendorListAtAdminModelResponse;

    if (response?.data?.data != null) {
      final totalPages = response?.data?.totalPages ?? 0;

      if (_currentPage < totalPages) {
        setState(() {
          _isLoadingMore = true;
          _currentPage++;
        });

        if (_selectedFilter == 'All') {
          await provider.getAllContractorListAtAdmin(
            context,
           page:  _currentPage,
            limit: _limit,
            isActive: null,
          );
        } else {
          bool isActive = _selectedFilter == 'Active';
          await provider.getAllContractorListAtAdmin(
            context,
            page: _currentPage,
            limit: _limit,
           isActive:  isActive,
          );
        }

        setState(() => _isLoadingMore = false);
      }
    }
  }

  void _onFilterChanged(String? value) {
    if (value != null && value != _selectedFilter) {
      setState(() {
        _selectedFilter = value;
        _currentPage = 1;
      });
      _loadVendors();
    }
  }

  void _onSearchChanged(String value) {
    setState(() => _searchQuery = value.toLowerCase());
  }

  List<Data> _getFilteredVendors(List<Data>? vendors) {
    if (vendors == null) return [];

    List<Data> filtered = vendors.where((v) {
      if (_selectedFilter == 'Active') return v.isActive == true;
      if (_selectedFilter == 'Inactive') return v.isActive == false;
      return true;
    }).toList();

    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((vendor) {
        return (vendor.businessName?.toLowerCase().contains(_searchQuery) ??
                false) ||
            (vendor.contactPersonName?.toLowerCase().contains(_searchQuery) ??
                false) ||
            (vendor.email?.toLowerCase().contains(_searchQuery) ?? false) ||
            (vendor.contactNumber?.contains(_searchQuery) ?? false);
      }).toList();
    }

    return filtered;
  }

  void _refreshVendorList() {
    setState(() {
      _currentPage = 1;
    });
    _loadVendors();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteColor,
      appBar: AppBar(
        title: Text(
          'Contractor Management',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 14),
              color: AppColors.whiteColor,
            ),
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(
              Icons.add,
              size: 30,
            ),
            onPressed: () async  {
              final result = await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AddNewContractorAtAdminScreen(),
                ),
              );
              // If vendor was added successfully, refresh the list
              if (result == true) {
                _refreshVendorList();
              }
            },
          ),
          const SizedBox(width: 8),
        ],
        elevation: 0,
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Search + Filter Section
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: ResponsiveHelper.spacing(context, 10),
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                Padding(
                  padding: ResponsiveHelper.paddingOnly(
                    context,
                    top: 8,
                    left: 12,
                    right: 12,
                    bottom: 8,
                  ),
                  child: CustomTextField(
                    controller: _searchController,
                    hintText: 'Search contractor...',
                    prefixIcon: Icons.search_rounded,
                    validationType: ValidationType.none,
                    onChanged: _onSearchChanged,
                    onClear: () {
                      _searchController.clear();
                      _onSearchChanged('');
                    },
                    suffixIcon: null,
                  ),
                ),
                // Filter Pills
                Padding(
                  padding: ResponsiveHelper.paddingOnly(
                    context,
                    left: 16,
                    right: 16,
                    bottom: 10,
                  ),
                  child: Row(
                    children: [
                      _buildFilterPill('All', Icons.apps_rounded),
                      SizedBox(width: ResponsiveHelper.spacing(context, 10)),
                      _buildFilterPill(
                        'Active',
                        Icons.check_circle_outline_rounded,
                      ),
                      SizedBox(width: ResponsiveHelper.spacing(context, 10)),
                      _buildFilterPill('Inactive', Icons.cancel_outlined),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Vendor List
          Expanded(
            child: Consumer<AdminMainApiProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading && _currentPage == 1) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        LoadingIndicatorUtils(),
                        SizedBox(height: ResponsiveHelper.spacing(context, 16)),
                        Text(
                          'Loading contractors...',
                          style: AppTextStyles.caption(context),
                        ),
                      ],
                    ),
                  );
                }

                final response = provider.getAllVendorListAtAdminModelResponse;
                if (response?.data?.data == null ||
                    response!.data!.data!.isEmpty) {
                  return _buildEmptyState(
                    icon: Icons.store_outlined,
                    title: 'No Contractor Yet',
                    subtitle: 'Start by adding your first contractor',
                  );
                }

                final filteredVendors = _getFilteredVendors(
                  response.data!.data,
                );

                if (filteredVendors.isEmpty) {
                  return _buildEmptyState(
                    icon: Icons.search_off_rounded,
                    title: 'No Results Found',
                    subtitle: 'Try adjusting your search or filters',
                  );
                }

                return Column(
                  children: [
                    Expanded(
                      child: RefreshIndicator(
                        onRefresh: () async {
                          setState(() => _currentPage = 1);
                          _loadVendors();
                        },
                        color: AppColors.primary,
                        child: ListView.builder(
                          controller: _scrollController,
                          padding: EdgeInsets.fromLTRB(
                            ResponsiveHelper.spacing(context, 16),
                            0,
                            ResponsiveHelper.spacing(context, 16),
                            ResponsiveHelper.spacing(context, 16),
                          ),
                          itemCount:
                              filteredVendors.length + (_isLoadingMore ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index == filteredVendors.length) {
                              return Center(
                                child: Padding(
                                  padding: ResponsiveHelper.paddingAll(
                                    context,
                                    ResponsiveHelper.spacing(context, 24),
                                  ),
                                  child: LoadingIndicatorUtils(),
                                ),
                              );
                            }
                            return _buildModernVendorCard(filteredVendors[index], );
                          },
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterPill(String label, IconData icon) {
    final isSelected = _selectedFilter == label;
    return Expanded(
      child: InkWell(
        onTap: () => _onFilterChanged(label),
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
        child: Container(
          padding: EdgeInsets.symmetric(
            vertical: ResponsiveHelper.spacing(context, 10),
          ),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : Colors.white,
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
            border: Border.all(
              color: isSelected ? AppColors.primary : Colors.grey.shade300,
              width: 1.5,
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: ResponsiveHelper.iconSize(context, 18),
                color: isSelected ? Colors.white : Colors.grey[600],
              ),
              SizedBox(width: ResponsiveHelper.spacing(context, 6)),
              Text(
                label,
                style: AppTextStyles.custom(
                  context,
                  size: 13,
                  fontWeight: FontWeight.w600,
                  color: isSelected ? Colors.white : Colors.grey[700],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModernVendorCard(Data vendor) {
    final bool isActive = vendor.isActive ?? false;

    return Container(
      margin: EdgeInsets.only(bottom: ResponsiveHelper.spacing(context, 14,),top: ResponsiveHelper.spacing(context, 14,)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: ResponsiveHelper.spacing(context, 10),
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
          onTap: () {
            // Show vendor details
            showModalBottomSheet(
              context: context,
              isScrollControlled: true,
              backgroundColor: Colors.transparent,
              builder: (context) => ContractorDetailsBottomSheet(
                vendorId: vendor.sId.toString(),
              ),
            );
          },
          child: Padding(
            padding: EdgeInsets.all(ResponsiveHelper.spacing(context, 18)),
            child: Column(
              children: [
                Row(
                  children: [
                    // Avatar
                    Container(
                      width: ResponsiveHelper.containerWidth(context, 56),
                      height: ResponsiveHelper.containerHeight(context, 56),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            AppColors.orangeColor,
                            AppColors.orangeColor,
                          ],
                        ),
                        borderRadius: ResponsiveHelper.borderRadiusAll( context, 10, ),
                      ),
                      child: Center(
                        child: Text(
                          vendor.businessName?.isNotEmpty == true
                              ? vendor.businessName![0].toUpperCase()
                              : 'V',
                          style: AppTextStyles.heading1(context).copyWith(
                            fontSize: ResponsiveHelper.fontSize(context, 24),
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: ResponsiveHelper.spacing(context, 14)),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            vendor.businessName ?? 'N/A',
                            style: AppTextStyles.heading2(context).copyWith(
                              fontSize: ResponsiveHelper.fontSize(context, 16),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          SizedBox(
                            height: ResponsiveHelper.spacing(context, 6),
                          ),
                          Row(
                            children: [
                              // Status Badge
                              Container(
                                padding: EdgeInsets.symmetric(
                                  horizontal: ResponsiveHelper.spacing(
                                    context,
                                    10,
                                  ),
                                  vertical: ResponsiveHelper.spacing(
                                    context,
                                    4,
                                  ),
                                ),
                                decoration: BoxDecoration(
                                  color: isActive
                                      ? Colors.green.withOpacity(0.12)
                                      : Colors.red.withOpacity(0.12),
                                  borderRadius:
                                      ResponsiveHelper.borderRadiusAll(
                                        context,
                                        8,
                                      ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 6,
                                      height: 6,
                                      decoration: BoxDecoration(
                                        color: isActive
                                            ? Colors.green
                                            : Colors.red,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    SizedBox(
                                      width: ResponsiveHelper.spacing(
                                        context,
                                        6,
                                      ),
                                    ),
                                    Text(
                                      isActive ? 'Active' : 'Inactive',
                                      style: AppTextStyles.custom(
                                        context,
                                        size: 11,
                                        fontWeight: FontWeight.w700,
                                        color: isActive
                                            ? Colors.green
                                            : Colors.red,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              if (vendor.profileId != null) ...[
                                SizedBox(
                                  width: ResponsiveHelper.spacing(context, 8),
                                ),
                                Container(
                                  padding: EdgeInsets.symmetric(
                                    horizontal: ResponsiveHelper.spacing(
                                      context,
                                      8,
                                    ),
                                    vertical: ResponsiveHelper.spacing(
                                      context,
                                      4,
                                    ),
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors.whiteColor,
                                    borderRadius:
                                        ResponsiveHelper.borderRadiusAll(
                                          context,
                                          6,
                                        ),
                                    border: Border.all(
                                      color: Colors.grey.shade300,
                                    ),
                                  ),
                                  child: Text(
                                    vendor.profileId!,
                                    style: AppTextStyles.caption(context)
                                        .copyWith(
                                          fontSize: ResponsiveHelper.fontSize(
                                            context,
                                            10,
                                          ),
                                        ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ],
                      ),
                    ),
                    InkWell(
                      onTap: () async {
                        final result = await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => UpdateContractorAtAdminScreen(vendorId: vendor.sId!),
                          ),
                        );

                        // Refresh list if vendor was updated
                        if (result == true) {
                          _refreshVendorList();
                        }
                      },
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: EdgeInsets.all(ResponsiveHelper.spacing(context, 8)),
                        decoration: BoxDecoration(
                          color: AppColors.orangeColor.withAlpha(30),
                          shape: BoxShape.rectangle,
                          borderRadius: BorderRadius.all(Radius.circular(10,)),
                        ),
                        child: Icon(
                          Icons.edit_outlined,
                          size: ResponsiveHelper.iconSize(context, 20),
                          color: AppColors.orangeColor,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: ResponsiveHelper.spacing(context, 16)),
                Divider(height: 1, color: Colors.grey[200]),
                SizedBox(height: ResponsiveHelper.spacing(context, 16)),

                // Contact Info Rows
                _buildInfoRow(
                  Icons.person_outline_rounded,
                  'Contact',
                  vendor.contactPersonName,
                ),
                SizedBox(height: ResponsiveHelper.spacing(context, 10)),
                _buildInfoRow(
                  Icons.phone_outlined,
                  'Phone',
                  vendor.contactNumber,
                ),
                if (vendor.alternateContact?.isNotEmpty == true) ...[
                  SizedBox(height: ResponsiveHelper.spacing(context, 10)),
                  _buildInfoRow(
                    Icons.phone_android_outlined,
                    'Alt. Phone',
                    vendor.alternateContact,
                  ),
                ],
                SizedBox(height: ResponsiveHelper.spacing(context, 10)),
                _buildInfoRow(Icons.email_outlined, 'Email', vendor.email),
                SizedBox(height: ResponsiveHelper.spacing(context, 10)),
                _buildInfoRow(
                  Icons.location_on_outlined,
                  'Location',
                  '${vendor.city ?? ''}, ${vendor.state ?? ''}'.trim(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String? value) {
    return Row(
      children: [
        Container(
          padding: EdgeInsets.all(ResponsiveHelper.spacing(context, 8)),
          decoration: BoxDecoration(
            color: AppColors.lightBlueColor.withAlpha(100),
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
          ),
          child: Icon(
            icon,
            size: ResponsiveHelper.iconSize(context, 18),
            color: AppColors.primary,
          ),
        ),
        SizedBox(width: ResponsiveHelper.spacing(context, 12)),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.caption(
                  context,
                ).copyWith(fontSize: ResponsiveHelper.fontSize(context, 10)),
              ),
              SizedBox(height: ResponsiveHelper.spacing(context, 2)),
              Text(
                value ?? 'N/A',
                style: AppTextStyles.body1(context).copyWith(
                  fontSize: ResponsiveHelper.fontSize(context, 12),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(ResponsiveHelper.spacing(context, 20)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(ResponsiveHelper.spacing(context, 0)),
              decoration: const BoxDecoration(
                color: AppColors.whiteColor,
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: ResponsiveHelper.iconSize(context, 64),
                color: Colors.grey[400],
              ),
            ),
            SizedBox(height: ResponsiveHelper.spacing(context, 0)),
            Text(
              title,
              style: AppTextStyles.heading1(
                context,
              ).copyWith(fontSize: ResponsiveHelper.fontSize(context, 16)),
            ),
            SizedBox(height: ResponsiveHelper.spacing(context, 8)),
            Text(
              subtitle,
              style: AppTextStyles.caption(context,overrideStyle: new TextStyle(fontSize: ResponsiveHelper.fontSize(context, 10))),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
