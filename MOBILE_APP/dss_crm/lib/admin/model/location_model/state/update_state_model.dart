class UpdateStateModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  UpdateStateModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  UpdateStateModelResponse.fromJson(Map<String, dynamic> json) {
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
  ZoneId? zoneId;
  String? title;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? stateId;

  Data(
      {this.sId,
        this.zoneId,
        this.title,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.stateId});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    zoneId =
    json['zoneId'] != null ? new ZoneId.fromJson(json['zoneId']) : null;
    title = json['title'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    stateId = json['stateId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    if (this.zoneId != null) {
      data['zoneId'] = this.zoneId!.toJson();
    }
    data['title'] = this.title;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['stateId'] = this.stateId;
    return data;
  }
}

class ZoneId {
  String? sId;
  String? title;
  String? zoneId;

  ZoneId({this.sId, this.title, this.zoneId});

  ZoneId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    zoneId = json['zoneId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['zoneId'] = this.zoneId;
    return data;
  }
}
