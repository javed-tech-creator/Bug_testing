class GetAllJobPostingListModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  List<Data>? data;
  String? timestamp;

  GetAllJobPostingListModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  GetAllJobPostingListModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? sId;
  String? title;
  String? slug;
  String? description;
  String? jobType;
  List<String>? skills;
  String? employmentType;
  String? experience;
  DepartmentId? departmentId;
  String? branchId;
  DesignationId? designationId;
  String? salaryRange;
  int? openings;
  String? status;
  String? closedAt;
  String? postedBy;
  String? postedAt;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.sId,
        this.title,
        this.slug,
        this.description,
        this.jobType,
        this.skills,
        this.employmentType,
        this.experience,
        this.departmentId,
        this.branchId,
        this.designationId,
        this.salaryRange,
        this.openings,
        this.status,
        this.closedAt,
        this.postedBy,
        this.postedAt,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    slug = json['slug'];
    description = json['description'];
    jobType = json['jobType'];
    skills = json['skills'].cast<String>();
    employmentType = json['employmentType'];
    experience = json['experience'];
    departmentId = json['departmentId'] != null
        ? new DepartmentId.fromJson(json['departmentId'])
        : null;
    branchId = json['branchId'];
    designationId = json['designationId'] != null
        ? new DesignationId.fromJson(json['designationId'])
        : null;
    salaryRange = json['salaryRange'];
    openings = json['openings'];
    status = json['status'];
    closedAt = json['closedAt'];
    postedBy = json['postedBy'];
    postedAt = json['postedAt'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['slug'] = this.slug;
    data['description'] = this.description;
    data['jobType'] = this.jobType;
    data['skills'] = this.skills;
    data['employmentType'] = this.employmentType;
    data['experience'] = this.experience;
    if (this.departmentId != null) {
      data['departmentId'] = this.departmentId!.toJson();
    }
    data['branchId'] = this.branchId;
    if (this.designationId != null) {
      data['designationId'] = this.designationId!.toJson();
    }
    data['salaryRange'] = this.salaryRange;
    data['openings'] = this.openings;
    data['status'] = this.status;
    data['closedAt'] = this.closedAt;
    data['postedBy'] = this.postedBy;
    data['postedAt'] = this.postedAt;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class DepartmentId {
  String? sId;
  String? title;
  String? departmentId;

  DepartmentId({this.sId, this.title, this.departmentId});

  DepartmentId.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    departmentId = json['departmentId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['departmentId'] = this.departmentId;
    return data;
  }
}

class DesignationId {
  String? sId;
  String? title;

  DesignationId({this.sId, this.title});

  DesignationId.fromJson(Map<String, dynamic> json) {
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
