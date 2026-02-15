import 'dart:async';
import 'package:dss_crm/vendor_module/screen/purchase_order/vendor_purchase_order_payment_screen.dart';
import 'package:dss_crm/vendor_module/screen/vendor_customer/vendor_create_invoice_screen.dart' hide Data;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../../ui_helper/app_colors.dart';
import '../../../../../utils/default_common_app_bar.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../controller/vendor_api_provider.dart';
import '../../model/purchsae_order/vendor_purchase_order_list_model.dart';

class VendorPurchaseOrderManagementListScreen extends StatefulWidget {
  const VendorPurchaseOrderManagementListScreen({super.key});

  @override
  State<VendorPurchaseOrderManagementListScreen> createState() => _VendorPurchaseOrderManagementListScreenState();
}

class _VendorPurchaseOrderManagementListScreenState extends State<VendorPurchaseOrderManagementListScreen> with TickerProviderStateMixin {
  int _currentPage = 1;
  final int _itemsPerPage = 10;
  final ScrollController _scrollController = ScrollController();
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  // Filter variables
  String _selectedStatus = 'All';
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();
  Timer? _debounceTimer;

  // Store original data for filtering
  List<Data> _originalOrders = [];
  List<Data> _filteredOrders = [];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: _animationController, curve: Curves.easeInOut)
    );
    _fetchPurchaseOrders();
    _animationController.forward();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _animationController.dispose();
    _searchController.dispose();
    _debounceTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchPurchaseOrders() async {
    final apiProvider = Provider.of<VendorModuleApiProvider>(context, listen: false);
    await apiProvider.getAllVendorPurchaseOrderList(context, _currentPage, _itemsPerPage);

    // Store original data for filtering
    final response = apiProvider.getAllVendorPurchaseOrderListModelResponse;
    if (response?.success == true) {
      _originalOrders = response?.data?.data ?? [];
      _applyFilters();
    }
  }

  void _applyFilters() {
    List<Data> filtered = List.from(_originalOrders);

    // Apply status filter
    if (_selectedStatus != 'All') {
      filtered = filtered.where((order) {
        return order.paymentStatus?.toLowerCase() == _selectedStatus.toLowerCase();
      }).toList();
    }

    // Apply search filter
    if (_searchQuery.isNotEmpty) {
      final query = _searchQuery.toLowerCase().trim();
      filtered = filtered.where((order) {
        final invoiceId = (order.invoiceId ?? '').toLowerCase();
        final customerName = (order.customerName ?? '').toLowerCase();
        final customerPhone = (order.customerPhone ?? '').toLowerCase();

        return invoiceId.contains(query) ||
            customerName.contains(query) ||
            customerPhone.contains(query);
      }).toList();
    }

    setState(() {
      _filteredOrders = filtered;
      _currentPage = 1; // Reset to first page when filters change
    });
  }

  void _onSearchChanged(String value) {
    if (_debounceTimer?.isActive ?? false) _debounceTimer!.cancel();

    _debounceTimer = Timer(const Duration(milliseconds: 300), () {
      setState(() {
        _searchQuery = value;
      });
      _applyFilters();
    });
  }

  void _clearSearch() {
    _searchController.clear();
    setState(() {
      _searchQuery = '';
    });
    _applyFilters();
  }

  void _onStatusFilterChanged(String status) {
    setState(() {
      _selectedStatus = status;
    });
    _applyFilters();
  }

  void _clearAllFilters() {
    _searchController.clear();
    setState(() {
      _selectedStatus = 'All';
      _searchQuery = '';
    });
    _applyFilters();
  }

  // Get paginated results from filtered orders
  List<Data> _getPaginatedOrders() {
    final startIndex = (_currentPage - 1) * _itemsPerPage;
    final endIndex = (startIndex + _itemsPerPage).clamp(0, _filteredOrders.length);
    return _filteredOrders.sublist(startIndex, endIndex);
  }

  int get _totalFilteredPages {
    return (_filteredOrders.length / _itemsPerPage).ceil();
  }

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'Paid':
        return const Color(0xFF10B981); // Green
      case 'Partial':
        return const Color(0xFFF59E0B); // Amber
      case 'Pending':
        return const Color(0xFFEF4444); // Red
      default:
        return const Color(0xFF6B7280); // Gray
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return '${date.day.toString().padLeft(2, '0')} ${_getMonthName(date.month)} ${date.year}';
    } catch (e) {
      return dateString;
    }
  }

  String _getMonthName(int month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  }

  void _showOrderDetails(Data orderData) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Handle bar
            Container(
              width: 48,
              height: 5,
              margin: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(3),
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.receipt_long,
                            color: AppColors.primary,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Order Details',
                                style: AppTextStyles.heading1(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontSize: ResponsiveHelper.fontSize(context, 22),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              Text(
                                orderData.invoiceId ?? 'N/A',
                                style: AppTextStyles.body1(
                                  context,
                                  overrideStyle: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: _getStatusColor(orderData.paymentStatus).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: _getStatusColor(orderData.paymentStatus).withOpacity(0.3),
                            ),
                          ),
                          child: Text(
                            orderData.paymentStatus ?? 'N/A',
                            style: TextStyle(
                              color: _getStatusColor(orderData.paymentStatus),
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 32),

                    // Details Cards
                    _buildInfoCard([
                      _buildDetailRow('Customer Name', orderData.customerName ?? 'N/A', Icons.person),
                      _buildDetailRow('Customer Phone', orderData.customerPhone ?? 'N/A', Icons.phone),
                      _buildDetailRow('Payment Mode', orderData.paymentMode ?? 'N/A', Icons.payment),
                      _buildDetailRow('Date', _formatDate(orderData.createdAt), Icons.calendar_today),
                    ]),

                    const SizedBox(height: 16),

                    _buildAmountCard(orderData),

                    const SizedBox(height: 32),

                    // Add Payment Button
                    if (orderData.paymentStatus?.toLowerCase() != 'paid')
                      Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          gradient: LinearGradient(
                            colors: [AppColors.primary, AppColors.primary.withOpacity(0.8)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.3),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => VendorPurchaseOrderPaymentUpdateScreen(productData: orderData),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            padding: const EdgeInsets.symmetric(vertical: 5),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.add_card, color: Colors.white, size: 20),
                              const SizedBox(width: 12),
                              Text(
                                'Add Payment',
                                style: AppTextStyles.heading2(
                                  context,
                                  overrideStyle: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(List<Widget> children) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Order Information',
            style: AppTextStyles.heading2(
              context,
              overrideStyle: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildAmountCard(Data orderData) {
    final pendingAmount = (orderData.grandTotal ?? 0) - (orderData.amountPaid ?? 0);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.whiteColor, Colors.white],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primary.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Payment Summary',
            style: AppTextStyles.heading2(
              context,
              overrideStyle: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildAmountItem('Grand Total', '₹${orderData.grandTotal ?? 0}', AppColors.primary),
              _buildAmountItem('Amount Paid', '₹${orderData.amountPaid ?? 0}', Colors.green),
              _buildAmountItem('Pending', '₹$pendingAmount', Colors.red),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAmountItem(String label, String amount, Color color) {
    return Column(
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
          amount,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Icon(icon, size: 18, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: AppTextStyles.body1(
                context,
                overrideStyle: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[700],
                  fontSize: 14,
                ),
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: AppTextStyles.body1(
                context,
                overrideStyle: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderCard(Data orderData, int index) {
    final pendingAmount = (orderData.grandTotal ?? 0) - (orderData.amountPaid ?? 0);

    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(1, 0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: _animationController,
        curve: Interval((index * 0.1).clamp(0.0, 1.0), 1.0),
      )),
      child: FadeTransition(
        opacity: _fadeAnimation,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.white, Colors.grey[50]!],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.08),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
            border: Border.all(color: Colors.grey[200]!),
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () => _showOrderDetails(orderData),
              borderRadius: BorderRadius.circular(20),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header Row
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.receipt_long,
                            color: AppColors.primary,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                orderData.invoiceId ?? 'N/A',
                                style: AppTextStyles.heading2(
                                  context,
                                  overrideStyle: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: ResponsiveHelper.fontSize(context, 16),
                                  ),
                                ),
                              ),
                              Text(
                                _formatDate(orderData.createdAt),
                                style: AppTextStyles.body2(
                                  context,
                                  overrideStyle: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: _getStatusColor(orderData.paymentStatus).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: _getStatusColor(orderData.paymentStatus).withOpacity(0.3),
                            ),
                          ),
                          child: Text(
                            orderData.paymentStatus ?? 'N/A',
                            style: TextStyle(
                              color: _getStatusColor(orderData.paymentStatus),
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Customer Info
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey[50],
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey[200]!),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Icon(Icons.person_outline, size: 18, color: Colors.grey[600]),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  orderData.customerName ?? 'N/A',
                                  style: AppTextStyles.body1(
                                    context,
                                    overrideStyle: TextStyle(
                                      fontWeight: FontWeight.w600,
                                      fontSize: ResponsiveHelper.fontSize(context, 14),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(Icons.phone_outlined, size: 18, color: Colors.grey[600]),
                              const SizedBox(width: 10),
                              Text(
                                orderData.customerPhone ?? 'N/A',
                                style: AppTextStyles.body2(
                                  context,
                                  overrideStyle: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: ResponsiveHelper.fontSize(context, 13),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Amount Info
                    Row(
                      children: [
                        Expanded(
                          child: _buildAmountDisplay(
                            'Total Amount',
                            '₹${orderData.grandTotal ?? 0}',
                            AppColors.primary,
                          ),
                        ),
                        Container(
                          width: 1,
                          height: 40,
                          color: Colors.grey[300],
                        ),
                        Expanded(
                          child: _buildAmountDisplay(
                            'Payment Mode',
                            orderData.paymentMode ?? 'N/A',
                            Colors.blue[700]!,
                          ),
                        ),
                      ],
                    ),

                    // Pending Amount Alert
                    if (pendingAmount > 0) ...[
                      const SizedBox(height: 12),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red[50],
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.red[200]!),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.warning_amber_rounded, color: Colors.red[700], size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Pending Amount: ₹$pendingAmount',
                                style: TextStyle(
                                  color: Colors.red[700],
                                  fontWeight: FontWeight.w600,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],

                    const SizedBox(height: 12),

                    // View Details Button
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(
                          'View Details',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(
                          Icons.arrow_forward_ios,
                          size: 14,
                          color: AppColors.primary,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAmountDisplay(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          label,
          style: AppTextStyles.body2(
            context,
            overrideStyle: TextStyle(
              color: Colors.grey[600],
              fontSize: 12,
            ),
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: ResponsiveHelper.fontSize(context, 14),
              color: color,
            ),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildPaginationControls(int totalPages) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey[200]!)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Previous Button
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[300]!),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _currentPage > 1 ? () {
                  setState(() {
                    _currentPage--;
                  });
                } : null,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.arrow_back_ios,
                        size: 16,
                        color: _currentPage > 1 ? AppColors.primary : Colors.grey[400],
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Previous',
                        style: TextStyle(
                          color: _currentPage > 1 ? AppColors.primary : Colors.grey[400],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Page Numbers
          Row(
            children: [
              for (int i = 1; i <= totalPages && i <= 5; i++)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    color: i == _currentPage ? AppColors.primary : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: i == _currentPage ? AppColors.primary : Colors.grey[300]!,
                    ),
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () {
                        setState(() {
                          _currentPage = i;
                        });
                      },
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        width: 40,
                        height: 40,
                        alignment: Alignment.center,
                        child: Text(
                          i.toString(),
                          style: TextStyle(
                            color: i == _currentPage ? Colors.white : AppColors.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),

          // Next Button
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[300]!),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _currentPage < totalPages ? () {
                  setState(() {
                    _currentPage++;
                  });
                } : null,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Next',
                        style: TextStyle(
                          color: _currentPage < totalPages ? AppColors.primary : Colors.grey[400],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.arrow_forward_ios,
                        size: 16,
                        color: _currentPage < totalPages ? AppColors.primary : Colors.grey[400],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Search Bar
          Container(
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey[200]!),
            ),
            child: TextField(
              controller: _searchController,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Search by invoice ID, customer name or phone...',
                hintStyle: TextStyle(color: Colors.grey[500], fontSize: 14),
                prefixIcon: Container(
                  padding: const EdgeInsets.all(12),
                  child: Icon(Icons.search, color: Colors.grey[500], size: 20),
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                suffixIcon: _searchQuery.isNotEmpty
                    ? Container(
                  margin: const EdgeInsets.only(right: 8),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: _clearSearch,
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        width: 32,
                        height: 32,
                        alignment: Alignment.center,
                        child: Icon(Icons.clear, color: Colors.grey[500], size: 18),
                      ),
                    ),
                  ),
                )
                    : null,
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Status Filter Chips and Results Count
          Row(
            children: [
              Text(
                'Filter: ',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[700],
                  fontSize: 14,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['All', 'Paid', 'Partial', 'Pending'].map((status) {
                      final isSelected = _selectedStatus == status;
                      return Container(
                        margin: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(status),
                          selected: isSelected,
                          onSelected: (selected) => _onStatusFilterChanged(status),
                          backgroundColor: Colors.grey[100],
                          selectedColor: AppColors.primary.withOpacity(0.2),
                          checkmarkColor: AppColors.primary,
                          labelStyle: TextStyle(
                            color: isSelected ? AppColors.primary : Colors.grey[700],
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                            fontSize: 13,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected ? AppColors.primary : Colors.grey[300]!,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ],
          ),

          // Active filters and results info
          if (_searchQuery.isNotEmpty || _selectedStatus != 'All') ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.primary.withOpacity(0.1)),
              ),
              child: Row(
                children: [
                  Icon(Icons.filter_list, size: 16, color: AppColors.primary),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Active filters: ${_buildFilterSummary()}',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w500,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: _clearAllFilters,
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        child: Text(
                          'Clear All',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _buildFilterSummary() {
    List<String> activeFilters = [];

    if (_selectedStatus != 'All') {
      activeFilters.add('Status: $_selectedStatus');
    }

    if (_searchQuery.isNotEmpty) {
      activeFilters.add('Search: "${_searchQuery.length > 20 ? '${_searchQuery.substring(0, 20)}...' : _searchQuery}"');
    }

    return activeFilters.join(', ');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          'Order Management',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              color: Colors.white,
              fontSize: ResponsiveHelper.fontSize(context, 16),
            ),
          ),
        ),
        actions: [
          Container(
            margin: ResponsiveHelper.paddingOnly(
              context,
              right: 16,
              top: 8,
              bottom: 8,
            ),
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => VendorCreateInvoiceScreen(),
                  ),
                );
              },
              icon:  Icon(Icons.add, size:ResponsiveHelper.iconSize(context, 18) , color: Colors.orange),
              label: Text(
                'Create Invoice',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    color: AppColors.orangeColor,
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.white,
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: ResponsiveHelper.paddingSymmetric(
                  context,
                  horizontal: 16,
                  vertical: 8,
                ),
              ),
            ),
          ),
        ],
      ),
      body: Consumer<VendorModuleApiProvider>(
        builder: (context, apiProvider, child) {
          if (apiProvider.isLoading) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(color: AppColors.primary),
                  const SizedBox(height: 16),
                  Text(
                    'Loading purchase orders...',
                    style: AppTextStyles.body1(
                      context,
                      overrideStyle: TextStyle(color: Colors.grey[600]),
                    ),
                  ),
                ],
              ),
            );
          }

          final response = apiProvider.getAllVendorPurchaseOrderListModelResponse;

          if (response == null || !response.success) {
            return Column(
              children: [
                _buildFilterHeader(),
                Expanded(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Colors.red[50],
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.error_outline,
                            size: 48,
                            color: Colors.red[400],
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Failed to load purchase orders',
                          style: AppTextStyles.heading2(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.grey[700],
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Please check your connection and try again',
                          style: AppTextStyles.body2(
                            context,
                            overrideStyle: TextStyle(color: Colors.grey[500]),
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),
                        Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            gradient: LinearGradient(
                              colors: [AppColors.primary, AppColors.primary.withOpacity(0.8)],
                            ),
                          ),
                          child: ElevatedButton(
                            onPressed: _fetchPurchaseOrders,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.refresh, color: Colors.white, size: 20),
                                const SizedBox(width: 8),
                                const Text(
                                  'Retry',
                                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          }

          // Update the original data when API response changes
          if (_originalOrders.isEmpty && (response.data?.data ?? []).isNotEmpty) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              _originalOrders = response.data?.data ?? [];
              _applyFilters();
            });
          }

          final paginatedOrders = _getPaginatedOrders();
          final totalFilteredPages = _totalFilteredPages;

          if (_filteredOrders.isEmpty) {
            return Column(
              children: [
                _buildFilterHeader(),
                Expanded(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.receipt_long_outlined,
                            size: 48,
                            color: Colors.grey[400],
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No purchase orders found',
                          style: AppTextStyles.heading2(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.grey[600],
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _selectedStatus != 'All' || _searchQuery.isNotEmpty
                              ? 'Try adjusting your search terms or filters'
                              : 'No orders available at the moment',
                          style: AppTextStyles.body2(
                            context,
                            overrideStyle: TextStyle(color: Colors.grey[500]),
                          ),
                          textAlign: TextAlign.center,
                        ),
                        if (_selectedStatus != 'All' || _searchQuery.isNotEmpty) ...[
                          const SizedBox(height: 16),
                          TextButton(
                            onPressed: _clearAllFilters,
                            child: Text(
                              'Clear all filters',
                              style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            );
          }

          return Column(
            children: [
              _buildFilterHeader(),

              // Results summary
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info_outline, size: 16, color: Colors.grey[600]),
                    const SizedBox(width: 8),
                    Text(
                      'Showing ${paginatedOrders.length} of ${_filteredOrders.length} filtered results',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    if (_originalOrders.length != _filteredOrders.length) ...[
                      const SizedBox(width: 8),
                      Text(
                        '(${_originalOrders.length} total)',
                        style: TextStyle(
                          color: Colors.grey[500],
                          fontSize: 13,
                        ),
                      ),
                    ],
                    if (totalFilteredPages > 1) ...[
                      const SizedBox(width: 8),
                      Text(
                        '• Page $_currentPage of $totalFilteredPages',
                        style: TextStyle(
                          color: Colors.grey[500],
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ],
                ),
              ),

              Expanded(
                child: RefreshIndicator(
                  onRefresh: _fetchPurchaseOrders,
                  color: AppColors.primary,
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: paginatedOrders.length,
                    itemBuilder: (context, index) {
                      final order = paginatedOrders[index];
                      return _buildOrderCard(order, index);
                    },
                  ),
                ),
              ),

              // Pagination Controls
              if (totalFilteredPages > 0) _buildPaginationControls(totalFilteredPages),
            ],
          );
        },
      ),
    );
  }

}