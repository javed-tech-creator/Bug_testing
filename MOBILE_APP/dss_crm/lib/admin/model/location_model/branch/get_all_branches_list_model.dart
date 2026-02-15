class GetAllBranchListModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  List<Data>? data;
  String? timestamp;

  GetAllBranchListModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  GetAllBranchListModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? address;
  ZoneId? zoneId;
  StateId? stateId;
  CityId? cityId;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? branchId;

  Data(
      {this.sId,
        this.title,
        this.address,
        this.zoneId,
        this.stateId,
        this.cityId,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.branchId});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    address = json['address'];
    zoneId =
    json['zoneId'] != null ? new ZoneId.fromJson(json['zoneId']) : null;
    stateId =
    json['stateId'] != null ? new StateId.fromJson(json['stateId']) : null;
    cityId =
    json['cityId'] != null ? new CityId.fromJson(json['cityId']) : null;
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    branchId = json['branchId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['address'] = this.address;
    if (this.zoneId != null) {
      data['zoneId'] = this.zoneId!.toJson();
    }
    if (this.stateId != null) {
      data['stateId'] = this.stateId!.toJson();
    }
    if (this.cityId != null) {
      data['cityId'] = this.cityId!.toJson();
    }
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['branchId'] = this.branchId;
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

class CityId {
  String? sId;
  String? title;
  String? cityId;

  CityId({this.sId, this.title, this.cityId});

  CityId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    cityId = json['cityId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['cityId'] = this.cityId;
    return data;
  }
}
