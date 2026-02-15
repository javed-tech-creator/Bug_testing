class TicketRaisedByTechEngineerModelResponse {
  bool? success;
  String? message;
  Data? data;

  TicketRaisedByTechEngineerModelResponse(
      {this.success, this.message, this.data});

  TicketRaisedByTechEngineerModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? ticketId;
  String? ticketType;
  String? raisedBy;
  String? priority;
  String? issueDescription;
  Attachment? attachment;
  String? slaTimer;
  String? status;
  String? resolutionNotes;
  String? sId;
  List<String>? reassignments;
  List<History>? history;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.ticketId,
        this.ticketType,
        this.raisedBy,
        this.priority,
        this.issueDescription,
        this.attachment,
        this.slaTimer,
        this.status,
        this.resolutionNotes,
        this.sId,
        this.reassignments,
        this.history,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    ticketId = json['ticketId'];
    ticketType = json['ticketType'];
    raisedBy = json['raisedBy'];
    priority = json['priority'];
    issueDescription = json['issueDescription'];
    attachment = json['attachment'] != null
        ? new Attachment.fromJson(json['attachment'])
        : null;
    slaTimer = json['slaTimer'];
    status = json['status'];
    resolutionNotes = json['resolutionNotes'];
    sId = json['_id'];
    // if (json['reassignments'] != null) {
    //   reassignments = <Null>[];
    //   json['reassignments'].forEach((v) {
    //     reassignments!.add(new Null.fromJson(v));
    //   });
    // }
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
    data['ticketId'] = this.ticketId;
    data['ticketType'] = this.ticketType;
    data['raisedBy'] = this.raisedBy;
    data['priority'] = this.priority;
    data['issueDescription'] = this.issueDescription;
    if (this.attachment != null) {
      data['attachment'] = this.attachment!.toJson();
    }
    data['slaTimer'] = this.slaTimer;
    data['status'] = this.status;
    data['resolutionNotes'] = this.resolutionNotes;
    data['_id'] = this.sId;
    // if (this.reassignments != null) {
    //   data['reassignments'] =
    //       this.reassignments!.map((v) => v.toJson()).toList();
    // }
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

