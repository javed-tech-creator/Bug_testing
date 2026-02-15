import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';

import '../../ui_helper/app_text_styles.dart';
import '../../utils/responsive_helper_utils.dart';

// Model class for table data
class TableRowData {
  final Map<String, dynamic> data;

  const TableRowData(this.data);
}

// Column configuration class
class TableColumnConfig {
  final String key;
  final String title;
  final double? width;
  final bool sortable;
  final Widget Function(dynamic value)? customRenderer;
  final TextAlign textAlign;

  const TableColumnConfig({
    required this.key,
    required this.title,
    this.width,
    this.sortable = false,
    this.customRenderer,
    this.textAlign = TextAlign.left,
  });
}

// Main responsive data table widget
class ResponsiveDataTable extends StatefulWidget {
  final List<TableRowData> data;
  final List<TableColumnConfig> columns;
  final int itemsPerPage;
  final bool showPagination;
  final Color? headerColor;
  final Color? rowColor;
  final Color? alternateRowColor;
  final TextStyle? headerTextStyle;
  final TextStyle? rowTextStyle;
  final double rowHeight;
  final EdgeInsets? padding;
  final Function(TableRowData)? onEditTap;
  final Function(TableRowData)? onDeleteTap;
  final bool showSerialNumber;
  final bool showActions;
  final bool showSearchFilter;
  final String searchHintText;

  const ResponsiveDataTable({
    Key? key,
    required this.data,
    required this.columns,
    this.itemsPerPage = 10,
    this.showPagination = true,
    this.headerColor,
    this.rowColor,
    this.alternateRowColor,
    this.headerTextStyle,
    this.rowTextStyle,
    this.rowHeight = 60.0,
    this.padding,
    this.onEditTap,
    this.onDeleteTap,
    this.showSerialNumber = true,
    this.showActions = true,
    this.showSearchFilter = true,
    this.searchHintText = 'Search...',
  }) : super(key: key);

  @override
  State<ResponsiveDataTable> createState() => _ResponsiveDataTableState();
}

class _ResponsiveDataTableState extends State<ResponsiveDataTable> {
  int currentPage = 0;
  String? sortColumn;
  bool sortAscending = true;
  List<TableRowData> sortedData = [];
  List<TableRowData> filteredData = [];
  final TextEditingController searchController = TextEditingController();
  String searchQuery = '';

  @override
  void initState() {
    super.initState();
    sortedData = List.from(widget.data);
    filteredData = List.from(widget.data);
    searchController.addListener(_onSearchChanged);
  }

