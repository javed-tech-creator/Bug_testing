class VendorProfileModelResponse {
  bool? success;
  String? message;
  Data? data;

  VendorProfileModelResponse({this.success, this.message, this.data});

  VendorProfileModelResponse.fromJson(Map<String, dynamic> json) {
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
  PersonalInfo? personalInfo;
  Address? address;
  KycDetails? kycDetails;
  ContractForm? contractForm;
  ProfileImage? profileImage;
  String? sId;
  String? userId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.personalInfo,
        this.address,
        this.kycDetails,
        this.contractForm,
        this.profileImage,
        this.sId,
        this.userId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    personalInfo = json['personalInfo'] != null
        ? new PersonalInfo.fromJson(json['personalInfo'])
        : null;
    address =
    json['address'] != null ? new Address.fromJson(json['address']) : null;
    kycDetails = json['kycDetails'] != null
        ? new KycDetails.fromJson(json['kycDetails'])
        : null;
    contractForm = json['contractForm'] != null
        ? new ContractForm.fromJson(json['contractForm'])
        : null;
    profileImage = json['profileImage'] != null
        ? new ProfileImage.fromJson(json['profileImage'])
        : null;
    sId = json['_id'];
    userId = json['userId'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.personalInfo != null) {
      data['personalInfo'] = this.personalInfo!.toJson();
    }
    if (this.address != null) {
      data['address'] = this.address!.toJson();
    }
    if (this.kycDetails != null) {
      data['kycDetails'] = this.kycDetails!.toJson();
    }
    if (this.contractForm != null) {
      data['contractForm'] = this.contractForm!.toJson();
    }
    if (this.profileImage != null) {
      data['profileImage'] = this.profileImage!.toJson();
    }
    data['_id'] = this.sId;
    data['userId'] = this.userId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class PersonalInfo {
  String? alternateContact;
  String? businessName;
  String? contactNumber;
  String? contactPersonName;
  String? email;

  PersonalInfo(
      {this.alternateContact,
        this.businessName,
        this.contactNumber,
        this.contactPersonName,
        this.email});

  PersonalInfo.fromJson(Map<String, dynamic> json) {
    alternateContact = json['alternateContact'];
    businessName = json['businessName'];
    contactNumber = json['contactNumber'];
    contactPersonName = json['contactPersonName'];
    email = json['email'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['alternateContact'] = this.alternateContact;
    data['businessName'] = this.businessName;
    data['contactNumber'] = this.contactNumber;
    data['contactPersonName'] = this.contactPersonName;
    data['email'] = this.email;
    return data;
  }
}

class Address {
  String? area;
  String? city;
  String? pincode;
  String? state;
  String? street;

  Address({this.area, this.city, this.pincode, this.state, this.street});

  Address.fromJson(Map<String, dynamic> json) {
    area = json['area'];
    city = json['city'];
    pincode = json['pincode'];
    state = json['state'];
    street = json['street'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['area'] = this.area;
    data['city'] = this.city;
    data['pincode'] = this.pincode;
    data['state'] = this.state;
    data['street'] = this.street;
    return data;
  }
}

class KycDetails {
  String? aadharNumber;
  String? accountNumber;
  String? bankName;
  String? cin;
  String? gstNumber;
  String? ifscCode;
  String? panNumber;
  String? tin;

  KycDetails(
      {this.aadharNumber,
        this.accountNumber,
        this.bankName,
        this.cin,
        this.gstNumber,
        this.ifscCode,
        this.panNumber,
        this.tin});

  KycDetails.fromJson(Map<String, dynamic> json) {
    aadharNumber = json['aadharNumber'];
    accountNumber = json['accountNumber'];
    bankName = json['bankName'];
    cin = json['cin'];
    gstNumber = json['gstNumber'];
    ifscCode = json['ifscCode'];
    panNumber = json['panNumber'];
    tin = json['tin'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['aadharNumber'] = this.aadharNumber;
    data['accountNumber'] = this.accountNumber;
    data['bankName'] = this.bankName;
    data['cin'] = this.cin;
    data['gstNumber'] = this.gstNumber;
    data['ifscCode'] = this.ifscCode;
    data['panNumber'] = this.panNumber;
    data['tin'] = this.tin;
    return data;
  }
}

class ContractForm {
  String? fileName;
  String? fileUrl;

  ContractForm({this.fileName, this.fileUrl});

  ContractForm.fromJson(Map<String, dynamic> json) {
    fileName = json['fileName'];
    fileUrl = json['fileUrl'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['fileName'] = this.fileName;
    data['fileUrl'] = this.fileUrl;
    return data;
  }
}

class ProfileImage {
  String? fileName;
  String? publicId;
  String? fileUrl;

  ProfileImage({this.fileName, this.publicId, this.fileUrl});

  ProfileImage.fromJson(Map<String, dynamic> json) {
    fileName = json['fileName'];
    publicId = json['public_id'];
    fileUrl = json['fileUrl'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['fileName'] = this.fileName;
    data['public_id'] = this.publicId;
    data['fileUrl'] = this.fileUrl;
    return data;
  }
}
