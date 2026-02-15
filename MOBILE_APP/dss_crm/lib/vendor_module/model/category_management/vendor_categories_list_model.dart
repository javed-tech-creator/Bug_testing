class VendorCategoryListModelResponse {
  bool? success;
  List<Data>? data;

  VendorCategoryListModelResponse({this.success, this.data});

  VendorCategoryListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? sId;
  String? categoryName;
  String? createdAt;
  int? productCount;

  Data({this.sId, this.categoryName, this.createdAt, this.productCount});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    categoryName = json['categoryName'];
    createdAt = json['createdAt'];
    productCount = json['productCount'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['categoryName'] = this.categoryName;
    data['createdAt'] = this.createdAt;
    data['productCount'] = this.productCount;
    return data;
  }
}
