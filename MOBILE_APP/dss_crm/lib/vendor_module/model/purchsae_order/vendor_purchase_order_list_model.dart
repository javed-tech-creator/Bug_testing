class VendorPurchaseOrderLIstModelResponse {
  bool? success;
  int? total;
  int? page;
  int? limit;
  List<Data>? data;

  VendorPurchaseOrderLIstModelResponse(
      {this.success, this.total, this.page, this.limit, this.data});

  VendorPurchaseOrderLIstModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    total = json['total'];
    page = json['page'];
    limit = json['limit'];
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
    data['limit'] = this.limit;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? sId;
  String? invoiceId;
  int? grandTotal;
  int? amountPaid;
  String? paymentStatus;
  String? paymentMode;
  String? createdAt;
  String? customerName;
  String? customerPhone;

  Data(
      {this.sId,
        this.invoiceId,
        this.grandTotal,
        this.amountPaid,
        this.paymentStatus,
        this.paymentMode,
        this.createdAt,
        this.customerName,
        this.customerPhone});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    invoiceId = json['invoiceId'];
    grandTotal = json['grandTotal'];
    amountPaid = json['amountPaid'];
    paymentStatus = json['paymentStatus'];
    paymentMode = json['paymentMode'];
    createdAt = json['createdAt'];
    customerName = json['customerName'];
    customerPhone = json['customerPhone'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['invoiceId'] = this.invoiceId;
    data['grandTotal'] = this.grandTotal;
    data['amountPaid'] = this.amountPaid;
    data['paymentStatus'] = this.paymentStatus;
    data['paymentMode'] = this.paymentMode;
    data['createdAt'] = this.createdAt;
    data['customerName'] = this.customerName;
    data['customerPhone'] = this.customerPhone;
    return data;
  }
}
