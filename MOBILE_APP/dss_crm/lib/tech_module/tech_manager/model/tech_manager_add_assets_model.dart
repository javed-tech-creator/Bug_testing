class TechMangerAddAssetModelResponse {
  bool? success;
  Data? data;
  String? message;

  TechMangerAddAssetModelResponse({this.success, this.data, this.message});

  TechMangerAddAssetModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
    message = json['message'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    data['message'] = this.message;
    return data;
  }
}

class Data {
  String? tag;
  String? type;
  String? brand;
  String? model;
  String? location;
  String? status;
  String? department;
  String? role;
  String? assignedTo;
  Null? employeeId;
  String? vendorName;
  String? purchaseDate;
  String? warrantyEnd;
  String? amcContract;
  String? contractNo;
  String? validity;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.tag,
        this.type,
        this.brand,
        this.model,
        this.location,
        this.status,
        this.department,
        this.role,
        this.assignedTo,
        this.employeeId,
        this.vendorName,
        this.purchaseDate,
        this.warrantyEnd,
        this.amcContract,
        this.contractNo,
        this.validity,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    tag = json['tag'];
    type = json['type'];
    brand = json['brand'];
    model = json['model'];
    location = json['location'];
    status = json['status'];
    department = json['department'];
    role = json['role'];
    assignedTo = json['assigned_to'];
    employeeId = json['employeeId'];
    vendorName = json['vendor_name'];
    purchaseDate = json['purchase_date'];
    warrantyEnd = json['warranty_end'];
    amcContract = json['amc_contract'];
    contractNo = json['contract_no'];
    validity = json['validity'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['tag'] = this.tag;
    data['type'] = this.type;
    data['brand'] = this.brand;
    data['model'] = this.model;
    data['location'] = this.location;
    data['status'] = this.status;
    data['department'] = this.department;
    data['role'] = this.role;
    data['assigned_to'] = this.assignedTo;
    data['employeeId'] = this.employeeId;
    data['vendor_name'] = this.vendorName;
    data['purchase_date'] = this.purchaseDate;
    data['warranty_end'] = this.warrantyEnd;
    data['amc_contract'] = this.amcContract;
    data['contract_no'] = this.contractNo;
    data['validity'] = this.validity;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
