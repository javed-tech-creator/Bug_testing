class VendorAddProductModelResponse {
  bool? success;
  String? message;
  Product? product;

  VendorAddProductModelResponse({this.success, this.message, this.product});

  VendorAddProductModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    product =
    json['product'] != null ? new Product.fromJson(json['product']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.product != null) {
      data['product'] = this.product!.toJson();
    }
    return data;
  }
}

class Product {
  String? productCode;
  String? productName;
  String? category;
  String? brand;
  String? unitType;
  String? size;
  String? description;
  int? lowStockThreshold;
  num? rateUnit;
  num? gstPercent;
  num? inStock;
  num? usedStock;
  num? totalStock;
  String? importedBy;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Product(
      {this.productCode,
        this.productName,
        this.category,
        this.brand,
        this.unitType,
        this.size,
        this.description,
        this.rateUnit,
        this.gstPercent,
        this.lowStockThreshold,
        this.inStock,
        this.usedStock,
        this.totalStock,
        this.importedBy,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Product.fromJson(Map<String, dynamic> json) {
    productCode = json['productCode'];
    productName = json['productName'];
    category = json['category'];
    brand = json['brand'];
    unitType = json['unitType'];
    size = json['size'];
    description = json['description'];
    rateUnit = json['rateUnit'];
    gstPercent = json['gstPercent'];
    lowStockThreshold = json['lowStockThreshold'];
    inStock = json['inStock'];
    usedStock = json['usedStock'];
    totalStock = json['totalStock'];
    importedBy = json['importedBy'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['productCode'] = this.productCode;
    data['productName'] = this.productName;
    data['category'] = this.category;
    data['brand'] = this.brand;
    data['unitType'] = this.unitType;
    data['size'] = this.size;
    data['description'] = this.description;
    data['rateUnit'] = this.rateUnit;
    data['gstPercent'] = this.gstPercent;
    data['lowStockThreshold'] = this.lowStockThreshold;
    data['inStock'] = this.inStock;
    data['usedStock'] = this.usedStock;
    data['totalStock'] = this.totalStock;
    data['importedBy'] = this.importedBy;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
