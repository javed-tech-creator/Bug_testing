import 'package:dss_crm/admin/controller/admin_location_api_provider.dart';
import 'package:dss_crm/admin/model/location_model/state/get_all_states_model.dart'
as stateListData;
import 'package:dss_crm/admin/model/location_model/zone/get_all_zone_model.dart';
import 'package:dss_crm/admin/model/location_model/city/get_all_city_list_model.dart'
as cityListData;
import 'package:dss_crm/admin/model/location_model/branch/get_all_branches_list_model.dart'
as branchListData;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../ui_helper/app_colors.dart';
import '../../ui_helper/app_text_styles.dart';
import '../../utils/custom_buttons_utils.dart';
import '../../utils/custom_text_field_utils.dart';
import '../../utils/default_common_app_bar.dart';
import '../../utils/responsive_dropdown_utils.dart';
import '../../utils/responsive_helper_utils.dart';
import '../utils/location_hierarchy_utils.dart';

class LocationManagementScreen extends StatefulWidget {
  const LocationManagementScreen({Key? key}) : super(key: key);

  @override
  State<LocationManagementScreen> createState() =>
      _LocationManagementScreenState();
}

class _LocationManagementScreenState extends State<LocationManagementScreen> {
  bool _isInitialLoading = true;

  final _locationKey = GlobalKey<LocationHierarchyDropdownsState>();
  // -------------------- SEARCH --------------------
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
// FILTERS
  String? _selectedZoneId;
  String? _selectedStateId;
  String? _selectedCityId;
  String? _selectedBranchId;

  @override
  void initState() {
    super.initState();
    refreshData();
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text.trim().toLowerCase();
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
  // ------------------------------------------------

  Future<void> refreshData() async {
    final provider = Provider.of<AdminLocationApiProvider>(
      context,
      listen: false,
    );

    await Future.wait([
      provider.getAllZoneList(context),
      provider.getAllStateList(context),
      provider.getAllCityList(context),
      provider.getAllBranchList(context),
    ]);

    setState(() {
      _isInitialLoading = false;
    });
  }

  void _showFilterBottomSheet() {
    final provider = Provider.of<AdminLocationApiProvider>(context, listen: false);

    // Local state variables for the bottom sheet
    String? localSelectedZoneId = _selectedZoneId;
    String? localSelectedStateId = _selectedStateId;
    String? localSelectedCityId = _selectedCityId;
    String? localSelectedBranchId = _selectedBranchId;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.whiteColor,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setStateSB) => Padding(
          padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom
          ),
          child: SingleChildScrollView(
            child: Container(
              padding: EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.filter_list, color: AppColors.primary),
                      SizedBox(width: 12),
                      Text('Filter Locations', style: AppTextStyles.heading1(context)),
                    ],
                  ),
                  SizedBox(height: 20),

                  LocationHierarchyDropdowns(
                    key: _locationKey,
                    initialZoneId: _selectedZoneId,
                    initialStateId: _selectedStateId,
                    initialCityId: _selectedCityId,
                    initialBranchId: _selectedBranchId,
                    showUpTo: LocationLevel.branch,
                    enableValidation: false,
                    onZoneChanged: (value) {
                      localSelectedZoneId = value;
                    },
                    onStateChanged: (value) {
                      localSelectedStateId = value;
                    },
                    onCityChanged: (value) {
                      localSelectedCityId = value;
                    },
                    onBranchChanged: (value) {
                      localSelectedBranchId = value;
                    },
                  ),

