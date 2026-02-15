class HREmployeeListDetailModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  HREmployeeListDetailModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  HREmployeeListDetailModelResponse.fromJson(Map<String, dynamic> json) {
    statusCode = json['statusCode'];
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? Data.fromJson(json['data']) : null;
    timestamp = json['timestamp'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['statusCode'] = statusCode;
    data['success'] = success;
    data['message'] = message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    data['timestamp'] = timestamp;
    return data;
  }
}

class Data {
  EmergencyContact? emergencyContact;
  Photo? photo;
  Salary? salary;
  BankDetail? bankDetail;
  String? sId;
  CandidateId? candidateId;
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
  String? trainingPeriod;
  String? probationPeriod;
  String? workLocation;
  String? pfAccountNo;
  String? uan;
  String? esicNo;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? employeeId;
  BranchId? branchId;
  BranchId? cityId;
  BranchId? departmentId;
  BranchId? designationId;
  BranchId? stateId;
  BranchId? zoneId;

  Data({
    this.emergencyContact,
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
    this.createdAt,
    this.updatedAt,
    this.sequenceValue,
    this.iV,
    this.employeeId,
    this.branchId,
    this.cityId,
    this.departmentId,
    this.designationId,
    this.stateId,
    this.zoneId,
  });

  Data.fromJson(Map<String, dynamic> json) {
    emergencyContact = json['emergencyContact'] != null
        ? EmergencyContact.fromJson(json['emergencyContact'])
        : null;
    photo = json['photo'] != null ? Photo.fromJson(json['photo']) : null;
    salary = json['salary'] != null ? Salary.fromJson(json['salary']) : null;
    bankDetail = json['bankDetail'] != null
        ? BankDetail.fromJson(json['bankDetail'])
        : null;
    sId = json['_id'];
    candidateId = json['candidateId'] != null
        ? CandidateId.fromJson(json['candidateId'])
        : null;
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

    // ✅ HANDLE STATE - String, Object, OR NULL
    if (json['state'] != null) {
      if (json['state'] is String) {
        state = json['state'];
      } else if (json['state'] is Map) {
        state = json['state']['_id'] ?? json['state']['title'];
      }
    }

    // ✅ HANDLE CITY - String, Object, OR NULL
    if (json['city'] != null) {
      if (json['city'] is String) {
        city = json['city'];
      } else if (json['city'] is Map) {
        city = json['city']['_id'] ?? json['city']['title'];
      }
    }

    if (json['documents'] != null) {
      documents = <Documents>[];
      json['documents'].forEach((v) {
        documents!.add(Documents.fromJson(v));
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
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    employeeId = json['employeeId'];

    // ✅ SAFE PARSING FOR ALL LOCATION FIELDS
    branchId = _parseBranchId(json['branchId']);
    cityId = _parseBranchId(json['cityId']);
    departmentId = _parseBranchId(json['departmentId']);
    designationId = _parseBranchId(json['designationId']);
    stateId = _parseBranchId(json['stateId']);
    zoneId = _parseBranchId(json['zoneId']);
  }

  // ✅ HELPER METHOD - Parse BranchId safely
  BranchId? _parseBranchId(dynamic json) {
    if (json == null) return null;
    if (json is Map<String, dynamic>) {
      try {
        return BranchId.fromJson(json);
      } catch (e) {
        print('Error parsing BranchId: $e');
        return null;
      }
    }
    return null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    if (emergencyContact != null) {
      data['emergencyContact'] = emergencyContact!.toJson();
    }
    if (photo != null) {
      data['photo'] = photo!.toJson();
    }
    if (salary != null) {
      data['salary'] = salary!.toJson();
    }
    if (bankDetail != null) {
      data['bankDetail'] = bankDetail!.toJson();
    }
    data['_id'] = sId;
    if (candidateId != null) {
      data['candidateId'] = candidateId!.toJson();
    }
    data['name'] = name;
    data['email'] = email;
    data['workEmail'] = workEmail;
    data['phone'] = phone;
    data['alternateNo'] = alternateNo;
    data['whatsapp'] = whatsapp;
    data['dob'] = dob;
    data['gender'] = gender;
    data['qualification'] = qualification;
    data['maritalStatus'] = maritalStatus;
    data['bloodGroup'] = bloodGroup;
    data['currentAddress'] = currentAddress;
    data['permanentAddress'] = permanentAddress;
    data['country'] = country;
    data['state'] = state;
    data['city'] = city;
    if (documents != null) {
      data['documents'] = documents!.map((v) => v.toJson()).toList();
    }
    data['joiningDate'] = joiningDate;
    data['employeeType'] = employeeType;
    data['trainingPeriod'] = trainingPeriod;
    data['probationPeriod'] = probationPeriod;
    data['workLocation'] = workLocation;
    data['pfAccountNo'] = pfAccountNo;
    data['uan'] = uan;
    data['esicNo'] = esicNo;
    data['status'] = status;
    data['createdAt'] = createdAt;
    data['updatedAt'] = updatedAt;
    data['sequence_value'] = sequenceValue;
    data['__v'] = iV;
    data['employeeId'] = employeeId;
    if (branchId != null) {
      data['branchId'] = branchId!.toJson();
    }
    if (cityId != null) {
      data['cityId'] = cityId!.toJson();
    }
    if (departmentId != null) {
      data['departmentId'] = departmentId!.toJson();
    }
    if (designationId != null) {
      data['designationId'] = designationId!.toJson();
    }
    if (stateId != null) {
      data['stateId'] = stateId!.toJson();
    }
    if (zoneId != null) {
      data['zoneId'] = zoneId!.toJson();
    }
    return data;
  }
}

// ✅ REMAINING CLASSES (NO CHANGES NEEDED)
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
    final Map<String, dynamic> data = <String, dynamic>{};
    data['name'] = name;
    data['relation'] = relation;
    data['phone'] = phone;
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
    final Map<String, dynamic> data = <String, dynamic>{};
    data['url'] = url;
    data['public_url'] = publicUrl;
    data['public_id'] = publicId;
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
    final Map<String, dynamic> data = <String, dynamic>{};
    data['deductions'] = deductions;
    data['allowances'] = allowances;
    data['hra'] = hra;
    data['basic'] = basic;
    data['ctc'] = ctc;
    return data;
  }
}

class BankDetail {
  String? branchName;
  String? ifscCode;
  dynamic accountNumber;
  String? accountHolderName;
  String? bankName;

  BankDetail({
    this.branchName,
    this.ifscCode,
    this.accountNumber,
    this.accountHolderName,
    this.bankName,
  });

  BankDetail.fromJson(Map<String, dynamic> json) {
    branchName = json['branchName'];
    ifscCode = json['ifscCode'];
    accountNumber = json['accountNumber']?.toString();
    accountHolderName = json['accountHolderName'];
    bankName = json['bankName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['branchName'] = branchName;
    data['ifscCode'] = ifscCode;
    data['accountNumber'] = accountNumber;
    data['accountHolderName'] = accountHolderName;
    data['bankName'] = bankName;
    return data;
  }
}

class CandidateId {
  String? sId;
  String? email;

  CandidateId({this.sId, this.email});

  CandidateId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    email = json['email'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = sId;
    data['email'] = email;
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
    final Map<String, dynamic> data = <String, dynamic>{};
    data['type'] = type;
    data['url'] = url;
    data['public_url'] = publicUrl;
    data['public_id'] = publicId;
    data['_id'] = sId;
    return data;
  }
}

class BranchId {
  String? sId;
  String? title;

  BranchId({this.sId, this.title});

  BranchId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = sId;
    data['title'] = title;
    return data;
  }
}