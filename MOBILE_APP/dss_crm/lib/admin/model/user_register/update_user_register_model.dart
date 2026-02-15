class UpdateAdminRegisteredUserDetailsModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  UpdateAdminRegisteredUserDetailsModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  UpdateAdminRegisteredUserDetailsModelResponse.fromJson(
      Map<String, dynamic> json) {
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
  User? user;

  Data({this.user});

  Data.fromJson(Map<String, dynamic> json) {
    user = json['user'] != null ? new User.fromJson(json['user']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.user != null) {
      data['user'] = this.user!.toJson();
    }
    return data;
  }
}

class User {
  String? sId;
  String? name;
  String? email;
  String? phone;
  String? whatsapp;
  String? empId;
  String? branch;
  Department? department;
  Designation? designation;
  String? zone;
  String? state;
  String? city;
  String? status;

  User(
      {this.sId,
        this.name,
        this.email,
        this.phone,
        this.whatsapp,
        this.empId,
        this.branch,
        this.department,
        this.designation,
        this.zone,
        this.state,
        this.city,
        this.status});

  User.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    email = json['email'];
    phone = json['phone'];
    whatsapp = json['whatsapp'];
    empId = json['empId'];
    branch = json['branch'];
    department = json['department'] != null
        ? new Department.fromJson(json['department'])
        : null;
    designation = json['designation'] != null
        ? new Designation.fromJson(json['designation'])
        : null;
    zone = json['zone'];
    state = json['state'];
    city = json['city'];
    status = json['status'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['email'] = this.email;
    data['phone'] = this.phone;
    data['whatsapp'] = this.whatsapp;
    data['empId'] = this.empId;
    data['branch'] = this.branch;
    if (this.department != null) {
      data['department'] = this.department!.toJson();
    }
    if (this.designation != null) {
      data['designation'] = this.designation!.toJson();
    }
    data['zone'] = this.zone;
    data['state'] = this.state;
    data['city'] = this.city;
    data['status'] = this.status;
    return data;
  }
}

class Department {
  String? sId;
  String? title;
  String? branch;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? departmentId;

  Department(
      {this.sId,
        this.title,
        this.branch,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.departmentId});

  Department.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    branch = json['branch'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    departmentId = json['departmentId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['branch'] = this.branch;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['departmentId'] = this.departmentId;
    return data;
  }
}

class Designation {
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

  Designation(
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

  Designation.fromJson(Map<String, dynamic> json) {
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
