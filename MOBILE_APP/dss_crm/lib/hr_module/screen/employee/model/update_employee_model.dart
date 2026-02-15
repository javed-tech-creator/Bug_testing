class UpdateEmployeeModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  UpdateEmployeeModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  UpdateEmployeeModelResponse.fromJson(Map<String, dynamic> json) {
    statusCode = json['statusCode'];
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
    timestamp = json['timestamp'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['statusCode'] = this.statusCode;
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    data['timestamp'] = this.timestamp;
    return data;
  }
}

class Data {
  EmergencyContact? emergencyContact;
  Photo? photo;
  Salary? salary;
  BankDetail? bankDetail;
  String? sId;
  String? candidateId;
  String? name;
  String? email;
  String? workEmail;
  String? phone;
  String? alternateNo;
  String? whatsapp;
  String? dob;
  String? gender;
  String? qualification;
  String? maritalStatus;
  String? bloodGroup;
  String? currentAddress;
  String? permanentAddress;
  String? country;
  String? state;
  String? city;
  List<Documents>? documents;
  String? joiningDate;
  String? employeeType;
  Null? trainingPeriod;
  String? probationPeriod;
  String? workLocation;
  String? pfAccountNo;
  String? uan;
  String? esicNo;
  String? status;
  String? branchId;
  String? departmentId;
  String? designationId;
  String? zoneId;
  String? stateId;
  String? cityId;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? employeeId;

  Data(
      {this.emergencyContact,
        this.photo,
        this.salary,
        this.bankDetail,
        this.sId,
        this.candidateId,
        this.name,
        this.email,
        this.workEmail,
        this.phone,
        this.alternateNo,
        this.whatsapp,
        this.dob,
        this.gender,
        this.qualification,
        this.maritalStatus,
        this.bloodGroup,
        this.currentAddress,
        this.permanentAddress,
        this.country,
        this.state,
        this.city,
        this.documents,
        this.joiningDate,
        this.employeeType,
        this.trainingPeriod,
        this.probationPeriod,
        this.workLocation,
        this.pfAccountNo,
        this.uan,
        this.esicNo,
        this.status,
        this.branchId,
        this.departmentId,
        this.designationId,
        this.zoneId,
        this.stateId,
        this.cityId,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.employeeId});

  Data.fromJson(Map<String, dynamic> json) {
    emergencyContact = json['emergencyContact'] != null
        ? new EmergencyContact.fromJson(json['emergencyContact'])
        : null;
    photo = json['photo'] != null ? new Photo.fromJson(json['photo']) : null;
    salary =
    json['salary'] != null ? new Salary.fromJson(json['salary']) : null;
    bankDetail = json['bankDetail'] != null
        ? new BankDetail.fromJson(json['bankDetail'])
        : null;
    sId = json['_id'];
    candidateId = json['candidateId'];
    name = json['name'];
    email = json['email'];
    workEmail = json['workEmail'];
    phone = json['phone'];
    alternateNo = json['alternateNo'];
    whatsapp = json['whatsapp'];
    dob = json['dob'];
    gender = json['gender'];
    qualification = json['qualification'];
    maritalStatus = json['maritalStatus'];
    bloodGroup = json['bloodGroup'];
    currentAddress = json['currentAddress'];
    permanentAddress = json['permanentAddress'];
    country = json['country'];
    state = json['state'];
    city = json['city'];
    if (json['documents'] != null) {
      documents = <Documents>[];
      json['documents'].forEach((v) {
        documents!.add(new Documents.fromJson(v));
      });
    }
    joiningDate = json['joiningDate'];
    employeeType = json['employeeType'];
    trainingPeriod = json['trainingPeriod'];
    probationPeriod = json['probationPeriod'];
    workLocation = json['workLocation'];
    pfAccountNo = json['pfAccountNo'];
    uan = json['uan'];
    esicNo = json['esicNo'];
    status = json['status'];
    branchId = json['branchId'];
    departmentId = json['departmentId'];
    designationId = json['designationId'];
    zoneId = json['zoneId'];
    stateId = json['stateId'];
    cityId = json['cityId'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    employeeId = json['employeeId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.emergencyContact != null) {
      data['emergencyContact'] = this.emergencyContact!.toJson();
    }
    if (this.photo != null) {
      data['photo'] = this.photo!.toJson();
    }
    if (this.salary != null) {
      data['salary'] = this.salary!.toJson();
    }
    if (this.bankDetail != null) {
      data['bankDetail'] = this.bankDetail!.toJson();
    }
    data['_id'] = this.sId;
    data['candidateId'] = this.candidateId;
    data['name'] = this.name;
    data['email'] = this.email;
    data['workEmail'] = this.workEmail;
    data['phone'] = this.phone;
    data['alternateNo'] = this.alternateNo;
    data['whatsapp'] = this.whatsapp;
    data['dob'] = this.dob;
    data['gender'] = this.gender;
    data['qualification'] = this.qualification;
    data['maritalStatus'] = this.maritalStatus;
    data['bloodGroup'] = this.bloodGroup;
    data['currentAddress'] = this.currentAddress;
    data['permanentAddress'] = this.permanentAddress;
    data['country'] = this.country;
    data['state'] = this.state;
    data['city'] = this.city;
    if (this.documents != null) {
      data['documents'] = this.documents!.map((v) => v.toJson()).toList();
    }
    data['joiningDate'] = this.joiningDate;
    data['employeeType'] = this.employeeType;
    data['trainingPeriod'] = this.trainingPeriod;
    data['probationPeriod'] = this.probationPeriod;
    data['workLocation'] = this.workLocation;
    data['pfAccountNo'] = this.pfAccountNo;
    data['uan'] = this.uan;
    data['esicNo'] = this.esicNo;
    data['status'] = this.status;
    data['branchId'] = this.branchId;
    data['departmentId'] = this.departmentId;
    data['designationId'] = this.designationId;
    data['zoneId'] = this.zoneId;
    data['stateId'] = this.stateId;
    data['cityId'] = this.cityId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['employeeId'] = this.employeeId;
    return data;
  }
}

class EmergencyContact {
  String? name;
  String? relation;
  String? phone;

