class HrCandidatesListModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  List<Data>? data;
  String? timestamp;

  HrCandidatesListModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  HrCandidatesListModelResponse.fromJson(Map<String, dynamic> json) {
    statusCode = json['statusCode'];
    success = json['success'];
    message = json['message'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
    timestamp = json['timestamp'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['statusCode'] = this.statusCode;
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    data['timestamp'] = this.timestamp;
    return data;
  }
}

class Data {
  Resume? resume;
  Resume? offerLetter;
  String? sId;
  JobId? jobId;
  String? name;
  String? email;
  String? phone;
  String? experience;
  List<String>? skills;
  String? source;
  String? status;
  String? offerLetterStatus;
  String? appliedDate;
  String? createdAt;
  String? updatedAt;
  int? iV;
  String? remarks;
  String? interviewer;
  String? inerviewDate;
  String? feedback;

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
        this.offerLetterStatus,
        this.appliedDate,
        this.createdAt,
        this.updatedAt,
        this.iV,
        this.remarks,
        this.interviewer,
        this.inerviewDate,
        this.feedback});

  Data.fromJson(Map<String, dynamic> json) {
    resume =
    json['resume'] != null ? new Resume.fromJson(json['resume']) : null;
    offerLetter = json['offerLetter'] != null
        ? new Resume.fromJson(json['offerLetter'])
        : null;
    sId = json['_id'];
    jobId = json['jobId'] != null ? new JobId.fromJson(json['jobId']) : null;
    name = json['name'];
    email = json['email'];
    phone = json['phone'];
    experience = json['experience'];
    skills = json['skills'].cast<String>();
    source = json['source'];
    status = json['status'];
    offerLetterStatus = json['offerLetterStatus'];
    appliedDate = json['appliedDate'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
    remarks = json['remarks'];
    interviewer = json['interviewer'];
    inerviewDate = json['inerviewDate'];
    feedback = json['feedback'];
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
    if (this.jobId != null) {
      data['jobId'] = this.jobId!.toJson();
    }
    data['name'] = this.name;
    data['email'] = this.email;
    data['phone'] = this.phone;
    data['experience'] = this.experience;
    data['skills'] = this.skills;
    data['source'] = this.source;
    data['status'] = this.status;
    data['offerLetterStatus'] = this.offerLetterStatus;
    data['appliedDate'] = this.appliedDate;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    data['remarks'] = this.remarks;
    data['interviewer'] = this.interviewer;
    data['inerviewDate'] = this.inerviewDate;
    data['feedback'] = this.feedback;
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

class JobId {
  String? sId;
  String? title;

  JobId({this.sId, this.title});

  JobId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    return data;
  }
}
