import 'package:dss_crm/tech_module/tech_manager/model/network_infrastructure/tech_all_devices_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/network_infrastructure/add_new_device_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/network_infrastructure/update_device_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../controller/tech_manager_api_provider.dart';

class TechDevicesListScreen extends StatefulWidget {
  const TechDevicesListScreen({Key? key}) : super(key: key);

  @override
  State<TechDevicesListScreen> createState() => _TechDevicesListScreenState();
}

class _TechDevicesListScreenState extends State<TechDevicesListScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  int _currentPage = 1;
  final int _limit = 3;
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
    provider.getAllTechDeviceList(context, _currentPage, _limit).then((_) {
      if (provider.getAllTechDeviceListModelResponse?.success == true) {
        setState(() {
          if (_currentPage == 1) {
            _allDevices = provider.getAllTechDeviceListModelResponse!.data?.data ?? [];
          } else {
            _allDevices.addAll(provider.getAllTechDeviceListModelResponse!.data?.data ?? []);
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
    final response = provider.getAllTechDeviceListModelResponse;

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
        return (device.deviceId?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.deviceType?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.vendor?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.installedLocation?.toLowerCase().contains(_searchQuery) ?? false);
      }).toList();
    }
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
        builder: (context) => UpdateDeviceScreen(
          productData: device,
          onDeviceUpdated: _refreshDevices, // Pass refresh function as callback
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
            'Are you sure you want to delete device "${device.deviceId}"? This action cannot be undone.',
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
    provider.deleteTechDeviceWithoutNavigation(context, device.sId ?? '').then((_) {
      if (provider.deleteTechDeviceModelResponse?.success == true) {
        _refreshDevices();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Device "${device.deviceId}" deleted successfully'),
            backgroundColor: Colors.green,
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
      case 'server':
        return Colors.blue;
      case 'router':
        return Colors.green;
      case 'switch':
        return Colors.orange;
      case 'firewall':
        return Colors.red;
      case 'printer':
        return Colors.purple;
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
          'Network Devices',
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
            // onPressed: _loadAssets,
            icon: const Icon(Icons.refresh_rounded),
            style: IconButton.styleFrom(
              // backgroundColor: Colors.grey[100],
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => AddNewDeviceScreen()),
              ).then((_) {
                // Refresh the list when returning from add screen
                _refreshDevices();
                // _loadAssets();
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
                  hintText: 'Search devices...',
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
                          'Loading devices...',
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
                          _searchQuery.isNotEmpty ? 'No devices found' : 'No devices available',
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
                    color: _getDeviceTypeColor(device.deviceType).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    _getDeviceIcon(device.deviceType),
                    color: _getDeviceTypeColor(device.deviceType),
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
                        device.deviceId ?? 'Unknown Device',
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
                          color: _getDeviceTypeColor(device.deviceType).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          device.deviceType ?? 'Unknown',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _getDeviceTypeColor(device.deviceType),
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
                _buildInfoRow(Icons.language, 'IP Address', device.ipAddress ?? 'N/A'),
                _buildInfoRow(Icons.network_wifi, 'MAC Address', device.macAddress ?? 'N/A'),
                _buildInfoRow(Icons.business, 'Vendor', device.vendor ?? 'N/A'),
                _buildInfoRow(Icons.location_on, 'Location', device.installedLocation ?? 'N/A'),
                if (device.nextServiceDue != null)
                  _buildInfoRow(
                    Icons.schedule,
                    'Next Service',
                    _formatDate(device.nextServiceDue),
                    color: _isServiceDue(device.nextServiceDue) ? Colors.red : Colors.grey[600],
                  ),
              ],
            ),
          ),

          const SizedBox(height: 20),
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
            child: Text(
              value,
              style: TextStyle(
                fontSize: 14,
                color: color ?? Colors.black87,
                fontWeight: FontWeight.w600,
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