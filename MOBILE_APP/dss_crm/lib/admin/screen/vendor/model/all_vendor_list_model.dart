class AllVendorListAtAdminModelResponse {
  bool? success;
  int? total;
  int? page;
  int? limit;
  int? totalPages;
  List<Data>? data;

  AllVendorListAtAdminModelResponse(
      {this.success,
        this.total,
        this.page,
        this.limit,
        this.totalPages,
        this.data});

  AllVendorListAtAdminModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    total = json['total'];
    page = json['page'];
    limit = json['limit'];
    totalPages = json['totalPages'];
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
    data['total'] = this.total;
    data['page'] = this.page;
    data['limit'] = this.limit;
    data['totalPages'] = this.totalPages;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? sId;
  String? profileId;
  String? contactPersonName;
  String? contactNumber;
  String? alternateContact;
  String? email;
  String? businessName;
  String? address;
  String? city;
  String? state;
  bool? isActive;

  Data(
      {this.sId,
        this.profileId,
        this.contactPersonName,
        this.contactNumber,
        this.alternateContact,
        this.email,
        this.businessName,
        this.address,
        this.city,
        this.state,
        this.isActive});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    profileId = json['profileId'];
    contactPersonName = json['contactPersonName'];
    contactNumber = json['contactNumber'];
    alternateContact = json['alternateContact'];
    email = json['email'];
    businessName = json['businessName'];
    address = json['address'];
    city = json['city'];
    state = json['state'];
    isActive = json['isActive'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['profileId'] = this.profileId;
    data['contactPersonName'] = this.contactPersonName;
    data['contactNumber'] = this.contactNumber;
    data['alternateContact'] = this.alternateContact;
    data['email'] = this.email;
    data['businessName'] = this.businessName;
    data['address'] = this.address;
    data['city'] = this.city;
    data['state'] = this.state;
    data['isActive'] = this.isActive;
    return data;
  }
}
