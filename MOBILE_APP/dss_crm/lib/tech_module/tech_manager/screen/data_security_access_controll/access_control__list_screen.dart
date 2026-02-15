import 'package:dss_crm/tech_module/tech_manager/model/data_security_access_controll/tech_data_access_control_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/data_security_access_controll/add_new_access_control_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/data_security_access_controll/update_access_control_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/full_screen_loader_utiil.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../controller/tech_manager_api_provider.dart';

class AccessControlListScreen extends StatefulWidget {
  const AccessControlListScreen({Key? key}) : super(key: key);

  @override
  State<AccessControlListScreen> createState() => _AccessControlListScreenState();
}

class _AccessControlListScreenState extends State<AccessControlListScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  int _currentPage = 1;
  final int _limit = 4;
  List<Data> _filteredDevices = [];
  List<Data> _allDevices = [];
  String _searchQuery = '';
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _scrollController.addListener(_onScroll);
    _searchController.addListener(_onSearchChanged);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadDevices();
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _loadDevices() {
    final provider = Provider.of<TechManagerApiProvider>(context, listen: false);
    provider.getAllTechAccessControlList(context, _currentPage, _limit).then((_) {
      if (provider.getAllTechAccessControlListModelResponse?.success == true) {
        setState(() {
          if (_currentPage == 1) {
            _allDevices = provider.getAllTechAccessControlListModelResponse!.data?.data ?? [];
          } else {
            _allDevices.addAll(provider.getAllTechAccessControlListModelResponse!.data?.data ?? []);
          }
          _applySearch();
        });
        _animationController.forward();
      }
      _isLoadingMore = false;
    });
  }

  void _onScroll() {
    if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
      _loadMoreDevices();
    }
  }

  void _loadMoreDevices() {
    final provider = Provider.of<TechManagerApiProvider>(context, listen: false);
    final response = provider.getAllTechAccessControlListModelResponse;

    if (!_isLoadingMore && response != null && _currentPage < (response.data?.total ?? 0)) {
      setState(() {
        _isLoadingMore = true;
        _currentPage++;
      });
      _loadDevices();
    }
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text.toLowerCase();
      _applySearch();
    });
  }

  void _applySearch() {
    if (_searchQuery.isEmpty) {
      _filteredDevices = _allDevices;
    } else {
      _filteredDevices = _allDevices.where((device) {
        final systemAccessString = _getSystemAccessString(device.systemAccess);

        return (device.employeeId?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.deviceBinding?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.role?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.accessRevoked?.toLowerCase().contains(_searchQuery) ?? false) ||
            (systemAccessString.toLowerCase().contains(_searchQuery));
      }).toList();
    }
  }

  String _getSystemAccessString(List<String>? systemAccess) {
    if (systemAccess == null || systemAccess.isEmpty) {
      return 'N/A';
    }
    return systemAccess.join(', ');
  }

  void _refreshDevices() {
    setState(() {
      _currentPage = 1;
      _allDevices.clear();
      _filteredDevices.clear();
    });
    _loadDevices();
  }

  void _editDevice(Data device) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => UpdateAccessControlScreen(
          productData: device,
          onDeviceUpdated: _refreshDevices,
        ),
      ),
    );
  }

  void _deleteDevice(Data device) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Colors.orange, size: 28),
              const SizedBox(width: 12),
              const Text('Confirm Delete'),
            ],
          ),
          content: Text(
            'Are you sure you want to delete device "${device.employeeId}"? This action cannot be undone.',
            style: const TextStyle(fontSize: 16),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _performDelete(device);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }

  void _performDelete(Data device) {
    final provider = Provider.of<TechManagerApiProvider>(context, listen: false);
    provider.deleteTechAccessControlWithoutNavigation(context, device.sId ?? '').then((_) {
      if (provider.deleteTechAccessControlModelResponse?.success == true) {
        _refreshDevices();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Device "${device.employeeId}" deleted successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    });
  }

  // New method to handle Active/Inactive toggle
  void _toggleActiveStatus(Data device) {
    bool isActive = device.accessRevoked == null || device.accessRevoked!.isEmpty;

    if (isActive) {
      // Show date picker for deactivation
      _showDatePickerDialog(device, false);
    } else {
      // Directly activate (set accessRevoked to null)
      _updateAccessStatus(device, null);
    }
  }

  // Show date picker dialog
  void _showDatePickerDialog(Data device, bool isActivating) {
    DateTime selectedDate = DateTime.now();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      Icons.event,
                      color: Colors.red,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Select Revoke Date',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
              content: Container(
                width: double.maxFinite,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey[50],
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey[300]!),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.calendar_today, color: Colors.grey[600], size: 20),
                          const SizedBox(width: 12),
                          Text(
                            'Selected Date: ${DateFormat('dd-MM-yyyy').format(selectedDate)}',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.maxFinite,
                      child: ElevatedButton.icon(
                        onPressed: () async {
                          final DateTime? picked = await showDatePicker(
                            context: context,
                            initialDate: selectedDate,
                            firstDate: DateTime(2020),
                            lastDate: DateTime(2030),
                            builder: (context, child) {
                              return Theme(
                                data: Theme.of(context).copyWith(
                                  colorScheme: ColorScheme.light(
                                    primary: Colors.red,
                                    onPrimary: Colors.white,
                                    surface: Colors.white,
                                    onSurface: Colors.black,
                                  ),
                                ),
                                child: child!,
                              );
                            },
                          );
                          if (picked != null) {
                            setDialogState(() {
                              selectedDate = picked;
                            });
                          }
                        },
                        icon: Icon(Icons.calendar_month,color: AppColors.primary,),
                        label: Text('Change Date',style: AppTextStyles.body1(
                          context,
                          overrideStyle: TextStyle(
                            fontSize: ResponsiveHelper.fontSize(context, 12),
                            color: AppColors.primary
                          ),
                        ),),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.grey[600],
                  ),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    // Format date as yyyy-MM-dd for API
                    String formattedDate = DateFormat('yyyy-MM-dd').format(selectedDate);
                    _updateAccessStatus(device, formattedDate);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text('Revoke Access'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Method to call API for updating access status
  void _updateAccessStatus(Data device, String? revokeDate) {
    final provider = Provider.of<TechManagerApiProvider>(context, listen: false);

    // Show loading indicator
  FullScreenLoader();


    final body = {
      "accessRevoked": revokeDate,
    };

    // TODO: Replace 'yourApiMethodName' with the actual API method name
    provider.revokedTechAccessControl(context,body, device.sId.toString()).then((_) {
      // Navigator.of(context).pop(); // Close loading dialog

      if (provider.revokedTechAccessControlModelResponse?.success == true) {
        _refreshDevices();
        // ScaffoldMessenger.of(context).showSnackBar(
        //   SnackBar(
        //     content: Text(
        //       revokeDate == null
        //         ? 'Access activated successfully'
        //         : 'Access revoked successfully'
        //     ),
        //     backgroundColor: Colors.green,
        //   ),
        // );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update access status'),
            backgroundColor: Colors.red,
          ),
        );
      }
    });
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('MMM dd, yyyy').format(date);
    } catch (e) {
      return 'N/A';
    }
  }

  Color _getDeviceTypeColor(String? deviceType) {
    switch (deviceType?.toLowerCase()) {
      case 'admin':
        return Colors.blue;
      case 'editor':
        return Colors.orange;
      case 'viewer':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        iconTheme: const IconThemeData(color: Colors.white),
        backgroundColor: AppColors.primary,
        title: Text(
          'Access control',
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
            onPressed: _refreshDevices,
            icon: const Icon(Icons.refresh_rounded),
            style: IconButton.styleFrom(),
          ),
          const SizedBox(width: 8),
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => TechManagerAddNewAccessControlScreen()),
              ).then((_) {
                _refreshDevices();
              });
            },
            icon: const Icon(Icons.add_rounded),
            style: IconButton.styleFrom(foregroundColor: Colors.white),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search...',
                  prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                    onPressed: () {
                      _searchController.clear();
                    },
                    icon: Icon(Icons.clear, color: Colors.grey[600]),
                  )
                      : null,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
              ),
            ),
          ),

          // Content
          Expanded(
            child: Consumer<TechManagerApiProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading && _allDevices.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(strokeWidth: 3),
                        SizedBox(height: 16),
                        Text(
                          'Loading data...',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  );
                }

                if (_filteredDevices.isEmpty && !provider.isLoading) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.devices_other_rounded,
                          size: 80,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _searchQuery.isNotEmpty ? 'No data found' : 'No data available',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _searchQuery.isNotEmpty
                              ? 'Try adjusting your search terms'
                              : 'Add your first device to get started',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  );
                }

                return FadeTransition(
                  opacity: _fadeAnimation,
                  child: RefreshIndicator(
                    onRefresh: () async => _refreshDevices(),
                    child: ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: _filteredDevices.length + (_isLoadingMore ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == _filteredDevices.length) {
                          return const Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Center(
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          );
                        }

                        final device = _filteredDevices[index];
                        return TweenAnimationBuilder(
                          tween: Tween<double>(begin: 0, end: 1),
                          duration: Duration(milliseconds: 200 + (index * 50)),
                          builder: (context, double value, child) {
                            return Transform.translate(
                              offset: Offset(0, 20 * (1 - value)),
                              child: Opacity(
                                opacity: value,
                                child: _buildDeviceCard(device, index),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeviceCard(Data device, int index) {
    bool isActive = device.accessRevoked == null || device.accessRevoked!.isEmpty;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                // Device Icon
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _getDeviceTypeColor(device.role).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    _getDeviceIcon(device.role),
                    color: _getDeviceTypeColor(device.role),
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),

                // Device Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        device.role ?? 'Unknown Device',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getDeviceTypeColor(device.role).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          device.role ?? 'Unknown',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _getDeviceTypeColor(device.role),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Action Buttons
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      onPressed: () => _editDevice(device),
                      icon: const Icon(Icons.edit_outlined),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.blue.withOpacity(0.1),
                        foregroundColor: Colors.blue,
                      ),
                      tooltip: 'Edit',
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      onPressed: () => _deleteDevice(device),
                      icon: const Icon(Icons.delete_outline),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.red.withOpacity(0.1),
                        foregroundColor: Colors.red,
                      ),
                      tooltip: 'Delete',
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Details
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                _buildInfoRow(Icons.language, 'Employee Id', device.employeeId ?? 'N/A'),
                _buildInfoRow(
                  Icons.security,
                  'System Access',
                  _getSystemAccessString(device.systemAccess),
                  color: Colors.blue[700],
                ),
                _buildInfoRow(Icons.business, 'Permission', device.role ?? 'N/A'),
                if (device.accessRevoked != null)
                  _buildInfoRow(
                    Icons.schedule,
                    'Access Revoked',
                    _formatDate(device.accessRevoked),
                    color: _isServiceDue(device.accessRevoked) ? Colors.red : Colors.grey[600],
                  ),
              ],
            ),
          ),

          // Active/Inactive Status Button
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () => _toggleActiveStatus(device),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: isActive ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isActive ? Colors.green : Colors.red,
                          width: 1.5,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: isActive ? Colors.green : Colors.red,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            isActive ? 'Active' : 'Inactive',
                            style: TextStyle(
                              color: isActive ? Colors.green : Colors.red,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            isActive ? Icons.toggle_on : Icons.toggle_off,
                            color: isActive ? Colors.green : Colors.red,
                            size: 24,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(
            icon,
            size: 18,
            color: color ?? Colors.grey[600],
          ),
          const SizedBox(width: 12),
          Text(
            '$label:',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Text(
                value,
                style: TextStyle(
                  fontSize: 14,
                  color: color ?? Colors.black87,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  IconData _getDeviceIcon(String? deviceType) {
    switch (deviceType?.toLowerCase()) {
      case 'server':
        return Icons.dns;
      case 'router':
        return Icons.router;
      case 'switch':
        return Icons.hub;
      case 'firewall':
        return Icons.security;
      case 'printer':
        return Icons.print;
      case 'computer':
        return Icons.computer;
      case 'laptop':
        return Icons.laptop;
      default:
        return Icons.devices_other;
    }
  }

  bool _isServiceDue(String? serviceDue) {
    if (serviceDue == null) return false;
    try {
      final serviceDate = DateTime.parse(serviceDue);
      return serviceDate.isBefore(DateTime.now());
    } catch (e) {
      return false;
    }
  }
}