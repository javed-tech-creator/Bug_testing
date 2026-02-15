class GetAllManagedByListByDesignationModelResponse {
  int? statusCode;
  bool? success;
  String? message;
  Data? data;
  String? timestamp;

  GetAllManagedByListByDesignationModelResponse(
      {this.statusCode, this.success, this.message, this.data, this.timestamp});

  GetAllManagedByListByDesignationModelResponse.fromJson(
      Map<String, dynamic> json) {
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
  int? count;
  List<Users>? users;

  Data({this.count, this.users});

  Data.fromJson(Map<String, dynamic> json) {
    count = json['count'];
    if (json['users'] != null) {
      users = <Users>[];
      json['users'].forEach((v) {
        users!.add(new Users.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['count'] = this.count;
    if (this.users != null) {
      data['users'] = this.users!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Users {
  String? sId;
  String? name;
  String? type;
  String? email;
  String? phone;
  String? userId;
  String? department;
  String? designation;
  String? branch;
  String? zone;
  String? state;
  String? city;
  String? status;
  String? createdAt;

  Users(
      {this.sId,
        this.name,
        this.type,
        this.email,
        this.phone,
        this.userId,
        this.department,
        this.designation,
        this.branch,
        this.zone,
        this.state,
        this.city,
        this.status,
        this.createdAt});

  Users.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    type = json['type'];
    email = json['email'];
    phone = json['phone'];
    userId = json['userId'];
    department = json['department'];
    designation = json['designation'];
    branch = json['branch'];
    zone = json['zone'];
    state = json['state'];
    city = json['city'];
    status = json['status'];
    createdAt = json['createdAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['type'] = this.type;
    data['email'] = this.email;
    data['phone'] = this.phone;
    data['userId'] = this.userId;
    data['department'] = this.department;
    data['designation'] = this.designation;
    data['branch'] = this.branch;
    data['zone'] = this.zone;
    data['state'] = this.state;
    data['city'] = this.city;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    return data;
  }
}
