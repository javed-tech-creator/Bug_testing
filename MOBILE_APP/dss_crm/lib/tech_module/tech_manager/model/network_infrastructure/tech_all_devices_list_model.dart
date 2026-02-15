class TechAllDevicesListModelResponse {
  bool? success;
  List<Data>? data;
  int? total;
  int? page;
  int? limit;
  int? totalPages;

  TechAllDevicesListModelResponse(
      {this.success,
        this.data,
        this.total,
        this.page,
        this.limit,
        this.totalPages});

  TechAllDevicesListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
    total = json['total'];
    page = json['page'];
    limit = json['limit'];
    totalPages = json['totalPages'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    data['total'] = this.total;
    data['page'] = this.page;
    data['limit'] = this.limit;
    data['totalPages'] = this.totalPages;
    return data;
  }
}

class Data {
  String? sId;
  String? deviceId;
  String? deviceType;
  String? ipAddress;
  String? macAddress;
  String? configurationDetails;
  String? installedLocation;
  String? vendor;
  String? maintenanceHistory;
  String? nextServiceDue;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.sId,
        this.deviceId,
        this.deviceType,
        this.ipAddress,
        this.macAddress,
        this.configurationDetails,
        this.installedLocation,
        this.vendor,
        this.maintenanceHistory,
        this.nextServiceDue,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    deviceId = json['deviceId'];
    deviceType = json['deviceType'];
    ipAddress = json['ipAddress'];
    macAddress = json['macAddress'];
    configurationDetails = json['configurationDetails'];
    installedLocation = json['installedLocation'];
    vendor = json['vendor'];
    maintenanceHistory = json['maintenanceHistory'];
    nextServiceDue = json['nextServiceDue'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['deviceId'] = this.deviceId;
    data['deviceType'] = this.deviceType;
    data['ipAddress'] = this.ipAddress;
    data['macAddress'] = this.macAddress;
    data['configurationDetails'] = this.configurationDetails;
    data['installedLocation'] = this.installedLocation;
    data['vendor'] = this.vendor;
    data['maintenanceHistory'] = this.maintenanceHistory;
    data['nextServiceDue'] = this.nextServiceDue;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
