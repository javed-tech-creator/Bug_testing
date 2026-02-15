class TechDataSecurityAccessListModelResponse {
  bool? success;
  String? message;
  int? count;
  int? total;
  int? currentPage;
  int? totalPages;
  List<Data>? data;

  TechDataSecurityAccessListModelResponse(
      {this.success,
        this.message,
        this.count,
        this.total,
        this.currentPage,
        this.totalPages,
        this.data});

  TechDataSecurityAccessListModelResponse.fromJson(
      Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    count = json['count'];
    total = json['total'];
    currentPage = json['currentPage'];
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
    data['count'] = this.count;
    data['total'] = this.total;
    data['currentPage'] = this.currentPage;
    data['totalPages'] = this.totalPages;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? sId;
  String? employeeId;
  List<String>? systemAccess;
  String? role;
  String? loginHistory;
  String? deviceBinding;
  String? accessRevoked;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.sId,
        this.employeeId,
        this.systemAccess,
        this.role,
        this.loginHistory,
        this.deviceBinding,
        this.accessRevoked,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    employeeId = json['employeeId'];
    systemAccess = json['systemAccess'].cast<String>();
    role = json['role'];
    loginHistory = json['loginHistory'];
    deviceBinding = json['deviceBinding'];
    accessRevoked = json['accessRevoked'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['employeeId'] = this.employeeId;
    data['systemAccess'] = this.systemAccess;
    data['role'] = this.role;
    data['loginHistory'] = this.loginHistory;
    data['deviceBinding'] = this.deviceBinding;
    data['accessRevoked'] = this.accessRevoked;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
