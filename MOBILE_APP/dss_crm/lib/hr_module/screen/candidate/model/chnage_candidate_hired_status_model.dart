class CandidateHiredStatusChangedModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  CandidateHiredStatusChangedModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  CandidateHiredStatusChangedModelResponse.fromJson(Map<String, dynamic> json) {
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
  Resume? resume;
  OfferLetter? offerLetter;
  String? sId;
  String? jobId;
  String? name;
  String? email;
  String? phone;
  String? experience;
  List<String>? skills;
  String? source;
  String? status;
  String? inerviewDate;
  String? interviewer;
  String? feedback;
  String? offerLetterStatus;
  String? remarks;
  String? appliedDate;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.resume,
        this.offerLetter,
        this.sId,
        this.jobId,
        this.name,
        this.email,
        this.phone,
        this.experience,
        this.skills,
        this.source,
        this.status,
        this.inerviewDate,
        this.interviewer,
        this.feedback,
        this.offerLetterStatus,
        this.remarks,
        this.appliedDate,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    resume =
    json['resume'] != null ? new Resume.fromJson(json['resume']) : null;
    offerLetter = json['offerLetter'] != null
        ? new OfferLetter.fromJson(json['offerLetter'])
        : null;
    sId = json['_id'];
    jobId = json['jobId'];
    name = json['name'];
    email = json['email'];
    phone = json['phone'];
    experience = json['experience'];
    skills = json['skills'].cast<String>();
    source = json['source'];
    status = json['status'];
    inerviewDate = json['inerviewDate'];
    interviewer = json['interviewer'];
    feedback = json['feedback'];
    offerLetterStatus = json['offerLetterStatus'];
    remarks = json['remarks'];
    appliedDate = json['appliedDate'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.resume != null) {
      data['resume'] = this.resume!.toJson();
    }
    if (this.offerLetter != null) {
      data['offerLetter'] = this.offerLetter!.toJson();
    }
    data['_id'] = this.sId;
    data['jobId'] = this.jobId;
    data['name'] = this.name;
    data['email'] = this.email;
    data['phone'] = this.phone;
    data['experience'] = this.experience;
    data['skills'] = this.skills;
    data['source'] = this.source;
    data['status'] = this.status;
    data['inerviewDate'] = this.inerviewDate;
    data['interviewer'] = this.interviewer;
    data['feedback'] = this.feedback;
    data['offerLetterStatus'] = this.offerLetterStatus;
    data['remarks'] = this.remarks;
    data['appliedDate'] = this.appliedDate;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Resume {
  String? url;
  String? publicUrl;
  String? publicId;

  Resume({this.url, this.publicUrl, this.publicId});

  Resume.fromJson(Map<String, dynamic> json) {
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

class OfferLetter {
  String? url;
  String? publicUrl;
  String? publicId;

  OfferLetter({this.url, this.publicUrl, this.publicId});

  OfferLetter.fromJson(Map<String, dynamic> json) {
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
