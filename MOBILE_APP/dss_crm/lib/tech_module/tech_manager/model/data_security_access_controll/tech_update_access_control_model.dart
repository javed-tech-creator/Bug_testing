class TechUpdateAccessControlModelResponse {
  bool? success;
  String? message;
  Data? data;

  TechUpdateAccessControlModelResponse({this.success, this.message, this.data});

  TechUpdateAccessControlModelResponse.fromJson(Map<String, dynamic> json) {
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
