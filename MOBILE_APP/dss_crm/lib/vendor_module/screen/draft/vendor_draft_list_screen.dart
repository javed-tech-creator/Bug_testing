import 'package:dss_crm/vendor_module/screen/draft/vendor_create_draft_screen.dart';
import 'package:dss_crm/vendor_module/screen/draft/vendor_single_draft_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:dss_crm/vendor_module/model/drafts/darft_list_model.dart';

import '../../../ui_helper/app_colors.dart';
import '../../controller/vendor_dashboard_api_provider.dart';

class VendorDraftListSceeen extends StatefulWidget {
  const VendorDraftListSceeen({Key? key}) : super(key: key);

  @override
  State<VendorDraftListSceeen> createState() => _VendorDraftListSceeenState();
}

class _VendorDraftListSceeenState extends State<VendorDraftListSceeen> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();
  int currentPage = 1;
  final int limit = 10;
  bool isLoadingMore = false;
  bool hasMoreData = true;
  String searchQuery = '';
  List<Data> allDrafts = [];
  List<Data> filteredDrafts = [];

  // Date filter variables
  DateTime? startDate;
  DateTime? endDate;
  bool isDateFilterApplied = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async{
     await _loadDrafts();
    });
    _scrollController.addListener(_onScroll);
    _searchController.addListener(_onSearchChanged);
  }

  Future<void> _loadDrafts() async {
    final provider = Provider.of<VendorDashboardApiProvider>(context, listen: false);
    // Pass date filters to API in YYYY-MM-DD format
    String? formattedStartDate;
    String? formattedEndDate;

    if (startDate != null) {
      formattedStartDate = DateFormat('yyyy-MM-dd').format(startDate!);
    }
    if (endDate != null) {
      formattedEndDate = DateFormat('yyyy-MM-dd').format(endDate!);
    }

    provider.getVendorDraftList(
      context,
      currentPage,
      limit,
      formattedStartDate ?? '',  // Provide empty string if null
      formattedEndDate ?? '',    // Provide empty string if null
    );
    // Update UI after API call
    final response = provider.getVendorDraftListModelResponse;
    if (response?.success == true && response?.data?.data != null) {
      setState(() {
        if (currentPage == 1) {
          allDrafts = response!.data!.data!;
        } else {
          // For pagination, add new items
          final newDrafts = response!.data!.data!;
          for (var draft in newDrafts) {
            if (!allDrafts.any((existing) => existing.draftId == draft.draftId)) {
              allDrafts.add(draft);
            }
          }
        }
        _filterDrafts();
      });
    } else {
      // API call failed or no data
      if (currentPage > 1) {
        setState(() {
          hasMoreData = false;
        });
      }
    }
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200 &&
        hasMoreData &&
        !isLoadingMore &&
        filteredDrafts.isNotEmpty) {
      _loadMoreDrafts();
    }
  }

  void _loadMoreDrafts() async {
    if (isLoadingMore || !hasMoreData) return;

    setState(() {
      isLoadingMore = true;
    });

    final tempPage = currentPage + 1;
    final provider = Provider.of<VendorDashboardApiProvider>(context, listen: false);

    // Format dates for API in YYYY-MM-DD format
    String? formattedStartDate;
    String? formattedEndDate;

    if (startDate != null) {
      formattedStartDate = DateFormat('yyyy-MM-dd').format(startDate!);
    }
    if (endDate != null) {
      formattedEndDate = DateFormat('yyyy-MM-dd').format(endDate!);
    }
    try {
    await provider.getVendorDraftList(
      context,
      tempPage,
      limit,
      formattedStartDate ?? '',  // Provide empty string if null
      formattedEndDate ?? '',    // Provide empty string if null
    );

    final response = provider.getVendorDraftListModelResponse;

    // Check if API returned data
    if (response?.success == true && response?.data?.data != null && response!.data!.data!.isNotEmpty) {
      // Data is available, increment page
      setState(() {
        currentPage = tempPage;

        // Add new drafts to existing list
        final newDrafts = response.data!.data!;
        for (var draft in newDrafts) {
          if (!allDrafts.any((existing) => existing.draftId == draft.draftId)) {
            allDrafts.add(draft);
          }
        }
        _filterDrafts();
        isLoadingMore = false;
      });
    } else {
      // No more data available - keep old list and show message
      setState(() {
        hasMoreData = false;
        isLoadingMore = false;
      });
    }
    } catch (e) {
      // Handle error
      setState(() {
        hasMoreData = false;
        isLoadingMore = false;
      });
    }
  }

  void _onSearchChanged() {
    setState(() {
      searchQuery = _searchController.text.toLowerCase();
      _filterDrafts();
    });
  }

  void _filterDrafts() {
    if (searchQuery.isEmpty) {
      filteredDrafts = List.from(allDrafts);
    } else {
      filteredDrafts = allDrafts.where((draft) {
        return (draft.customerName?.toLowerCase().contains(searchQuery) ?? false) ||
            (draft.draftId?.toLowerCase().contains(searchQuery) ?? false) ||
            (draft.customerPhone?.contains(searchQuery) ?? false);
      }).toList();
    }
  }

  Future<void> _refreshDrafts() async {
    setState(() {
      currentPage = 1;
      hasMoreData = true;
      isLoadingMore = false;
      allDrafts.clear();
      filteredDrafts.clear();
    });
    await _loadDrafts();
  }

  void _showDateFilterDialog() {
    DateTime? tempStartDate = startDate;
    DateTime? tempEndDate = endDate;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) {
          return AlertDialog(
            backgroundColor: AppColors.whiteColor,
            title: const Text('Filter by Date Range'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Start Date
                ListTile(
                  title: const Text('Start Date'),
                  subtitle: Text(tempStartDate != null
                      ? DateFormat('dd MMM yyyy').format(tempStartDate!)
                      : 'Select start date'),
                  leading: const Icon(Icons.calendar_today),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: tempStartDate ?? DateTime.now().subtract(const Duration(days: 30)),
                      firstDate: DateTime(2020),
                      lastDate: DateTime.now(),
                    );
                    if (date != null) {
                      setDialogState(() {
                        tempStartDate = date;
                      });
                    }
                  },
                ),
                // End Date
                ListTile(
                  title: const Text('End Date'),
                  subtitle: Text(tempEndDate != null
                      ? DateFormat('dd MMM yyyy').format(tempEndDate!)
                      : 'Select end date'),
                  leading: const Icon(Icons.event),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: tempEndDate ?? DateTime.now(),
                      firstDate: tempStartDate ?? DateTime(2020),
                      lastDate: DateTime.now(),
                    );
                    if (date != null) {
                      setDialogState(() {
                        tempEndDate = date;
                      });
                    }
                  },
                ),
                const SizedBox(height: 16),
                // Quick filter buttons
                Wrap(
                  spacing: 8,
                  children: [
                    FilterChip(
                      label: const Text('Today'),
                      onSelected: (selected) {
                        if (selected) {
                          setDialogState(() {
                            tempStartDate = DateTime.now();
                            tempEndDate = DateTime.now();
                          });
                        }
                      },
                    ),
                    FilterChip(
                      label: const Text('Last 7 Days'),
                      onSelected: (selected) {
                        if (selected) {
                          setDialogState(() {
                            tempStartDate = DateTime.now().subtract(const Duration(days: 7));
                            tempEndDate = DateTime.now();
                          });
                        }
                      },
                    ),
                    FilterChip(
                      label: const Text('Last 30 Days'),
                      onSelected: (selected) {
                        if (selected) {
                          setDialogState(() {
                            tempStartDate = DateTime.now().subtract(const Duration(days: 30));
                            tempEndDate = DateTime.now();
                          });
                        }
                      },
                    ),
                  ],
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  setDialogState(() {
                    tempStartDate = null;
                    tempEndDate = null;
                  });
                },
                child: const Text('Clear'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    startDate = tempStartDate;
                    endDate = tempEndDate;
                    isDateFilterApplied = startDate != null || endDate != null;
                  });
                  Navigator.pop(context);
                  _refreshDrafts();
                },
                child: const Text('Apply'),
              ),
            ],
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'Invoice Drafts',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor:AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          // Date Filter Button
          IconButton(
            onPressed: _showDateFilterDialog,
            icon: Stack(
              children: [
                const Icon(Icons.date_range),
                if (isDateFilterApplied)
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
                        minWidth: 8,
                        minHeight: 8,
                      ),
                    ),
                  ),
              ],
            ),
            tooltip: 'Date Filter',
          ),
          IconButton(
            onPressed: _refreshDrafts,
            icon: const Icon(Icons.refresh),
          ),
          PopupMenuButton(
            icon: const Icon(Icons.filter_list),
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'recent',
                child: Text('Sort by Recent'),
              ),
              const PopupMenuItem(
                value: 'amount_high',
                child: Text('Amount: High to Low'),
              ),
              const PopupMenuItem(
                value: 'amount_low',
                child: Text('Amount: Low to High'),
              ),
              const PopupMenuItem(
                value: 'customer',
                child: Text('Sort by Customer'),
              ),
            ],
            onSelected: _sortDrafts,
          ),
        ],
      ),

      body: Column(
        children: [
          // Search Bar
          Container(
            color: AppColors.primary,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search by customer, draft ID, or phone...',
                  hintStyle: TextStyle(color: Colors.grey[500]),
                  prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
                  suffixIcon: searchQuery.isNotEmpty
                      ? IconButton(
                    onPressed: () {
                      _searchController.clear();
                    },
                    icon: Icon(Icons.clear, color: Colors.grey[600]),
                  )
                      : null,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
            ),
          ),

          // Date Filter Indicator
          if (isDateFilterApplied)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.blue[200]!),
              ),
              child: Row(
                children: [
                  Icon(Icons.filter_alt, color: Colors.blue[700], size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Date Filter: ${startDate != null ? DateFormat('dd MMM yyyy').format(startDate!) : 'Any'} - ${endDate != null ? DateFormat('dd MMM yyyy').format(endDate!) : 'Any'}',
                      style: TextStyle(
                        color: Colors.blue[700],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      setState(() {
                        startDate = null;
                        endDate = null;
                        isDateFilterApplied = false;
                      });
                      _refreshDrafts();
                    },
                    icon: Icon(Icons.close, color: Colors.blue[700], size: 20),
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                  ),
                ],
              ),
            ),

          // Stats Row
          Consumer<VendorDashboardApiProvider>(
            builder: (context, provider, child) {
              final response = provider.getVendorDraftListModelResponse;
              final totalDrafts = response?.data?.total ?? 0;
              final currentPageNum = response?.data?.page ?? 1;

              return Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue[50]!, Colors.blue[100]!],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue[200]!),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: _buildStatItem(
                        'Total Drafts',
                        totalDrafts.toString(),
                        Icons.drafts_outlined,
                        Colors.blue,
                      ),
                    ),
                    Container(
                      width: 1,
                      height: 40,
                      color: Colors.blue[300],
                    ),
                    Expanded(
                      child: _buildStatItem(
                        'Current Page',
                        currentPageNum.toString(),
                        Icons.pages_outlined,
                        Colors.green,
                      ),
                    ),
                    Container(
                      width: 1,
                      height: 40,
                      color: Colors.blue[300],
                    ),
                    Expanded(
                      child: _buildStatItem(
                        'Showing',
                        '${(searchQuery.isNotEmpty ? filteredDrafts : allDrafts).length}',
                        Icons.visibility_outlined,
                        Colors.orange,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),

          // Draft List
          Expanded(
            child: Consumer<VendorDashboardApiProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading && currentPage == 1) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(),
                        SizedBox(height: 16),
                        Text(
                          'Loading drafts...',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  );
                }

                final response = provider.getVendorDraftListModelResponse;
                // Show error state only if no data exists and API failed
                if (allDrafts.isEmpty && response != null && !response.success) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 80,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Failed to load drafts',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          response.message ?? 'Something went wrong',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton.icon(
                          onPressed: _refreshDrafts,
                          icon: const Icon(Icons.refresh),
                          label: const Text('Retry'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue[600],
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }

                // Show empty state when no drafts after successful load
                if (allDrafts.isEmpty && !provider.isLoading) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          isDateFilterApplied ? Icons.filter_alt_off : Icons.note_add_outlined,
                          size: 80,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No drafts available',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          isDateFilterApplied
                              ? 'No drafts found in selected date range'
                              : 'Create your first invoice draft',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                        if (isDateFilterApplied) ...[
                          const SizedBox(height: 16),
                          TextButton.icon(
                            onPressed: () {
                              setState(() {
                                startDate = null;
                                endDate = null;
                                isDateFilterApplied = false;
                              });
                              _refreshDrafts();
                            },
                            icon: const Icon(Icons.date_range),
                            label: const Text('Clear Date Filter'),
                          ),
                        ],
                      ],
                    ),
                  );
                }

                // Update all drafts list - only for first page or when new data is available
                // if (currentPage == 1) {
                //   allDrafts = response.data?.data ?? [];
                // } else {
                //   final newDrafts = response.data?.data ?? [];
                //   // Only add new drafts if we actually got data from API
                //   if (newDrafts.isNotEmpty) {
                //     for (var draft in newDrafts) {
                //       if (!allDrafts.any((existing) => existing.draftId == draft.draftId)) {
                //         allDrafts.add(draft);
                //       }
                //     }
                //   }
                // }
                //
                // _filterDrafts();

                if (filteredDrafts.isEmpty && allDrafts.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          searchQuery.isNotEmpty ? Icons.search_off : Icons.note_add_outlined,
                          size: 80,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          searchQuery.isNotEmpty ? 'No drafts found' : 'No drafts available',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          searchQuery.isNotEmpty
                              ? 'Try adjusting your search criteria'
                              : isDateFilterApplied
                              ? 'No drafts found in selected date range'
                              : 'Create your first invoice draft',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                        if (searchQuery.isNotEmpty || isDateFilterApplied) ...[
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              if (searchQuery.isNotEmpty)
                                TextButton.icon(
                                  onPressed: () => _searchController.clear(),
                                  icon: const Icon(Icons.clear),
                                  label: const Text('Clear Search'),
                                ),
                              if (isDateFilterApplied)
                                TextButton.icon(
                                  onPressed: () {
                                    setState(() {
                                      startDate = null;
                                      endDate = null;
                                      isDateFilterApplied = false;
                                    });
                                    _refreshDrafts();
                                  },
                                  icon: const Icon(Icons.date_range),
                                  label: const Text('Clear Date Filter'),
                                ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async => _refreshDrafts(),
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: filteredDrafts.length + (isLoadingMore ? 1 : (!hasMoreData && filteredDrafts.isNotEmpty ? 1 : 0)),
                    itemBuilder: (context, index) {
                      if (index == filteredDrafts.length) {
                        if (isLoadingMore) {
                          return Container(
                            padding: const EdgeInsets.all(16),
                            alignment: Alignment.center,
                            child: const Column(
                              children: [
                                CircularProgressIndicator(),
                                SizedBox(height: 8),
                                Text(
                                  'Loading more...',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              ],
                            ),
                          );
                        }

                        if (index == filteredDrafts.length && !hasMoreData && filteredDrafts.isNotEmpty) {
                          return Container(
                            padding: const EdgeInsets.all(16),
                            alignment: Alignment.center,
                            child: Column(
                              children: [
                                Icon(
                                  Icons.check_circle_outline,
                                  color: Colors.grey[400],
                                  size: 24,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'No more drafts to load',
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                Text(
                                  'You\'ve reached the end of the list',
                                  style: TextStyle(
                                    color: Colors.grey[500],
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          );
                        }
                      }

                      final draft = filteredDrafts[index];
                      return _buildDraftCard(draft, index);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton.extended(
        onPressed: _createNewDraft,
        icon: const Icon(Icons.add),
        label: const Text('New Draft'),
        backgroundColor: Colors.green[600],
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon, MaterialColor color) {
    return Column(
      children: [
        Icon(icon, color: color[700], size: 24),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: color[700],
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildDraftCard(Data draft, int index) {
    final createdDate = draft.createdOn != null
        ? DateFormat('MMM dd, yyyy').format(DateTime.parse(draft.createdOn!))
        : 'Unknown date';

    final timeAgo = draft.createdOn != null
        ? _getTimeAgo(DateTime.parse(draft.createdOn!))
        : '';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: InkWell(
        onTap: () => _showDraftDetail(draft.draftId ?? ''),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Row
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.orange[400]!, Colors.orange[600]!],
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'DRAFT',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '#${draft.draftId ?? 'N/A'}',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(width: 8),
                  PopupMenuButton(
                    icon: Icon(Icons.more_vert, color: Colors.grey[600], size: 20),
                    itemBuilder: (context) => [
                      const PopupMenuItem(
                        value: 'view',
                        child: Row(
                          children: [
                            Icon(Icons.visibility_outlined, size: 20),
                            SizedBox(width: 8),
                            Text('View Details'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: [
                            Icon(Icons.edit_outlined, size: 20),
                            SizedBox(width: 8),
                            Text('Edit Draft'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'convert',
                        child: Row(
                          children: [
                            Icon(Icons.receipt_long_outlined, size: 20, color: Colors.green),
                            SizedBox(width: 8),
                            Text('Convert to Invoice'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(Icons.delete_outline, size: 20, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Delete', style: TextStyle(color: Colors.red)),
                          ],
                        ),
                      ),
                    ],
                    onSelected: (value) => _handleMenuAction(value.toString(), draft),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Customer Info
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.blue[50],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      Icons.person,
                      color: Colors.blue[700],
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          draft.customerName ?? 'Unknown Customer',
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                            color: Colors.black87,
                          ),
                        ),
                        if (draft.customerPhone != null) ...[
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Icon(
                                Icons.phone_outlined,
                                size: 14,
                                color: Colors.grey[600],
                              ),
                              const SizedBox(width: 4),
                              Text(
                                draft.customerPhone!,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Amount and Date Row
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.grey[50]!, Colors.grey[100]!],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Amount',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey[600],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '₹${NumberFormat('#,##,###').format(draft.grandTotal ?? 0)}',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      width: 1,
                      height: 40,
                      color: Colors.grey[300],
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(left: 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Created',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey[600],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              createdDate,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: Colors.grey[700],
                              ),
                            ),
                            if (timeAgo.isNotEmpty)
                              Text(
                                timeAgo,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[500],
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Action Buttons
              // Row(
              //   children: [
              //     Expanded(
              //       child: OutlinedButton.icon(
              //         onPressed: () => _showDraftDetail(draft.draftId ?? ''),
              //         icon: const Icon(Icons.visibility_outlined, size: 18),
              //         label: const Text('View'),
              //         style: OutlinedButton.styleFrom(
              //           foregroundColor: Colors.blue[700],
              //           side: BorderSide(color: Colors.blue[300]!),
              //           shape: RoundedRectangleBorder(
              //             borderRadius: BorderRadius.circular(10),
              //           ),
              //           padding: const EdgeInsets.symmetric(vertical: 10),
              //         ),
              //       ),
              //     ),
              //     const SizedBox(width: 10),
              //     Expanded(
              //       child: OutlinedButton.icon(
              //         onPressed: () => _editDraft(draft.draftId ?? ''),
              //         icon: const Icon(Icons.edit_outlined, size: 18),
              //         label: const Text('Edit'),
              //         style: OutlinedButton.styleFrom(
              //           foregroundColor: Colors.orange[700],
              //           side: BorderSide(color: Colors.orange[300]!),
              //           shape: RoundedRectangleBorder(
              //             borderRadius: BorderRadius.circular(10),
              //           ),
              //           padding: const EdgeInsets.symmetric(vertical: 10),
              //         ),
              //       ),
              //     ),
              //     const SizedBox(width: 10),
              //     Expanded(
              //       child: ElevatedButton.icon(
              //         onPressed: () => _convertToInvoice(draft.draftId ?? ''),
              //         icon: const Icon(Icons.receipt_outlined, size: 18),
              //         label: const Text('Convert'),
              //         style: ElevatedButton.styleFrom(
              //           backgroundColor: Colors.green[600],
              //           foregroundColor: Colors.white,
              //           shape: RoundedRectangleBorder(
              //             borderRadius: BorderRadius.circular(10),
              //           ),
              //           padding: const EdgeInsets.symmetric(vertical: 10),
              //         ),
              //       ),
              //     ),
              //   ],
              // ),
            ],
          ),
        ),
      ),
    );
  }

  String _getTimeAgo(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays > 1 ? 's' : ''} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours > 1 ? 's' : ''} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute${difference.inMinutes > 1 ? 's' : ''} ago';
    } else {
      return 'Just now';
    }
  }

  void _sortDrafts(String sortType) {
    setState(() {
      switch (sortType) {
        case 'recent':
          allDrafts.sort((a, b) {
            final aDate = DateTime.tryParse(a.createdOn ?? '');
            final bDate = DateTime.tryParse(b.createdOn ?? '');
            if (aDate == null || bDate == null) return 0;
            return bDate.compareTo(aDate);
          });
          break;
        case 'amount_high':
          allDrafts.sort((a, b) => (b.grandTotal ?? 0).compareTo(a.grandTotal ?? 0));
          break;
        case 'amount_low':
          allDrafts.sort((a, b) => (a.grandTotal ?? 0).compareTo(b.grandTotal ?? 0));
          break;
        case 'customer':
          allDrafts.sort((a, b) => (a.customerName ?? '').compareTo(b.customerName ?? ''));
          break;
      }
      _filterDrafts();
    });
  }

  void _handleMenuAction(String action, Data draft) {
    switch (action) {
      case 'view':
        _showDraftDetail(draft.draftId ?? '');
        break;
      case 'edit':
        _editDraft(draft.draftId ?? '');
        break;
      case 'convert':
        _convertToInvoice(draft.draftId ?? '');
        break;
      case 'delete':
        _deleteDraft(draft);
        break;
    }
  }

  void _showDraftDetail(String draftId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraftDetailBottomSheet(draftId: draftId),
    );
  }

  void _editDraft(String draftId) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Opening editor for draft $draftId...'),
        backgroundColor: Colors.orange,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _convertToInvoice(String draftId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Convert to Invoice'),
        content: Text('Are you sure you want to convert draft $draftId to an invoice?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Converting draft $draftId to invoice...'),
                  backgroundColor: Colors.green,
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
            child: const Text('Convert', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _deleteDraft(Data draft) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Draft'),
        content: Text('Are you sure you want to delete draft ${draft.draftId}? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                allDrafts.removeWhere((d) => d.draftId == draft.draftId);
                _filterDrafts();
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Draft ${draft.draftId} deleted successfully'),
                  backgroundColor: Colors.red,
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _createNewDraft() {

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => VendorCreateInvoiceDraftScreen(),
        ),
      );
    // ScaffoldMessenger.of(context).showSnackBar(
    //   const SnackBar(
    //     content: Text('Opening draft creator...'),
    //     backgroundColor: Colors.green,
    //     behavior: SnackBarBehavior.floating,
    //   ),
    // );
  }
}