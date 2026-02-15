class HrEmployeeAttendanceCalenderViewModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  List<Data>? data;
  String? timestamp;

  HrEmployeeAttendanceCalenderViewModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  HrEmployeeAttendanceCalenderViewModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? employeeId;
  String? name;
  String? email;
  Attendance? attendance;

  Data({this.employeeId, this.name, this.email, this.attendance});

  Data.fromJson(Map<String, dynamic> json) {
    employeeId = json['employeeId'];
    name = json['name'];
    email = json['email'];
    attendance = json['attendance'] != null
        ? new Attendance.fromJson(json['attendance'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['employeeId'] = this.employeeId;
    data['name'] = this.name;
    data['email'] = this.email;
    if (this.attendance != null) {
      data['attendance'] = this.attendance!.toJson();
    }
    return data;
  }
}

class Attendance {
  String? s20251101;
  String? s20251102;
  String? s20251103;
  String? s20251104;
  String? s20251105;
  String? s20251106;
  String? s20251107;
  String? s20251108;
  String? s20251109;
  String? s20251110;
  String? s20251111;
  String? s20251112;
  String? s20251113;
  String? s20251114;
  String? s20251115;
  String? s20251116;
  String? s20251117;
  String? s20251118;
  String? s20251119;
  String? s20251120;
  String? s20251121;
  String? s20251122;
  String? s20251123;
  String? s20251124;
  String? s20251125;
  String? s20251126;
  String? s20251127;
  String? s20251128;
  String? s20251129;
  String? s20251130;

  Attendance(
      {this.s20251101,
        this.s20251102,
        this.s20251103,
        this.s20251104,
        this.s20251105,
        this.s20251106,
        this.s20251107,
        this.s20251108,
        this.s20251109,
        this.s20251110,
        this.s20251111,
        this.s20251112,
        this.s20251113,
        this.s20251114,
        this.s20251115,
        this.s20251116,
        this.s20251117,
        this.s20251118,
        this.s20251119,
        this.s20251120,
        this.s20251121,
        this.s20251122,
        this.s20251123,
        this.s20251124,
        this.s20251125,
        this.s20251126,
        this.s20251127,
        this.s20251128,
        this.s20251129,
        this.s20251130});

  Attendance.fromJson(Map<String, dynamic> json) {
    s20251101 = json['2025-11-01'];
    s20251102 = json['2025-11-02'];
    s20251103 = json['2025-11-03'];
    s20251104 = json['2025-11-04'];
    s20251105 = json['2025-11-05'];
    s20251106 = json['2025-11-06'];
    s20251107 = json['2025-11-07'];
    s20251108 = json['2025-11-08'];
    s20251109 = json['2025-11-09'];
    s20251110 = json['2025-11-10'];
    s20251111 = json['2025-11-11'];
    s20251112 = json['2025-11-12'];
    s20251113 = json['2025-11-13'];
    s20251114 = json['2025-11-14'];
    s20251115 = json['2025-11-15'];
    s20251116 = json['2025-11-16'];
    s20251117 = json['2025-11-17'];
    s20251118 = json['2025-11-18'];
    s20251119 = json['2025-11-19'];
    s20251120 = json['2025-11-20'];
    s20251121 = json['2025-11-21'];
    s20251122 = json['2025-11-22'];
    s20251123 = json['2025-11-23'];
    s20251124 = json['2025-11-24'];
    s20251125 = json['2025-11-25'];
    s20251126 = json['2025-11-26'];
    s20251127 = json['2025-11-27'];
    s20251128 = json['2025-11-28'];
    s20251129 = json['2025-11-29'];
    s20251130 = json['2025-11-30'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['2025-11-01'] = this.s20251101;
    data['2025-11-02'] = this.s20251102;
    data['2025-11-03'] = this.s20251103;
    data['2025-11-04'] = this.s20251104;
    data['2025-11-05'] = this.s20251105;
    data['2025-11-06'] = this.s20251106;
    data['2025-11-07'] = this.s20251107;
    data['2025-11-08'] = this.s20251108;
    data['2025-11-09'] = this.s20251109;
    data['2025-11-10'] = this.s20251110;
    data['2025-11-11'] = this.s20251111;
    data['2025-11-12'] = this.s20251112;
    data['2025-11-13'] = this.s20251113;
    data['2025-11-14'] = this.s20251114;
    data['2025-11-15'] = this.s20251115;
    data['2025-11-16'] = this.s20251116;
    data['2025-11-17'] = this.s20251117;
    data['2025-11-18'] = this.s20251118;
    data['2025-11-19'] = this.s20251119;
    data['2025-11-20'] = this.s20251120;
    data['2025-11-21'] = this.s20251121;
    data['2025-11-22'] = this.s20251122;
    data['2025-11-23'] = this.s20251123;
    data['2025-11-24'] = this.s20251124;
    data['2025-11-25'] = this.s20251125;
    data['2025-11-26'] = this.s20251126;
    data['2025-11-27'] = this.s20251127;
    data['2025-11-28'] = this.s20251128;
    data['2025-11-29'] = this.s20251129;
    data['2025-11-30'] = this.s20251130;
    return data;
  }
}
