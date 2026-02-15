class GetAllDesignationListModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  List<Data>? data;
  String? timestamp;

  GetAllDesignationListModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  GetAllDesignationListModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? description;
  DepId? depId;
  BranchId? branchId;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? designationId;

  Data(
      {this.sId,
        this.title,
        this.description,
        this.depId,
        this.branchId,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.designationId});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    description = json['description'];
    depId = json['depId'] != null ? new DepId.fromJson(json['depId']) : null;
    branchId = json['branchId'] != null
        ? new BranchId.fromJson(json['branchId'])
        : null;
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    designationId = json['designationId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['description'] = this.description;
    if (this.depId != null) {
      data['depId'] = this.depId!.toJson();
    }
    if (this.branchId != null) {
      data['branchId'] = this.branchId!.toJson();
    }
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['designationId'] = this.designationId;
    return data;
  }
}

class DepId {
  String? sId;
  String? title;
  String? departmentId;

  DepId({this.sId, this.title, this.departmentId});

  DepId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    departmentId = json['departmentId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['departmentId'] = this.departmentId;
    return data;
  }
}

class BranchId {
  String? sId;
  String? title;
  String? branchId;

  BranchId({this.sId, this.title, this.branchId});

  BranchId.fromJson(Map<String, dynamic> json) {
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
