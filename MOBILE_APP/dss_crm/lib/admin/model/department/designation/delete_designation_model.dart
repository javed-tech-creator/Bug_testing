class DeleteDesignationModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  DeleteDesignationModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  DeleteDesignationModelResponse.fromJson(Map<String, dynamic> json) {
    statusCode = json['statusCode'];
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
    timestamp = json['timestamp'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['statusCode'] = this.statusCode;
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    data['timestamp'] = this.timestamp;
    return data;
  }
}

class Data {
  String? sId;
  String? title;
  String? description;
  String? depId;
  String? branchId;
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
    depId = json['depId'];
    branchId = json['branchId'];
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
    data['depId'] = this.depId;
    data['branchId'] = this.branchId;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['designationId'] = this.designationId;
    return data;
  }
}
