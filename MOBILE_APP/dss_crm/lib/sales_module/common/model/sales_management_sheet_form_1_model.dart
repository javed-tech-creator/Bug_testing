// class SalesManagementSheetShowForm1DetailsModelReponse {
//   bool? success;
//   Form1Data? data; // Renamed Data to Form1Data
//
//   SalesManagementSheetShowForm1DetailsModelReponse({this.success, this.data});
//
//   SalesManagementSheetShowForm1DetailsModelReponse.fromJson(
//       Map<String, dynamic> json) {
//     success = json['success'];
//     data = json['data'] != null ? Form1Data.fromJson(json['data']) : null; // Use Form1Data
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = <String, dynamic>{};
//     data['success'] = success;
//     if (this.data != null) {
//       data['data'] = this.data!.toJson();
//     }
//     return data;
//   }
// }
//
// class Form1Data { // Renamed Data to Form1Data
//   Form1Result? result; // Renamed Result to Form1Result
//
//   Form1Data({this.result});
//
//   Form1Data.fromJson(Map<String, dynamic> json) {
//     result =
//     json['result'] != null ? Form1Result.fromJson(json['result']) : null; // Use Form1Result
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = <String, dynamic>{};
//     if (result != null) {
//       data['result'] = result!.toJson();
//     }
//     return data;
//   }
// }
//
// class Form1Result { // Renamed Result to Form1Result
//   String? sId;
//   String? leadSource;
//   String? leadType;
//   String? queryDate;
//   String? senderName;
//   String? contactPerson;
//   String? companyName;
//   String? concernPersonDesignation;
//   String? businessType;
//   String? concernPersonName;
//   String? remark;
//   String? projectDetail;
//   String? clientRatingInBusiness; // It's String in your model, ensure parsing if needed
//   String? clientProfileComment;
//   String? expectedBusinessSize; // It's String in your model, ensure parsing if needed
//   String? email;
//   String? city;
//   String? phone;
//   String? altPhone;
//   String? address;
//   String? pincode;
//   String? requirement;
//   String? contentShared; // It's String in your model, ensure parsing if needed
//   String? leadId;
//   String? fenchargi;
//   String? chanel;
//   String? employee1LeadAcceptanceStatus;
//   String? employee2LeadAcceptanceStatus;
//   String? recceStatus;
//   String? costumerStatus;
//   String? leadStatus;
//   String? salesTLId;
//   String? salesHodId;
//   String? saleEmployeeId;
//   String? saleEmployeeId2;
//   String? notes;
//   // List<Null>? steps; // Commented out as it causes issues without a proper type
//   String? createdAt;
//   String? updatedAt;
//   int? iV;
//
//   Form1Result( // Use Form1Result in constructor
//           {this.sId,
//         this.leadSource,
//         this.leadType,
//         this.queryDate,
//         this.senderName,
//         this.contactPerson,
//         this.companyName,
//         this.concernPersonDesignation,
//         this.businessType,
//         this.concernPersonName,
//         this.remark,
//         this.projectDetail,
//         this.clientRatingInBusiness,
//         this.clientProfileComment,
//         this.expectedBusinessSize,
//         this.email,
//         this.city,
//         this.phone,
//         this.altPhone,
//         this.address,
//         this.pincode,
//         this.requirement,
//         this.contentShared,
//         this.leadId,
//         this.fenchargi,
//         this.chanel,
//         this.employee1LeadAcceptanceStatus,
//         this.employee2LeadAcceptanceStatus,
//         this.recceStatus,
//         this.costumerStatus,
//         this.leadStatus,
//         this.salesTLId,
//         this.salesHodId,
//         this.saleEmployeeId,
//         this.saleEmployeeId2,
//         this.notes,
//         // this.steps,
//         this.createdAt,
//         this.updatedAt,
//         this.iV});
//
//   Form1Result.fromJson(Map<String, dynamic> json) { // Use Form1Result in fromJson
//     sId = json['_id'];
//     leadSource = json['leadSource'];
//     leadType = json['leadType'];
//     queryDate = json['queryDate'];
//     senderName = json['senderName'];
//     contactPerson = json['contactPerson'];
//     companyName = json['companyName'];
//     concernPersonDesignation = json['concernPersonDesignation'];
//     businessType = json['businessType'];
//     concernPersonName = json['concernPersonName'];
//     remark = json['remark'];
//     projectDetail = json['projectDetail'];
//     clientRatingInBusiness = json['clientRatingInBusiness'];
//     clientProfileComment = json['clientProfileComment'];
//     expectedBusinessSize = json['expectedBusinessSize'];
//     email = json['email'];
//     city = json['city'];
//     phone = json['phone'];
//     altPhone = json['altPhone'];
//     address = json['address'];
//     pincode = json['pincode'];
//     requirement = json['requirement'];
//     contentShared = json['contentShared'];
//     leadId = json['leadId'];
//     fenchargi = json['fenchargi'];
//     chanel = json['chanel'];
//     employee1LeadAcceptanceStatus = json['employee1LeadAcceptanceStatus'];
//     employee2LeadAcceptanceStatus = json['employee2LeadAcceptanceStatus'];
//     recceStatus = json['recceStatus'];
//     costumerStatus = json['costumerStatus'];
//     leadStatus = json['leadStatus'];
//     salesTLId = json['salesTLId'];
//     salesHodId = json['salesHodId'];
//     saleEmployeeId = json['saleEmployeeId'];
//     saleEmployeeId2 = json['saleEmployeeId2'];
//     notes = json['notes'];
//     // if (json['steps'] != null) {
//     //   steps = <String>[];
//     //   json['steps'].forEach((v) {
//     //     steps!.add(new Null.fromJson(v));
//     //   });
//     // }
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//     iV = json['__v'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = <String, dynamic>{};
//     data['_id'] = sId;
//     data['leadSource'] = leadSource;
//     data['leadType'] = leadType;
//     data['queryDate'] = queryDate;
//     data['senderName'] = senderName;
//     data['contactPerson'] = contactPerson;
//     data['companyName'] = companyName;
//     data['concernPersonDesignation'] = concernPersonDesignation;
//     data['businessType'] = businessType;
//     data['concernPersonName'] = concernPersonName;
//     data['remark'] = remark;
//     data['projectDetail'] = projectDetail;
//     data['clientRatingInBusiness'] = clientRatingInBusiness;
//     data['clientProfileComment'] = clientProfileComment;
//     data['expectedBusinessSize'] = expectedBusinessSize;
//     data['email'] = email;
//     data['city'] = city;
//     data['phone'] = phone;
//     data['altPhone'] = altPhone;
//     data['address'] = address;
//     data['pincode'] = pincode;
//     data['requirement'] = requirement;
//     data['contentShared'] = contentShared;
//     data['leadId'] = leadId;
//     data['fenchargi'] = fenchargi;
//     data['chanel'] = chanel;
//     data['employee1LeadAcceptanceStatus'] = employee1LeadAcceptanceStatus;
//     data['employee2LeadAcceptanceStatus'] = employee2LeadAcceptanceStatus;
//     data['recceStatus'] = recceStatus;
//     data['costumerStatus'] = costumerStatus;
//     data['leadStatus'] = leadStatus;
//     data['salesTLId'] = salesTLId;
//     data['salesHodId'] = salesHodId;
//     data['saleEmployeeId'] = saleEmployeeId;
//     data['saleEmployeeId2'] = saleEmployeeId2;
//     data['notes'] = notes;
//     // if (steps != null) {
//     //   data['steps'] = steps!.map((v) => v.toJson()).toList();
//     // }
//     data['createdAt'] = createdAt;
//     data['updatedAt'] = updatedAt;
//     data['__v'] = iV;
//     return data;
//   }
// }

/////////////////////////////////////////////

class SalesManagementSheetShowForm1DetailsModelReponse {
  bool? success;
  Data? data;

  SalesManagementSheetShowForm1DetailsModelReponse({this.success, this.data});

  SalesManagementSheetShowForm1DetailsModelReponse.fromJson(
      Map<String, dynamic> json) {
    success = json['success'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
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
  // List<Null>? steps;
  String? createdAt;
  String? updatedAt;
  int? iV;

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
        this.iV});

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
    //     steps!.add(new Null.fromJson(v));
    //   });
    // }
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
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
    return data;
  }
}
