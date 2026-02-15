class VendorPurchaseOrderPaymentUpdateModelResponse {
  bool? success;
  String? message;
  Data? data;

  VendorPurchaseOrderPaymentUpdateModelResponse(
      {this.success, this.message, this.data});

  VendorPurchaseOrderPaymentUpdateModelResponse.fromJson(
      Map<String, dynamic> json) {
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
  String? sId;
  String? invoiceId;
  List<Items>? items;
  int? gst;
  double? totalNetAmount;
  double? totalNetAmountAfterDiscount;
  int? totalDiscount;
  double? totalTaxAmount;
  int? globalDiscount;
  String? globalDiscountType;
  bool? roundOff;
  double? roundOffAmount;
  int? grandTotal;
  int? amountPaid;
  int? partialPaid;
  String? paymentStatus;
  String? paymentMode;
  String? invoiceDate;
  Null? dueDate;
  String? paymentDate;
  String? notes;
  bool? sendSMS;
  String? bankDetailId;
  String? customerId;
  String? createdBy;
  List<PaymentHistory>? paymentHistory;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.sId,
        this.invoiceId,
        this.items,
        this.gst,
        this.totalNetAmount,
        this.totalNetAmountAfterDiscount,
        this.totalDiscount,
        this.totalTaxAmount,
        this.globalDiscount,
        this.globalDiscountType,
        this.roundOff,
        this.roundOffAmount,
        this.grandTotal,
        this.amountPaid,
        this.partialPaid,
        this.paymentStatus,
        this.paymentMode,
        this.invoiceDate,
        this.dueDate,
        this.paymentDate,
        this.notes,
        this.sendSMS,
        this.bankDetailId,
        this.customerId,
        this.createdBy,
        this.paymentHistory,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    invoiceId = json['invoiceId'];
    if (json['items'] != null) {
      items = <Items>[];
      json['items'].forEach((v) {
        items!.add(new Items.fromJson(v));
      });
    }
    gst = json['gst'];
    totalNetAmount = json['totalNetAmount'];
    totalNetAmountAfterDiscount = json['totalNetAmountAfterDiscount'];
    totalDiscount = json['totalDiscount'];
    totalTaxAmount = json['totalTaxAmount'];
    globalDiscount = json['globalDiscount'];
    globalDiscountType = json['globalDiscountType'];
    roundOff = json['roundOff'];
    roundOffAmount = json['roundOffAmount'];
    grandTotal = json['grandTotal'];
    amountPaid = json['amountPaid'];
    partialPaid = json['partialPaid'];
    paymentStatus = json['paymentStatus'];
    paymentMode = json['paymentMode'];
    invoiceDate = json['invoiceDate'];
    dueDate = json['dueDate'];
    paymentDate = json['paymentDate'];
    notes = json['notes'];
    sendSMS = json['sendSMS'];
    bankDetailId = json['bankDetailId'];
    customerId = json['customerId'];
    createdBy = json['createdBy'];
    if (json['paymentHistory'] != null) {
      paymentHistory = <PaymentHistory>[];
      json['paymentHistory'].forEach((v) {
        paymentHistory!.add(new PaymentHistory.fromJson(v));
      });
    }
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['invoiceId'] = this.invoiceId;
    if (this.items != null) {
      data['items'] = this.items!.map((v) => v.toJson()).toList();
    }
    data['gst'] = this.gst;
    data['totalNetAmount'] = this.totalNetAmount;
    data['totalNetAmountAfterDiscount'] = this.totalNetAmountAfterDiscount;
    data['totalDiscount'] = this.totalDiscount;
    data['totalTaxAmount'] = this.totalTaxAmount;
    data['globalDiscount'] = this.globalDiscount;
    data['globalDiscountType'] = this.globalDiscountType;
    data['roundOff'] = this.roundOff;
    data['roundOffAmount'] = this.roundOffAmount;
    data['grandTotal'] = this.grandTotal;
    data['amountPaid'] = this.amountPaid;
    data['partialPaid'] = this.partialPaid;
    data['paymentStatus'] = this.paymentStatus;
    data['paymentMode'] = this.paymentMode;
    data['invoiceDate'] = this.invoiceDate;
    data['dueDate'] = this.dueDate;
    data['paymentDate'] = this.paymentDate;
    data['notes'] = this.notes;
    data['sendSMS'] = this.sendSMS;
    data['bankDetailId'] = this.bankDetailId;
    data['customerId'] = this.customerId;
    data['createdBy'] = this.createdBy;
    if (this.paymentHistory != null) {
      data['paymentHistory'] =
          this.paymentHistory!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Items {
  String? productId;
  String? productName;
  int? quantity;
  double? rateUnit;
  double? netAmount;
  double? netAmountAfterDiscount;
  double? taxPrice;
  int? gstPercent;
  Null? discount;
  double? priceWithTax;
  String? sId;

  Items(
      {this.productId,
        this.productName,
        this.quantity,
        this.rateUnit,
        this.netAmount,
        this.netAmountAfterDiscount,
        this.taxPrice,
        this.gstPercent,
        this.discount,
        this.priceWithTax,
        this.sId});

  Items.fromJson(Map<String, dynamic> json) {
    productId = json['productId'];
    productName = json['productName'];
    quantity = json['quantity'];
    rateUnit = json['rateUnit'];
    netAmount = json['netAmount'];
    netAmountAfterDiscount = json['netAmountAfterDiscount'];
    taxPrice = json['taxPrice'];
    gstPercent = json['gstPercent'];
    discount = json['discount'];
    priceWithTax = json['priceWithTax'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['productId'] = this.productId;
    data['productName'] = this.productName;
    data['quantity'] = this.quantity;
    data['rateUnit'] = this.rateUnit;
    data['netAmount'] = this.netAmount;
    data['netAmountAfterDiscount'] = this.netAmountAfterDiscount;
    data['taxPrice'] = this.taxPrice;
    data['gstPercent'] = this.gstPercent;
    data['discount'] = this.discount;
    data['priceWithTax'] = this.priceWithTax;
    data['_id'] = this.sId;
    return data;
  }
}

class PaymentHistory {
  int? amount;
  String? mode;
  String? date;
  String? notes;
  bool? sendSMS;

  PaymentHistory({this.amount, this.mode, this.date, this.notes, this.sendSMS});

  PaymentHistory.fromJson(Map<String, dynamic> json) {
    amount = json['amount'];
    mode = json['mode'];
    date = json['date'];
    notes = json['notes'];
    sendSMS = json['sendSMS'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['amount'] = this.amount;
    data['mode'] = this.mode;
    data['date'] = this.date;
    data['notes'] = this.notes;
    data['sendSMS'] = this.sendSMS;
    return data;
  }
}