  @override
  void didUpdateWidget(ResponsiveDataTable oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.data != widget.data) {
      sortedData = List.from(widget.data);
      _filterData(searchQuery);
      currentPage = 0;
    }
  }

  @override
  void dispose() {
    searchController.removeListener(_onSearchChanged);
    searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    setState(() {
      searchQuery = searchController.text;
      _filterData(searchQuery);
      currentPage = 0; // Reset to first page when searching
    });
  }

  void _filterData(String query) {
    if (query.isEmpty) {
      filteredData = List.from(sortedData);
    } else {
      filteredData = sortedData.where((rowData) {
        return widget.columns.any((column) {
          final value = rowData.data[column.key];
          return value?.toString().toLowerCase().contains(query.toLowerCase()) ?? false;
        });
      }).toList();
    }
  }

  void _sortData(String column) {
    setState(() {
      if (sortColumn == column) {
        sortAscending = !sortAscending;
      } else {
        sortColumn = column;
        sortAscending = true;
      }

      sortedData.sort((a, b) {
        final aValue = a.data[column];
        final bValue = b.data[column];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortAscending ? -1 : 1;
        if (bValue == null) return sortAscending ? 1 : -1;

        int comparison;
        if (aValue is String && bValue is String) {
          comparison = aValue.toLowerCase().compareTo(bValue.toLowerCase());
        } else if (aValue is num && bValue is num) {
          comparison = aValue.compareTo(bValue);
        } else {
          comparison = aValue.toString().compareTo(bValue.toString());
        }

        return sortAscending ? comparison : -comparison;
      });

      // Re-apply filter after sorting
      _filterData(searchQuery);
    });
  }

  List<TableRowData> get paginatedData {
    if (!widget.showPagination) return filteredData;

    final startIndex = currentPage * widget.itemsPerPage;
    final endIndex = (startIndex + widget.itemsPerPage).clamp(
      0,
      filteredData.length,
    );
    return filteredData.sublist(startIndex, endIndex);
  }

  int get totalPages => widget.showPagination
      ? (filteredData.length / widget.itemsPerPage).ceil()
      : 1;

  Widget _buildCell(dynamic value, TableColumnConfig column) {
    // If a custom renderer is provided, use it
    if (column.customRenderer != null) {
      // Use a Builder to get a valid context for the custom renderer
      return Builder(
        builder: (context) => column.customRenderer!(value),
      );
    }

    // Default text rendering with overflow handling
    return Text(
      value?.toString() ?? '',
      textAlign: column.textAlign,
      softWrap: true,
      style: widget.rowTextStyle ?? AppTextStyles.body2(
        context,
        overrideStyle: TextStyle(
          color: Colors.black,
          fontSize: ResponsiveHelper.fontSize(context, 12),
        ),
      ),
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
    );
  }

  Widget _buildActionButtons(TableRowData rowData) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          margin: const EdgeInsets.only(right: 4),
          child: InkWell(
            onTap: () {
              if (widget.onEditTap != null) {
                widget.onEditTap!(rowData);
              }
            },
            child: Container(
              padding: ResponsiveHelper.paddingAll(context, 6),
              decoration: BoxDecoration(
                color: Colors.orange[50],
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: Colors.orange[200]!),
              ),
              child: Icon(Icons.edit, color: Colors.orange[600], size: ResponsiveHelper.iconSize(context, 14)),
            ),
          ),
        ),
        InkWell(
          onTap: () {
            if (widget.onDeleteTap != null) {
              widget.onDeleteTap!(rowData);
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Delete clicked for ${rowData.data['productName']}',
                  ),
                ),
              );
            }
          },
          child: Container(
            padding: ResponsiveHelper.paddingAll(context, 6),
            decoration: BoxDecoration(
              color: Colors.red[50],
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Colors.red[200]!),
            ),
            child: const Icon(Icons.delete_outline, color: Colors.red, size: 16),
          ),
        ),
      ],
    );
  }

  Widget _buildSearchField(BuildContext context) {
    return Container(
      margin: ResponsiveHelper.paddingAll(context, 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withAlpha(40),
            spreadRadius: 1,
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        controller: searchController,
        decoration: InputDecoration(
          hintText: widget.searchHintText,
          hintStyle: AppTextStyles.body2(
            context,
            overrideStyle: TextStyle(
              color: Colors.grey[600],
              fontSize: ResponsiveHelper.fontSize(context, 14),
            ),
          ),
          prefixIcon: Icon(
            Icons.search,
            color: Colors.grey[600],
            size: ResponsiveHelper.iconSize(context, 20),
          ),
          suffixIcon: searchQuery.isNotEmpty
              ? IconButton(
            icon: Icon(
              Icons.clear,
              color: Colors.grey[600],
              size: ResponsiveHelper.iconSize(context, 20),
            ),
            onPressed: () {
              searchController.clear();
            },
          )
              : null,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(width: 1, color: Colors.grey[300]!),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(width: 1, color: Colors.grey[300]!),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide:   BorderSide(color: AppColors.orangeColor, width: 1),
          ),
          contentPadding: ResponsiveHelper.paddingSymmetric(
            context,
            horizontal: 16,
            vertical: 12,
          ),
        ),
        style: AppTextStyles.body1(
          context,
          overrideStyle: TextStyle(
            fontSize: ResponsiveHelper.fontSize(context, 14),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isSmallScreen = ResponsiveHelper.isMobile(context);

    return Container(
      padding: widget.padding ?? const EdgeInsets.all(0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search field
          if (widget.showSearchFilter) _buildSearchField(context),

          // Table container
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  spreadRadius: 1,
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minWidth: MediaQuery.of(context).size.width - 32,
                ),
                child: DataTable(
                  headingRowHeight: 50,
                  // dataRowHeight: 55,
                  horizontalMargin: 16,
                  columnSpacing: isSmallScreen ? 40 : 60,
                  headingRowColor: WidgetStateProperty.all(
                    const Color(0xFF2E3440),
                  ),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  columns: [
                    if (widget.showSerialNumber)
                      DataColumn(
                        label: Text(
                          'S.NO.',
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.white,
                              fontSize: ResponsiveHelper.fontSize(context, 10),
                            ),
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    if (widget.showActions)
                      DataColumn(
                        label: Text(
                          'ACTIONS',
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.white,
                              fontSize: ResponsiveHelper.fontSize(context, 10),
                            ),
                          ),
                        ),
                      ),
                    ...widget.columns.map((column) {
                      return DataColumn(
                        label: SizedBox(
                          width: column.width,
                          child: Text(
                            column.title,
                            style: widget.headerTextStyle ?? AppTextStyles.heading1(
                              context,
                              overrideStyle: TextStyle(
                                color: Colors.white,
                                fontSize: ResponsiveHelper.fontSize(context, 10),
                              ),
                            ),
                            textAlign: column.textAlign,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        onSort: column.sortable
                            ? (columnIndex, ascending) {
                          _sortData(column.key);
                        }
                            : null,
                      );
                    }),
                  ],
                  rows: paginatedData.asMap().entries.map((entry) {
                    final index = entry.key;
                    final rowData = entry.value;
                    final globalIndex =
                        currentPage * widget.itemsPerPage + index;

                    return DataRow(
                      color: MaterialStateProperty.resolveWith<Color?>((
                          states,
                          ) {
                        if (index % 2 == 1) {
                          return Colors.grey[50];
                        }
                        return Colors.white;
                      }),
                      cells: [
                        if (widget.showSerialNumber)
                          DataCell(
                            Center(
                              child: Text(
                                '${globalIndex + 1}',
                                style: AppTextStyles.heading1(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(context, 10),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        if (widget.showActions)
                          DataCell(_buildActionButtons(rowData)),
                        ...widget.columns.map((column) {
                          return DataCell(
                            // This Builder widget ensures the customRenderer has a valid context
                            Builder(
                              builder: (context) {
                                return SizedBox(
                                  width: column.width,
                                  child: _buildCell(
                                    rowData.data[column.key],
                                    column,
                                  ),
                                );
                              },
                            ),
                          );
                        }),
                      ],
                    );
                  }).toList(),
                ),
              ),
            ),
          ),

          if (widget.showPagination && totalPages > 1) ...[
            const SizedBox(height: 16),
            _buildPaginationControls(),
          ],
        ],
      ),
    );
  }

  Widget _buildPaginationControls() {
    return Container(
      padding: ResponsiveHelper.paddingSymmetric(context, vertical: 16, horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Row(
            children: [
              SizedBox(width: 8),
            ],
          ),

          Row(
            children: [
              ResponsiveHelper.sizedBoxWidth(context, 20),
              Row(
                children: [
                  IconButton(
                    onPressed: currentPage > 0
                        ? () => setState(() => currentPage--)
                        : null,
                    icon: Icon(Icons.chevron_left, color: Colors.grey[600]),
                    tooltip: 'Previous',
                  ),
                  ...List.generate(totalPages.clamp(0, 5), (index) {
                    final pageIndex = index;
                    return GestureDetector(
                      onTap: () => setState(() => currentPage = pageIndex),
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 2),
                        padding: ResponsiveHelper.paddingSymmetric(context,
                          horizontal: 12,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: currentPage == pageIndex
                              ? const Color(0xFF2E3440)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(
                            color: currentPage == pageIndex
                                ? const Color(0xFF2E3440)
                                : Colors.grey[300]!,
                          ),
                        ),
                        child: Text(
                          '${pageIndex + 1}',
                          style: AppTextStyles.heading1(
                            context,
                            overrideStyle: TextStyle(
                              color: currentPage == pageIndex
                                  ? Colors.white
                                  : Colors.grey[700],
                              fontSize: ResponsiveHelper.fontSize(context, 10),
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                  if (totalPages > 5)
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Text(
                        '...',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  IconButton(
                    onPressed: currentPage < totalPages - 1
                        ? () => setState(() => currentPage++)
                        : null,
                    icon: Icon(Icons.chevron_right, color: Colors.grey[600]),
                    tooltip: 'Next',
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}