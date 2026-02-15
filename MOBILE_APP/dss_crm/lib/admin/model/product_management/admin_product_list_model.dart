class GetAdminProductListModelResponse {
  bool? success;
  String? message;
  int? count;
  List<Data>? data;

  GetAdminProductListModelResponse(
      {this.success, this.message, this.count, this.data});

  GetAdminProductListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    count = json['count'];
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
    data['message'] = this.message;
    data['count'] = this.count;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? sId;
  String? title;
  String? description;
  String? alias;
  ProductImage? productImage;
  String? productId;
  bool? isActive;
  String? createdAt;
  int? iV;
  bool? isWork;

  Data(
      {this.sId,
        this.title,
        this.description,
        this.alias,
        this.productImage,
        this.productId,
        this.isActive,
        this.createdAt,
        this.iV,
        this.isWork});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    description = json['description'];
    alias = json['alias'];
    productImage = json['productImage'] != null
        ? new ProductImage.fromJson(json['productImage'])
        : null;
    productId = json['productId'];
    isActive = json['isActive'];
    createdAt = json['createdAt'];
    iV = json['__v'];
    isWork = json['isWork'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['description'] = this.description;
    data['alias'] = this.alias;
    if (this.productImage != null) {
      data['productImage'] = this.productImage!.toJson();
    }
    data['productId'] = this.productId;
    data['isActive'] = this.isActive;
    data['createdAt'] = this.createdAt;
    data['__v'] = this.iV;
    data['isWork'] = this.isWork;
    return data;
  }
}

class ProductImage {
  String? url;
  String? publicUrl;

  ProductImage({this.url, this.publicUrl});

  ProductImage.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    publicUrl = json['public_url'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['public_url'] = this.publicUrl;
    return data;
  }
}
