class GetAllCompaignListModelResponse {
  bool? success;
  String? message;
  int? page;
  int? totalPages;
  int? totalCampaigns;
  List<Campaigns>? campaigns;

  GetAllCompaignListModelResponse(
      {this.success,
        this.message,
        this.page,
        this.totalPages,
        this.totalCampaigns,
        this.campaigns});

  GetAllCompaignListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    page = json['page'];
    totalPages = json['totalPages'];
    totalCampaigns = json['totalCampaigns'];
    if (json['campaigns'] != null) {
      campaigns = <Campaigns>[];
      json['campaigns'].forEach((v) {
        campaigns!.add(new Campaigns.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    data['page'] = this.page;
    data['totalPages'] = this.totalPages;
    data['totalCampaigns'] = this.totalCampaigns;
    if (this.campaigns != null) {
      data['campaigns'] = this.campaigns!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Campaigns {
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
  CreatedBy? createdBy;
  String? status;
  List<StatusHistory>? statusHistory;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Campaigns(
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
        this.status,
        this.statusHistory,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Campaigns.fromJson(Map<String, dynamic> json) {
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
    createdBy = json['createdBy'] != null
        ? new CreatedBy.fromJson(json['createdBy'])
        : null;
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
    if (this.createdBy != null) {
      data['createdBy'] = this.createdBy!.toJson();
    }
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

class CreatedBy {
  String? sId;
  String? name;
  String? role;

  CreatedBy({this.sId, this.name, this.role});

  CreatedBy.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    role = json['role'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['role'] = this.role;
    return data;
  }
}

class StatusHistory {
  String? status;
  CreatedBy? updatedBy;
  String? updatedAt;
  String? sId;

  StatusHistory({this.status, this.updatedBy, this.updatedAt, this.sId});

  StatusHistory.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    updatedBy = json['updatedBy'] != null
        ? new CreatedBy.fromJson(json['updatedBy'])
        : null;
    updatedAt = json['updatedAt'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    if (this.updatedBy != null) {
      data['updatedBy'] = this.updatedBy!.toJson();
    }
    data['updatedAt'] = this.updatedAt;
    data['_id'] = this.sId;
    return data;
  }
}
