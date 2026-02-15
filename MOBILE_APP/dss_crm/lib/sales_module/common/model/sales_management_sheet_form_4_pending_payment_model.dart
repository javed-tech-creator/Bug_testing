class PendingPaymentForm4ModelReponse {
  String? status;
  Data? data;

  PendingPaymentForm4ModelReponse({this.status, this.data});

  PendingPaymentForm4ModelReponse.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    return data;
  }
}

class Data {
  Result? result;

  Data({this.result});

  Data.fromJson(Map<String, dynamic> json) {
    result =
    json['result'] != null ? new Result.fromJson(json['result']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.result != null) {
      data['result'] = this.result!.toJson();
    }
    return data;
  }
}

class Result {
  String? sId;
  String? projectId;
  int? totalAmount;
  int? discount;
  int? totalPaid;
  int? remainingAmount;
  List<PaidPayments>? paidPayments;
  String? createdAt;
  int? iV;

  Result(
      {this.sId,
        this.projectId,
        this.totalAmount,
        this.discount,
        this.totalPaid,
        this.remainingAmount,
        this.paidPayments,
        this.createdAt,
        this.iV});

  Result.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
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
    createdAt = json['createdAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['projectId'] = this.projectId;
    data['totalAmount'] = this.totalAmount;
    data['discount'] = this.discount;
    data['totalPaid'] = this.totalPaid;
    data['remainingAmount'] = this.remainingAmount;
    if (this.paidPayments != null) {
      data['paidPayments'] = this.paidPayments!.map((v) => v.toJson()).toList();
    }
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
