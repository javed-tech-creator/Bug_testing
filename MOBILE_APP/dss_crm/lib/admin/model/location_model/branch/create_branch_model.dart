class CreateBranchModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  CreateBranchModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  CreateBranchModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? title;
  String? address;
  String? zoneId;
  String? stateId;
  String? cityId;
  String? status;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? branchId;

  Data(
      {this.title,
        this.address,
        this.zoneId,
        this.stateId,
        this.cityId,
        this.status,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.branchId});

  Data.fromJson(Map<String, dynamic> json) {
    title = json['title'];
    address = json['address'];
    zoneId = json['zoneId'];
    stateId = json['stateId'];
    cityId = json['cityId'];
    status = json['status'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    branchId = json['branchId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['title'] = this.title;
    data['address'] = this.address;
    data['zoneId'] = this.zoneId;
    data['stateId'] = this.stateId;
    data['cityId'] = this.cityId;
    data['status'] = this.status;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['branchId'] = this.branchId;
    return data;
  }
}
