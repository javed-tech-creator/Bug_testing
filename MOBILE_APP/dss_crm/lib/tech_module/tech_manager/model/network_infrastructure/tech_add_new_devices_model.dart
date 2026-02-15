class TechAddNewDeviceModelResponse {
  bool? success;
  String? message;
  Data? data;

  TechAddNewDeviceModelResponse({this.success, this.message, this.data});

  TechAddNewDeviceModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? deviceId;
  String? deviceType;
  String? ipAddress;
  String? macAddress;
  String? configurationDetails;
  String? installedLocation;
  String? vendor;
  String? maintenanceHistory;
  String? nextServiceDue;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.deviceId,
        this.deviceType,
        this.ipAddress,
        this.macAddress,
        this.configurationDetails,
        this.installedLocation,
        this.vendor,
        this.maintenanceHistory,
        this.nextServiceDue,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    deviceId = json['deviceId'];
    deviceType = json['deviceType'];
    ipAddress = json['ipAddress'];
    macAddress = json['macAddress'];
    configurationDetails = json['configurationDetails'];
    installedLocation = json['installedLocation'];
    vendor = json['vendor'];
    maintenanceHistory = json['maintenanceHistory'];
    nextServiceDue = json['nextServiceDue'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['deviceId'] = this.deviceId;
    data['deviceType'] = this.deviceType;
    data['ipAddress'] = this.ipAddress;
    data['macAddress'] = this.macAddress;
    data['configurationDetails'] = this.configurationDetails;
    data['installedLocation'] = this.installedLocation;
    data['vendor'] = this.vendor;
    data['maintenanceHistory'] = this.maintenanceHistory;
    data['nextServiceDue'] = this.nextServiceDue;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
