class TechMangerDashboardTopCardDataModelResponse {
  bool? success;
  Data? data;
  String? message;

  TechMangerDashboardTopCardDataModelResponse(
      {this.success, this.data, this.message});

  TechMangerDashboardTopCardDataModelResponse.fromJson(
      Map<String, dynamic> json) {
    success = json['success'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
    message = json['message'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    data['message'] = this.message;
    return data;
  }
}

class Data {
  int? totalAssets;
  int? licenses;
  int? openTickets;
  int? activeAmc;

  Data({this.totalAssets, this.licenses, this.openTickets, this.activeAmc});

  Data.fromJson(Map<String, dynamic> json) {
    totalAssets = json['totalAssets'];
    licenses = json['licenses'];
    openTickets = json['openTickets'];
    activeAmc = json['activeAmc'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['totalAssets'] = this.totalAssets;
    data['licenses'] = this.licenses;
    data['openTickets'] = this.openTickets;
    data['activeAmc'] = this.activeAmc;
    return data;
  }
}
