class TechMangerDashboardBarChartDataModelResponse {
  bool? success;
  List<Data>? data;
  String? message;

  TechMangerDashboardBarChartDataModelResponse(
      {this.success, this.data, this.message});

  TechMangerDashboardBarChartDataModelResponse.fromJson(
      Map<String, dynamic> json) {
    success = json['success'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
    message = json['message'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    data['message'] = this.message;
    return data;
  }
}

class Data {
  String? department;
  int? open;
  int? resolved;

  Data({this.department, this.open, this.resolved});

  Data.fromJson(Map<String, dynamic> json) {
    department = json['department'];
    open = json['open'];
    resolved = json['resolved'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['department'] = this.department;
    data['open'] = this.open;
    data['resolved'] = this.resolved;
    return data;
  }
}
