class GetAllDepartmentByBranchIdModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  List<Data>? data;
  String? timestamp;

  GetAllDepartmentByBranchIdModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  GetAllDepartmentByBranchIdModelResponse.fromJson(Map<String, dynamic> json) {
    statusCode = json['statusCode'];
    success = json['success'];
    message = json['message'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
    timestamp = json['timestamp'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['statusCode'] = this.statusCode;
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    data['timestamp'] = this.timestamp;
    return data;
  }
}

class Data {
  String? sId;
  String? title;
  Branch? branch;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? departmentId;

  Data(
      {this.sId,
        this.title,
        this.branch,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.departmentId});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    branch =
    json['branch'] != null ? new Branch.fromJson(json['branch']) : null;
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    departmentId = json['departmentId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    if (this.branch != null) {
      data['branch'] = this.branch!.toJson();
    }
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['departmentId'] = this.departmentId;
    return data;
  }
}

class Branch {
  String? sId;
  String? title;
  String? branchId;

  Branch({this.sId, this.title, this.branchId});

  Branch.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    branchId = json['branchId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['branchId'] = this.branchId;
    return data;
  }
}
