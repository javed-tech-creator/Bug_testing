class SalesEmpClientBriefingFormListModelResponse {
  bool? success;
  String? message;
  Data? data;

  SalesEmpClientBriefingFormListModelResponse(
      {this.success, this.message, this.data});

  SalesEmpClientBriefingFormListModelResponse.fromJson(
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
  List<Result>? result;

  Data({this.result});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['result'] != null) {
      result = <Result>[];
      json['result'].forEach((v) {
        result!.add(new Result.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.result != null) {
      data['result'] = this.result!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Result {
  String? timestamp;
  String? sId;
  String? leadId;
  String? salesAssistant;
  String? impanelledBy;
  String? projectCode;
  String? salesType;
  String? projectName;
  String? projectDetail;
  String? clientName;
  String? clientProfile;
  String? concernPersonDesignation;
  String? companyName;
  String? phone;
  String? altPhone;
  String? fullAddress;
  String? locationLink;

  Result(
      {this.timestamp,
        this.sId,
        this.leadId,
        this.salesAssistant,
        this.impanelledBy,
        this.projectCode,
        this.salesType,
        this.projectName,
        this.projectDetail,
        this.clientName,
        this.clientProfile,
        this.concernPersonDesignation,
        this.companyName,
        this.phone,
        this.altPhone,
        this.fullAddress,
        this.locationLink});

  Result.fromJson(Map<String, dynamic> json) {
    timestamp = json['timestamp'];
    sId = json['_id'];
    leadId = json['leadId'];
    salesAssistant = json['salesAssistant'];
    impanelledBy = json['impanelledBy'];
    projectCode = json['projectCode'];
    salesType = json['salesType'];
    projectName = json['projectName'];
    projectDetail = json['projectDetail'];
    clientName = json['clientName'];
    clientProfile = json['clientProfile'];
    concernPersonDesignation = json['concernPersonDesignation'];
    companyName = json['companyName'];
    phone = json['phone'];
    altPhone = json['altPhone'];
    fullAddress = json['fullAddress'];
    locationLink = json['locationLink'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['timestamp'] = this.timestamp;
    data['_id'] = this.sId;
    data['leadId'] = this.leadId;
    data['salesAssistant'] = this.salesAssistant;
    data['impanelledBy'] = this.impanelledBy;
    data['projectCode'] = this.projectCode;
    data['salesType'] = this.salesType;
    data['projectName'] = this.projectName;
    data['projectDetail'] = this.projectDetail;
    data['clientName'] = this.clientName;
    data['clientProfile'] = this.clientProfile;
    data['concernPersonDesignation'] = this.concernPersonDesignation;
    data['companyName'] = this.companyName;
    data['phone'] = this.phone;
    data['altPhone'] = this.altPhone;
    data['fullAddress'] = this.fullAddress;
    data['locationLink'] = this.locationLink;
    return data;
  }
}
