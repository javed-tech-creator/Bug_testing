import 'package:dss_crm/admin/model/product_management/admin_product_list_model.dart'
    as productListData;
import 'package:dss_crm/admin/model/product_management/admin_product_single_details_model.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../../network_manager/api_response.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import '../../controller/admin_main_api_provider.dart';

class ProductWorkFormScreen extends StatefulWidget {
  const ProductWorkFormScreen({super.key});

  @override
  State<ProductWorkFormScreen> createState() => _ProductWorkFormScreenState();
}

class _ProductWorkFormScreenState extends State<ProductWorkFormScreen>
    with TickerProviderStateMixin {
  late TabController _mainTabController; // Products / Work-Phases
  late TabController _phaseTabController; // Phase 1,2,3
  late TabController _deptTabController; // Departments inside a phase

  List<ProductData> savedProducts = [];
  ProductData? currentProduct;
  productListData.Data? selectedApiProduct;
  bool isAddingNewProduct = false;

  final TextEditingController productNameController = TextEditingController();
  final TextEditingController productAliasNameController =
      TextEditingController();
  final TextEditingController productDescriptionController =
      TextEditingController();
  String? productImagePath;
  final ImagePicker _picker = ImagePicker();

  // -----------------------------------------------------------------
  // Phase / Department data
  // -----------------------------------------------------------------
  final List<String> phasesList = ['Phase 1', 'Phase 2', 'Phase 3'];
  final Map<String, List<String>> phaseDepartments = {
    'Phase 1': ['Recce Dept', 'Design Dept'],
    'Phase 2': ['Production Dept'],
    'Phase 3': ['Warehouse Dept'],
  };

  // One WorkPhase per (phase, department) pair → now holds List<WorkItem>
  final Map<String, Map<String, WorkPhase>> _phaseDeptWorks = {};

  @override
  void initState() {
    super.initState();
    _mainTabController = TabController(length: 2, vsync: this);
    _phaseTabController = TabController(length: phasesList.length, vsync: this);
    _deptTabController = TabController(length: 0, vsync: this);

    _mainTabController.addListener(() {
      setState(() {});
      // ADD THIS: Jab Work Phases tab pe aaye, to dept tabs update ho
      if (_mainTabController.index == 1 && _deptTabController.length == 0) {
        _onPhaseChanged(); // Force initialize dept tabs for Phase 1
      }
    });

    _phaseTabController.addListener(_onPhaseChanged);
    _deptTabController.addListener(() => setState(() {}));

    WidgetsBinding.instance.addPostFrameCallback((_) => _loadProducts());
  }

  void _onPhaseChanged() {
    final phase = phasesList[_phaseTabController.index];
    final depts = phaseDepartments[phase]!;
    _deptTabController.dispose();
    _deptTabController = TabController(length: depts.length, vsync: this);
    _deptTabController.addListener(() => setState(() {}));
    setState(() {});
  }

  @override
  void dispose() {
    _mainTabController.dispose();
    _phaseTabController.dispose();
    _deptTabController.dispose();
    productNameController.dispose();
    productAliasNameController.dispose();
    productDescriptionController.dispose();
    super.dispose();
  }

  Future<void> _loadProducts() async {
    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    await provider.getAllAdminRProductList(context);
  }
  Future<void> pickProductImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) setState(() => productImagePath = image.path);
  }

  void startAddingProduct() {
    setState(() {
      isAddingNewProduct = true;
      currentProduct = null;
      selectedApiProduct = null;
      productNameController.clear();
      productAliasNameController.clear();
      productDescriptionController.clear();
      productImagePath = null;
      _phaseDeptWorks.clear();
    });
  }

  void cancelAddingProduct() {
    setState(() {
      isAddingNewProduct = false;
      productNameController.clear();
      productAliasNameController.clear();
      productDescriptionController.clear();
      productImagePath = null;
      _phaseDeptWorks.clear();
    });
  }

  // -----------------------------------------------------------------
  // Save product
  // -----------------------------------------------------------------
  Future<void> saveProduct() async {
    if (productNameController.text.trim().isEmpty) {
      _showSnackBar('Please enter product name!', Colors.red);
      return;
    }
    if (productAliasNameController.text.trim().isEmpty) {
      _showSnackBar('Please enter product alias name!', Colors.red);
      return;
    }

    final body = {
      "title": productNameController.text.trim(),
      "alias": productAliasNameController.text.trim(),
      "description": productDescriptionController.text.trim(),
    };
    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    final imageFile = productImagePath != null && productImagePath!.isNotEmpty
        ? File(productImagePath!)
        : null;

    bool success;
    if (selectedApiProduct != null) {
      // Update existing product
      success = await _updateProduct(
        provider,
        body,
        selectedApiProduct!.sId!,
        imageFile: imageFile,
      );
    } else {
      // Add new product
      success = await provider.addAdminProduct(
        context,
        body,
        imageFile: imageFile,
      );
    }
    if (success) {
      await _loadProducts();
      setState(() {
        isAddingNewProduct = false;
        selectedApiProduct = null;
        productNameController.clear();
        productAliasNameController.clear();
        productDescriptionController.clear();
        productImagePath = null;
      });
      _showSnackBar(
        selectedApiProduct != null
            ? 'Product updated successfully!'
            : 'Product added successfully!',
        Colors.green,
      );
    }
  }

  Future<bool> _updateProduct(
    AdminMainApiProvider provider,
    Map<String, dynamic> body,
    String productId, {
    File? imageFile,
  }) async {
    try {
      await provider.updateAdminProduct(context, body, productId);
      if (provider.updateAdminProductModelResponse?.success == true) {
        return true;
      } else {
        _showSnackBar(
          provider.updateAdminProductModelResponse?.message ??
              'Failed to update product!',
          Colors.red,
        );
        return false;
      }
    } catch (e) {
      _showSnackBar('Error updating product: $e', Colors.red);
      return false;
    }
  }

  // -----------------------------------------------------------------
  // Select product → go to Work-Phases tab
  // -----------------------------------------------------------------
  void addWorkToProduct(productListData.Data product) {
    setState(() {
      selectedApiProduct = product;
      currentProduct = ProductData(
        productName: product.title ?? 'Unnamed Product',
        productDescription: product.description ?? '',
        productImage: product.productImage?.publicUrl ?? '',
        phase: '',
        department: '',
        createdAt: DateTime.now(),
        phases: [],
      );
      _phaseDeptWorks.clear();
      _mainTabController.animateTo(1);
    });
  }

  // -----------------------------------------------------------------
  // Helper – current WorkPhase for the selected (phase, dept)
  // -----------------------------------------------------------------
  WorkPhase _currentWorkPhase() {
    final phase = phasesList[_phaseTabController.index];
    final dept = phaseDepartments[phase]![_deptTabController.index];
    return _phaseDeptWorks
        .putIfAbsent(phase, () => {})
        .putIfAbsent(dept, () => WorkPhase());
  }

  // -----------------------------------------------------------------
  // SAVE WORK – builds full 3-phase payload (now multiple works per dept)
  // -----------------------------------------------------------------
  void saveWorkToProduct() async {
    if (currentProduct == null || selectedApiProduct == null) return;

    final List<Map<String, dynamic>> allPhases = [];

    for (final phaseKey in phasesList) {
      final departments = phaseDepartments[phaseKey] ?? [];

      final List<Map<String, dynamic>> departmentBlocks = [];

      for (final dept in departments) {
        final workPhase = _phaseDeptWorks[phaseKey]?[dept] ?? WorkPhase();

        final List<Map<String, dynamic>> worksJson = [];

        for (final workItem in workPhase.works) {
          worksJson.add({
            "workTitle": workItem.titleController.text.trim().isEmpty
                ? "Untitled Work"
                : workItem.titleController.text.trim(),
            "description": workItem.descriptionController.text.trim(),
            "tasks": workItem.tasks.map((task) {
              return {
                "taskTitle": task.titleController.text.trim().isEmpty
                    ? "Untitled Task"
                    : task.titleController.text.trim(),
                "description": task.descriptionController.text.trim(),
                "type": task.subTasks.isNotEmpty ? "subtask" : "activity",
                "subTasks": task.subTasks.map((subTask) {
                  return {
                    "subTaskTitle": subTask.titleController.text.trim().isEmpty
                        ? "Untitled SubTask"
                        : subTask.titleController.text.trim(),
                    "description": subTask.descriptionController.text.trim(),
                    "type": "activity",
                    "activities": task.activities
                        .map((activity) => _buildActivityJson(activity))
                        .toList(),
                  };
                }).toList(),
                "activities":
                    task.subTasks.isEmpty && task.activities.isNotEmpty
                    ? task.activities.map((a) => _buildActivityJson(a)).toList()
                    : [],
              };
            }).toList(),
          });
        }

        departmentBlocks.add({"departmentName": dept, "works": worksJson});
      }

      allPhases.add({
        "phaseName": "$phaseKey: ${departments.join(' & ')}",
        "departments": departmentBlocks,
      });
    }

    // validation
    final hasValidWork = _phaseDeptWorks.values.any(
      (deptMap) => deptMap.values.any(
        (wp) => wp.works.any((w) => w.titleController.text.trim().isNotEmpty),
      ),
    );
    if (!hasValidWork) {
      _showSnackBar('Please fill at least one work title!', Colors.red);
      return;
    }

    final requestBody = {
      "productId": selectedApiProduct!.sId,
      "phases": allPhases,
    };

    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    await provider.addAdminProductWorks(context, requestBody);

    if (provider.addAdminProductWorksModelResponse?.success == true) {
      _showSnackBar('Work saved successfully!', Colors.green);
      setState(() {
        _phaseDeptWorks.clear();
        currentProduct = null;
        _mainTabController.animateTo(0);
      });
    }
  }

  Map<String, dynamic> _buildActivityJson(Activity activity) {
    final hasSubActivities = activity.subActivities.isNotEmpty;
    return {
      "name": activity.titleController.text.trim().isEmpty
          ? "Untitled Activity"
          : activity.titleController.text.trim(),
      "description": activity.descriptionController.text.trim(),
      if (!hasSubActivities) ...{
        "instructions": activity.instructions
            .map((i) => i.titleController.text.trim())
            .where((s) => s.isNotEmpty)
            .toList(),
        "checklist": activity.checklistItems
            .map((c) => c.titleController.text.trim())
            .where((s) => s.isNotEmpty)
            .toList(),
      },
      "subActivities": activity.subActivities.map((subAct) {
        return {
          "subActivityTitle": subAct.titleController.text.trim().isEmpty
              ? "Untitled Sub-Activity"
              : subAct.titleController.text.trim(),
          "description": subAct.descriptionController.text.trim(),
          "instructions": subAct.instructions
              .map((i) => i.titleController.text.trim())
              .where((s) => s.isNotEmpty)
              .toList(),
          "checklist": subAct.checklistItems
              .map((c) => c.titleController.text.trim())
              .where((s) => s.isNotEmpty)
              .toList(),
        };
      }).toList(),
    };
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  // -----------------------------------------------------------------
  // Edit / Delete product
  // -----------------------------------------------------------------
  void _editProduct(productListData.Data product) {
    setState(() {
      selectedApiProduct = product;
      isAddingNewProduct = true;
      productNameController.text = product.title ?? '';
      productAliasNameController.text = product.alias ?? '';
      productDescriptionController.text = product.description ?? '';
      productImagePath = product.productImage?.publicUrl;
    });
  }

  Future<void> _deleteProduct(productListData.Data product) async {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete Product?'),
        content: Text('Are you sure you want to delete "${product.title}"?'),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              final provider = Provider.of<AdminMainApiProvider>(
                context,
                listen: false,
              );
              await provider.deleteSoftAdminProduct(context, {}, product.sId!);
              if (provider.deleteAdminProductModelResponse?.success == true) {
                await _loadProducts();
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  // -----------------------------------------------------------------
  // UI
  // -----------------------------------------------------------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          'Product Management',
          style: AppTextStyles.heading2(
            context,
            overrideStyle: const TextStyle(fontSize: 16, color: Colors.white),
          ),
        ),
        bottom: TabBar(
          controller: _mainTabController,
          indicatorColor: Colors.orange,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.grey[400],
          labelStyle: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 15,
          ),
          tabs: const [
            Tab(
              icon: Icon(Icons.inventory_2, color: Colors.white),
              text: 'Products',
            ),
            Tab(
              icon: Icon(Icons.work_outline, color: Colors.white),
              text: 'Work Phases',
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _mainTabController,
        physics: const NeverScrollableScrollPhysics(),
        children: [_buildProductsTab(), _buildPhasesTab()],
      ),
      floatingActionButton: _buildFloatingActionButton(),
    );
  }

  Widget _buildFloatingActionButton() {
    if (_mainTabController.index == 0) {
      if (isAddingNewProduct) {
        return FloatingActionButton.extended(
          onPressed: saveProduct,
          backgroundColor: selectedApiProduct == null ?  Color(0xFF00897B) : AppColors.orangeColor,
          icon: const Icon(Icons.save, color: Colors.white),
          label: Text(
            selectedApiProduct != null ? 'Update Product' : 'Save Product',
            style: TextStyle(color: Colors.white),
          ),
        );
      }
      return const SizedBox.shrink();
    }

    if (currentProduct != null && _phaseDeptWorks.isNotEmpty) {
      return FloatingActionButton.extended(
        onPressed: saveWorkToProduct,
        backgroundColor: const Color(0xFF00897B),
        icon: const Icon(Icons.save, color: Colors.white),
        label: const Text('Save Work', style: TextStyle(color: Colors.white)),
      );
    }
    return const SizedBox.shrink();
  }

  // ==================== PRODUCTS TAB ====================
  Widget _buildProductsTab() {
    if (isAddingNewProduct) return _buildProductForm();

    return Consumer<AdminMainApiProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) return LoadingIndicatorUtils();

        final response = provider.getAllAdminProductListModelResponse;
        if (response == null || !response.success) {
          return Center(
            child: _buildEmptyState(
              icon: Icons.inventory_2,
              message: 'No products added yet',
              actionLabel: 'Add First Product',
              onAction: startAddingProduct,
            ),
          );
        }

        final products = response.data?.data ?? [];
        if (products.isEmpty) {
          return Center(
            child: _buildEmptyState(
              icon: Icons.inventory_2,
              message: 'No products added yet',
              actionLabel: 'Add First Product',
              onAction: startAddingProduct,
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _loadProducts,
          child: Column(
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                color: Colors.white,
                child: ElevatedButton.icon(
                  onPressed: startAddingProduct,
                  icon: const Icon(Icons.add),
                  label: const Text('Add New Product'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF00897B),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: products.length,
                  itemBuilder: (context, i) => _buildProductCard(products[i],i),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // --------------------------------------------------------------
  // PRODUCT CARD (unchanged)
  // --------------------------------------------------------------
  Widget _buildProductCard(productListData.Data product, int index) {
    final imageUrl = product.productImage?.publicUrl;

    final List<List<Color>> gradients = [
      [const Color(0xFF6366F1), const Color(0xFF8B5CF6)],
      [const Color(0xFFEC4899), const Color(0xFFF59E0B)],
      [const Color(0xFF10B981), const Color(0xFF3B82F6)],
      [const Color(0xFF8B5CF6), const Color(0xFFEC4899)],
    ];

    final gradient = gradients[index % gradients.length];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: gradient[0].withOpacity(0.15),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (imageUrl != null && imageUrl.isNotEmpty)
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                  child: Image.network(
                    imageUrl,
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    loadingBuilder: (c, child, prog) => prog == null
                        ? child
                        : Container(
                      height: 200,
                      color: Colors.grey[300],
                      child: const Center(child: CircularProgressIndicator()),
                    ),
                    errorBuilder: (_, __, ___) => Container(
                      height: 200,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(colors: gradient),
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(24),
                          topRight: Radius.circular(24),
                        ),
                      ),
                      child: const Center(
                        child: Icon(Icons.image_not_supported_rounded, size: 50, color: Colors.white70),
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '#${index + 1}',
                      style: TextStyle(
                        color: gradient[0],
                        fontWeight: FontWeight.w800,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: product.isWork == true ? Colors.green[400] : Colors.orange[400],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          product.isWork == true ? 'Has Work' : 'Pending',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        product.title ?? 'Unnamed Product',
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF1F2937),
                          letterSpacing: -0.5,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.blue[50],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: InkWell(
                        onTap: () => _editProduct(product),
                        child: Icon(Icons.edit_rounded, color: Colors.blue[700], size: 20),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.red[50],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: InkWell(
                        onTap: () => _deleteProduct(product),
                        child: Icon(Icons.delete_rounded, color: Colors.red[400], size: 20),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: gradient[0].withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: gradient[0].withOpacity(0.3)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.tag_rounded, size: 14, color: gradient[0]),
                          const SizedBox(width: 4),
                          Text(
                            product.productId ?? 'N/A',
                            style: TextStyle(
                              color: gradient[0],
                              fontWeight: FontWeight.w700,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (product.alias != null && product.alias!.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: gradient[1].withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: gradient[1].withOpacity(0.3)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.label_rounded, size: 14, color: gradient[1]),
                            const SizedBox(width: 4),
                            Text(
                              product.alias!,
                              style: TextStyle(
                                color: gradient[1],
                                fontWeight: FontWeight.w700,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                if (product.description != null && product.description!.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey[50],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey[200]!),
                    ),
                    child: Text(
                      product.description!,
                      style: TextStyle(fontSize: 13, color: Colors.grey[700], height: 1.4),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(


                      child:   CustomButton(
                        text: "View Details",
                        color: Colors.grey[300]!,
                        textColor: Colors.black,
                        iconData: Icons.visibility_rounded,
                        iconColor: AppColors.primary,
                        type: ButtonType.outlined,
                        onPressed: () {
                          _showProductDetailsBottomSheet(context, product.sId ?? '');
                        },
                      )
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child:  CustomButton(
                        text: product.isWork == true ? 'Update Work' : 'Add Work',
                        iconData: product.isWork == true ? Icons.edit_rounded : Icons.add_task_rounded,
                        iconColor: AppColors.primary,
                        onPressed: () {
                          if (product.isWork == true) {
                            // TODO: update work
                          } else {
                            addWorkToProduct(product);
                          }
                        },
                      )


                      // ElevatedButton.icon(
                      //   onPressed: () {
                      //     if (product.isWork == true) {
                      //       // TODO: update work
                      //     } else {
                      //       addWorkToProduct(product);
                      //     }
                      //   },
                      //   icon: Icon(product.isWork == true ? Icons.edit_rounded : Icons.add_task_rounded, size: 18),
                      //   label: Text(product.isWork == true ? 'Update Work' : 'Add Work'),
                      //   style: ElevatedButton.styleFrom(
                      //     backgroundColor: product.isWork == true ? Colors.orange[700] : gradient[1],
                      //     foregroundColor: Colors.white,
                      //     padding: const EdgeInsets.symmetric(vertical: 14),
                      //     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      //     elevation: 0,
                      //   ),
                      // ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Align(
            alignment: Alignment.topRight,
            child: TextButton.icon(
              onPressed: cancelAddingProduct,
              icon: const Icon(Icons.close),
              label: const Text('Cancel'),
              style: TextButton.styleFrom(foregroundColor: Colors.red),
            ),
          ),
          _buildSectionCard(
            title: 'Product Information',
            icon: Icons.inventory_2,
            color: const Color(0xFF00897B),
            child: Column(
              children: [
                GestureDetector(
                  onTap: pickProductImage,
                  child: Container(
                    width: double.infinity,
                    height: 200,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey[300]!, width: 2),
                    ),
                    child: productImagePath != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: productImagePath!.startsWith('http')
                                ? Image.network(
                                    productImagePath!,
                                    fit: BoxFit.cover,
                                    loadingBuilder: (c, child, prog) =>
                                        prog == null
                                        ? child
                                        : const Center(
                                            child: CircularProgressIndicator(),
                                          ),
                                    errorBuilder: (_, __, ___) => const Center(
                                      child: Icon(
                                        Icons.error,
                                        size: 48,
                                        color: Colors.red,
                                      ),
                                    ),
                                  )
                                : Image.file(
                                    File(productImagePath!),
                                    fit: BoxFit.cover,
                                  ),
                          )
                        : const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.add_photo_alternate,
                                size: 48,
                                color: Colors.grey,
                              ),
                              SizedBox(height: 8),
                              Text(
                                'Tap to add product image',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                  ),
                ),
                const SizedBox(height: 16),
                _buildTextField(
                  "Product Name",
                  productNameController,
                  icon: Icons.shopping_bag,
                  hint: "Enter product name...",
                ),
                _buildTextField(
                  "Product Alias Name",
                  productAliasNameController,
                  icon: Icons.shopping_bag,
                  hint: "Enter product alias...",
                ),
                _buildTextField(
                  "Product Description",
                  productDescriptionController,
                  maxLines: 4,
                  hint: "Enter product description...",
                ),
              ],
            ),
          ),
          const SizedBox(height: 80),
        ],
      ),
    );
  }

  // ==================== WORK-PHASES TAB ====================
  Widget _buildPhasesTab() {
    if (currentProduct == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.work_outline, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            const Text(
              'Select a product to add work',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () => _mainTabController.animateTo(0),
              icon: const Icon(Icons.arrow_back),
              label: const Text('Go to Products'),
            ),
          ],
        ),
      );
    }

    return Column(
      children: [
        // Phase tabs
        Container(
          color: Colors.white,
          child: TabBar(
            controller: _phaseTabController,
            labelColor: Colors.purple[700],
            unselectedLabelColor: Colors.grey[600],
            indicatorColor: Colors.purple[700],
            tabs: phasesList.map((p) => Tab(text: p)).toList(),
          ),
        ),

        // Department tabs for the selected phase
        Container(
          color: Colors.white,
          child: TabBar(
            controller: _deptTabController,
            labelColor: Colors.blue[700],
            unselectedLabelColor: Colors.grey[600],
            indicatorColor: Colors.blue[700],
            isScrollable: true,
            tabs: phaseDepartments[phasesList[_phaseTabController.index]]!
                .map((d) => Tab(text: d))
                .toList(),
          ),
        ),

        // Work form inside the selected (phase, dept)
        Expanded(
          child: TabBarView(
            controller: _deptTabController,
            children: phaseDepartments[phasesList[_phaseTabController.index]]!
                .map((dept) {
                  final workPhase = _phaseDeptWorks
                      .putIfAbsent(
                        phasesList[_phaseTabController.index],
                        () => {},
                      )
                      .putIfAbsent(dept, () => WorkPhase());
                  return _buildWorkFormForPhaseDept(workPhase);
                })
                .toList(),
          ),
        ),
      ],
    );
  }

  // -----------------------------------------------------------------
  // Work form (now supports multiple WorkItems)
  // -----------------------------------------------------------------
  Widget _buildWorkFormForPhaseDept(WorkPhase phase) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Works",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              ElevatedButton.icon(
                onPressed: () => setState(() => phase.works.add(WorkItem())),
                icon: const Icon(Icons.add, size: 18),
                label: const Text("Add Work"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple[700],
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (phase.works.isEmpty)
            _buildEmptyState(
              icon: Icons.work_outline,
              message: 'No works added yet',
              actionLabel: 'Add First Work',
              onAction: () => setState(() => phase.works.add(WorkItem())),
            )
          else
            ...phase.works.asMap().entries.map((e) {
              final idx = e.key;
              final work = e.value;
              return _buildWorkItemCard(phase, work, idx);
            }),
          const SizedBox(height: 80),
        ],
      ),
    );
  }

  // -----------------------------------------------------------------
  // WORK ITEM CARD (title, desc, tasks, activities)
  // -----------------------------------------------------------------
  Widget _buildWorkItemCard(WorkPhase phase, WorkItem work, int workIndex) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(color: Colors.purple[200]!, width: 1.5),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          initiallyExpanded: true,
          tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.purple[700],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              '${workIndex + 1}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
          title: Text(
            work.titleController.text.isEmpty
                ? 'Work ${workIndex + 1}'
                : work.titleController.text,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 16,
              color: Colors.purple[900],
            ),
          ),
          subtitle: Text(
            '${work.tasks.length} Tasks',
            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
          ),
          trailing: IconButton(
            icon: Icon(Icons.delete_outline, color: Colors.red[400]),
            onPressed: () => _showDeleteDialog(
              context,
              'Delete Work?',
              'This will delete the entire work and all its tasks.',
              () => setState(() => phase.works.removeAt(workIndex)),
            ),
          ),
          children: [
            _buildTextField(
              "Work Title",
              work.titleController,
              icon: Icons.title,
              hint: "Enter work title...",
            ),
            const SizedBox(height: 12),
            _buildTextField(
              "Work Description",
              work.descriptionController,
              maxLines: 3,
              hint: "Enter work description...",
            ),
            const SizedBox(height: 16),
            _buildTasksSection(work), // Re-use existing task section
          ],
        ),
      ),
    );
  }

  // -----------------------------------------------------------------
  // TASKS SECTION (reused from old code, now inside WorkItem)
  // -----------------------------------------------------------------
  Widget _buildTasksSection(WorkItem work) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.blue[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.task_alt,
                    color: Colors.blue[700],
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                const Text(
                  "Tasks",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.blue[700],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${work.tasks.length}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            ElevatedButton.icon(
              onPressed: () => setState(() => work.tasks.add(Task())),
              icon: const Icon(Icons.add, size: 18),
              label: const Text('Add Task'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue[700],
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        if (work.tasks.isEmpty)
          _buildEmptyState(
            icon: Icons.task_alt,
            message: 'No tasks added yet',
            actionLabel: 'Add First Task',
            onAction: () => setState(() => work.tasks.add(Task())),
          )
        else
          ...work.tasks.asMap().entries.map((e) {
            final idx = e.key;
            final t = e.value;
            return _buildTaskCard(work, t, idx);
          }),
      ],
    );
  }

  // -----------------------------------------------------------------
  // TASK CARD (unchanged except parent is now WorkItem)
  // -----------------------------------------------------------------
  Widget _buildTaskCard(WorkItem work, Task task, int taskIndex) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.blue[300]!, width: 1.5),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          initiallyExpanded: true,
          tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.blue[700],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              '${taskIndex + 1}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
          title: Text(
            task.titleController.text.isEmpty
                ? 'Task ${taskIndex + 1}'
                : task.titleController.text,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 16,
              color: Colors.blue[900],
            ),
          ),
          subtitle: Text(
            '${task.subTasks.length} Sub-Tasks, ${task.activities.length} Activities',
            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
          ),
          trailing: IconButton(
            icon: Icon(Icons.delete_outline, color: Colors.red[400]),
            onPressed: () => _showDeleteDialog(
              context,
              'Delete Task?',
              'This will delete the task and all its sub-tasks and activities.',
              () => setState(() => work.tasks.removeAt(taskIndex)),
            ),
          ),
          children: [
            _buildTextField(
              "Task Title",
              task.titleController,
              icon: Icons.label_outline,
              hint: "Enter task title...",
            ),
            const SizedBox(height: 12),
            _buildTextField(
              "Task Description",
              task.descriptionController,
              maxLines: 4,
              hint: "Enter task description...",
            ),
            const SizedBox(height: 16),
            _buildSubTasksSection(task),
            const SizedBox(height: 16),
            _buildActivitiesSection(task),
          ],
        ),
      ),
    );
  }

  // -----------------------------------------------------------------
  // SUB-TASK SECTION (unchanged)
  // -----------------------------------------------------------------
  Widget _buildSubTasksSection(Task task) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.cyan[50],
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.cyan[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.subdirectory_arrow_right,
                    color: Colors.cyan[700],
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    "Sub-Tasks",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.cyan,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.cyan[700],
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      '${task.subTasks.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
              TextButton.icon(
                onPressed: () => setState(() => task.subTasks.add(SubTask())),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Add', style: TextStyle(fontSize: 12)),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.cyan[700],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                ),
              ),
            ],
          ),
          if (task.subTasks.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Center(
                child: Text(
                  'No sub-tasks added',
                  style: TextStyle(color: Colors.grey, fontSize: 13),
                ),
              ),
            )
          else
            ...task.subTasks.asMap().entries.map((e) {
              final i = e.key;
              final st = e.value;
              return _buildSubTaskCard(task, st, i);
            }),
        ],
      ),
    );
  }

  Widget _buildSubTaskCard(Task task, SubTask subTask, int subTaskIndex) {
    return Card(
      margin: const EdgeInsets.only(top: 8),
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          childrenPadding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
          leading: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.cyan[700],
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              '${subTaskIndex + 1}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
          title: Text(
            subTask.titleController.text.isEmpty
                ? 'Sub-Task ${subTaskIndex + 1}'
                : subTask.titleController.text,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
              color: Colors.cyan[900],
            ),
          ),
          trailing: IconButton(
            icon: Icon(Icons.close, color: Colors.red[400], size: 18),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            onPressed: () => _showDeleteDialog(
              context,
              'Delete Sub-Task?',
              'Are you sure you want to delete this sub-task?',
              () => setState(() => task.subTasks.removeAt(subTaskIndex)),
            ),
          ),
          children: [
            _buildTextField(
              "Sub-Task Title",
              subTask.titleController,
              icon: Icons.label,
              hint: "Enter sub-task title...",
              small: true,
            ),
            const SizedBox(height: 8),
            _buildTextField(
              "Sub-Task Description",
              subTask.descriptionController,
              maxLines: 4,
              hint: "Enter sub-task description...",
              small: true,
            ),
          ],
        ),
      ),
    );
  }

  // -----------------------------------------------------------------
  // ACTIVITIES SECTION (unchanged)
  // -----------------------------------------------------------------
  Widget _buildActivitiesSection(Task task) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.orange[50],
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.orange[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.local_activity,
                    color: Colors.orange[700],
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    "Activities",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.orange[700],
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      '${task.activities.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
              TextButton.icon(
                onPressed: () =>
                    setState(() => task.activities.add(Activity())),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Add', style: TextStyle(fontSize: 12)),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.orange[700],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                ),
              ),
            ],
          ),
          if (task.activities.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Center(
                child: Text(
                  'No activities added',
                  style: TextStyle(color: Colors.grey, fontSize: 13),
                ),
              ),
            )
          else
            ...task.activities.asMap().entries.map((e) {
              final i = e.key;
              final a = e.value;
              return _buildActivityCard(task, a, i);
            }),
        ],
      ),
    );
  }

  Widget _buildActivityCard(Task task, Activity act, int actIndex) {
    final hasSub = act.subActivities.isNotEmpty;
    return Card(
      margin: const EdgeInsets.only(top: 8),
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          childrenPadding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
          leading: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.orange[700],
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              '${actIndex + 1}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
          title: Text(
            act.titleController.text.isEmpty
                ? 'Activity ${actIndex + 1}'
                : act.titleController.text,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
              color: Colors.orange[900],
            ),
          ),
          subtitle: Text(
            hasSub
                ? '${act.subActivities.length} Sub-Activities'
                : '${act.instructions.length} Instructions, ${act.checklistItems.length} Checklist',
            style: TextStyle(fontSize: 11, color: Colors.grey[600]),
          ),
          trailing: IconButton(
            icon: Icon(Icons.close, color: Colors.red[400], size: 18),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            onPressed: () => _showDeleteDialog(
              context,
              'Delete Activity?',
              'Are you sure you want to delete this activity?',
              () => setState(() => task.activities.removeAt(actIndex)),
            ),
          ),
          children: [
            _buildTextField(
              "Activity Title",
              act.titleController,
              icon: Icons.fiber_manual_record,
              hint: "Enter activity title...",
              small: true,
            ),
            const SizedBox(height: 8),
            _buildTextField(
              "Activity Description",
              act.descriptionController,
              maxLines: 4,
              hint: "Enter activity description...",
              small: true,
            ),
            const SizedBox(height: 8),
            if (!hasSub) ...[
              _buildActivityInstructionsSection(act),
              const SizedBox(height: 8),
              _buildActivityChecklistSection(act),
              const SizedBox(height: 12),
            ],
            _buildSubActivitiesSection(act),
          ],
        ),
      ),
    );
  }

  // -----------------------------------------------------------------
  // INSTRUCTIONS / CHECKLIST / SUB-ACTIVITIES (unchanged)
  // -----------------------------------------------------------------
  Widget _buildActivityInstructionsSection(Activity act) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.teal[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.teal[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.info_outline, color: Colors.teal[700], size: 16),
                  const SizedBox(width: 6),
                  const Text(
                    "Instructions",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      color: Colors.teal,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.teal[700],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${act.instructions.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                ],
              ),
              TextButton.icon(
                onPressed: () =>
                    setState(() => act.instructions.add(InstructionItem())),
                icon: const Icon(Icons.add, size: 14),
                label: const Text('Add', style: TextStyle(fontSize: 11)),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.teal[700],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
              ),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 8),
          if (act.instructions.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: Center(
                child: Text(
                  'No instructions added',
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ),
            )
          else
            ...act.instructions.asMap().entries.map((e) {
              final i = e.key;
              final ins = e.value;
              return Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 1),
                decoration: BoxDecoration(
                  color: Colors.white70,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: ins.titleController,
                        style: const TextStyle(fontSize: 13),
                        decoration: InputDecoration(
                          hintText: "Instruction item...",
                          hintStyle: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[400],
                          ),
                          border: InputBorder.none,
                          isDense: true,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.close, size: 16, color: Colors.red[400]),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () =>
                          setState(() => act.instructions.removeAt(i)),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildActivityChecklistSection(Activity act) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.green[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.green[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.checklist, color: Colors.green[700], size: 16),
                  const SizedBox(width: 6),
                  const Text(
                    "Activity Checklist",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      color: Colors.green,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.green[700],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${act.checklistItems.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                ],
              ),
              TextButton.icon(
                onPressed: () =>
                    setState(() => act.checklistItems.add(ChecklistItem())),
                icon: const Icon(Icons.add, size: 14),
                label: const Text('Add', style: TextStyle(fontSize: 11)),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.green[700],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
              ),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 8),
          if (act.checklistItems.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: Center(
                child: Text(
                  'No checklist items added',
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ),
            )
          else
            ...act.checklistItems.asMap().entries.map((e) {
              final i = e.key;
              final ci = e.value;
              return _buildChecklistItemRow(
                ci,
                () => setState(() => act.checklistItems.removeAt(i)),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildSubActivitiesSection(Activity activity) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.deepOrange[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.deepOrange[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.arrow_right,
                    color: Colors.deepOrange[700],
                    size: 16,
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    "Sub-Activities",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      color: Colors.deepOrange,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.deepOrange[700],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${activity.subActivities.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                ],
              ),
              TextButton.icon(
                onPressed: () =>
                    setState(() => activity.subActivities.add(SubActivity())),
                icon: const Icon(Icons.add, size: 14),
                label: const Text('Add', style: TextStyle(fontSize: 11)),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.deepOrange[700],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
              ),
            ],
          ),
          if (activity.subActivities.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: Center(
                child: Text(
                  'No sub-activities added',
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ),
            )
          else
            ...activity.subActivities.asMap().entries.map((e) {
              final i = e.key;
              final sa = e.value;
              return _buildSubActivityCard(activity, sa, i);
            }),
        ],
      ),
    );
  }

  Widget _buildSubActivityCard(
    Activity activity,
    SubActivity subAct,
    int subActIndex,
  ) {
    return Card(
      margin: const EdgeInsets.only(top: 6),
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
          childrenPadding: const EdgeInsets.fromLTRB(10, 0, 10, 10),
          leading: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.deepOrange[700],
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              '${subActIndex + 1}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 11,
              ),
            ),
          ),
          title: Text(
            subAct.titleController.text.isEmpty
                ? 'Sub-Activity ${subActIndex + 1}'
                : subAct.titleController.text,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 13,
              color: Colors.deepOrange[900],
            ),
          ),
          subtitle: Text(
            '${subAct.instructions.length} Instructions, ${subAct.checklistItems.length} Checklist Items',
            style: TextStyle(fontSize: 10, color: Colors.grey[600]),
          ),
          trailing: IconButton(
            icon: Icon(Icons.close, color: Colors.red[400], size: 16),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            onPressed: () => _showDeleteDialog(
              context,
              'Delete Sub-Activity?',
              'Are you sure you want to delete this sub-activity?',
              () =>
                  setState(() => activity.subActivities.removeAt(subActIndex)),
            ),
          ),
          children: [
            _buildTextField(
              "Sub-Activity Title",
              subAct.titleController,
              icon: Icons.circle,
              hint: "Enter sub-activity title...",
              small: true,
            ),
            const SizedBox(height: 6),
            _buildTextField(
              "Sub-Activity Description",
              subAct.descriptionController,
              maxLines: 4,
              hint: "Enter sub-activity description...",
              small: true,
            ),
            const SizedBox(height: 8),
            _buildSubActivityInstructionsSection(subAct),
            const SizedBox(height: 8),
            _buildSubActivityChecklistSection(subAct),
          ],
        ),
      ),
    );
  }

  Widget _buildSubActivityInstructionsSection(SubActivity subAct) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.teal[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.teal[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.info_outline, color: Colors.teal[700], size: 16),
                  const SizedBox(width: 6),
                  const Text(
                    "Instructions",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      color: Colors.teal,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.teal[700],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${subAct.instructions.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                ],
              ),
              TextButton.icon(
                onPressed: () =>
                    setState(() => subAct.instructions.add(InstructionItem())),
                icon: const Icon(Icons.add, size: 14),
                label: const Text('Add', style: TextStyle(fontSize: 11)),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.teal[700],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
              ),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 8),
          if (subAct.instructions.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: Center(
                child: Text(
                  'No instructions added',
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ),
            )
          else
            ...subAct.instructions.asMap().entries.map((e) {
              final i = e.key;
              final ins = e.value;
              return Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: ins.titleController,
                        style: const TextStyle(fontSize: 13),
                        decoration: InputDecoration(
                          hintText: "Instruction item...",
                          hintStyle: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[400],
                          ),
                          border: InputBorder.none,
                          isDense: true,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.close, size: 16, color: Colors.red[400]),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () =>
                          setState(() => subAct.instructions.removeAt(i)),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildSubActivityChecklistSection(SubActivity subAct) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.green[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.green[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.checklist, color: Colors.green[700], size: 16),
                  const SizedBox(width: 6),
                  const Text(
                    "Sub-Activity Checklist",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      color: Colors.green,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.green[700],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${subAct.checklistItems.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                ],
              ),
              TextButton.icon(
                onPressed: () =>
                    setState(() => subAct.checklistItems.add(ChecklistItem())),
                icon: const Icon(Icons.add, size: 14),
                label: const Text('Add', style: TextStyle(fontSize: 11)),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.green[700],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
              ),
            ],
          ),
          ResponsiveHelper.sizedBoxHeight(context, 8),
          if (subAct.checklistItems.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: Center(
                child: Text(
                  'No checklist items added',
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ),
            )
          else
            ...subAct.checklistItems.asMap().entries.map((e) {
              final i = e.key;
              final ci = e.value;
              return _buildChecklistItemRow(
                ci,
                () => setState(() => subAct.checklistItems.removeAt(i)),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildChecklistItemRow(ChecklistItem item, VoidCallback onDelete) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: item.titleController,
              style: const TextStyle(fontSize: 13),
              decoration: InputDecoration(
                hintText: "Checklist item...",
                hintStyle: TextStyle(fontSize: 13, color: Colors.grey[400]),
                border: InputBorder.none,
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 4,
                ),
              ),
            ),
          ),
          IconButton(
            icon: Icon(Icons.close, size: 16, color: Colors.red[400]),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            onPressed: onDelete,
          ),
        ],
      ),
    );
  }

  // -----------------------------------------------------------------
  // COMMON WIDGETS
  // -----------------------------------------------------------------
  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required Color color,
    required Widget child,
  }) {
    return Container(
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                Icon(icon, color: color, size: 24),
                const SizedBox(width: 12),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
              ],
            ),
          ),
          Padding(padding: const EdgeInsets.all(16), child: child),
        ],
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String message,
    required String actionLabel,
    required VoidCallback onAction,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[300]!, width: 2),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            message,
            style: const TextStyle(
              fontSize: 16,
              color: Colors.grey,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Padding(
            padding: ResponsiveHelper.paddingSymmetric(
              context,
              horizontal: 30,
              vertical: 4,
            ),
            child: CustomButton(
              iconData: Icons.add,
              color: Colors.black,
              text: actionLabel,
              onPressed: onAction,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    int maxLines = 1,
    IconData? icon,
    bool small = false,
    String? hint,
  }) {
    final isMultiline = maxLines > 1;
    return CustomTextField(
      title: label,
      hintText: hint ?? label,
      controller: controller,
      prefixIcon: icon,
      isMultiLine: isMultiline,
      maxLines: maxLines,
      minLines: isMultiline ? maxLines : 1,
    );
  }

  void _showDeleteDialog(
    BuildContext context,
    String title,
    String message,
    VoidCallback onConfirm,
  ) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(message),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              onConfirm();
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  // -----------------------------------------------------------------
  // PRODUCT DETAILS BOTTOM SHEET (unchanged)
  // -----------------------------------------------------------------
  Future<void> _showProductDetailsBottomSheet(BuildContext context, String productId) async {
    final provider = Provider.of<AdminMainApiProvider>(context, listen: false);
    await provider.getAdminRProductSingleDetails(context, productId);

    if (!context.mounted) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Consumer<AdminMainApiProvider>(
        builder: (c, p, _) {
          if (p.isLoading) return const _BottomSheetLoading();
          return DraggableScrollableSheet(
            initialChildSize: 0.7,
            minChildSize: 0.5,
            maxChildSize: 0.95,
            builder: (c, sc) => Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24)),
              ),
              child: Column(
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 12, bottom: 8),
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)]),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.info_rounded, color: Colors.white, size: 20),
                            ),
                            const SizedBox(width: 12),
                            const Text('Product Details', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),
                  Expanded(child: _buildProductDetailsContent(sc, p.getAdminProductSingleDetailModelResponse)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildProductDetailsContent(ScrollController sc, ApiResponse<GetAdminProductDetailsModelResponse>? productResponse) {
    if (productResponse == null || !productResponse.success! || productResponse.data == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline_rounded, size: 64, color: Colors.red[300]),
            const SizedBox(height: 16),
            Text(productResponse?.message ?? 'Failed to load product details', style: const TextStyle(fontSize: 16, color: Colors.grey)),
          ],
        ),
      );
    }

    final d = productResponse.data!.data;
    final img = d?.productImage?.publicUrl;

    return SingleChildScrollView(
      controller: sc,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (img != null && img.isNotEmpty)
            ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Image.network(
                img,
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  height: 200,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)]),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.image_not_supported_rounded, size: 50, color: Colors.white70),
                ),
              ),
            ),
          const SizedBox(height: 20),
          Text(d?.title ?? 'No Title', style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Color(0xFF1F2937))),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildInfoChip(Icons.tag_rounded, 'ID: ${d?.productId ?? 'N/A'}', const Color(0xFF6366F1)),
              if (d?.alias != null) _buildInfoChip(Icons.label_rounded, 'Alias: ${d?.alias}', const Color(0xFF8B5CF6)),
            ],
          ),
          if (d?.description != null) ...[
            const SizedBox(height: 20),
            const Text('Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey[200]!),
              ),
              child: Text(d!.description!.toString(), style: const TextStyle(fontSize: 14, color: Colors.grey, height: 1.6)),
            ),
          ],
          const SizedBox(height: 20),
          const Text('Additional Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
          const SizedBox(height: 12),
          _buildInfoRow('Created At', _formatDate(d?.createdAt)),
          _buildInfoRow('Updated At', _formatDate(d?.updatedAt)),
          _buildInfoRow('Status', d?.isDeleted == true ? 'Deleted' : 'Active'),
        ],
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(color: color, fontWeight: FontWeight.w700, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) => Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(width: 120, child: Text('$label:', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600))),
        Expanded(child: Text(value, style: const TextStyle(fontSize: 14, color: Colors.grey))),
      ],
    ),
  );


  String _formatDate(String? s) {
    if (s == null || s.isEmpty) return 'N/A';
    try {
      final d = DateTime.parse(s);
      return '${d.day}/${d.month}/${d.year} ${d.hour}:${d.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return s;
    }
  }
}

