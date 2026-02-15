import 'package:dss_crm/tech_module/tech_manager/model/vendor_amc_management/tech_vendor_amc_list_model.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/vendor_amc_management/add_new_vendor_amc_screen.dart';
import 'package:dss_crm/tech_module/tech_manager/screen/vendor_amc_management/update_vendor_amc_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/responsive_helper_utils.dart';
import '../../controller/tech_manager_api_provider.dart';

class TechVendorAMCListScreen extends StatefulWidget {
  const TechVendorAMCListScreen({Key? key}) : super(key: key);

  @override
  State<TechVendorAMCListScreen> createState() => _TechVendorAMCListScreenState();
}

class _TechVendorAMCListScreenState extends State<TechVendorAMCListScreen>
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
    provider.getAllTechAMCList(context, _currentPage, _limit).then((_) {
      if (provider.getAllTechVendorAMCListModelResponse?.success == true) {
        setState(() {
          if (_currentPage == 1) {
            _allDevices = provider.getAllTechVendorAMCListModelResponse!.data?.data ?? [];
          } else {
            _allDevices.addAll(provider.getAllTechVendorAMCListModelResponse!.data?.data ?? []);
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
    final response = provider.getAllTechVendorAMCListModelResponse;

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
        return (device.vendorId?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.contactEmail?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.contactPhone?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.companyName?.toLowerCase().contains(_searchQuery) ?? false) ||
            (device.services?.toLowerCase().contains(_searchQuery) ?? false);
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
        builder: (context) => UpdateAMCScreen(
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
            'Are you sure you want to delete device "${device.vendorId}"? This action cannot be undone.',
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
    provider.deleteTechVendorAMCWithoutNavigation(context, device.sId ?? '').then((_) {
      if (provider.deleteTechVendorAMCModelResponse?.success == true) {
        _refreshDevices();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Device "${device.vendorId}" deleted successfully'),
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
      case 'amc':
        return Colors.blue;
      case 'network':
        return Colors.green;
      case 'server':
        return Colors.orange;
      case 'cloud':
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
          'AMC Management',
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
                MaterialPageRoute(builder: (_) => AddNewAMCScreen()),
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
                          _searchQuery.isNotEmpty ? 'No Data found' : 'No Data available',
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
                              : 'Add your first Data to get started',
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
            color: Colors.black.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header Section
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _getDeviceTypeColor(device.vendorId).withOpacity(0.05),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                // Device Icon
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _getDeviceTypeColor(device.services),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    _getDeviceIcon(device.vendorId),
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),

                // Device Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        device.vendorId ?? 'Unknown Device',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                        overflow: TextOverflow.ellipsis,
                        maxLines: 1,
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 1),
                        decoration: BoxDecoration(
                          color: _getDeviceTypeColor(device.services),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          device.services ?? 'Unknown',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                        ),
                      ),
                    ],
                  ),
                ),

                // Action Buttons
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: IconButton(
                        onPressed: () => _editDevice(device),
                        icon: const Icon(Icons.edit_outlined, size: 20),
                        style: IconButton.styleFrom(
                          foregroundColor: Colors.blue,
                          minimumSize: const Size(36, 36),
                        ),
                        tooltip: 'Edit',
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: IconButton(
                        onPressed: () => _deleteDevice(device),
                        icon: const Icon(Icons.delete_outline, size: 20),
                        style: IconButton.styleFrom(
                          foregroundColor: Colors.red,
                          minimumSize: const Size(36, 36),
                        ),
                        tooltip: 'Delete',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Content Section
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Company and Contact Info
                Row(
                  children: [
                    Expanded(
                      child: _buildInfoTile(
                        Icons.phone,
                        'Phone',
                        device.contactPhone ?? 'N/A',
                        Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildInfoTile(
                        Icons.person,
                        'Contact',
                        device.contactName ?? 'N/A',
                        Colors.green,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Contact Details
                _buildContactRow(Icons.business, device.companyName ?? 'N/A'),
                const SizedBox(height: 8),
                _buildContactRow(Icons.email, device.contactEmail ?? 'N/A'),

                // Contract Period
                if (device.contractStart != null || device.contractEnd != null) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.orange.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.orange.withOpacity(0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.schedule, size: 18, color: Colors.orange),
                            const SizedBox(width: 8),
                            const Text(
                              'Contract Period',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: Colors.orange,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Start Date',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Colors.grey[600],
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    _formatDate(device.contractStart),
                                    style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black87,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'End Date',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Colors.grey[600],
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    _formatDate(device.contractEnd),
                                    style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black87,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],

                // Additional Details
                if (device.renewalTerms != null || device.slaCommitments != null) ...[
                  const SizedBox(height: 12),
                  if (device.renewalTerms != null)
                    _buildDetailRow(Icons.refresh, 'Renewal Terms', device.renewalTerms!),
                  if (device.slaCommitments != null) ...[
                    if (device.renewalTerms != null) const SizedBox(height: 8),
                    _buildDetailRow(Icons.verified_user, 'SLA Commitments', device.slaCommitments!),
                  ],
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile(IconData icon, String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    color: color,
                    fontWeight: FontWeight.w600,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              color: Colors.black87,
              fontWeight: FontWeight.w600,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(
              icon,
              size: 16,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black87,
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(
              icon,
              size: 16,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Colors.black87,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
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