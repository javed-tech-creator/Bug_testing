class VendorUpdateProductModelResponse {
  bool? success;
  String? message;
  Product? product;

  VendorUpdateProductModelResponse({this.success, this.message, this.product});

  VendorUpdateProductModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? sId;
  String? productCode;
  String? productName;
  String? category;
  String? brand;
  String? unitType;
  String? size;
  String? description;
  num? rateUnit;
  num? gstPercent;
  num? inStock;
  num? usedStock;
  num? totalStock;
  String? importedBy;
  int? iV;
  String? createdAt;
  String? updatedAt;
  int? lowStockThreshold;

  Product(
      {this.sId,
        this.productCode,
        this.productName,
        this.category,
        this.brand,
        this.unitType,
        this.size,
        this.description,
        this.rateUnit,
        this.gstPercent,
        this.inStock,
        this.usedStock,
        this.totalStock,
        this.importedBy,
        this.iV,
        this.createdAt,
        this.updatedAt,
        this.lowStockThreshold});

  Product.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    productCode = json['productCode'];
    productName = json['productName'];
    category = json['category'];
    brand = json['brand'];
    unitType = json['unitType'];
    size = json['size'];
    description = json['description'];
    rateUnit = json['rateUnit'];
    gstPercent = json['gstPercent'];
    inStock = json['inStock'];
    usedStock = json['usedStock'];
    totalStock = json['totalStock'];
    importedBy = json['importedBy'];
    iV = json['__v'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    lowStockThreshold = json['lowStockThreshold'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['productCode'] = this.productCode;
    data['productName'] = this.productName;
    data['category'] = this.category;
    data['brand'] = this.brand;
    data['unitType'] = this.unitType;
    data['size'] = this.size;
    data['description'] = this.description;
    data['rateUnit'] = this.rateUnit;
    data['gstPercent'] = this.gstPercent;
    data['inStock'] = this.inStock;
    data['usedStock'] = this.usedStock;
    data['totalStock'] = this.totalStock;
    data['importedBy'] = this.importedBy;
    data['__v'] = this.iV;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['lowStockThreshold'] = this.lowStockThreshold;
    return data;
  }
}
