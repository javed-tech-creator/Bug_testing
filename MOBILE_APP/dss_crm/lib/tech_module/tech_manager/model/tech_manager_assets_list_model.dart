class TechMangerAssetsListModelResponse {
  bool? success;
  List<Data>? data;
  int? total;
  int? page;
  int? limit;

  TechMangerAssetsListModelResponse(
      {this.success, this.data, this.total, this.page, this.limit});

  TechMangerAssetsListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
    total = json['total'];
    page = json['page'];
    limit = json['limit'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    data['total'] = this.total;
    data['page'] = this.page;
    data['limit'] = this.limit;
    return data;
  }
}

class Data {
  String? sId;
  String? tag;
  String? type;
  String? brand;
  String? model;
  String? location;
  String? status;
  String? department;
  String? role;
  String? assignedTo;
  String? employeeId;
  String? vendorName;
  String? purchaseDate;
  String? warrantyEnd;
  String? amcContract;
  String? contractNo;
  String? validity;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.sId,
        this.tag,
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
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
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
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
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
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
