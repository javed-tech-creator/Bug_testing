class LoginResponseModel {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  LoginResponseModel(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  LoginResponseModel.fromJson(Map<String, dynamic> json) {
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
  Branch? branch;
  Branch? department;
  Branch? designation;
  Branch? zone;
  Branch? state;
  Branch? city;
  Null? photo;
  Null? type;
  Permissions? permissions;
  String? status;

  User(
      {this.sId,
        this.name,
        this.email,
        this.phone,
        this.branch,
        this.department,
        this.designation,
        this.zone,
        this.state,
        this.city,
        this.photo,
        this.type,
        this.permissions,
        this.status});

  User.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    email = json['email'];
    phone = json['phone'];
    branch =
    json['branch'] != null ? new Branch.fromJson(json['branch']) : null;
    department = json['department'] != null
        ? new Branch.fromJson(json['department'])
        : null;
    designation = json['designation'] != null
        ? new Branch.fromJson(json['designation'])
        : null;
    zone = json['zone'] != null ? new Branch.fromJson(json['zone']) : null;
    state = json['state'] != null ? new Branch.fromJson(json['state']) : null;
    city = json['city'] != null ? new Branch.fromJson(json['city']) : null;
    photo = json['photo'];
    type = json['type'];
    permissions = json['permissions'] != null
        ? new Permissions.fromJson(json['permissions'])
        : null;
    status = json['status'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['email'] = this.email;
    data['phone'] = this.phone;
    if (this.branch != null) {
      data['branch'] = this.branch!.toJson();
    }
    if (this.department != null) {
      data['department'] = this.department!.toJson();
    }
    if (this.designation != null) {
      data['designation'] = this.designation!.toJson();
    }
    if (this.zone != null) {
      data['zone'] = this.zone!.toJson();
    }
    if (this.state != null) {
      data['state'] = this.state!.toJson();
    }
    if (this.city != null) {
      data['city'] = this.city!.toJson();
    }
    data['photo'] = this.photo;
    data['type'] = this.type;
    if (this.permissions != null) {
      data['permissions'] = this.permissions!.toJson();
    }
    data['status'] = this.status;
    return data;
  }
}

class Branch {
  String? sId;
  String? title;

  Branch({this.sId, this.title});

  Branch.fromJson(Map<String, dynamic> json) {
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










// class LoginResponseModel {
//   int? statusCode;
//   bool? success;
//   String? message;
//   Data? data;
//   String? timestamp;
//
//   LoginResponseModel(
//       {this.statusCode, this.success, this.message, this.data, this.timestamp});
//
//   LoginResponseModel.fromJson(Map<String, dynamic> json) {
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
//   String? branch;
//   String? department;
//   String? designation;
//   String? zone;
//   String? state;
//   String? city;
//   Null? photo;
//   Permissions? permissions;
//   String? status;
//
//   User(
//       {this.sId,
//         this.name,
//         this.email,
//         this.phone,
//         this.branch,
//         this.department,
//         this.designation,
//         this.zone,
//         this.state,
//         this.city,
//         this.photo,
//         this.permissions,
//         this.status});
//
//   User.fromJson(Map<String, dynamic> json) {
//     sId = json['_id'];
//     name = json['name'];
//     email = json['email'];
//     phone = json['phone'];
//     branch = json['branch'];
//     department = json['department'];
//     designation = json['designation'];
//     zone = json['zone'];
//     state = json['state'];
//     city = json['city'];
//     photo = json['photo'];
//     permissions = json['permissions'] != null
//         ? new Permissions.fromJson(json['permissions'])
//         : null;
//     status = json['status'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['_id'] = this.sId;
//     data['name'] = this.name;
//     data['email'] = this.email;
//     data['phone'] = this.phone;
//     data['branch'] = this.branch;
//     data['department'] = this.department;
//     data['designation'] = this.designation;
//     data['zone'] = this.zone;
//     data['state'] = this.state;
//     data['city'] = this.city;
//     data['photo'] = this.photo;
//     if (this.permissions != null) {
//       data['permissions'] = this.permissions!.toJson();
//     }
//     data['status'] = this.status;
//     return data;
//   }
// }
//
// class Permissions {
//   List<String>? crud;
//   List<String>? workflow;
//   List<String>? data;
//   List<String>? system;
//
//   Permissions({this.crud, this.workflow, this.data, this.system});
//
//   Permissions.fromJson(Map<String, dynamic> json) {
//     crud = json['crud'].cast<String>();
//     workflow = json['workflow'].cast<String>();
//     data = json['data'].cast<String>();
//     system = json['system'].cast<String>();
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['crud'] = this.crud;
//     data['workflow'] = this.workflow;
//     data['data'] = this.data;
//     data['system'] = this.system;
//     return data;
//   }
// }
//
//
//
//
//
//
//
// // class LoginResponseModel {
// //   bool? success;
// //   String? message;
// //   Data? data;
// //
// //   LoginResponseModel({this.success, this.message, this.data});
// //
// //   LoginResponseModel.fromJson(Map<String, dynamic> json) {
// //     success = json['success'];
// //     message = json['message'];
// //     data = json['data'] != null ? new Data.fromJson(json['data']) : null;
// //   }
// //
// //   Map<String, dynamic> toJson() {
// //     final Map<String, dynamic> data = new Map<String, dynamic>();
// //     data['success'] = this.success;
// //     data['message'] = this.message;
// //     if (this.data != null) {
// //       data['data'] = this.data!.toJson();
// //     }
// //     return data;
// //   }
// // }
// //
// // class Data {
// //   String? id;
// //   String? email;
// //   String? role;
// //   String? token;
// //   AllData? allData;
// //
// //   Data({this.id, this.email, this.role, this.token, this.allData});
// //
// //   Data.fromJson(Map<String, dynamic> json) {
// //     id = json['id'];
// //     email = json['email'];
// //     role = json['role'];
// //     token = json['token'];
// //     allData =
// //     json['allData'] != null ? new AllData.fromJson(json['allData']) : null;
// //   }
// //
// //   Map<String, dynamic> toJson() {
// //     final Map<String, dynamic> data = new Map<String, dynamic>();
// //     data['id'] = this.id;
// //     data['email'] = this.email;
// //     data['role'] = this.role;
// //     data['token'] = this.token;
// //     if (this.allData != null) {
// //       data['allData'] = this.allData!.toJson();
// //     }
// //     return data;
// //   }
// // }
// //
// // class AllData {
// //   String? sId;
// //   String? name;
// //   String? email;
// //   String? phoneNo;
// //   String? whatsappNo;
// //   String? altNo;
// //   String? password;
// //   String? empId;
// //   String? role;
// //   String? createdAt;
// //   String? updatedAt;
// //   int? iV;
// //
// //   AllData(
// //       {this.sId,
// //         this.name,
// //         this.email,
// //         this.phoneNo,
// //         this.whatsappNo,
// //         this.altNo,
// //         this.password,
// //         this.empId,
// //         this.role,
// //         this.createdAt,
// //         this.updatedAt,
// //         this.iV});
// //
// //   AllData.fromJson(Map<String, dynamic> json) {
// //     sId = json['_id'];
// //     name = json['name'];
// //     email = json['email'];
// //     phoneNo = json['phoneNo'];
// //     whatsappNo = json['whatsappNo'];
// //     altNo = json['altNo'];
// //     password = json['password'];
// //     empId = json['empId'];
// //     role = json['role'];
// //     createdAt = json['createdAt'];
// //     updatedAt = json['updatedAt'];
// //     iV = json['__v'];
// //   }
// //
// //   Map<String, dynamic> toJson() {
// //     final Map<String, dynamic> data = new Map<String, dynamic>();
// //     data['_id'] = this.sId;
// //     data['name'] = this.name;
// //     data['email'] = this.email;
// //     data['phoneNo'] = this.phoneNo;
// //     data['whatsappNo'] = this.whatsappNo;
// //     data['altNo'] = this.altNo;
// //     data['password'] = this.password;
// //     data['empId'] = this.empId;
// //     data['role'] = this.role;
// //     data['createdAt'] = this.createdAt;
// //     data['updatedAt'] = this.updatedAt;
// //     data['__v'] = this.iV;
// //     return data;
// //   }
// // }
