import 'package:dss_crm/admin/model/product_management/admin_product_list_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../controller/admin_main_api_provider.dart';
import 'add_new_product_screen.dart';

class AdminProductListScreen extends StatefulWidget {
  const AdminProductListScreen({super.key});

  @override
  State<AdminProductListScreen> createState() => _AdminProductListScreenState();
}

class _AdminProductListScreenState extends State<AdminProductListScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  String _searchQuery = '';
  bool _isGridView = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadProducts();
      _animationController.forward();
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _loadProducts() async {
    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    await provider.getAllAdminRProductList(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Consumer<AdminMainApiProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return _buildLoadingState();
          }

          final response = provider.getAllAdminProductListModelResponse;

          if (response == null || !response.success) {
            return _buildErrorState(response?.message);
          }

          final products = response.data?.data ?? [];
          final filteredProducts = _filterProducts(products);

          if (products.isEmpty) {
            return _buildEmptyState();
          }

          return CustomScrollView(
            slivers: [
              _buildAppBar(products.length),
              _buildSearchBar(),
              _buildProductsList(filteredProducts),
            ],
          );
        },
      ),
      floatingActionButton: _buildFloatingActionButton(),
    );
  }

  List<Data> _filterProducts(List<Data> products) {
    if (_searchQuery.isEmpty) return products;
    return products.where((product) {
      final title = product.title?.toLowerCase() ?? '';
      final productId = product.productId?.toLowerCase() ?? '';
      final alias = product.alias?.toLowerCase() ?? '';
      final query = _searchQuery.toLowerCase();
      return title.contains(query) ||
          productId.contains(query) ||
          alias.contains(query);
    }).toList();
  }

  Widget _buildAppBar(int totalProducts) {
    return SliverAppBar(
      expandedHeight: ResponsiveHelper.containerHeight(context, 220),
      floating: false,
      pinned: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFF667EEA),
                const Color(0xFF764BA2),
              ],
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF667EEA).withOpacity(0.3),
                blurRadius: 20,
                spreadRadius: 5,
              ),
            ],
          ),
          child: SafeArea(
            child: Padding(
              padding: ResponsiveHelper.paddingAll(context, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: ResponsiveHelper.paddingAll(context, 14),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.white.withOpacity(0.3),
                              Colors.white.withOpacity(0.1),
                            ],
                          ),
                          borderRadius: ResponsiveHelper.borderRadiusAll(context, 20),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.4),
                            width: 2,
                          ),
                        ),
                        child: Icon(
                          Icons.inventory_2_rounded,
                          color: Colors.white,
                          size: ResponsiveHelper.iconSize(context, 34),
                        ),
                      ),
                      ResponsiveHelper.sizedBoxWidth(context, 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Product Inventory',
                              style: AppTextStyles.heading1(
                                context,
                                overrideStyle: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -1.2,
                                  fontSize: 32,
                                ),
                              ),
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 8),
                            Container(
                              padding: ResponsiveHelper.paddingSymmetric(
                                context,
                                horizontal: 16,
                                vertical: 8,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.25),
                                borderRadius: ResponsiveHelper.borderRadiusAll(context, 24),
                                border: Border.all(
                                  color: Colors.white.withOpacity(0.3),
                                  width: 1.5,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: ResponsiveHelper.spacing(context, 8),
                                    height: ResponsiveHelper.spacing(context, 8),
                                    decoration: const BoxDecoration(
                                      color: Colors.white,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  ResponsiveHelper.sizedBoxWidth(context, 8),
                                  Text(
                                    '$totalProducts Products',
                                    style: AppTextStyles.body1(
                                      context,
                                      overrideStyle: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  ResponsiveHelper.sizedBoxHeight(context, 20),
                  Text(
                    'Manage your product catalog efficiently',
                    style: AppTextStyles.body2(
                      context,
                      overrideStyle: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      leading: IconButton(
        icon: Container(
          padding: ResponsiveHelper.paddingAll(context, 10),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.2),
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 14),
            border: Border.all(
              color: Colors.white.withOpacity(0.3),
              width: 1.5,
            ),
          ),
          child: Icon(
            Icons.arrow_back_ios_new_rounded,
            color: Colors.white,
            size: ResponsiveHelper.iconSize(context, 20),
          ),
        ),
        onPressed: () => Navigator.pop(context),
      ),
      actions: [
        Container(
          margin: ResponsiveHelper.paddingOnly(context, right: 16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.15),
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 16),
            border: Border.all(
              color: Colors.white.withOpacity(0.3),
            ),
          ),
          child: IconButton(
            icon: Icon(
              _isGridView ? Icons.view_list_rounded : Icons.grid_view_rounded,
              color: Colors.white,
              size: ResponsiveHelper.iconSize(context, 22),
            ),
            onPressed: () {
              setState(() {
                _isGridView = !_isGridView;
              });
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSearchBar() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: ResponsiveHelper.paddingSymmetric(context, horizontal: 20, vertical: 16),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 24),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF667EEA).withOpacity(0.15),
                blurRadius: ResponsiveHelper.spacing(context, 25),
                offset: Offset(0, ResponsiveHelper.spacing(context, 6)),
                spreadRadius: 1,
              ),
            ],
            border: Border.all(
              color: Colors.grey.withOpacity(0.1),
              width: 1,
            ),
          ),
          child: TextField(
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
            style: AppTextStyles.body1(
              context,
              overrideStyle: const TextStyle(
                color: Color(0xFF1F2937),
                fontWeight: FontWeight.w500,
              ),
            ),
            decoration: InputDecoration(
              hintText: 'Search by name, ID, or alias...',
              hintStyle: TextStyle(
                color: Colors.grey[500],
                fontSize: ResponsiveHelper.fontSize(context, 16),
                fontWeight: FontWeight.w400,
              ),
              prefixIcon: Container(
                margin: ResponsiveHelper.paddingOnly(context, left: 4),
                padding: ResponsiveHelper.paddingAll(context, 12),
                child: Icon(
                  Icons.search_rounded,
                  color: const Color(0xFF667EEA),
                  size: ResponsiveHelper.iconSize(context, 24),
                ),
              ),
              suffixIcon: _searchQuery.isNotEmpty
                  ? Container(
                margin: ResponsiveHelper.paddingOnly(context, right: 4),
                child: IconButton(
                  icon: Container(
                    padding: ResponsiveHelper.paddingAll(context, 4),
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                    ),
                    child: Icon(
                      Icons.clear_rounded,
                      color: Colors.grey[600],
                      size: ResponsiveHelper.iconSize(context, 18),
                    ),
                  ),
                  onPressed: () {
                    setState(() {
                      _searchQuery = '';
                    });
                  },
                ),
              )
                  : null,
              border: InputBorder.none,
              contentPadding: ResponsiveHelper.paddingSymmetric(
                context,
                horizontal: 20,
                vertical: 18,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProductsList(List<Data> products) {
    if (products.isEmpty && _searchQuery.isNotEmpty) {
      return SliverFillRemaining(
        child: Center(
          child: Padding(
            padding: ResponsiveHelper.paddingAll(context, 40),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: ResponsiveHelper.paddingAll(context, 24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.2),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.search_off_rounded,
                    size: ResponsiveHelper.iconSize(context, 80),
                    color: const Color(0xFF667EEA),
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 24),
                Text(
                  'No matching products',
                  style: AppTextStyles.heading2(
                    context,
                    overrideStyle: const TextStyle(
                      color: Color(0xFF1F2937),
                      fontWeight: FontWeight.w700,
                      fontSize: 24,
                    ),
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 12),
                Text(
                  'Try adjusting your search terms to find what you\'re looking for',
                  style: AppTextStyles.body2(
                    context,
                    overrideStyle: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 16,
                    ),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (_isGridView) {
      return SliverPadding(
        padding: ResponsiveHelper.paddingAll(context, 20),
        sliver: SliverGrid(
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: ResponsiveHelper.isDesktop(context) ? 3 : 2,
            childAspectRatio: 0.72,
            crossAxisSpacing: ResponsiveHelper.spacing(context, 20),
            mainAxisSpacing: ResponsiveHelper.spacing(context, 20),
          ),
          delegate: SliverChildBuilderDelegate(
                (context, index) => _buildProductGridCard(products[index], index),
            childCount: products.length,
          ),
        ),
      );
    }

    return SliverList(
      delegate: SliverChildBuilderDelegate(
            (context, index) => _buildProductListCard(products[index], index),
        childCount: products.length,
      ),
    );
  }

  Widget _buildProductListCard(Data product, int index) {
    String? imageUrl = product.productImage?.publicUrl?.toString() ?? "";

    final List<Color> cardColors = [
      const Color(0xFF667EEA),
      const Color(0xFF764BA2),
      const Color(0xFFF093FB),
      const Color(0xFFF5576C),
      const Color(0xFF4FACFE),
      const Color(0xFF00F2FE),
    ];

    final color = cardColors[index % cardColors.length];

    return Padding(
      padding: ResponsiveHelper.paddingSymmetric(context, horizontal: 20, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: ResponsiveHelper.borderRadiusAll(context, 28),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.12),
              blurRadius: ResponsiveHelper.spacing(context, 25),
              offset: Offset(0, ResponsiveHelper.spacing(context, 10)),
              spreadRadius: 1,
            ),
          ],
          border: Border.all(
            color: Colors.grey.withOpacity(0.1),
            width: 1,
          ),
        ),
        child: Material(
          color: Colors.transparent,
          borderRadius: ResponsiveHelper.borderRadiusAll(context, 28),
          child: InkWell(
            onTap: () => _viewProductDetails(product),
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 28),
            child: Padding(
              padding: ResponsiveHelper.paddingAll(context, 20),
              child: Row(
                children: [
                  // Product Image with modern design
                  Hero(
                    tag: 'product_${product.productId}',
                    child: Container(
                      width: ResponsiveHelper.containerWidth(context, 100),
                      height: ResponsiveHelper.containerHeight(context, 100),
                      decoration: BoxDecoration(
                        borderRadius: ResponsiveHelper.borderRadiusAll(context, 22),
                        gradient: LinearGradient(
                          colors: [color.withOpacity(0.8), color.withOpacity(0.4)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: color.withOpacity(0.3),
                            blurRadius: 15,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: ResponsiveHelper.borderRadiusAll(context, 22),
                        child: Stack(
                          children: [
                            if (imageUrl.isNotEmpty)
                              Image.network(
                                imageUrl,
                                fit: BoxFit.cover,
                                width: double.infinity,
                                height: double.infinity,
                                errorBuilder: (context, error, stackTrace) {
                                  return Center(
                                    child: Icon(
                                      Icons.inventory_2_rounded,
                                      size: ResponsiveHelper.iconSize(context, 40),
                                      color: Colors.white.withOpacity(0.8),
                                    ),
                                  );
                                },
                              )
                            else
                              Center(
                                child: Icon(
                                  Icons.inventory_2_rounded,
                                  size: ResponsiveHelper.iconSize(context, 40),
                                  color: Colors.white.withOpacity(0.8),
                                ),
                              ),
                            Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Colors.transparent,
                                    Colors.black.withOpacity(0.1),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  ResponsiveHelper.sizedBoxWidth(context, 20),
                  // Product Info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: ResponsiveHelper.paddingSymmetric(
                                context,
                                horizontal: 12,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: color.withOpacity(0.1),
                                borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                                border: Border.all(
                                  color: color.withOpacity(0.3),
                                  width: 1,
                                ),
                              ),
                              child: Text(
                                '#${index + 1}',
                                style: AppTextStyles.caption(
                                  context,
                                  overrideStyle: TextStyle(
                                    color: color,
                                    fontWeight: FontWeight.w800,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ),
                            const Spacer(),
                            Container(
                              width: ResponsiveHelper.spacing(context, 10),
                              height: ResponsiveHelper.spacing(context, 10),
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF10B981).withOpacity(0.4),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 12),
                        Text(
                          product.title ?? 'Unnamed Product',
                          style: AppTextStyles.heading2(
                            context,
                            overrideStyle: const TextStyle(
                              color: Color(0xFF1F2937),
                              fontWeight: FontWeight.w800,
                              fontSize: 18,
                              letterSpacing: -0.3,
                            ),
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 8),
                        Row(
                          children: [
                            Icon(
                              Icons.tag_rounded,
                              size: ResponsiveHelper.iconSize(context, 16),
                              color: Colors.grey[600],
                            ),
                            ResponsiveHelper.sizedBoxWidth(context, 6),
                            Text(
                              product.productId ?? 'N/A',
                              style: AppTextStyles.caption(
                                context,
                                overrideStyle: TextStyle(
                                  color: Colors.grey[600],
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ],
                        ),
                        if (product.alias != null && product.alias!.isNotEmpty) ...[
                          ResponsiveHelper.sizedBoxHeight(context, 6),
                          Row(
                            children: [
                              Icon(
                                Icons.label_rounded,
                                size: ResponsiveHelper.iconSize(context, 16),
                                color: color,
                              ),
                              ResponsiveHelper.sizedBoxWidth(context, 6),
                              Expanded(
                                child: Text(
                                  product.alias!,
                                  style: AppTextStyles.caption(
                                    context,
                                    overrideStyle: TextStyle(
                                      color: color,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 14,
                                    ),
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                  ResponsiveHelper.sizedBoxWidth(context, 16),
                  // Action Button
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [color, color.withOpacity(0.8)],
                      ),
                      borderRadius: ResponsiveHelper.borderRadiusAll(context, 16),
                      boxShadow: [
                        BoxShadow(
                          color: color.withOpacity(0.4),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: IconButton(
                      icon: Icon(
                        Icons.arrow_forward_ios_rounded,
                        size: ResponsiveHelper.iconSize(context, 20),
                        color: Colors.white,
                      ),
                      onPressed: () => _viewProductDetails(product),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProductGridCard(Data product, int index) {
    String? imageUrl = product.productImage?.publicUrl?.toString() ?? "";

    final List<List<Color>> cardGradients = [
      [const Color(0xFF667EEA), const Color(0xFF764BA2)],
      [const Color(0xFFF093FB), const Color(0xFFF5576C)],
      [const Color(0xFF4FACFE), const Color(0xFF00F2FE)],
      [const Color(0xFF43E97B), const Color(0xFF38F9D7)],
      [const Color(0xFFFA709A), const Color(0xFFFEE140)],
      [const Color(0xFFA8C0FF), const Color(0xFF3F2B96)],
    ];

    final gradient = cardGradients[index % cardGradients.length];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 28),
        boxShadow: [
          BoxShadow(
            color: gradient[0].withOpacity(0.15),
            blurRadius: ResponsiveHelper.spacing(context, 25),
            offset: Offset(0, ResponsiveHelper.spacing(context, 12)),
            spreadRadius: 1,
          ),
        ],
        border: Border.all(
          color: Colors.grey.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 28),
        child: InkWell(
          onTap: () => _viewProductDetails(product),
          borderRadius: ResponsiveHelper.borderRadiusAll(context, 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image Section
              Hero(
                tag: 'product_${product.productId}',
                child: ClipRRect(
                  borderRadius: ResponsiveHelper.borderRadiusOnly(
                    context,
                    topLeft: 28,
                    topRight: 28,
                  ),
                  child: Stack(
                    children: [
                      Container(
                        height: ResponsiveHelper.containerHeight(context, 160),
                        width: double.infinity,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: gradient,
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                        ),
                        child: Stack(
                          children: [
                            if (imageUrl.isNotEmpty)
                              Image.network(
                                imageUrl,
                                fit: BoxFit.cover,
                                width: double.infinity,
                                height: double.infinity,
                                errorBuilder: (context, error, stackTrace) {
                                  return Center(
                                    child: Icon(
                                      Icons.inventory_2_rounded,
                                      size: ResponsiveHelper.iconSize(context, 50),
                                      color: Colors.white.withOpacity(0.7),
                                    ),
                                  );
                                },
                              )
                            else
                              Center(
                                child: Icon(
                                  Icons.inventory_2_rounded,
                                  size: ResponsiveHelper.iconSize(context, 50),
                                  color: Colors.white.withOpacity(0.7),
                                ),
                              ),
                            Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Colors.transparent,
                                    Colors.black.withOpacity(0.2),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Positioned(
                        top: ResponsiveHelper.spacing(context, 14),
                        left: ResponsiveHelper.spacing(context, 14),
                        child: Container(
                          padding: ResponsiveHelper.paddingSymmetric(
                            context,
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: ResponsiveHelper.borderRadiusAll(context, 14),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Text(
                            '#${index + 1}',
                            style: AppTextStyles.caption(
                              context,
                              overrideStyle: TextStyle(
                                color: gradient[0],
                                fontWeight: FontWeight.w800,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        top: ResponsiveHelper.spacing(context, 14),
                        right: ResponsiveHelper.spacing(context, 14),
                        child: Container(
                          width: ResponsiveHelper.spacing(context, 12),
                          height: ResponsiveHelper.spacing(context, 12),
                          decoration: const BoxDecoration(
                            color: Color(0xFF10B981),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.white,
                                blurRadius: 6,
                                spreadRadius: 2,
                              ),
                              BoxShadow(
                                color: Color(0xFF10B981),
                                blurRadius: 8,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Content Section
              Expanded(
                child: Padding(
                  padding: ResponsiveHelper.paddingAll(context, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.title ?? 'Unnamed Product',
                        style: AppTextStyles.body1(
                          context,
                          overrideStyle: const TextStyle(
                            color: Color(0xFF1F2937),
                            fontWeight: FontWeight.w800,
                            fontSize: 16,
                            letterSpacing: -0.2,
                          ),
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      ResponsiveHelper.sizedBoxHeight(context, 10),
                      Row(
                        children: [
                          Icon(
                            Icons.tag_rounded,
                            size: ResponsiveHelper.iconSize(context, 16),
                            color: gradient[0],
                          ),
                          ResponsiveHelper.sizedBoxWidth(context, 6),
                          Expanded(
                            child: Text(
                              product.productId ?? 'N/A',
                              style: AppTextStyles.caption(
                                context,
                                overrideStyle: TextStyle(
                                  color: gradient[0],
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                ),
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      SizedBox(
                        width: double.infinity,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: gradient,
                            ),
                            borderRadius: ResponsiveHelper.borderRadiusAll(context, 18),
                            boxShadow: [
                              BoxShadow(
                                color: gradient[0].withOpacity(0.4),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            onPressed: () => _viewProductDetails(product),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              foregroundColor: Colors.white,
                              shadowColor: Colors.transparent,
                              padding: ResponsiveHelper.paddingSymmetric(
                                context,
                                vertical: 14,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: ResponsiveHelper.borderRadiusAll(context, 18),
                              ),
                            ),
                            child: Text(
                              'View Details',
                              style: AppTextStyles.body2(
                                context,
                                overrideStyle: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                ),
                              ),
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
      ),
    );
  }

  Widget _buildLoadingState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: ResponsiveHelper.paddingAll(context, 28),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
              ),
              borderRadius: ResponsiveHelper.borderRadiusAll(context, 30),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF667EEA).withOpacity(0.4),
                  blurRadius: 30,
                  spreadRadius: 10,
                ),
              ],
            ),
            child: const CircularProgressIndicator(
              color: Colors.white,
              strokeWidth: 3,
            ),
          ),
          ResponsiveHelper.sizedBoxHeight(context, 28),
          Text(
            'Loading Products...',
            style: AppTextStyles.heading2(
              context,
              overrideStyle: const TextStyle(
                fontWeight: FontWeight.w700,
                color: Color(0xFF667EEA),
                fontSize: 22,
              ),
            ),
          ),
          ResponsiveHelper.sizedBoxHeight(context, 8),
          Text(
            'Please wait while we fetch your inventory',
            style: AppTextStyles.body2(
              context,
              overrideStyle: TextStyle(
                color: Colors.grey[600],
                fontSize: 16,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(String? message) {
    return Center(
      child: Padding(
        padding: ResponsiveHelper.paddingAll(context, 28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: ResponsiveHelper.paddingAll(context, 28),
              decoration: BoxDecoration(
                color: Colors.red[50],
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.red.withOpacity(0.1),
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Icon(
                Icons.error_outline_rounded,
                size: ResponsiveHelper.iconSize(context, 80),
                color: Colors.red[400],
              ),
            ),
            ResponsiveHelper.sizedBoxHeight(context, 28),
            Text(
              'Oops! Something went wrong',
              style: AppTextStyles.heading2(
                context,
                overrideStyle: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 24,
                ),
              ),
            ),
            ResponsiveHelper.sizedBoxHeight(context, 12),
            Text(
              message ?? 'Failed to load products. Please check your connection.',
              style: AppTextStyles.body2(
                context,
                overrideStyle: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 16,
                  height: 1.5,
                ),
              ),
              textAlign: TextAlign.center,
            ),
            ResponsiveHelper.sizedBoxHeight(context, 28),
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                ),
                borderRadius: ResponsiveHelper.borderRadiusAll(context, 20),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF667EEA).withOpacity(0.4),
                    blurRadius: 15,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: _loadProducts,
                icon: const Icon(Icons.refresh_rounded, color: Colors.white),
                label: const Text('Try Again', style: TextStyle(color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: ResponsiveHelper.paddingSymmetric(
                    context,
                    horizontal: 36,
                    vertical: 18,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: ResponsiveHelper.borderRadiusAll(context, 20),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: ResponsiveHelper.paddingAll(context, 28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: ResponsiveHelper.paddingAll(context, 36),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF667EEA).withOpacity(0.1),
                    const Color(0xFF764BA2).withOpacity(0.1),
                  ],
                ),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF667EEA).withOpacity(0.1),
                    blurRadius: 30,
                    spreadRadius: 10,
                  ),
                ],
              ),
              child: Icon(
                Icons.inventory_2_outlined,
                size: ResponsiveHelper.iconSize(context, 100),
                color: const Color(0xFF667EEA),
              ),
            ),
            ResponsiveHelper.sizedBoxHeight(context, 36),
            Text(
              'No Products Yet',
              style: AppTextStyles.heading1(
                context,
                overrideStyle: const TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 32,
                  color: Color(0xFF1F2937),
                ),
              ),
            ),
            ResponsiveHelper.sizedBoxHeight(context, 16),
            Text(
              'Start building your inventory by adding your first product',
              style: AppTextStyles.body1(
                context,
                overrideStyle: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 18,
                  height: 1.6,
                ),
              ),
              textAlign: TextAlign.center,
            ),
            ResponsiveHelper.sizedBoxHeight(context, 36),
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                ),
                borderRadius: ResponsiveHelper.borderRadiusAll(context, 24),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF667EEA).withOpacity(0.5),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () => _navigateToAddProduct(),
                icon: const Icon(Icons.add_rounded, color: Colors.white),
                label: const Text('Add First Product', style: TextStyle(color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: ResponsiveHelper.paddingSymmetric(
                    context,
                    horizontal: 44,
                    vertical: 20,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: ResponsiveHelper.borderRadiusAll(context, 24),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFloatingActionButton() {
    return FloatingActionButton.extended(
      onPressed: () => _navigateToAddProduct(),
      icon: Container(
        padding: ResponsiveHelper.paddingAll(context, 8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
        ),
        child: const Icon(Icons.add_rounded, color: Colors.white),
      ),
      label: Text(
        'Add Product',
        style: AppTextStyles.body1(
          context,
          overrideStyle: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      backgroundColor: const Color(0xFF667EEA),
      elevation: 12,
      shape: RoundedRectangleBorder(
        borderRadius: ResponsiveHelper.borderRadiusAll(context, 24),
      ),
    );
  }

  Future<void> _navigateToAddProduct() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const ProductWorkFormScreen(),
      ),
    );

    if (result == true) {
      _loadProducts();
    }
  }

  void _viewProductDetails(Data product) {
    String? imageUrl = product.productImage?.publicUrl?.toString() ?? "";

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) => Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: ResponsiveHelper.borderRadiusOnly(
              context,
              topLeft: 36,
              topRight: 36,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                blurRadius: 30,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Column(
            children: [
              // Handle bar
              Container(
                margin: ResponsiveHelper.paddingOnly(context, top: 12, bottom: 8),
                width: ResponsiveHelper.containerWidth(context, 50),
                height: ResponsiveHelper.containerHeight(context, 6),
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  borderRadius: ResponsiveHelper.borderRadiusAll(context, 12),
                ),
              ),
              // Header
              Padding(
                padding: ResponsiveHelper.paddingAll(context, 24),
                child: Row(
                  children: [
                    Container(
                      padding: ResponsiveHelper.paddingAll(context, 14),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                        ),
                        borderRadius: ResponsiveHelper.borderRadiusAll(context, 18),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF667EEA).withOpacity(0.3),
                            blurRadius: 15,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: Icon(
                        Icons.info_rounded,
                        color: Colors.white,
                        size: ResponsiveHelper.iconSize(context, 26),
                      ),
                    ),
                    ResponsiveHelper.sizedBoxWidth(context, 16),
                    Expanded(
                      child: Text(
                        'Product Details',
                        style: AppTextStyles.heading2(
                          context,
                          overrideStyle: const TextStyle(
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1F2937),
                            fontSize: 22,
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: Container(
                        padding: ResponsiveHelper.paddingAll(context, 10),
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          borderRadius: ResponsiveHelper.borderRadiusAll(context, 14),
                          border: Border.all(
                            color: Colors.grey.withOpacity(0.2),
                          ),
                        ),
                        child: Icon(
                          Icons.close_rounded,
                          size: ResponsiveHelper.iconSize(context, 22),
                          color: Colors.grey[600],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Divider(height: 1, color: Colors.grey[200]),
              // Content
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding: ResponsiveHelper.paddingAll(context, 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Product Image
                      if (imageUrl.isNotEmpty) ...[
                        Hero(
                          tag: 'product_${product.productId}',
                          child: ClipRRect(
                            borderRadius: ResponsiveHelper.borderRadiusAll(context, 28),
                            child: Container(
                              height: ResponsiveHelper.containerHeight(context, 250),
                              width: double.infinity,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                                ),
                                borderRadius: ResponsiveHelper.borderRadiusAll(context, 28),
                              ),
                              child: Stack(
                                children: [
                                  Image.network(
                                    imageUrl,
                                    height: double.infinity,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) {
                                      return Center(
                                        child: Icon(
                                          Icons.image_not_supported_rounded,
                                          size: ResponsiveHelper.iconSize(context, 60),
                                          color: Colors.white.withOpacity(0.7),
                                        ),
                                      );
                                    },
                                  ),
                                  Container(
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        begin: Alignment.topCenter,
                                        end: Alignment.bottomCenter,
                                        colors: [
                                          Colors.transparent,
                                          Colors.black.withOpacity(0.3),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        ResponsiveHelper.sizedBoxHeight(context, 28),
                      ],

                      // Product Title
                      Text(
                        product.title ?? 'Unnamed Product',
                        style: AppTextStyles.heading1(
                          context,
                          overrideStyle: const TextStyle(
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF1F2937),
                            letterSpacing: -1.2,
                            fontSize: 28,
                          ),
                        ),
                      ),
                      ResponsiveHelper.sizedBoxHeight(context, 12),

                      // Status Badge
                      Container(
                        padding: ResponsiveHelper.paddingSymmetric(
                          context,
                          horizontal: 18,
                          vertical: 10,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.1),
                          borderRadius: ResponsiveHelper.borderRadiusAll(context, 16),
                          border: Border.all(
                            color: const Color(0xFF10B981).withOpacity(0.3),
                            width: 1.5,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: ResponsiveHelper.spacing(context, 10),
                              height: ResponsiveHelper.spacing(context, 10),
                              decoration: const BoxDecoration(
                                color: Color(0xFF10B981),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Color(0xFF10B981),
                                    blurRadius: 8,
                                    spreadRadius: 1,
                                  ),
                                ],
                              ),
                            ),
                            ResponsiveHelper.sizedBoxWidth(context, 10),
                            Text(
                              'Active & Available',
                              style: AppTextStyles.body1(
                                context,
                                overrideStyle: const TextStyle(
                                  color: Color(0xFF10B981),
                                  fontWeight: FontWeight.w700,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      ResponsiveHelper.sizedBoxHeight(context, 28),

                      // Details Grid
                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: ResponsiveHelper.borderRadiusAll(context, 24),
                          border: Border.all(
                            color: Colors.grey.withOpacity(0.1),
                            width: 1.5,
                          ),
                        ),
                        padding: ResponsiveHelper.paddingAll(context, 24),
                        child: Column(
                          children: [
                            _buildModernDetailRow(
                              context,
                              icon: Icons.tag_rounded,
                              label: 'Product ID',
                              value: product.productId ?? 'N/A',
                              color: const Color(0xFF667EEA),
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 20),
                            _buildModernDetailRow(
                              context,
                              icon: Icons.label_rounded,
                              label: 'Alias',
                              value: product.alias ?? 'N/A',
                              color: const Color(0xFF764BA2),
                            ),
                            ResponsiveHelper.sizedBoxHeight(context, 20),
                            _buildModernDetailRow(
                              context,
                              icon: Icons.calendar_today_rounded,
                              label: 'Created Date',
                              value: _formatDate(product.createdAt ?? ''),
                              color: const Color(0xFFF093FB),
                            ),
                          ],
                        ),
                      ),

                      ResponsiveHelper.sizedBoxHeight(context, 28),

                      // Description Section
                      Text(
                        'Description',
                        style: AppTextStyles.heading2(
                          context,
                          overrideStyle: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 20,
                          ),
                        ),
                      ),
                      ResponsiveHelper.sizedBoxHeight(context, 16),
                      Container(
                        width: double.infinity,
                        padding: ResponsiveHelper.paddingAll(context, 24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: ResponsiveHelper.borderRadiusAll(context, 24),
                          border: Border.all(
                            color: Colors.grey[200]!,
                            width: 2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withOpacity(0.1),
                              blurRadius: 15,
                              offset: const Offset(0, 5),
                            ),
                          ],
                        ),
                        child: Text(
                          product.description ?? 'No description available for this product.',
                          style: AppTextStyles.body1(
                            context,
                            overrideStyle: TextStyle(
                              color: Colors.grey[700],
                              height: 1.6,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),

                      ResponsiveHelper.sizedBoxHeight(context, 32),

                      // Action Buttons
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                                ),
                                borderRadius: ResponsiveHelper.borderRadiusAll(context, 20),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF667EEA).withOpacity(0.4),
                                    blurRadius: 15,
                                    offset: const Offset(0, 6),
                                  ),
                                ],
                              ),
                              child: ElevatedButton.icon(
                                onPressed: () {
                                  Navigator.pop(context);
                                  _editProduct(product);
                                },
                                icon: const Icon(Icons.edit_rounded, color: Colors.white),
                                label: const Text('Edit Product', style: TextStyle(color: Colors.white)),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.transparent,
                                  shadowColor: Colors.transparent,
                                  padding: ResponsiveHelper.paddingSymmetric(
                                    context,
                                    vertical: 18,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: ResponsiveHelper.borderRadiusAll(context, 20),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          ResponsiveHelper.sizedBoxWidth(context, 16),
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => _deleteProduct(product),
                              icon: const Icon(Icons.delete_rounded),
                              label: const Text('Delete'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.red[400],
                                side: BorderSide(
                                  color: Colors.red[400]!,
                                  width: 2,
                                ),
                                padding: ResponsiveHelper.paddingSymmetric(
                                  context,
                                  vertical: 18,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: ResponsiveHelper.borderRadiusAll(context, 20),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),

                      ResponsiveHelper.sizedBoxHeight(context, 20),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModernDetailRow(
      BuildContext context, {
        required IconData icon,
        required String label,
        required String value,
        required Color color,
      }) {
    return Row(
      children: [
        Container(
          padding: ResponsiveHelper.paddingAll(context, 14),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: ResponsiveHelper.borderRadiusAll(context, 16),
            border: Border.all(
              color: color.withOpacity(0.2),
              width: 1.5,
            ),
          ),
          child: Icon(
            icon,
            size: ResponsiveHelper.iconSize(context, 24),
            color: color,
          ),
        ),
        ResponsiveHelper.sizedBoxWidth(context, 18),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.caption(
                  context,
                  overrideStyle: TextStyle(
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
              ResponsiveHelper.sizedBoxHeight(context, 6),
              Text(
                value,
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: TextStyle(
                    color: color,
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return '${date.day} ${months[date.month - 1]}, ${date.year}';
    } catch (e) {
      return dateString;
    }
  }

  void _editProduct(Data product) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Container(
              padding: ResponsiveHelper.paddingAll(context, 8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: ResponsiveHelper.borderRadiusAll(context, 10),
              ),
              child: const Icon(
                Icons.info_rounded,
                color: Colors.white,
              ),
            ),
            ResponsiveHelper.sizedBoxWidth(context, 12),
            const Expanded(
              child: Text(
                'Edit functionality coming soon!',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF667EEA),
        behavior: SnackBarBehavior.floating,
        margin: ResponsiveHelper.paddingAll(context, 16),
        shape: RoundedRectangleBorder(
          borderRadius: ResponsiveHelper.borderRadiusAll(context, 16),
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _deleteProduct(Data product) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: ResponsiveHelper.borderRadiusAll(context, 28),
        ),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        title: Row(
          children: [
            Container(
              padding: ResponsiveHelper.paddingAll(context, 12),
              decoration: BoxDecoration(
                color: Colors.red[50],
                borderRadius: ResponsiveHelper.borderRadiusAll(context, 14),
              ),
              child: Icon(
                Icons.warning_rounded,
                color: Colors.red[400],
                size: ResponsiveHelper.iconSize(context, 28),
              ),
            ),
            ResponsiveHelper.sizedBoxWidth(context, 16),
            Expanded(
              child: Text(
                'Delete Product?',
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 22,
                  ),
                ),
              ),
            ),
          ],
        ),
        content: Text(
          'Are you sure you want to delete "${product.title}"? This action cannot be undone and all product data will be permanently lost.',
          style: AppTextStyles.body2(
            context,
            overrideStyle: TextStyle(
              color: Colors.grey[700],
              height: 1.5,
              fontSize: 16,
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            style: TextButton.styleFrom(
              foregroundColor: Colors.grey[700],
              padding: ResponsiveHelper.paddingSymmetric(
                context,
                horizontal: 24,
                vertical: 12,
              ),
            ),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('Delete functionality coming soon!'),
                  backgroundColor: Colors.red[400],
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(
                    borderRadius: ResponsiveHelper.borderRadiusAll(context, 16),
                  ),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red[400],
              foregroundColor: Colors.white,
              padding: ResponsiveHelper.paddingSymmetric(
                context,
                horizontal: 24,
                vertical: 12,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: ResponsiveHelper.borderRadiusAll(context, 16),
              ),
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}