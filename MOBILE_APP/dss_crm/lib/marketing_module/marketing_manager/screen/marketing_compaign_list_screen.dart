import 'dart:ui';
import 'package:dss_crm/marketing_module/marketing_manager/marketing_get_all_compaign_list_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/controller/marketing_manager_api_provider.dart';
import 'package:dss_crm/marketing_module/marketing_manager/screen/add_new_campaign_screen.dart';
import 'package:dss_crm/marketing_module/marketing_manager/screen/update_campaign_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/date_formate_util.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../ui_helper/app_text_styles.dart';
import 'package:intl/intl.dart';

class MarketingCampaignListScreen extends StatefulWidget {
  const MarketingCampaignListScreen({Key? key}) : super(key: key);

  @override
  State<MarketingCampaignListScreen> createState() => _MarketingCampaignListScreenState();
}

class _MarketingCampaignListScreenState extends State<MarketingCampaignListScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  List<Campaigns> _campaigns = [];
  List<Campaigns> _filteredCampaigns = [];

  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _hasReachedEnd = false;
  String _searchQuery = '';

  int _currentPage = 1;
  final int _itemsPerPage = 10;
  int _totalPages = 0;
  int _totalCampaigns = 0;
  String? selectedStatus;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadCampaigns(isInitial: true);
    });
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 20 &&
        !_isLoadingMore &&
        !_hasReachedEnd &&
        _searchQuery.isEmpty) {
      _loadMoreCampaigns();
    }
  }

  Future<void> loadCampaigns({bool isInitial = false}) async {
    final provider = Provider.of<MarketingManagerApiProvider>(
      context,
      listen: false,
    );

    if (isInitial) {
      setState(() {
        _isLoading = true;
        _currentPage = 1;
        _hasReachedEnd = false;
        _campaigns.clear();
        _filteredCampaigns.clear();
      });
    }

    try {
      await provider.getAllMarketingCompaignList(
        context,
        _currentPage,
        _itemsPerPage,
      );

      final response = provider.getAllCompaignListModelResponse;

      if (response != null && response.success && response.data != null) {
        final newCampaigns = response.data!.campaigns ?? [];
        final totalPages = response.data!.totalPages ?? 0;
        final totalCount = response.data!.totalCampaigns ?? 0;

        setState(() {
          if (isInitial) {
            _campaigns = newCampaigns;
          } else {
            _campaigns.addAll(newCampaigns);
          }

          _totalPages = totalPages;
          _totalCampaigns = totalCount;
          _hasReachedEnd = _currentPage >= _totalPages || newCampaigns.isEmpty;
          _applyFilters();
          _isLoading = false;
          _isLoadingMore = false;
        });
      } else {
        setState(() {
          if (isInitial) {
            _campaigns = [];
            _filteredCampaigns = [];
          }
          _isLoading = false;
          _isLoadingMore = false;
          _hasReachedEnd = true;
        });
      }
    } catch (e) {
      setState(() {
        if (isInitial) {
          _campaigns = [];
          _filteredCampaigns = [];
        }
        _isLoading = false;
        _isLoadingMore = false;
        _hasReachedEnd = true;
      });
      _showErrorSnackBar('Failed to load campaigns: $e');
    }
  }

  Future<void> _loadMoreCampaigns() async {
    if (_isLoadingMore || _hasReachedEnd) return;

    setState(() {
      _isLoadingMore = true;
      _currentPage++;
    });

    await loadCampaigns();
  }

  Future<void> refreshCampaigns() async {
    await loadCampaigns(isInitial: true);
  }

  void _applyFilters() {
    setState(() {
      List<Campaigns> filteredList = List.from(_campaigns);

      // Apply search filter
      if (_searchQuery.isNotEmpty) {
        filteredList = filteredList.where((campaign) {
          final searchLower = _searchQuery.toLowerCase();
          return (campaign.campaignName?.toLowerCase().contains(searchLower) ??
              false) ||
              (campaign.campaignId?.toLowerCase().contains(searchLower) ??
                  false) ||
              (campaign.type?.toLowerCase().contains(searchLower) ?? false) ||
              (campaign.platform?.toLowerCase().contains(searchLower) ??
                  false) ||
              (campaign.status?.toLowerCase().contains(searchLower) ?? false) ||
              (campaign.objective?.toLowerCase().contains(searchLower) ??
                  false);
        }).toList();
      }

      _filteredCampaigns = filteredList;
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

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
  void _performDelete(Campaigns campaign){
    final provider = Provider.of<MarketingManagerApiProvider>(context, listen: false);
    provider.deleteCampaign(context, campaign.sId ?? '').then((_) async {
      if (provider.deleteCampaignModelResponse?.success == true) {
       await refreshCampaigns();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Device "${campaign.campaignId}" deleted successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    });
  }

  void _showDeleteConfirmation(Campaigns campaign) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.whiteColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.delete_outline, color: Colors.red),
            ),
            const SizedBox(width: 12),
            const Text('Delete Campaign'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Are you sure you want to delete this campaign?'),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    campaign.campaignName ?? 'N/A',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'ID: ${campaign.campaignId ?? 'N/A'}',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.of(context).pop();
              _performDelete(campaign);

            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _showStatusUpdateDialog(Campaigns campaign) {
     selectedStatus = campaign.status;
     bool isUpdating = false;
     final List<String> statusOptions = [
      'Running',
      'Paused',
      'Scheduled',
      'Completed',
      'Failed',
      'Cancelled'
    ];

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          elevation: 0,
          backgroundColor: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header with icon
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.blue.shade400,
                            Colors.blue.shade600,
                          ],
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.blue.withOpacity(0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child:  Icon(
                        Icons.sync_alt_rounded,
                        color: Colors.white,
                        size: ResponsiveHelper.iconSize(context, 16)
                      ),
                    ),
                    const SizedBox(width: 16),
                     Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "${campaign.campaignName ?? 'N/A'}",
                            style:AppTextStyles.heading2(
                              context,
                              overrideStyle: TextStyle(
                                fontSize: ResponsiveHelper.fontSize(context, 14),
                              ),
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            "ID: ${campaign.campaignName ?? 'N/A'}",
                            style:AppTextStyles.body1(
                              context,
                              overrideStyle: TextStyle(
                                fontSize: ResponsiveHelper.fontSize(context, 12),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Status Selection Label
                Row(
                  children: [
                    Container(
                      width: 4,
                      height: 20,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.blue.shade400,
                            Colors.blue.shade600,
                          ],
                        ),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Select New Status',
                      style:AppTextStyles.heading1(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 12),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                // Status Options Grid
                ...statusOptions.map((status) {
                  final isSelected = selectedStatus == status;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: InkWell(
                      onTap: isUpdating ? null : () {
                        setDialogState(() {
                          selectedStatus = status;
                        });
                      },
                      borderRadius: BorderRadius.circular(12),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? Colors.blue.withOpacity(0.08)
                              : Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected
                                ? Colors.blue
                                : Colors.grey.shade300,
                            width: isSelected ? 2 : 1,
                          ),
                          boxShadow: isSelected
                              ? [
                            BoxShadow(
                              color: Colors.blue.withOpacity(0.1),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ]
                              : [],
                        ),
                        child: Row(
                          children: [
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isSelected
                                      ? Colors.blue
                                      : Colors.grey.shade400,
                                  width: 1,
                                ),
                                color: isSelected ? Colors.blue : Colors.white,
                              ),
                              child: isSelected
                                  ?  Icon(
                                Icons.check,
                                size: ResponsiveHelper.iconSize(context, 12),
                                color: Colors.white,
                              )
                                  : null,
                            ),
                            const SizedBox(width: 12),
                            _buildStatusChip(status),

                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),

                const SizedBox(height: 24),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: isUpdating ? null : () => Navigator.pop(context),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          side: BorderSide(color: Colors.grey.shade300),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Cancel',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.black54,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton.icon(
                        onPressed: isUpdating ? null : () async {
                          if (selectedStatus == null || selectedStatus == campaign.status) {
                            _showErrorSnackBar('Please select a different status');
                            return;
                          }
                          // Set loading state
                          setDialogState(() {
                            isUpdating = true;
                          });
                          try {
                            final provider = Provider.of<MarketingManagerApiProvider>(
                              context,
                              listen: false,
                            );
                            final body = {
                              'status': selectedStatus,
                            };

                            await provider.updateCompaignStatusStatus(
                              context,
                              body,
                              campaign.sId ?? '',
                            );
                            if (provider.updateCompaignStatusModelResponse?.success == true) {
                              // if (mounted) Navigator.pop(context);
                              // Show success message
                              // _showSuccessSnackBar('Campaign status updated successfully');
                              await refreshCampaigns();
                            } else {
                              setDialogState(() {
                                isUpdating = false;
                              });
                            }
                          } catch (e) {
                            setDialogState(() {
                              isUpdating = false;
                            });
                            _showErrorSnackBar('Failed to update status: $e');
                          }
                        },
                        icon: isUpdating
                            ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                            : const Icon(Icons.check_circle_outline_rounded),
                        label: Text(
                          isUpdating ? 'Updating...' : 'Update',
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isUpdating ? Colors.grey : Colors.blue.shade600,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          shadowColor: Colors.blue.withOpacity(0.3),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
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
          'Campaign Management',
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
            onPressed: refreshCampaigns,
            icon: const Icon(Icons.refresh_rounded),
          ),
          const SizedBox(width: 8),
          IconButton(
            onPressed: () {
              // Add campaign screen navigation
              Navigator.push(context, MaterialPageRoute(builder: (_) => AddNewCampaignFormScreen()))
                .then((_) => refreshCampaigns());
            },
            icon: const Icon(Icons.add_rounded),
            style: IconButton.styleFrom(foregroundColor: Colors.white),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          _buildResultsHeader(),
          Expanded(
            child: _isLoading ? _buildLoadingWidget() : _buildCampaignsList(),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(20),
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
            hintText: 'Search campaigns by name, ID, type...',
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
    );
  }

  Widget _buildResultsHeader() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'Showing ${_filteredCampaigns.length} of $_totalCampaigns campaigns',
              style: TextStyle(
                color: Colors.grey[700],
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const Spacer(),
          if (_searchQuery.isNotEmpty)
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
                  });
                  _applyFilters();
                },
                icon: const Icon(Icons.clear_rounded, size: 16),
                label: const Text('Clear'),
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
            'Loading campaigns...',
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

  Widget _buildCampaignsList() {
    if (_filteredCampaigns.isEmpty) {
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
                    Icons.campaign_outlined,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                ),
                const SizedBox(height: 15),
                Text(
                  'No campaigns found',
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
                      : 'Start by creating your first campaign',
                  style: TextStyle(color: Colors.grey[600], fontSize: 16),
                  textAlign: TextAlign.center,
                ),
                if (_searchQuery.isEmpty) ...[
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () {
                      // Add campaign navigation
                    },
                    icon: const Icon(Icons.add_rounded),
                    label: const Text('Create Campaign'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: refreshCampaigns,
      child: ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.all(20),
        itemCount: _filteredCampaigns.length + (_hasReachedEnd ? 0 : 1),
        itemBuilder: (context, index) {
          if (index == _filteredCampaigns.length) {
            return _buildLoaderWidget();
          }

          final campaign = _filteredCampaigns[index];
          return _buildCampaignCard(campaign);
        },
      ),
    );
  }

  Widget _buildCampaignCard(Campaigns campaign) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
      child: InkWell(
        onTap: () => _showCampaignDetails(campaign),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          campaign.campaignName ?? 'N/A',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          campaign.campaignId ?? 'N/A',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Edit and Delete Icons instead of Status Chip
                  Row(
                    children: [
                      IconButton(
                        onPressed: () async{
                          final result = await Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => UpdateCampaignFormScreen(campaign: campaign)
                            ),
                          );
                          if (result == true) {
                            refreshCampaigns();
                          }
                        },
                        icon: const Icon(Icons.edit_outlined),
                        color: Colors.blue,
                        iconSize: 20,
                        constraints: const BoxConstraints(),
                        padding: const EdgeInsets.all(8),
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.blue.withOpacity(0.1),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        onPressed: () => _showDeleteConfirmation(campaign),
                        icon: const Icon(Icons.delete_outline),
                        color: Colors.red,
                        iconSize: 20,
                        constraints: const BoxConstraints(),
                        padding: const EdgeInsets.all(8),
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.red.withOpacity(0.1),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ],
                  ),
                  // _buildStatusChip(campaign.status ?? 'N/A'),
                ],
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _buildInfoChip(
                    Icons.category_outlined,
                    campaign.type ?? 'N/A',
                    Colors.blue,
                  ),
                  _buildInfoChip(
                    Icons.devices_outlined,
                    campaign.platform ?? 'N/A',
                    Colors.purple,
                  ),
                  _buildInfoChip(
                    Icons.currency_rupee,
                    '${campaign.budget ?? 0}',
                    Colors.green,
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(
                    Icons.calendar_month_outlined,
                    size: 14,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(width: 4),
                  Text(
                    DateFormatterUtils.formatToShortMonth(campaign.startDate),
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                  const SizedBox(width: 8),
                  Icon(Icons.arrow_forward, size: 14, color: Colors.grey[600]),
                  const SizedBox(width: 8),
                  Text(
                    DateFormatterUtils.formatToShortMonth(campaign.endDate),
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                  Spacer(),
                  _buildStatusChip(campaign.status ?? 'N/A',vertical: 0),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status, {double? vertical , double? horizontal}) {
    Color color;
    switch (status.toLowerCase()) {
      case 'active':
        color = Colors.green;
        break;
      case 'paused':
        color = Colors.orange;
        break;
      case 'completed':
        color = Colors.blue;
        break;
      case 'draft':
        color = Colors.grey;
        break;
      case 'cancelled':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding:  EdgeInsets.symmetric(horizontal: horizontal ?? 12, vertical: vertical ?? 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        status,
        style:AppTextStyles.body1(
          context,
          overrideStyle: TextStyle(
            color: color,
            fontSize: ResponsiveHelper.fontSize(context, 12),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: color,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoaderWidget() {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Center(child: LoadingIndicatorUtils(color: AppColors.orangeColor)),
    );
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd MMM yyyy').format(date);
    } catch (e) {
      return dateString;
    }
  }

  void _showCampaignDetails(Campaigns campaign) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (_, controller) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              // Handle bar
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),

              Expanded(
                child: SingleChildScrollView(
                  controller: controller,
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header Section
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  campaign.campaignName ?? 'N/A',
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'ID: ${campaign.campaignId ?? 'N/A'}',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          _buildStatusChip(campaign.status ?? 'N/A'),
                        ],
                      ),

                      const SizedBox(height: 24),
                      const Divider(),
                      const SizedBox(height: 16),

                      // Basic Info Section
                      _buildSectionTitle('Campaign Details'),
                      const SizedBox(height: 12),
                      _buildInfoRow(
                        Icons.category_outlined,
                        'Type',
                        campaign.type ?? 'N/A',
                        Colors.blue,
                      ),
                      _buildInfoRow(
                        Icons.devices_outlined,
                        'Platform',
                        campaign.platform ?? 'N/A',
                        Colors.purple,
                      ),
                      _buildInfoRow(
                        Icons.flag_outlined,
                        'Objective',
                        campaign.objective ?? 'N/A',
                        Colors.orange,
                      ),
                      _buildInfoRow(
                        Icons.currency_rupee,
                        'Budget',
                        '₹${campaign.budget ?? 0}',
                        Colors.green,
                      ),
                      _buildInfoRow(
                        Icons.link_outlined,
                        'Landing Page',
                        campaign.landingPage ?? 'N/A',
                        Colors.teal,
                        isLink: true,
                      ),

                      const SizedBox(height: 20),
                      const Divider(),
                      const SizedBox(height: 16),

                      // Duration Section
                      _buildSectionTitle('Campaign Duration'),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.blue.withOpacity(0.1),
                          ),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.play_circle_outline,
                                        size: 16,
                                        color: Colors.green[700],
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Start Date',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey[600],
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    DateFormatterUtils.formatToShortMonth(
                                      campaign.startDate,
                                    ),
                                    style: const TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              height: 40,
                              width: 1,
                              color: Colors.grey[300],
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.stop_circle_outlined,
                                        size: 16,
                                        color: Colors.red[700],
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'End Date',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey[600],
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    DateFormatterUtils.formatToShortMonth(
                                      campaign.endDate,
                                    ),
                                    style: const TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Target Audience Section
                      if (campaign.targetAudience != null) ...[
                        const SizedBox(height: 20),
                        const Divider(),
                        const SizedBox(height: 16),
                        _buildSectionTitle('Target Audience'),
                        const SizedBox(height: 12),
                        _buildInfoRow(
                          Icons.location_on_outlined,
                          'Region',
                          campaign.targetAudience!.region ?? 'N/A',
                          Colors.red,
                        ),
                        _buildInfoRow(
                          Icons.people_outline,
                          'Demographics',
                          "${campaign.targetAudience!.demographics ?? 'N/A'} year",
                          Colors.indigo,
                        ),
                        if (campaign.targetAudience!.interests != null &&
                            campaign.targetAudience!.interests!.isNotEmpty) ...[
                          const SizedBox(height: 12),
                          Text(
                            'Interests',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey[600],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: campaign.targetAudience!.interests!
                                .map(
                                  (interest) => Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.purple.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: Colors.purple.withOpacity(0.3),
                                  ),
                                ),
                                child: Text(
                                  interest,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.purple[700],
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            )
                                .toList(),
                          ),
                        ],
                      ],

                      // Created By Section
                      if (campaign.createdBy != null) ...[
                        const SizedBox(height: 20),
                        const Divider(),
                        const SizedBox(height: 16),
                        _buildSectionTitle('Created By'),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.grey[50],
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.grey[200]!),
                          ),
                          child: Row(
                            children: [
                              CircleAvatar(
                                backgroundColor: Colors.blue,
                                child: Text(
                                  (campaign.createdBy!.name ?? 'U')
                                      .substring(0, 1)
                                      .toUpperCase(),
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      campaign.createdBy!.name ?? 'N/A',
                                      style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.black87,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      campaign.createdBy!.role ?? 'N/A',
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],

                      // Status History Section
                      if (campaign.statusHistory != null &&
                          campaign.statusHistory!.isNotEmpty) ...[
                        const SizedBox(height: 20),
                        const Divider(),
                        const SizedBox(height: 16),
                        _buildSectionTitle('Status History'),
                        const SizedBox(height: 12),
                        ...campaign.statusHistory!.map((history) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.grey[50],
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.grey[200]!),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    _buildStatusChip(history.status ?? 'N/A'),
                                    const Spacer(),
                                    Text(
                                      _formatDateTime(history.updatedAt),
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                                if (history.updatedBy != null) ...[
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.person_outline,
                                        size: 14,
                                        color: Colors.grey[600],
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Updated by: ${history.updatedBy!.name ?? 'N/A'}',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ],
                            ),
                          );
                        }).toList(),
                      ],

                      // Timestamps Section
                      const SizedBox(height: 20),
                      const Divider(),
                      const SizedBox(height: 16),
                      _buildSectionTitle('Timestamps'),
                      const SizedBox(height: 12),
                      _buildInfoRow(
                        Icons.access_time,
                        'Created At',
                        DateFormatterUtils.formatUtcToReadable(campaign.createdAt),
                        Colors.blue,
                      ),
                      _buildInfoRow(
                        Icons.update,
                        'Updated At',
                        DateFormatterUtils.formatUtcToReadable(campaign.updatedAt),
                        Colors.green,
                      ),

                      const SizedBox(height: 80), // Space for button
                    ],
                  ),
                ),
              ),

              // Status Update Button at Bottom
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, -2),
                    ),
                  ],
                ),
                child: SafeArea(
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed:campaign.status == 'Completed' ? null :  () {
                        Navigator.pop(context);
                        _showStatusUpdateDialog(campaign);
                      },
                      icon: const Icon(Icons.update_rounded),
                      label: const Text('Update Status'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Colors.black87,
      ),
    );
  }

  Widget _buildInfoRow(
      IconData icon,
      String label,
      String value,
      MaterialColor green, {
        Color color = Colors.blue,
        bool isLink = false,
      }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 18, color: color),
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
                const SizedBox(height: 2),
                isLink
                    ? InkWell(
                  onTap: () async {
                    try {
                      final Uri url = Uri.parse(value);
                      if (!await launchUrl(
                        url,
                        mode: LaunchMode.externalApplication,
                      )) {
                        throw Exception('Could not launch $url');
                      }
                    } catch (e) {
                      // Show error snackbar
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Could not open link: $e'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  },
                  child: Text(
                    value,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.blue,
                    ),
                  ),
                )
                    : Text(
                  value,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDateTime(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd MMM yyyy, hh:mm a').format(date);
    } catch (e) {
      return dateString;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
}