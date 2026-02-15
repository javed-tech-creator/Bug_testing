class CreateAdminUserRegisterModelResponse {
  bool? success;
  String? message;
  Data? data;

  CreateAdminUserRegisterModelResponse({this.success, this.message, this.data});

  CreateAdminUserRegisterModelResponse.fromJson(Map<String, dynamic> json) {
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
  User? user;
  String? accessToken;
  String? refreshToken;

  Data({this.user, this.accessToken, this.refreshToken});

  Data.fromJson(Map<String, dynamic> json) {
    user = json['user'] != null ? new User.fromJson(json['user']) : null;
    accessToken = json['accessToken'];
    refreshToken = json['refreshToken'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.user != null) {
      data['user'] = this.user!.toJson();
    }
    data['accessToken'] = this.accessToken;
    data['refreshToken'] = this.refreshToken;
    return data;
  }
}

class User {
  String? sId;
  String? name;
  String? email;
  String? phone;
  String? whatsapp;
  String? altPhone;
  String? userId;
  String? type;
  Branch? branch;
  Department? department;
  Designation? designation;
  String? zone;
  String? state;
  String? city;
  String? status;
  String? manageBy;

  User(
      {this.sId,
        this.name,
        this.email,
        this.phone,
        this.whatsapp,
        this.altPhone,
        this.userId,
        this.type,
        this.branch,
        this.department,
        this.designation,
        this.zone,
        this.state,
        this.city,
        this.status,
        this.manageBy});

  User.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    email = json['email'];
    phone = json['phone'];
    whatsapp = json['whatsapp'];
    altPhone = json['altPhone'];
    userId = json['userId'];
    type = json['type'];
    branch =
    json['branch'] != null ? new Branch.fromJson(json['branch']) : null;
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
    manageBy = json['manageBy'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['email'] = this.email;
    data['phone'] = this.phone;
    data['whatsapp'] = this.whatsapp;
    data['altPhone'] = this.altPhone;
    data['userId'] = this.userId;
    data['type'] = this.type;
    if (this.branch != null) {
      data['branch'] = this.branch!.toJson();
    }
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
    data['manageBy'] = this.manageBy;
    return data;
  }
}

class Branch {
  String? sId;
  String? title;
  String? address;
  String? zoneId;
  String? stateId;
  String? cityId;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? branchId;

  Branch(
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

  Branch.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    address = json['address'];
    zoneId = json['zoneId'];
    stateId = json['stateId'];
    cityId = json['cityId'];
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
    data['zoneId'] = this.zoneId;
    data['stateId'] = this.stateId;
    data['cityId'] = this.cityId;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['branchId'] = this.branchId;
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














// class CreateAdminUserRegisterModelResponse {
//   int? statusCode;
//   bool? success;
//   String? message;
//   Data? data;
//   String? timestamp;
//
//   CreateAdminUserRegisterModelResponse(
//       {this.statusCode, this.success, this.message, this.data, this.timestamp});
//
//   CreateAdminUserRegisterModelResponse.fromJson(Map<String, dynamic> json) {
//     statusCode = json['statusCode'];
//     success = json['success'];
//     message = json['message'];
//     data = json['data'] != null ? new Data.fromJson(json['data']) : null;
//     timestamp = json['timestamp'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['statusCode'] = this.statusCode;
//     data['success'] = this.success;
//     data['message'] = this.message;
//     if (this.data != null) {
//       data['data'] = this.data!.toJson();
//     }
//     data['timestamp'] = this.timestamp;
//     return data;
//   }
// }
//
// class Data {
//   User? user;
//   String? accessToken;
//   String? refreshToken;
//
//   Data({this.user, this.accessToken, this.refreshToken});
//
//   Data.fromJson(Map<String, dynamic> json) {
//     user = json['user'] != null ? new User.fromJson(json['user']) : null;
//     accessToken = json['accessToken'];
//     refreshToken = json['refreshToken'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     if (this.user != null) {
//       data['user'] = this.user!.toJson();
//     }
//     data['accessToken'] = this.accessToken;
//     data['refreshToken'] = this.refreshToken;
//     return data;
//   }
// }
//
// class User {
//   String? sId;
//   String? name;
//   String? email;
//   String? phone;
//   String? whatsapp;
//   String? empId;
//   String? branch;
//   Department? department;
//   Designation? designation;
//   String? zone;
//   String? state;
//   String? city;
//   String? status;
//
//   User(
//       {this.sId,
//         this.name,
//         this.email,
//         this.phone,
//         this.whatsapp,
//         this.empId,
//         this.branch,
//         this.department,
//         this.designation,
//         this.zone,
//         this.state,
//         this.city,
//         this.status});
//
//   User.fromJson(Map<String, dynamic> json) {
//     sId = json['_id'];
//     name = json['name'];
//     email = json['email'];
//     phone = json['phone'];
//     whatsapp = json['whatsapp'];
//     empId = json['empId'];
//     branch = json['branch'];
//     department = json['department'] != null
//         ? new Department.fromJson(json['department'])
//         : null;
//     designation = json['designation'] != null
//         ? new Designation.fromJson(json['designation'])
//         : null;
//     zone = json['zone'];
//     state = json['state'];
//     city = json['city'];
//     status = json['status'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['_id'] = this.sId;
//     data['name'] = this.name;
//     data['email'] = this.email;
//     data['phone'] = this.phone;
//     data['whatsapp'] = this.whatsapp;
//     data['empId'] = this.empId;
//     data['branch'] = this.branch;
//     if (this.department != null) {
//       data['department'] = this.department!.toJson();
//     }
//     if (this.designation != null) {
//       data['designation'] = this.designation!.toJson();
//     }
//     data['zone'] = this.zone;
//     data['state'] = this.state;
//     data['city'] = this.city;
//     data['status'] = this.status;
//     return data;
//   }
// }
//
// class Department {
//   String? sId;
//   String? title;
//   String? branch;
//   String? status;
//   String? createdAt;
//   String? updatedAt;
//   int? sequenceValue;
//   int? iV;
//   String? departmentId;
//
//   Department(
//       {this.sId,
//         this.title,
//         this.branch,
//         this.status,
//         this.createdAt,
//         this.updatedAt,
//         this.sequenceValue,
//         this.iV,
//         this.departmentId});
//
//   Department.fromJson(Map<String, dynamic> json) {
//     sId = json['_id'];
//     title = json['title'];
//     branch = json['branch'];
//     status = json['status'];
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//     sequenceValue = json['sequence_value'];
//     iV = json['__v'];
//     departmentId = json['departmentId'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['_id'] = this.sId;
//     data['title'] = this.title;
//     data['branch'] = this.branch;
//     data['status'] = this.status;
//     data['createdAt'] = this.createdAt;
//     data['updatedAt'] = this.updatedAt;
//     data['sequence_value'] = this.sequenceValue;
//     data['__v'] = this.iV;
//     data['departmentId'] = this.departmentId;
//     return data;
//   }
// }
//
// class Designation {
//   String? sId;
//   String? title;
//   String? description;
//   String? depId;
//   String? branchId;
//   String? status;
//   String? createdAt;
//   String? updatedAt;
//   int? sequenceValue;
//   int? iV;
//   String? designationId;
//
//   Designation(
//       {this.sId,
//         this.title,
//         this.description,
//         this.depId,
//         this.branchId,
//         this.status,
//         this.createdAt,
//         this.updatedAt,
//         this.sequenceValue,
//         this.iV,
//         this.designationId});
//
//   Designation.fromJson(Map<String, dynamic> json) {
//     sId = json['_id'];
//     title = json['title'];
//     description = json['description'];
//     depId = json['depId'];
//     branchId = json['branchId'];
//     status = json['status'];
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//     sequenceValue = json['sequence_value'];
//     iV = json['__v'];
//     designationId = json['designationId'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['_id'] = this.sId;
//     data['title'] = this.title;
//     data['description'] = this.description;
//     data['depId'] = this.depId;
//     data['branchId'] = this.branchId;
//     data['status'] = this.status;
//     data['createdAt'] = this.createdAt;
//     data['updatedAt'] = this.updatedAt;
//     data['sequence_value'] = this.sequenceValue;
//     data['__v'] = this.iV;
//     data['designationId'] = this.designationId;
//     return data;
//   }
// }
