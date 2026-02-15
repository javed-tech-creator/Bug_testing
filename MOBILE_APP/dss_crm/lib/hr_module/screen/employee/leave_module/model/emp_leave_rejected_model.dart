class LeaveRejectedModel {
  bool? success;
  String? message;
  Data? data;

  LeaveRejectedModel({this.success, this.message, this.data});

  LeaveRejectedModel.fromJson(Map<String, dynamic> json) {
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
  String? leaveType;
  String? startDate;
  String? endDate;
  String? reason;
  String? status;
  String? description;
  String? breakDown;
  String? appliedAt;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.sId,
        this.employeeId,
        this.leaveType,
        this.startDate,
        this.endDate,
        this.reason,
        this.status,
        this.description,
        this.breakDown,
        this.appliedAt,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    employeeId = json['employeeId'];
    leaveType = json['leaveType'];
    startDate = json['startDate'];
    endDate = json['endDate'];
    reason = json['reason'];
    status = json['status'];
    description = json['description'];
    breakDown = json['breakDown'];
    appliedAt = json['appliedAt'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['employeeId'] = this.employeeId;
    data['leaveType'] = this.leaveType;
    data['startDate'] = this.startDate;
    data['endDate'] = this.endDate;
    data['reason'] = this.reason;
    data['status'] = this.status;
    data['description'] = this.description;
    data['breakDown'] = this.breakDown;
    data['appliedAt'] = this.appliedAt;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
