class HrPayrollManagementListModelResponse {
  bool? success;
  String? message;
  int? count;
  String? period;
  List<Data>? data;

  //

  HrPayrollManagementListModelResponse(
      {this.success, this.message, this.count, this.period, this.data});

  HrPayrollManagementListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    count = json['count'];
    period = json['period'];
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
    data['count'] = this.count;
    data['period'] = this.period;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? employeeId;
  String? employeeName;
  String? employeeCode;
  String? email;
  int? actualSalary;
  int? presentDays;
  int? halfDays;
  int? absentDays;
  int? totalWorkingDays;
  int? estimateSalary;
  String? period;
  String? status;
  int? paidAmount;
  int? attendanceRecords;
  QueryInfo? queryInfo;

  Data(
      {this.employeeId,
        this.employeeName,
        this.employeeCode,
        this.email,
        this.actualSalary,
        this.presentDays,
        this.halfDays,
        this.absentDays,
        this.totalWorkingDays,
        this.estimateSalary,
        this.period,
        this.status,
        this.paidAmount,
        this.attendanceRecords,
        this.queryInfo});

  Data.fromJson(Map<String, dynamic> json) {
    employeeId = json['employeeId'];
    employeeName = json['employeeName'];
    employeeCode = json['employeeCode'];
    email = json['email'];
    actualSalary = json['actualSalary'];
    presentDays = json['presentDays'];
    halfDays = json['halfDays'];
    absentDays = json['absentDays'];
    totalWorkingDays = json['totalWorkingDays'];
    estimateSalary = json['estimate_salary'];
    period = json['period'];
    status = json['status'];
    paidAmount = json['paidAmount'];
    attendanceRecords = json['attendanceRecords'];
    queryInfo = json['queryInfo'] != null
        ? new QueryInfo.fromJson(json['queryInfo'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['employeeId'] = this.employeeId;
    data['employeeName'] = this.employeeName;
    data['employeeCode'] = this.employeeCode;
    data['email'] = this.email;
    data['actualSalary'] = this.actualSalary;
    data['presentDays'] = this.presentDays;
    data['halfDays'] = this.halfDays;
    data['absentDays'] = this.absentDays;
    data['totalWorkingDays'] = this.totalWorkingDays;
    data['estimate_salary'] = this.estimateSalary;
    data['period'] = this.period;
    data['status'] = this.status;
    data['paidAmount'] = this.paidAmount;
    data['attendanceRecords'] = this.attendanceRecords;
    if (this.queryInfo != null) {
      data['queryInfo'] = this.queryInfo!.toJson();
    }
    return data;
  }
}

class QueryInfo {
  String? requested;
  DatabaseQuery? databaseQuery;

  QueryInfo({this.requested, this.databaseQuery});

  QueryInfo.fromJson(Map<String, dynamic> json) {
    requested = json['requested'];
    databaseQuery = json['databaseQuery'] != null
        ? new DatabaseQuery.fromJson(json['databaseQuery'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['requested'] = this.requested;
    if (this.databaseQuery != null) {
      data['databaseQuery'] = this.databaseQuery!.toJson();
    }
    return data;
  }
}

class DatabaseQuery {
  int? year;
  int? month;
  String? monthName;

  DatabaseQuery({this.year, this.month, this.monthName});

  DatabaseQuery.fromJson(Map<String, dynamic> json) {
    year = json['year'];
    month = json['month'];
    monthName = json['monthName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['year'] = this.year;
    data['month'] = this.month;
    data['monthName'] = this.monthName;
    return data;
  }
}
