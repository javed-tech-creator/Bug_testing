class SalaryApprovedPayrollModelResponse {
  bool? success;
  String? message;
  Data? data;

  SalaryApprovedPayrollModelResponse({this.success, this.message, this.data});

  SalaryApprovedPayrollModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? sId;
  String? employeeId;
  int? month;
  int? year;
  int? iV;
  String? createdAt;
  bool? isPaid;
  int? paidAmount;
  String? updatedAt;

  Data(
      {this.sId,
        this.employeeId,
        this.month,
        this.year,
        this.iV,
        this.createdAt,
        this.isPaid,
        this.paidAmount,
        this.updatedAt});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    employeeId = json['employeeId'];
    month = json['month'];
    year = json['year'];
    iV = json['__v'];
    createdAt = json['createdAt'];
    isPaid = json['isPaid'];
    paidAmount = json['paidAmount'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['employeeId'] = this.employeeId;
    data['month'] = this.month;
    data['year'] = this.year;
    data['__v'] = this.iV;
    data['createdAt'] = this.createdAt;
    data['isPaid'] = this.isPaid;
    data['paidAmount'] = this.paidAmount;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}
