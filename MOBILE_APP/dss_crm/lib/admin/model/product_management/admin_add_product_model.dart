class AddAdminProductModelResponse {
  bool? success;
  String? message;
  Data? data;

  AddAdminProductModelResponse({this.success, this.message, this.data});

  AddAdminProductModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? title;
  String? description;
  String? alias;
  ProductImage? productImage;
  String? productId;
  bool? isDeleted;
  String? deletedBy;
  String? deletedAt;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.title,
        this.description,
        this.alias,
        this.productImage,
        this.productId,
        this.isDeleted,
        this.deletedBy,
        this.deletedAt,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    title = json['title'];
    description = json['description'];
    alias = json['alias'];
    productImage = json['productImage'] != null
        ? new ProductImage.fromJson(json['productImage'])
        : null;
    productId = json['productId'];
    isDeleted = json['isDeleted'];
    deletedBy = json['deletedBy'];
    deletedAt = json['deletedAt'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['title'] = this.title;
    data['description'] = this.description;
    data['alias'] = this.alias;
    if (this.productImage != null) {
      data['productImage'] = this.productImage!.toJson();
    }
    data['productId'] = this.productId;
    data['isDeleted'] = this.isDeleted;
    data['deletedBy'] = this.deletedBy;
    data['deletedAt'] = this.deletedAt;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class ProductImage {
  String? url;
  String? publicUrl;
  String? publicId;

  ProductImage({this.url, this.publicUrl, this.publicId});

  ProductImage.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    publicUrl = json['public_url'];
    publicId = json['public_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['public_url'] = this.publicUrl;
    data['public_id'] = this.publicId;
    return data;
  }
}
