class UpdateActionGroupModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  UpdateActionGroupModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  UpdateActionGroupModelResponse.fromJson(Map<String, dynamic> json) {
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
  Permissions? permissions;
  String? sId;
  String? title;
  String? description;
  Department? department;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.permissions,
        this.sId,
        this.title,
        this.description,
        this.department,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    permissions = json['permissions'] != null
        ? new Permissions.fromJson(json['permissions'])
        : null;
    sId = json['_id'];
    title = json['title'];
    description = json['description'];
    department = json['department'] != null
        ? new Department.fromJson(json['department'])
        : null;
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.permissions != null) {
      data['permissions'] = this.permissions!.toJson();
    }
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['description'] = this.description;
    if (this.department != null) {
      data['department'] = this.department!.toJson();
    }
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Permissions {
  List<String>? data;
  List<String>? system;
  List<String>? crud;
  List<String>? workflow;

  Permissions({this.data, this.system, this.crud, this.workflow});

  Permissions.fromJson(Map<String, dynamic> json) {
    data = json['data'].cast<String>();
    system = json['system'].cast<String>();
    crud = json['crud'].cast<String>();
    workflow = json['workflow'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['data'] = this.data;
    data['system'] = this.system;
    data['crud'] = this.crud;
    data['workflow'] = this.workflow;
    return data;
  }
}

class Department {
  String? sId;
  String? title;

  Department({this.sId, this.title});

  Department.fromJson(Map<String, dynamic> json) {
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
