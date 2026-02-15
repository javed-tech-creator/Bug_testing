class UpdateCompaignStatusModelResponse {
  bool? success;
  String? message;
  Data? data;

  UpdateCompaignStatusModelResponse({this.success, this.message, this.data});

  UpdateCompaignStatusModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? campaignId;
  String? campaignName;
  String? type;
  String? platform;
  String? objective;
  TargetAudience? targetAudience;
  int? budget;
  String? landingPage;
  String? startDate;
  String? endDate;
  String? createdBy;
  bool? isDeleted;
  Null? deletedBy;
  String? status;
  List<StatusHistory>? statusHistory;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.sId,
        this.campaignId,
        this.campaignName,
        this.type,
        this.platform,
        this.objective,
        this.targetAudience,
        this.budget,
        this.landingPage,
        this.startDate,
        this.endDate,
        this.createdBy,
        this.isDeleted,
        this.deletedBy,
        this.status,
        this.statusHistory,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    campaignId = json['campaign_id'];
    campaignName = json['campaignName'];
    type = json['type'];
    platform = json['platform'];
    objective = json['objective'];
    targetAudience = json['targetAudience'] != null
        ? new TargetAudience.fromJson(json['targetAudience'])
        : null;
    budget = json['budget'];
    landingPage = json['landingPage'];
    startDate = json['startDate'];
    endDate = json['endDate'];
    createdBy = json['createdBy'];
    isDeleted = json['isDeleted'];
    deletedBy = json['deletedBy'];
    status = json['status'];
    if (json['statusHistory'] != null) {
      statusHistory = <StatusHistory>[];
      json['statusHistory'].forEach((v) {
        statusHistory!.add(new StatusHistory.fromJson(v));
      });
    }
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['campaign_id'] = this.campaignId;
    data['campaignName'] = this.campaignName;
    data['type'] = this.type;
    data['platform'] = this.platform;
    data['objective'] = this.objective;
    if (this.targetAudience != null) {
      data['targetAudience'] = this.targetAudience!.toJson();
    }
    data['budget'] = this.budget;
    data['landingPage'] = this.landingPage;
    data['startDate'] = this.startDate;
    data['endDate'] = this.endDate;
    data['createdBy'] = this.createdBy;
    data['isDeleted'] = this.isDeleted;
    data['deletedBy'] = this.deletedBy;
    data['status'] = this.status;
    if (this.statusHistory != null) {
      data['statusHistory'] =
          this.statusHistory!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class TargetAudience {
  String? region;
  String? demographics;
  List<String>? interests;
  String? sId;

  TargetAudience({this.region, this.demographics, this.interests, this.sId});

  TargetAudience.fromJson(Map<String, dynamic> json) {
    region = json['region'];
    demographics = json['demographics'];
    interests = json['interests'].cast<String>();
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['region'] = this.region;
    data['demographics'] = this.demographics;
    data['interests'] = this.interests;
    data['_id'] = this.sId;
    return data;
  }
}

class StatusHistory {
  String? status;
  String? updatedBy;
  String? updatedAt;

  StatusHistory({this.status, this.updatedBy, this.updatedAt});

  StatusHistory.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    updatedBy = json['updatedBy'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    data['updatedBy'] = this.updatedBy;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}
