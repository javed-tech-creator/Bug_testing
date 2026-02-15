class AddLeadSalesHODModelResponse {
  bool? success;
  String? message;
  Data? data;

  AddLeadSalesHODModelResponse({this.success, this.message, this.data});

  AddLeadSalesHODModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? leadSource;
  String? leadType;
  String? senderName;
  String? contactPerson;
  String? email;
  String? phone;
  String? address;
  String? pinCode;
  String? sender;
  String? requirement;
  String? leadStatus;
  String? status;
  String? assignedTo;
  String? saleEmployeeId;
  String? notes;
  String? sId;
  String? queryDate;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.leadSource,
        this.leadType,
        this.senderName,
        this.contactPerson,
        this.email,
        this.phone,
        this.address,
        this.pinCode,
        this.sender,
        this.requirement,
        this.leadStatus,
        this.status,
        this.assignedTo,
        this.saleEmployeeId,
        this.notes,
        this.sId,
        this.queryDate,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    leadSource = json['leadSource'];
    leadType = json['leadType'];
    senderName = json['senderName'];
    contactPerson = json['contactPerson'];
    email = json['email'];
    phone = json['phone'];
    address = json['address'];
    pinCode = json['pinCode'];
    sender = json['sender'];
    requirement = json['requirement'];
    leadStatus = json['leadStatus'];
    status = json['status'];
    assignedTo = json['assignedTo'];
    saleEmployeeId = json['saleEmployeeId'];
    notes = json['notes'];
    sId = json['_id'];
    queryDate = json['queryDate'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['leadSource'] = this.leadSource;
    data['leadType'] = this.leadType;
    data['senderName'] = this.senderName;
    data['contactPerson'] = this.contactPerson;
    data['email'] = this.email;
    data['phone'] = this.phone;
    data['address'] = this.address;
    data['pinCode'] = this.pinCode;
    data['sender'] = this.sender;
    data['requirement'] = this.requirement;
    data['leadStatus'] = this.leadStatus;
    data['status'] = this.status;
    data['assignedTo'] = this.assignedTo;
    data['saleEmployeeId'] = this.saleEmployeeId;
    data['notes'] = this.notes;
    data['_id'] = this.sId;
    data['queryDate'] = this.queryDate;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
