class SendProjectToRacceModelResponse {
  bool? success;
  String? message;
  Data? data;

  SendProjectToRacceModelResponse({this.success, this.message, this.data});

  SendProjectToRacceModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? leadId;
  String? userId;
  String? clientName;
  String? companyName;
  String? projectName;
  String? productName;
  String? clientProfile;
  String? clientBehaviour;
  String? discussionDone;
  String? instructionRecce;
  String? instructionDesign;
  String? instructionInstallation;
  String? instructionOther;
  String? projectId;
  int? salesManagementStep;
  String? requirement;
  String? address;
  List<DocumentUpload>? documentUpload;
  String? createdAt;
  String? updatedAt;
  int? iV;
  bool? recceStatus;

  Result(
      {this.sId,
        this.leadId,
        this.userId,
        this.clientName,
        this.companyName,
        this.projectName,
        this.productName,
        this.clientProfile,
        this.clientBehaviour,
        this.discussionDone,
        this.instructionRecce,
        this.instructionDesign,
        this.instructionInstallation,
        this.instructionOther,
        this.projectId,
        this.salesManagementStep,
        this.requirement,
        this.address,
        this.documentUpload,
        this.createdAt,
        this.updatedAt,
        this.iV,
        this.recceStatus});

  Result.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    leadId = json['leadId'];
    userId = json['userId'];
    clientName = json['clientName'];
    companyName = json['companyName'];
    projectName = json['projectName'];
    productName = json['productName'];
    clientProfile = json['clientProfile'];
    clientBehaviour = json['clientBehaviour'];
    discussionDone = json['discussionDone'];
    instructionRecce = json['instructionRecce'];
    instructionDesign = json['instructionDesign'];
    instructionInstallation = json['instructionInstallation'];
    instructionOther = json['instructionOther'];
    projectId = json['projectId'];
    salesManagementStep = json['salesManagementStep'];
    requirement = json['requirement'];
    address = json['address'];
    if (json['documentUpload'] != null) {
      documentUpload = <DocumentUpload>[];
      json['documentUpload'].forEach((v) {
        documentUpload!.add(new DocumentUpload.fromJson(v));
      });
    }
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
    recceStatus = json['recceStatus'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['leadId'] = this.leadId;
    data['userId'] = this.userId;
    data['clientName'] = this.clientName;
    data['companyName'] = this.companyName;
    data['projectName'] = this.projectName;
    data['productName'] = this.productName;
    data['clientProfile'] = this.clientProfile;
    data['clientBehaviour'] = this.clientBehaviour;
    data['discussionDone'] = this.discussionDone;
    data['instructionRecce'] = this.instructionRecce;
    data['instructionDesign'] = this.instructionDesign;
    data['instructionInstallation'] = this.instructionInstallation;
    data['instructionOther'] = this.instructionOther;
    data['projectId'] = this.projectId;
    data['salesManagementStep'] = this.salesManagementStep;
    data['requirement'] = this.requirement;
    data['address'] = this.address;
    if (this.documentUpload != null) {
      data['documentUpload'] =
          this.documentUpload!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    data['recceStatus'] = this.recceStatus;
    return data;
  }
}

class DocumentUpload {
  String? url;
  String? publicId;
  String? sId;

  DocumentUpload({this.url, this.publicId, this.sId});

  DocumentUpload.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    publicId = json['public_id'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['public_id'] = this.publicId;
    data['_id'] = this.sId;
    return data;
  }
}
