class AllEmpLeaveRequestsListModel {
  bool? success;
  String? message;
  List<Data>? data;

  AllEmpLeaveRequestsListModel({this.success, this.message, this.data});

  AllEmpLeaveRequestsListModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
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
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? sId;
  EmployeeId? employeeId;
  String? leaveType;
  String? startDate;
  String? endDate;
  String? reason;
  String? status;
  String? description;
  String? appliedAt;
  String? createdAt;
  String? updatedAt;
  int? iV;
  Null? department;

  Data(
      {this.sId,
        this.employeeId,
        this.leaveType,
        this.startDate,
        this.endDate,
        this.reason,
        this.status,
        this.description,
        this.appliedAt,
        this.createdAt,
        this.updatedAt,
        this.iV,
        this.department});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    employeeId = json['employeeId'] != null
        ? new EmployeeId.fromJson(json['employeeId'])
        : null;
    leaveType = json['leaveType'];
    startDate = json['startDate'];
    endDate = json['endDate'];
    reason = json['reason'];
    status = json['status'];
    description = json['description'];
    appliedAt = json['appliedAt'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
    department = json['department'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    if (this.employeeId != null) {
      data['employeeId'] = this.employeeId!.toJson();
    }
    data['leaveType'] = this.leaveType;
    data['startDate'] = this.startDate;
    data['endDate'] = this.endDate;
    data['reason'] = this.reason;
    data['status'] = this.status;
    data['description'] = this.description;
    data['appliedAt'] = this.appliedAt;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    data['department'] = this.department;
    return data;
  }
}

class EmployeeId {
  String? sId;
  String? name;
  String? email;
  BranchId? branchId;
  BranchId? departmentId;
  BranchId? designationId;

  EmployeeId(
      {this.sId,
        this.name,
        this.email,
        this.branchId,
        this.departmentId,
        this.designationId});

  EmployeeId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    email = json['email'];
    branchId = json['branchId'] != null
        ? new BranchId.fromJson(json['branchId'])
        : null;
    departmentId = json['departmentId'] != null
        ? new BranchId.fromJson(json['departmentId'])
        : null;
    designationId = json['designationId'] != null
        ? new BranchId.fromJson(json['designationId'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['email'] = this.email;
    if (this.branchId != null) {
      data['branchId'] = this.branchId!.toJson();
    }
    if (this.departmentId != null) {
      data['departmentId'] = this.departmentId!.toJson();
    }
    if (this.designationId != null) {
      data['designationId'] = this.designationId!.toJson();
    }
    return data;
  }
}

class BranchId {
  String? sId;
  String? title;

  BranchId({this.sId, this.title});

  BranchId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    return data;
  }
}
