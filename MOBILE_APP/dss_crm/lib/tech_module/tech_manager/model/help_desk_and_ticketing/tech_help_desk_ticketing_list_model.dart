class TechIHelpDeskAndTicketingModelResponse {
  bool? success;
  List<Data>? data;
  int? total;
  int? page;
  int? totalPages;

  TechIHelpDeskAndTicketingModelResponse(
      {this.success, this.data, this.total, this.page, this.totalPages});

  TechIHelpDeskAndTicketingModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
    total = json['total'];
    page = json['page'];
    totalPages = json['totalPages'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    data['total'] = this.total;
    data['page'] = this.page;
    data['totalPages'] = this.totalPages;
    return data;
  }
}

class Data {
  Attachment? attachment;
  String? sId;
  String? ticketId;
  String? ticketType;
  RaisedBy? raisedBy;
  String? priority;
  String? issueDescription;
  String? department;
  String? role;
  String? assignedTo;
  String? employeeId;
  String? slaTimer;
  String? status;
  String? resolutionNotes;
  List<History>? history;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.attachment,
        this.sId,
        this.ticketId,
        this.ticketType,
        this.raisedBy,
        this.priority,
        this.issueDescription,
        this.department,
        this.role,
        this.assignedTo,
        this.employeeId,
        this.slaTimer,
        this.status,
        this.resolutionNotes,
        this.history,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    attachment = json['attachment'] != null
        ? new Attachment.fromJson(json['attachment'])
        : null;
    sId = json['_id'];
    ticketId = json['ticketId'];
    ticketType = json['ticketType'];
    raisedBy = json['raisedBy'] != null
        ? new RaisedBy.fromJson(json['raisedBy'])
        : null;
    priority = json['priority'];
    issueDescription = json['issueDescription'];
    department = json['department'];
    role = json['role'];
    assignedTo = json['assigned_to'];
    employeeId = json['employeeId'];
    slaTimer = json['slaTimer'];
    status = json['status'];
    resolutionNotes = json['resolutionNotes'];
    if (json['history'] != null) {
      history = <History>[];
      json['history'].forEach((v) {
        history!.add(new History.fromJson(v));
      });
    }
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.attachment != null) {
      data['attachment'] = this.attachment!.toJson();
    }
    data['_id'] = this.sId;
    data['ticketId'] = this.ticketId;
    data['ticketType'] = this.ticketType;
    if (this.raisedBy != null) {
      data['raisedBy'] = this.raisedBy!.toJson();
    }
    data['priority'] = this.priority;
    data['issueDescription'] = this.issueDescription;
    data['department'] = this.department;
    data['role'] = this.role;
    data['assigned_to'] = this.assignedTo;
    data['employeeId'] = this.employeeId;
    data['slaTimer'] = this.slaTimer;
    data['status'] = this.status;
    data['resolutionNotes'] = this.resolutionNotes;
    if (this.history != null) {
      data['history'] = this.history!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Attachment {
  String? url;
  String? type;
  String? name;

  Attachment({this.url, this.type, this.name});

  Attachment.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    type = json['type'];
    name = json['name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['type'] = this.type;
    data['name'] = this.name;
    return data;
  }
}

class RaisedBy {
  String? sId;
  String? name;

  RaisedBy({this.sId, this.name});

  RaisedBy.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    return data;
  }
}

class History {
  String? status;
  String? resolutionNotes;
  RaisedBy? updatedBy;
  String? updatedAt;
  String? sId;

  History(
      {this.status,
        this.resolutionNotes,
        this.updatedBy,
        this.updatedAt,
        this.sId});

  History.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    resolutionNotes = json['resolutionNotes'];
    updatedBy = json['updatedBy'] != null
        ? new RaisedBy.fromJson(json['updatedBy'])
        : null;
    updatedAt = json['updatedAt'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    data['resolutionNotes'] = this.resolutionNotes;
    if (this.updatedBy != null) {
      data['updatedBy'] = this.updatedBy!.toJson();
    }
    data['updatedAt'] = this.updatedAt;
    data['_id'] = this.sId;
    return data;
  }
}
