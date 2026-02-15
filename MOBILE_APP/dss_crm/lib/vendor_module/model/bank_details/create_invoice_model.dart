class VendorCreateInvoiceModelResponse {
  bool? success;
  String? message;
  Data? data;

  VendorCreateInvoiceModelResponse({this.success, this.message, this.data});

  VendorCreateInvoiceModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? invoiceId;
  List<Items>? items;
  int? gst;
  int? totalNetAmount;
  int? totalNetAmountAfterDiscount;
  int? totalDiscount;
  int? totalTaxAmount;
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
  String? dueDate;
  String? paymentDate;
  String? notes;
  bool? sendSMS;
  bool? bankDetailId;
  String? customerId;
  String? createdBy;
  String? sId;
  List<String>? paymentHistory;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.invoiceId,
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
        this.sId,
        this.paymentHistory,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
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
    sId = json['_id'];
    // if (json['paymentHistory'] != null) {
    //   paymentHistory = <Null>[];
    //   json['paymentHistory'].forEach((v) {
    //     paymentHistory!.add(new Null.fromJson(v));
    //   });
    // }
    createdBy = json['paymentHistory'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
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
    data['_id'] = this.sId;
    // if (this.paymentHistory != null) {
    //   data['paymentHistory'] =
    //       this.paymentHistory!.map((v) => v.toJson()).toList();
    // }
    data['paymentHistory'] = this.paymentHistory;
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
  int? rateUnit;
  int? netAmount;
  int? netAmountAfterDiscount;
  int? taxPrice;
  int? gstPercent;
  int? discount;
  int? priceWithTax;
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
