// class SalesManagementSheetShowForm2DetailsModelReponse {
//   bool? success;
//   Form2Data? data; // Renamed Data to Form2Data
//
//   SalesManagementSheetShowForm2DetailsModelReponse({this.success, this.data});
//
//   SalesManagementSheetShowForm2DetailsModelReponse.fromJson(
//       Map<String, dynamic> json) {
//     success = json['success'];
//     data = json['data'] != null ? Form2Data.fromJson(json['data']) : null; // Use Form2Data
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
// class Form2Data { // Renamed Data to Form2Data
//   Form2Result? result; // Renamed Result to Form2Result
//
//   Form2Data({this.result});
//
//   Form2Data.fromJson(Map<String, dynamic> json) {
//     result =
//     json['result'] != null ? Form2Result.fromJson(json['result']) : null; // Use Form2Result
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
// class Form2Result { // Renamed Result to Form2Result
//   int? salesManagementStep;
//   String? sId;
//   String? leadId;
//   String? clientName;
//   String? companyName;
//   String? projectName;
//   String? productName;
//   String? clientsRequirements; // Added based on earlier discussion
//   String? clientProfile;
//   String? clientBehaviour;
//   String? discussionDone;
//   String? instructionRecce;
//   String? instructionDesign;
//   String? instructionInstallation;
//   String? instructionOther;
//   String? projectId;
//   List<DocumentUpload>? documentUpload;
//   String? createdAt;
//   String? updatedAt;
//   int? iV;
//
//   Form2Result( // Use Form2Result in constructor
//           {this.salesManagementStep,
//         this.sId,
//         this.leadId,
//         this.clientName,
//         this.companyName,
//         this.projectName,
//         this.productName,
//         this.clientsRequirements, // Added
//         this.clientProfile,
//         this.clientBehaviour,
//         this.discussionDone,
//         this.instructionRecce,
//         this.instructionDesign,
//         this.instructionInstallation,
//         this.instructionOther,
//         this.projectId,
//         this.documentUpload,
//         this.createdAt,
//         this.updatedAt,
//         this.iV});
//
//   Form2Result.fromJson(Map<String, dynamic> json) { // Use Form2Result in fromJson
//     salesManagementStep = json['salesManagementStep'];
//     sId = json['_id'];
//     leadId = json['leadId'];
//     clientName = json['clientName'];
//     companyName = json['companyName'];
//     projectName = json['projectName'];
//     productName = json['productName'];
//     clientsRequirements = json['clientsRequirements']; // Added
//     clientProfile = json['clientProfile'];
//     clientBehaviour = json['clientBehaviour'];
//     discussionDone = json['discussionDone'];
//     instructionRecce = json['instructionRecce'];
//     instructionDesign = json['instructionDesign'];
//     instructionInstallation = json['instructionInstallation'];
//     instructionOther = json['instructionOther'];
//     projectId = json['projectId'];
//     if (json['documentUpload'] != null) {
//       documentUpload = <DocumentUpload>[];
//       json['documentUpload'].forEach((v) {
//         documentUpload!.add(DocumentUpload.fromJson(v));
//       });
//     }
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//     iV = json['__v'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = <String, dynamic>{};
//     data['salesManagementStep'] = salesManagementStep;
//     data['_id'] = sId;
//     data['leadId'] = leadId;
//     data['clientName'] = clientName;
//     data['companyName'] = companyName;
//     data['projectName'] = projectName;
//     data['productName'] = productName;
//     data['clientsRequirements'] = clientsRequirements; // Added
//     data['clientProfile'] = clientProfile;
//     data['clientBehaviour'] = clientBehaviour;
//     data['discussionDone'] = discussionDone;
//     data['instructionRecce'] = instructionRecce;
//     data['instructionDesign'] = instructionDesign;
//     data['instructionInstallation'] = instructionInstallation;
//     data['instructionOther'] = instructionOther;
//     data['projectId'] = projectId;
//     if (documentUpload != null) {
//       data['documentUpload'] =
//           documentUpload!.map((v) => v.toJson()).toList();
//     }
//     data['createdAt'] = createdAt;
//     data['updatedAt'] = updatedAt;
//     data['__v'] = iV;
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
//     final Map<String, dynamic> data = <String, dynamic>{};
//     data['url'] = url;
//     data['public_id'] = publicId;
//     data['_id'] = sId;
//     return data;
//   }
// }

/////////////////////////////////////////////////

class SalesManagementSheetShowForm2DetailsModelReponse {
  bool? success;
  Data? data;

  SalesManagementSheetShowForm2DetailsModelReponse({this.success, this.data});

  SalesManagementSheetShowForm2DetailsModelReponse.fromJson(
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
  int? salesManagementStep;
  String? sId;
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
  String? projectId;
  List<DocumentUpload>? documentUpload;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Result(
      {this.salesManagementStep,
        this.sId,
        this.leadId,
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
        this.documentUpload,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Result.fromJson(Map<String, dynamic> json) {
    salesManagementStep = json['salesManagementStep'];
    sId = json['_id'];
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
    projectId = json['projectId'];
    if (json['documentUpload'] != null) {
      documentUpload = <DocumentUpload>[];
      json['documentUpload'].forEach((v) {
        documentUpload!.add(new DocumentUpload.fromJson(v));
      });
    }
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['salesManagementStep'] = this.salesManagementStep;
    data['_id'] = this.sId;
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
    data['projectId'] = this.projectId;
    if (this.documentUpload != null) {
      data['documentUpload'] =
          this.documentUpload!.map((v) => v.toJson()).toList();
    }
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
