import 'package:dss_crm/admin/controller/admin_location_api_provider.dart';
import 'package:dss_crm/admin/screen/department/action/action_group_list_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dss_crm/admin/model/department/get_all_branch_department_list_model.dart'
    as department;
import 'package:dss_crm/admin/model/department/designation/get_all_designation_list_model.dart'
    as designation;
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/ui_helper/app_text_styles.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import '../../../firebase/FirebaseNotificationService.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/form_validations_utils.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import '../../utils/location_hierarchy_utils.dart';
import 'edit_department_widget.dart';
import 'edit_designation_widget.dart';

class DepartmentDesignationManagementScreen extends StatefulWidget {
  const DepartmentDesignationManagementScreen({Key? key}) : super(key: key);

  @override
  State<DepartmentDesignationManagementScreen> createState() =>
      _DepartmentDesignationManagementScreenState();
}

class _DepartmentDesignationManagementScreenState
    extends State<DepartmentDesignationManagementScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final _locationKey = GlobalKey<LocationHierarchyDropdownsState>();
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String? _selectedZoneId;
  String? _selectedStateId;
  String? _selectedCityId;
  String? _selectedBranchId;



  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    NotificationService.initialize(context);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadInitialData();
    });
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text.trim().toLowerCase();
      });
    });
  }
  @override
  void dispose() {
    _searchController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadInitialData() async {
    final provider = Provider.of<AdminLocationApiProvider>(
      context,
      listen: false,
    );
    await provider.getAllDepartmentList(context);
    await provider.getAllDesignationList(context);
    await provider.getAllBranchList(context);
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
                    showUpTo: LocationLevel.designation,
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

  Widget _buildLoadingWidget(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(color: AppColors.primary),
          const SizedBox(height: 16),
          Text(message, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
        ],
      ),
    );
  }

  Widget _buildEmptyWidget({required IconData icon, required String title, required String subtitle}) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(icon, size: 64, color: AppColors.primary),
          ),
          const SizedBox(height: 24),
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Text(subtitle, style: TextStyle(fontSize: 14, color: Colors.grey[600])),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.endingGreyColor,
      appBar: DefaultCommonAppBar(
        activityName: 'Department Management',
        backgroundColor: AppColors.primary,
      ),
      body: Column(
        children: [
          Container(
            color: AppColors.primary,
            padding: ResponsiveHelper.paddingOnly(context,left: 12,right: 12,bottom: 4),
            child: Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    controller: _searchController,
                    hintText: 'Search departments, designations, , branches...',
                    prefixIcon: Icons.search,
                    validationType: ValidationType.none,
                  ),
                ),
                // SizedBox(width: 8),
                // IconButton(
                //   icon: Icon(Icons.filter_list, color: Colors.white),
                //   onPressed: _showFilterBottomSheet,
                // ),
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.black, Colors.grey[900]!],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              border: Border(
                bottom: BorderSide(color: Colors.grey[800]!, width: 1),
              ),
            ),
            child: TabBar(
              controller: _tabController,
              labelColor: Colors.white,
              unselectedLabelColor: Colors.grey[500],
              indicatorSize: TabBarIndicatorSize.tab,
              indicator: const UnderlineTabIndicator(
                borderSide: BorderSide(color: Colors.white, width: 3),
                insets: EdgeInsets.symmetric(horizontal: 16),
              ),
              labelStyle: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.3,
              ),
              unselectedLabelStyle: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
              ),
              tabs: const [
                Tab(
                  icon: Icon(Icons.business_rounded, size: 24),
                  text: 'Departments',
                  iconMargin: EdgeInsets.only(bottom: 4),
                ),
                Tab(
                  icon: Icon(Icons.badge_rounded, size: 24),
                  text: 'Designations',
                  iconMargin: EdgeInsets.only(bottom: 4),
                ),
                Tab(
                  icon: Icon(Icons.access_time_filled_outlined, size: 24),
                  text: 'Action',
                  iconMargin: EdgeInsets.only(bottom: 4),
                ),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [_buildDepartmentsTab(), _buildDesignationsTab() , ActionGroupsListScreen()],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDepartmentsTab() {
    return Consumer<AdminLocationApiProvider>(
      builder: (context, provider, _) {
        return RefreshIndicator(
          onRefresh: _loadInitialData,
          color: AppColors.primary,
          backgroundColor: Colors.white,
          strokeWidth: 3,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: _buildSectionHeader(
                  title: 'Departments',
                  itemCount:
                      provider
                          .getAllBranchDepartmentListModelResponse
                          ?.data
                          ?.data
                          ?.length ??
                      0,
                  onAddPressed: () => _showCreateDepartmentBottomSheet(context),
                ),
              ),
              Expanded(child: _buildDepartmentsList(provider)),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDesignationsTab() {
    return Consumer<AdminLocationApiProvider>(
      builder: (context, provider, _) {
        return RefreshIndicator(
          onRefresh: _loadInitialData,
          color: AppColors.primary,
          backgroundColor: Colors.white,
          strokeWidth: 3,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: _buildSectionHeader(
                  title: 'Designations',
                  itemCount:
                      provider
                          .getAllDesignationListModelResponse
                          ?.data
                          ?.data
                          ?.length ??
                      0,
                  onAddPressed: () =>
                      _showCreateDesignationBottomSheet(context),
                ),
              ),
              Expanded(child: _buildDesignationsList(provider)),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSectionHeader({
    required String title,
    required int itemCount,
    required VoidCallback onAddPressed,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '$itemCount items available',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          ElevatedButton.icon(
            onPressed: onAddPressed,
            icon: const Icon(Icons.add_rounded),
            label: const Text('Add New'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDepartmentsList(AdminLocationApiProvider provider) {
    var departments =  provider.getAllBranchDepartmentListModelResponse?.data?.data ?? [];

    if (_searchQuery.isNotEmpty) {
      departments = departments.where((dept) {
        final title = (dept.title ?? '').toLowerCase();
        final branch = (dept.branch?.title ?? '').toLowerCase();
        final deptId = (dept.departmentId ?? '').toLowerCase();
        return title.contains(_searchQuery) ||
            branch.contains(_searchQuery) ||
            deptId.contains(_searchQuery);
      }).toList();
    }

    // APPLY LOCATION FILTER (Zone/State/City/Branch)
    if (_selectedBranchId != null) {
      departments = departments.where((d) => d.branch?.sId == _selectedBranchId).toList();
    }

    if (provider.isLoading) {
      return _buildLoadingWidget('Loading departments...');
    }

    if (departments.isEmpty) {
      return _buildEmptyWidget(
        icon: Icons.business_outlined,
        title: 'No departments found',
        subtitle: _searchQuery.isNotEmpty
            ? 'Try searching with different keywords'
            : 'Create your first department',
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      itemCount: departments.length,
      itemBuilder: (context, index) =>
          _buildDepartmentCard(departments[index], provider),
    );
  }

  Widget _buildDepartmentCard(
    department.Data dept,
    AdminLocationApiProvider provider,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.grey[50]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with icon and title
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppColors.primary.withOpacity(0.15),
                        AppColors.primary.withOpacity(0.08),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.business_rounded,
                    color: AppColors.primary,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Department',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        dept.title ?? 'N/A',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                          letterSpacing: -0.3,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Divider
            Container(
              height: 1,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.grey[300]!,
                    Colors.grey[200]!,
                    Colors.grey[300]!,
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Branch Info
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.purple.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.location_city,
                    size: 16,
                    color: Colors.purple[700],
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Branch',
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.grey[500],
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.3,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        dept.branch?.title ?? 'N/A',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.purple[700],
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.purple.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.info_outline_rounded,
                    size: 16,
                    color: Colors.purple[700],
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Dept ID',
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.grey[500],
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.3,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        dept.departmentId ?? 'N/A',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.purple[700],
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Footer with date and actions
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[300]!, width: 1),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(width: 6),
                      Text(
                        DateFormatterUtils.formatUtcToReadable(dept.createdAt),
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey[700],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                _buildActionButton(
                  icon: Icons.edit_rounded,
                  color: Colors.blue,
                  onPressed: () =>
                      _showEditDepartmentBottomSheet(context, dept),
                ),
                const SizedBox(width: 8),
                _buildActionButton(
                  icon: Icons.delete_rounded,
                  color: Colors.red,
                  onPressed: () {
                    _showDeleteConfirmation(
                      context,
                      dept.title ?? '',
                      () async {
                        await provider.deleteDepartment(
                          context,
                          dept.sId ?? '',
                        );

                        if (context.mounted &&
                            await provider
                                    .deleteBranchDepartmentModelResponse
                                    ?.success ==
                                true) {
                          await _loadInitialData();
                        }
                      },
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: IconButton(
        icon: Icon(icon, size: 20),
        color: color,
        onPressed: onPressed,
        splashRadius: 20,
        constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
      ),
    );
  }

  Widget _buildDesignationsList(AdminLocationApiProvider provider) {
    var designations = provider.getAllDesignationListModelResponse?.data?.data ?? [];

    // APPLY SEARCH FILTER
    if (_searchQuery.isNotEmpty) {
      designations = designations.where((des) {
        final title = (des.title ?? '').toLowerCase();
        final desc = (des.description ?? '').toLowerCase();
        final dept = (des.depId?.title ?? '').toLowerCase();
        final branch = (des.branchId?.title ?? '').toLowerCase();
        return title.contains(_searchQuery) ||
            desc.contains(_searchQuery) ||
            dept.contains(_searchQuery) ||
            branch.contains(_searchQuery);
      }).toList();
    }

    // APPLY LOCATION FILTER
    if (_selectedBranchId != null) {
      designations = designations.where((d) => d.branchId?.sId == _selectedBranchId).toList();
    }

    if (provider.isLoading) {
      return _buildLoadingWidget('Loading designations...');
    }

    if (designations.isEmpty) {
      return _buildEmptyWidget(
        icon: Icons.badge_outlined,
        title: 'No designations found',
        subtitle: _searchQuery.isNotEmpty
            ? 'Try different keywords'
            : 'Create your first designation',
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      itemCount: designations.length,
      itemBuilder: (context, index) =>
          _buildDesignationCard(designations[index], provider),
    );
  }

  Widget _buildDesignationCard(
    designation.Data designation,
    AdminLocationApiProvider provider,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.grey[50]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with icon and title
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.teal.withOpacity(0.15),
                        Colors.teal.withOpacity(0.08),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.badge_rounded,
                    color: Colors.teal,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Designation',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        designation.title ?? 'N/A',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                          letterSpacing: -0.3,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Description if available
            if (designation.description != null &&
                designation.description!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: Colors.blue.withOpacity(0.1),
                    width: 1,
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.info_outline, size: 16, color: Colors.blue[700]),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        designation.description ?? '',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[700],
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 16),

            // Divider
            Container(
              height: 1,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.grey[300]!,
                    Colors.grey[200]!,
                    Colors.grey[300]!,
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Department and Branch Info
            Row(
              children: [
                // Department
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.orange.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: Colors.orange.withOpacity(0.2),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.orange.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Icon(
                            Icons.business_rounded,
                            size: 14,
                            color: Colors.orange[700],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Department',
                                style: TextStyle(
                                  fontSize: 9,
                                  color: Colors.grey[500],
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 0.3,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                designation.depId?.title ?? 'N/A',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.orange[800],
                                  fontWeight: FontWeight.w700,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),

                // Branch
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.purple.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: Colors.purple.withOpacity(0.2),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.purple.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Icon(
                            Icons.location_city,
                            size: 14,
                            color: Colors.purple[700],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Branch',
                                style: TextStyle(
                                  fontSize: 9,
                                  color: Colors.grey[500],
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 0.3,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                designation.branchId?.title ?? 'N/A',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.purple[800],
                                  fontWeight: FontWeight.w700,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Footer with date and actions
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[300]!, width: 1),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(width: 6),
                      Text(
                        DateFormatterUtils.formatUtcToReadable(
                          designation.createdAt,
                        ),
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey[700],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                _buildActionButton(
                  icon: Icons.edit_rounded,
                  color: Colors.blue,
                  onPressed: () =>
                      _showEditDesignationBottomSheet(context, designation),
                ),
                const SizedBox(width: 8),
                _buildActionButton(
                  icon: Icons.delete_rounded,
                  color: Colors.red,
                  onPressed: () {
                    _showDeleteConfirmation(
                      context,
                      designation.title ?? '',
                      () async {
                        provider.deleteDesignation(
                          context,
                          designation.sId ?? '',
                        );

                        if (context.mounted &&
                            await provider
                                    .deleteDesignationModelResponse
                                    ?.success ==
                                true) {
                          Navigator.pop(context);
                          await _loadInitialData();
                        }
                      },
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    IconData icon;

    switch (status.toLowerCase()) {
      case 'active':
        color = Colors.green;
        icon = Icons.check_circle;
        break;
      case 'inactive':
        color = Colors.red;
        icon = Icons.cancel;
        break;
      default:
        color = Colors.grey;
        icon = Icons.help_outline;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 6),
          Text(
            status,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  void _showDeleteConfirmation(
    BuildContext context,
    String itemName,
    VoidCallback onConfirm,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.delete_outline,
                color: Colors.red,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'Delete Item',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Are you sure you want to delete this item?',
              style: TextStyle(fontSize: 14, color: Colors.black87),
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                itemName,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 15,
                  color: Colors.black87,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'This action cannot be undone.',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              // Navigator.pop(context);
              onConfirm();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: const Text(
              'Delete',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  void _showCreateDepartmentBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) =>
          CreateDepartmentBottomSheet(onCreated: () => _loadInitialData()),
    );
  }

  void _showEditDepartmentBottomSheet(
    BuildContext context,
    department.Data dept,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => EditDepartmentBottomSheet(
        department: dept,
        onUpdated: () => _loadInitialData(),
      ),
    );
  }

  void _showCreateDesignationBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) =>
          CreateDesignationBottomSheet(onCreated: () => _loadInitialData()),
    );
  }

  void _showEditDesignationBottomSheet(
    BuildContext context,
    designation.Data designation,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => EditDesignationBottomSheet(
        designation: designation,
        onUpdated: () => _loadInitialData(),
      ),
    );
  }
}

// Create Department Bottom Sheet
class CreateDepartmentBottomSheet extends StatefulWidget {
  final VoidCallback onCreated;

  const CreateDepartmentBottomSheet({Key? key, required this.onCreated})
    : super(key: key);

  @override
  State<CreateDepartmentBottomSheet> createState() =>
      _CreateDepartmentBottomSheetState();
}

class _CreateDepartmentBottomSheetState
    extends State<CreateDepartmentBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  String? _selectedZoneId;
  String? _selectedStateId;
  String? _selectedCityId;
  String? _selectedBranchId;
  String? _selectedStatus = 'Active';

  final _locationKey = GlobalKey<LocationHierarchyDropdownsState>();


  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Local state variables for the bottom sheet
    String? localSelectedZoneId = _selectedZoneId;
    String? localSelectedStateId = _selectedStateId;
    String? localSelectedCityId = _selectedCityId;
    String? localSelectedBranchId = _selectedBranchId;
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(28),
          topRight: Radius.circular(28),
        ),
      ),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) {
          return SingleChildScrollView(
            controller: scrollController,
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                24,
                24,
                24,
                MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 48,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey[300],
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Create New Department',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Update department information',
                      style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                    ),
                    const SizedBox(height: 10),
                    CustomTextField(
                      controller: _titleController,
                      hintText: 'Department Name',
                      title: 'Department Name',
                      prefixIcon: Icons.business,
                      validationType: ValidationType.name,
                      keyboardType: TextInputType.text,
                    ),

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

                    // Consumer<AdminLocationApiProvider>(
                    //   builder: (context, provider, _) {
                    //     final branches =
                    //         provider
                    //             .getAllBranchListModelResponse
                    //             ?.data
                    //             ?.data ??
                    //         [];
                    //     return ResponsiveDropdown<String>(
                    //       value: _selectedBranchId,
                    //       itemList: branches.map((b) => b.sId ?? '').toList(),
                    //       onChanged: (value) =>
                    //           setState(() => _selectedBranchId = value),
                    //       hint: 'Choose a branch',
                    //       label: 'Select Branch',
                    //       itemDisplayBuilder: (id) {
                    //         return branches
                    //                 .firstWhere(
                    //                   (b) => b.sId == id,
                    //                   orElse: () => branches.first,
                    //                 )
                    //                 .title ??
                    //             'N/A';
                    //       },
                    //       validator: (value) => (value == null || value.isEmpty)
                    //           ? 'Please select a branch'
                    //           : null,
                    //     );
                    //   },
                    // ),

                    const SizedBox(height: 20),
                    Consumer<AdminLocationApiProvider>(
                      builder: (context, provider, _) {
                        return Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: provider.isLoading
                                    ? null
                                    : () => Navigator.pop(context),
                                style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: Colors.grey),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 14,
                                  ),
                                ),
                                child: const Text(
                                  'Cancel',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.grey,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: provider.isLoading
                                    ? null
                                    : () async {
                                        if (_formKey.currentState!.validate()) {
                                          final body = {
                                            'title': _titleController.text,
                                            'branch': _selectedBranchId,
                                            // 'status': _selectedStatus,
                                          };
                                          await provider.createDepartment(
                                            context,
                                            body,
                                          );

                                          if (context.mounted &&
                                              provider
                                                      .createBranchDepartmentModelResponse
                                                      ?.success ==
                                                  true) {
                                            widget.onCreated();
                                          }
                                        }
                                      },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 14,
                                  ),
                                ),
                                child: provider.isLoading
                                    ? const SizedBox(
                                        height: 24,
                                        width: 24,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          valueColor: AlwaysStoppedAnimation(
                                            Colors.white,
                                          ),
                                        ),
                                      )
                                    : const Text(
                                        'Create',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

// Create Designation Bottom Sheet
class CreateDesignationBottomSheet extends StatefulWidget {
  final VoidCallback onCreated;

  const CreateDesignationBottomSheet({Key? key, required this.onCreated})
    : super(key: key);

  @override
  State<CreateDesignationBottomSheet> createState() =>
      _CreateDesignationBottomSheetState();
}

class _CreateDesignationBottomSheetState extends State<CreateDesignationBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  String? _selectedDepartmentId;
  String? _selectedZoneId;
  String? _selectedStateId;
  String? _selectedCityId;
  String? _selectedBranchId;
  String? _selectedStatus = 'Active';

  final _locationKey = GlobalKey<LocationHierarchyDropdownsState>();

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Local state variables for the bottom sheet

    String? localSelectedZoneId = _selectedZoneId;
    String? localSelectedStateId = _selectedStateId;
    String? localSelectedCityId = _selectedCityId;
    String? localSelectedBranchId = _selectedBranchId;
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(28),
          topRight: Radius.circular(28),
        ),
      ),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.8,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) {
          return SingleChildScrollView(
            controller: scrollController,
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                24,
                24,
                24,
                MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 48,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey[300],
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Create New Designation',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Add a new designation to your organization',
                      style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                    ),
                    const SizedBox(height: 28),

                    CustomTextField(
                      controller: _titleController,
                      hintText: 'Designation Title',
                      title: 'Designation Title',
                      prefixIcon: Icons.badge,
                      validationType: ValidationType.name,
                      keyboardType: TextInputType.text,
                    ),

                    CustomTextField(
                      controller: _descriptionController,
                      hintText: 'Description',
                      title: 'Description',
                      maxLines: 3,
                      validationType: ValidationType.name,
                      keyboardType: TextInputType.text,
                    ),

                    LocationHierarchyDropdowns(
                      key: _locationKey,
                      initialZoneId: _selectedZoneId,
                      initialStateId: _selectedStateId,
                      initialCityId: _selectedCityId,
                      initialBranchId: _selectedBranchId,
                      showUpTo: LocationLevel.department,
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
                    // Consumer<AdminLocationApiProvider>(
                    //   builder: (context, provider, _) {
                    //     final branches =
                    //         provider
                    //             .getAllBranchListModelResponse
                    //             ?.data
                    //             ?.data ??
                    //         [];
                    //
                    //     // Remove duplicates by converting to Set then back to List
                    //     final uniqueBranchIds = branches
                    //         .map((b) => b.sId ?? '')
                    //         .where((id) => id.isNotEmpty)
                    //         .toSet()
                    //         .toList();
                    //
                    //     return ResponsiveDropdown<String>(
                    //       value: _selectedBranchId,
                    //       itemList: uniqueBranchIds,
                    //       onChanged: (branchId) async {
                    //         if (branchId != null && branchId.isNotEmpty) {
                    //           setState(() {
                    //             _selectedBranchId = branchId;
                    //             _selectedDepartmentId =
                    //                 null; // IMPORTANT: Reset department
                    //           });
                    //
                    //           // Call API to get departments for this branch
                    //           await context
                    //               .read<AdminLocationApiProvider>()
                    //               .getAllDepartmentByBranchId(
                    //                 context,
                    //                 branchId,
                    //               );
                    //         }
                    //       },
                    //       hint: 'Choose a branch',
                    //       label: 'Select Branch',
                    //       itemDisplayBuilder: (id) {
                    //         try {
                    //           return branches
                    //                   .firstWhere((b) => b.sId == id)
                    //                   .title ??
                    //               'N/A';
                    //         } catch (e) {
                    //           return 'N/A';
                    //         }
                    //       },
                    //       validator: (value) => (value == null || value.isEmpty)
                    //           ? 'Please select a branch'
                    //           : null,
                    //     );
                    //   },
                    // ),
                    // // Department Dropdown
                    // Consumer<AdminLocationApiProvider>(
                    //   builder: (context, provider, _) {
                    //     // Get departments from API response
                    //     final departments =
                    //         provider
                    //             .getAllDepartmentByBranchIdModelResponse
                    //             ?.data
                    //             ?.data ??
                    //         [];
                    //     final isDepartmentLoading = provider.isDeprtLoading;
                    //
                    //     // CRITICAL FIX: Remove duplicate department IDs
                    //     final uniqueDepartmentIds = departments
                    //         .map((d) => d.sId ?? '')
                    //         .where((id) => id.isNotEmpty)
                    //         .toSet()
                    //         .toList();
                    //
                    //     // CRITICAL FIX: Validate selected value exists in new list
                    //     // If not, reset it asynchronously to avoid setState during build
                    //     if (_selectedDepartmentId != null &&
                    //         _selectedDepartmentId!.isNotEmpty &&
                    //         !uniqueDepartmentIds.contains(
                    //           _selectedDepartmentId,
                    //         )) {
                    //       WidgetsBinding.instance.addPostFrameCallback((_) {
                    //         if (mounted) {
                    //           setState(() {
                    //             _selectedDepartmentId = null;
                    //           });
                    //         }
                    //       });
                    //     }
                    //
                    //     return ResponsiveDropdown<String>(
                    //       value: _selectedDepartmentId,
                    //       itemList: uniqueDepartmentIds,
                    //       onChanged: _selectedBranchId == null
                    //           ? null
                    //           : (value) {
                    //               setState(() => _selectedDepartmentId = value);
                    //             },
                    //       hint: _selectedBranchId == null
                    //           ? 'First select a branch'
                    //           : isDepartmentLoading
                    //           ? 'Loading departments...'
                    //           : departments.isEmpty
                    //           ? 'No departments available'
                    //           : 'Choose a department',
                    //       label: 'Select Department',
                    //       itemDisplayBuilder: (id) {
                    //         try {
                    //           return departments
                    //                   .firstWhere((d) => d.sId == id)
                    //                   .title ??
                    //               'N/A';
                    //         } catch (e) {
                    //           return 'N/A';
                    //         }
                    //       },
                    //       validator: (value) => (value == null || value.isEmpty)
                    //           ? 'Please select a department'
                    //           : null,
                    //     );
                    //   },
                    // ),
                    // // const SizedBox(height: 20),
                    // // DropdownButtonFormField<String>(
                    // //   value: _selectedStatus,
                    // //   decoration: InputDecoration(
                    // //     labelText: 'Status',
                    // //     prefixIcon: Icon(
                    // //       Icons.info_outline,
                    // //       color: AppColors.primary,
                    // //     ),
                    // //     border: OutlineInputBorder(
                    // //       borderRadius: BorderRadius.circular(12),
                    // //       borderSide: BorderSide(color: Colors.grey[300]!),
                    // //     ),
                    // //     enabledBorder: OutlineInputBorder(
                    // //       borderRadius: BorderRadius.circular(12),
                    // //       borderSide: BorderSide(color: Colors.grey[300]!),
                    // //     ),
                    // //     focusedBorder: OutlineInputBorder(
                    // //       borderRadius: BorderRadius.circular(12),
                    // //       borderSide: BorderSide(
                    // //         color: AppColors.primary,
                    // //         width: 2,
                    // //       ),
                    // //     ),
                    // //     contentPadding: const EdgeInsets.symmetric(
                    // //       horizontal: 16,
                    // //       vertical: 16,
                    // //     ),
                    // //   ),
                    // //   items: ['Active', 'Inactive']
                    // //       .map(
                    // //         (status) => DropdownMenuItem(
                    // //           value: status,
                    // //           child: Text(status),
                    // //         ),
                    // //       )
                    // //       .toList(),
                    // //   onChanged: (value) =>
                    // //       setState(() => _selectedStatus = value),
                    // // ),
                    const SizedBox(height: 20),
                    Consumer<AdminLocationApiProvider>(
                      builder: (context, provider, _) {
                        return Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: provider.isLoading
                                    ? null
                                    : () => Navigator.pop(context),
                                style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: Colors.grey),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 14,
                                  ),
                                ),
                                child: const Text(
                                  'Cancel',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.grey,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: provider.isLoading
                                    ? null
                                    : () async {
                                        if (_formKey.currentState!.validate()) {
                                          final body = {
                                            'title': _titleController.text,
                                            'description':
                                                _descriptionController.text,
                                            'depId': _selectedDepartmentId,
                                            'branchId': _selectedBranchId,
                                            // 'status': _selectedStatus,
                                          };
                                          await provider.createDesignation(
                                            context,
                                            body,
                                          );

                                          if (context.mounted &&
                                              provider
                                                      .createDesignationModelResponse
                                                      ?.success ==
                                                  true) {
                                            widget
                                                .onCreated(); // Use the callback
                                          }
                                        }
                                      },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 14,
                                  ),
                                ),
                                child: provider.isLoading
                                    ? const SizedBox(
                                        height: 24,
                                        width: 24,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          valueColor: AlwaysStoppedAnimation(
                                            Colors.white,
                                          ),
                                        ),
                                      )
                                    : const Text(
                                        'Create',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