                  // ZONE DROPDOWN
                  // Consumer<AdminLocationApiProvider>(
                  //   builder: (context, p, _) {
                  //     final zones = p.getAllZoneListModelResponse?.data?.data ?? [];
                  //     return ResponsiveDropdown<String>(
                  //       value: localSelectedZoneId,
                  //       itemList: zones.map((z) => z.sId!).toList(),
                  //       itemDisplayBuilder: (id) {
                  //         try {
                  //           return zones.firstWhere((z) => z.sId == id).title ?? 'N/A';
                  //         } catch (e) {
                  //           return 'N/A';
                  //         }
                  //       },
                  //       onChanged: (value) {
                  //         setStateSB(() {
                  //           localSelectedZoneId = value;
                  //           localSelectedStateId = null;
                  //           localSelectedCityId = null;
                  //           localSelectedBranchId = null;
                  //         });
                  //         if (value != null) {
                  //           provider.getAllStateByZoneId(context, value);
                  //         }
                  //       },
                  //       hint: 'Select Zone',
                  //       label: 'Zone',
                  //       validator: (value) => null,
                  //     );
                  //   },
                  // ),
                  // // STATE DROPDOWN
                  // Consumer<AdminLocationApiProvider>(
                  //   builder: (context, p, _) {
                  //     final states = localSelectedZoneId != null
                  //         ? p.getAllStateByZoneIdModelResponse?.data?.data ?? []
                  //         : [];
                  //
                  //     // Validate and clear invalid selection
                  //     String? validStateValue = localSelectedStateId;
                  //     if (validStateValue != null && states.isNotEmpty) {
                  //       bool exists = states.any((s) => s.sId == validStateValue);
                  //       if (!exists) {
                  //         validStateValue = null;
                  //         // Clear in next frame
                  //         WidgetsBinding.instance.addPostFrameCallback((_) {
                  //           setStateSB(() {
                  //             localSelectedStateId = null;
                  //             localSelectedCityId = null;
                  //             localSelectedBranchId = null;
                  //           });
                  //         });
                  //       }
                  //     }
                  //
                  //     return ResponsiveDropdown<String>(
                  //       key: ValueKey('state_${localSelectedZoneId}_${states.length}'),
                  //       value: validStateValue,
                  //       itemList: states.map((s) => s.sId!).toList().cast<String>(),
                  //       itemDisplayBuilder: (id) {
                  //         try {
                  //           return states.firstWhere((s) => s.sId == id).title ?? 'N/A';
                  //         } catch (e) {
                  //           return 'N/A';
                  //         }
                  //       },
                  //       onChanged: localSelectedZoneId != null
                  //           ? (value) {
                  //         setStateSB(() {
                  //           localSelectedStateId = value;
                  //           localSelectedCityId = null;
                  //           localSelectedBranchId = null;
                  //         });
                  //         if (value != null) {
                  //           provider.getAllCityByStateId(context, value);
                  //         }
                  //       }
                  //           : null,
                  //       hint: localSelectedZoneId == null
                  //           ? 'Select Zone First'
                  //           : 'Select State',
                  //       label: 'State',
                  //       isReadOnly: localSelectedZoneId == null,
                  //     );
                  //   },
                  // ),
                  // // CITY DROPDOWN
                  // Consumer<AdminLocationApiProvider>(
                  //   builder: (context, p, _) {
                  //     final cities = localSelectedStateId != null
                  //         ? p.getAllCityByStateIdModelResponse?.data?.data ?? []
                  //         : [];
                  //
                  //     // Validate and clear invalid selection
                  //     String? validCityValue = localSelectedCityId;
                  //     if (validCityValue != null && cities.isNotEmpty) {
                  //       bool exists = cities.any((c) => c.sId == validCityValue);
                  //       if (!exists) {
                  //         validCityValue = null;
                  //         // Clear in next frame
                  //         WidgetsBinding.instance.addPostFrameCallback((_) {
                  //           setStateSB(() {
                  //             localSelectedCityId = null;
                  //             localSelectedBranchId = null;
                  //           });
                  //         });
                  //       }
                  //     }
                  //
                  //     return ResponsiveDropdown<String>(
                  //       key: ValueKey('city_${localSelectedStateId}_${cities.length}'),
                  //       value: validCityValue,
                  //       itemList: cities.map((c) => c.sId!).toList().cast<String>(),
                  //       itemDisplayBuilder: (id) {
                  //         try {
                  //           return cities.firstWhere((c) => c.sId == id).title ?? 'N/A';
                  //         } catch (e) {
                  //           return 'N/A';
                  //         }
                  //       },
                  //       onChanged: localSelectedStateId != null
                  //           ? (value) {
                  //         setStateSB(() {
                  //           localSelectedCityId = value;
                  //           localSelectedBranchId = null;
                  //         });
                  //         if (value != null) {
                  //           provider.getAllBranchByCityId(context, value);
                  //         }
                  //       }
                  //           : null,
                  //       hint: localSelectedStateId == null
                  //           ? 'Select State First'
                  //           : 'Select City',
                  //       label: 'City',
                  //       isReadOnly: localSelectedStateId == null,
                  //     );
                  //   },
                  // ),
                  // // BRANCH DROPDOWN
                  // Consumer<AdminLocationApiProvider>(
                  //   builder: (context, p, _) {
                  //     final branches = localSelectedCityId != null
                  //         ? p.getAllBranchByCityIdModelResponse?.data?.data ?? []
                  //         : [];
                  //
                  //     // Validate and clear invalid selection
                  //     String? validBranchValue = localSelectedBranchId;
                  //     if (validBranchValue != null && branches.isNotEmpty) {
                  //       bool exists = branches.any((b) => b.sId == validBranchValue);
                  //       if (!exists) {
                  //         validBranchValue = null;
                  //         // Clear in next frame
                  //         WidgetsBinding.instance.addPostFrameCallback((_) {
                  //           setStateSB(() {
                  //             localSelectedBranchId = null;
                  //           });
                  //         });
                  //       }
                  //     }
                  //
                  //     return ResponsiveDropdown<String>(
                  //       key: ValueKey('branch_${localSelectedCityId}_${branches.length}'),
                  //       value: validBranchValue,
                  //       itemList: branches.map((b) => b.sId!).toList().cast<String>(),
                  //       itemDisplayBuilder: (id) {
                  //         try {
                  //           return branches.firstWhere((b) => b.sId == id).title ?? 'N/A';
                  //         } catch (e) {
                  //           return 'N/A';
                  //         }
                  //       },
                  //       onChanged: localSelectedCityId != null
                  //           ? (value) {
                  //         setStateSB(() => localSelectedBranchId = value);
                  //       }
                  //           : null,
                  //       hint: localSelectedCityId == null
                  //           ? 'Select City First'
                  //           : 'Select Branch',
                  //       label: 'Branch',
                  //       isReadOnly: localSelectedCityId == null,
                  //     );
                  //   },
                  // ),
                  // ACTION BUTTONS
                  ResponsiveHelper.sizedBoxHeight(context, 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Expanded(
                        child: CustomButton(
                          color: AppColors.primary,
                          text:  "Clear All",
                          type: ButtonType.outlined,
                          textColor: Colors.black,
                          onPressed: () {
                            setState(() {
                              _selectedZoneId = null;
                              _selectedStateId = null;
                              _selectedCityId = null;
                              _selectedBranchId = null;
                            });
                            Navigator.pop(context);
                          },
                        ),
                      ),
                      SizedBox(width: 12),

                      Expanded(
                        child: CustomButton(
                          color: AppColors.primary,
                          text:  "Apply Filters",
                          onPressed: () {
                            setState(() {
                              _selectedZoneId = localSelectedZoneId;
                              _selectedStateId = localSelectedStateId;
                              _selectedCityId = localSelectedCityId;
                              _selectedBranchId = localSelectedBranchId;
                            });
                            Navigator.pop(context);
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip({required String label, required VoidCallback onDelete}) {
    return Chip(
      label: Text(
        label,
        style: TextStyle(color: Colors.white, fontSize: 12),
      ),
      backgroundColor: AppColors.primary.withOpacity(0.8),
      deleteIcon: Icon(Icons.close, size: 16, color: Colors.white),
      onDeleted: onDelete,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        iconTheme: const IconThemeData(color: Colors.white),
        backgroundColor: AppColors.primary,
        title: Text(
          'Location Management',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              color: AppColors.whiteColor,
              fontSize: ResponsiveHelper.fontSize(context, 14),
            ),
          ),
        ),
        actions: [
          IconButton(
            onPressed: () async {
              setState(() {
                _isInitialLoading = true;
              });
              await refreshData();
            },
            icon: const Icon(Icons.refresh_rounded),
            style: IconButton.styleFrom(),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _isInitialLoading
          ? _buildSkeletonLoader()
          : Consumer<AdminLocationApiProvider>(
        builder: (context, provider, child) {

          var filteredZones = provider.getAllZoneListModelResponse?.data?.data ?? [];
          var filteredStates = provider.getAllStateListModelResponse?.data?.data ?? [];
          var filteredCities = provider.getAllCityListModelResponse?.data?.data ?? [];
          var filteredBranches = provider.getAllBranchListModelResponse?.data?.data ?? [];

// Apply hierarchy filters
          if (_selectedZoneId != null) {
            // Filter zones to show only selected zone
            filteredZones = filteredZones.where((z) => z.sId == _selectedZoneId).toList();
            // Filter states by zone
            filteredStates = filteredStates.where((s) => s.zoneId?.sId == _selectedZoneId).toList();
            // Filter branches by zone
            filteredBranches = filteredBranches.where((b) => b.zoneId?.sId == _selectedZoneId).toList();
          }

          if (_selectedStateId != null) {
            // Filter states to show only selected state
            filteredStates = filteredStates.where((s) => s.sId == _selectedStateId).toList();
            // Filter cities by state
            filteredCities = filteredCities.where((c) => c.stateId?.sId == _selectedStateId).toList();
            // Filter branches by state
            filteredBranches = filteredBranches.where((b) => b.stateId?.sId == _selectedStateId).toList();
          }

          if (_selectedCityId != null) {
            // Filter cities to show only selected city
            filteredCities = filteredCities.where((c) => c.sId == _selectedCityId).toList();
            // Filter branches by city
            filteredBranches = filteredBranches.where((b) => b.cityId?.sId == _selectedCityId).toList();
          }

          if (_selectedBranchId != null) {
            // Filter branches to show only selected branch
            filteredBranches = filteredBranches.where((b) => b.sId == _selectedBranchId).toList();
          }

// Then apply search filters on already filtered data
          final zones = filteredZones
              .where((z) => z.title?.toLowerCase().contains(_searchQuery) ?? false)
              .toList();

          final states = filteredStates
              .where((s) =>
          (s.title?.toLowerCase().contains(_searchQuery) ?? false) ||
              (s.zoneId?.title?.toLowerCase().contains(_searchQuery) ?? false))
              .toList();

          final cities = filteredCities
              .where((c) =>
          (c.title?.toLowerCase().contains(_searchQuery) ?? false) ||
              (c.stateId?.title?.toLowerCase().contains(_searchQuery) ?? false))
              .toList();

          final branches = filteredBranches
              .where((b) =>
          (b.title?.toLowerCase().contains(_searchQuery) ?? false) ||
              (b.address?.toLowerCase().contains(_searchQuery) ?? false) ||
              (b.zoneId?.title?.toLowerCase().contains(_searchQuery) ?? false) ||
              (b.stateId?.title?.toLowerCase().contains(_searchQuery) ?? false) ||
              (b.cityId?.title?.toLowerCase().contains(_searchQuery) ?? false))
              .toList();
          // ------------------------------------------------

          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                _isInitialLoading = true;
              });
              await refreshData();
            },
            child: Column(
              children: [
                Container(
                  color: AppColors.primary,
                  padding: ResponsiveHelper.paddingOnly(context,left: 12,right: 12,bottom: 4),
                  child: Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          controller: _searchController,
                          hintText: 'Search zones, states, cities, branches...',
                          label: 'Search',
                          prefixIcon: Icons.search,
                          validationType: ValidationType.none,
                        ),
                      ),
                      SizedBox(width: 8),
                      IconButton(
                        icon: Icon(Icons.filter_list, color: Colors.white),
                        onPressed: _showFilterBottomSheet,
                      ),
                    ],
                  ),
                ),
                // Filter Chips
                // Replace your existing filter chips section with this:

                if (_selectedZoneId != null || _selectedStateId != null ||
                    _selectedCityId != null || _selectedBranchId != null)
                  Container(
                    color: Colors.grey[100],
                    width: double.infinity,
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        if (_selectedZoneId != null)
                          _buildFilterChip(
                            label: provider.getAllZoneListModelResponse?.data?.data
                                ?.firstWhere((z) => z.sId == _selectedZoneId)
                                .title ?? 'Zone',
                            onDelete: () {
                              setState(() {
                                _selectedZoneId = null;
                                _selectedStateId = null;
                                _selectedCityId = null;
                                _selectedBranchId = null;
                              });
                            },
                          ),
                        if (_selectedStateId != null)
                          _buildFilterChip(
                            label: provider.getAllStateListModelResponse?.data?.data
                                ?.firstWhere((s) => s.sId == _selectedStateId)
                                .title ?? 'State',
                            onDelete: () {
                              setState(() {
                                _selectedStateId = null;
                                _selectedCityId = null;
                                _selectedBranchId = null;
                              });
                            },
                          ),
                        if (_selectedCityId != null)
                          _buildFilterChip(
                            label: provider.getAllCityListModelResponse?.data?.data
                                ?.firstWhere((c) => c.sId == _selectedCityId)
                                .title ?? 'City',
                            onDelete: () {
                              setState(() {
                                _selectedCityId = null;
                                _selectedBranchId = null;
                              });
                            },
                          ),
                        if (_selectedBranchId != null)
                          _buildFilterChip(
                            label: provider.getAllBranchListModelResponse?.data?.data
                                ?.firstWhere((b) => b.sId == _selectedBranchId)
                                .title ?? 'Branch',
                            onDelete: () {
                              setState(() {
                                _selectedBranchId = null;
                              });
                            },
                          ),
                        // Clear All button - Using Chip instead of ActionChip for consistency
                        Chip(
                          label: Text(
                            'Clear All',
                            style: TextStyle(color: Colors.white, fontSize: 12),
                          ),
                          backgroundColor: Colors.red.shade400,
                          deleteIcon: Icon(Icons.clear_all, size: 16, color: Colors.white),
                          onDeleted: () {
                            setState(() {
                              _selectedZoneId = null;
                              _selectedStateId = null;
                              _selectedCityId = null;
                              _selectedBranchId = null;
                            });
                          },
                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          visualDensity: VisualDensity.compact,
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 16),
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      _buildSection(
                        context: context,
                        provider: provider,
                        title: 'Zones',
                        icon: Icons.public,
                        color: const Color(0xFF66BB6A),
                        items: zones,
                        onAddPressed: () =>
                            _showAddZoneBottomSheet(context, provider),
                        itemBuilder: (item) =>
                            _buildZoneItem(context, provider, item),
                      ),
                      const SizedBox(height: 16),
                      _buildSection(
                        context: context,
                        provider: provider,
                        title: 'States',
                        icon: Icons.location_city,
                        color: const Color(0xFF42A5F5),
                        items: states,
                        onAddPressed: () =>
                            _showAddStateBottomSheet(context, provider),
                        itemBuilder: (item) =>
                            _buildStateItem(context, provider, item),
                      ),
                      const SizedBox(height: 16),
                      _buildSection(
                        context: context,
                        provider: provider,
                        title: 'Cities',
                        icon: Icons.domain,
                        color: const Color(0xFFFF9800),
                        items: cities,
                        onAddPressed: () =>
                            _showAddCityBottomSheet(context, provider),
                        itemBuilder: (item) =>
                            _buildCityItem(context, provider, item),
                      ),
                      const SizedBox(height: 16),
                      _buildSection(
                        context: context,
                        provider: provider,
                        title: 'Branches',
                        icon: Icons.business_center,
                        color: const Color(0xFFAB47BC),
                        items: branches,
                        onAddPressed: () =>
                            _showAddBranchBottomSheet(context, provider),
                        itemBuilder: (item) =>
                            _buildBranchItem(context, provider, item),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // -----------------------------------------------------------------
  // All the remaining methods (_buildSkeletonLoader, _buildSection,
  // edit/delete/add bottom sheets, item builders, etc.) are **unchanged**
  // -----------------------------------------------------------------

  Widget _buildSkeletonLoader() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildSkeletonSection(),
        const SizedBox(height: 16),
        _buildSkeletonSection(),
        const SizedBox(height: 16),
        _buildSkeletonSection(),
        const SizedBox(height: 16),
        _buildSkeletonSection(),
      ],
    );
  }

  Widget _buildSkeletonSection() {
    return Container(
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
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                _buildShimmer(50, 50, 12),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildShimmer(120, 20, 8),
                      const SizedBox(height: 8),
                      _buildShimmer(60, 14, 8),
                    ],
                  ),
                ),
                _buildShimmer(80, 36, 8),
              ],
            ),
          ),
          const Divider(height: 1),
          ...List.generate(3, (index) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  _buildShimmer(50, 50, 12),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildShimmer(double.infinity, 16, 6),
                        const SizedBox(height: 8),
                        _buildShimmer(200, 12, 6),
                      ],
                    ),
                  ),
                  _buildShimmer(36, 36, 18),
                ],
              ),
            );
          }),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildShimmer(double width, double height, double radius) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
          colors: [Colors.grey[300]!, Colors.grey[200]!, Colors.grey[300]!],
          stops: const [0.0, 0.5, 1.0],
        ),
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }

  Widget _buildSection({
    required BuildContext context,
    required AdminLocationApiProvider provider,
    required String title,
    required IconData icon,
    required Color color,
    required List items,
    required VoidCallback onAddPressed,
    required Widget Function(dynamic) itemBuilder,
  }) {
    return Container(
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [color.withOpacity(0.1), color.withOpacity(0.05)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(icon, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey[800],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${items.length} ${items.length == 1 ? 'item' : 'items'}',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Material(
                  color: color,
                  borderRadius: BorderRadius.circular(10),
                  child: InkWell(
                    onTap: onAddPressed,
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(
                            Icons.add_circle_outline,
                            size: 18,
                            color: Colors.white,
                          ),
                          SizedBox(width: 6),
                          Text(
                            'Add',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          if (items.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 48),
              child: Center(
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.inventory_2_outlined,
                        size: 48,
                        color: color.withOpacity(0.5),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No $title Yet',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Tap the Add button to create one',
                      style: TextStyle(fontSize: 14, color: Colors.grey[500]),
                    ),
                  ],
                ),
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.all(12),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: items.length,
                separatorBuilder: (context, index) => const SizedBox(height: 8),
                itemBuilder: (context, index) => itemBuilder(items[index]),
              ),
            ),
        ],
      ),
    );
  }

  // ------------------ EDIT / DELETE / ADD SHEETS (UNCHANGED) ------------------

  void _showEditZoneBottomSheet(
      BuildContext context,
      AdminLocationApiProvider provider,
      Data zone,
      ) {
    final titleController = TextEditingController(text: zone.title);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 24,
          right: 24,
          top: 24,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.green.shade100,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      Icons.edit,
                      color: Colors.green.shade700,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Edit Zone',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              CustomTextField(
                controller: titleController,
                hintText: 'Enter zone name',
                label: 'Zone Name',
                prefixIcon: Icons.public,
                validationType: ValidationType.name,
                keyboardType: TextInputType.text,
              ),
              // TextField(
              //   controller: titleController,
              //   decoration: InputDecoration(
              //     hintText: 'Enter zone name',
              //     labelText: 'Zone Name',
              //     filled: true,
              //     fillColor: Colors.grey[50],
              //     border: OutlineInputBorder(
              //       borderRadius: BorderRadius.circular(12),
              //       borderSide: BorderSide(color: Colors.grey.shade300),
              //     ),
              //     enabledBorder: OutlineInputBorder(
              //       borderRadius: BorderRadius.circular(12),
              //       borderSide: BorderSide(color: Colors.grey.shade300),
              //     ),
              //     focusedBorder: OutlineInputBorder(
              //       borderRadius: BorderRadius.circular(12),
              //       borderSide: const BorderSide(
              //         color: Color(0xFF66BB6A),
              //         width: 2,
              //       ),
              //     ),
              //     prefixIcon: const Icon(
              //       Icons.public,
              //       color: Color(0xFF66BB6A),
              //     ),
              //   ),
              // ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text(
                      'Cancel',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: () async {
                      if (titleController.text.isNotEmpty) {
                        await provider.updateZone(context, zone.sId ?? '', {
                          'title': titleController.text,
                        });
                        if (context.mounted &&
                            provider.updateZoneModelResponse?.success == true) {
                          await refreshData();
                        }
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF66BB6A),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      'Update Zone',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: AppColors.whiteColor,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  void _showEditStateBottomSheet(
      BuildContext context,
      AdminLocationApiProvider provider,
      stateListData.Data state,
      ) {
    final titleController = TextEditingController(text: state.title);
    String? selectedZoneId = state.zoneId?.sId;
    final hierarchyKey = GlobalKey<LocationHierarchyDropdownsState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.whiteColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Consumer<AdminLocationApiProvider>(
        builder: (context, p, _) {
          final zones = p.getAllZoneListModelResponse?.data?.data ?? [];
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
              left: 24,
              right: 24,
              top: 24,
            ),
            child: SingleChildScrollView(
              child: StatefulBuilder(
                builder: (context, setStateSB) => Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.edit,
                            color: Colors.blue.shade700,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Edit State',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    CustomTextField(
                      controller: titleController,
                      hintText: 'Enter state name',
                      label: 'State Name',
                      prefixIcon: Icons.location_city,
                      validationType: ValidationType.name,
                    ),
                    // TextField(
                    //   controller: titleController,
                    //   decoration: InputDecoration(
                    //     hintText: 'Enter state name',
                    //     labelText: 'State Name',
                    //     filled: true,
                    //     fillColor: Colors.grey[50],
                    //     border: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     enabledBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     focusedBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: const BorderSide(
                    //         color: Color(0xFF42A5F5),
                    //         width: 2,
                    //       ),
                    //     ),
                    //     prefixIcon: const Icon(
                    //       Icons.location_city,
                    //       color: Color(0xFF42A5F5),
                    //     ),
                    //   ),
                    // ),

                    LocationHierarchyDropdowns(
                      key: hierarchyKey,
                      initialZoneId: state.zoneId?.sId,
                      showUpTo: LocationLevel.zone,
                      enableValidation: true,
                      onZoneChanged: (value) {
                        setStateSB(() {}); // just to rebuild if needed
                      },
                    ),

                    // DropdownButtonFormField<String>(
                    //   value: selectedZoneId,
                    //   decoration: InputDecoration(
                    //     labelText: 'Select Zone',
                    //     filled: true,
                    //     fillColor: Colors.grey[50],
                    //     border: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     enabledBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     focusedBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: const BorderSide(
                    //         color: Color(0xFF42A5F5),
                    //         width: 2,
                    //       ),
                    //     ),
                    //     prefixIcon: const Icon(
                    //       Icons.public,
                    //       color: Color(0xFF42A5F5),
                    //     ),
                    //   ),
                    //   items: zones.map((zone) {
                    //     return DropdownMenuItem(
                    //       value: zone.sId,
                    //       child: Text(zone.title ?? 'N/A'),
                    //     );
                    //   }).toList(),
                    //   onChanged: (value) {
                    //     setState(() {
                    //       selectedZoneId = value;
                    //     });
                    //   },
                    // ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: Text(
                            'Cancel',
                            style: TextStyle(color: Colors.grey[600]),
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton(
                          onPressed: () async {
                            if (titleController.text.isNotEmpty &&
                                selectedZoneId != null) {
                              await provider
                                  .updateState(context, state.sId ?? '', {
                                'title': titleController.text,
                                'zoneId': selectedZoneId,
                              });

                              if (context.mounted &&
                                  provider.updateStateModelResponse?.success ==
                                      true) {
                                await refreshData();
                                Navigator.pop(context);
                              }
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF42A5F5),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text(
                            'Update State',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AppColors.whiteColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  void _showEditCityBottomSheet(
      BuildContext context,
      AdminLocationApiProvider provider,
      cityListData.Data city,
      ) {
    final titleController = TextEditingController(text: city.title);
    String? selectedStateId = city.stateId?.sId;
    final hierarchyKey = GlobalKey<LocationHierarchyDropdownsState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.whiteColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Consumer<AdminLocationApiProvider>(
        builder: (context, p, _) {
          final states = p.getAllStateListModelResponse?.data?.data ?? [];
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
              left: 24,
              right: 24,
              top: 24,
            ),
            child: SingleChildScrollView(
              child: StatefulBuilder(
                builder: (context, setState) => Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.orange.shade100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.edit,
                            color: Colors.orange.shade700,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Edit City',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    CustomTextField(
                      controller: titleController,
                      hintText: 'Enter city name',
                      label: 'City Name',
                      prefixIcon: Icons.domain,
                      validationType: ValidationType.name,
                    ),
                    // TextField(
                    //   controller: titleController,
                    //   decoration: InputDecoration(
                    //     hintText: 'Enter city name',
                    //     labelText: 'City Name',
                    //     filled: true,
                    //     fillColor: Colors.grey[50],
                    //     border: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     enabledBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     focusedBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: const BorderSide(
                    //         color: Color(0xFFFF9800),
                    //         width: 2,
                    //       ),
                    //     ),
                    //     prefixIcon: const Icon(
                    //       Icons.domain,
                    //       color: Color(0xFFFF9800),
                    //     ),
                    //   ),
                    // ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: selectedStateId,
                      decoration: InputDecoration(
                        labelText: 'Select State',
                        filled: true,
                        fillColor: Colors.grey[50],
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(
                            color: Color(0xFFFF9800),
                            width: 2,
                          ),
                        ),
                        prefixIcon: const Icon(
                          Icons.location_city,
                          color: Color(0xFFFF9800),
                        ),
                      ),
                      items: states.map((state) {
                        return DropdownMenuItem(
                          value: state.sId,
                          child: Text(state.title ?? 'N/A'),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          selectedStateId = value;
                        });
                      },
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: Text(
                            'Cancel',
                            style: TextStyle(color: Colors.grey[600]),
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton(
                          onPressed: () async {
                            if (titleController.text.isNotEmpty &&
                                selectedStateId != null) {
                              await provider
                                  .updateCity(context, city.sId ?? '', {
                                'title': titleController.text,
                                'stateId': selectedStateId,
                              });

                              if (context.mounted &&
                                  provider.updateCityModelResponse?.success ==
                                      true) {
                                await refreshData();
                                Navigator.pop(context);
                              }
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFF9800),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text(
                            'Update City',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AppColors.whiteColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  void _showEditBranchBottomSheet(
      BuildContext context,
      AdminLocationApiProvider provider,
      branchListData.Data branch,
      ) {
    final titleController = TextEditingController(text: branch.title);
    final addressController = TextEditingController(text: branch.address);
    String? selectedZoneId = branch.zoneId?.sId;
    String? selectedStateId = branch.stateId?.sId;
    String? selectedCityId = branch.cityId?.sId;
    final hierarchyKey = GlobalKey<LocationHierarchyDropdownsState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.whiteColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Consumer<AdminLocationApiProvider>(
        builder: (context, p, _) {
          final zones = p.getAllZoneListModelResponse?.data?.data ?? [];
          final states = selectedZoneId != null
              ? p.getAllStateByZoneIdModelResponse?.data?.data ?? []
              : [];
          final cities = selectedStateId != null
              ? p.getAllCityByStateIdModelResponse?.data?.data ?? []
              : [];

          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
              left: 24,
              right: 24,
              top: 24,
            ),
            child: SingleChildScrollView(
              child: StatefulBuilder(
                builder: (context, setStateSB) => Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.purple.shade100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.edit,
                            color: Colors.purple.shade700,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Edit Branch',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    CustomTextField(
                      controller: titleController,
                      hintText: 'Enter Branch Name',
                      label: 'Branch Name',
                      prefixIcon: Icons.business_center,
                      validationType: ValidationType.name,
                    ),
                    // TextField(
                    //   controller: titleController,
                    //   decoration: InputDecoration(
                    //     hintText: 'Enter branch name',
                    //     labelText: 'Branch Name',
                    //     filled: true,
                    //     fillColor: Colors.grey[50],
                    //     border: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     enabledBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     focusedBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: const BorderSide(
                    //         color: Color(0xFFAB47BC),
                    //         width: 2,
                    //       ),
                    //     ),
                    //     prefixIcon: const Icon(
                    //       Icons.business_center,
                    //       color: Color(0xFFAB47BC),
                    //     ),
                    //   ),
                    // ),
                    // const SizedBox(height: 16),

                    CustomTextField(
                      controller: addressController,
                      hintText: 'Enter branch address',
                      label: 'Branch Address',
                      isMultiLine: true,
                      maxLines: 5,
                      minLines: 3,
                      validationType: ValidationType.name,
                    ),
                    // TextField(
                    //   controller: addressController,
                    //   maxLines: 3,
                    //   decoration: InputDecoration(
                    //     hintText: 'Enter branch address',
                    //     labelText: 'Branch Address',
                    //     filled: true,
                    //     fillColor: Colors.grey[50],
                    //     border: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     enabledBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     focusedBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: const BorderSide(
                    //         color: Color(0xFFAB47BC),
                    //         width: 2,
                    //       ),
                    //     ),
                    //   ),
                    // ),
                    // const SizedBox(height: 16),

                    LocationHierarchyDropdowns(
                      key: hierarchyKey,
                      initialZoneId: branch.zoneId?.sId,
                      initialStateId: branch.stateId?.sId,
                      initialCityId: branch.cityId?.sId,
                      showUpTo: LocationLevel.city,
                      enableValidation: true,
                      onZoneChanged: (v) => setStateSB(() {}),
                      onStateChanged: (v) => setStateSB(() {}),
                      onCityChanged: (v) => setStateSB(() {}),
                    ),
                    // DropdownButtonFormField<String>(
                    //   value: selectedZoneId,
                    //   decoration: InputDecoration(
                    //     labelText: 'Select Zone',
                    //     filled: true,
                    //     fillColor: Colors.grey[50],
                    //     border: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     enabledBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     focusedBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: const BorderSide(
                    //         color: Color(0xFFAB47BC),
                    //         width: 2,
                    //       ),
                    //     ),
                    //     prefixIcon: const Icon(
                    //       Icons.public,
                    //       color: Color(0xFFAB47BC),
                    //     ),
                    //   ),
                    //   items: zones.map((zone) {
                    //     return DropdownMenuItem(
                    //       value: zone.sId,
                    //       child: Text(zone.title ?? 'N/A'),
                    //     );
                    //   }).toList(),
                    //   onChanged: (value) {
                    //     setState(() {
                    //       selectedZoneId = value;
                    //       selectedStateId = null;
                    //       selectedCityId = null;
                    //     });
                    //     if (selectedZoneId != null) {
                    //       provider.getAllStateByZoneId(
                    //         context,
                    //         selectedZoneId!,
                    //       );
                    //     }
                    //   },
                    // ),
                    // const SizedBox(height: 16),
                    // DropdownButtonFormField<String>(
                    //   value: selectedStateId,
                    //   decoration: InputDecoration(
                    //     labelText: 'Select State',
                    //     filled: true,
                    //     fillColor: Colors.grey[50],
                    //     border: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     enabledBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     focusedBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: const BorderSide(
                    //         color: Color(0xFFAB47BC),
                    //         width: 2,
                    //       ),
                    //     ),
                    //     prefixIcon: const Icon(
                    //       Icons.location_city,
                    //       color: Color(0xFFAB47BC),
                    //     ),
                    //   ),
                    //   disabledHint: const Text('Please select zone first'),
                    //   items: states.isEmpty
                    //       ? null
                    //       : states.map<DropdownMenuItem<String>>((state) {
                    //     return DropdownMenuItem(
                    //       value: state.sId,
                    //       child: Text(state.title ?? 'N/A'),
                    //     );
                    //   }).toList(),
                    //   onChanged: selectedZoneId != null && states.isNotEmpty
                    //       ? (value) {
                    //     setState(() {
                    //       selectedStateId = value;
                    //       selectedCityId = null;
                    //     });
                    //     if (selectedStateId != null) {
                    //       provider.getAllCityByStateId(
                    //         context,
                    //         selectedStateId!,
                    //       );
                    //     }
                    //   }
                    //       : null,
                    // ),
                    // const SizedBox(height: 16),
                    // DropdownButtonFormField<String>(
                    //   value: selectedCityId,
                    //   decoration: InputDecoration(
                    //     labelText: 'Select City',
                    //     filled: true,
                    //     fillColor: Colors.grey[50],
                    //     border: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     enabledBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     focusedBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: const BorderSide(
                    //         color: Color(0xFFAB47BC),
                    //         width: 2,
                    //       ),
                    //     ),
                    //     prefixIcon: const Icon(
                    //       Icons.domain,
                    //       color: Color(0xFFAB47BC),
                    //     ),
                    //   ),
                    //   disabledHint: const Text('Please select state first'),
                    //   items: cities.map<DropdownMenuItem<String>>((city) {
                    //     return DropdownMenuItem(
                    //       value: city.sId,
                    //       child: Text(city.title ?? 'N/A'),
                    //     );
                    //   }).toList(),
                    //   onChanged: selectedStateId != null
                    //       ? (value) {
                    //     setState(() {
                    //       selectedCityId = value;
                    //     });
                    //   }
                    //       : null,
                    // ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: Text(
                            'Cancel',
                            style: TextStyle(color: Colors.grey[600]),
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton(
                          onPressed: () async {
                            if (titleController.text.isNotEmpty &&
                                addressController.text.isNotEmpty &&
                                selectedZoneId != null &&
                                selectedStateId != null &&
                                selectedCityId != null) {
                              await provider
                                  .updateBranch(context, branch.sId ?? '', {
                                'title': titleController.text,
                                'address': addressController.text,
                                'zoneId': selectedZoneId,
                                'stateId': selectedStateId,
                                'cityId': selectedCityId,
                              });

                              if (context.mounted &&
                                  provider.updateBranchModelResponse?.success ==
                                      true) {
                                await refreshData();
                                Navigator.pop(context);
                              }
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFAB47BC),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text(
                            'Update Branch',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AppColors.whiteColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildZoneItem(
      BuildContext context,
      AdminLocationApiProvider provider,
      Data zone,
      ) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.green.shade100),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          zone.title ?? 'N/A',
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
            color: Colors.black87,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Row(
            children: [
              Text(
                zone.status ?? 'N/A',
                style: TextStyle(
                  fontSize: 11,
                  color: zone.status == 'Active' ? Colors.green : Colors.grey,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(
                Icons.edit_rounded,
                color: Colors.blue,
                size: 22,
              ),
              onPressed: () =>
                  _showEditZoneBottomSheet(context, provider, zone),
            ),
            IconButton(
              icon: const Icon(
                Icons.delete_rounded,
                color: Colors.red,
                size: 22,
              ),
              onPressed: () => _showDeleteConfirmation(
                context: context,
                title: zone.title ?? 'Zone',
                color: Colors.green,
                onConfirm: () async {
                  await provider.deleteZone(context, zone.sId ?? '');
                  if (context.mounted &&
                      provider.deleteZoneModelResponse?.success == true) {
                    await refreshData();
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStateItem(
      BuildContext context,
      AdminLocationApiProvider provider,
      stateListData.Data state,
      ) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.blue.shade100),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          state.title ?? 'N/A',
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
            color: Colors.black87,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Row(
            children: [
              Icon(Icons.public, size: 14, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Text(
                state.zoneId?.title ?? 'N/A',
                style: TextStyle(fontSize: 13, color: Colors.grey[700]),
              ),
              const SizedBox(width: 12),
              Text(
                state.status ?? 'N/A',
                style: TextStyle(
                  fontSize: 11,
                  color: state.status == 'Active' ? Colors.blue : Colors.grey,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(
                Icons.edit_rounded,
                color: Colors.blue,
                size: 22,
              ),
              onPressed: () =>
                  _showEditStateBottomSheet(context, provider, state),
            ),
            IconButton(
              icon: const Icon(
                Icons.delete_rounded,
                color: Colors.red,
                size: 22,
              ),
              onPressed: () => _showDeleteConfirmation(
                context: context,
                title: state.title ?? 'State',
                color: Colors.blue,
                onConfirm: () async {
                  await provider.deleteState(context, state.sId ?? '');
                  if (context.mounted &&
                      provider.deleteStateModelResponse?.success == true) {
                    await refreshData();
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCityItem(
      BuildContext context,
      AdminLocationApiProvider provider,
      cityListData.Data city,
      ) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.orange.shade100),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          city.title ?? 'N/A',
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
            color: Colors.black87,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Row(
            children: [
              Icon(Icons.location_city, size: 14, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Text(
                city.stateId?.title ?? 'N/A',
                style: TextStyle(fontSize: 13, color: Colors.grey[700]),
              ),
              const SizedBox(width: 12),
              Text(
                city.status ?? 'N/A',
                style: TextStyle(
                  fontSize: 11,
                  color: city.status == 'Active' ? Colors.orange : Colors.grey,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(
                Icons.edit_rounded,
                color: Colors.orange,
                size: 22,
              ),
              onPressed: () =>
                  _showEditCityBottomSheet(context, provider, city),
            ),
            IconButton(
              icon: const Icon(
                Icons.delete_rounded,
                color: Colors.red,
                size: 22,
              ),
              onPressed: () => _showDeleteConfirmation(
                context: context,
                title: city.title ?? 'City',
                color: Colors.orange,
                onConfirm: () async {
                  await provider.deleteCity(context, city.sId ?? '');
                  if (context.mounted &&
                      provider.deleteCityModelResponse?.success == true) {
                    await refreshData();
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBranchItem(
      BuildContext context,
      AdminLocationApiProvider provider,
      branchListData.Data branch,
      ) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.purple.shade100),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          branch.title ?? 'N/A',
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
            color: Colors.black87,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Row(
            children: [
              Icon(Icons.domain, size: 14, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Text(
                branch.cityId?.title ?? 'N/A',
                style: TextStyle(fontSize: 13, color: Colors.grey[700]),
              ),
              const SizedBox(width: 12),
              Text(
                branch.status ?? 'N/A',
                style: TextStyle(
                  fontSize: 11,
                  color: branch.status == 'Active'
                      ? Colors.purple
                      : Colors.grey,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(
                Icons.edit_rounded,
                color: Colors.purple,
                size: 22,
              ),
              onPressed: () =>
                  _showEditBranchBottomSheet(context, provider, branch),
            ),
            IconButton(
              icon: const Icon(
                Icons.delete_rounded,
                color: Colors.red,
                size: 22,
              ),
              onPressed: () => _showDeleteConfirmation(
                context: context,
                title: branch.title ?? 'Branch',
                color: Colors.purple,
                onConfirm: () async {
                  await provider.deleteBranch(context, branch.sId ?? '');
                  if (context.mounted &&
                      provider.deleteBranchModelResponse?.success == true) {
                    await refreshData();
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showDeleteConfirmation({
    required BuildContext context,
    required String title,
    required Color color,
    required VoidCallback onConfirm,
  }) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.red.shade100,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.warning_amber_rounded,
                color: Colors.red,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            const Text('Delete Confirmation'),
          ],
        ),
        content: Text(
          'Are you sure you want to delete "$title"? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: TextStyle(color: Colors.grey[600])),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              onConfirm();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              'Delete',
              style: TextStyle(color: AppColors.whiteColor),
            ),
          ),
        ],
      ),
    );
  }

  void _showAddZoneBottomSheet(
      BuildContext context,
      AdminLocationApiProvider provider,
      ) {
    final titleController = TextEditingController();
    final _formKey = GlobalKey<FormState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.whiteColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(

        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 24,
          right: 24,
          top: 24,
        ),
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.green.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.public,
                        color: Colors.green.shade700,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Add New Zone',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                CustomTextField(
                  controller: titleController,
                  hintText: 'Enter zone name',
                  label: 'Zone Name',
                  prefixIcon: Icons.public,
                  validationType: ValidationType.name,
                  keyboardType: TextInputType.text,
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: Text(
                        'Cancel',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: () async {
                        if (_formKey.currentState!.validate()) {
                          if (titleController.text.isNotEmpty) {
                            await provider.createZone(context, {
                              'title': titleController.text,
                            });

                            if (context.mounted &&
                                provider.createZoneModelResponse?.success ==
                                    true) {
                              await refreshData();
                            }
                          }
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF66BB6A),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: const Text(
                        'Add Zone',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: AppColors.whiteColor,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showAddStateBottomSheet(
      BuildContext context,
      AdminLocationApiProvider provider,
      ) {
    final titleController = TextEditingController();
    String? selectedZoneId;
    final _formKey = GlobalKey<FormState>();
    final hierarchyKey = GlobalKey<LocationHierarchyDropdownsState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Consumer<AdminLocationApiProvider>(
        builder: (context, p, _) {
          final zones = p.getAllZoneListModelResponse?.data?.data ?? [];
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
              left: 24,
              right: 24,
              top: 24,
            ),
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.location_city,
                            color: Colors.blue.shade700,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Add New State',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    CustomTextField(
                      controller: titleController,
                      hintText: 'Enter state name',
                      label: 'State Name',
                      prefixIcon: Icons.location_city,
                      validationType: ValidationType.name,
                    ),
                    LocationHierarchyDropdowns(
                      key: hierarchyKey,
                      showUpTo: LocationLevel.zone,
                      enableValidation: true,
                      onZoneChanged: (value) {
                        setState(() {
                          selectedZoneId = value; // YEH LINE ADD KI
                        });
                      },
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Expanded(
                          child: TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: Text(
                              'Cancel',
                              style: TextStyle(color: Colors.grey[600]),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: CustomButton(
                            color: const Color(0xFF42A5F5),
                            text: "Add State",
                            onPressed: () async {
                              if (_formKey.currentState!.validate()) {
                                if (titleController.text.isNotEmpty ) {
                                  await provider.createState(context, {
                                    'title': titleController.text,
                                    'zoneId': selectedZoneId,
                                  });

                                  if (context.mounted &&
                                      provider
                                          .createStateModelResponse
                                          ?.success ==
                                          true) {
                                    await refreshData();
                                  }
                                }
                              }
                            },

                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  void _showAddCityBottomSheet(
      BuildContext context,
      AdminLocationApiProvider provider,
      ) {
    final titleController = TextEditingController();
    String? selectedStateId;
    final _formKey = GlobalKey<FormState>();
    final hierarchyKey = GlobalKey<LocationHierarchyDropdownsState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Consumer<AdminLocationApiProvider>(
        builder: (context, p, _) {
          final states = p.getAllStateListModelResponse?.data?.data ?? [];
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
              left: 24,
              right: 24,
              top: 24,
            ),
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.orange.shade100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.domain,
                            color: Colors.orange.shade700,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Add New City',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    CustomTextField(
                      controller: titleController,
                      hintText: 'Enter city name',
                      label: 'City Name',
                      prefixIcon: Icons.domain,
                      validationType: ValidationType.name,
                    ),
                    // DropdownButtonFormField<String>(
                    //   decoration: InputDecoration(
                    //     labelText: 'Select State',
                    //     filled: true,
                    //     fillColor: Colors.grey[50],
                    //     border: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     enabledBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: BorderSide(color: Colors.grey.shade300),
                    //     ),
                    //     focusedBorder: OutlineInputBorder(
                    //       borderRadius: BorderRadius.circular(12),
                    //       borderSide: const BorderSide(
                    //         color: Color(0xFFFF9800),
                    //         width: 2,
                    //       ),
                    //     ),
                    //     prefixIcon: const Icon(
                    //       Icons.location_city,
                    //       color: Color(0xFFFF9800),
                    //     ),
                    //   ),
                    //   items: states.map((state) {
                    //     return DropdownMenuItem(
                    //       value: state.sId,
                    //       child: Text(state.title ?? 'N/A'),
                    //     );
                    //   }).toList(),
                    //   onChanged: (value) {
                    //     selectedStateId = value;
                    //   },
                    // ),
                    LocationHierarchyDropdowns(
                      key: hierarchyKey,
                      showUpTo: LocationLevel.state,
                      enableValidation: true,
                      onStateChanged: (value) {
                        setState(() {
                          selectedStateId = value; // YEH LINE ADD KI
                        });
                      },
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: Text(
                            'Cancel',
                            style: TextStyle(color: Colors.grey[600]),
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton(
                          onPressed: () async {
                            if (_formKey.currentState!.validate()) {
                              if (titleController.text.isNotEmpty &&
                                  selectedStateId != null) {
                                await provider.createCity(context, {
                                  'title': titleController.text,
                                  'stateId': selectedStateId,
                                });

                                if (context.mounted &&
                                    provider.createCityModelResponse?.success ==
                                        true) {
                                  await refreshData();
                                }
                              }
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFF9800),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text(
                            'Add City',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AppColors.whiteColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  void _showAddBranchBottomSheet(
      BuildContext context,
      AdminLocationApiProvider provider,
      ) {
    final titleController = TextEditingController();
    final branchAddressController = TextEditingController();
    String? selectedZoneId;
    String? selectedStateId;
    String? selectedCityId;
    final _formKey = GlobalKey<FormState>();
    final hierarchyKey = GlobalKey<LocationHierarchyDropdownsState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Consumer<AdminLocationApiProvider>(
        builder: (context, p, _) {
          final zones = p.getAllZoneListModelResponse?.data?.data ?? [];
          final states = selectedZoneId != null
              ? p.getAllStateByZoneIdModelResponse?.data?.data ?? []
              : [];
          final cities = selectedStateId != null
              ? p.getAllCityByStateIdModelResponse?.data?.data ?? []
              : [];

          return StatefulBuilder(
            builder: (context, setState) => Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 24,
                right: 24,
                top: 24,
              ),
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.purple.shade100,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              Icons.business_center,
                              color: Colors.purple.shade700,
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: 12),
                          const Text(
                            'Add New Branch',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      CustomTextField(
                        controller: titleController,
                        hintText: 'Enter branch name',
                        label: 'Branch Name',
                        prefixIcon: Icons.business_center,
                        validationType: ValidationType.name,
                      ),
                      const SizedBox(height: 16),
                      CustomTextField(
                        controller: branchAddressController,
                        hintText: 'Enter branch address',
                        label: 'Branch Address',
                        isMultiLine: true,
                        maxLines: 5,
                        minLines: 3,
                        validationType: ValidationType.name,
                      ),
                      // Use LocationHierarchyDropdowns - show up to City
                      LocationHierarchyDropdowns(
                        key: hierarchyKey,
                        showUpTo: LocationLevel.city,
                        enableValidation: true,
                        onZoneChanged: (v) => setState(() => selectedZoneId = v),
                        onStateChanged: (v) => setState(() => selectedStateId = v),
                        onCityChanged: (v) => setState(() => selectedCityId = v),
                      ),

                      // DropdownButtonFormField<String>(
                      //   decoration: InputDecoration(
                      //     labelText: 'Select Zone',
                      //     filled: true,
                      //     fillColor: Colors.grey[50],
                      //     border: OutlineInputBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //       borderSide: BorderSide(color: Colors.grey.shade300),
                      //     ),
                      //     enabledBorder: OutlineInputBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //       borderSide: BorderSide(color: Colors.grey.shade300),
                      //     ),
                      //     focusedBorder: OutlineInputBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //       borderSide: const BorderSide(
                      //         color: Color(0xFFAB47BC),
                      //         width: 2,
                      //       ),
                      //     ),
                      //     prefixIcon: const Icon(
                      //       Icons.public,
                      //       color: Color(0xFFAB47BC),
                      //     ),
                      //   ),
                      //   items: zones.map((zone) {
                      //     return DropdownMenuItem(
                      //       value: zone.sId,
                      //       child: Text(zone.title ?? 'N/A'),
                      //     );
                      //   }).toList(),
                      //   onChanged: (value) {
                      //     setState(() {
                      //       selectedZoneId = value;
                      //       selectedStateId = null;
                      //       selectedCityId = null;
                      //     });
                      //     if (selectedZoneId != null) {
                      //       provider.getAllStateByZoneId(
                      //         context,
                      //         selectedZoneId!,
                      //       );
                      //     }
                      //   },
                      // ),
                      // const SizedBox(height: 16),
                      // DropdownButtonFormField<String>(
                      //   value: selectedStateId,
                      //   decoration: InputDecoration(
                      //     labelText: 'Select State',
                      //     filled: true,
                      //     fillColor: Colors.grey[50],
                      //     border: OutlineInputBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //       borderSide: BorderSide(color: Colors.grey.shade300),
                      //     ),
                      //     enabledBorder: OutlineInputBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //       borderSide: BorderSide(color: Colors.grey.shade300),
                      //     ),
                      //     focusedBorder: OutlineInputBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //       borderSide: const BorderSide(
                      //         color: Color(0xFFAB47BC),
                      //         width: 2,
                      //       ),
                      //     ),
                      //     prefixIcon: const Icon(
                      //       Icons.location_city,
                      //       color: Color(0xFFAB47BC),
                      //     ),
                      //   ),
                      //   disabledHint: const Text('Please select zone first'),
                      //   items: states.isEmpty
                      //       ? null
                      //       : states.map<DropdownMenuItem<String>>((state) {
                      //     return DropdownMenuItem(
                      //       value: state.sId,
                      //       child: Text(state.title ?? 'N/A'),
                      //     );
                      //   }).toList(),
                      //   onChanged: selectedZoneId != null && states.isNotEmpty
                      //       ? (value) {
                      //     setState(() {
                      //       selectedStateId = value;
                      //       selectedCityId = null;
                      //     });
                      //     if (selectedStateId != null) {
                      //       provider.getAllCityByStateId(
                      //         context,
                      //         selectedStateId!,
                      //       );
                      //     }
                      //   }
                      //       : null,
                      // ),
                      // const SizedBox(height: 16),
                      // DropdownButtonFormField<String>(
                      //   decoration: InputDecoration(
                      //     labelText: 'Select City',
                      //     filled: true,
                      //     fillColor: Colors.grey[50],
                      //     border: OutlineInputBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //       borderSide: BorderSide(color: Colors.grey.shade300),
                      //     ),
                      //     enabledBorder: OutlineInputBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //       borderSide: BorderSide(color: Colors.grey.shade300),
                      //     ),
                      //     focusedBorder: OutlineInputBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //       borderSide: const BorderSide(
                      //         color: Color(0xFFAB47BC),
                      //         width: 2,
                      //       ),
                      //     ),
                      //     prefixIcon: const Icon(
                      //       Icons.domain,
                      //       color: Color(0xFFAB47BC),
                      //     ),
                      //   ),
                      //   disabledHint: const Text('Please select state first'),
                      //   items: cities.map<DropdownMenuItem<String>>((city) {
                      //     return DropdownMenuItem(
                      //       value: city.sId,
                      //       child: Text(city.title ?? 'N/A'),
                      //     );
                      //   }).toList(),
                      //   onChanged: selectedStateId != null
                      //       ? (value) {
                      //     setState(() {
                      //       selectedCityId = value;
                      //     });
                      //   }
                      //       : null,
                      // ),
                      const SizedBox(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: Text(
                              'Cancel',
                              style: TextStyle(color: Colors.grey[600]),
                            ),
                          ),
                          const SizedBox(width: 12),
                          ElevatedButton(
                            onPressed: () async {
                              if (_formKey.currentState!.validate()) {
                                if (titleController.text.isNotEmpty &&
                                    branchAddressController.text.isNotEmpty &&
                                    selectedZoneId != null &&
                                    selectedStateId != null &&
                                    selectedCityId != null) {
                                  await provider.createBranch(context, {
                                    'title': titleController.text,
                                    'address': branchAddressController.text,
                                    'zoneId': selectedZoneId,
                                    'stateId': selectedStateId,
                                    'cityId': selectedCityId,
                                  });
                                  if (context.mounted &&
                                      provider.createBranchModelResponse
                                          ?.success ==
                                          true) {
                                    await refreshData();
                                  }
                                }
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFAB47BC),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: const Text(
                              'Add Branch',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                color: AppColors.whiteColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}