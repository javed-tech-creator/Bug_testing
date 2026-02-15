// The fields are nullable because a new lead might not have all of them initially.
class CommonAddLeadModelLeadModel {
  final String? sId;
  final String? leadSource;
  final String? leadType;
  final String? concernPersonName;
  final String? phone;
  final String? altPhone;
  final String? email;
  final String? city;
  final String? pincode;
  final String? address;
  final String? requirement;
  final String? status;
  final String? createdAt;
  final String? updatedAt;

  CommonAddLeadModelLeadModel({
    this.sId,
    this.leadSource,
    this.leadType,
    this.concernPersonName,
    this.phone,
    this.altPhone,
    this.email,
    this.city,
    this.pincode,
    this.address,
    this.requirement,
    this.status,
    this.createdAt,
    this.updatedAt,
  });

  // Factory constructor to create a CommonAddLeadModelLeadModel from a JSON object.
  // This is useful for parsing the API response.
  factory CommonAddLeadModelLeadModel.fromJson(Map<String, dynamic> json) {
    return CommonAddLeadModelLeadModel(
      sId: json['_id'],
      leadSource: json['leadSource'],
      leadType: json['leadType'],
      concernPersonName: json['concernedPersonNumber'],
      phone: json['phone'],
      altPhone: json['altPhone'],
      email: json['email'],
      city: json['city'],
      pincode: json['pinCode'],
      address: json['address'],
      requirement: json['requirement'],
      status: json['status'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }

  // Method to convert the CommonAddLeadModelLeadModel to a JSON object.
  // This is useful for sending data back to the API.
  Map<String, dynamic> toJson() {
    return {
      '_id': sId,
      'leadSource': leadSource,
      'leadType': leadType,
      'concernedPersonNumber': concernPersonName,
      'phone': phone,
      'altPhone': altPhone,
      'email': email,
      'city': city,
      'pincode': pincode,
      'address': address,
      'requirement': requirement,
      'status': status,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}