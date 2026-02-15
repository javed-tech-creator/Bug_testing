class AddPaymentForm3ModelReponse {
  bool? success;
  String? message;
  Data? data;

  AddPaymentForm3ModelReponse({this.success, this.message, this.data});

  AddPaymentForm3ModelReponse.fromJson(Map<String, dynamic> json) {
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
  String? projectId;
  int? totalAmount;
  int? discount;
  int? totalPaid;
  int? remainingAmount;
  List<PaidPayments>? paidPayments;
  String? sId;
  String? createdAt;
  int? iV;

  Data(
      {this.projectId,
        this.totalAmount,
        this.discount,
        this.totalPaid,
        this.remainingAmount,
        this.paidPayments,
        this.sId,
        this.createdAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    projectId = json['projectId'];
    totalAmount = json['totalAmount'];
    discount = json['discount'];
    totalPaid = json['totalPaid'];
    remainingAmount = json['remainingAmount'];
    if (json['paidPayments'] != null) {
      paidPayments = <PaidPayments>[];
      json['paidPayments'].forEach((v) {
        paidPayments!.add(new PaidPayments.fromJson(v));
      });
    }
    sId = json['_id'];
    createdAt = json['createdAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['projectId'] = this.projectId;
    data['totalAmount'] = this.totalAmount;
    data['discount'] = this.discount;
    data['totalPaid'] = this.totalPaid;
    data['remainingAmount'] = this.remainingAmount;
    if (this.paidPayments != null) {
      data['paidPayments'] = this.paidPayments!.map((v) => v.toJson()).toList();
    }
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['__v'] = this.iV;
    return data;
  }
}

class PaidPayments {
  String? amount;
  String? paidAt;
  String? method;
  String? remarks;
  String? sId;

  PaidPayments({this.amount, this.paidAt, this.method, this.remarks, this.sId});

  PaidPayments.fromJson(Map<String, dynamic> json) {
    amount = json['amount'];
    paidAt = json['paidAt'];
    method = json['method'];
    remarks = json['remarks'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['amount'] = this.amount;
    data['paidAt'] = this.paidAt;
    data['method'] = this.method;
    data['remarks'] = this.remarks;
    data['_id'] = this.sId;
    return data;
  }
}
