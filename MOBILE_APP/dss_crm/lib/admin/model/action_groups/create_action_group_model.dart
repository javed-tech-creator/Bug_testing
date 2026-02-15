class CreateActionGroupModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  CreateActionGroupModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  CreateActionGroupModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? description;
  String? department;
  Permissions? permissions;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.title,
        this.description,
        this.department,
        this.permissions,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    title = json['title'];
    description = json['description'];
    department = json['department'];
    permissions = json['permissions'] != null
        ? new Permissions.fromJson(json['permissions'])
        : null;
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['title'] = this.title;
    data['description'] = this.description;
    data['department'] = this.department;
    if (this.permissions != null) {
      data['permissions'] = this.permissions!.toJson();
    }
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Permissions {
  List<String>? crud;
  List<String>? workflow;
  List<String>? data;
  List<String>? system;

  Permissions({this.crud, this.workflow, this.data, this.system});

  Permissions.fromJson(Map<String, dynamic> json) {
    crud = json['crud'].cast<String>();
    workflow = json['workflow'].cast<String>();
    data = json['data'].cast<String>();
    system = json['system'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['crud'] = this.crud;
    data['workflow'] = this.workflow;
    data['data'] = this.data;
    data['system'] = this.system;

    return data;
  }
}
