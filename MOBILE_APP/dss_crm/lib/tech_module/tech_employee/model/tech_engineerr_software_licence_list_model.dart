class TechEngineerLicenseSoftwareListModelResponse {
  bool? success;
  String? message;
  int? total;
  int? page;
  int? limit;
  int? totalPages;
  List<Data>? data;

  TechEngineerLicenseSoftwareListModelResponse(
      {this.success,
        this.message,
        this.total,
        this.page,
        this.limit,
        this.totalPages,
        this.data});

  TechEngineerLicenseSoftwareListModelResponse.fromJson(
      Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
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
    data['message'] = this.message;
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
  String? licenseId;
  String? softwareName;
  String? versionType;
  String? validityEnd;
  int? iV;
  AssignedTo? assignedTo;
  String? expireIn;

  Data(
      {this.sId,
        this.licenseId,
        this.softwareName,
        this.versionType,
        this.validityEnd,
        this.iV,
        this.assignedTo,
        this.expireIn});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    licenseId = json['licenseId'];
    softwareName = json['softwareName'];
    versionType = json['versionType'];
    validityEnd = json['validityEnd'];
    iV = json['__v'];
    assignedTo = json['assignedTo'] != null
        ? new AssignedTo.fromJson(json['assignedTo'])
        : null;
    expireIn = json['expireIn'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['licenseId'] = this.licenseId;
    data['softwareName'] = this.softwareName;
    data['versionType'] = this.versionType;
    data['validityEnd'] = this.validityEnd;
    data['__v'] = this.iV;
    if (this.assignedTo != null) {
      data['assignedTo'] = this.assignedTo!.toJson();
    }
    data['expireIn'] = this.expireIn;
    return data;
  }
}

class AssignedTo {
  String? date;
  String? department;
  String? name;
  String? role;
  String? employeeId;

  AssignedTo(
      {this.date, this.department, this.name, this.role, this.employeeId});

  AssignedTo.fromJson(Map<String, dynamic> json) {
    date = json['date'];
    department = json['department'];
    name = json['name'];
    role = json['role'];
    employeeId = json['employeeId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['date'] = this.date;
    data['department'] = this.department;
    data['name'] = this.name;
    data['role'] = this.role;
    data['employeeId'] = this.employeeId;
    return data;
  }
}
