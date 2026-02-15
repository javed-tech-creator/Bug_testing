class TechMangerAddLicenceSoftwareModelResponse {
  bool? success;
  String? message;
  Data? data;

  TechMangerAddLicenceSoftwareModelResponse(
      {this.success, this.message, this.data});

  TechMangerAddLicenceSoftwareModelResponse.fromJson(
      Map<String, dynamic> json) {
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
  String? licenseId;
  String? softwareName;
  String? versionType;
  String? validityStart;
  String? validityEnd;
  int? seats;
  String? renewalAlert;
  String? vendorDetails;
  String? department;
  String? role;
  String? assignedTo;
  String? employeeId;
  String? createdBy;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.licenseId,
        this.softwareName,
        this.versionType,
        this.validityStart,
        this.validityEnd,
        this.seats,
        this.renewalAlert,
        this.vendorDetails,
        this.department,
        this.role,
        this.assignedTo,
        this.employeeId,
        this.createdBy,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    licenseId = json['licenseId'];
    softwareName = json['softwareName'];
    versionType = json['versionType'];
    validityStart = json['validityStart'];
    validityEnd = json['validityEnd'];
    seats = json['seats'];
    renewalAlert = json['renewalAlert'];
    vendorDetails = json['vendorDetails'];
    department = json['department'];
    role = json['role'];
    assignedTo = json['assigned_to'];
    employeeId = json['employeeId'];
    createdBy = json['createdBy'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['licenseId'] = this.licenseId;
    data['softwareName'] = this.softwareName;
    data['versionType'] = this.versionType;
    data['validityStart'] = this.validityStart;
    data['validityEnd'] = this.validityEnd;
    data['seats'] = this.seats;
    data['renewalAlert'] = this.renewalAlert;
    data['vendorDetails'] = this.vendorDetails;
    data['department'] = this.department;
    data['role'] = this.role;
    data['assigned_to'] = this.assignedTo;
    data['employeeId'] = this.employeeId;
    data['createdBy'] = this.createdBy;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