  EmergencyContact({this.name, this.relation, this.phone});

  EmergencyContact.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    relation = json['relation'];
    phone = json['phone'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this.name;
    data['relation'] = this.relation;
    data['phone'] = this.phone;
    return data;
  }
}

class Photo {
  String? url;
  String? publicUrl;
  String? publicId;

  Photo({this.url, this.publicUrl, this.publicId});

  Photo.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    publicUrl = json['public_url'];
    publicId = json['public_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['public_url'] = this.publicUrl;
    data['public_id'] = this.publicId;
    return data;
  }
}

class Salary {
  int? deductions;
  int? allowances;
  int? hra;
  int? basic;
  int? ctc;

  Salary({this.deductions, this.allowances, this.hra, this.basic, this.ctc});

  Salary.fromJson(Map<String, dynamic> json) {
    deductions = json['deductions'];
    allowances = json['allowances'];
    hra = json['hra'];
    basic = json['basic'];
    ctc = json['ctc'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['deductions'] = this.deductions;
    data['allowances'] = this.allowances;
    data['hra'] = this.hra;
    data['basic'] = this.basic;
    data['ctc'] = this.ctc;
    return data;
  }
}

class BankDetail {
  String? bankName;
  String? accountHolderName;
  String? accountNumber;
  String? ifscCode;
  String? branchName;

  BankDetail(
      {this.bankName,
        this.accountHolderName,
        this.accountNumber,
        this.ifscCode,
        this.branchName});

  BankDetail.fromJson(Map<String, dynamic> json) {
    bankName = json['bankName'];
    accountHolderName = json['accountHolderName'];
    accountNumber = json['accountNumber'];
    ifscCode = json['ifscCode'];
    branchName = json['branchName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['bankName'] = this.bankName;
    data['accountHolderName'] = this.accountHolderName;
    data['accountNumber'] = this.accountNumber;
    data['ifscCode'] = this.ifscCode;
    data['branchName'] = this.branchName;
    return data;
  }
}

class Documents {
  String? type;
  String? url;
  String? publicUrl;
  String? publicId;
  String? sId;

  Documents({this.type, this.url, this.publicUrl, this.publicId, this.sId});

  Documents.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    url = json['url'];
    publicUrl = json['public_url'];
    publicId = json['public_id'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    data['url'] = this.url;
    data['public_url'] = this.publicUrl;
    data['public_id'] = this.publicId;
    data['_id'] = this.sId;
    return data;
  }
}
