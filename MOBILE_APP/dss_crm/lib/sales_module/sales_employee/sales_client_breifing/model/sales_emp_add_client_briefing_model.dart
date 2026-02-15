class SalesEmpAddClientBriefingModel {
  bool? success;
  String? message;
  Data? data;

  SalesEmpAddClientBriefingModel({this.success, this.message, this.data});

  SalesEmpAddClientBriefingModel.fromJson(Map<String, dynamic> json) {
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
  String? leadId;
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
  List<DocumentUpload>? documentUpload;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Result(
      {this.leadId,
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
        this.documentUpload,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Result.fromJson(Map<String, dynamic> json) {
    leadId = json['leadId'];
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
    if (json['documentUpload'] != null) {
      documentUpload = <DocumentUpload>[];
      json['documentUpload'].forEach((v) {
        documentUpload!.add(new DocumentUpload.fromJson(v));
      });
    }
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['leadId'] = this.leadId;
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
    if (this.documentUpload != null) {
      data['documentUpload'] =
          this.documentUpload!.map((v) => v.toJson()).toList();
    }
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
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




// class SalesEmpAddClientBriefingModel {
//   String? status;
//   Data? data;
//
//   SalesEmpAddClientBriefingModel({this.status, this.data});
//
//   SalesEmpAddClientBriefingModel.fromJson(Map<String, dynamic> json) {
//     status = json['status'];
//     data = json['data'] != null ? new Data.fromJson(json['data']) : null;
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['status'] = this.status;
//     if (this.data != null) {
//       data['data'] = this.data!.toJson();
//     }
//     return data;
//   }
// }
//
// class Data {
//   Result? result;
//
//   Data({this.result});
//
//   Data.fromJson(Map<String, dynamic> json) {
//     result =
//     json['result'] != null ? new Result.fromJson(json['result']) : null;
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     if (this.result != null) {
//       data['result'] = this.result!.toJson();
//     }
//     return data;
//   }
// }
//
// class Result {
//   String? leadId;
//   String? clientName;
//   String? companyName;
//   String? projectName;
//   String? productName;
//   String? clientProfile;
//   String? clientBehaviour;
//   String? discussionDone;
//   String? instructionRecce;
//   String? instructionDesign;
//   String? instructionInstallation;
//   String? instructionOther;
//   List<DocumentUpload>? documentUpload;
//   String? sId;
//   String? createdAt;
//   String? updatedAt;
//   int? iV;
//
//   Result(
//       {this.leadId,
//         this.clientName,
//         this.companyName,
//         this.projectName,
//         this.productName,
//         this.clientProfile,
//         this.clientBehaviour,
//         this.discussionDone,
//         this.instructionRecce,
//         this.instructionDesign,
//         this.instructionInstallation,
//         this.instructionOther,
//         this.documentUpload,
//         this.sId,
//         this.createdAt,
//         this.updatedAt,
//         this.iV});
//
//   Result.fromJson(Map<String, dynamic> json) {
//     leadId = json['leadId'];
//     clientName = json['clientName'];
//     companyName = json['companyName'];
//     projectName = json['projectName'];
//     productName = json['productName'];
//     clientProfile = json['clientProfile'];
//     clientBehaviour = json['clientBehaviour'];
//     discussionDone = json['discussionDone'];
//     instructionRecce = json['instructionRecce'];
//     instructionDesign = json['instructionDesign'];
//     instructionInstallation = json['instructionInstallation'];
//     instructionOther = json['instructionOther'];
//     if (json['documentUpload'] != null) {
//       documentUpload = <DocumentUpload>[];
//       json['documentUpload'].forEach((v) {
//         documentUpload!.add(new DocumentUpload.fromJson(v));
//       });
//     }
//     sId = json['_id'];
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//     iV = json['__v'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['leadId'] = this.leadId;
//     data['clientName'] = this.clientName;
//     data['companyName'] = this.companyName;
//     data['projectName'] = this.projectName;
//     data['productName'] = this.productName;
//     data['clientProfile'] = this.clientProfile;
//     data['clientBehaviour'] = this.clientBehaviour;
//     data['discussionDone'] = this.discussionDone;
//     data['instructionRecce'] = this.instructionRecce;
//     data['instructionDesign'] = this.instructionDesign;
//     data['instructionInstallation'] = this.instructionInstallation;
//     data['instructionOther'] = this.instructionOther;
//     if (this.documentUpload != null) {
//       data['documentUpload'] =
//           this.documentUpload!.map((v) => v.toJson()).toList();
//     }
//     data['_id'] = this.sId;
//     data['createdAt'] = this.createdAt;
//     data['updatedAt'] = this.updatedAt;
//     data['__v'] = this.iV;
//     return data;
//   }
// }
//
// class DocumentUpload {
//   String? url;
//   String? publicId;
//   String? sId;
//
//   DocumentUpload({this.url, this.publicId, this.sId});
//
//   DocumentUpload.fromJson(Map<String, dynamic> json) {
//     url = json['url'];
//     publicId = json['public_id'];
//     sId = json['_id'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['url'] = this.url;
//     data['public_id'] = this.publicId;
//     data['_id'] = this.sId;
//     return data;
//   }
// }
