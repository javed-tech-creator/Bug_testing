class VendorAddCustomerModelResponse {
  bool? success;
  String? message;
  Data? data;

  VendorAddCustomerModelResponse({this.success, this.message, this.data});

  VendorAddCustomerModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? createdBy;
  String? fullName;
  String? phone;
  String? email;
  String? gstin;
  String? companyName;
  String? addressLine1;
  String? addressLine2;
  String? city;
  String? pincode;
  String? state;
  String? country;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.createdBy,
        this.fullName,
        this.phone,
        this.email,
        this.gstin,
        this.companyName,
        this.addressLine1,
        this.addressLine2,
        this.city,
        this.pincode,
        this.state,
        this.country,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    createdBy = json['createdBy'];
    fullName = json['fullName'];
    phone = json['phone'];
    email = json['email'];
    gstin = json['gstin'];
    companyName = json['companyName'];
    addressLine1 = json['addressLine1'];
    addressLine2 = json['addressLine2'];
    city = json['city'];
    pincode = json['pincode'];
    state = json['state'];
    country = json['country'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['createdBy'] = this.createdBy;
    data['fullName'] = this.fullName;
    data['phone'] = this.phone;
    data['email'] = this.email;
    data['gstin'] = this.gstin;
    data['companyName'] = this.companyName;
    data['addressLine1'] = this.addressLine1;
    data['addressLine2'] = this.addressLine2;
    data['city'] = this.city;
    data['pincode'] = this.pincode;
    data['state'] = this.state;
    data['country'] = this.country;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
