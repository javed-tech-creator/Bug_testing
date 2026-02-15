import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dss_crm/admin/controller/admin_location_api_provider.dart';
import 'package:dss_crm/utils/responsive_dropdown_utils.dart';

import '../../ui_helper/app_text_styles.dart';
import '../../utils/responsive_helper_utils.dart';
import '../model/user_register/get_managed_list_by_designation_model.dart' show Users;

enum LocationLevel {
  zone,
  state,
  city,
  branch,
  department,
  designation,
  managedBy,
  actions,
}

class LocationHierarchyDropdowns extends StatefulWidget {
  /// Initial selected values (optional) - use for edit mode
  final String? initialZoneId;
  final String? initialStateId;
  final String? initialCityId;
  final String? initialBranchId;
  final String? initialDepartmentId;
  final String? initialDesignationId;
  final String? initialMangedById;

  final List<String>? initialSelectedActionIds;

  /// Callbacks to get selected IDs
  final ValueChanged<String?>? onZoneChanged;
  final ValueChanged<String?>? onStateChanged;
  final ValueChanged<String?>? onCityChanged;
  final ValueChanged<String?>? onBranchChanged;
  final ValueChanged<String?>? onDepartmentChanged;
  final ValueChanged<String?>? onDesignationChanged;
  final ValueChanged<List<String>>? onActionsChanged;

  /// Show dropdowns up to this level (e.g., LocationLevel.branch will show zone, state, city, branch)
  final LocationLevel? showUpTo;

  /// Whether to enable validation (default: true)
  final bool enableValidation;

  /// Custom validators
  final String? Function(String?)? zoneValidator;
  final String? Function(String?)? stateValidator;
  final String? Function(String?)? cityValidator;
  final String? Function(String?)? branchValidator;
  final String? Function(String?)? departmentValidator;
  final String? Function(String?)? designationValidator;

  /// Whether the widget is in read-only mode
  final bool readOnly;

  const LocationHierarchyDropdowns({
    Key? key,
    this.initialZoneId,
    this.initialStateId,
    this.initialCityId,
    this.initialBranchId,
    this.initialDepartmentId,
    this.initialDesignationId,
    this.initialMangedById,
    this.initialSelectedActionIds,
    this.onZoneChanged,
    this.onStateChanged,
    this.onCityChanged,
    this.onBranchChanged,
    this.onDepartmentChanged,
    this.onDesignationChanged,
    this.onActionsChanged,
    this.showUpTo,
    this.enableValidation = true,
    this.zoneValidator,
    this.stateValidator,
    this.cityValidator,
    this.branchValidator,
    this.departmentValidator,
    this.designationValidator,
    this.readOnly = false,
  }) : super(key: key);

  @override
  State<LocationHierarchyDropdowns> createState() => LocationHierarchyDropdownsState();
}

