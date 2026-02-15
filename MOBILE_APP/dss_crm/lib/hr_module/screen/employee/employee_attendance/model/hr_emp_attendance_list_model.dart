class HrAllEmployeeAttendanceListModelResponse {
  bool? success;
  String? message;
  List<Data>? data;

  HrAllEmployeeAttendanceListModelResponse(
      {this.success, this.message, this.data});

  HrAllEmployeeAttendanceListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
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
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? sId;
  String? name;
  String? email;
  String? phone;
  Photo? photo;
  String? status;
  bool? checkIn;
  bool? leave;
  String? workingHours;
  String? loginTime;
  String? logoutTime;
  String? date;
  Location? location;

  Data(
      {this.sId,
        this.name,
        this.email,
        this.phone,
        this.photo,
        this.status,
        this.checkIn,
        this.leave,
        this.workingHours,
        this.loginTime,
        this.logoutTime,
        this.date,
        this.location});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    email = json['email'];
    phone = json['phone'];
    photo = json['photo'] != null ? new Photo.fromJson(json['photo']) : null;
    status = json['status'];
    checkIn = json['checkIn'];
    leave = json['leave'];
    workingHours = json['workingHours'];
    loginTime = json['loginTime'];
    logoutTime = json['logoutTime'];
    date = json['date'];
    location = json['location'] != null
        ? new Location.fromJson(json['location'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['email'] = this.email;
    data['phone'] = this.phone;
    if (this.photo != null) {
      data['photo'] = this.photo!.toJson();
    }
    data['status'] = this.status;
    data['checkIn'] = this.checkIn;
    data['leave'] = this.leave;
    data['workingHours'] = this.workingHours;
    data['loginTime'] = this.loginTime;
    data['logoutTime'] = this.logoutTime;
    data['date'] = this.date;
    if (this.location != null) {
      data['location'] = this.location!.toJson();
    }
    return data;
  }
}

class Photo {
  String? url;
  String? publicUrl;
  String? publicId;

  Photo({this.url, this.publicUrl, this.publicId});

  Photo.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    publicUrl = json['public_url'];
    publicId = json['public_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['public_url'] = this.publicUrl;
    data['public_id'] = this.publicId;
    return data;
  }
}

class Location {
  String? type;
  List<double>? coordinates;
  String? name;

  Location({this.type, this.coordinates, this.name});

  Location.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    coordinates = json['coordinates'].cast<double>();
    name = json['name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    data['coordinates'] = this.coordinates;
    data['name'] = this.name;
    return data;
  }
}

















// class HrAllEmployeeAttendanceListModelResponse {
//   int? statusCode;
//   bool? success;
//   String? message;
//   List<Data>? data;
//   String? timestamp;
//
//   HrAllEmployeeAttendanceListModelResponse(
//       {this.statusCode, this.success, this.message, this.data, this.timestamp});
//
//   HrAllEmployeeAttendanceListModelResponse.fromJson(Map<String, dynamic> json) {
//     statusCode = json['statusCode'];
//     success = json['success'];
//     message = json['message'];
//     if (json['data'] != null) {
//       data = <Data>[];
//       json['data'].forEach((v) {
//         data!.add(new Data.fromJson(v));
//       });
//     }
//     timestamp = json['timestamp'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['statusCode'] = this.statusCode;
//     data['success'] = this.success;
//     data['message'] = this.message;
//     if (this.data != null) {
//       data['data'] = this.data!.map((v) => v.toJson()).toList();
//     }
//     data['timestamp'] = this.timestamp;
//     return data;
//   }
// }
//
// class Data {
//   Location? location;
//   String? sId;
//   EmployeeId? employeeId;
//   int? iV;
//   bool? checkIn;
//   String? createdAt;
//   String? date;
//   bool? isFullDay;
//   bool? isHalfDay;
//   bool? leave;
//   String? loginTime;
//   String? logoutTime;
//   String? otTime;
//   String? status;
//   String? totalWorkingHour;
//   String? updatedAt;
//   String? workingHours;
//
//   Data(
//       {this.location,
//         this.sId,
//         this.employeeId,
//         this.iV,
//         this.checkIn,
//         this.createdAt,
//         this.date,
//         this.isFullDay,
//         this.isHalfDay,
//         this.leave,
//         this.loginTime,
//         this.logoutTime,
//         this.otTime,
//         this.status,
//         this.totalWorkingHour,
//         this.updatedAt,
//         this.workingHours});
//
//   Data.fromJson(Map<String, dynamic> json) {
//     location = json['location'] != null
//         ? new Location.fromJson(json['location'])
//         : null;
//     sId = json['_id'];
//     employeeId = json['employeeId'] != null
//         ? new EmployeeId.fromJson(json['employeeId'])
//         : null;
//     iV = json['__v'];
//     checkIn = json['checkIn'];
//     createdAt = json['createdAt'];
//     date = json['date'];
//     isFullDay = json['isFullDay'];
//     isHalfDay = json['isHalfDay'];
//     leave = json['leave'];
//     loginTime = json['loginTime'];
//     logoutTime = json['logoutTime'];
//     otTime = json['otTime'];
//     status = json['status'];
//     totalWorkingHour = json['totalWorkingHour'];
//     updatedAt = json['updatedAt'];
//     workingHours = json['workingHours'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     if (this.location != null) {
//       data['location'] = this.location!.toJson();
//     }
//     data['_id'] = this.sId;
//     if (this.employeeId != null) {
//       data['employeeId'] = this.employeeId!.toJson();
//     }
//     data['__v'] = this.iV;
//     data['checkIn'] = this.checkIn;
//     data['createdAt'] = this.createdAt;
//     data['date'] = this.date;
//     data['isFullDay'] = this.isFullDay;
//     data['isHalfDay'] = this.isHalfDay;
//     data['leave'] = this.leave;
//     data['loginTime'] = this.loginTime;
//     data['logoutTime'] = this.logoutTime;
//     data['otTime'] = this.otTime;
//     data['status'] = this.status;
//     data['totalWorkingHour'] = this.totalWorkingHour;
//     data['updatedAt'] = this.updatedAt;
//     data['workingHours'] = this.workingHours;
//     return data;
//   }
// }
//
// class Location {
//   Null? name;
//   List<double>? coordinates;
//   String? type;
//
//   Location({this.name, this.coordinates, this.type});
//
//   Location.fromJson(Map<String, dynamic> json) {
//     name = json['name'];
//     coordinates = json['coordinates'].cast<double>();
//     type = json['type'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['name'] = this.name;
//     data['coordinates'] = this.coordinates;
//     data['type'] = this.type;
//     return data;
//   }
// }
//
// class EmployeeId {
//   String? sId;
//   String? name;
//   String? email;
//   String? phone;
//
//   EmployeeId({this.sId, this.name, this.email, this.phone});
//
//   EmployeeId.fromJson(Map<String, dynamic> json) {
//     sId = json['_id'];
//     name = json['name'];
//     email = json['email'];
//     phone = json['phone'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['_id'] = this.sId;
//     data['name'] = this.name;
//     data['email'] = this.email;
//     data['phone'] = this.phone;
//     return data;
//   }
// }
