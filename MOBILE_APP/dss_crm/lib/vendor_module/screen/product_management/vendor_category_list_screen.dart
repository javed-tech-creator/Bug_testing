import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dss_crm/vendor_module/model/category_management/vendor_categories_list_model.dart';

import '../../../ui_helper/app_text_styles.dart';
import '../../controller/vendor_api_provider.dart';

class VendorCategoryLIstScreen extends StatefulWidget {
  const VendorCategoryLIstScreen({super.key});

  @override
  State<VendorCategoryLIstScreen> createState() =>
      _VendorCategoryLIstScreenState();
}

class _VendorCategoryLIstScreenState
    extends State<VendorCategoryLIstScreen>
    with TickerProviderStateMixin {
  final TextEditingController _categoryController = TextEditingController();
  final TextEditingController _searchController = TextEditingController();
  late AnimationController _animationController;
  bool _isGridView = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _searchController.addListener(_onSearchChanged);

    // Fetch categories when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchCategories();
    });
  }

  void _fetchCategories() {
    final provider = Provider.of<VendorModuleApiProvider>(
      context,
      listen: false,
    );
    provider.getAllVendorCategoryList(context);
  }

  @override
  void dispose() {
    _animationController.dispose();
    _categoryController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text.toLowerCase();
    });
  }

  List<Data> _getFilteredCategories(List<Data> categories) {
    if (_searchQuery.isEmpty) return categories;
    return categories
        .where(
          (category) =>
              (category.categoryName?.toLowerCase().contains(_searchQuery) ??
              false),
        )
        .toList();
  }

  // Unified dialog method for both add and edit
  void _showCategoryDialog({Data? category}) {
    final bool isEditing = category != null;

    // Pre-fill the text field if editing
    if (isEditing) {
      _categoryController.text = category.categoryName ?? '';
    } else {
      _categoryController.clear();
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          color: Colors.white,
          padding: ResponsiveHelper.paddingAll(context, 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.orange.withAlpha(30),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      isEditing ? Icons.edit : Icons.add_circle_outline,
                      color: Colors.orange,
                      size: ResponsiveHelper.iconSize(context, 20),
                    ),
                  ),
                  ResponsiveHelper.sizedBoxWidth(context, 16),
                  Text(
                    isEditing ? 'Edit Category' : 'Add New Category',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              // const SizedBox(height: 24),
              ResponsiveHelper.sizedBoxHeight(context, 22),
              TextField(
                controller: _categoryController,
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'Enter category name',
                  prefixIcon: const Icon(Icons.folder_open),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(
                      color: Colors.orange,
                      width: 2,
                    ),
                  ),
                  filled: true,
                  fillColor: Colors.grey.shade50,
                ),
              ),
              ResponsiveHelper.sizedBoxHeight(context, 22),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                        _categoryController.clear();
                      },
                      style: OutlinedButton.styleFrom(
                        padding: ResponsiveHelper.paddingSymmetric(
                          context,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Cancel',
                        style: AppTextStyles.heading2(
                          context,
                          overrideStyle: TextStyle(
                            fontSize: ResponsiveHelper.fontSize(context, 12),
                          ),
                        ),
                      ),
                    ),
                  ),
                  // const SizedBox(width: 12),
                  ResponsiveHelper.sizedBoxWidth(context, 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _handleCategorySubmit(category),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange,
                        foregroundColor: Colors.white,
                        padding: ResponsiveHelper.paddingSymmetric(
                          context,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        isEditing ? 'Update' : 'Add',
                        style: AppTextStyles.heading2(
                          context,
                          overrideStyle: TextStyle(
                            color: Colors.white,
                            fontSize: ResponsiveHelper.fontSize(context, 12),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Delete Confirmation Dialog
  void _showDeleteDialog(Data? category) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          color: Colors.white,
          padding: ResponsiveHelper.paddingAll(context, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Warning Icon
              Container(
                padding: ResponsiveHelper.paddingAll(context, 12),
                decoration: BoxDecoration(
                  color: Colors.red.withAlpha(30),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.delete_forever,
                  color: Colors.red,
                  size: ResponsiveHelper.iconSize(context, 30),
                ),
              ),
              // const SizedBox(height: 16),
              ResponsiveHelper.sizedBoxHeight(context, 16),

              // Title
              Text(
                'Delete Category',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),

              ResponsiveHelper.sizedBoxHeight(context, 12),

              // Message
              Text(
                "Are you sure you want to delete '${category?.categoryName ?? ""}'?",
                textAlign: TextAlign.center,
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 14),
                  ),
                ),
              ),

              ResponsiveHelper.sizedBoxHeight(context, 22),

              // Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      style: OutlinedButton.styleFrom(
                        padding: ResponsiveHelper.paddingSymmetric(
                          context,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Cancel',
                        style: AppTextStyles.heading2(
                          context,
                          overrideStyle: TextStyle(
                            fontSize: ResponsiveHelper.fontSize(context, 12),
                          ),
                        ),
                      ),
                    ),
                  ),
                  ResponsiveHelper.sizedBoxWidth(context, 22),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pop(); // close dialog
                        _handleDeleteCategory(category); // 👈 delete handler
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        padding: ResponsiveHelper.paddingSymmetric(
                          context,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Delete',
                        style: AppTextStyles.heading2(
                          context,
                          overrideStyle: TextStyle(
                            color: Colors.white,
                            fontSize: ResponsiveHelper.fontSize(context, 12),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _handleDeleteCategory(Data? category) {
    if (category == null || category.sId == null) {
      debugPrint("Category deletion failed: Category or ID is null");
      return;
    }

    final provider = Provider.of<VendorModuleApiProvider>(
      context,
      listen: false,
    );

    // Call delete API with category ID
    provider
        .deleteVendorCategory(context, category.sId!)
        .then((_) {
          // Refresh the category list after successful deletion
          _fetchCategories();

          // Show success message (optional)
          // ScaffoldMessenger.of(context).showSnackBar(
          //   SnackBar(
          //     content: Text('${category.categoryName} deleted successfully'),
          //     backgroundColor: Colors.green,
          //     duration: const Duration(seconds: 2),
          //   ),
          // );
        })
        .catchError((error) {
          // Handle error
          debugPrint("Category deletion failed: $error");

          // Show error message
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Failed to delete category'),
              backgroundColor: Colors.red,
              duration: const Duration(seconds: 2),
            ),
          );
        });
  }

  // Unified submit handler for both add and edit operations
  void _handleCategorySubmit(Data? category) {
    final String categoryName = _categoryController.text.trim();

    if (categoryName.isEmpty) return;

    final provider = Provider.of<VendorModuleApiProvider>(
      context,
      listen: false,
    );

    final Map<String, dynamic> body = {
      'categoryName': categoryName,
      // Add other required fields based on your API requirements
    };

    Future<void> apiCall;

    if (category != null) {
      // Update existing category
      apiCall = provider.updateVendorCategory(
        context,
        body,
        category.sId ?? "",
      );
    } else {
      // Add new category
      apiCall = provider.addVendorCategory(context, body, "");
    }

    apiCall
        .then((_) {
          _fetchCategories(); // Refresh the category list
          _categoryController.clear();
          Navigator.of(context).pop();
        })
        .catchError((error) {
          // Handle error if needed
          debugPrint("Category operation failed: $error");
        });
  }

  // Helper method to get icon and color for category
  Map<String, dynamic> _getCategoryStyle(String categoryName, int index) {
    final List<Color> sequentialColors = [
      Colors.blue, // Color 1
      Colors.green, // Color 2
      Colors.orange, // Color 3
      Colors.purple, // Color 4
      Colors.teal, // Color 5
    ];

    final Map<String, Map<String, dynamic>> categoryStyles = {
      'strip light': {'icon': Icons.lightbulb_outline},
      'wire': {'icon': Icons.cable},
      'module': {'icon': Icons.memory},
      'silicon': {'icon': Icons.science},
      'glue': {'icon': Icons.format_paint},
      'double tape': {'icon': Icons.content_cut},
      'blockout tape': {'icon': Icons.block},
      'power supply': {'icon': Icons.power},
      'adapter': {'icon': Icons.power_settings_new},
      'neon light': {'icon': Icons.wb_incandescent},
      'led': {'icon': Icons.lightbulb},
      'controller': {'icon': Icons.control_camera},
      'battery': {'icon': Icons.battery_full},
      'sensor': {'icon': Icons.sensors},
      'display': {'icon': Icons.monitor},
      'connector': {'icon': Icons.settings_input_component},
      'resistor': {'icon': Icons.electrical_services},
      'capacitor': {'icon': Icons.circle},
      'switch': {'icon': Icons.toggle_on},
      'relay': {'icon': Icons.sync_alt},
      'circuit': {'icon': Icons.account_tree},
      'board': {'icon': Icons.developer_board},
      'chip': {'icon': Icons.memory},
      'cable': {'icon': Icons.cable},
      'tool': {'icon': Icons.build},
      'part': {'icon': Icons.extension},
    };

    String key = categoryName.toLowerCase();
    IconData? icon;

    // First try exact match for icon
    if (categoryStyles.containsKey(key)) {
      icon = categoryStyles[key]!['icon'];
    }
    // Then try partial matches for better coverage
    if (icon == null) {
      for (String styleKey in categoryStyles.keys) {
        if (key.contains(styleKey) || styleKey.contains(key)) {
          icon = categoryStyles[styleKey]!['icon'];
          break;
        }
      }
    }

    // Fallback to a default icon if no match found
    icon ??= Icons.category;

    // Use the index to get a color from the cyclical list
    final Color cyclicalColor = sequentialColors[index % sequentialColors.length];

    return {
      'icon': icon,
      'color': cyclicalColor,
    };
  }

  Widget _buildGridCategoryItem(BuildContext context,Data category, int index) {
    final style = _getCategoryStyle(category.categoryName ?? '', index);

    return Card(
      elevation: 2,
      shadowColor: Colors.black.withAlpha(30),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: () => print('Selected ${category.categoryName}'),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: ResponsiveHelper.paddingAll(context, 14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                style['color'].withOpacity(0.1),
                style['color'].withOpacity(0.05),
              ],
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: ResponsiveHelper.paddingAll(context, 8),
                    decoration: BoxDecoration(
                      color: style['color'].withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      style['icon'],
                      color: style['color'],
                      size: ResponsiveHelper.iconSize(context, 20),
                    ),
                  ),
                  PopupMenuButton<String>(
                    color: Colors.white,
                    icon: Icon(
                      Icons.more_vert,
                      color: Colors.grey.shade600,
                      size: ResponsiveHelper.iconSize(context, 20),
                    ),
                    onSelected: (value) {
                      if (value == 'edit') {
                        _showCategoryDialog(category: category);
                      } else if (value == 'delete') {
                        // Implement delete functionality if needed
                        print('Delete ${category.categoryName}');
                        _showDeleteDialog(category);
                      }
                    },
                    itemBuilder: (BuildContext context) => [
                      PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: [
                            Icon(
                              Icons.edit,
                              size: ResponsiveHelper.iconSize(context, 16),
                            ),
                            SizedBox(width: 8),
                            Text(
                              'Edit',
                              style: AppTextStyles.heading2(
                                context,
                                overrideStyle: TextStyle(
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    12,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(
                              Icons.delete,
                              size: ResponsiveHelper.iconSize(context, 16),
                              color: Colors.red,
                            ),
                            SizedBox(width: 8),
                            Text(
                              'Delete',
                              style: AppTextStyles.heading2(
                                context,
                                overrideStyle: TextStyle(
                                  color: Colors.red,
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    12,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              ResponsiveHelper.sizedBoxHeight(context, 12),
              Text(
                "${category.categoryName ?? 'Unknown'}",
                style: AppTextStyles.heading1(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                "${category.productCount ?? 'N/A'}",
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildListCategoryItem(BuildContext context , Data category,int index) {
    final style = _getCategoryStyle(category.categoryName ?? '',index);

    return Card(
      elevation: 1,
      color: Colors.white,
      margin: ResponsiveHelper.paddingOnly(context, bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: ResponsiveHelper.paddingAll(context, 8),
          decoration: BoxDecoration(
            color: style['color'].withOpacity(0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            style['icon'],
            color: style['color'],
            size: ResponsiveHelper.iconSize(context, 20),
          ),
        ),
        title: Text(
          category.categoryName ?? 'Unknown',
          style: AppTextStyles.heading1(
            context,
            overrideStyle: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 12),
            ),
          ),
        ),
        subtitle: Text(
          "${category.productCount ?? 'N/A'}",
          style: AppTextStyles.body1(
            context,
            overrideStyle: TextStyle(
              fontSize: ResponsiveHelper.fontSize(context, 12),
            ),
          ),
        ),
        trailing: PopupMenuButton<String>(
          color: Colors.white,
          icon: Icon(Icons.more_vert, color: Colors.grey.shade600),
          onSelected: (value) {
            if (value == 'edit') {
              _showCategoryDialog(category: category);
            } else if (value == 'delete') {
              // Implement delete functionality if needed
              print('Delete ${category.categoryName}');
            }
          },
          itemBuilder: (BuildContext context) => [
            PopupMenuItem(
              value: 'edit',
              child: Row(
                children: [
                  Icon(
                    Icons.edit,
                    size: ResponsiveHelper.iconSize(context, 16),
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Edit',
                    style: AppTextStyles.heading2(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 12),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  Icon(
                    Icons.delete,
                    size: ResponsiveHelper.iconSize(context, 16),
                    color: Colors.red,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Delete',
                    style: AppTextStyles.heading2(
                      context,
                      overrideStyle: TextStyle(
                        color: Colors.red,
                        fontSize: ResponsiveHelper.fontSize(context, 12),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        onTap: () => print('Selected ${category.categoryName}'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor:AppColors.primary,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          'Categories',
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
              onPressed: () => _showCategoryDialog(),
              // Call unified dialog without category parameter
              icon:  Icon(Icons.add, size:ResponsiveHelper.iconSize(context, 18) , color: Colors.orange),
              label: Text(
                'Add Category',
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
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: LoadingIndicatorUtils());
          }

          final response = provider.getVendorCategoryListModelResponse;
          if (response == null ||
              !response.success ||
              response.data?.data == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: ResponsiveHelper.iconSize(context, 60),
                    color: Colors.grey.shade400,
                  ),
                  ResponsiveHelper.sizedBoxHeight(context, 16),
                  Text(
                    'Failed to load categories',
                    style: AppTextStyles.heading1(
                      context,
                      overrideStyle: TextStyle(
                        color: AppColors.txtGreyColor,
                        fontSize: ResponsiveHelper.fontSize(context, 14),
                      ),
                    ),
                  ),
                  ResponsiveHelper.sizedBoxHeight(context, 8),
                  ElevatedButton(
                    onPressed: _fetchCategories,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      foregroundColor: Colors.white,
                    ),
                    child: Text(
                      'Retry',
                      style: AppTextStyles.heading1(
                        context,
                        overrideStyle: TextStyle(
                          fontSize: ResponsiveHelper.fontSize(context, 14),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          }

          final categories = response.data!.data!;
          final filteredCategories = _getFilteredCategories(categories);

          return Column(
            children: [
              // Header with search and filters
              Container(
                color: Colors.white,
                padding: ResponsiveHelper.paddingAll(context, 16),
                child: Column(
                  children: [
                    // Search bar
                    TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        hintText: 'Search categories...',
                        prefixIcon: Icon(
                          Icons.search,
                          color: Colors.grey.shade600,
                        ),
                        suffixIcon: _searchQuery.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear),
                                onPressed: () {
                                  _searchController.clear();
                                },
                              )
                            : null,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        filled: true,
                        fillColor: Colors.grey.shade100,
                        contentPadding: const EdgeInsets.symmetric(
                          vertical: 12,
                        ),
                      ),
                    ),
                    ResponsiveHelper.sizedBoxHeight(context, 16),

                    // Stats and view toggle
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: ResponsiveHelper.paddingSymmetric(
                            context,
                            horizontal: 12,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.blue.withAlpha(30),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '${filteredCategories.length} categories',
                            style: AppTextStyles.heading1(
                              context,
                              overrideStyle: TextStyle(
                                color: AppColors.blueColor,
                                fontSize: ResponsiveHelper.fontSize(
                                  context,
                                  12,
                                ),
                              ),
                            ),
                          ),
                        ),

                        // View toggle buttons
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(25),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              GestureDetector(
                                onTap: () => setState(() => _isGridView = true),
                                child: Container(
                                  padding: ResponsiveHelper.paddingSymmetric(
                                    context,
                                    horizontal: 16,
                                    vertical: 8,
                                  ),
                                  decoration: BoxDecoration(
                                    color: _isGridView
                                        ? Colors.white
                                        : Colors.transparent,
                                    borderRadius: BorderRadius.circular(20),
                                    boxShadow: _isGridView
                                        ? [
                                            BoxShadow(
                                              color: Colors.black.withOpacity(
                                                0.1,
                                              ),
                                              blurRadius: 4,
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.grid_view,
                                        color: _isGridView
                                            ? Colors.blue
                                            : Colors.grey,
                                        size: ResponsiveHelper.iconSize(
                                          context,
                                          18,
                                        ),
                                      ),
                                      // const SizedBox(width: 6),
                                      ResponsiveHelper.sizedBoxWidth(
                                        context,
                                        6,
                                      ),
                                      Text(
                                        'Grid',
                                        style: AppTextStyles.heading1(
                                          context,
                                          overrideStyle: TextStyle(
                                            color: _isGridView
                                                ? Colors.blue
                                                : Colors.grey,
                                            fontSize: ResponsiveHelper.fontSize(
                                              context,
                                              12,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              GestureDetector(
                                onTap: () =>
                                    setState(() => _isGridView = false),
                                child: Container(
                                  padding: ResponsiveHelper.paddingSymmetric(
                                    context,
                                    horizontal: 16,
                                    vertical: 8,
                                  ),

                                  decoration: BoxDecoration(
                                    color: !_isGridView
                                        ? Colors.white
                                        : Colors.transparent,
                                    borderRadius: BorderRadius.circular(20),
                                    boxShadow: !_isGridView
                                        ? [
                                            BoxShadow(
                                              color: Colors.black.withOpacity(
                                                0.1,
                                              ),
                                              blurRadius: 4,
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.list,
                                        color: !_isGridView
                                            ? Colors.blue
                                            : Colors.grey,
                                        size: ResponsiveHelper.iconSize(
                                          context,
                                          18,
                                        ),
                                      ),
                                      ResponsiveHelper.sizedBoxWidth(
                                        context,
                                        6,
                                      ),
                                      Text(
                                        'List',
                                        style: AppTextStyles.heading1(
                                          context,
                                          overrideStyle: TextStyle(
                                            color: _isGridView
                                                ? Colors.blue
                                                : Colors.grey,
                                            fontSize: ResponsiveHelper.fontSize(
                                              context,
                                              12,
                                            ),
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
                      ],
                    ),
                  ],
                ),
              ),

              // Categories list/grid
              Expanded(
                child: Padding(
                  padding:ResponsiveHelper.paddingSymmetric(context,horizontal: 10),
                  child: filteredCategories.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.search_off,
                                size: ResponsiveHelper.iconSize(context, 60),
                                color: Colors.grey.shade400,
                              ),
                              ResponsiveHelper.sizedBoxHeight(context, 16),
                              Text(
                                'No categories found',
                                style: AppTextStyles.body1(
                                  context,
                                  overrideStyle: TextStyle(
                                    color:AppColors.txtGreyColor,
                                    fontWeight: FontWeight.bold,
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      12,
                                    ),
                                  ),
                                ),
                              ),
                              ResponsiveHelper.sizedBoxHeight(context, 8),
                              Text(
                                'Try adjusting your search terms',
                                style: AppTextStyles.body1(
                                  context,
                                  overrideStyle: TextStyle(
                                    color:AppColors.txtGreyColor,
                                    fontWeight: FontWeight.bold,
                                    fontSize: ResponsiveHelper.fontSize(
                                      context,
                                      12,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                      : _isGridView
                      ? LayoutBuilder(
                          builder: (context, constraints) {
                            int crossAxisCount;
                            if (constraints.maxWidth > 1200) {
                              crossAxisCount = 5;
                            } else if (constraints.maxWidth > 900) {
                              crossAxisCount = 4;
                            } else if (constraints.maxWidth > 600) {
                              crossAxisCount = 3;
                            } else {
                              crossAxisCount = 2;
                            }

                            return GridView.builder(
                              gridDelegate:
                                  SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: crossAxisCount,
                                    crossAxisSpacing: 16,
                                    mainAxisSpacing: 16,
                                    childAspectRatio: 1.1,
                                  ),
                              itemCount: filteredCategories.length,
                              itemBuilder: (context, index) {
                                return _buildGridCategoryItem(context,
                                  filteredCategories[index],index
                                );
                              },
                            );
                          },
                        )
                      : ListView.builder(
                          itemCount: filteredCategories.length,
                          itemBuilder: (context, index) {
                            return _buildListCategoryItem(
                              context,
                              filteredCategories[index],
                              index
                            );
                          },
                        ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
