class GetAdminSingleRegisteredUserDetailsModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  GetAdminSingleRegisteredUserDetailsModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  GetAdminSingleRegisteredUserDetailsModelResponse.fromJson(
      Map<String, dynamic> json) {
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
  User? user;

  Data({this.user});

  Data.fromJson(Map<String, dynamic> json) {
    user = json['user'] != null ? new User.fromJson(json['user']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.user != null) {
      data['user'] = this.user!.toJson();
    }
    return data;
  }
}

class User {
  Preferences? preferences;
  String? sId;
  String? name;
  String? email;
  String? phone;
  String? whatsapp;
  String? altPhone;
  String? password;
  String? verificationCode;
  bool? isVerified;
  String? userId;
  String? type;
  Branch? branch;
  Department? department;
  Designation? designation;
  Zone? zone;
  State? state;
  City? city;
  String? candidate;
  String? profileModel;
  Profile? profile;
  ManageBy? manageBy;
  List<ActionGroups>? actionGroups;
  String? status;
  String? lastLogin;
  bool? isLogin;
  int? failedLoginAttempts;
  String? lockUntil;
  bool? emailVerified;
  bool? phoneVerified;
  bool? whatsappConsent;
  String? fcmToken;
  String? webPushSubscription;
  String? deletedAt;
  List<LoginHistory>? loginHistory;
  List<RefreshTokens>? refreshTokens;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;

  User(
      {this.preferences,
        this.sId,
        this.name,
        this.email,
        this.phone,
        this.whatsapp,
        this.altPhone,
        this.password,
        this.verificationCode,
        this.isVerified,
        this.userId,
        this.type,
        this.branch,
        this.department,
        this.designation,
        this.zone,
        this.state,
        this.city,
        this.candidate,
        this.profileModel,
        this.profile,
        this.manageBy,
        this.actionGroups,
        this.status,
        this.lastLogin,
        this.isLogin,
        this.failedLoginAttempts,
        this.lockUntil,
        this.emailVerified,
        this.phoneVerified,
        this.whatsappConsent,
        this.fcmToken,
        this.webPushSubscription,
        this.deletedAt,
        this.loginHistory,
        this.refreshTokens,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV});

