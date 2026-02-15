class TechEngineerAssignedTicketListModelResponse {
  bool? success;
  int? total;
  int? page;
  int? totalPages;
  List<Data>? data;

  TechEngineerAssignedTicketListModelResponse(
      {this.success, this.total, this.page, this.totalPages, this.data});

  TechEngineerAssignedTicketListModelResponse.fromJson(
      Map<String, dynamic> json) {
    success = json['success'];
    total = json['total'];
    page = json['page'];
    totalPages = json['totalPages'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['total'] = this.total;
    data['page'] = this.page;
    data['totalPages'] = this.totalPages;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
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
  String? slaTimer;
  String? status;
  String? resolutionNotes;
  List<History>? history;
  String? createdAt;

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
        this.history,
        this.createdAt});

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
    data['slaTimer'] = this.slaTimer;
    data['status'] = this.status;
    data['resolutionNotes'] = this.resolutionNotes;
    if (this.history != null) {
      data['history'] = this.history!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = this.createdAt;
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
  String? role;

  RaisedBy({this.sId, this.name, this.role});

  RaisedBy.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    role = json['role'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['role'] = this.role;
    return data;
  }
}

class History {
  RaisedBy? updatedBy;

  History({this.updatedBy});

  History.fromJson(Map<String, dynamic> json) {
    updatedBy = json['updatedBy'] != null
        ? new RaisedBy.fromJson(json['updatedBy'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.updatedBy != null) {
      data['updatedBy'] = this.updatedBy!.toJson();
    }
    return data;
  }
}
