class VendorDetailAtAdminModelResponse {
  bool? success;
  String? message;
  Data? data;

  VendorDetailAtAdminModelResponse({this.success, this.message, this.data});

  VendorDetailAtAdminModelResponse.fromJson(Map<String, dynamic> json) {
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
  ProfileImage? profileImage;
  ProfileImage? contractForm;
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
  String? pincode;
  String? gstNumber;
  String? panNumber;
  String? aadharNumber;
  String? bankName;
  String? accountNumber;
  String? ifscCode;
  List<AdditionalDocs>? additionalDocs;
  bool? isActive;
  bool? isDelete;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.profileImage,
        this.contractForm,
        this.sId,
        this.profileId,
        this.contactPersonName,
        this.contactNumber,
        this.alternateContact,
        this.email,
        this.businessName,
        this.address,
        this.city,
        this.state,
        this.pincode,
        this.gstNumber,
        this.panNumber,
        this.aadharNumber,
        this.bankName,
        this.accountNumber,
        this.ifscCode,
        this.additionalDocs,
        this.isActive,
        this.isDelete,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    profileImage = json['profileImage'] != null
        ? new ProfileImage.fromJson(json['profileImage'])
        : null;
    contractForm = json['contractForm'] != null
        ? new ProfileImage.fromJson(json['contractForm'])
        : null;
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
    pincode = json['pincode'];
    gstNumber = json['gstNumber'];
    panNumber = json['panNumber'];
    aadharNumber = json['aadharNumber'];
    bankName = json['bankName'];
    accountNumber = json['accountNumber'];
    ifscCode = json['ifscCode'];
    if (json['additionalDocs'] != null) {
      additionalDocs = <AdditionalDocs>[];
      json['additionalDocs'].forEach((v) {
        additionalDocs!.add(new AdditionalDocs.fromJson(v));
      });
    }
    isActive = json['isActive'];
    isDelete = json['isDelete'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.profileImage != null) {
      data['profileImage'] = this.profileImage!.toJson();
    }
    if (this.contractForm != null) {
      data['contractForm'] = this.contractForm!.toJson();
    }
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
    data['pincode'] = this.pincode;
    data['gstNumber'] = this.gstNumber;
    data['panNumber'] = this.panNumber;
    data['aadharNumber'] = this.aadharNumber;
    data['bankName'] = this.bankName;
    data['accountNumber'] = this.accountNumber;
    data['ifscCode'] = this.ifscCode;
    if (this.additionalDocs != null) {
      data['additionalDocs'] =
          this.additionalDocs!.map((v) => v.toJson()).toList();
    }
    data['isActive'] = this.isActive;
    data['isDelete'] = this.isDelete;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class ProfileImage {
  String? fileName;
  String? fileType;
  String? url;
  String? publicUrl;
  String? publicId;

  ProfileImage(
      {this.fileName, this.fileType, this.url, this.publicUrl, this.publicId});

  ProfileImage.fromJson(Map<String, dynamic> json) {
    fileName = json['fileName'];
    fileType = json['fileType'];
    url = json['url'];
    publicUrl = json['public_url'];
    publicId = json['public_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['fileName'] = this.fileName;
    data['fileType'] = this.fileType;
    data['url'] = this.url;
    data['public_url'] = this.publicUrl;
    data['public_id'] = this.publicId;
    return data;
  }
}

class AdditionalDocs {
  String? docTitle;
  String? fileName;
  String? fileType;
  String? url;
  String? publicUrl;
  String? publicId;
  String? sId;

  AdditionalDocs(
      {this.docTitle,
        this.fileName,
        this.fileType,
        this.url,
        this.publicUrl,
        this.publicId,
        this.sId});

  AdditionalDocs.fromJson(Map<String, dynamic> json) {
    docTitle = json['docTitle'];
    fileName = json['fileName'];
    fileType = json['fileType'];
    url = json['url'];
    publicUrl = json['public_url'];
    publicId = json['public_id'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['docTitle'] = this.docTitle;
    data['fileName'] = this.fileName;
    data['fileType'] = this.fileType;
    data['url'] = this.url;
    data['public_url'] = this.publicUrl;
    data['public_id'] = this.publicId;
    data['_id'] = this.sId;
    return data;
  }
}
