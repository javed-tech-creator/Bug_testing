class TechEngineerAssignedTicketUpdateStatusModelResponse {
  bool? success;
  String? message;
  Data? data;

  TechEngineerAssignedTicketUpdateStatusModelResponse(
      {this.success, this.message, this.data});

  TechEngineerAssignedTicketUpdateStatusModelResponse.fromJson(
      Map<String, dynamic> json) {
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
  Attachment? attachment;
  String? sId;
  String? ticketId;
  String? ticketType;
  String? raisedBy;
  String? priority;
  String? issueDescription;
  String? slaTimer;
  String? status;
  String? resolutionNotes;
  List<Reassignments>? reassignments;
  List<History>? history;
  String? createdAt;
  String? updatedAt;
  int? iV;
  Reassignments? assignedTo;

  Data(
      {this.attachment,
        this.sId,
        this.ticketId,
        this.ticketType,
        this.raisedBy,
        this.priority,
        this.issueDescription,
        this.slaTimer,
        this.status,
        this.resolutionNotes,
        this.reassignments,
        this.history,
        this.createdAt,
        this.updatedAt,
        this.iV,
        this.assignedTo});

  Data.fromJson(Map<String, dynamic> json) {
    attachment = json['attachment'] != null
        ? new Attachment.fromJson(json['attachment'])
        : null;
    sId = json['_id'];
    ticketId = json['ticketId'];
    ticketType = json['ticketType'];
    raisedBy = json['raisedBy'];
    priority = json['priority'];
    issueDescription = json['issueDescription'];
    slaTimer = json['slaTimer'];
    status = json['status'];
    resolutionNotes = json['resolutionNotes'];
    if (json['reassignments'] != null) {
      reassignments = <Reassignments>[];
      json['reassignments'].forEach((v) {
        reassignments!.add(new Reassignments.fromJson(v));
      });
    }
    if (json['history'] != null) {
      history = <History>[];
      json['history'].forEach((v) {
        history!.add(new History.fromJson(v));
      });
    }
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
    assignedTo = json['assignedTo'] != null
        ? new Reassignments.fromJson(json['assignedTo'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.attachment != null) {
      data['attachment'] = this.attachment!.toJson();
    }
    data['_id'] = this.sId;
    data['ticketId'] = this.ticketId;
    data['ticketType'] = this.ticketType;
    data['raisedBy'] = this.raisedBy;
    data['priority'] = this.priority;
    data['issueDescription'] = this.issueDescription;
    data['slaTimer'] = this.slaTimer;
    data['status'] = this.status;
    data['resolutionNotes'] = this.resolutionNotes;
    if (this.reassignments != null) {
      data['reassignments'] =
          this.reassignments!.map((v) => v.toJson()).toList();
    }
    if (this.history != null) {
      data['history'] = this.history!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    if (this.assignedTo != null) {
      data['assignedTo'] = this.assignedTo!.toJson();
    }
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

class Reassignments {
  String? date;
  String? department;
  String? name;
  String? role;
  String? employeeId;

  Reassignments(
      {this.date, this.department, this.name, this.role, this.employeeId});

  Reassignments.fromJson(Map<String, dynamic> json) {
    date = json['date'];
    department = json['department'];
    name = json['name'];
    role = json['role'];
    employeeId = json['employeeId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['date'] = this.date;
    data['department'] = this.department;
    data['name'] = this.name;
    data['role'] = this.role;
    data['employeeId'] = this.employeeId;
    return data;
  }
}

class History {
  String? status;
  String? resolutionNotes;
  String? updatedBy;
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
    updatedBy = json['updatedBy'];
    updatedAt = json['updatedAt'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    data['resolutionNotes'] = this.resolutionNotes;
    data['updatedBy'] = this.updatedBy;
    data['updatedAt'] = this.updatedAt;
    data['_id'] = this.sId;
    return data;
  }
}
