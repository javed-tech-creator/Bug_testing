// import 'package:dss_crm/tech_module/tech_manager/model/help_desk_and_ticketing/tech_help_desk_ticketing_list_model.dart';
// import 'package:dss_crm/ui_helper/app_colors.dart';
// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'package:intl/intl.dart';
// import '../../../../ui_helper/app_text_styles.dart';
// import '../../../../utils/responsive_helper_utils.dart';
// import '../../controller/tech_engineer_api_provider.dart';
//
// class TechHelpDeskTicketListScreen extends StatefulWidget {
//   const TechHelpDeskTicketListScreen({Key? key}) : super(key: key);
//
//   @override
//   State<TechHelpDeskTicketListScreen> createState() => _TechHelpDeskTicketListScreenState();
// }
//
// class _TechHelpDeskTicketListScreenState extends State<TechHelpDeskTicketListScreen>
//     with TickerProviderStateMixin {
//   late AnimationController _animationController;
//   late Animation<double> _fadeAnimation;
//   final ScrollController _scrollController = ScrollController();
//   final TextEditingController _searchController = TextEditingController();
//
//   int _currentPage = 1;
//   final int _limit = 3;
//   List<Data> _filteredDevices = [];
//   List<Data> _allDevices = [];
//   String _searchQuery = '';
//   bool _isLoadingMore = false;
//
//   @override
//   void initState() {
//     super.initState();
//     _animationController = AnimationController(
//       duration: const Duration(milliseconds: 800),
//       vsync: this,
//     );
//     _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
//       CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
//     );
//
//     _scrollController.addListener(_onScroll);
//     _searchController.addListener(_onSearchChanged);
//
//     WidgetsBinding.instance.addPostFrameCallback((_) {
//       _loadDevices();
//     });
//   }
//
//   @override
//   void dispose() {
//     _animationController.dispose();
//     _scrollController.dispose();
//     _searchController.dispose();
//     super.dispose();
//   }
//
//   void _loadDevices() {
//     final provider = Provider.of<TechModuleApiProvider>(context, listen: false);
//     provider.getAllTechMangerHelpDeskTicketList(context, _currentPage, _limit).then((_) {
//       if (provider.getAllTechMangerTicketListModelResponse?.success == true) {
//         setState(() {
//           if (_currentPage == 1) {
//             _allDevices = provider.getAllTechMangerTicketListModelResponse!.data?.data ?? [];
//           } else {
//             _allDevices.addAll(provider.getAllTechMangerTicketListModelResponse!.data?.data ?? []);
//           }
//           _applySearch();
//         });
//         _animationController.forward();
//       }
//       _isLoadingMore = false;
//     });
//   }
//
//   void _onScroll() {
//     if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
//       _loadMoreDevices();
//     }
//   }
//
//   void _loadMoreDevices() {
//     final provider = Provider.of<TechModuleApiProvider>(context, listen: false);
//     final response = provider.getAllTechMangerTicketListModelResponse;
//
//     if (!_isLoadingMore && response != null && _currentPage < (response.data?.total ?? 0)) {
//       setState(() {
//         _isLoadingMore = true;
//         _currentPage++;
//       });
//       _loadDevices();
//     }
//   }
//
//   void _onSearchChanged() {
//     setState(() {
//       _searchQuery = _searchController.text.toLowerCase();
//       _applySearch();
//     });
//   }
//
//   void _applySearch() {
//     if (_searchQuery.isEmpty) {
//       _filteredDevices = _allDevices;
//     } else {
//       _filteredDevices = _allDevices.where((ticket) {
//         return (ticket.priority?.toLowerCase().contains(_searchQuery) ?? false) ||
//             (ticket.department?.toLowerCase().contains(_searchQuery) ?? false) ||
//             (ticket.role?.toLowerCase().contains(_searchQuery) ?? false) ||
//             (ticket.ticketId?.toLowerCase().contains(_searchQuery) ?? false) ||
//             (ticket.ticketType?.toLowerCase().contains(_searchQuery) ?? false) ||
//             (ticket.status?.toLowerCase().contains(_searchQuery) ?? false) ||
//             (ticket.raisedBy?.toLowerCase().contains(_searchQuery) ?? false) ||
//             (ticket.assignedTo?.toLowerCase().contains(_searchQuery) ?? false) ||
//             (ticket.employeeId?.toLowerCase().contains(_searchQuery) ?? false) ||
//             (ticket.issueDescription?.toLowerCase().contains(_searchQuery) ?? false);
//       }).toList();
//     }
//   }
//
//   void _refreshDevices() {
//     setState(() {
//       _currentPage = 1;
//       _allDevices.clear();
//       _filteredDevices.clear();
//     });
//     _loadDevices();
//   }
//
//   void _editDevice(Data device) {
//     // Navigator.push(
//     //   context,
//     //   MaterialPageRoute(
//     //     builder: (context) => UpdateDeviceScreen(
//     //       productData: device,
//     //       onDeviceUpdated: _refreshDevices, // Pass refresh function as callback
//     //     ),
//     //   ),
//     // );
//   }
//
//   void _deleteDevice(Data device) {
//     showDialog(
//       context: context,
//       builder: (BuildContext context) {
//         return AlertDialog(
//           backgroundColor: Colors.white,
//           shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
//           title: Row(
//             children: [
//               Icon(Icons.warning_amber_rounded, color: Colors.orange, size: 28),
//               const SizedBox(width: 12),
//               const Text('Confirm Delete'),
//             ],
//           ),
//           content: Text(
//             'Are you sure you want to delete device "${device.ticketId}"? This action cannot be undone.',
//             style: const TextStyle(fontSize: 16),
//           ),
//           actions: [
//             TextButton(
//               onPressed: () => Navigator.of(context).pop(),
//               child: const Text('Cancel'),
//             ),
//             ElevatedButton(
//               onPressed: () {
//                 Navigator.of(context).pop();
//                 _performDelete(device);
//               },
//               style: ElevatedButton.styleFrom(
//                 backgroundColor: Colors.red,
//                 foregroundColor: Colors.white,
//               ),
//               child: const Text('Delete'),
//             ),
//           ],
//         );
//       },
//     );
//   }
//
//   void _performDelete(Data device) {
//     final provider = Provider.of<TechModuleApiProvider>(context, listen: false);
//     provider.deleteTechDeviceWithoutNavigation(context, device.sId ?? '').then((_) {
//       if (provider.deleteTechDeviceModelResponse?.success == true) {
//         _refreshDevices();
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//             content: Text('Device "${device.ticketId}" deleted successfully'),
//             backgroundColor: Colors.green,
//           ),
//         );
//       }
//     });
//   }
//
//   String _formatDate(String? dateString) {
//     if (dateString == null) return 'N/A';
//     try {
//       final date = DateTime.parse(dateString);
//       return DateFormat('MMM dd, yyyy').format(date);
//     } catch (e) {
//       return 'N/A';
//     }
//   }
//
//   Color _getStatusColor(String? status) {
//     switch (status?.toLowerCase()) {
//       case 'open':
//       case 'new':
//         return Colors.blue;
//       case 'in progress':
//       case 'in-progress':
//       case 'pending':
//         return Colors.orange;
//       case 'resolved':
//       case 'closed':
//       case 'completed':
//         return Colors.green;
//       case 'cancelled':
//       case 'rejected':
//         return Colors.red;
//       case 'on hold':
//       case 'on-hold':
//         return Colors.purple;
//       default:
//         return Colors.grey;
//     }
//   }
//
//   Color _getPriorityColor(String? priority) {
//     switch (priority?.toLowerCase()) {
//       case 'high':
//       case 'urgent':
//       case 'critical':
//         return Colors.red;
//       case 'medium':
//       case 'normal':
//         return Colors.orange;
//       case 'low':
//         return Colors.green;
//       default:
//         return Colors.grey;
//     }
//   }
//
//   IconData _getPriorityIcon(String? priority) {
//     switch (priority?.toLowerCase()) {
//       case 'high':
//       case 'urgent':
//       case 'critical':
//         return Icons.keyboard_double_arrow_up;
//       case 'medium':
//       case 'normal':
//         return Icons.keyboard_arrow_up;
//       case 'low':
//         return Icons.keyboard_arrow_down;
//       default:
//         return Icons.remove;
//     }
//   }
//
//   IconData _getTicketTypeIcon(String? ticketType) {
//     switch (ticketType?.toLowerCase()) {
//       case 'hardware':
//         return Icons.computer;
//       case 'software':
//         return Icons.apps;
//       case 'network':
//         return Icons.wifi;
//       case 'security':
//         return Icons.security;
//       case 'access':
//         return Icons.vpn_key;
//       case 'maintenance':
//         return Icons.build;
//       case 'support':
//         return Icons.support_agent;
//       default:
//         return Icons.confirmation_number;
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.grey[50],
//       appBar: AppBar(
//         iconTheme: const IconThemeData(color: Colors.white),
//         backgroundColor: AppColors.primary,
//         title: Text(
//           'Ticket List',
//           style: AppTextStyles.heading2(
//             context,
//             overrideStyle: TextStyle(
//               color: AppColors.whiteColor,
//               fontSize: ResponsiveHelper.fontSize(context, 14),
//             ),
//           ),
//         ),
//         bottom: PreferredSize(
//           preferredSize: const Size.fromHeight(1),
//           child: Container(
//             height: 1,
//             decoration: BoxDecoration(
//               gradient: LinearGradient(
//                 colors: [Colors.grey[200]!, Colors.grey[100]!],
//               ),
//             ),
//           ),
//         ),
//         actions: [
//           IconButton(
//             onPressed: _refreshDevices,
//             icon: const Icon(Icons.refresh_rounded),
//             style: IconButton.styleFrom(),
//           ),
//           const SizedBox(width: 8),
//           const SizedBox(width: 16),
//         ],
//       ),
//       body: Column(
//         children: [
//           // Search Bar
//           Container(
//             padding: const EdgeInsets.all(16),
//             color: Colors.white,
//             child: Container(
//               decoration: BoxDecoration(
//                 color: Colors.grey[100],
//                 borderRadius: BorderRadius.circular(12),
//                 border: Border.all(color: Colors.grey[300]!),
//               ),
//               child: TextField(
//                 controller: _searchController,
//                 decoration: InputDecoration(
//                   hintText: 'Search tickets by ID, type, status, priority...',
//                   prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
//                   suffixIcon: _searchQuery.isNotEmpty
//                       ? IconButton(
//                     onPressed: () {
//                       _searchController.clear();
//                     },
//                     icon: Icon(Icons.clear, color: Colors.grey[600]),
//                   )
//                       : null,
//                   border: InputBorder.none,
//                   contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
//                 ),
//               ),
//             ),
//           ),
//
//           // Content
//           Expanded(
//             child: Consumer<TechModuleApiProvider>(
//               builder: (context, provider, child) {
//                 if (provider.isLoading && _allDevices.isEmpty) {
//                   return const Center(
//                     child: Column(
//                       mainAxisAlignment: MainAxisAlignment.center,
//                       children: [
//                         CircularProgressIndicator(strokeWidth: 3),
//                         SizedBox(height: 16),
//                         Text(
//                           'Loading data...',
//                           style: TextStyle(
//                             fontSize: 16,
//                             color: Colors.grey,
//                           ),
//                         ),
//                       ],
//                     ),
//                   );
//                 }
//
//                 if (_filteredDevices.isEmpty && !provider.isLoading) {
//                   return Center(
//                     child: Column(
//                       mainAxisAlignment: MainAxisAlignment.center,
//                       children: [
//                         Icon(
//                           Icons.confirmation_number_outlined,
//                           size: 80,
//                           color: Colors.grey[400],
//                         ),
//                         const SizedBox(height: 16),
//                         Text(
//                           _searchQuery.isNotEmpty ? 'No tickets found' : 'No tickets available',
//                           style: TextStyle(
//                             fontSize: 18,
//                             fontWeight: FontWeight.w500,
//                             color: Colors.grey[600],
//                           ),
//                         ),
//                         const SizedBox(height: 8),
//                         Text(
//                           _searchQuery.isNotEmpty
//                               ? 'Try adjusting your search terms'
//                               : 'No help desk tickets found',
//                           style: TextStyle(
//                             fontSize: 14,
//                             color: Colors.grey[500],
//                           ),
//                         ),
//                       ],
//                     ),
//                   );
//                 }
//
//                 return FadeTransition(
//                   opacity: _fadeAnimation,
//                   child: RefreshIndicator(
//                     onRefresh: () async => _refreshDevices(),
//                     child: ListView.builder(
//                       controller: _scrollController,
//                       padding: const EdgeInsets.all(16),
//                       itemCount: _filteredDevices.length + (_isLoadingMore ? 1 : 0),
//                       itemBuilder: (context, index) {
//                         if (index == _filteredDevices.length) {
//                           return const Padding(
//                             padding: EdgeInsets.all(16.0),
//                             child: Center(
//                               child: CircularProgressIndicator(strokeWidth: 2),
//                             ),
//                           );
//                         }
//
//                         final ticket = _filteredDevices[index];
//                         return TweenAnimationBuilder(
//                           tween: Tween<double>(begin: 0, end: 1),
//                           duration: Duration(milliseconds: 200 + (index * 50)),
//                           builder: (context, double value, child) {
//                             return Transform.translate(
//                               offset: Offset(0, 20 * (1 - value)),
//                               child: Opacity(
//                                 opacity: value,
//                                 child: _buildTicketCard(ticket, index),
//                               ),
//                             );
//                           },
//                         );
//                       },
//                     ),
//                   ),
//                 );
//               },
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// // Replace the _buildTicketCard method with this improved version
//   Widget _buildTicketCard(Data ticket, int index) {
//     return Container(
//       margin: const EdgeInsets.only(bottom: 16),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(20),
//         boxShadow: [
//           BoxShadow(
//             color: Colors.black.withOpacity(0.06),
//             blurRadius: 16,
//             offset: const Offset(0, 8),
//           ),
//           BoxShadow(
//             color: Colors.black.withOpacity(0.04),
//             blurRadius: 4,
//             offset: const Offset(0, 2),
//           ),
//         ],
//       ),
//       child: Material(
//         color: Colors.transparent,
//         borderRadius: BorderRadius.circular(20),
//         child: InkWell(
//           borderRadius: BorderRadius.circular(20),
//           onTap: () => _showTicketDetailsBottomSheet(ticket),
//           child: Container(
//             padding: const EdgeInsets.all(20),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 // Header Row
//                 Row(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     // Ticket Type Icon
//                     Container(
//                       padding: const EdgeInsets.all(14),
//                       decoration: BoxDecoration(
//                         gradient: LinearGradient(
//                           colors: [
//                             _getPriorityColor(ticket.priority),
//                             _getPriorityColor(ticket.priority).withOpacity(0.7),
//                           ],
//                           begin: Alignment.topLeft,
//                           end: Alignment.bottomRight,
//                         ),
//                         borderRadius: BorderRadius.circular(16),
//                         boxShadow: [
//                           BoxShadow(
//                             color: _getPriorityColor(ticket.priority).withOpacity(0.3),
//                             blurRadius: 8,
//                             offset: const Offset(0, 4),
//                           ),
//                         ],
//                       ),
//                       child: Icon(
//                         _getTicketTypeIcon(ticket.ticketType),
//                         color: Colors.white,
//                         size: 24,
//                       ),
//                     ),
//                     const SizedBox(width: 16),
//
//                     // Ticket Info
//                     Expanded(
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           // Ticket ID and Status Row
//                           Row(
//                             children: [
//                               Expanded(
//                                 child: Text(
//                                   ticket.ticketId ?? 'Unknown Ticket',
//                                   style: const TextStyle(
//                                     fontSize: 18,
//                                     fontWeight: FontWeight.bold,
//                                     color: Colors.black87,
//                                   ),
//                                 ),
//                               ),
//                               Container(
//                                 padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
//                                 decoration: BoxDecoration(
//                                   gradient: LinearGradient(
//                                     colors: [
//                                       _getStatusColor(ticket.status),
//                                       _getStatusColor(ticket.status).withOpacity(0.8),
//                                     ],
//                                   ),
//                                   borderRadius: BorderRadius.circular(20),
//                                   boxShadow: [
//                                     BoxShadow(
//                                       color: _getStatusColor(ticket.status).withOpacity(0.3),
//                                       blurRadius: 6,
//                                       offset: const Offset(0, 2),
//                                     ),
//                                   ],
//                                 ),
//                                 child: Text(
//                                   ticket.status?.toUpperCase() ?? 'UNKNOWN',
//                                   style: const TextStyle(
//                                     fontSize: 11,
//                                     fontWeight: FontWeight.bold,
//                                     color: Colors.white,
//                                     letterSpacing: 0.8,
//                                   ),
//                                 ),
//                               ),
//                             ],
//                           ),
//
//                           const SizedBox(height: 12),
//
//                           // Issue Description Preview
//                           if (ticket.issueDescription != null && ticket.issueDescription!.isNotEmpty)
//                             Text(
//                               ticket.issueDescription!,
//                               style: TextStyle(
//                                 fontSize: 14,
//                                 color: Colors.grey[700],
//                                 height: 1.4,
//                               ),
//                               maxLines: 2,
//                               overflow: TextOverflow.ellipsis,
//                             ),
//
//                           const SizedBox(height: 16),
//
//                           // Key Info Row
//                           Row(
//                             children: [
//                               // Priority Badge
//                               Container(
//                                 padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
//                                 decoration: BoxDecoration(
//                                   color: _getPriorityColor(ticket.priority).withOpacity(0.1),
//                                   borderRadius: BorderRadius.circular(12),
//                                   border: Border.all(
//                                     color: _getPriorityColor(ticket.priority).withOpacity(0.3),
//                                   ),
//                                 ),
//                                 child: Row(
//                                   mainAxisSize: MainAxisSize.min,
//                                   children: [
//                                     Icon(
//                                       _getPriorityIcon(ticket.priority),
//                                       size: 14,
//                                       color: _getPriorityColor(ticket.priority),
//                                     ),
//                                     const SizedBox(width: 6),
//                                     Text(
//                                       ticket.priority ?? 'Medium',
//                                       style: TextStyle(
//                                         fontSize: 12,
//                                         fontWeight: FontWeight.w600,
//                                         color: _getPriorityColor(ticket.priority),
//                                       ),
//                                     ),
//                                   ],
//                                 ),
//                               ),
//
//                               const SizedBox(width: 12),
//
//                               // Department Badge
//                               if (ticket.department != null)
//                                 Container(
//                                   padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
//                                   decoration: BoxDecoration(
//                                     color: Colors.blue.withOpacity(0.1),
//                                     borderRadius: BorderRadius.circular(12),
//                                     border: Border.all(
//                                       color: Colors.blue.withOpacity(0.3),
//                                     ),
//                                   ),
//                                   child: Text(
//                                     ticket.department!,
//                                     style: const TextStyle(
//                                       fontSize: 12,
//                                       fontWeight: FontWeight.w600,
//                                       color: Colors.blue,
//                                     ),
//                                   ),
//                                 ),
//                             ],
//                           ),
//
//                           const SizedBox(height: 16),
//
//                           // Bottom Info Row
//                           Row(
//                             children: [
//                               // Assigned to
//                               Expanded(
//                                 child: Row(
//                                   children: [
//                                     Container(
//                                       padding: const EdgeInsets.all(6),
//                                       decoration: BoxDecoration(
//                                         color: Colors.green.withOpacity(0.1),
//                                         borderRadius: BorderRadius.circular(8),
//                                       ),
//                                       child: Icon(
//                                         Icons.person_outline,
//                                         size: 16,
//                                         color: Colors.green[700],
//                                       ),
//                                     ),
//                                     const SizedBox(width: 8),
//                                     Expanded(
//                                       child: Column(
//                                         crossAxisAlignment: CrossAxisAlignment.start,
//                                         children: [
//                                           Text(
//                                             'Assigned to',
//                                             style: TextStyle(
//                                               fontSize: 11,
//                                               color: Colors.grey[600],
//                                               fontWeight: FontWeight.w500,
//                                             ),
//                                           ),
//                                           Text(
//                                             ticket.assignedTo ?? 'Unassigned',
//                                             style: const TextStyle(
//                                               fontSize: 13,
//                                               fontWeight: FontWeight.w600,
//                                               color: Colors.black87,
//                                             ),
//                                             maxLines: 1,
//                                             overflow: TextOverflow.ellipsis,
//                                           ),
//                                         ],
//                                       ),
//                                     ),
//                                   ],
//                                 ),
//                               ),
//
//                               const SizedBox(width: 16),
//
//                               // Created Date
//                               Row(
//                                 children: [
//                                   Container(
//                                     padding: const EdgeInsets.all(6),
//                                     decoration: BoxDecoration(
//                                       color: Colors.purple.withOpacity(0.1),
//                                       borderRadius: BorderRadius.circular(8),
//                                     ),
//                                     child: Icon(
//                                       Icons.schedule,
//                                       size: 16,
//                                       color: Colors.purple[700],
//                                     ),
//                                   ),
//                                   const SizedBox(width: 8),
//                                   Column(
//                                     crossAxisAlignment: CrossAxisAlignment.start,
//                                     children: [
//                                       Text(
//                                         'Created',
//                                         style: TextStyle(
//                                           fontSize: 11,
//                                           color: Colors.grey[600],
//                                           fontWeight: FontWeight.w500,
//                                         ),
//                                       ),
//                                       Text(
//                                         _formatDate(ticket.createdAt),
//                                         style: const TextStyle(
//                                           fontSize: 13,
//                                           fontWeight: FontWeight.w600,
//                                           color: Colors.black87,
//                                         ),
//                                       ),
//                                     ],
//                                   ),
//                                 ],
//                               ),
//                             ],
//                           ),
//
//                           // Attachment and View More Indicators
//                           const SizedBox(height: 16),
//                           Row(
//                             children: [
//                               // Attachment indicator
//                               if (ticket.attachment != null)
//                                 Container(
//                                   padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
//                                   decoration: BoxDecoration(
//                                     color: Colors.orange.withOpacity(0.1),
//                                     borderRadius: BorderRadius.circular(12),
//                                     border: Border.all(
//                                       color: Colors.orange.withOpacity(0.3),
//                                     ),
//                                   ),
//                                   child: Row(
//                                     mainAxisSize: MainAxisSize.min,
//                                     children: [
//                                       Icon(
//                                         Icons.attach_file,
//                                         size: 14,
//                                         color: Colors.orange[700],
//                                       ),
//                                       const SizedBox(width: 6),
//                                       Text(
//                                         'Attachment',
//                                         style: TextStyle(
//                                           fontSize: 12,
//                                           fontWeight: FontWeight.w600,
//                                           color: Colors.orange[700],
//                                         ),
//                                       ),
//                                     ],
//                                   ),
//                                 ),
//
//                               const Spacer(),
//
//                               // View More Button
//                               Container(
//                                 padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
//                                 decoration: BoxDecoration(
//                                   gradient: LinearGradient(
//                                     colors: [
//                                       AppColors.primary,
//                                       AppColors.primary.withOpacity(0.8),
//                                     ],
//                                   ),
//                                   borderRadius: BorderRadius.circular(12),
//                                   boxShadow: [
//                                     BoxShadow(
//                                       color: AppColors.primary.withOpacity(0.3),
//                                       blurRadius: 6,
//                                       offset: const Offset(0, 2),
//                                     ),
//                                   ],
//                                 ),
//                                 child: Row(
//                                   mainAxisSize: MainAxisSize.min,
//                                   children: const [
//                                     Text(
//                                       'View Details',
//                                       style: TextStyle(
//                                         fontSize: 12,
//                                         fontWeight: FontWeight.w600,
//                                         color: Colors.white,
//                                       ),
//                                     ),
//                                     SizedBox(width: 6),
//                                     Icon(
//                                       Icons.arrow_forward_ios,
//                                       size: 12,
//                                       color: Colors.white,
//                                     ),
//                                   ],
//                                 ),
//                               ),
//                             ],
//                           ),
//                         ],
//                       ),
//                     ),
//                   ],
//                 ),
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }
//
// // Add this method for showing bottom sheet with complete details
//   void _showTicketDetailsBottomSheet(Data ticket) {
//     showModalBottomSheet(
//       context: context,
//       isScrollControlled: true,
//       backgroundColor: Colors.transparent,
//       builder: (context) => DraggableScrollableSheet(
//         initialChildSize: 0.8,
//         maxChildSize: 0.95,
//         minChildSize: 0.5,
//         builder: (context, scrollController) => Container(
//           decoration: const BoxDecoration(
//             color: Colors.white,
//             borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
//           ),
//           child: Column(
//             children: [
//               // Handle Bar
//               Container(
//                 margin: const EdgeInsets.only(top: 12, bottom: 8),
//                 width: 60,
//                 height: 4,
//                 decoration: BoxDecoration(
//                   color: Colors.grey[300],
//                   borderRadius: BorderRadius.circular(2),
//                 ),
//               ),
//
//               // Header
//               Container(
//                 padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
//                 child: Row(
//                   children: [
//                     Container(
//                       padding: const EdgeInsets.all(12),
//                       decoration: BoxDecoration(
//                         gradient: LinearGradient(
//                           colors: [
//                             _getPriorityColor(ticket.priority),
//                             _getPriorityColor(ticket.priority).withOpacity(0.7),
//                           ],
//                         ),
//                         borderRadius: BorderRadius.circular(16),
//                       ),
//                       child: Icon(
//                         _getTicketTypeIcon(ticket.ticketType),
//                         color: Colors.white,
//                         size: 28,
//                       ),
//                     ),
//                     const SizedBox(width: 16),
//                     Expanded(
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Text(
//                             ticket.ticketId ?? 'Unknown Ticket',
//                             style: const TextStyle(
//                               fontSize: 22,
//                               fontWeight: FontWeight.bold,
//                               color: Colors.black87,
//                             ),
//                           ),
//                           const SizedBox(height: 4),
//                           Container(
//                             padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
//                             decoration: BoxDecoration(
//                               gradient: LinearGradient(
//                                 colors: [
//                                   _getStatusColor(ticket.status),
//                                   _getStatusColor(ticket.status).withOpacity(0.8),
//                                 ],
//                               ),
//                               borderRadius: BorderRadius.circular(20),
//                             ),
//                             child: Text(
//                               ticket.status?.toUpperCase() ?? 'UNKNOWN',
//                               style: const TextStyle(
//                                 fontSize: 12,
//                                 fontWeight: FontWeight.bold,
//                                 color: Colors.white,
//                                 letterSpacing: 0.8,
//                               ),
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                     IconButton(
//                       onPressed: () => Navigator.pop(context),
//                       icon: const Icon(Icons.close),
//                       style: IconButton.styleFrom(
//                         backgroundColor: Colors.grey[100],
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//
//               // Content
//               Expanded(
//                 child: ListView(
//                   controller: scrollController,
//                   padding: const EdgeInsets.all(24),
//                   children: [
//                     // Issue Description
//                     if (ticket.issueDescription != null && ticket.issueDescription!.isNotEmpty)
//                       _buildBottomSheetSection(
//                         'Issue Description',
//                         Icons.description_outlined,
//                         Colors.blue,
//                         child: Text(
//                           ticket.issueDescription!,
//                           style: const TextStyle(
//                             fontSize: 16,
//                             color: Colors.black87,
//                             height: 1.5,
//                           ),
//                         ),
//                       ),
//
//                     const SizedBox(height: 24),
//
//                     // Attachment Preview
//                     if (ticket.attachment != null)
//                       _buildAttachmentPreview(ticket.attachment!),
//
//                     const SizedBox(height: 24),
//
//                     // Ticket Details Grid
//                     _buildBottomSheetSection(
//                       'Ticket Details',
//                       Icons.info_outline,
//                       Colors.purple,
//                       child: Column(
//                         children: [
//                           _buildDetailRow('Ticket Type', ticket.ticketType ?? 'N/A', Icons.category_outlined),
//                           _buildDetailRow('Priority', ticket.priority ?? 'N/A', _getPriorityIcon(ticket.priority)),
//                           _buildDetailRow('Raised By', ticket.raisedBy ?? 'N/A', Icons.person_outline),
//                           _buildDetailRow('Department', ticket.department ?? 'N/A', Icons.business_outlined),
//                           _buildDetailRow('Role', ticket.role ?? 'N/A', Icons.work_outline),
//                           _buildDetailRow('Assigned To', ticket.assignedTo ?? 'Unassigned', Icons.assignment_ind_outlined),
//                           if (ticket.employeeId != null)
//                             _buildDetailRow('Employee ID', ticket.employeeId!, Icons.badge_outlined),
//                           if (ticket.slaTimer != null)
//                             _buildDetailRow('SLA Timer', ticket.slaTimer!, Icons.timer_outlined),
//                         ],
//                       ),
//                     ),
//
//                     const SizedBox(height: 24),
//
//                     // Timestamps
//                     _buildBottomSheetSection(
//                       'Timeline',
//                       Icons.schedule_outlined,
//                       Colors.orange,
//                       child: Column(
//                         children: [
//                           _buildDetailRow('Created', _formatDate(ticket.createdAt), Icons.calendar_today_outlined),
//                           _buildDetailRow('Last Updated', _formatDate(ticket.updatedAt), Icons.update_outlined),
//                         ],
//                       ),
//                     ),
//
//                     // Resolution Notes
//                     if (ticket.resolutionNotes != null && ticket.resolutionNotes!.isNotEmpty) ...[
//                       const SizedBox(height: 24),
//                       _buildBottomSheetSection(
//                         'Resolution Notes',
//                         Icons.check_circle_outline,
//                         Colors.green,
//                         child: Text(
//                           ticket.resolutionNotes!,
//                           style: const TextStyle(
//                             fontSize: 16,
//                             color: Colors.black87,
//                             height: 1.5,
//                           ),
//                         ),
//                       ),
//                     ],
//
//                     // History
//                     if (ticket.history != null && ticket.history!.isNotEmpty) ...[
//                       const SizedBox(height: 24),
//                       _buildBottomSheetSection(
//                         'History',
//                         Icons.history_outlined,
//                         Colors.indigo,
//                         child: Column(
//                           children: ticket.history!.map((history) => _buildHistoryItem(history)).toList(),
//                         ),
//                       ),
//                     ],
//
//                     const SizedBox(height: 100), // Extra space for better scrolling
//                   ],
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
//
// // Helper method for bottom sheet sections
//   Widget _buildBottomSheetSection(String title, IconData icon, Color color, {required Widget child}) {
//     return Container(
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(16),
//         border: Border.all(color: color.withOpacity(0.2)),
//         boxShadow: [
//           BoxShadow(
//             color: Colors.black.withOpacity(0.05),
//             blurRadius: 8,
//             offset: const Offset(0, 2),
//           ),
//         ],
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Container(
//             padding: const EdgeInsets.all(16),
//             decoration: BoxDecoration(
//               color: color.withOpacity(0.1),
//               borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
//             ),
//             child: Row(
//               children: [
//                 Icon(icon, color: color, size: 24),
//                 const SizedBox(width: 12),
//                 Text(
//                   title,
//                   style: TextStyle(
//                     fontSize: 18,
//                     fontWeight: FontWeight.bold,
//                     color: color,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//           Padding(
//             padding: const EdgeInsets.all(16),
//             child: child,
//           ),
//         ],
//       ),
//     );
//   }
//
// // Helper method for detail rows
//   Widget _buildDetailRow(String label, String value, IconData icon) {
//     return Padding(
//       padding: const EdgeInsets.only(bottom: 16),
//       child: Row(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Container(
//             padding: const EdgeInsets.all(8),
//             decoration: BoxDecoration(
//               color: Colors.grey.withOpacity(0.1),
//               borderRadius: BorderRadius.circular(8),
//             ),
//             child: Icon(icon, size: 20, color: Colors.grey[700]),
//           ),
//           const SizedBox(width: 16),
//           Expanded(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   label,
//                   style: TextStyle(
//                     fontSize: 14,
//                     color: Colors.grey[600],
//                     fontWeight: FontWeight.w500,
//                   ),
//                 ),
//                 const SizedBox(height: 4),
//                 Text(
//                   value,
//                   style: const TextStyle(
//                     fontSize: 16,
//                     color: Colors.black87,
//                     fontWeight: FontWeight.w600,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
//
// // Attachment preview widget
// // Updated attachment preview widget
//   Widget _buildAttachmentPreview(Attachment attachment) {
//     return _buildBottomSheetSection(
//       'Attachment',
//       Icons.attach_file_outlined,
//       Colors.orange,
//       child: Column(
//         children: [
//           if (attachment.type?.toLowerCase().contains('image') == true)
//             GestureDetector(
//               onTap: () => _showFullScreenImage(attachment.url ?? ''),
//               child: Container(
//                 height: 250,
//                 width: double.infinity,
//                 decoration: BoxDecoration(
//                   borderRadius: BorderRadius.circular(12),
//                   border: Border.all(color: Colors.grey[300]!),
//                 ),
//                 child: ClipRRect(
//                   borderRadius: BorderRadius.circular(12),
//                   child: Image.network(
//                     attachment.url ?? '',
//                     fit: BoxFit.cover,
//                     errorBuilder: (context, error, stackTrace) => Container(
//                       color: Colors.grey[100],
//                       child: const Center(
//                         child: Column(
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             Icon(Icons.broken_image, size: 50, color: Colors.grey),
//                             SizedBox(height: 8),
//                             Text('Failed to load image', style: TextStyle(color: Colors.grey)),
//                           ],
//                         ),
//                       ),
//                     ),
//                     loadingBuilder: (context, child, loadingProgress) {
//                       if (loadingProgress == null) return child;
//                       return Container(
//                         color: Colors.grey[100],
//                         child: Center(
//                           child: CircularProgressIndicator(
//                             value: loadingProgress.expectedTotalBytes != null
//                                 ? loadingProgress.cumulativeBytesLoaded /
//                                 loadingProgress.expectedTotalBytes!
//                                 : null,
//                           ),
//                         ),
//                       );
//                     },
//                   ),
//                 ),
//               ),
//             )
//           else if (attachment.type?.toLowerCase().contains('video') == true)
//             GestureDetector(
//               onTap: () => _playVideo(attachment.url ?? ''),
//               child: Container(
//                 height: 250,
//                 width: double.infinity,
//                 decoration: BoxDecoration(
//                   borderRadius: BorderRadius.circular(12),
//                   border: Border.all(color: Colors.grey[300]!),
//                   color: Colors.black87,
//                 ),
//                 child: Stack(
//                   alignment: Alignment.center,
//                   children: [
//                     // Video thumbnail placeholder or actual thumbnail if available
//                     Container(
//                       decoration: BoxDecoration(
//                         borderRadius: BorderRadius.circular(12),
//                         gradient: LinearGradient(
//                           begin: Alignment.topCenter,
//                           end: Alignment.bottomCenter,
//                           colors: [
//                             Colors.black54,
//                             Colors.black87,
//                           ],
//                         ),
//                       ),
//                       child: Center(
//                         child: Column(
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             Container(
//                               padding: const EdgeInsets.all(20),
//                               decoration: BoxDecoration(
//                                 color: Colors.white.withOpacity(0.9),
//                                 shape: BoxShape.circle,
//                                 boxShadow: [
//                                   BoxShadow(
//                                     color: Colors.black.withOpacity(0.3),
//                                     blurRadius: 10,
//                                     spreadRadius: 2,
//                                   ),
//                                 ],
//                               ),
//                               child: const Icon(
//                                 Icons.play_arrow,
//                                 size: 40,
//                                 color: Colors.black87,
//                               ),
//                             ),
//                             const SizedBox(height: 12),
//                             Text(
//                               'Tap to play video',
//                               style: TextStyle(
//                                 fontSize: 16,
//                                 fontWeight: FontWeight.w600,
//                                 color: Colors.white,
//                                 shadows: [
//                                   Shadow(
//                                     color: Colors.black.withOpacity(0.7),
//                                     blurRadius: 4,
//                                   ),
//                                 ],
//                               ),
//                             ),
//                           ],
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             )
//           else
//             Container(
//               padding: const EdgeInsets.all(16),
//               decoration: BoxDecoration(
//                 borderRadius: BorderRadius.circular(12),
//                 border: Border.all(color: Colors.grey[300]!),
//                 color: Colors.grey[50],
//               ),
//               child: Row(
//                 children: [
//                   Container(
//                     padding: const EdgeInsets.all(12),
//                     decoration: BoxDecoration(
//                       color: Colors.blue.withOpacity(0.1),
//                       borderRadius: BorderRadius.circular(8),
//                     ),
//                     child: Icon(
//                       _getFileIcon(attachment.type),
//                       size: 32,
//                       color: Colors.blue[700],
//                     ),
//                   ),
//                   const SizedBox(width: 16),
//                   Expanded(
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         Text(
//                           attachment.name ?? 'Unknown File',
//                           style: const TextStyle(
//                             fontSize: 16,
//                             fontWeight: FontWeight.w600,
//                             color: Colors.black87,
//                           ),
//                           maxLines: 2,
//                           overflow: TextOverflow.ellipsis,
//                         ),
//                         const SizedBox(height: 4),
//                         Text(
//                           attachment.type ?? 'Unknown Type',
//                           style: TextStyle(
//                             fontSize: 14,
//                             color: Colors.grey[600],
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                   // Container(
//                   //   decoration: BoxDecoration(
//                   //     color: Colors.blue.withOpacity(0.1),
//                   //     borderRadius: BorderRadius.circular(8),
//                   //   ),
//                   //   child: IconButton(
//                   //     onPressed: () => _openUrlInBrowser(attachment.url ?? ''),
//                   //     icon: const Icon(Icons.download_rounded),
//                   //     color: Colors.blue[700],
//                   //   ),
//                   // ),
//                 ],
//               ),
//             ),
//
//           const SizedBox(height: 16),
//
//           // File details
//           Container(
//             padding: const EdgeInsets.all(12),
//             decoration: BoxDecoration(
//               color: Colors.grey[100],
//               borderRadius: BorderRadius.circular(8),
//             ),
//             child: Column(
//               children: [
//                 Row(
//                   children: [
//                     Icon(Icons.label_outline, size: 18, color: Colors.grey[600]),
//                     const SizedBox(width: 8),
//                     Text(
//                       'File Name: ',
//                       style: TextStyle(
//                         fontSize: 14,
//                         color: Colors.grey[600],
//                         fontWeight: FontWeight.w500,
//                       ),
//                     ),
//                     Expanded(
//                       child: Text(
//                         attachment.name ?? 'N/A',
//                         style: const TextStyle(
//                           fontSize: 14,
//                           color: Colors.black87,
//                           fontWeight: FontWeight.w600,
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//                 if (attachment.type != null) ...[
//                   const SizedBox(height: 8),
//                   Row(
//                     children: [
//                       Icon(Icons.category_outlined, size: 18, color: Colors.grey[600]),
//                       const SizedBox(width: 8),
//                       Text(
//                         'File Type: ',
//                         style: TextStyle(
//                           fontSize: 14,
//                           color: Colors.grey[600],
//                           fontWeight: FontWeight.w500,
//                         ),
//                       ),
//                       Expanded(
//                         child: Text(
//                           attachment.type!,
//                           style: const TextStyle(
//                             fontSize: 14,
//                             color: Colors.black87,
//                             fontWeight: FontWeight.w600,
//                           ),
//                         ),
//                       ),
//                     ],
//                   ),
//                 ],
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
//
// // Method to show full screen image
//   void _showFullScreenImage(String imageUrl) {
//     showDialog(
//       context: context,
//       // backgroundColor: Colors.black,
//       builder: (context) => Dialog.fullscreen(
//         backgroundColor: Colors.white,
//         child: Stack(
//           children: [
//             Center(
//               child: InteractiveViewer(
//                 panEnabled: true,
//                 boundaryMargin: const EdgeInsets.all(20),
//                 minScale: 0.5,
//                 maxScale: 4.0,
//                 child: Image.network(
//                   imageUrl,
//                   fit: BoxFit.contain,
//                   errorBuilder: (context, error, stackTrace) => const Center(
//                     child: Column(
//                       mainAxisAlignment: MainAxisAlignment.center,
//                       children: [
//                         Icon(Icons.broken_image, size: 80, color: Colors.white54),
//                         SizedBox(height: 16),
//                         Text(
//                           'Failed to load image',
//                           style: TextStyle(color: Colors.white54, fontSize: 18),
//                         ),
//                       ],
//                     ),
//                   ),
//                   loadingBuilder: (context, child, loadingProgress) {
//                     if (loadingProgress == null) return child;
//                     return Center(
//                       child: CircularProgressIndicator(
//                         value: loadingProgress.expectedTotalBytes != null
//                             ? loadingProgress.cumulativeBytesLoaded /
//                             loadingProgress.expectedTotalBytes!
//                             : null,
//                         color: Colors.white,
//                       ),
//                     );
//                   },
//                 ),
//               ),
//             ),
//             Positioned(
//               top: 50,
//               right: 20,
//               child: Container(
//                 decoration: BoxDecoration(
//                   color: Colors.black54,
//                   borderRadius: BorderRadius.circular(20),
//                 ),
//                 child: IconButton(
//                   onPressed: () => Navigator.pop(context),
//                   icon: const Icon(Icons.close, color: Colors.white, size: 28),
//                 ),
//               ),
//             ),
//             Positioned(
//               bottom: 50,
//               left: 20,
//               right: 20,
//               child: Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
//                 decoration: BoxDecoration(
//                   color: Colors.black54,
//                   borderRadius: BorderRadius.circular(25),
//                 ),
//                 child: const Text(
//                   'Pinch to zoom • Drag to pan • Tap close to exit',
//                   textAlign: TextAlign.center,
//                   style: TextStyle(
//                     color: Colors.white,
//                     fontSize: 14,
//                     fontWeight: FontWeight.w500,
//                   ),
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
//
// // Method to play video (you'll need to implement based on your video player)
//   void _playVideo(String videoUrl) {
//     // You can use video_player package or any other video player
//     // For now, I'll show a placeholder implementation
//     showDialog(
//       context: context,
//       builder: (context) => AlertDialog(
//         shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
//         title: Row(
//           children: [
//             const Icon(Icons.play_circle_outline, color: Colors.blue),
//             const SizedBox(width: 12),
//             const Text('Video Player'),
//           ],
//         ),
//         content: Column(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             Container(
//               height: 200,
//               width: double.infinity,
//               decoration: BoxDecoration(
//                 color: Colors.black87,
//                 borderRadius: BorderRadius.circular(12),
//               ),
//               child: const Center(
//                 child: Column(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     Icon(Icons.play_circle_outline, size: 60, color: Colors.white),
//                     SizedBox(height: 12),
//                     Text(
//                       'Video Player Integration Required',
//                       style: TextStyle(color: Colors.white, fontSize: 16),
//                       textAlign: TextAlign.center,
//                     ),
//                     SizedBox(height: 8),
//                     Text(
//                       'Add video_player package to play videos',
//                       style: TextStyle(color: Colors.white70, fontSize: 14),
//                       textAlign: TextAlign.center,
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//             const SizedBox(height: 16),
//             Text(
//               'Video URL: $videoUrl',
//               style: TextStyle(
//                 fontSize: 12,
//                 color: Colors.grey[600],
//               ),
//               maxLines: 2,
//               overflow: TextOverflow.ellipsis,
//             ),
//           ],
//         ),
//         actions: [
//           TextButton(
//             onPressed: () => Navigator.pop(context),
//             child: const Text('Close'),
//           ),
//           ElevatedButton(
//             onPressed: () {
//               Navigator.pop(context);
//               // Implement actual video playing logic here
//               // You can use url_launcher to open in external player
//               // or integrate video_player package for in-app playback
//             },
//             child: const Text('Open in Browser'),
//           ),
//         ],
//       ),
//     );
//   }
//
// // Method to download file
//   void _downloadFile(Attachment attachment) {
//     // Implement file download logic
//     ScaffoldMessenger.of(context).showSnackBar(
//       SnackBar(
//         content: Text('Downloading ${attachment.name ?? 'file'}...'),
//         backgroundColor: Colors.blue,
//         action: SnackBarAction(
//           label: 'Open',
//           textColor: Colors.white,
//           onPressed: () {
//             // Implement file opening logic
//           },
//         ),
//       ),
//     );
//   }
//
// // Helper method to get appropriate file icon
//   IconData _getFileIcon(String? fileType) {
//     if (fileType == null) return Icons.insert_drive_file;
//
//     final type = fileType.toLowerCase();
//
//     if (type.contains('pdf')) return Icons.picture_as_pdf;
//     if (type.contains('word') || type.contains('doc')) return Icons.description;
//     if (type.contains('excel') || type.contains('spreadsheet')) return Icons.table_chart;
//     if (type.contains('powerpoint') || type.contains('presentation')) return Icons.slideshow;
//     if (type.contains('zip') || type.contains('rar')) return Icons.archive;
//     if (type.contains('audio')) return Icons.audiotrack;
//     if (type.contains('text')) return Icons.text_snippet;
//
//     return Icons.insert_drive_file;
//   }
//
// // History item widget
//   Widget _buildHistoryItem(History history) {
//     return Container(
//       margin: const EdgeInsets.only(bottom: 16),
//       padding: const EdgeInsets.all(16),
//       decoration: BoxDecoration(
//         color: Colors.grey[50],
//         borderRadius: BorderRadius.circular(12),
//         border: Border.all(color: Colors.grey[200]!),
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Row(
//             children: [
//               Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
//                 decoration: BoxDecoration(
//                   color: _getStatusColor(history.status).withOpacity(0.1),
//                   borderRadius: BorderRadius.circular(8),
//                 ),
//                 child: Text(
//                   history.status ?? 'Unknown Status',
//                   style: TextStyle(
//                     fontSize: 12,
//                     fontWeight: FontWeight.w600,
//                     color: _getStatusColor(history.status),
//                   ),
//                 ),
//               ),
//               const Spacer(),
//               Text(
//                 _formatDate(history.updatedAt),
//                 style: TextStyle(
//                   fontSize: 12,
//                   color: Colors.grey[600],
//                 ),
//               ),
//             ],
//           ),
//           if (history.resolutionNotes != null && history.resolutionNotes!.isNotEmpty) ...[
//             const SizedBox(height: 12),
//             Text(
//               history.resolutionNotes!,
//               style: const TextStyle(
//                 fontSize: 14,
//                 color: Colors.black87,
//                 height: 1.4,
//               ),
//             ),
//           ],
//           if (history.updatedBy != null) ...[
//             const SizedBox(height: 8),
//             Row(
//               children: [
//                 Icon(Icons.person_outline, size: 16, color: Colors.grey[600]),
//                 const SizedBox(width: 6),
//                 Text(
//                   'Updated by: ${history.updatedBy}',
//                   style: TextStyle(
//                     fontSize: 13,
//                     color: Colors.grey[600],
//                     fontStyle: FontStyle.italic,
//                   ),
//                 ),
//               ],
//             ),
//           ],
//         ],
//       ),
//     );
//   }
// }