  User.fromJson(Map<String, dynamic> json) {
    preferences = json['preferences'] != null
        ? new Preferences.fromJson(json['preferences'])
        : null;
    sId = json['_id'];
    name = json['name'];
    email = json['email'];
    phone = json['phone'];
    whatsapp = json['whatsapp'];
    altPhone = json['altPhone'];
    password = json['password'];
    verificationCode = json['verificationCode'];
    isVerified = json['isVerified'];
    userId = json['userId'];
    type = json['type'];
    branch =
    json['branch'] != null ? new Branch.fromJson(json['branch']) : null;
    department = json['department'] != null
        ? new Department.fromJson(json['department'])
        : null;
    designation = json['designation'] != null
        ? new Designation.fromJson(json['designation'])
        : null;
    zone = json['zone'] != null ? new Zone.fromJson(json['zone']) : null;
    state = json['state'] != null ? new State.fromJson(json['state']) : null;
    city = json['city'] != null ? new City.fromJson(json['city']) : null;
    candidate = json['candidate'];
    profileModel = json['profileModel'];
    profile =
    json['profile'] != null ? new Profile.fromJson(json['profile']) : null;
    manageBy = json['manageBy'] != null
        ? new ManageBy.fromJson(json['manageBy'])
        : null;
    if (json['actionGroups'] != null) {
      actionGroups = <ActionGroups>[];
      json['actionGroups'].forEach((v) {
        actionGroups!.add(new ActionGroups.fromJson(v));
      });
    }
    status = json['status'];
    lastLogin = json['lastLogin'];
    isLogin = json['isLogin'];
    failedLoginAttempts = json['failedLoginAttempts'];
    lockUntil = json['lockUntil'];
    emailVerified = json['email_verified'];
    phoneVerified = json['phone_verified'];
    whatsappConsent = json['whatsappConsent'];
    fcmToken = json['fcmToken'];
    webPushSubscription = json['webPushSubscription'];
    deletedAt = json['deletedAt'];
    // if (json['loginHistory'] != null) {
    //   loginHistory = <Null>[];
    //   json['loginHistory'].forEach((v) {
    //     loginHistory!.add(new Null.fromJson(v));
    //   });
    // }
    if (json['loginHistory'] != null) {
      loginHistory = <LoginHistory>[];
      json['loginHistory'].forEach((v) {
        loginHistory!.add(new LoginHistory.fromJson(v));
      });
    }
    if (json['refreshTokens'] != null) {
      refreshTokens = <RefreshTokens>[];
      json['refreshTokens'].forEach((v) {
        refreshTokens!.add(new RefreshTokens.fromJson(v));
      });
    }
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.preferences != null) {
      data['preferences'] = this.preferences!.toJson();
    }
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['email'] = this.email;
    data['phone'] = this.phone;
    data['whatsapp'] = this.whatsapp;
    data['altPhone'] = this.altPhone;
    data['password'] = this.password;
    data['verificationCode'] = this.verificationCode;
    data['isVerified'] = this.isVerified;
    data['userId'] = this.userId;
    data['type'] = this.type;
    if (this.branch != null) {
      data['branch'] = this.branch!.toJson();
    }
    if (this.department != null) {
      data['department'] = this.department!.toJson();
    }
    if (this.designation != null) {
      data['designation'] = this.designation!.toJson();
    }
    if (this.zone != null) {
      data['zone'] = this.zone!.toJson();
    }
    if (this.state != null) {
      data['state'] = this.state!.toJson();
    }
    if (this.city != null) {
      data['city'] = this.city!.toJson();
    }
    data['candidate'] = this.candidate;
    data['profileModel'] = this.profileModel;
    if (this.profile != null) {
      data['profile'] = this.profile!.toJson();
    }
    if (this.manageBy != null) {
      data['manageBy'] = this.manageBy!.toJson();
    }
    if (this.actionGroups != null) {
      data['actionGroups'] = this.actionGroups!.map((v) => v.toJson()).toList();
    }
    data['status'] = this.status;
    data['lastLogin'] = this.lastLogin;
    data['isLogin'] = this.isLogin;
    data['failedLoginAttempts'] = this.failedLoginAttempts;
    data['lockUntil'] = this.lockUntil;
    data['email_verified'] = this.emailVerified;
    data['phone_verified'] = this.phoneVerified;
    data['whatsappConsent'] = this.whatsappConsent;
    data['fcmToken'] = this.fcmToken;
    data['webPushSubscription'] = this.webPushSubscription;
    data['deletedAt'] = this.deletedAt;
    if (this.loginHistory != null) {
      data['loginHistory'] = this.loginHistory!.map((v) => v.toJson()).toList();
    }
    if (this.refreshTokens != null) {
      data['refreshTokens'] =
          this.refreshTokens!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    return data;
  }
}


class LoginHistory {
  String? ip;
  String? device;
  String? timestamp;
  String? sId;

  LoginHistory({this.ip, this.device, this.timestamp, this.sId});

  LoginHistory.fromJson(Map<String, dynamic> json) {
    ip = json['ip'];
    device = json['device'];
    timestamp = json['timestamp'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['ip'] = this.ip;
    data['device'] = this.device;
    data['timestamp'] = this.timestamp;
    data['_id'] = this.sId;
    return data;
  }
}

class Preferences {
  bool? email;
  bool? sms;
  bool? push;
  bool? inApp;
  bool? whatsapp;

  Preferences({this.email, this.sms, this.push, this.inApp, this.whatsapp});

  Preferences.fromJson(Map<String, dynamic> json) {
    email = json['email'];
    sms = json['sms'];
    push = json['push'];
    inApp = json['inApp'];
    whatsapp = json['whatsapp'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['email'] = this.email;
    data['sms'] = this.sms;
    data['push'] = this.push;
    data['inApp'] = this.inApp;
    data['whatsapp'] = this.whatsapp;
    return data;
  }
}

class Branch {
  String? sId;
  String? title;
  String? address;
  String? zoneId;
  String? stateId;
  String? cityId;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? branchId;

  Branch(
      {this.sId,
        this.title,
        this.address,
        this.zoneId,
        this.stateId,
        this.cityId,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.branchId});

  Branch.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    address = json['address'];
    zoneId = json['zoneId'];
    stateId = json['stateId'];
    cityId = json['cityId'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    branchId = json['branchId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['address'] = this.address;
    data['zoneId'] = this.zoneId;
    data['stateId'] = this.stateId;
    data['cityId'] = this.cityId;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['branchId'] = this.branchId;
    return data;
  }
}

class Department {
  String? sId;
  String? title;
  String? branch;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? departmentId;

  Department(
      {this.sId,
        this.title,
        this.branch,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.departmentId});

