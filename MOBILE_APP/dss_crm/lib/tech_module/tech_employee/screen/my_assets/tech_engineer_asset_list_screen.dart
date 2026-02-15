import 'dart:ui';

import 'package:dss_crm/tech_module/tech_employee/controller/tech_engineer_api_provider.dart';
import 'package:dss_crm/tech_module/tech_employee/model/tech_engineer_asset_list_model.dart';
import 'package:dss_crm/tech_module/tech_employee/screen/my_assets/tech_engineer_asset__list_card_item_widget.dart';
import 'package:dss_crm/tech_module/tech_employee/screen/my_assets/tech_engineer_asset_detail_bottom_sheet_widget.dart' show TechEngineerAssetDetailBottomSheet;
   import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../../tech_manager/model/asset_list_model.dart' show AssetFilter;
import '../../../tech_manager/widget/tech_asset_filter_sheet_widget.dart';


class TechEngineerAssetManagementScreen extends StatefulWidget {
  const TechEngineerAssetManagementScreen({Key? key}) : super(key: key);

  @override
  State<TechEngineerAssetManagementScreen> createState() => _TechEngineerAssetManagementScreenState();
}

class _TechEngineerAssetManagementScreenState extends State<TechEngineerAssetManagementScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  List<Data> _assets = [];
  List<Data> _filteredAssets = [];
  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _hasReachedEnd = false;
  String _searchQuery = '';
  int _currentPage = 1;
  final int _itemsPerPage = 5;
  int _totalItems = 0;
  AssetFilter? _currentFilter;

  @override
  void initState() {
    super.initState();
    // _loadAssets();
    loadAssets(isInitial: true);
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 20 &&
        !_isLoadingMore &&
        !_hasReachedEnd &&
        _searchQuery.isEmpty &&
        _currentFilter == null) {
      _loadMoreAssets();
    }
  }

  Future<void> loadAssets({bool isInitial = false}) async {
    final provider = Provider.of<TechEngineerApiProvider>(context, listen: false);

    // setState(() => _isLoading = true);
    if (isInitial) {
      setState(() {
        _isLoading = true;
        _currentPage = 1;
        _hasReachedEnd = false;
        _assets.clear();
        _filteredAssets.clear();
      });
    }

    try {
      await provider.getAllTechEngineerAssetsList(context, _currentPage, _itemsPerPage);

      final response = provider.getAllTechEngineerAssetsListModelResponse;
      if (response != null && response.success && response.data != null) {
        final newAssets = response.data!.data ?? [];
        final totalCount = response.data!.total ?? 0;
        setState(() {
          if (isInitial) {
            _assets = newAssets;
          } else {
            _assets.addAll(newAssets);
          }

          _totalItems = totalCount;
          _hasReachedEnd = _assets.length >= _totalItems || newAssets.isEmpty;
          _applyFilters();
          _isLoading = false;
          _isLoadingMore = false;
        });
      } else {
        setState(() {
          if (isInitial) {
            _assets = [];
            _filteredAssets = [];
          }
          _isLoading = false;
          _isLoadingMore = false;
          _hasReachedEnd = true;
        });
      }
    } catch (e) {
      setState(() {
        if (isInitial) {
          _assets = [];
          _filteredAssets = [];
        }
        _isLoading = false;
        _isLoadingMore = false;
        _hasReachedEnd = true;
      });
      _showErrorSnackBar('Failed to load assets: $e');
    }
  }

  Future<void> _loadMoreAssets() async {
    if (_isLoadingMore || _hasReachedEnd) return;

    setState(() {
      _isLoadingMore = true;
      _currentPage++;
    });

    await loadAssets();
  }

  Future<void> refreshAssets() async {
    await loadAssets(isInitial: true);
  }

  void _applyFilters() {
    setState(() {
      List<Data> filteredList = List.from(_assets);

      // Apply search filter
      if (_searchQuery.isNotEmpty) {
        filteredList = filteredList.where((asset) {
          final searchLower = _searchQuery.toLowerCase();
          return (asset.tag?.toLowerCase().contains(searchLower) ?? false) ||
              (asset.brand?.toLowerCase().contains(searchLower) ?? false) ||
              (asset.model?.toLowerCase().contains(searchLower) ?? false) ||
              (asset.type?.toLowerCase().contains(searchLower) ?? false) ||
              (asset.assignedTo?.name?.toLowerCase().contains(searchLower) ??
                  false) ||
              (asset.assignedTo?.department?.toLowerCase().contains(searchLower) ??
                  false) ||
              (asset.location?.toLowerCase().contains(searchLower) ?? false);
        }).toList();
      }

      // Apply other filters
      if (_currentFilter != null) {
        if (_currentFilter!.type != null) {
          filteredList = filteredList
              .where(
                (asset) =>
            asset.type?.toLowerCase() ==
                _currentFilter!.type!.toLowerCase(),
          )
              .toList();
        }

        if (_currentFilter!.brand != null) {
          filteredList = filteredList
              .where(
                (asset) =>
            asset.brand?.toLowerCase() ==
                _currentFilter!.brand!.toLowerCase(),
          )
              .toList();
        }

        if (_currentFilter!.status != null) {
          filteredList = filteredList
              .where(
                (asset) =>
            asset.status?.toLowerCase() ==
                _currentFilter!.status!.toLowerCase(),
          )
              .toList();
        }

        if (_currentFilter!.department != null) {
          filteredList = filteredList
              .where(
                (asset) =>
            asset.assignedTo?.department?.toLowerCase() ==
                _currentFilter!.department!.toLowerCase(),
          )
              .toList();
        }

        if (_currentFilter!.location != null) {
          filteredList = filteredList
              .where(
                (asset) =>
            asset.location?.toLowerCase() ==
                _currentFilter!.location!.toLowerCase(),
          )
              .toList();
        }

        // if (_currentFilter!.hasAMCContract != null) {
        //   filteredList = filteredList
        //       .where(
        //         (asset) =>
        //     (asset.assignedTo.amcContract?.toLowerCase() == 'yes') ==
        //         _currentFilter!.hasAMCContract!,
        //   )
        //       .toList();
        // }
      }

      _filteredAssets = filteredList;
    });
  }

  void _onSearchChanged(String query) {
    setState(() {
      _searchQuery = query;
    });
    _applyFilters();
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        iconTheme: const IconThemeData(color: Colors.white),
        backgroundColor: AppColors.primary,
        title: Text(
          'Asset Management',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              color: AppColors.whiteColor,
              fontSize: ResponsiveHelper.fontSize(context, 14),
            ),
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            height: 1,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.grey[200]!, Colors.grey[100]!],
              ),
            ),
          ),
        ),
        actions: [
          IconButton(
            onPressed: refreshAssets,
            // onPressed: _loadAssets,
            icon: const Icon(Icons.refresh_rounded),
            style: IconButton.styleFrom(
              // backgroundColor: Colors.grey[100],
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          _buildSearchAndFilter(),
          _buildResultsHeader(),
          Expanded(
            child: _isLoading ? _buildLoadingWidget() : _buildAssetsList(),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchAndFilter() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey[200]!),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: _onSearchChanged,
                    decoration: InputDecoration(
                      hintText: 'Search assets by tag, brand, model...',
                      hintStyle: TextStyle(color: Colors.grey[500]),
                      prefixIcon: Container(
                        margin: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.search_rounded,
                          color: Colors.blue,
                          size: 20,
                        ),
                      ),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                        icon: const Icon(Icons.clear_rounded),
                        onPressed: () {
                          _searchController.clear();
                          _onSearchChanged('');
                        },
                        color: Colors.grey[500],
                      )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 16,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: _activeFiltersCount > 0
                        ? [Colors.blue.shade100, Colors.blue.shade50]
                        : [Colors.grey[100]!, Colors.grey[50]!],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _activeFiltersCount > 0
                        ? Colors.blue.shade300
                        : Colors.grey[300]!,
                  ),
                ),
                child: IconButton(
                  onPressed: () {
                    _showFilterSheet();
                  },
                  icon: Stack(
                    children: [
                      Icon(
                        Icons.tune_rounded,
                        color: _activeFiltersCount > 0
                            ? Colors.blue
                            : Colors.grey[600],
                      ),
                      if (_activeFiltersCount > 0)
                        Positioned(
                          right: 0,
                          top: 0,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: Colors.red,
                              shape: BoxShape.circle,
                            ),
                            constraints: const BoxConstraints(
                              minWidth: 16,
                              minHeight: 16,
                            ),
                            child: Text(
                              '$_activeFiltersCount',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                    ],
                  ),
                  iconSize: 22,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  int get _activeFiltersCount {
    if (_currentFilter == null) return 0;
    int count = 0;
    if (_currentFilter!.type != null) count++;
    if (_currentFilter!.brand != null) count++;
    if (_currentFilter!.status != null) count++;
    if (_currentFilter!.department != null) count++;
    if (_currentFilter!.location != null) count++;
    if (_currentFilter!.hasAMCContract != null) count++;
    return count;
  }

  void _onFilterChanged(AssetFilter? filter) {
    setState(() {
      _currentFilter = filter;
      _currentPage = 1;
    });
    _applyFilters();
  }

  void _showFilterSheet() {
    // get asset filter bottom  sheet
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: FilterSheet(
          currentFilter: _currentFilter,
          onFilterChanged: _onFilterChanged,
        ),
      ),
    );
  }

  Widget _buildResultsHeader() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Showing ${_filteredAssets.length} of ${_assets.length} assets',
                  style: TextStyle(
                    color: Colors.grey[700],
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const Spacer(),
              if (_searchQuery.isNotEmpty || _currentFilter != null)
                Container(
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: TextButton.icon(
                    onPressed: () {
                      setState(() {
                        _searchQuery = '';
                        _searchController.clear();
                        _currentFilter = null;
                        _currentPage = 1;
                      });
                      _applyFilters();
                    },
                    icon: const Icon(Icons.clear_rounded, size: 16),
                    label: const Text('Clear All'),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.red[700],
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          if (_currentFilter != null && !_currentFilter!.isEmpty) ...[
            const SizedBox(height: 8),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  if (_currentFilter!.type != null)
                    _buildFilterChip('Type: ${_currentFilter!.type}'),
                  if (_currentFilter!.brand != null)
                    _buildFilterChip('Brand: ${_currentFilter!.brand}'),
                  if (_currentFilter!.status != null)
                    _buildFilterChip('Status: ${_currentFilter!.status}'),
                  if (_currentFilter!.department != null)
                    _buildFilterChip(
                      'Department: ${_currentFilter!.department}',
                    ),
                  if (_currentFilter!.location != null)
                    _buildFilterChip('Location: ${_currentFilter!.location}'),
                  if (_currentFilter!.hasAMCContract != null)
                    _buildFilterChip(
                      'AMC: ${_currentFilter!.hasAMCContract! ? "Yes" : "No"}',
                    ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.blue.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.blue.withOpacity(0.3)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: Colors.blue[700],
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildLoadingWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const CircularProgressIndicator(),
          ),
          const SizedBox(height: 24),
          const Text(
            'Loading assets...',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Please wait while we fetch your data',
            style: TextStyle(color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }


  Widget _buildAssetsList() {
    if (_filteredAssets.isEmpty) {
      return SingleChildScrollView(
        child: Center(
          child: Container(
            padding: const EdgeInsets.all(20),
            margin: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.inventory_2_outlined,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                ),
                const SizedBox(height: 15),
                Text(
                  'No assets found',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[800],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  _searchQuery.isNotEmpty
                      ? 'Try adjusting your search terms'
                      : 'Start by adding your first asset',
                  style: TextStyle(color: Colors.grey[600], fontSize: 16),
                  textAlign: TextAlign.center,
                ),
                // if (_searchQuery.isEmpty) ...[
                //   const SizedBox(height: 24),
                //   ElevatedButton.icon(
                //     onPressed: () {
                //       // Navigate to the screen to add a new asset
                //       Navigator.push(
                //         context,
                //         MaterialPageRoute(builder: (_) => const TechMangerAddAssetScreen()),
                //       ).then((_) {
                //         // Reload assets after returning from the screen
                //         loadAssets();
                //       });
                //     },
                //     icon: const Icon(Icons.add_rounded),
                //     label: const Text('Add Asset'),
                //     style: ElevatedButton.styleFrom(
                //       backgroundColor: Colors.blue,
                //       foregroundColor: Colors.white,
                //       padding: const EdgeInsets.symmetric(
                //         horizontal: 24,
                //         vertical: 12,
                //       ),
                //       shape: RoundedRectangleBorder(
                //         borderRadius: BorderRadius.circular(12),
                //       ),
                //     ),
                //   ),
                // ],
              ],
            ),
          ),
        ),
      );
    }

    // Return the list of assets
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(20),
      itemCount: _filteredAssets.length + (_hasReachedEnd ? 0 : 1),
      itemBuilder: (context, index) {
        // Check for the loader condition first
        if (index == _filteredAssets.length) {
          return _buildLoaderWidget();
        }

        // Then return the asset card for all other items
        final asset = _filteredAssets[index];
        return TechEngineerAssetCard(
          asset: asset,
          onTap: () => _showAssetDetails(asset),
          onAssignmentCompleted: () {
            refreshAssets();
          },
        );

      },
    );
  }


  Widget _buildLoaderWidget() {
    return Padding(
      padding: EdgeInsets.all(20.0),
      child: Center(child: LoadingIndicatorUtils(color: AppColors.orangeColor)),
    );
  }

  void _showAssetDetails(Data asset) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      // builder: (context) => AssetDetailBottomSheet(asset: asset),
      builder: (context) => TechEngineerAssetDetailBottomSheet(
        asset: asset,
        onAssetDeleted: () async {
          // Delete ke baad ye callback call hoga
          // Navigator.pop(context); // Bottom sheet close karo
          await loadAssets(isInitial: true);
        },
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}