class LocationHierarchyDropdownsState extends State<LocationHierarchyDropdowns> {
  String? _selectedZoneId;
  String? _selectedStateId;
  String? _selectedCityId;
  String? _selectedBranchId;
  String? _selectedDepartmentId;
  String? _selectedDesignationId;
  String? _selectedManagedById;
  Set<String> _selectedActionIds = {};

  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    _selectedZoneId = widget.initialZoneId;
    _selectedStateId = widget.initialStateId;
    _selectedCityId = widget.initialCityId;
    _selectedBranchId = widget.initialBranchId;
    _selectedDepartmentId = widget.initialDepartmentId;
    _selectedDesignationId = widget.initialDesignationId;
    _selectedManagedById = widget.initialMangedById;
    _selectedActionIds = widget.initialSelectedActionIds?.toSet() ?? {};

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadInitialData();
    });
  }

  bool _shouldShowLevel(LocationLevel level) {
    if (widget.showUpTo == null) return true;
    return level.index <= widget.showUpTo!.index;
  }

  Future<void> _loadInitialData() async {
    if (_isInitialized) return;

    final provider = Provider.of<AdminLocationApiProvider>(context, listen: false);

    try {
      // Always load zones first if zone level is shown
      if (_shouldShowLevel(LocationLevel.zone)) {
        await provider.getAllZoneList(context);
      }

      // If initial values are provided, load the dependent data in sequence
      if (widget.initialZoneId != null && _shouldShowLevel(LocationLevel.state)) {
        await provider.getAllStateByZoneId(context, widget.initialZoneId!);
      }

      if (widget.initialStateId != null && _shouldShowLevel(LocationLevel.city)) {
        await provider.getAllCityByStateId(context, widget.initialStateId!);
      }

      if (widget.initialCityId != null && _shouldShowLevel(LocationLevel.branch)) {
        await provider.getAllBranchByCityId(context, widget.initialCityId!);
      }

      if (widget.initialBranchId != null && _shouldShowLevel(LocationLevel.department)) {
        await provider.getAllDepartmentByBranchId(context, widget.initialBranchId!);
      }

      if (widget.initialDepartmentId != null && _shouldShowLevel(LocationLevel.designation)) {
        await provider.getAllDesignationByDepartmetnId(context, widget.initialDepartmentId!);
      }

      // Load actions if department is selected
      if (widget.initialDepartmentId != null && _shouldShowLevel(LocationLevel.actions)) {
        await provider.getAllActionGroupByDepartmentId(context, widget.initialDepartmentId!);
      }
      if (widget.initialDesignationId != null && _shouldShowLevel(LocationLevel.managedBy)) {
        await provider.getAllManagedByListByDeDesignationId(context, widget.initialDesignationId!);
      }

      if (widget.initialSelectedActionIds != null && widget.initialSelectedActionIds!.isNotEmpty) {
        _selectedActionIds = widget.initialSelectedActionIds!.toSet();
      }

      if (mounted) {
        setState(() {
          _isInitialized = true;
        });
      }
    } catch (e) {
      print('Error loading initial data: $e');
      if (mounted) {
        setState(() {
          _isInitialized = true;
        });
      }
    }
  }

  /// Public method to get all selected IDs
  Map<String, dynamic> getSelectedIds() {
    return {
      'zoneId': _selectedZoneId,
      'stateId': _selectedStateId,
      'cityId': _selectedCityId,
      'branchId': _selectedBranchId,
      'departmentId': _selectedDepartmentId,
      'designationId': _selectedDesignationId,
      'managedById': _selectedManagedById,
      'actionIds': _selectedActionIds.toList(),
    };
  }

  /// Public method to get selected action IDs
  List<String> getSelectedActionIds() {
    return _selectedActionIds.toList();
  }

  /// Public method to reset all selections
  void resetSelections() {
    setState(() {
      _selectedZoneId = null;
      _selectedStateId = null;
      _selectedCityId = null;
      _selectedBranchId = null;
      _selectedDepartmentId = null;
      _selectedDesignationId = null;
      _selectedActionIds.clear();
    });
  }

  /// Public method to validate all dropdowns
  bool validate() {
    return true;
  }

  void _toggleAction(String actionId) {
    setState(() {
      if (_selectedActionIds.contains(actionId)) {
        _selectedActionIds.remove(actionId);
      } else {
        _selectedActionIds.add(actionId);
      }
    });
    widget.onActionsChanged?.call(_selectedActionIds.toList());
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AdminLocationApiProvider>(
      builder: (context, provider, _) {
        return Column(
          children: [
            if (_shouldShowLevel(LocationLevel.zone)) _buildZoneDropdown(provider),
            if (_shouldShowLevel(LocationLevel.state)) _buildStateDropdown(provider),
            if (_shouldShowLevel(LocationLevel.city)) _buildCityDropdown(provider),
            if (_shouldShowLevel(LocationLevel.branch)) _buildBranchDropdown(provider),
            if (_shouldShowLevel(LocationLevel.department)) _buildDepartmentDropdown(provider),
            if (_shouldShowLevel(LocationLevel.designation)) _buildDesignationDropdown(provider),
            // ADD this inside build() method, in the Column children list:
            if (_shouldShowLevel(LocationLevel.managedBy)) _buildManagedByDropdown(provider),
            if (_shouldShowLevel(LocationLevel.actions) && _selectedDepartmentId != null)
              _buildActionsSection(provider),
          ],
        );
      },
    );
  }

  Widget _buildActionsSection(AdminLocationApiProvider provider) {
    final actionGroups = provider.getAllActionGroupByDepartmentIdModelResponse?.data?.data ?? [];

    if (actionGroups.isEmpty) {
      return const SizedBox.shrink();
    }

    // Sync preselected actions (for edit mode) with current API list
    final availableIds = actionGroups.map((g) => g.sId?.trim() ?? '').where((id) => id.isNotEmpty).toList();
    final validInitialIds = _selectedActionIds.where((id) => availableIds.contains(id)).toSet();

    // If any mismatch, update once after API load
    if (validInitialIds.isNotEmpty && validInitialIds.length != _selectedActionIds.length) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          setState(() {
            _selectedActionIds = validInitialIds;
          });
        }
      });
    }

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.shade100,
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
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.orange.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  Icons.shield_outlined,
                  color: Colors.orange.shade700,
                  size: ResponsiveHelper.iconSize(context, 14),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Select Action Groups',
                style: AppTextStyles.heading1(
                  context,
                  overrideStyle: TextStyle(
                    color: Colors.orange.shade800,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Action Groups Checkbox List
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: actionGroups.length,
            itemBuilder: (context, index) {
              final actionGroup = actionGroups[index];
              final groupTitle = actionGroup.title ?? 'Action Group';
              final groupId = actionGroup.sId?.trim() ?? '';
              final isSelected = _selectedActionIds.contains(groupId);

              return CheckboxListTile(
                value: isSelected,
                onChanged: widget.readOnly
                    ? null
                    : (bool? value) {
                  setState(() {
                    if (value == true) {
                      _selectedActionIds.add(groupId);
                    } else {
                      _selectedActionIds.remove(groupId);
                    }
                  });
                  widget.onActionsChanged?.call(_selectedActionIds.toList());
                },
                title: Text(
                  groupTitle,
                  style: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 10),
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
                controlAffinity: ListTileControlAffinity.leading,
                activeColor: Colors.orange.shade700,
                checkColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
                dense: false,
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildZoneDropdown(AdminLocationApiProvider provider) {
    final zones = provider.getAllZoneListModelResponse?.data?.data ?? [];
    final isLoading = !_isInitialized && zones.isEmpty;

    return ResponsiveDropdown<String>(
      key: ValueKey('zone_${zones.length}'),
      value: _selectedZoneId,
      itemList: zones.map((zone) => zone.sId!).toList(),
      itemDisplayBuilder: (id) {
        try {
          final zone = zones.firstWhere((z) => z.sId == id);
          return zone.title ?? 'N/A';
        } catch (e) {
          return 'N/A';
        }
      },
      onChanged: widget.readOnly ? null : (value) {
        if (value != null) {
          setState(() {
            _selectedZoneId = value;
            _selectedStateId = null;
            _selectedCityId = null;
            _selectedBranchId = null;
            _selectedDepartmentId = null;
            _selectedDesignationId = null;
            _selectedActionIds.clear();
          });

          widget.onZoneChanged?.call(value);

          if (_shouldShowLevel(LocationLevel.state)) {
            provider.getAllStateByZoneId(context, value);
          }
        }
      },
      hint: isLoading ? 'Loading zones...' : 'Choose Zone',
      label: 'Zone',
      isReadOnly: widget.readOnly || isLoading,
      validator: widget.enableValidation
          ? (widget.zoneValidator ?? (value) => value == null ? 'Please select a zone' : null)
          : null,
    );

  }

  Widget _buildStateDropdown(AdminLocationApiProvider provider) {
    final states = _selectedZoneId != null
        ? provider.getAllStateByZoneIdModelResponse?.data?.data ?? []
        : [];

    final isLoading = !_isInitialized && _selectedZoneId != null && states.isEmpty;

    // Validate current selection
    String? validatedValue = _selectedStateId;
    if (validatedValue != null && states.isNotEmpty) {
      bool exists = states.any((s) => s.sId == validatedValue);
      if (!exists) {
        validatedValue = null;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            setState(() {
              _selectedStateId = null;
              _selectedCityId = null;
              _selectedBranchId = null;
              _selectedDepartmentId = null;
              _selectedDesignationId = null;
              _selectedActionIds.clear();
            });
          }
        });
      }
    }

    final isEnabled = _selectedZoneId != null && !widget.readOnly && !isLoading;

    return ResponsiveDropdown<String>(
      key: ValueKey('state_${_selectedZoneId}_${states.length}'),
      value: validatedValue,
      itemList: states.map((state) => state.sId!).toList().cast<String>(),
      itemDisplayBuilder: (id) {
        try {
          final state = states.firstWhere((s) => s.sId == id);
          return state.title ?? 'N/A';
        } catch (e) {
          return 'N/A';
        }
      },
      onChanged: isEnabled ? (value) {
        if (value != null) {
          setState(() {
            _selectedStateId = value;
            _selectedCityId = null;
            _selectedBranchId = null;
            _selectedDepartmentId = null;
            _selectedDesignationId = null;
            _selectedActionIds.clear();
          });

          widget.onStateChanged?.call(value);

          if (_shouldShowLevel(LocationLevel.city)) {
            provider.getAllCityByStateId(context, value);
          }
        }
      } : null,
      hint: isLoading ? 'Loading states...' : (_selectedZoneId == null ? 'Select Zone first' : 'Choose State'),
      label: 'State',
      isReadOnly: !isEnabled,
      validator: widget.enableValidation
          ? (widget.stateValidator ?? (value) => value == null ? 'Please select a state' : null)
          : null,
    );
  }

  Widget _buildCityDropdown(AdminLocationApiProvider provider) {
    final cities = _selectedStateId != null
        ? provider.getAllCityByStateIdModelResponse?.data?.data ?? []
        : [];

    final isLoading = !_isInitialized && _selectedStateId != null && cities.isEmpty;

    // Validate current selection
    String? validatedValue = _selectedCityId;
    if (validatedValue != null && cities.isNotEmpty) {
      bool exists = cities.any((c) => c.sId == validatedValue);
      if (!exists) {
        validatedValue = null;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            setState(() {
              _selectedCityId = null;
              _selectedBranchId = null;
              _selectedDepartmentId = null;
              _selectedDesignationId = null;
              _selectedActionIds.clear();
            });
          }
        });
      }
    }

    final isEnabled = _selectedStateId != null && !widget.readOnly && !isLoading;

    return ResponsiveDropdown<String>(
      key: ValueKey('city_${_selectedStateId}_${cities.length}'),
      value: validatedValue,
      itemList: cities.map((city) => city.sId!).toList().cast<String>(),
      itemDisplayBuilder: (id) {
        try {
          final city = cities.firstWhere((c) => c.sId == id);
          return city.title ?? 'N/A';
        } catch (e) {
          return 'N/A';
        }
      },
      onChanged: isEnabled ? (value) {
        if (value != null) {
          setState(() {
            _selectedCityId = value;
            _selectedBranchId = null;
            _selectedDepartmentId = null;
            _selectedDesignationId = null;
            _selectedActionIds.clear();
          });

          widget.onCityChanged?.call(value);

          if (_shouldShowLevel(LocationLevel.branch)) {
            provider.getAllBranchByCityId(context, value);
          }
        }
      } : null,
      hint: isLoading ? 'Loading cities...' : (_selectedStateId == null ? 'Select State first' : 'Choose City'),
      label: 'City',
      isReadOnly: !isEnabled,
      validator: widget.enableValidation
          ? (widget.cityValidator ?? (value) => value == null ? 'Please select a city' : null)
          : null,
    );
  }

  Widget _buildBranchDropdown(AdminLocationApiProvider provider) {
    final branches = _selectedCityId != null
        ? provider.getAllBranchByCityIdModelResponse?.data?.data ?? []
        : [];

    final isLoading = !_isInitialized && _selectedCityId != null && branches.isEmpty;

    // Validate current selection
    String? validatedValue = _selectedBranchId;
    if (validatedValue != null && branches.isNotEmpty) {
      bool exists = branches.any((b) => b.sId == validatedValue);
      if (!exists) {
        validatedValue = null;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            setState(() {
              _selectedBranchId = null;
              _selectedDepartmentId = null;
              _selectedDesignationId = null;
              _selectedActionIds.clear();
            });
          }
        });
      }
    }

    final isEnabled = _selectedCityId != null && !widget.readOnly && !isLoading;

    return ResponsiveDropdown<String>(
      key: ValueKey('branch_${_selectedCityId}_${branches.length}'),
      value: validatedValue,
      itemList: branches.map((branch) => branch.sId!).toList().cast<String>(),
      itemDisplayBuilder: (id) {
        try {
          final branch = branches.firstWhere((b) => b.sId == id);
          return branch.title ?? 'N/A';
        } catch (e) {
          return 'N/A';
        }
      },
      onChanged: isEnabled ? (value) {
        if (value != null) {
          setState(() {
            _selectedBranchId = value;
            _selectedDepartmentId = null;
            _selectedDesignationId = null;
            _selectedActionIds.clear();
          });

          widget.onBranchChanged?.call(value);

          if (_shouldShowLevel(LocationLevel.department)) {
            provider.getAllDepartmentByBranchId(context, value);
          }
        }
      } : null,
      hint: isLoading ? 'Loading branches...' : (_selectedCityId == null ? 'Select City first' : 'Choose Branch'),
      label: 'Branch',
      isReadOnly: !isEnabled,
      validator: widget.enableValidation
          ? (widget.branchValidator ?? (value) => value == null ? 'Please select a branch' : null)
          : null,
    );
  }

  Widget _buildDepartmentDropdown(AdminLocationApiProvider provider) {
    final departments = _selectedBranchId != null
        ? provider.getAllDepartmentByBranchIdModelResponse?.data?.data ?? []
        : [];

    final isLoading = !_isInitialized && _selectedBranchId != null && departments.isEmpty;

    // Validate current selection
    String? validatedValue = _selectedDepartmentId;
    if (validatedValue != null && departments.isNotEmpty) {
      bool exists = departments.any((d) => d.sId == validatedValue);
      if (!exists) {
        validatedValue = null;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            setState(() {
              _selectedDepartmentId = null;
              _selectedDesignationId = null;
              _selectedManagedById = null;
              _selectedActionIds.clear();
            });

          }
        });
      }
    }

    final isEnabled = _selectedBranchId != null && !widget.readOnly && !isLoading;

    return ResponsiveDropdown<String>(
      key: ValueKey('department_${_selectedBranchId}_${departments.length}'),
      value: validatedValue,
      itemList: departments.map((dept) => dept.sId!).toList().cast<String>(),
      itemDisplayBuilder: (id) {
        try {
          final dept = departments.firstWhere((d) => d.sId == id);
          return dept.title ?? 'N/A';
        } catch (e) {
          return 'N/A';
        }
      },
      onChanged: isEnabled ? (value) {
        if (value != null) {
          setState(() {
            _selectedDepartmentId = value;
            _selectedDesignationId = null;
            _selectedManagedById = null;
            _selectedActionIds.clear();
          });

          widget.onDepartmentChanged?.call(value);

          if (_shouldShowLevel(LocationLevel.designation)) {
            provider.getAllDesignationByDepartmetnId(context, value);
          }

          // Load actions when department is selected
          if (_shouldShowLevel(LocationLevel.actions)) {
            provider.getAllActionGroupByDepartmentId(context, value);
          }
        }
      } : null,
      hint: isLoading ? 'Loading departments...' : (_selectedBranchId == null ? 'Select Branch first' : 'Choose Department'),
      label: 'Department',
      isReadOnly: !isEnabled,
      validator: widget.enableValidation
          ? (widget.departmentValidator ?? (value) => value == null ? 'Please select a department' : null)
          : null,
    );
  }

  Widget _buildDesignationDropdown(AdminLocationApiProvider provider) {
    final designations = _selectedDepartmentId != null
        ? provider.getAllDesignationByDepartmentIdModelResponse?.data?.data ?? []
        : [];

    final isLoading = !_isInitialized && _selectedDepartmentId != null && designations.isEmpty;

    // Validate current selection
    String? validatedValue = _selectedDesignationId;
    if (validatedValue != null && designations.isNotEmpty) {
      bool exists = designations.any((d) => d.sId == validatedValue);
      if (!exists) {
        validatedValue = null;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            setState(() {
              _selectedDesignationId = null;
            });
          }
        });
      }
    }

    final isEnabled = _selectedDepartmentId != null && !widget.readOnly && !isLoading;

    return ResponsiveDropdown<String>(
      key: ValueKey('designation_${_selectedDepartmentId}_${designations.length}'),
      value: validatedValue,
      itemList: designations.map((designation) => designation.sId!).toList().cast<String>(),
      itemDisplayBuilder: (id) {
        try {
          final designation = designations.firstWhere((d) => d.sId == id);
          return designation.title ?? 'N/A';
        } catch (e) {
          return 'N/A';
        }
      },
      onChanged: isEnabled ? (value) {
        if (value != null) {
          setState(() {
            _selectedDesignationId = value;
            _selectedManagedById = null; // Clear child
          });

          widget.onDesignationChanged?.call(value);
          // ← ADD THIS: Load Managed By list
          if (_shouldShowLevel(LocationLevel.managedBy)) {
            provider.getAllManagedByListByDeDesignationId(context, value);
          }
        }
      } : null,
      hint: isLoading ? 'Loading designations...' : (_selectedDepartmentId == null ? 'Select Department first' : 'Choose Designation'),
      label: 'Designation',
      isReadOnly: !isEnabled,
      validator: widget.enableValidation
          ? (widget.designationValidator ?? (value) => value == null ? 'Please select a designation' : null)
          : null,
    );
  }

  Widget _buildManagedByDropdown(AdminLocationApiProvider provider) {
    // CORRECT PATH: response.data.users (NOT data.data.users)
    final List<Users> managedList = _selectedDesignationId != null
        ? (provider.getAllManagedByListByDesignationModelResponse?.data?.data?.users ?? <Users>[])
        : <Users>[];

    // Use your actual loading flag — replace with correct one if different
    final bool isApiLoading = provider.isLoading; // or make a public bool isManagedByLoading

    final bool isLoading = _selectedDesignationId != null &&
        managedList.isEmpty &&
        isApiLoading;

    // Validate selected value still exists
    String? validatedValue = _selectedManagedById;
    if (validatedValue != null && managedList.isNotEmpty) {
      final bool exists = managedList.any((user) => user.sId == validatedValue);
      if (!exists) {
        validatedValue = null;
        _selectedManagedById = null;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) setState(() {});
        });
      }
    }

    final bool isEnabled = _selectedDesignationId != null && !widget.readOnly && !isLoading;

    return ResponsiveDropdown<String>(
      key: ValueKey('managedBy_${_selectedDesignationId}_${managedList.length}'),
      value: validatedValue,
      // FIX: Explicitly cast/map to List<String>
      itemList: managedList.map((user) => user.sId!).toList().cast<String>(),
      // OR safer: .whereType<String>().toList() if sId could be null
      // itemList: managedList.map((user) => user.sId ?? '').where((id) => id.isNotEmpty).toList(),

      itemDisplayBuilder: (String id) {
        try {
          final user = managedList.firstWhere((u) => u.sId == id);
          return user.name ?? 'Unknown User';
        } catch (e) {
          return 'N/A';
        }
      },

      onChanged: widget.readOnly
          ? null
          : (String? value) {
        setState(() {
          _selectedManagedById = value;
        });
      },

      hint: isLoading
          ? 'Loading Managed By...'
          : (_selectedDesignationId == null
          ? 'Select Designation first'
          : 'Choose Managed By'),

      label: 'Managed By',
      isReadOnly: !isEnabled,
      validator: widget.enableValidation
          ? (value) => value == null ? 'Please select Managed By' : null
          : null,
    );
  }




}