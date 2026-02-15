class SalesEmpListModel {
  bool? success;
  String? message;
  Data? data;

  SalesEmpListModel({this.success, this.message, this.data});

  SalesEmpListModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    return data;
  }
}

class Data {
  List<Result>? result;

  Data({this.result});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['result'] != null) {
      result = <Result>[];
      json['result'].forEach((v) {
        result!.add(new Result.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.result != null) {
      data['result'] = this.result!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Result {
  String? sId;
  String? name;
  String? email;
  String? phoneNo;
  String? whatsappNo;
  String? altNo;
  String? password;
  String? empId;
  String? role;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Result(
      {this.sId,
        this.name,
        this.email,
        this.phoneNo,
        this.whatsappNo,
        this.altNo,
        this.password,
        this.empId,
        this.role,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Result.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    email = json['email'];
    phoneNo = json['phoneNo'];
    whatsappNo = json['whatsappNo'];
    altNo = json['altNo'];
    password = json['password'];
    empId = json['empId'];
    role = json['role'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['email'] = this.email;
    data['phoneNo'] = this.phoneNo;
    data['whatsappNo'] = this.whatsappNo;
    data['altNo'] = this.altNo;
    data['password'] = this.password;
    data['empId'] = this.empId;
    data['role'] = this.role;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