  Department.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    branch = json['branch'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    departmentId = json['departmentId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['branch'] = this.branch;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['departmentId'] = this.departmentId;
    return data;
  }
}

class Designation {
  String? sId;
  String? title;
  String? description;
  String? depId;
  String? branchId;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? designationId;

  Designation(
      {this.sId,
        this.title,
        this.description,
        this.depId,
        this.branchId,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.designationId});

  Designation.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    description = json['description'];
    depId = json['depId'];
    branchId = json['branchId'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    designationId = json['designationId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['description'] = this.description;
    data['depId'] = this.depId;
    data['branchId'] = this.branchId;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['designationId'] = this.designationId;
    return data;
  }
}

class Zone {
  String? sId;
  String? title;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? zoneId;

  Zone(
      {this.sId,
        this.title,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.zoneId});

  Zone.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    zoneId = json['zoneId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['zoneId'] = this.zoneId;
    return data;
  }
}

class State {
  String? sId;
  String? zoneId;
  String? title;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? stateId;

  State(
      {this.sId,
        this.zoneId,
        this.title,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.stateId});

  State.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    zoneId = json['zoneId'];
    title = json['title'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    stateId = json['stateId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['zoneId'] = this.zoneId;
    data['title'] = this.title;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['stateId'] = this.stateId;
    return data;
  }
}

class City {
  String? sId;
  String? stateId;
  String? title;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? sequenceValue;
  int? iV;
  String? cityId;

  City(
      {this.sId,
        this.stateId,
        this.title,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.sequenceValue,
        this.iV,
        this.cityId});

