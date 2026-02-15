class VendorInvoiceDraftListModelResponse {
  bool? success;
  String? message;
  int? total;
  int? page;
  int? limit;
  List<Data>? data;

  VendorInvoiceDraftListModelResponse(
      {this.success,
        this.message,
        this.total,
        this.page,
        this.limit,
        this.data});

  VendorInvoiceDraftListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
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
    data['message'] = this.message;
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
  String? draftId;
  int? grandTotal;
  String? createdOn;
  String? customerName;
  String? customerPhone;

  Data(
      {this.draftId,
        this.grandTotal,
        this.createdOn,
        this.customerName,
        this.customerPhone});

  Data.fromJson(Map<String, dynamic> json) {
    draftId = json['draftId'];
    grandTotal = json['grandTotal'];
    createdOn = json['createdOn'];
    customerName = json['customerName'];
    customerPhone = json['customerPhone'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['draftId'] = this.draftId;
    data['grandTotal'] = this.grandTotal;
    data['createdOn'] = this.createdOn;
    data['customerName'] = this.customerName;
    data['customerPhone'] = this.customerPhone;
    return data;
  }
}
