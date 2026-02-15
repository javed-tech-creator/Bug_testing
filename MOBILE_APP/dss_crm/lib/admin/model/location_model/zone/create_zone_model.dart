class CreateZoneModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  CreateZoneModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  CreateZoneModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? status;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? zoneId;

  Data(
      {this.title,
        this.status,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.zoneId});

  Data.fromJson(Map<String, dynamic> json) {
    title = json['title'];
    status = json['status'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    zoneId = json['zoneId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['title'] = this.title;
    data['status'] = this.status;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['zoneId'] = this.zoneId;
    return data;
  }
}