  City.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    stateId = json['stateId'];
    title = json['title'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    sequenceValue = json['sequence_value'];
    iV = json['__v'];
    cityId = json['cityId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['stateId'] = this.stateId;
    data['title'] = this.title;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['sequence_value'] = this.sequenceValue;
    data['__v'] = this.iV;
    data['cityId'] = this.cityId;
    return data;
  }
}

class Profile {
  ProfileImage? profileImage;
  ProfileImage? contractForm;
  String? sId;
  String? profileId;
  String? contactPersonName;
  String? contactNumber;
  String? alternateContact;
  String? email;
  String? businessName;
  String? address;
  String? city;
  String? state;
  String? pincode;
  String? gstNumber;
  String? panNumber;
  String? aadharNumber;
  String? bankName;
  String? accountNumber;
  String? ifscCode;
  List<AdditionalDocs>? additionalDocs;
  bool? isActive;
  bool? isDelete;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Profile(
      {this.profileImage,
        this.contractForm,
        this.sId,
        this.profileId,
        this.contactPersonName,
        this.contactNumber,
        this.alternateContact,
        this.email,
        this.businessName,
        this.address,
        this.city,
        this.state,
        this.pincode,
        this.gstNumber,
        this.panNumber,
        this.aadharNumber,
        this.bankName,
        this.accountNumber,
        this.ifscCode,
        this.additionalDocs,
        this.isActive,
        this.isDelete,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Profile.fromJson(Map<String, dynamic> json) {
    profileImage = json['profileImage'] != null
        ? new ProfileImage.fromJson(json['profileImage'])
        : null;
    contractForm = json['contractForm'] != null
        ? new ProfileImage.fromJson(json['contractForm'])
        : null;
    sId = json['_id'];
    profileId = json['profileId'];
    contactPersonName = json['contactPersonName'];
    contactNumber = json['contactNumber'];
    alternateContact = json['alternateContact'];
    email = json['email'];
    businessName = json['businessName'];
    address = json['address'];
    city = json['city'];
    state = json['state'];
    pincode = json['pincode'];
    gstNumber = json['gstNumber'];
    panNumber = json['panNumber'];
    aadharNumber = json['aadharNumber'];
    bankName = json['bankName'];
    accountNumber = json['accountNumber'];
    ifscCode = json['ifscCode'];
    if (json['additionalDocs'] != null) {
      additionalDocs = <AdditionalDocs>[];
      json['additionalDocs'].forEach((v) {
        additionalDocs!.add(new AdditionalDocs.fromJson(v));
      });
    }
    isActive = json['isActive'];
    isDelete = json['isDelete'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.profileImage != null) {
      data['profileImage'] = this.profileImage!.toJson();
    }
    if (this.contractForm != null) {
      data['contractForm'] = this.contractForm!.toJson();
    }
    data['_id'] = this.sId;
    data['profileId'] = this.profileId;
    data['contactPersonName'] = this.contactPersonName;
    data['contactNumber'] = this.contactNumber;
    data['alternateContact'] = this.alternateContact;
    data['email'] = this.email;
    data['businessName'] = this.businessName;
    data['address'] = this.address;
    data['city'] = this.city;
    data['state'] = this.state;
    data['pincode'] = this.pincode;
    data['gstNumber'] = this.gstNumber;
    data['panNumber'] = this.panNumber;
    data['aadharNumber'] = this.aadharNumber;
    data['bankName'] = this.bankName;
    data['accountNumber'] = this.accountNumber;
    data['ifscCode'] = this.ifscCode;
    if (this.additionalDocs != null) {
      data['additionalDocs'] =
          this.additionalDocs!.map((v) => v.toJson()).toList();
    }
    data['isActive'] = this.isActive;
    data['isDelete'] = this.isDelete;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class ProfileImage {
  String? fileName;
  String? fileType;
  String? url;
  String? publicUrl;
  String? publicId;

  ProfileImage(
      {this.fileName, this.fileType, this.url, this.publicUrl, this.publicId});

  ProfileImage.fromJson(Map<String, dynamic> json) {
    fileName = json['fileName'];
    fileType = json['fileType'];
    url = json['url'];
    publicUrl = json['public_url'];
    publicId = json['public_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['fileName'] = this.fileName;
    data['fileType'] = this.fileType;
    data['url'] = this.url;
    data['public_url'] = this.publicUrl;
    data['public_id'] = this.publicId;
    return data;
  }
}

class AdditionalDocs {
  String? docTitle;
  String? fileName;
  String? fileType;
  String? url;
  String? publicUrl;
  String? publicId;
  String? sId;

  AdditionalDocs(
      {this.docTitle,
        this.fileName,
        this.fileType,
        this.url,
        this.publicUrl,
        this.publicId,
        this.sId});

  AdditionalDocs.fromJson(Map<String, dynamic> json) {
    docTitle = json['docTitle'];
    fileName = json['fileName'];
    fileType = json['fileType'];
    url = json['url'];
    publicUrl = json['public_url'];
    publicId = json['public_id'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['docTitle'] = this.docTitle;
    data['fileName'] = this.fileName;
    data['fileType'] = this.fileType;
    data['url'] = this.url;
    data['public_url'] = this.publicUrl;
    data['public_id'] = this.publicId;
    data['_id'] = this.sId;
    return data;
  }
}

class ManageBy {
  String? sId;
  String? name;
  String? email;
  String? phone;
  String? userId;
  Designation? designation;

  ManageBy(
      {this.sId,
        this.name,
        this.email,
        this.phone,
        this.userId,
        this.designation});

  ManageBy.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    email = json['email'];
    phone = json['phone'];
    userId = json['userId'];
    designation = json['designation'] != null
        ? new Designation.fromJson(json['designation'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['email'] = this.email;
    data['phone'] = this.phone;
    data['userId'] = this.userId;
    if (this.designation != null) {
      data['designation'] = this.designation!.toJson();
    }
    return data;
  }
}

class ActionGroups {
  Permissions? permissions;
  String? sId;
  String? title;
  String? description;
  String? department;
  String? createdAt;
  String? updatedAt;
  int? iV;

  ActionGroups(
      {this.permissions,
        this.sId,
        this.title,
        this.description,
        this.department,
        this.createdAt,
        this.updatedAt,
        this.iV});

  ActionGroups.fromJson(Map<String, dynamic> json) {
    permissions = json['permissions'] != null
        ? new Permissions.fromJson(json['permissions'])
        : null;
    sId = json['_id'];
    title = json['title'];
    description = json['description'];
    department = json['department'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.permissions != null) {
      data['permissions'] = this.permissions!.toJson();
    }
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['description'] = this.description;
    data['department'] = this.department;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Permissions {
  List<String>? crud;
  List<String>? workflow;
  List<String>? data;
  List<String>? system;

  Permissions({this.crud, this.workflow, this.data, this.system});

  Permissions.fromJson(Map<String, dynamic> json) {
    crud = json['crud'].cast<String>();
    workflow = json['workflow'].cast<String>();
    data = json['data'].cast<String>();
    system = json['system'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['crud'] = this.crud;
    data['workflow'] = this.workflow;
    data['data'] = this.data;
    data['system'] = this.system;
    return data;
  }
}

class RefreshTokens {
  String? token;
  String? sId;
  String? createdAt;

  RefreshTokens({this.token, this.sId, this.createdAt});

  RefreshTokens.fromJson(Map<String, dynamic> json) {
    token = json['token'];
    sId = json['_id'];
    createdAt = json['createdAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['token'] = this.token;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    return data;
  }
}












