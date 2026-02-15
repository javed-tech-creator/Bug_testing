class GetAllSalesHODLeadsListModelResponse {
  bool? success;
  String? message;
  Data? data;

  GetAllSalesHODLeadsListModelResponse({this.success, this.message, this.data});

  GetAllSalesHODLeadsListModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? leadStatus;
  String? sId;
  String? leadSource;
  String? leadType;
  String? queryDate;
  String? senderName;
  String? contactPerson;
  String? concernedPerson;
  String? company;
  String? concernPersonName;
  String? remark;
  String? clientRatingInBusiness;
  int? price;
  int? payamout;
  String? email;
  String? city;
  String? phone;
  String? altPhone;
  String? address;
  String? pincode;
  String? sender;
  String? requirement;
  String? costumerStatus;
  String? status;
  String? salesTLId;
  String? salesHodId;
  String? saleEmployeeId;
  String? notes;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Result(
      {
        this.leadStatus,
        this.sId,
        this.leadSource,
        this.leadType,
        this.queryDate,
        this.senderName,
        this.contactPerson,
        this.concernedPerson,
        this.company,
        this.concernPersonName,
        this.remark,
        this.clientRatingInBusiness,
        this.price,
        this.payamout,
        this.email,
        this.city,
        this.phone,
        this.altPhone,
        this.address,
        this.pincode,
        this.sender,
        this.requirement,
        this.costumerStatus,
        this.status,
        this.salesTLId,
        this.salesHodId,
        this.saleEmployeeId,
        this.notes,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Result.fromJson(Map<String, dynamic> json) {
    leadStatus = json['leadStatus'];
    sId = json['_id'];
    leadSource = json['leadSource'];
    leadType = json['leadType'];
    queryDate = json['queryDate'];
    senderName = json['senderName'];
    contactPerson = json['contactPerson'];
    concernedPerson = json['concernedPerson'];
    company = json['company'];
    concernPersonName = json['concernPersonName'];
    remark = json['remark'];
    clientRatingInBusiness = json['clientRatingInBusiness'];
    price = json['price'];
    payamout = json['payamout'];
    email = json['email'];
    city = json['city'];
    phone = json['phone'];
    altPhone = json['altPhone'];
    address = json['address'];
    pincode = json['pincode'];
    sender = json['sender'];
    requirement = json['requirement'];
    costumerStatus = json['costumerStatus'];
    status = json['status'];
    salesTLId = json['salesTLId'];
    salesHodId = json['salesHodId'];
    saleEmployeeId = json['saleEmployeeId'];
    notes = json['notes'];
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
    data['concernedPerson'] = this.concernedPerson;
    data['company'] = this.company;
    data['concernPersonName'] = this.concernPersonName;
    data['remark'] = this.remark;
    data['clientRatingInBusiness'] = this.clientRatingInBusiness;
    data['price'] = this.price;
    data['payamout'] = this.payamout;
    data['email'] = this.email;
    data['city'] = this.city;
    data['phone'] = this.phone;
    data['altPhone'] = this.altPhone;
    data['address'] = this.address;
    data['pincode'] = this.pincode;
    data['sender'] = this.sender;
    data['requirement'] = this.requirement;
    data['costumerStatus'] = this.costumerStatus;
    data['status'] = this.status;
    data['salesTLId'] = this.salesTLId;
    data['salesHodId'] = this.salesHodId;
    data['saleEmployeeId'] = this.saleEmployeeId;
    data['notes'] = this.notes;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}




// class GetAllSalesHODLeadsListModelResponse {
//   bool? success;
//   Data? data;
//
//   GetAllSalesHODLeadsListModelResponse({this.success, this.data});
//
//   GetAllSalesHODLeadsListModelResponse.fromJson(Map<String, dynamic> json) {
//     success = json['success'];
//     data = json['data'] != null ? new Data.fromJson(json['data']) : null;
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['success'] = this.success;
//     if (this.data != null) {
//       data['data'] = this.data!.toJson();
//     }
//     return data;
//   }
// }
//
// class Data {
//   List<Result>? result;
//
//   Data({this.result});
//
//   Data.fromJson(Map<String, dynamic> json) {
//     if (json['result'] != null) {
//       result = <Result>[];
//       json['result'].forEach((v) {
//         result!.add(new Result.fromJson(v));
//       });
//     }
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     if (this.result != null) {
//       data['result'] = this.result!.map((v) => v.toJson()).toList();
//     }
//     return data;
//   }
// }
//
// class Result {
//   String? concernedPerson;
//   String? company;
//   String? concernedPersonNumber;
//   String? remark;
//   String? clientRatingInBusiness;
//   int? price;
//   int? payamout;
//   String? costumerStatus;
//   String? salesTLId;
//   String? salesHodId;
//   String? sId;
//   String? leadSource;
//   String? leadType;
//   String? senderName;
//   String? contactPerson;
//   String? email;
//   String? phone;
//   String? address;
//   String? pinCode;
//   String? sender;
//   String? requirement;
//   String? leadStatus;
//   String? status;
//   String? assignedTo;
//   String? saleEmployeeId;
//   String? notes;
//   String? queryDate;
//   String? createdAt;
//   String? updatedAt;
//   int? iV;
//   String? assignedId;
//
//   Result(
//       {this.concernedPerson,
//         this.company,
//         this.concernedPersonNumber,
//         this.remark,
//         this.clientRatingInBusiness,
//         this.price,
//         this.payamout,
//         this.costumerStatus,
//         this.salesTLId,
//         this.salesHodId,
//         this.sId,
//         this.leadSource,
//         this.leadType,
//         this.senderName,
//         this.contactPerson,
//         this.email,
//         this.phone,
//         this.address,
//         this.pinCode,
//         this.sender,
//         this.requirement,
//         this.leadStatus,
//         this.status,
//         this.assignedTo,
//         this.saleEmployeeId,
//         this.notes,
//         this.queryDate,
//         this.createdAt,
//         this.updatedAt,
//         this.iV,
//         this.assignedId});
//
//   Result.fromJson(Map<String, dynamic> json) {
//     concernedPerson = json['concernedPerson'];
//     company = json['company'];
//     concernedPersonNumber = json['concernedPersonNumber'];
//     remark = json['remark'];
//     clientRatingInBusiness = json['clientRatingInBusiness'];
//     price = json['price'];
//     payamout = json['payamout'];
//     costumerStatus = json['costumerStatus'];
//     salesTLId = json['salesTLId'];
//     salesHodId = json['salesHodId'];
//     sId = json['_id'];
//     leadSource = json['leadSource'];
//     leadType = json['leadType'];
//     senderName = json['senderName'];
//     contactPerson = json['contactPerson'];
//     email = json['email'];
//     phone = json['phone'];
//     address = json['address'];
//     pinCode = json['pinCode'];
//     sender = json['sender'];
//     requirement = json['requirement'];
//     leadStatus = json['leadStatus'];
//     status = json['status'];
//     assignedTo = json['assignedTo'];
//     saleEmployeeId = json['saleEmployeeId'];
//     notes = json['notes'];
//     queryDate = json['queryDate'];
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//     iV = json['__v'];
//     assignedId = json['assignedId'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['concernedPerson'] = this.concernedPerson;
//     data['company'] = this.company;
//     data['concernedPersonNumber'] = this.concernedPersonNumber;
//     data['remark'] = this.remark;
//     data['clientRatingInBusiness'] = this.clientRatingInBusiness;
//     data['price'] = this.price;
//     data['payamout'] = this.payamout;
//     data['costumerStatus'] = this.costumerStatus;
//     data['salesTLId'] = this.salesTLId;
//     data['salesHodId'] = this.salesHodId;
//     data['_id'] = this.sId;
//     data['leadSource'] = this.leadSource;
//     data['leadType'] = this.leadType;
//     data['senderName'] = this.senderName;
//     data['contactPerson'] = this.contactPerson;
//     data['email'] = this.email;
//     data['phone'] = this.phone;
//     data['address'] = this.address;
//     data['pinCode'] = this.pinCode;
//     data['sender'] = this.sender;
//     data['requirement'] = this.requirement;
//     data['leadStatus'] = this.leadStatus;
//     data['status'] = this.status;
//     data['assignedTo'] = this.assignedTo;
//     data['saleEmployeeId'] = this.saleEmployeeId;
//     data['notes'] = this.notes;
//     data['queryDate'] = this.queryDate;
//     data['createdAt'] = this.createdAt;
//     data['updatedAt'] = this.updatedAt;
//     data['__v'] = this.iV;
//     data['assignedId'] = this.assignedId;
//     return data;
//   }
// }
