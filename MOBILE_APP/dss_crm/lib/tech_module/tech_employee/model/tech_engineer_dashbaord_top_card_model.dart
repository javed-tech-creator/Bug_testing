class TechEngineerDashboardTopCardModelResponse {
  bool? success;
  String? message;
  Data? data;

  TechEngineerDashboardTopCardModelResponse(
      {this.success, this.message, this.data});

  TechEngineerDashboardTopCardModelResponse.fromJson(
      Map<String, dynamic> json) {
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
  int? totalAssets;
  int? licenses;
  int? onHoldTickets;
  int? progressTickets;
  int? resolvedTickets;
  int? openTickets;
  int? activeAmc;

  Data(
      {this.totalAssets,
        this.licenses,
        this.onHoldTickets,
        this.progressTickets,
        this.resolvedTickets,
        this.openTickets,
        this.activeAmc});

  Data.fromJson(Map<String, dynamic> json) {
    totalAssets = json['totalAssets'];
    licenses = json['licenses'];
    onHoldTickets = json['onHoldTickets'];
    progressTickets = json['progressTickets'];
    resolvedTickets = json['resolvedTickets'];
    openTickets = json['openTickets'];
    activeAmc = json['activeAmc'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['totalAssets'] = this.totalAssets;
    data['licenses'] = this.licenses;
    data['onHoldTickets'] = this.onHoldTickets;
    data['progressTickets'] = this.progressTickets;
    data['resolvedTickets'] = this.resolvedTickets;
    data['openTickets'] = this.openTickets;
    data['activeAmc'] = this.activeAmc;
    return data;
  }
}
