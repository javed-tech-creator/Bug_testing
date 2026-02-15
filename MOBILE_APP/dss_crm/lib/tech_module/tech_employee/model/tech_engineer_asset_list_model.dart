class TechEngineerAssetsListModelResponse {
  bool? success;
  int? total;
  int? page;
  int? limit;
  List<Data>? data;

  TechEngineerAssetsListModelResponse(
      {this.success, this.total, this.page, this.limit, this.data});

  TechEngineerAssetsListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    total = json['total'];
    page = json['page'];
    limit = json['limit'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['total'] = this.total;
    data['page'] = this.page;
    data['limit'] = this.limit;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? sId;
  String? tag;
  String? type;
  String? brand;
  String? model;
  String? location;
  String? status;
  String? warrantyEnd;
  String? expireIn;
  AssignedTo? assignedTo;

  Data(
      {this.sId,
        this.tag,
        this.type,
        this.brand,
        this.model,
        this.location,
        this.status,
        this.warrantyEnd,
        this.expireIn,
        this.assignedTo});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    tag = json['tag'];
    type = json['type'];
    brand = json['brand'];
    model = json['model'];
    location = json['location'];
    status = json['status'];
    warrantyEnd = json['warranty_end'];
    expireIn = json['expireIn'];
    assignedTo = json['assignedTo'] != null
        ? new AssignedTo.fromJson(json['assignedTo'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['tag'] = this.tag;
    data['type'] = this.type;
    data['brand'] = this.brand;
    data['model'] = this.model;
    data['location'] = this.location;
    data['status'] = this.status;
    data['warranty_end'] = this.warrantyEnd;
    data['expireIn'] = this.expireIn;
    if (this.assignedTo != null) {
      data['assignedTo'] = this.assignedTo!.toJson();
    }
    return data;
  }
}

class AssignedTo {
  String? date;
  String? department;
  String? name;
  String? role;
  String? employeeId;

  AssignedTo(
      {this.date, this.department, this.name, this.role, this.employeeId});

  AssignedTo.fromJson(Map<String, dynamic> json) {
    date = json['date'];
    department = json['department'];
    name = json['name'];
    role = json['role'];
    employeeId = json['employeeId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['date'] = this.date;
    data['department'] = this.department;
    data['name'] = this.name;
    data['role'] = this.role;
    data['employeeId'] = this.employeeId;
    return data;
  }
}
