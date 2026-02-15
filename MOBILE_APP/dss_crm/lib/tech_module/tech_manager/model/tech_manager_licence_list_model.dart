class TechLicenceListModelResponse {
  bool? success;
  List<Data>? data;
  int? total;
  int? page;
  int? limit;
  int? totalPages;

  TechLicenceListModelResponse(
      {this.success,
        this.data,
        this.total,
        this.page,
        this.limit,
        this.totalPages});

  TechLicenceListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
    total = json['total'];
    page = json['page'];
    limit = json['limit'];
    totalPages = json['totalPages'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    data['total'] = this.total;
    data['page'] = this.page;
    data['limit'] = this.limit;
    data['totalPages'] = this.totalPages;
    return data;
  }
}

class Data {
  String? sId;
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
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.sId,
        this.licenseId,
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
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
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
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
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
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