class _BottomSheetLoading extends StatelessWidget {
  const _BottomSheetLoading({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (_, __) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
          ),
        ),
        child: const Center(child: LoadingIndicatorUtils()),
      ),
    );
  }
}

// ==================== DATA MODELS ====================
class ProductData {
  String productName;
  String productDescription;
  String productImage;
  String phase;
  String department;
  DateTime createdAt;
  List<WorkPhase> phases;

  ProductData({
    required this.productName,
    required this.productDescription,
    required this.productImage,
    required this.phase,
    required this.department,
    required this.createdAt,
    required this.phases,
  });
}

// NEW: WorkItem (replaces old single WorkPhase fields)
class WorkItem {
  TextEditingController titleController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  List<Task> tasks = [];
}

// Updated WorkPhase to hold multiple WorkItems
class WorkPhase {
  List<WorkItem> works = [];
}

class Task {
  TextEditingController titleController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  List<SubTask> subTasks = [];
  List<Activity> activities = [];
}

class SubTask {
  TextEditingController titleController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
}

class Activity {
  TextEditingController titleController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  List<InstructionItem> instructions = [];
  List<ChecklistItem> checklistItems = [];
  List<SubActivity> subActivities = [];
}

class SubActivity {
  TextEditingController titleController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  List<InstructionItem> instructions = [];
  List<ChecklistItem> checklistItems = [];
}

class ChecklistItem {
  TextEditingController titleController = TextEditingController();
  bool isCompleted = false;
}

class InstructionItem {
  TextEditingController titleController = TextEditingController();
}
