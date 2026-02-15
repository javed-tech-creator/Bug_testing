class GetAllSalesEmpAssignedLeadsListModelResponse {
  bool? success;
  String? message;
  Data? data;

  GetAllSalesEmpAssignedLeadsListModelResponse(
      {this.success, this.message, this.data});

  GetAllSalesEmpAssignedLeadsListModelResponse.fromJson(
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
  String? sId;
  String? leadSource;
  String? leadType;
  String? queryDate;
  String? senderName;
  String? contactPerson;
  String? companyName;
  String? concernPersonDesignation;
  String? businessType;
  String? concernPersonName;
  String? remark;
  String? projectDetail;
  String? clientRatingInBusiness;
  String? clientProfileComment;
  String? expectedBusinessSize;
  String? email;
  String? city;
  String? phone;
  String? altPhone;
  String? address;
  String? pincode;
  String? requirement;
  String? contentShared;
  String? leadId;
  String? fenchargi;
  String? chanel;
  String? employee1LeadAcceptanceStatus;
  String? employee2LeadAcceptanceStatus;
  String? recceStatus;
  String? costumerStatus;
  String? leadStatus;
  String? salesTLId;
  String? salesHodId;
  String? saleEmployeeId;
  String? saleEmployeeId2;
  String? notes;
  // List<String>? steps;
  String? createdAt;
  String? updatedAt;
  int? iV;
  List<EmployeeleadsAccept>? employeeleadsAccept;

  Result(
      {this.sId,
        this.leadSource,
        this.leadType,
        this.queryDate,
        this.senderName,
        this.contactPerson,
        this.companyName,
        this.concernPersonDesignation,
        this.businessType,
        this.concernPersonName,
        this.remark,
        this.projectDetail,
        this.clientRatingInBusiness,
        this.clientProfileComment,
        this.expectedBusinessSize,
        this.email,
        this.city,
        this.phone,
        this.altPhone,
        this.address,
        this.pincode,
        this.requirement,
        this.contentShared,
        this.leadId,
        this.fenchargi,
        this.chanel,
        this.employee1LeadAcceptanceStatus,
        this.employee2LeadAcceptanceStatus,
        this.recceStatus,
        this.costumerStatus,
        this.leadStatus,
        this.salesTLId,
        this.salesHodId,
        this.saleEmployeeId,
        this.saleEmployeeId2,
        this.notes,
        // this.steps,
        this.createdAt,
        this.updatedAt,
        this.iV,
        this.employeeleadsAccept});

  Result.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    leadSource = json['leadSource'];
    leadType = json['leadType'];
    queryDate = json['queryDate'];
    senderName = json['senderName'];
    contactPerson = json['contactPerson'];
    companyName = json['companyName'];
    concernPersonDesignation = json['concernPersonDesignation'];
    businessType = json['businessType'];
    concernPersonName = json['concernPersonName'];
    remark = json['remark'];
    projectDetail = json['projectDetail'];
    clientRatingInBusiness = json['clientRatingInBusiness'];
    clientProfileComment = json['clientProfileComment'];
    expectedBusinessSize = json['expectedBusinessSize'];
    email = json['email'];
    city = json['city'];
    phone = json['phone'];
    altPhone = json['altPhone'];
    address = json['address'];
    pincode = json['pincode'];
    requirement = json['requirement'];
    contentShared = json['contentShared'];
    leadId = json['leadId'];
    fenchargi = json['fenchargi'];
    chanel = json['chanel'];
    employee1LeadAcceptanceStatus = json['employee1LeadAcceptanceStatus'];
    employee2LeadAcceptanceStatus = json['employee2LeadAcceptanceStatus'];
    recceStatus = json['recceStatus'];
    costumerStatus = json['costumerStatus'];
    leadStatus = json['leadStatus'];
    salesTLId = json['salesTLId'];
    salesHodId = json['salesHodId'];
    saleEmployeeId = json['saleEmployeeId'];
    saleEmployeeId2 = json['saleEmployeeId2'];
    notes = json['notes'];
    // if (json['steps'] != null) {
    //   steps = <String>[];
    //   json['steps'].forEach((v) {
    //     steps!.add(new STep.fromJson(v));
    //   });
    // }
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
    if (json['employeeleadsAccept'] != null) {
      employeeleadsAccept = <EmployeeleadsAccept>[];
      json['employeeleadsAccept'].forEach((v) {
        employeeleadsAccept!.add(new EmployeeleadsAccept.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['leadSource'] = this.leadSource;
    data['leadType'] = this.leadType;
    data['queryDate'] = this.queryDate;
    data['senderName'] = this.senderName;
    data['contactPerson'] = this.contactPerson;
    data['companyName'] = this.companyName;
    data['concernPersonDesignation'] = this.concernPersonDesignation;
    data['businessType'] = this.businessType;
    data['concernPersonName'] = this.concernPersonName;
    data['remark'] = this.remark;
    data['projectDetail'] = this.projectDetail;
    data['clientRatingInBusiness'] = this.clientRatingInBusiness;
    data['clientProfileComment'] = this.clientProfileComment;
    data['expectedBusinessSize'] = this.expectedBusinessSize;
    data['email'] = this.email;
    data['city'] = this.city;
    data['phone'] = this.phone;
    data['altPhone'] = this.altPhone;
    data['address'] = this.address;
    data['pincode'] = this.pincode;
    data['requirement'] = this.requirement;
    data['contentShared'] = this.contentShared;
    data['leadId'] = this.leadId;
    data['fenchargi'] = this.fenchargi;
    data['chanel'] = this.chanel;
    data['employee1LeadAcceptanceStatus'] = this.employee1LeadAcceptanceStatus;
    data['employee2LeadAcceptanceStatus'] = this.employee2LeadAcceptanceStatus;
    data['recceStatus'] = this.recceStatus;
    data['costumerStatus'] = this.costumerStatus;
    data['leadStatus'] = this.leadStatus;
    data['salesTLId'] = this.salesTLId;
    data['salesHodId'] = this.salesHodId;
    data['saleEmployeeId'] = this.saleEmployeeId;
    data['saleEmployeeId2'] = this.saleEmployeeId2;
    data['notes'] = this.notes;
    // if (this.steps != null) {
    //   data['steps'] = this.steps!.map((v) => v.toJson()).toList();
    // }
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    if (this.employeeleadsAccept != null) {
      data['employeeleadsAccept'] =
          this.employeeleadsAccept!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class EmployeeleadsAccept {
  bool? status;
  String? time;
  String? sId;

  EmployeeleadsAccept({this.status, this.time, this.sId});

  EmployeeleadsAccept.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    time = json['time'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    data['time'] = this.time;
    data['_id'] = this.sId;
    return data;
  }
}
