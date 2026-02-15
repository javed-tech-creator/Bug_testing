class GetCityByStateIdModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  List<Data>? data;
  String? timestamp;

  GetCityByStateIdModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  GetCityByStateIdModelResponse.fromJson(Map<String, dynamic> json) {
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
  StateId? stateId;
  String? title;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? cityId;

  Data(
      {this.sId,
        this.stateId,
        this.title,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.cityId});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    stateId =
    json['stateId'] != null ? new StateId.fromJson(json['stateId']) : null;
    title = json['title'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    cityId = json['cityId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    if (this.stateId != null) {
      data['stateId'] = this.stateId!.toJson();
    }
    data['title'] = this.title;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['cityId'] = this.cityId;
    return data;
  }
}

class StateId {
  String? sId;
  String? title;
  String? stateId;

  StateId({this.sId, this.title, this.stateId});

  StateId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    stateId = json['stateId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['stateId'] = this.stateId;
    return data;
  }
}
