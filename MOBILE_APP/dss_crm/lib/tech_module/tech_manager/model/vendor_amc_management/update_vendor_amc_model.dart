class UpdateTechVendorAMCModelResponse {
  bool? success;
  String? message;
  Data? data;

  UpdateTechVendorAMCModelResponse({this.success, this.message, this.data});

  UpdateTechVendorAMCModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? vendorId;
  String? companyName;
  String? services;
  String? contactName;
  String? contactPhone;
  String? contactEmail;
  String? contractStart;
  String? contractEnd;
  String? renewalTerms;
  String? slaCommitments;
  String? serviceLogs;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.sId,
        this.vendorId,
        this.companyName,
        this.services,
        this.contactName,
        this.contactPhone,
        this.contactEmail,
        this.contractStart,
        this.contractEnd,
        this.renewalTerms,
        this.slaCommitments,
        this.serviceLogs,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    vendorId = json['vendorId'];
    companyName = json['companyName'];
    services = json['services'];
    contactName = json['contactName'];
    contactPhone = json['contactPhone'];
    contactEmail = json['contactEmail'];
    contractStart = json['contractStart'];
    contractEnd = json['contractEnd'];
    renewalTerms = json['renewalTerms'];
    slaCommitments = json['slaCommitments'];
    serviceLogs = json['serviceLogs'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['vendorId'] = this.vendorId;
    data['companyName'] = this.companyName;
    data['services'] = this.services;
    data['contactName'] = this.contactName;
    data['contactPhone'] = this.contactPhone;
    data['contactEmail'] = this.contactEmail;
    data['contractStart'] = this.contractStart;
    data['contractEnd'] = this.contractEnd;
    data['renewalTerms'] = this.renewalTerms;
    data['slaCommitments'] = this.slaCommitments;
    data['serviceLogs'] = this.serviceLogs;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
