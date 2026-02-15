class VendorSingleProductModelResponse {
  bool? success;
  String? message;
  Data? data;

  VendorSingleProductModelResponse({this.success, this.message, this.data});

  VendorSingleProductModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    return data;
  }
}

class Data {
  String? sId;
  String? productCode;
  String? productName;
  String? category;
  String? brand;
  String? unitType;
  String? size;
  String? description;
  int? rateUnit;
  int? gstPercent;
  int? lowStockThreshold;
  int? inStock;
  int? usedStock;
  int? totalStock;
  String? importedBy;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
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
        this.lowStockThreshold,
        this.inStock,
        this.usedStock,
        this.totalStock,
        this.importedBy,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
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
    lowStockThreshold = json['lowStockThreshold'];
    inStock = json['inStock'];
    usedStock = json['usedStock'];
    totalStock = json['totalStock'];
    importedBy = json['importedBy'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
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
    data['lowStockThreshold'] = this.lowStockThreshold;
    data['inStock'] = this.inStock;
    data['usedStock'] = this.usedStock;
    data['totalStock'] = this.totalStock;
    data['importedBy'] = this.importedBy;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
