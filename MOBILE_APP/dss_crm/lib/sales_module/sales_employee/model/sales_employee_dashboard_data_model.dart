class SalesEmployeeDashboardDataModelResposne {
  bool? success;
  String? message;
  Data? data;

  SalesEmployeeDashboardDataModelResposne(
      {this.success, this.message, this.data});

  SalesEmployeeDashboardDataModelResposne.fromJson(Map<String, dynamic> json) {
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
  Result? result;

  Data({this.result});

  Data.fromJson(Map<String, dynamic> json) {
    result =
    json['result'] != null ? new Result.fromJson(json['result']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.result != null) {
      data['result'] = this.result!.toJson();
    }
    return data;
  }
}

class Result {
  int? totalLead;
  int? thisMonthLead;
  int? thisMonthPendingLead;
  int? recceProjectWine;

  Result(
      {this.totalLead,
        this.thisMonthLead,
        this.thisMonthPendingLead,
        this.recceProjectWine});

  Result.fromJson(Map<String, dynamic> json) {
    totalLead = json['totalLead'];
    thisMonthLead = json['thisMonthLead'];
    thisMonthPendingLead = json['ThisMonthPendingLead'];
    recceProjectWine = json['recceProjectWine'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['totalLead'] = this.totalLead;
    data['thisMonthLead'] = this.thisMonthLead;
    data['ThisMonthPendingLead'] = this.thisMonthPendingLead;
    data['recceProjectWine'] = this.recceProjectWine;
    return data;
  }
}
